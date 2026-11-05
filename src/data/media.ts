export interface MediaItem {
  outlet: string;
  headline: string;
  image: string;
  link?: string;
  // Photo-style banner that fills the plate instead of a logo on white
  fill?: boolean;
  scale?: number;
}

export const MEDIA_DATA = {
  titlePrefix: 'Our ',
  titleHighlight: 'Media',
  titleSuffix: ' Presence',
  subtitle:
    'We are recognized by some of the most recognised news and media platforms around the globe.',
  items: [
  {
    "outlet": "The Economic Times",
    "headline": "Maruti Suzuki selects CodeMate AI for its Incubation Program. Powering the next generation of AI-driven enterprise productivity.",
    "image": "/media/economic-times.jpg",
    "link": "https://m.economictimes.com/industry/auto/auto-news/maruti-suzuki-picks-5-startups-including-sarvam-ai-for-multilingual-customer-support/amp_articleshow/132065492.cms",
    "scale": 1.4
  },
  {
    "outlet": "Angel One",
    "headline": "CodeMate AI joins an elite cohort of startups backed by Maruti Suzuki. Driving enterprise AI innovation from idea to impact.",
    "image": "/media/angel-one.jpg",
    "link": "https://www.angelone.in/news/stocks/maruti-suzuki-incubation-program-onboards-5-startups-for-ai-battery-recycling-solutions",
    "scale": 1.4
  },
  {
    "outlet": "ANI News",
    "headline": "CodeMate AI joins Maruti Suzuki's Incubation Program. Accelerating AI-powered innovation for the future of manufacturing.",
    "image": "/media/ani-news.jpg",
    "link": "https://www.aninews.in/news/business/maruti-suzuki-partners-with-five-startups-to-boost-efficiency-and-customer-experience20260629124343/",
    "scale": 1.4
  },
  {
    "outlet": "moneycontrol",
    "headline": "CodeMate AI powers the future of software engineering through Maruti Suzuki's innovation ecosystem.",
    "image": "https://getlogo.net/wp-content/uploads/2020/04/moneycontrol-logo-vector.png",
    "link": "https://www.moneycontrol.com/news/business/companies/maruti-suzuki-onboards-5-startups-to-co-create-solutions-across-multiple-biz-areas-13961276.html?utm_medium=social&utm_source=twitter&utm_campaign=regular-editorial",
    "scale": 1.4
  },
  {
    "outlet": "CNBC",
    "headline": "CodeMate AI joins forces with Maruti Suzuki to bring AI-driven software development into enterprise operations.",
    "image": "/media/cnbc-tv18.jpg",
    "link": "https://x.com/cnbctv18live/status/2071483119191110081?s=46",
    "scale": 1.4
  },
  {
    "outlet": "Whalesbook",
    "headline": "CodeMate AI chosen by Maruti Suzuki to accelerate software development with AI.",
    "image": "/media/whalesbook.png",
    "link": "https://www.whalesbook.com/news/English/technology/Maruti-Suzuki-Partners-With-5-Startups-to-Advance-AI-and-Battery-Tech/6a422024fb97bcde4ce5b059",
    "scale": 1.4
  },
  {
    "outlet": "Devdiscourse",
    "headline": "Recognized among five startups selected by Maruti Suzuki for its Incubation Program",
    "image": "/media/devdiscourse.png",
    "link": "https://www.devdiscourse.com/article/business/3942107-maruti-suzuki-teams-up-with-startups-to-boost-efficiency-and-customer-experience?amp",
    "scale": 1.4
  },
  {
    "outlet": "Kalinga TV",
    "headline": "Maruti Suzuki partners with CodeMate AI to advance AI-driven software engineering.",
    "image": "/media/kalinga-tv.jpg",
    "link": "https://kalingatv.com/business/maruti-suzuki-partners-with-five-startups-to-boost-efficiency-and-customer-experience/",
    "scale": 1.4
  },
  {
    "outlet": "Prameya News",
    "headline": "Recognized in the media for joining Maruti Suzuki's startup incubation cohort.",
    "image": "/media/prameya-news.jpg",
    "link": "https://www.prameyanews.com/maruti-suzuki-partners-with-five-startups-to-boost-efficiency-and-customer-experience",
    "scale": 1.4
  },
  {
    "outlet": "Autocar Professional",
    "headline": "CodeMate AI featured as a Maruti Suzuki Incubation Program Cohort 5 startup.",
    "image": "/media/autocar-professional.jpg",
    "link": "https://www.autocarpro.in/news/maruti-suzuki-onboards-five-startups-under-incubation-program-133270",
    "scale": 1.4
  },
  {
    "outlet": "Business Standard",
    "headline": "Featured by leading media for joining Maruti Suzuki's Incubation Program (MSIP)",
    "image": "/media/business-standard.jpg",
    "link": "https://www.business-standard.com/industry/auto/maruti-suzuki-five-startups-ai-battery-recycling-solutions-126062900338_1.html",
    "scale": 1.4
  },
  {
    "outlet": "THE FOUNDER",
    "headline": "Maruti Suzuki onboards CodeMate AI to boost AI and sustainability initiatives",
    "image": "/media/the-founder.jpg",
    "link": "https://thefoundermedia.com/maruti-suzuki-onboards-five-startups-to-boost-ai-and-sustainability-initiatives/",
    "fill": true
  },
  {
    "outlet": "THE HINDU",
    "headline": "CodeMate AI presented its AI-powered development platform to an Austrian delegation, aiming to transform how software is designed, built, and maintained at scale.",
    "image": "/media/the-hindu.png",
    "link": "https://www.thehindubusinessline.com/info-tech/codemate-ai-chief-meets-austrian-ministerial-delegation/article70887794.ece"
  },
  {
    "outlet": "Inc42",
    "headline": "Inc42 featured CodeMate in this article on how the startup aims to become the Grammarly of coding.",
    "image": "https://drive.codemate.ai/inc42.jpg",
    "link": "https://inc42.com/startups/how-codemate-aspires-to-become-the-grammarly-of-coding/",
    "fill": true
  },
  {
    "outlet": "YourStory",
    "headline": "CodeMate got mentioned in this YourStory article featuring top startups of Nasscom GenAI Foundry.",
    "image": "https://drive.codemate.ai/yourstory_banner.png",
    "link": "https://yourstory.com/2023/08/nasscom-genai-foundry-indian-startups-artificial-intelligence",
    "fill": true
  },
  {
    "outlet": "moneycontrol",
    "headline": "Featured as one of the top 9 interesting generative AI startups in India by Moneycontrol.",
    "image": "https://getlogo.net/wp-content/uploads/2020/04/moneycontrol-logo-vector.png",
    "link": "https://www.moneycontrol.com/news/trends/features/9-interesting-generative-ai-startups-in-india-11616981.html"
  },
  {
    "outlet": "BW BUSINESSWORLD",
    "headline": "Ayush Singhal interviewed with BusinessWorld and talked about how CodeMate AI is becoming the forefront of AI in software development.",
    "image": "https://drive.codemate.ai/businessworld_banner.jpeg",
    "link": "https://businessworld.in/article/rs-10k-cr-infusion-for-ai-positive-ongoing-support-now-crucial-ayush-singhal-codemate-513036"
  },
  {
    "outlet": "Indian Startup News",
    "headline": "Indian Startup News featured CodeMate in this article on how we are building AI for developers and making them 10x productive.",
    "image": "https://drive.codemate.ai/indian_startupnews.png",
    "link": "https://indianstartupnews.com/stories/how-codemate-is-revolutionising-the-way-software-developers-code-3690321"
  },
  {
    "outlet": "Dainik Jagran",
    "headline": "Our journey was featured in Dainik Jaagran, a leading Hindi daily newspaper in India.",
    "image": "https://ppimedia.de/wp-content/uploads/2019/09/DJ-Logo-Eng.png"
  }
] as MediaItem[],
};
