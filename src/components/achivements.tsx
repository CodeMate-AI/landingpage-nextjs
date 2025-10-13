'use client'
import React, { useEffect } from 'react'
import { Montserrat } from 'next/font/google';
import { Car } from 'lucide-react';
import { useState,useRef } from 'react';
import { useInView } from 'framer-motion';
import {motion} from 'framer-motion'
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Add what you need
  variable: '--font-montserrat', // Optional, for CSS variable usage
});

function Achivements() {

const [currCards,setCurrCards] = useState(0)
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile,setIsMobile] = useState(false);
  const carouselRef = useRef(null);
  const isInView = useInView(carouselRef, { once: false, amount: 0.3 });
  const cards = [
  {
    image: "https://drive.codemate.ai/asean2.jpeg",
    alt: "ASEAN-India Scalehub 2024",
    title: "ASEAN-India Scalehub 2024 in Bali, Indonesia",
    description: "CodeMate was one of the Top 40 growth stage startups from ASEAN and India selected for this flagship event",
    link: "https://astnet.asean.org/2024/07/16/asean-india-scalehub-2024/"
  },
  {
    image: "https://drive.codemate.ai/aws_spotlight.jpeg",
    alt: "AWS GenAI Spotlight",
    title: "AWS APJ GenAI Spotlight 2024 (Previously ML Elevate)",
    description: "CodeMate selected for the AWS Generative AI Spotlight program for top pre-seed and seed-stage ready startups across Asia-Pacific and Japan",
    link: "https://www.linkedin.com/posts/anuragseth_pleased-to-announce-the-innaugral-aws-apj-activity-7220026321563738112-Y2w-/"
  },
  {
    image: "https://drive.codemate.ai/genaistartuplandscape.jpeg",
    alt: "Generative AI Startup Landscape Report, 2023",
    title: "Generative AI Startup Landscape Report, 2023 by Inc42",
    description: "CodeMate was featured in this report as one of the top generative AI startups in India building in Code and Data domain",
    link: "https://yourstory.com/2023/09/tech30-most-promising-indian-startups-2023-techsparks"
  },
  {
    image: "https://drive.codemate.ai/tech30edit.png",
    alt: "Tech30",
    title: "Tech30: Thirty most promising Indian startups of 2023",
    description: "Selected amongst a list of India’s 30 most promising startups having the potential to be major disruptors.",
    link: "https://yourstory.com/2023/09/tech30-most-promising-indian-startups-2023-techsparks"
  },

  {
    image: "https://drive.codemate.ai/inc42.jpg",
    alt: "Top 7 AI startups",
    title: "7 Gen AI Startups That Caught Our Eyes in 2024",
    description: "CodeMate recognized among top 7 AI startups in 2024 by Inc42",
    link: "https://inc42.com/web-stories/7-genai-startups-that-caught-our-eyes-in-2024/"
  },
  {
    image: "https://drive.codemate.ai/nasscom_genai.jpeg",
    alt: "Nasscom Publication",
    title: "Nasscom Generative AI Startup Landscape Report 2023",
    description: "CodeMate AI was featured in this report as one of the top generative AI startups building from India for the world",
    link: "https://nasscom.in/knowledge-center/publications/generative-ai-startup-landscape-india-2023-perspective"
  },
  {
    image: "https://drive.codemate.ai/moneycontrol_genai.jpeg",
    alt: "moneycontrol",
    title: "MoneyControl Article",
    description: "Featured as one of the top 9 interesting generative AI startups in India by Moneycontrol",
    link: "https://www.moneycontrol.com/news/trends/features/9-interesting-generative-ai-startups-in-india-11616981.html"
  },
  {
    image: "https://drive.codemate.ai/30startupsinc42.png",
    alt: "30 Startups To Watch",
    title: "30 Startups To Watch: AI Startups That Caught Our Eyes In February 2024",
    description: "CodeMate got featured in this prestiguous list of top 30 AI startups by Inc42",
    link: "https://inc42.com/startups/30-startups-to-watch-ai-startups-that-caught-our-eyes-in-february-2024/"
  },
    {
    image: "https://drive.codemate.ai/gfs2022.jpeg",
    alt: "Google Developer Startup Bootcamp",
    title: "Google Developers Startup Bootcamp 2022",
    description: "Google organized the 1st University edition of Google for Startups Accelerator in India, and we were honored to be one of the top 10 startups selected in the cohort out of over 1500 applicants across India.",
    link: "https://rsvp.withgoogle.com/events/startup-bootcamp-university/class-2022"
  },
  {
    image: "https://drive.codemate.ai/uaehh.webp",
    alt: "Meet with UAE HH",
    title: "UAE – India Business Forum 2024 in Mumbai, India| Meet with Abu Dhabi Prince HH Al Nahyan",
    description: "Invited as one of the selective growth stage companies for this exclusive event held in Mumbai. The event was organised by the UAE Ministry of Economy and the UAE Embassy in India, in collaboration with the Ministry of Commerce and Industry in India.",
    link: "" // No link provided
  },
  {
    image: "https://drive.codemate.ai/ethiopiaembassy.jpeg",
    alt: "Ethiopia Embassy",
    title: "Meeting Ethiopian Ambassador H.E. Demeke Atnafu Ambulo",
    description: "CodeMate was one of the few startups invited to meet with the Ethiopian Ambassador to India, H.E. Demeke Atnafu Ambulo, at International Ambassador Meet 2024 in New Delhi.",
    link: "https://www.business-standard.com/content/press-releases-ani/international-ambassador-meet-2024-hosted-at-embassy-of-ethiopia-in-new-delhi-124030800477_1.html"
  },
  {
    image: "https://drive.codemate.ai/businessworld_banner.jpeg",
    alt: "Businessworld",
    title: "Interview with Businessworld",
    description: "Our founder, Ayush Singhal interviewed with BusinessWorld and talked about the opportunities coming up in the startup ecosystem and how CodeMate AI is becoming the forefront of AI in software development",
    link: "https://businessworld.in/article/rs-10k-cr-infusion-for-ai-positive-ongoing-support-now-crucial-ayush-singhal-codemate-513036"
  },
  {
    image: "https://drive.codemate.ai/indian_startupnews.png",
    alt: "Indian Startup News",
    title: "Media Feature: Indian Startup News",
    description: "Indian Startup News featured CodeMate in this article on how we are building AI for developers and making them 10x productive while writing code.",
    link: "https://indianstartupnews.com/stories/how-codemate-is-revolutionising-the-way-software-developers-code-3690321"
  },
  {
    image: "https://drive.codemate.ai/aiawards23.png",
    alt: "AI Awards' 23",
    title: "Winner of Artificial Intelligence Awards' 23",
    description: "CodeMate was the winner in the category of Most Innovative Programming Solutions-India in Artificial Intelligence Awards' 23 organised by Corporate Vision Magazine",
    link: "https://www.corporatevision-news.com/winners/codemate/"
  },
  {
    image: "https://drive.codemate.ai/sandeepjainpodcast.jpg",
    alt: "Sandeep Jain Podcast",
    title: "Podcast with Sandeep Jain, Founder of GeeksforGeeks",
    description: "Our founder, Ayush Singhal got invited by Mr. Sandeep Jain, founder of GeeksforGeeks to talk about CodeMate's innovative approach to AI in software development",
    link: "https://www.youtube.com/watch?v=HbwKDiIwu7c&ab_channel=SandeepJain"
  },
  {
    image: "https://drive.codemate.ai/samaltman.jpeg",
    alt: "Sam Altman Round Table",
    title: "Exclusive Roundtable with Sam Altman, Founder of OpenAI",
    description: "Our founder, Ayush Singhal was invited to an exclusive roundtable discussion with Sam Altman, the founder of OpenAI, to discuss the future of AI and its impact on the world on 8th June 2023. It was an exclusive invite only for top 15 founders and developers building in Generative AI.",
    link: "" // No link provided
  },
  {
    image: "https://drive.codemate.ai/razorpay_ftx.jpeg",
    alt: "Razorpay FTX'23",
    title: "Featured at Razorpay FTX'24",
    description: "We were featured at Razorpay FTX'24, one of the biggest fintech events in India held on 23rd February 2024. We were as one of the top innovative startups backed by Razorpay Rize.",
    link: "" // No link provided
  },
  {
    image: "https://drive.codemate.ai/gsea_bangalore.jpeg",
    alt: "GSEA Bangalore'23",
    title: "Winner of Global Student Entrepreneur Awards, Bangalore 2023-24",
    description: "CodeMate AI got the first position in the Global Student Entrepreneur Awards Regional Finals held in Bangalore in Febrary 2024",
    link: "" // No link provided
  },
  {
    image: "https://drive.codemate.ai/devfestbooth.jpeg",
    alt: "Devfest Delhi 2023",
    title: "Devfest 2023 organised by Google Developers Group, Delhi",
    description: "We were one of the official partners for this event and had a booth to showcase CodeMate AI to the developer community in Delhi.",
    link: "" // No link provided
  },
    {
    image: "https://drive.codemate.ai/usembassyphoto.jpeg",
    alt: "Nexus US Embassy",
    title: "Nexus Startup Program by US Embassy: Cohort 17",
    description: "CodeMate AI was selected amongst 1000+ applicants for cohort 17 of Nexus Startup Program run by US Embassy in American Center, New Delhi.",
    link: "https://www.startupnexus.in/portfolio.html"
  },
  {
    image: "https://drive.codemate.ai/ericgarcetti.jpg",
    alt: "Nexus Alumni Meet 2023",
    title: "Alumni Meet of Nexus Startup Program with Eric Garcetti, US Ambassador to India",
    description: "CodeMate AI was invited to an exclusive alumni meet for selected startups of Nexus Startup Program run by US Embassy in American Center, New Delhi, where we had the opportunity to discuss our startup journey and innovations with Eric Garcetti, the former Mayor of Los Angeles and the current US Ambassador to India. Date: 17th November 2023.",
    link: "https://www.startupnexus.in/events.html"
  },
  {
    image: "https://drive.codemate.ai/techsparks.jpeg",
    alt: "Pitchfest 2023",
    title: "Pitchfest 2023: Techsparks Bangalore",
    description: "CodeMate AI got featured in this article on Techsparks Bangalore organised by YourStory",
    link: "https://yourstory.com/2023/09/pitch-fest-2023-techsparks-tech30-startups-technology-ai"
  },
  {
    image: "https://drive.codemate.ai/shraddha_yourstory.avif",
    alt: "Starting Up with Shradha Sharma",
    title: "Starting Up with Shradha Sharma, Founder of YourStory",
    description: "Our founder Ayush Singhal was invited in a show with Shradha Sharma, founder of YourStory to talk about CodeMate's innovative approach to AI in software development",
    link: "https://yourstory.com/2023/05/starting-up-with-shradha-sharma-vecros-codemate-3rditech-trestle-labs"
  },
  {
    image: "https://drive.codemate.ai/yourstory_correctingcode.jpeg",
    alt: "YourStory Article",
    title: "Media Feature: YourStory",
    description: "CodeMate's innovative approach got recognised and featured by YourStory, a leading media house globally",
    link: "https://yourstory.com/2024/02/codemate-ai-startup-coding-assistant-debugging-fixing-errors"
  },
  {
    image: "https://drive.codemate.ai/yourstory_banner.png",
    alt: "YourStory Article",
    title: "Media Feature: YourStory",
    description: "CodeMate got mentioned in this article featuring top startups of Nasscom GenAI Foundry.",
    link: "https://yourstory.com/2023/08/nasscom-genai-foundry-indian-startups-artificial-intelligence"
  },
  {
    image: "https://drive.codemate.ai/gsea%20global.jpeg",
    alt: "GSEA'24",
    title: "South Asia Finals of Global Student Entrepreneur Awards'24",
    description: "CodeMate AI was selected amongst top 4 startups from India out of 1000+ applicants to represent India at the Global Student Entrepreneur Awards South Asia Finals 2024.",
    link: "https://www.dailypioneer.com/2024/state-editions/gsea-2024-india-finals-organised-in-the-state-capital.html"
  },
  {
    image: "https://drive.codemate.ai/ide_moe.jpeg",
    alt: "IDE Bootcamp by MOE",
    title: "Invited as Jury Member for IDE Bootcamp by Ministry of Education",
    description: "Our founder, Ayush Singhal was invited as a Jury Member for IDE Bootcamp by Ministry of Education, Government of India to mentor and guide Smart India Hackathon students on their business ideas.",
    link: "" // No link provided
  },
  {
    image: "https://drive.codemate.ai/aiide.png",
    alt: "AIIDE IIT Kanpur",
    title: "Selected for AIIDE cohort by IIT Kanpur",
    description: "CodeMate AI was selected in Artificial Intelligence and Innovation Driven Entrepreneurship Center of Excellence (AIIDE) cohort 4 by IIT Kanpur",
    link: "" // No link provided
  },
  {
    image: "https://drive.codemate.ai/bwtechtalk.jpg",
    alt: "BW Tech talk",
    title: "Business World Tech Talks",
    description: "We were invited at Business World Tech Talks held in New Delhi",
    link: "https://www.youtube.com/watch?v=6WKoXVQTRDE&t=32s&pp=ygUhYnVzaW5lc3Mgd29ybGQgdGVjaCB0YWxrIGNvZGVtYXRl"
  },
    {
    image: "https://drive.codemate.ai/mst.png",
    alt: "DST",
    title: "Awarded NIDHI EiR by Department of Science and Technology",
    description: "CodeMate AI was recognised by TIDES, IIT Roorkee and awarded NIDHI EiR by Department of Science and Technology, Government of India",
    link: "" // No link provided
  },
  {
    image: "https://drive.codemate.ai/jicaward.jpeg",
    alt: "MEITY",
    title: "Awarded TIDE 2.0 grant by Ministry of Electronics and Information Technology, Government of India",
    description: "CodeMate AI was awarded with TIDE 2.0 grant by MEITY and recognised by JECRC Incubation Center",
    link: "" // No link provided
  },
  {
    image: "https://drive.codemate.ai/EWC'22.png",
    alt: "EWC'22",
    title: "National Finalist in Entrepreneurship World Cup",
    description: "We were the National finalists in Entrepreneurship World Cup'22 organised by Misk Global Forum, Global Entrepreneurship Network and The Global Education & Leadership Foundation.",
    link: "" // No link provided
  },
  {
    image: "https://drive.codemate.ai/dainikjaagran.jpeg",
    alt: "Dainik Jaagran",
    title: "Featured in Dainik Jaagran",
    description: "Our journey was featured in Dainik Jaagran, a leading Hindi daily newspaper in India.",
    link: "" // No link provided
  },
  {
    image: "https://drive.codemate.ai/genaisummitmic.jpeg",
    alt: "Gen AI Summit",
    title: "Gen AI Summit by Businessworld",
    description: "Our founder, Ayush Singhal was invited as a speaker at Gen AI Summit organised by Businessworld in New Delhi.",
    link: "" // No link provided
  },
  {
    image: "https://drive.codemate.ai/gsea.jpeg",
    alt: "GSEA Noida 2024",
    title: "Global Student Entrepreneur Awards, Noida 2024",
    description: "CodeMate AI was selected amongst top 10 startups from India out of 100+ applicants to showcase at the Global Student Entrepreneur Awards Regional Finals held in Noida in 2023.",
    link: "" // No link provided
  },
    {
    image: "https://drive.codemate.ai/inc42grammarlyarticle.jpeg",
    alt: "Inc42 Article",
    title: "How CodeMate Aspires To Become The Grammarly Of Coding",
    description: "Inc42 featured CodeMate in this article on how the startup aims to become the Grammarly of coding",
    link: "https://inc42.com/startups/how-codemate-aspires-to-become-the-grammarly-of-coding/"
  },
  {
    image: "https://drive.codemate.ai/nasscom10000.png",
    alt: "Nasscom 10000 Startups",
    title: "Nasscom 10000 Startups",
    description: "CodeMate AI got selected for the 10000 Startups program by Nasscom",
    link: "" // No link provided
  },
  {
    image: "https://drive.codemate.ai/softwareconference.png",
    alt: "AI in Software Development Conf'24",
    title: "AI in Software Development Conf'24",
    description: "Our founder, Ayush Singhal was Invited as a speaker at AI in Software Development Conference'24 organised by Geekle.us and witnessed by over 1000+ developers and tech enthusiasts.",
    link: "" // No link provided
  }
  // ... and so on for the rest of the cards
];

     
  // ---- Auto slide effect ----
