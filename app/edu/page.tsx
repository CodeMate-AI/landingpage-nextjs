"use client"
import styles from "@/styles/style";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import Stats from "../../components/Stats";
import Business from "../../components/Business";
import Billing from "../../components/Billing";
import CardDeal from "../../components/CardDeal";
import Testimonials from "../../components/Testimonials";
import Clients from "../../components/Clients";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";
import { Sparkles } from "@/components/Sparkles";
import StudentFeatures from "@/components/StudentFeatures";
import GuestFeatures from "@/components/GuestFeatures";
import TeacherFeatures from "@/components/TeacherFeatures";
import SimpleTestimonialCarousel from "@/components/Testimonials copy";
import AnimatedLogoCloud from "@/components/AnimatedLogoCloud";
import AnimatedRecognitionCloud from "@/components/AnimatedRecognitionCloud";
import { OrbitingCirclesIcons } from "@/components/OrbitingIcons";
import ScrollToTop from "@/components/ScrollToTop";
import MetricsComponent from "@/components/MetricsComponent";
import CodemateForOrg from "@/components/CodemateForOrg";
import FeatureSection from "@/components/Features2";
import GlowButton from "@/components/GlowButton";
const Home: React.FC = () => {
  return (
    <>
      <div className="bg-primary w-full overflow-hidden">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
        </div>
        <div className={`bg-primary ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Hero />
          </div>
        </div>
        <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            {/* <Stats /> */}
            <ScrollToTop />
            <FeatureSection />
            <div className="mt-10"></div>
            {/* <TeacherFeatures/>
            <div className="mt-10"></div>
            <GuestFeatures /> */}
            <MetricsComponent />
            {/* <OrbitingCirclesIcons /> */}
            <SimpleTestimonialCarousel />
            {/* <AnimatedLogoCloud />
            <AnimatedRecognitionCloud/> */}
            {/* <Business />
            <Billing />
            <CardDeal />
            <Testimonials />
            <Clients /> */}
            <CodemateForOrg />
            <div id="contactus" className="mt-16 text-white py-16">
              <div className="text-center">
                <div className="max-w-2xl mx-auto px-4">
                  <div className="mb-6">
                    {/* <h4 className="text-[2rem] leading-tight font-semibold tracking-tight m-0 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> */}
                    <h4 className="text-[2rem] leading-tight font-semibold tracking-tight m-0  text-white">
                      Still have questions?
                    </h4>
                  </div>
                  <p className="text-lg text-gray-300 mb-8">
                    Get in touch with our team.
                  </p>
                  <div className="mt-8">
                    <a 
                      href="mailto:contact@codemate.ai" 
                      className="w-fit"
                    >
                      <GlowButton text="Contact Us" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* <CTA /> */}
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;