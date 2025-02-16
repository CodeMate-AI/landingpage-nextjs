import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Marquee } from './magicui/marquee';
import { ExternalLink } from 'lucide-react';

const TestimonialCard = ({ review }: { review: any }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.03,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
      }}
      className="flex flex-col min-w-[300px] md:min-w-[380px] max-w-[400px] h-[400px] bg-gray-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 mx-4 my-6"
    >
      <div className="p-6 flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                // className={i < review.rating ? "text-yellow-400" : "text-gray-700"} 
                size={18}
                fill={i < review.rating ? "#FACC15" : "none"}
                className={i < review.rating ? "text-yellow-400" : "text-gray-700"}
              />
          ))}
        </div>
        
        {/* Content */}
        <p className="text-gray-300 text-base mb-4 flex-grow line-clamp-[8]">
          "{review.content}"
        </p>
        
        {/* Profile */}
        <div className="mt-auto">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
              <img 
                src={review.avatar} 
                alt={review.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium text-white text-sm">{review.name}</h4>
              <p className="text-gray-400 text-xs">{review.title}</p>
            </div>
          </div>
          
          {/* Source - Improved UI */}
          <a 
            href={review.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-4 flex items-center group"
          >
            <div className="flex items-center bg-gray-800/50 hover:bg-gray-800 rounded-full px-3 py-1.5 transition-colors">
              <img 
                src={review.source} 
                alt="Source" 
                className="h-4 mr-2"
              />
              <span className="text-blue-400 text-xs group-hover:text-blue-300">
                View original review
              </span>
              <ExternalLink className="ml-1 text-gray-500 group-hover:text-gray-400" size={12} />
            </div>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const SimpleTestimonialCarousel = () => {
  const reviews = [
    {
      name: "Ayush Bansal",
      title: "Software Engineer-II, Amazon",
      content: "CodeMate.ai has revolutionized my coding workflow with accurate AI suggestions and a user-friendly interface. Highly recommended!",
      rating: 5,
      source: "https://drive.codemate.ai/vscode-logo.png",
      avatar: "https://drive.codemate.ai/ayushbansal.jpeg",
      url: "https://marketplace.visualstudio.com/items?itemName=AyushSinghal.Code-Mate&ssr=false#review-details"
    },
    {
      name: "Hani H.",
      title: "Founder",
      content: "CodeMate has lots of great features. You can use it to request code samples for something you can't figure out, or request a code review of your existing code. The code review is very helpful in identifying some issues that were not obvious. Also, the code Debugger is a life changer - it immediately was able to identify a bug in my code that was resulting in some errors being posted to the error logs!",
      rating: 5,
      source: "https://drive.codemate.ai/g2-logo.webp",
      avatar: "https://drive.codemate.ai/hani.webp",
      url: "https://www.g2.com/products/codemate-ai/reviews/codemate-ai-review-9798996"
    },
    {
      name: "Kitty Liu",
      title: "Engineering",
      content: "Codemate is doing a great job with its simplicity. I can't wait to see more features they are going to release soon.",
      rating: 5,
      source: "https://drive.codemate.ai/vscode-logo.png",
      avatar: "https://i.pravatar.cc/150?u=kitty.liu",
      url: "https://marketplace.visualstudio.com/items?itemName=AyushSinghal.Code-Mate&ssr=false#review-details"
    },
    {
      name: "Vilkhovskiy",
      title: "Chief Executive Officer, Softenq",
      content: "An Excellent Solution for Comprehensive Project Analysis and Efficient Development! I really like the idea of Codemate, specifically: the ability to analyze an entire project, the ability to assign tasks for refactoring and code generation and the ability to finally cover the project with tests!",
      rating: 5,
      source: "https://drive.codemate.ai/appsumo-logo.svg",
      avatar: "https://drive.codemate.ai/vilkho_appsumo.webp",
      url: "https://www.g2.com/products/codemate-ai/reviews"
    },
    {
      name: "Keith Price",
      title: "Backend Engineer",
      content: "Love this tool. It's so awesome that it can train on the entire solution (and other solutions). That's going to save a ton of time and frustration. First of all, ChatGPT is not very good at finding the right methods and code blocks when you give it whole classes. Secondly, I have often written great code in another solution and hate having to go track it down to copy and paste it in, let alone modify it to fit the current structure. So, the ability to retain training on past solutions is phenomenal!.",
      rating: 5,
      source: "https://drive.codemate.ai/linkedin.png",
      avatar: "https://i.pravatar.cc/150?u=david.kim",
      url: "https://www.g2.com/products/codemate-ai/reviews"
    }
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    setAutoplay(false);
  }, []);
  
  const nextSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    setAutoplay(false);
  }, [reviews.length]);
  
  const prevSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
    setAutoplay(false);
  }, [reviews.length]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);
  
  // Autoplay
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 3000);
    }
    
    return () => clearInterval(interval);
  }, [autoplay, reviews.length]);
  
  // Reset autoplay after 10s of inactivity
  useEffect(() => {
    const timer = setTimeout(() => setAutoplay(true), 10000);
    return () => clearTimeout(timer);
  }, [activeIndex]);
  
  return (
    <section id="clients" className="py-20 overflow-hidden relative">
      {/* Semi-transparent subtle glow spots */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-300">
            What Our Users Are Saying
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of developers who are already using CodeMate.ai to improve their coding workflow
          </p>
        </div>

        <Marquee pauseOnHover className="[--duration:20s]"> 
          {reviews.map((review: any) => (
            <TestimonialCard key={review.id} review={review} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default SimpleTestimonialCarousel;