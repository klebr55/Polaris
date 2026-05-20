import { Suspense, use } from "react";
import ComparisonSection from "../components/modules/ComparisonSection";
import EducationSection from "../components/modules/EducationSection";
import EducationSkeleton from "../components/modules/EducationSkeleton";
import HeroSection from "../components/modules/HeroSection";
import InternetAccessCard from "../components/modules/InternetAccessCard";
import InternetAccessSkeleton from "../components/modules/InternetAccessSkeleton";
import LegacyFooter from "../components/modules/LegacyFooter";
import {
  fetchPnadTicInternetAccessMatoGrosso,
  fetchPnadTicEducationAccessMatoGrosso,
} from "../services/sidra";

function InternetAccessCardData() {
  const series = use(fetchPnadTicInternetAccessMatoGrosso());
  return <InternetAccessCard series={series} />;
}

function EducationSectionData() {
  const series = use(fetchPnadTicEducationAccessMatoGrosso());
  return <EducationSection series={series} />;
}

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col gap-32 pb-0 scroll-smooth">
      <HeroSection>
        <Suspense fallback={<InternetAccessSkeleton />}>
          <InternetAccessCardData />
        </Suspense>
      </HeroSection>

      <ComparisonSection />

      <Suspense fallback={<EducationSkeleton />}>
        <EducationSectionData />
      </Suspense>

      <LegacyFooter />
    </main>
  );
}
