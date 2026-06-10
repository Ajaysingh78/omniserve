import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import TrustedBy from "../components/landing/TrustedBy";
import FeaturesSection from "../components/landing/FuturesSection";
import DashboardShowcase from "../components/landing/DashboardShowcase";
import BenefitsSection from "../components/landing/BenefitSection";
import TestimonialsSection from "../components/landing/TestimonialSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white ">
      <Navbar />
      <HeroSection />
      <TrustedBy />
      <FeaturesSection />
      <DashboardShowcase />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}