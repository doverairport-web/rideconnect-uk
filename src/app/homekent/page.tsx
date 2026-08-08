import { HomeKentBeforeAfter } from "@/components/homekent/HomeKentBeforeAfter";
import { HomeKentCtaBanner } from "@/components/homekent/HomeKentCtaBanner";
import { HomeKentHero } from "@/components/homekent/HomeKentHero";
import { HomeKentPricing } from "@/components/homekent/HomeKentPricing";
import { HomeKentServices } from "@/components/homekent/HomeKentServices";
import { HomeKentTestimonials } from "@/components/homekent/HomeKentTestimonials";
import { HomeKentWhyChoose } from "@/components/homekent/HomeKentWhyChoose";

export default function HomeKentPage() {
  return (
    <>
      <HomeKentHero />
      <HomeKentServices />
      <HomeKentBeforeAfter />
      <HomeKentWhyChoose />
      <HomeKentPricing />
      <HomeKentTestimonials />
      <HomeKentCtaBanner />
    </>
  );
}
