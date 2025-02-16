import { motion } from "framer-motion";

const CTA: React.FC = () => {
  const handleRedirect = () => {
    window.open("https://forms.gle/jeTdFhvNahojyGUY8", "_blank");
  };

  return (
    <section id="product" className="w-full py-16 md:py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50" />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-2xl bg-black/40 border border-gray-800 p-8 md:p-12 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Text content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start Your Coding Journey Today
              </h2>
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-6">
                Experience personalized learning with AI-powered guidance, structured roadmaps, and hands-on practice.
              </p>
              
              {/* Features list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {[
                  "Codemate AI Mentor",
                  "Interactive Roadmaps",
                  "One Click Report Generation",
                  "Comprehensive Support"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <svg 
                      className="w-5 h-5 text-blue-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col items-center md:items-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRedirect}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 
                  hover:from-blue-600 hover:to-blue-700 text-white font-semibold 
                  rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all 
                  duration-200 text-lg"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;