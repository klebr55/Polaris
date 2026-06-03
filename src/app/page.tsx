import { Suspense } from "react";
import ComparisonSection from "../components/modules/ComparisonSection";
import DataErrorBoundary from "../components/modules/DataErrorBoundary";
import EducationSection from "../components/modules/EducationSection";
import EducationSkeleton from "../components/modules/EducationSkeleton";
import HeroSection from "../components/modules/HeroSection";
import InternetAccessCard from "../components/modules/InternetAccessCard";
import InternetAccessSkeleton from "../components/modules/InternetAccessSkeleton";
import LegacyFooter from "../components/modules/LegacyFooter";
import ServiceErrorFallback from "../components/modules/ServiceErrorFallback";
import EpilogueSection from "../components/modules/EpilogueSection";

import {
  fetchPnadTicInternetAccessMatoGrosso,
  fetchMatoGrossoDigitalDivide,
  fallbackDigitalDivideMT,
} from "../services/sidra";

import type { InternetAccessSeries } from "../services/sidra";

import type { MatoGrossoDigitalDivideData } from "../types/digitalDivide";

const FALLBACK_INTERNET: InternetAccessSeries = {
  indicator: "Percentual de domicilios particulares permanentes com acesso a internet",
  territory: { code: "51", name: "Mato Grosso" },
  unit: "%",
  points: [
    { period: "2016", value: 56.2 },
    { period: "2017", value: 61.8 },
    { period: "2018", value: 68.4 },
    { period: "2019", value: 73.1 },
    { period: "2020", value: 79.6 },
    { period: "2021", value: 84.3 },
    { period: "2022", value: 87.9 },
    { period: "2023", value: 90.2 },
  ],
};


interface PolarisPageData {
  internetSeries: InternetAccessSeries;
  digitalDivideData: MatoGrossoDigitalDivideData;
}

async function loadPolarisData(): Promise<PolarisPageData> {
  const [internetResult, divideResult] = await Promise.allSettled([
    fetchPnadTicInternetAccessMatoGrosso(),
    fetchMatoGrossoDigitalDivide(),
  ]);

  const internetSeries =
    internetResult.status === "fulfilled"
      ? internetResult.value
      : FALLBACK_INTERNET;

  const digitalDivideData =
    divideResult.status === "fulfilled"
      ? divideResult.value
      : fallbackDigitalDivideMT;

  return {
    internetSeries,
    digitalDivideData,
  };
}

async function PolarisPageContent() {
  const data = await loadPolarisData();

  return (
    <>
      <HeroSection>
        <InternetAccessCard series={data.internetSeries} />
      </HeroSection>

      <ComparisonSection data={data.digitalDivideData} />

      <EducationSection data={data.digitalDivideData} />
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <HeroSection>
        <InternetAccessSkeleton />
      </HeroSection>

      <ComparisonSection data={fallbackDigitalDivideMT} />

      <EducationSkeleton />
    </>
  );
}

export default function HomePage() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col gap-16 pb-16 scroll-smooth sm:gap-24">
      <DataErrorBoundary
        fallback={
          <ServiceErrorFallback
            title="Dados do IBGE indisponíveis"
            message="O SIDRA não respondeu a tempo. Os dados históricos de referência estão sendo exibidos. A atualização ocorrerá automaticamente quando o serviço retornar."
          />
        }
      >
        <Suspense fallback={<PageSkeleton />}>
          <PolarisPageContent />
        </Suspense>
      </DataErrorBoundary>

      <EpilogueSection />

      <LegacyFooter />
    </main>
  );
}
