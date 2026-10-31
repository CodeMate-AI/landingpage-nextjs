import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import HpSubpageFooter from "../../components/HpSubpageFooter";
import HpSubpageNav from "../../components/HpSubpageNav";
import { hpUsecases } from "../../config/hpData";
import { hpUsecaseContent } from "../../config/usecaseContent";
import SoftwareCarousel from "./SoftwareCarousel";

type UsecasePageProps = {
  params: Promise<{ slug: string }>;
};

// Sizes and spacing follow the Figma layer spec at 1440px and scale down below it.
const PAGE_CONTAINER = "max-w-[1440px] mx-auto w-full px-6 sm:px-10 xl:px-[100px]";
const SECTION_INNER = `${PAGE_CONTAINER} flex flex-col gap-6 sm:gap-8 lg:gap-10`;
const SECTION_HEADING =
  "font-heading font-medium text-[32px] sm:text-[36px] lg:text-[40px] leading-[1.025] tracking-[0.02em] text-[#0F1724] m-0";

export function generateStaticParams() {
  return hpUsecases.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: UsecasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const usecase = hpUsecases.find((item) => item.slug === slug);
  if (!usecase) return {};

  return {
    title: `${usecase.name} Usecases | HP x CodeMate AI`,
    description: hpUsecaseContent[slug]?.description,
    // Hidden from search until the pages are ready to launch.
    robots: { index: false, follow: true },
  };
}

export default async function UsecasePage({ params }: UsecasePageProps) {
  const { slug } = await params;
  const usecase = hpUsecases.find((item) => item.slug === slug);
  if (!usecase) notFound();

  const content = hpUsecaseContent[slug];

  return (
    <div className="relative min-h-dvh bg-white flex flex-col items-start p-0">
      <HpSubpageNav />

      {/* Hero: the image box is 964x800 at 1440px, runs 170px off the right edge, and is cropped by the 637px hero */}
      <section className="relative w-full bg-[#E8F3FF] overflow-hidden lg:h-[637.39px] flex items-center">
        <div
          className="hidden lg:block absolute top-0 right-[-11.806%] w-[66.944%] aspect-[964/800] min-h-full z-0 pointer-events-none"
          style={{ clipPath: "polygon(51.73% 0, 100% 0, 100% 100%, 0 100%)" }}
        >
          <div className="absolute inset-x-0 top-0 h-[637.39px]">
            <Image src={usecase.heroImage} alt="" fill sizes="67vw" priority className="object-cover object-center" />
          </div>
        </div>

        <div className={`${PAGE_CONTAINER} py-10 lg:py-0 z-10 flex flex-col`}>
          <div className="w-full lg:w-[42vw] xl:w-[45vw] min-[1440px]:w-[700px] flex flex-col items-start text-left">
            <div className="flex flex-col gap-5 min-[1440px]:gap-[27px] w-full">
              <h1 className="font-heading font-normal text-[38px] leading-[42px] tracking-[1px] sm:text-[44px] sm:leading-[50px] sm:tracking-[2px] xl:text-[56px] xl:leading-[62px] min-[1440px]:text-[64px] min-[1440px]:leading-[70px] min-[1440px]:tracking-[3px] text-black m-0">
                Software Applications for {usecase.name}
              </h1>
              {content && (
                <p className="font-heading font-normal text-base leading-[26px] xl:text-[18px] xl:leading-7 tracking-[0.03em] text-[#575E6A] m-0">
                  {content.description}
                </p>
              )}
            </div>
          </div>

          <div className="block lg:hidden w-full mt-8 relative h-65 sm:h-95 overflow-hidden rounded-xl border border-[#E2E8F0] shadow-sm">
            <Image src={usecase.image} alt="" fill sizes="(max-width: 1024px) 100vw, 680px" priority className="object-cover" />
          </div>
        </div>
      </section>

      {content && (
        <>
          {/* Industry Specific Usecases */}
          <section className="relative w-full bg-white py-10 sm:py-14 lg:py-20 overflow-hidden">
            <div className={SECTION_INNER}>
              <h2 className={SECTION_HEADING}>Industry Specific Usecases</h2>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                {content.usecases.map((item, index) => (
                  <article key={item.title} className="flex flex-col items-start gap-8 lg:gap-10 bg-white border border-[#E2E5EA] rounded-lg p-6">
                    <span className="inline-flex items-center justify-center min-w-11 h-11 p-3 rounded bg-[#E8F3FF] font-heading font-medium text-[20px] leading-none tracking-[1.2px] uppercase text-[#005DE7]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-3 w-full">
                      <h3 className="font-heading font-medium text-[20px] leading-7 tracking-[0.02em] text-[#0F1724] m-0">
                        {item.title}
                      </h3>
                      <p className="font-heading font-normal text-[14px] leading-[22px] tracking-[0.02em] text-[#5A6578] m-0">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            {/* Brand stripes fill the empty grid cells beside the seventh card */}
            <div className="hidden lg:block absolute bottom-0 left-1/2 w-full max-w-[1440px] -translate-x-1/2 pointer-events-none">
              <svg
                className="absolute bottom-0 right-5 w-[28%] xl:right-[80.25px] xl:w-[365.75px] h-auto"
                viewBox="1094 1629 365.75 288.5"
                fill="#004CE0"
                aria-hidden="true"
              >
                <path d="M1307.5 1629H1201L1094 1917.5H1205L1307.5 1629Z" />
                <path d="M1297.5 1917.5H1408.5L1459.75 1773.25H1351L1297.5 1917.5Z" />
              </svg>
            </div>
          </section>

          {/* Benefits */}
          <section className="w-full bg-[#F7F8FA] py-10 sm:py-14 lg:py-[60px]">
            <div className={SECTION_INNER}>
              <h2 className={SECTION_HEADING}>Benefits</h2>
              <ul className="w-full max-w-[1200px] bg-white border border-[#E2E5EA] rounded-lg divide-y divide-[#E2E5EA] list-none m-0 p-0">
                {content.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start sm:items-center gap-4 sm:gap-5 px-5 sm:px-8 py-6">
                    <span className="w-2 h-2 rounded-full bg-[#0096D6] shrink-0 mt-2 sm:mt-0" aria-hidden="true" />
                    <span className="font-heading font-normal text-[16px] leading-[23px] tracking-[0.01em] text-[#0F1724]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Softwares Developed using CodeMate */}
          <section className="w-full bg-white py-10 sm:py-14 lg:py-20 overflow-hidden">
            <div className={SECTION_INNER}>
              <h2 className={SECTION_HEADING}>Softwares Developed using CodeMate</h2>
              <SoftwareCarousel softwares={content.softwares} />
            </div>
          </section>
        </>
      )}

      <HpSubpageFooter />
    </div>
  );
}
