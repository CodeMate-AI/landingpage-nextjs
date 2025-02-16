import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles, { layout } from "@/styles/style";
import { guestFeatures } from "@/constants";
import Button from "./Button";
import Image from "next/image";
import { FeatredCardProps } from "@types";
import GlowButton from "./GlowButton";

const FeaturesCard: React.FC<FeatredCardProps> = ({ icon, title, content, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5, delay: index * 0.3 }}
      className={`flex flex-row p-6 rounded-[20px] ${index !== guestFeatures.length - 1 ? "mb-0" : "mb-0"} feature-card`}
    >
      <div className={`w-[64px] h-[64px] rounded-full bg-dimBlue ${styles.flexCenter}`}>
        <Image src={icon} alt="icon" className="w-[50%] h-[50%] object-contain" />
      </div>
      <div className="flex-1 flex flex-col ml-3">
        <h4 className="font-poppins font-semibold text-white text-[18px] leading-[24px]">
          {title}
        </h4>
        <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px]">
          {content}
        </p>
      </div>
    </motion.div>
  );
};

const GuestFeatures: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      id="features"
      className={`${layout.section}`}
    >
      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>
        Welcome, Guest! Explore Without Limits <br className="sm:block hidden" />
        </h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        You don’t need an account to experience Codemate AI! As a guest, you can access powerful learning tools, practice coding exercises, and explore structured roadmaps—all for free. Start your journey today!
        </p>
        <GlowButton text="Get Started as Guest"/>
      </div>
      <div className={`${layout.sectionImg} flex-col`}>
        {guestFeatures.map((feature, index) => (
          <FeaturesCard key={feature.id} {...feature} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default GuestFeatures;