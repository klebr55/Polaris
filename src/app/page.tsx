import { Suspense, use } from "react";
import ComparisonSection from "../components/modules/ComparisonSection";
import HeroSection from "../components/modules/HeroSection";
import InternetAccessCard from "../components/modules/InternetAccessCard";
import InternetAccessSkeleton from "../components/modules/InternetAccessSkeleton";
import { fetchPnadTicInternetAccessMatoGrosso } from "../services/sidra";

function InternetAccessCardData() {
  const series = use(fetchPnadTicInternetAccessMatoGrosso());
  return <InternetAccessCard series={series} />;
}

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col gap-24 pb-24">
      <HeroSection>
        <Suspense fallback={<InternetAccessSkeleton />}>
          <InternetAccessCardData />
        </Suspense>
      </HeroSection>
      <ComparisonSection />
    </main>
  );
}
