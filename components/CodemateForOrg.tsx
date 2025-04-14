import { ArrowRight } from "lucide-react"
import GlowButton from "./GlowButton"

export default function CodemateForOrg() {
  return (
    <section id="organization" className="w-full  text-white py-16 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight"><span className="text-gradient font-Poppins text-transparent font-bold bg-clip-text">CodeMate</span> for Organization</h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
            Streamline your coding classroom with AI-powered assignment management and student performance tracking.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-medium mb-2">Track & Manage</h3>
              <p className="text-gray-400 text-sm">
                Easily track students, assignments, and performance with AI-generated reports.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-medium mb-2">AI-Powered</h3>
              <p className="text-gray-400 text-sm">
                Generate custom coding assignments and get one-click AI assessment reports.
              </p>
            </div>
          </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      <a target="_blank" href="https://edu.codemate.ai/org-signup">
                          <GlowButton text="Get Started as Organization" />
                          </a>
          </div>
        </div>
      </div>
    </section>
  )
}

