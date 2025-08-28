import styles from "@/styles/style";
import { discount, robot } from "@/public/assets";
import GetStarted from "./GetStarted";
// import Image from "next/image";
import { CodeMateDark } from "@/public/assets";
import { SafariDemo } from "./HeroVideo";
import { BlurFade } from "./magicui/blur-fade";
import { Sparkles } from "./Sparkles";
import Image from "next/image";
import { FloatingDockDemo } from "./Navbar2";

const Hero: React.FC = () => (
  <BlurFade delay={0.25} inView>
    <section id="home" className={`flex md:flex-row flex-col h-full md:h-screen ${styles.paddingY}`}>
      <div className={`w-[100%] md:w-[45%] flex-row justify-center  xl:px-0 sm:px-8 px-6`}>
        {/* Beta Access Banner */}
        {/* <div className="flex flex-row items-center py-[8px] pr-8 pl-4 bg-discount-gradient rounded-lg mb-4 gap-2 ">
        <Image src={discount} alt="discount" className="w-[32px] h-[32px]" />
        <p className={`${styles.paragraph} motion-reduce:animate-pulse ml-2`}>
          <span className="text-white font-semibold">Limited Time</span>{" "}
          <span className="text-dimWhite">Beta Access</span>{" "}
          <span className="text-white font-semibold">Now Open</span>
        </p>
      </div> */}

        {/* <div className="absolute bottom-[20%] hidden ss:block right-[5%] animate-float-slow">
          <div className="bg-gradient-to-r from-teal-500/20 to-blue-500/20 p-3 rounded-lg backdrop-blur-sm">
            <span className="text-sm text-teal-400">🚀 AI-Powered Learning</span>
          </div>
        </div>
        <div className="absolute top-4 hidden ss:block left-[40%] animate-float-slow">
          <div className="bg-gray-800/50 p-3 rounded-lg backdrop-blur-sm ">
            <span className="text-sm text-teal-400">⚡️ Live Code Execution</span>
          </div>
        </div>
        <div className="absolute top-4 hidden ss:block right-[5%]">
          <div className="bg-gray-800/50 p-3 rounded-lg backdrop-blur-sm ">
            <span className="text-sm text-purple-400">🤖 AI Assistant</span>
          </div>
        </div> */}

        {/* Main Hero Content */}
        <div className="flex flex-col justify-between w-full gap-5">
          {/* Primary Heading */}
          <Sparkles
            density={200}
            size={1.0}
            direction='top'
            className='absolute inset-x-0 top-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]'
          />

           
          <div className="flex flex-col md:mt-10">
            <h1 className="font-[Montserrat] font-normal ss:text-[46px] text-[25px] text-white ss:leading-[20px] mt-0 md:mt-10 leading-[50px] tracking-normal">
            Your AI-powered
            </h1>
            <h1 className="font-[Montserrat] font-bold ss:text-[56px] text-[35px] mt-0 md:mt-10 leading-[60px]  bg-gradient-to-r from-[#00C2FF] to-white  text-transparent bg-clip-text">
            Coding Companion
            </h1>
            {/* <h1 className="font-[Montserrat] font-semibold ss:text-[40px] text-[25px] text-white italic ss:leading-[20px] md:mt-10 leading-[30px] tracking-normal">
              with
            </h1> */}
            {/* <span className="bg-gray-900 font-[Montserrat] px-2 py-1 rounded-lg underline underline-offset-4"></span> */}
            {/* <span className="text-gradient ss:text-[82px] text-[50px] inline-block md:my-2 w-[80%] md:w-[100%]">
              <img src={"/CodeMateDark.png"} alt="CodeMate" width={400} height={100} />
            </span>{" "} */}
            <br className="sm:block hidden" />
            {/* <span className="ss:text-[64px] text-[36px]">Education</span> */}
            {/* </h1> */}
          </div>

          {/* Feature Highlights */}
          <div className="flex flex-col gap-6 mb-8 -mt-5 max-w-[600px]">
            <p className={`${styles.paragraph} text-md md:text-xl leading-[24px] font-medium tracking-normal`}>
              {/* Master programming, develop Industry-ready skills, and Accelerate your career with: */}
              {/* The complete coding education platform that empowers both learners and educators. Experience seamless learning and teaching with our AI-powered solutions. */}
              Transform your coding journey with AI-powered personalized learning paths, interactive practice environments, and seamless classroom collaboration.
            </p>

          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-start justify-start gap-0">
            <div className="ss:flex hidden">
              <GetStarted />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image Section */}
      <div className={`w-[100%] md:w-[55%] flex ${styles.flexCenter} max-h-[500px]  md:my-0 pr-4 md:pr-10 px-10 pl-4 justify-center relative`}>
        <SafariDemo />
        {/* Gradient Effects */}
        {/* <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
      <div className="absolute z-[1] w-[80%] h-[80%] rounded-full bottom-40 white__gradient" />
      <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" /> */}
      </div>

      {/* Mobile CTA */}
      <div className={`${styles.flexCenter} ss:hidden mt-6`}>
        <GetStarted />
      </div>
    </section>
  </BlurFade>
);

export default Hero;
