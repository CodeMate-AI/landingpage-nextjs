import React from 'react';
import { LineChart, Code, GitBranch } from 'lucide-react';

// Individual Feature Component
interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {

      return (
        <div className="py-12 border-b border-gray-800">
          <div className="flex flex-col md:flex-row gap-8 max-w-full mx-auto">
            {/* Larger GIF container */}
            <div className="w-full md:w-1/2 aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-6 md:mb-0 min-h-64">
              {/* Placeholder for GIF/Image */}
              <img src="/api/placeholder/480/270" alt="placeholder" className="rounded-lg" />
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
              <p className="text-gray-400 text-base leading-relaxed">{description}</p>
            </div>
          </div>
        </div>
      );
    };
    
    // Main Component with Three Features
    const FeatureSection = () => {
      const features = [
        {
          icon: <Code className="text-green-500" size={24} />,
          title: "AI Coding Assistant",
          description: "Get instant hints and tailored feedback on your assignments. Our AI assistant acts as your personal guide, helping you overcome coding challenges and deepen your understanding of complex concepts."
        },
        {
          icon: <LineChart className="text-blue-500" size={24} />,
          title: "Interactive Activity Graph",
          description: "Visualize your daily progress with our dynamic activity graph. Track your submission rate and identify trends in your learning habits, empowering you to optimize your study routine."
        },
        {
          icon: <GitBranch className="text-pink-500" size={24} />,
          title: "Step-by-Step Roadmaps",
          description: "Follow expertly curated learning paths designed to transform you into a better developer. Our structured roadmaps break down complex skills into manageable steps, ensuring steady and consistent growth."
        }
      ];
    
      return (
          <div className=" min-h-screen">
               <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white text-center my-5 mt-10">What<span className="text-gradient font-Poppins text-transparent font-bold bg-clip-text ">{ " CodeMate "}</span> Offers</h1>
          <div className="container mx-auto px-4">
            {features.map((feature, index) => (
              <FeatureItem 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      );
    };
    
    export default FeatureSection;