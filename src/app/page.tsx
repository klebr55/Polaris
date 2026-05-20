import { Suspense } from "react";
import ComparisonSection from "../components/modules/ComparisonSection";
import EducationSection from "../components/modules/EducationSection";
import EducationSkeleton from "../components/modules/EducationSkeleton";
import HeroSection from "../components/modules/HeroSection";
import InternetAccessCard from "../components/modules/InternetAccessCard";
import InternetAccessSkeleton from "../components/modules/InternetAccessSkeleton";
import LegacyFooter from "../components/modules/LegacyFooter";
import ServiceErrorFallback from "../components/modules/ServiceErrorFallback";
import {
  fetchPnadTicInternetAccessMatoGrosso,
  fetchPnadTicEducationAccessMatoGrosso,
  fetchUrbanRuralAccess,
} from "../services/sidra";

async function InternetAccessCardData() {
  try {
    const series = await fetchPnadTicInternetAccessMatoGrosso();
    return <InternetAccessCard series={series} />;
  } catch {
    return (
      <ServiceErrorFallback
        title="Dados de Internet indisponiveis"
        message="O IBGE SIDRA nao respondeu a tempo. Os dados serao carregados automaticamente quando o servico retornar."
      />
    );
  }
}

async function EducationSectionData() {
  try {
    const series = await fetchPnadTicEducationAccessMatoGrosso();
    return <EducationSection series={series} />;
  } catch {
    return (
      <ServiceErrorFallback
        title="Dados de Educacao indisponiveis"
        message="O IBGE SIDRA nao respondeu a tempo. Os dados serao carregados automaticamente quando o servico retornar."
      />
    );
  }
}

async function ComparisonSectionData() {
  try {
    const data = await fetchUrbanRuralAccess();
    return (
      <ComparisonSection
        urbanPercent={data.urbanPercent}
        ruralPercent={data.ruralPercent}
      />
    );
  } catch {
    return <ComparisonSection />;
  }
}

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col gap-32 pb-0 scroll-smooth">
      <HeroSection>
        <Suspense fallback={<InternetAccessSkeleton />}>
          <InternetAccessCardData />
        </Suspense>
      </HeroSection>

      <Suspense fallback={<ComparisonSection />}>
        <ComparisonSectionData />
      </Suspense>

      <Suspense fallback={<EducationSkeleton />}>
        <EducationSectionData />
      </Suspense>

      <LegacyFooter />
    </main>
  );
}

