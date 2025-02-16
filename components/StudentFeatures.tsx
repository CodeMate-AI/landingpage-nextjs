import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles, { layout } from "@/styles/style";
import { features } from "@/constants";
import Button from "./Button";
import Image from "next/image";
import { FeatredCardProps } from "@/types";
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
      className={`flex flex-row p-6 rounded-[20px] ${index !== features.length - 1 ? "mb-0" : "mb-0"} feature-card`}
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

const StudentFeatures: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <>
      <div className="flex flex-row items-center py-[8px] pr-8 pl-4  rounded-lg mb-4 gap-2 ">
        {/* <p className={`${styles.paragraph} motion-reduce:animate-pulse ml-2`}> */}
        <h2 className={styles.heading2 + " text-center md:pb-10 pb-5 md:pt-0 pt-5"}>
          Step Ahead with <span className="text-gradient font-Poppins font-bold text-transparent font-semibold bg-clip-text">CodeMate.ai</span>
        </h2>
        {/* </p> */}
      </div>

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
            Unlock Your Full Coding Potential with Codemate AI <br className="sm:block hidden" />
          </h2>
          <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
            Our platform is designed to support students every step of the way—offering
            personalized guidance, visual progress tracking, and clear, step-by-step roadmaps to become a proficient developer.
          </p>
          <GlowButton text="Get Started as Student" />
        </div>
        <div className={`${layout.sectionImg} flex-col`}>
          {features.map((feature, index) => (
            <FeaturesCard key={feature.id} {...feature} index={index} />
          ))}
        </div>
      </motion.section>
    </>

  );
};

export default StudentFeatures;