import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles, { layout } from "@/styles/style";
import { teacherFeatures } from "@/constants";
import Button from "./Button";
import Image from "next/image";
import GlowButton from "./GlowButton";

const FeaturesCard = ({ icon, title, content, index }: any) => {
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
      className={`flex flex-row p-6 rounded-[20px] ${index !== teacherFeatures.length - 1 ? "mb-0" : "mb-0"} feature-card`}
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

const TeacherFeatures: React.FC = () => {
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
      className={`${layout.section} md:h-[90vh] h-full`}
    >
      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>
        Empower Your Teaching with AI-Powered Tools <br className="sm:block hidden" />
        </h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Simplify assignment creation, track student progress effortlessly, and generate detailed reports in one click. Codemate AI is designed to help teachers focus on what truly matters—guiding students towards success.
        </p>
        <GlowButton text="Get Started as Teacher"/>
      </div>
      <div className={`${layout.sectionImg} flex-col`}>
        {teacherFeatures.map((feature, index) => (
          <FeaturesCard key={feature.id} {...feature} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default TeacherFeatures;