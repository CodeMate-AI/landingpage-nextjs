import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Qwen's mark is an SVG file, since react-icons has none
import { ArrowRight } from 'lucide-react';
import { SiMeta, SiNvidia } from 'react-icons/si';
import { FcGoogle } from 'react-icons/fc';

// Mistral's pixel "M": five rows of squares fading from yellow to red, drawn on a 5x5 grid since react-icons has no Mistral mark
const MISTRAL_ROWS: { color: string; columns: number[] }[] = [
  { color: '#FFD800', columns: [0, 4] },
  { color: '#FFAF00', columns: [0, 1, 3, 4] },
  { color: '#FF8205', columns: [0, 1, 2, 3, 4] },
  { color: '#FA500F', columns: [0, 2, 4] },
  { color: '#E10500', columns: [0, 4] },
];

function MistralMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 5 5" className={className} aria-hidden="true">
      {MISTRAL_ROWS.flatMap((row, y) =>
        row.columns.map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={row.color} />),
      )}
    </svg>
  );
}

// Z.ai's mark (the maker of GLM), from @lobehub/icons-static-svg; it is one colour, so it is drawn in currentColor like the react-icons marks
function ZaiMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" className={className} aria-hidden="true">
      <path d="M12.105 2L9.927 4.953H.653L2.83 2h9.276zM23.254 19.048L21.078 22h-9.242l2.174-2.952h9.244zM24 2L9.264 22H0L14.736 2H24z" />
    </svg>
  );
}

// Open-weight model families the Dev Box runs, each with its maker's mark in brand colour; Llama carries Meta's mark.
// The Qwen file in public/logos/models comes from the @lobehub/icons-static-svg package (qwen-color)
const MODEL_PROVIDERS = [
  { name: 'NVIDIA Nemotron', icon: <SiNvidia className="h-5 w-5 text-[#76B900]" aria-hidden="true" /> },
  { name: 'Llama', icon: <SiMeta className="h-5 w-5 text-[#0081FB]" aria-hidden="true" /> },
  { name: 'Gemma', icon: <FcGoogle className="h-5 w-5" aria-hidden="true" /> },
  { name: 'Mistral', icon: <MistralMark className="h-4 w-4" /> },
  { name: 'Qwen', icon: <Image src="/logos/models/qwen.svg" alt="" width={20} height={20} className="h-5 w-5" /> },
  { name: 'GLM', icon: <ZaiMark className="h-4 w-4 text-white" /> },
];

// Closes the /devbox page under the film: the model families the box serves, then one button to the contact page
export default function DevBoxModels() {
  return (
    // Side padding repeats the film copy's --edge steps in DevBoxSection.module.css, so this block starts on the "Sovereign AI" headline's left edge
    <section
      className="bg-[#050505] px-4 pb-20 pt-4 sm:px-8 sm:pb-24 md:px-10 md:pb-28 lg:px-12 xl:px-[90px]"
      aria-labelledby="devbox-models-title"
    >
      <div className="w-full max-w-[720px]">
        <h2
          id="devbox-models-title"
          className="font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-white/50"
        >
          Runs open-weight models
        </h2>
        {/* Six families: two columns on phones, three from sm; names stay on one line, and the 14px phone size with tight gaps keeps "NVIDIA Nemotron" inside its half at 360px */}
        <ul className="mt-5 grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-5">
          {MODEL_PROVIDERS.map((provider) => (
            <li key={provider.name} className="flex items-center gap-2 whitespace-nowrap sm:gap-2.5 text-[14px] text-white/85 sm:text-lg">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">{provider.icon}</span>
              <span translate="no">{provider.name}</span>
            </li>
          ))}
        </ul>
        {/* The four families are examples, not a limit: any open-weight model can run on the box */}
        <p className="mt-5 text-[15px] text-white/55 sm:text-base">Or bring any open-weight model you choose.</p>
        {/* Same white button as the home page's Dev Box teaser, sized to its label and set on the column's left edge under the logos */}
        <Link
          href="/contact"
          className="group mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-8 text-sm font-semibold text-black transition-[background-color,transform] duration-200 hover:bg-neutral-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] md:text-base"
        >
          Talk to Sales
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
