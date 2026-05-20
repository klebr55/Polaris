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
        eyebrow="Ato 2 — A Divisao"
        headline="903 mil km² separam o campo da cidade. A internet encurta essa distancia."
        body="Mato Grosso e o terceiro maior estado do Brasil. Em suas cidades, a fibra otica avanca rapido. Nas fazendas e comunidades rurais, o cenario e outro. Os dados da PNAD TIC revelam a dimensao exata dessa fratura digital — e como ela vem se fechando, ano apos ano."
      />

      <Suspense fallback={<ComparisonSection />}>
        <ComparisonSectionData />
      </Suspense>

      <StoryBlock
        eyebrow="Ato 3 — A Transformacao"
        headline="Quando um estudante se conecta, o futuro de uma geracao inteira muda."
        body="A conectividade digital entre estudantes mato-grossenses nao e apenas uma estatistica — e o indicador que separa o acesso ao conhecimento do isolamento informacional. Cada ponto percentual neste grafico representa milhares de jovens que passaram a ter acesso a pesquisa, ensino remoto e oportunidades antes inalcancaveis."
      />

      <Suspense fallback={<EducationSkeleton />}>
        <EducationSectionData />
      </Suspense>

      <LegacyFooter />
    </main>
  );
}