useEffect(() => {
  let interval: number; // ← use number for browser environment

  if (isInView && !isPaused) {
    if (!isMobile) {
      interval = window.setInterval(() => {
        setCurrCards((prev) => {
          const next = prev - 375;
          return next <= -13500 ? 0 : next;
        });
      }, 5000);
    } else {
      interval = window.setInterval(() => {
        setCurrCards((prev) => {
          const next = prev - 345;
          return next <= -12765 ? 0 : next;
        });
      }, 5000);
    }
  }

  return () => window.clearInterval(interval); // ← clearInterval works with number
}, [isInView, isPaused, isMobile]);




useEffect(()=>{
  console.log(currCards);
},[currCards])

useEffect(() => {
  // This will run only on the client
  setIsMobile(window.innerWidth <= 1024? true : false);

  // Optional: handle resize
  const handleResize = () => setIsMobile(window.innerWidth <= 1024? true : false);
  window.addEventListener('resize', handleResize);

  return () => window.removeEventListener('resize', handleResize);
}, []);

 function handleArrow(e:string){
    if(e === 'left'){
        currCards !== 0? setCurrCards(state => state+375) : null;
    }
    if(e === 'right'){
        currCards !== -13500? setCurrCards(state => state-375) : null;
        // setCurrCards(state => state-375); 
    }
 }

