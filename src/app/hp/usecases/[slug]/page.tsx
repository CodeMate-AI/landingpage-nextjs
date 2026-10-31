import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hpUsecases } from "../../config/hpData";

type UsecasePageProps = {
  params: Promise<{ slug: string }>;
};

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
    // These pages only have a hero until their content is added.
    robots: { index: false, follow: true },
  };
}

export default async function UsecasePage({ params }: UsecasePageProps) {
  const { slug } = await params;
  const usecase = hpUsecases.find((item) => item.slug === slug);
  if (!usecase) notFound();

  return (
    <div className="relative min-h-dvh bg-white flex flex-col items-start p-0">
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-divider/60 h-18 md:h-22 flex flex-col justify-center">
        <div className="max-w-340 mx-auto w-full px-6 sm:px-10 h-17 md:h-20 flex items-center">
          <Link href="/hp" className="shrink-0 flex items-center transition-opacity hover:opacity-90">
            <Image
              src="/HPxCodeMateAI_LOGO_NAV.png"
              alt="HP x CodeMate AI"
              width={210}
              height={70}
              priority
              unoptimized
              className="w-43 h-14.5 md:w-52.5 md:h-17.5 object-contain"
            />
          </Link>
        </div>
      </nav>

      <section className="relative w-full bg-[#EBF3FF] border-b border-divider/60 overflow-hidden min-h-120 lg:h-130 flex items-center">
        <div
          className="hidden lg:block absolute top-0 right-0 h-full w-[54%] z-0 overflow-hidden pointer-events-none"
          style={{ clipPath: "polygon(190px 0, 100% 0, 100% 100%, 0 100%)" }}
        >
          <Image src={usecase.image} alt="" fill sizes="55vw" priority className="object-cover object-center" />
        </div>

        <div className="max-w-340 mx-auto w-full px-6 sm:px-10 py-10 lg:py-0 z-10 flex flex-col">
          <div className="w-full lg:w-[48%] max-w-2xl flex flex-col items-start text-left gap-6">
            <Link
              href="/hp#usecases"
              aria-label="Back to usecases"
              className="flex items-center justify-center w-10 h-10 -ml-2 text-black hover:text-accent-blue transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0 6-6m-6 6 6 6" />
              </svg>
            </Link>
            <h1 className="font-heading font-normal text-[38px] leading-10.5 sm:text-[44px] sm:leading-12.5 lg:text-[48px] lg:leading-13 text-black m-0 tracking-[1px]">
              Software Applications for {usecase.name}
            </h1>
          </div>

          <div className="block lg:hidden w-full mt-8 relative h-65 sm:h-95 overflow-hidden rounded-xl border border-[#E2E8F0] shadow-sm">
            <Image src={usecase.image} alt="" fill sizes="(max-width: 1024px) 100vw, 680px" priority className="object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
