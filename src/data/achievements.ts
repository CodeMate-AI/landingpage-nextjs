export interface AchievementItem {
  title: string;
  alt: string;
  image: string;
  link?: string;
  imagePosition?: 'top' | 'bottom';
}

export const ACHIEVEMENTS_DATA = {
  titlePrefix: "We're the ",
  titleHighlight: 'Talk',
  titleSuffix: ' of the Town',
  subtitle:
    'We are recognized by some of the most recognised tech and content platforms, organisations, and industry experts around the globe.',
  items: [
  {
    "title": "Computex 2026 - CodeMate AI Goes Live on Snapdragon X at Qualcomm Booth",
    "alt": "CodeMate AI at Computex 2026",
    "image": "/achievements/computex-2026.jpg",
    "link": "https://www.linkedin.com/posts/codemateai_computex2026-codemate-qualcomm-activity-7471780972443652097-GseN?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD68Ph8Bq1JfQl_QR-MaxiB4RI0Fy-Oiv8g",
    "imagePosition": "bottom"
  },
  {
    "title": "CodeMate AI at the Embassy of India, Vienna",
    "alt": "ViennaUP",
    "image": "/achievements/viennaup-embassy-austria.jpg",
    "link": "https://www.linkedin.com/posts/viennaup-codemateai-viennaup-ugcPost-7469691112304099328-dSWN/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD68Ph8Bq1JfQl_QR-MaxiB4RI0Fy-Oiv8g"
  },
  {
    "title": "CodeMate AI Signs MoU with GLA University",
    "alt": "GLA MOU",
    "image": "/achievements/gla-university-mou.jpg",
    "link": "https://www.linkedin.com/posts/codemateai_university-aicoding-skills-activity-7468889423468720128-63E_?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD68Ph8Bq1JfQl_QR-MaxiB4RI0Fy-Oiv8g",
    "imagePosition": "top"
  },
  {
    "title": "India AI Summit 2026 - Hosted Global AI Leaders at CodeMate Booth",
    "alt": "India AI Summit 2026",
    "image": "/achievements/india-ai-summit-2026.png",
    "link": "https://www.linkedin.com/posts/theayushsinghal_codemate-ai-at-ai-impact-summit-ugcPost-7435550359072231424-xc7A?utm_source=share&utm_medium=member_desktop&rcm=ACoAACDnwuABThwzgF3nSZOORjzzzewV9QHCVJU",
    "imagePosition": "top"
  },
  {
    "title": "Qualcomm × CodeMate AI Partnership at IMC 2025",
    "alt": "Qualcomm × CodeMate AI Partnership at IMC 2025",
    "image": "/achievements/qualcomm-imc-2025.jpg",
    "link": "https://www.linkedin.com/posts/shama-ahlawat-b40a72134_technology-event-partnership-activity-7387477019929997313-0mhe?utm_source=share&utm_medium=member_desktop&rcm=ACoAACDnwuABThwzgF3nSZOORjzzzewV9QHCVJU"
  },
  {
    "title": "UPITS 2025 - UP International Trade Show, Greater Noida",
    "alt": "UPITS 2025 - UP International Trade Show",
    "image": "/achievements/upits-trade-show-2025.jpg",
    "link": "https://www.linkedin.com/posts/theayushsinghal_codemate-upits2025-ai-activity-7389356209650450432-mG2X?utm_source=share&utm_medium=member_desktop&rcm=ACoAACDnwuABThwzgF3nSZOORjzzzewV9QHCVJU"
  },
  {
    "title": "MeitY TIDE 2.0 - Pravartan 2025, Featured Startup",
    "alt": "MeitY TIDE 2.0 - Pravartan 2025",
    "image": "/achievements/meity-tide-pravartan-2025.png",
    "link": "https://www.linkedin.com/posts/shama-ahlawat-b40a72134_meity-startupindia-deeptech-activity-7428403894055092224-PAw6?utm_source=share&utm_medium=member_desktop&rcm=ACoAACDnwuABThwzgF3nSZOORjzzzewV9QHCVJU"
  },
  {
    "title": "Selected in Top 5 AI Startups - RAISE 2025 by L&T Finance",
    "alt": "Selected in Top 5 AI Startups - RAISE 2025 by L&T Finance",
    "image": "/achievements/lt-finance-raise-2025.jpg",
    "link": "https://www.linkedin.com/posts/theayushsinghal_codemate-ai-was-recognized-among-the-top-ugcPost-7411405483816751104-pf56?utm_source=share&utm_medium=member_desktop&rcm=ACoAACDnwuABThwzgF3nSZOORjzzzewV9QHCVJU"
  },
  {
    "title": "ASEAN-India Scalehub 2024 in Bali, Indonesia",
    "alt": "ASEAN-India Scalehub 2024",
    "image": "https://drive.codemate.ai/asean2.jpeg",
    "link": "https://astnet.asean.org/2024/07/16/asean-india-scalehub-2024/"
  },
  {
    "title": "AWS APJ GenAI Spotlight 2024 (Previously ML Elevate)",
    "alt": "AWS GenAI Spotlight",
    "image": "https://drive.codemate.ai/aws_spotlight.jpeg",
    "link": "https://www.linkedin.com/posts/anuragseth_pleased-to-announce-the-innaugral-aws-apj-activity-7220026321563738112-Y2w-/"
  },
  {
    "title": "Generative AI Startup Landscape Report, 2023 by Inc42",
    "alt": "Generative AI Startup Landscape Report, 2023",
    "image": "https://drive.codemate.ai/genaistartuplandscape.jpeg",
    "link": "https://yourstory.com/2023/09/tech30-most-promising-indian-startups-2023-techsparks"
  },
  {
    "title": "Tech30: Thirty most promising Indian startups of 2023",
    "alt": "Tech30",
    "image": "https://drive.codemate.ai/tech30edit.png",
    "link": "https://yourstory.com/2023/09/tech30-most-promising-indian-startups-2023-techsparks"
  },
  {
    "title": "Nasscom Generative AI Startup Landscape Report 2023",
    "alt": "Nasscom Publication",
    "image": "https://drive.codemate.ai/nasscom_genai.jpeg",
    "link": "https://nasscom.in/knowledge-center/publications/generative-ai-startup-landscape-india-2023-perspective"
  },
  {
    "title": "30 Startups To Watch: AI Startups That Caught Our Eyes In February 2024",
    "alt": "30 Startups To Watch",
    "image": "https://drive.codemate.ai/30startupsinc42.png",
    "link": "https://inc42.com/startups/30-startups-to-watch-ai-startups-that-caught-our-eyes-in-february-2024/"
  },
  {
    "title": "Google Developers Startup Bootcamp 2022",
    "alt": "Google Developer Startup Bootcamp",
    "image": "https://drive.codemate.ai/gfs2022.jpeg",
    "link": "https://rsvp.withgoogle.com/events/startup-bootcamp-university/class-2022"
  },
  {
    "title": "UAE – India Business Forum 2024 in Mumbai, India| Meet with Abu Dhabi Prince HH Al Nahyan",
    "alt": "Meet with UAE HH",
    "image": "https://drive.codemate.ai/uaehh.webp"
  },
  {
    "title": "Meeting Ethiopian Ambassador H.E. Demeke Atnafu Ambulo",
    "alt": "Ethiopia Embassy",
    "image": "https://drive.codemate.ai/ethiopiaembassy.jpeg",
    "link": "https://www.business-standard.com/content/press-releases-ani/international-ambassador-meet-2024-hosted-at-embassy-of-ethiopia-in-new-delhi-124030800477_1.html"
  },
  {
    "title": "Winner of Artificial Intelligence Awards' 23",
    "alt": "AI Awards' 23",
    "image": "https://drive.codemate.ai/aiawards23.png",
    "link": "https://www.corporatevision-news.com/winners/codemate/"
  },
  {
    "title": "Podcast with Sandeep Jain, Founder of GeeksforGeeks",
    "alt": "Sandeep Jain Podcast",
    "image": "https://drive.codemate.ai/sandeepjainpodcast.jpg",
    "link": "https://www.youtube.com/watch?v=HbwKDiIwu7c&ab_channel=SandeepJain"
  },
  {
    "title": "Exclusive Roundtable with Sam Altman, Founder of OpenAI",
    "alt": "Sam Altman Round Table",
    "image": "https://drive.codemate.ai/samaltman.jpeg"
  },
  {
    "title": "Featured at Razorpay FTX'24",
    "alt": "Razorpay FTX'23",
    "image": "https://drive.codemate.ai/razorpay_ftx.jpeg"
  },
  {
    "title": "Winner of Global Student Entrepreneur Awards, Bangalore 2023-24",
    "alt": "GSEA Bangalore'23",
    "image": "https://drive.codemate.ai/gsea_bangalore.jpeg"
  },
  {
    "title": "Devfest 2023 organised by Google Developers Group, Delhi",
    "alt": "Devfest Delhi 2023",
    "image": "https://drive.codemate.ai/devfestbooth.jpeg"
  },
  {
    "title": "Nexus Startup Program by US Embassy: Cohort 17",
    "alt": "Nexus US Embassy",
    "image": "https://drive.codemate.ai/usembassyphoto.jpeg",
    "link": "https://www.startupnexus.in/portfolio.html"
  },
  {
    "title": "Alumni Meet of Nexus Startup Program with Eric Garcetti, US Ambassador to India",
    "alt": "Nexus Alumni Meet 2023",
    "image": "https://drive.codemate.ai/ericgarcetti.jpg",
    "link": "https://www.startupnexus.in/events.html"
  },
  {
    "title": "Pitchfest 2023: Techsparks Bangalore",
    "alt": "Pitchfest 2023",
    "image": "https://drive.codemate.ai/techsparks.jpeg",
    "link": "https://yourstory.com/2023/09/pitch-fest-2023-techsparks-tech30-startups-technology-ai"
  },
  {
    "title": "Starting Up with Shradha Sharma, Founder of YourStory",
    "alt": "Starting Up with Shradha Sharma",
    "image": "https://drive.codemate.ai/shraddha_yourstory.avif",
    "link": "https://yourstory.com/2023/05/starting-up-with-shradha-sharma-vecros-codemate-3rditech-trestle-labs"
  },
  {
    "title": "Media Feature: YourStory",
    "alt": "YourStory Article",
    "image": "https://drive.codemate.ai/yourstory_correctingcode.jpeg",
    "link": "https://yourstory.com/2024/02/codemate-ai-startup-coding-assistant-debugging-fixing-errors"
  },
  {
    "title": "South Asia Finals of Global Student Entrepreneur Awards'24",
    "alt": "GSEA'24",
    "image": "https://drive.codemate.ai/gsea%20global.jpeg",
    "link": "https://www.dailypioneer.com/2024/state-editions/gsea-2024-india-finals-organised-in-the-state-capital.html"
  },
  {
    "title": "Invited as Jury Member for IDE Bootcamp by Ministry of Education",
    "alt": "IDE Bootcamp by MOE",
    "image": "https://drive.codemate.ai/ide_moe.jpeg"
  },
  {
    "title": "Selected for AIIDE cohort by IIT Kanpur",
    "alt": "AIIDE IIT Kanpur",
    "image": "https://drive.codemate.ai/aiide.png"
  },
  {
    "title": "Business World Tech Talks",
    "alt": "BW Tech talk",
    "image": "https://drive.codemate.ai/bwtechtalk.jpg",
    "link": "https://www.youtube.com/watch?v=6WKoXVQTRDE&t=32s&pp=ygUhYnVzaW5lc3Mgd29ybGQgdGVjaCB0YWxrIGNvZGVtYXRl"
  },
  {
    "title": "Awarded NIDHI EiR by Department of Science and Technology",
    "alt": "DST",
    "image": "https://drive.codemate.ai/mst.png"
  },
  {
    "title": "Awarded TIDE 2.0 grant by Ministry of Electronics and Information Technology, Government of India",
    "alt": "MEITY",
    "image": "https://drive.codemate.ai/jicaward.jpeg"
  },
  {
    "title": "National Finalist in Entrepreneurship World Cup",
    "alt": "EWC'22",
    "image": "https://drive.codemate.ai/EWC'22.png"
  },
  {
    "title": "Featured in Dainik Jaagran",
    "alt": "Dainik Jaagran",
    "image": "https://drive.codemate.ai/dainikjaagran.jpeg"
  },
  {
    "title": "Gen AI Summit by Businessworld",
    "alt": "Gen AI Summit",
    "image": "https://drive.codemate.ai/genaisummitmic.jpeg"
  },
  {
    "title": "Global Student Entrepreneur Awards, Noida 2024",
    "alt": "GSEA Noida 2024",
    "image": "https://drive.codemate.ai/gsea.jpeg"
  },
  {
    "title": "How CodeMate Aspires To Become The Grammarly Of Coding",
    "alt": "Inc42 Article",
    "image": "https://drive.codemate.ai/inc42grammarlyarticle.jpeg",
    "link": "https://inc42.com/startups/how-codemate-aspires-to-become-the-grammarly-of-coding/"
  },
  {
    "title": "Nasscom 10000 Startups",
    "alt": "Nasscom 10000 Startups",
    "image": "https://drive.codemate.ai/nasscom10000.png"
  },
  {
    "title": "AI in Software Development Conf'24",
    "alt": "AI in Software Development Conf'24",
    "image": "https://drive.codemate.ai/softwareconference.png"
  }
] as AchievementItem[],
};
