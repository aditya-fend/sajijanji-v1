import CTASection from "@/components/sections/cta";
import FAQSection from "@/components/sections/faq";
import HeroSection from "@/components/sections/hero";
import InvitationThemes from "@/components/sections/invitation-themes";
import TestimonialSection from "@/components/sections/testimonial";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <InvitationThemes />
      <TestimonialSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}