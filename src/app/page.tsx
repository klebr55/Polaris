import { Suspense } from "react";
import ComparisonSection from "../components/modules/ComparisonSection";
import EducationSection from "../components/modules/EducationSection";
import EducationSkeleton from "../components/modules/EducationSkeleton";
import HeroSection from "../components/modules/HeroSection";
import InternetAccessCard from "../components/modules/InternetAccessCard";
import InternetAccessSkeleton from "../components/modules/InternetAccessSkeleton";
import LegacyFooter from "../components/modules/LegacyFooter";
import ServiceErrorFallback from "../components/modules/ServiceErrorFallback";
import StoryBlock from "../components/modules/StoryBlock";
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
    <main className="flex min-h-screen flex-col gap-24 pb-0 scroll-smooth sm:gap-32">
      <HeroSection>
        <Suspense fallback={<InternetAccessSkeleton />}>
          <InternetAccessCardData />
        </Suspense>
      </HeroSection>

      <StoryBlock
        eyebrow="Ato 2 — O Abismo"
        headline="O lockdown revelou que nem todo Mato Grosso estava conectado ao mesmo mundo."
        body="Quando o isolamento social começou, as cidades migraram para o home office em dias. Nas zonas rurais, o silencio foi outro: sem conectividade, produtores, famílias e comunidades ficaram à margem da economia e da informação. A pandemia não criou esse abismo — ela apenas o iluminou com uma crudeza impossivel de ignorar."
      />

      <Suspense fallback={<ComparisonSection />}>
        <ComparisonSectionData />
      </Suspense>

      <StoryBlock
        eyebrow="Ato 3 — O Resgate"
        headline="Estudante sem internet em 2020 era estudante sem escola. Sem futuro."
        body="Com as salas de aula fechadas, a tela se tornou o único ambiente de aprendizado. Mas para milhares de jovens mato-grossenses, a conexão não existia ou era insuficiente. Cada ponto percentual deste gráfico representa uma batalha travada em silencio por alunos e famílias contra o apagão educacional imposto pelo vírus."
      />

      <Suspense fallback={<EducationSkeleton />}>
        <EducationSectionData />
      </Suspense>

      <LegacyFooter />
    </main>
  );
}