function handleArrow2(e:string){
      if(e === 'left'){
        currCards !== 0? setCurrCards(state => state+345) : null;
    }
    if(e === 'right'){
        currCards !== -12765? setCurrCards(state => state-345) : null;
      
      
        
    }
}
  return (
    <div 


    className='relative flex flex-col justify-center items-center mb-20'>
    <div className={`${montserrat.className} leading-[1] text-[10vw]  lg:text-6xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent lg:pl-10 pt-20 text-center`}>We're the <span className='bg-gradient-to-b  from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent lg:text-7xl'>Talk</span> of the Town</div>
      <p className='text-xs w-[80%] mt-3 lg:mt-0 lg:text-lg lg:w-[50%] text-center text-zinc-500 '>We are recognized by some of the most recognised tech, content, and news platforms, organisations and industry experts around the globe.</p>

    <div
      ref={carouselRef}
      onMouseEnter={() => setIsPaused(true)} // pause on hover
      onMouseLeave={() => setIsPaused(false)} // resume when hover ends
    className='mt-20 flex w-[20rem] lg:w-[80.5%] overflow-hidden gap-1 lg:gap-6'>
     <motion.div animate={{x:currCards}} transition={{ type: "spring", stiffness: 300, damping: 30}} className='flex gap-6'>   
     {cards.map((e,idx)=>(
        <div key={idx}>
        <Card title={e.title} image={e.image} alt={e.alt} description={e.description} link={e.link}/>
        </div>
     ))}   
     </motion.div>
    </div>

    <motion.div onClick={()=>handleArrow('left')} whileHover={{opacity:1}} className='absolute hidden lg:flex  size-16 left-16 top-[30rem] rounded-full cursor-pointer text-white opacity-70'>
        <svg  xmlns="http://www.w3.org/2000/svg"  width={60}  height={60}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={1}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left-to-arc"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 12h-12" /><path d="M13 16l-4 -4l4 -4" /><path d="M12 3a9 9 0 1 0 0 18" /></svg>
    </motion.div>

    <motion.div onClick={()=>handleArrow('right')} whileHover={{opacity:1}} className='absolute hidden lg:flex size-16 right-16 top-[30rem] rounded-full cursor-pointer text-white opacity-70'>
    <svg  xmlns="http://www.w3.org/2000/svg"  width={60}  height={60}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={1}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right-to-arc"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12h12" /><path d="M11 8l4 4l-4 4" /><path d="M12 21a9 9 0 0 0 0 -18" /></svg>
    </motion.div>


   {/* for mobile */}
   <div className='flex gap-10 mt-10 '>
    <motion.div onClick={()=>handleArrow2('left')} whileHover={{opacity:0.7}} className='lg:hidden size-16  rounded-full cursor-pointer text-zinc-400'>
        <svg  xmlns="http://www.w3.org/2000/svg"  width={60}  height={60}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={1}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left-to-arc"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 12h-12" /><path d="M13 16l-4 -4l4 -4" /><path d="M12 3a9 9 0 1 0 0 18" /></svg>
    </motion.div>

    <motion.div onClick={()=>handleArrow2('right')} whileHover={{opacity:0.7}} className=' lg:hidden size-16 right-24 top-[30rem] rounded-full cursor-pointer text-zinc-400'>
    <svg  xmlns="http://www.w3.org/2000/svg"  width={60}  height={60}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={1}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right-to-arc"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12h12" /><path d="M11 8l4 4l-4 4" /><path d="M12 21a9 9 0 0 0 0 -18" /></svg>
    </motion.div>
    </div>
    </div>
  )
}

export default Achivements


function Card({image,alt,title,description,link}:{image:String,alt:String,title:String,description:String,link:String}){
return(
    <motion.div  className='relative h-[33rem] w-[20rem] lg:w-[22rem] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl'>
     <img src={image as string} alt={alt as string}  className='h-[40%] w-full object-cover ' />

    <div className='px-5 flex flex-col gap-2 mt-4'>
     <h1 className='text-xl font-semibold '>{title}</h1>
     <p className='text-zinc-500 text-xs'>{description}</p>
    </div>
    
     <a href={link as  string} target='_blank'>
      <motion.button whileHover={{opacity:0.7}} className='absolute text-lg px-5 bottom-8 text-[#00BFFF]'>Read More</motion.button>
      </a>
    </motion.div>
)
}