'use client'

import { FaXTwitter, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa6";
import { motion } from 'framer-motion';

const EVAL_PROMPT = `As a senior software engineer, evaluating AI developer tools, I'd like an objective overview of CodeMate AI, including what it is, the problems it solves, and how it supports the Software Development Lifecycle (SDLC). Explain its core products (such as Build, CORA, AI Debugging, PR Review, Knowledge Base, and other key capabilities), how they work together, who the platform is best suited for, and its deployment options. Also provide a high-level comparison with other AI developer tools, focusing on differences in approach, workflows, and typical use cases rather than ranking them. Base the answer primarily on the official CodeMate website (https://codemate.ai) and documentation (https://docs.codemate.ai), and avoid making assumptions about capabilities that are not explicitly documented.`;

function ChatGPTIcon() {
  return (
    <svg className="w-6 h-6 text-black group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg className="w-6 h-6 group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" fill="#D97757" />
    </svg>
  );
}

function GrokIcon() {
  return (
    <svg className="w-6 h-6 text-white group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815" />
    </svg>
  );
}

function PerplexityIcon() {
  return (
    <svg className="w-6 h-6 text-white group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.786 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.349H13.46l6.105 5.54v2.655zm-8.982-8.28H2.59v8.195h1.8v-2.576l6.192-5.62zM5.475 2.476v4.71h5.115l-5.115-4.71zm13.219 0l-5.115 4.71h5.115v-4.71z" />
    </svg>
  );
}

function GeminiIcon() {
  return (
    <svg className="w-6 h-6 group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="#3186FF" />
      <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#gemini-gradient-0)" />
      <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#gemini-gradient-1)" />
      <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#gemini-gradient-2)" />
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="gemini-gradient-0" x1="7" x2="11" y1="15.5" y2="12">
          <stop stopColor="#08B962" />
          <stop offset="1" stopColor="#08B962" stopOpacity="0" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="gemini-gradient-1" x1="8" x2="11.5" y1="5.5" y2="11">
          <stop stopColor="#F94543" />
          <stop offset="1" stopColor="#F94543" stopOpacity="0" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id="gemini-gradient-2" x1="3.5" x2="17.5" y1="13.5" y2="12">
          <stop stopColor="#FABC12" />
          <stop offset=".46" stopColor="#FABC12" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Footer() {
  return (
    <motion.footer className="relative text-gray-200 pb-0 pt-16 overflow-hide bg-[#121214] border-t-[1px] border-zinc-800/80 rounded-t-[3rem] z-[999999] lg:z-[9999999999]">
      <motion.div className="w-full max-w-7xl px-6 md:px-10 mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-16">
        {/* Left: Brand Column */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div>
            <img src="/codemateLogo.svg" alt="codemate Logo" className="w-auto h-20 -ml-10" />
          </div>
          <p className="text-zinc-400 text-sm md:text-base max-w-sm leading-relaxed -mt-4">
            CodeMate AI, your smart coding partner. Review, debug, and complete code faster with AI-powered assistance.
          </p>

          {/* Socials */}
          <div className="flex gap-4 items-center">
            <a href="https://twitter.com/codemateai" target="_blank" rel="noopener noreferrer" aria-label="X" className="text-zinc-400 hover:text-white transition-colors duration-200">
              <FaXTwitter size={24} className="md:w-7 md:h-7" />
            </a>
            <a href="https://www.linkedin.com/company/codemateai/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-zinc-400 hover:text-white transition-colors duration-200">
              <FaLinkedin size={24} className="md:w-7 md:h-7" />
            </a>
            <a href="https://www.instagram.com/codemateai" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-zinc-400 hover:text-white transition-colors duration-200">
              <FaInstagram size={24} className="md:w-7 md:h-7" />
            </a>
            <a href="https://www.youtube.com/@codemateai" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-zinc-400 hover:text-white transition-colors duration-200">
              <FaYoutube size={24} className="md:w-7 md:h-7" />
            </a>
          </div>

          {/* Ask AI Section */}
          <div className="mt-4">
            <h4 className="font-semibold text-zinc-400 text-xs md:text-sm uppercase tracking-wider mb-3">
              Ask AI for summary of CodeMate AI
            </h4>
            <div className="flex flex-wrap gap-3 items-center">
              <a
                href={`https://chatgpt.com/?q=${encodeURIComponent(EVAL_PROMPT)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:scale-110 transition-all duration-300 shadow-md group border border-zinc-700"
                title="Ask ChatGPT"
                aria-label="Ask ChatGPT"
              >
                <ChatGPTIcon />
              </a>
              <a
                href={`https://claude.ai/new?q=${encodeURIComponent(EVAL_PROMPT)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:scale-110 transition-all duration-300 shadow-md group border border-zinc-700"
                title="Ask Claude"
                aria-label="Ask Claude"
              >
                <ClaudeIcon />
              </a>
              <a
                href={`https://grok.com/?q=${encodeURIComponent(EVAL_PROMPT)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-black hover:scale-110 transition-all duration-300 shadow-md group border border-zinc-700"
                title="Ask Grok"
                aria-label="Ask Grok"
              >
                <GrokIcon />
              </a>
              <a
                href={`https://www.google.com/search?udm=50&aep=11&q=${encodeURIComponent(EVAL_PROMPT)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:scale-110 transition-all duration-300 shadow-md group border border-zinc-700"
                title="Ask Gemini"
                aria-label="Ask Gemini"
              >
                <GeminiIcon />
              </a>
              <a
                href={`https://www.perplexity.ai/?q=${encodeURIComponent(EVAL_PROMPT)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-black hover:scale-110 transition-all duration-300 shadow-md group border border-zinc-700"
                title="Ask Perplexity"
                aria-label="Ask Perplexity"
              >
                <PerplexityIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Right Columns (Spans 7 cols - grid split into 3 sub-columns) */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 pt-4 md:pt-12">
          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm md:text-base">COMMUNITY</h4>
            <ul className="space-y-3 text-xs md:text-sm">
              <li><a href="https://www.instagram.com/codemateai" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-200 hover:underline">Instagram</a></li>
              <li><a href="https://www.linkedin.com/company/codemateai/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-200 hover:underline">Linkedin</a></li>
              <li><a href="https://twitter.com/codemateai" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-200 hover:underline">Twitter</a></li>
              <li><a href="https://www.youtube.com/@codemateai" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-200 hover:underline">YouTube</a></li>
            </ul>
          </div>

          {/* Others */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm md:text-base">OTHERS</h4>
            <ul className="space-y-3 text-xs md:text-sm">
              <li><a href="/contact" className="text-zinc-400 hover:text-white transition-colors duration-200 hover:underline">Contact Us</a></li>
              <li><a href="https://docs.codemate.ai" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-200 hover:underline">Docs</a></li>
              <li><a href="https://huggingface.co/codemateai/CodeMate-v0.1" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-200 hover:underline">Hugging Face</a></li>
              <li><a href="https://docs.codemate.ai/policies/refund-policy" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-200 hover:underline">Refund Policy</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm md:text-base">LEGAL</h4>
            <ul className="space-y-3 text-xs md:text-sm">
              <li><a href="https://docs.codemate.ai/faqs/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-200 hover:underline">Privacy Policy</a></li>
              <li><a href="https://docs.codemate.ai/faqs/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors duration-200 hover:underline">Terms of Service</a></li>
              <li><img src="https://drive.codemate.ai/iso.png" alt="" className="object-fit size-24 mt-5 invert brightness-0 opacity-80" /></li>
            </ul>
          </div>
        </div>

      </motion.div>
    </motion.footer>
  );
}

export default Footer;
