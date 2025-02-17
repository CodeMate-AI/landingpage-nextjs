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
            <StudentFeatures />
            <div className="mt-10"></div>
            <TeacherFeatures/>
            <div className="mt-10"></div>
            <GuestFeatures />

            {/* <OrbitingCirclesIcons /> */}
            <SimpleTestimonialCarousel />
            <AnimatedLogoCloud />
            <AnimatedRecognitionCloud/>
            {/* <Business />
            <Billing />
            <CardDeal />
            <Testimonials />
            <Clients /> */}
            <CTA />
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;