export interface ToolboxProduct {
  id: string;
  name: string;
  badge?: string;
  description: string;
  logo: string;
  previewImage: string;
  link: string;
  isExternal: boolean;
}

export interface ToolboxSectionData {
  overline: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  ctaText: string;
  ctaLink: string;
  products: ToolboxProduct[];
}

export const TOOLBOX_DATA: ToolboxSectionData = {
  overline: 'Introducing CodeMate AI',
  titlePrefix: 'One ',
  titleHighlight: 'Toolbox.',
  titleSuffix: ' Your entire SDLC.',
  ctaText: 'Download Toolbox',
  ctaLink: '/download',
  products: [
    {
      id: 'work',
      name: 'CodeMate Work',
      description:
        'Turns deep research and feasibility into production-ready code through AI-driven intelligence.',
      logo: '/Co_Logo.png',
      previewImage: '/figma/img_1_codemate_c0.png',
      link: 'https://app.codemate.ai/chat',
      isExternal: true,
    },
    {
      id: 'build',
      name: 'CodeMate Build',
      description:
        'Turns prompts and Figma designs into deployable apps instantly with full design mode support.',
      logo: '/Build_Logo.png',
      previewImage: '/figma/img_2_codemate_c0.png',
      link: 'http://build.codemate.ai/',
      isExternal: true,
    },
    {
      id: 'cora',
      name: 'CodeMate Cora',
      description:
        'End-to-end AI coding agent for writing, securing, and quality-gating code directly in your IDE.',
      logo: '/CORA_Logo.png',
      previewImage: '/figma/img_3_codemate_c0.png',
      link: 'https://marketplace.visualstudio.com/items?itemName=CodeMateAI.codemate-agent',
      isExternal: true,
    },
    {
      id: 'cora-cli',
      name: 'CodeMate Cora CLI',
      description:
        'Run code and scripts instantly through an AI-powered command-line interface directly in your terminal.',
      logo: '/CORA_Logo.png',
      previewImage: '/figma/img_5_codemate_c0.png',
      link: 'https://cli.codemate.ai/',
      isExternal: true,
    },
    {
      id: 'pr-review',
      name: 'CodeMate PR Review Agent',
      description:
        'Automates code reviews and security analysis across GitHub, GitLab, Bitbucket, and Azure DevOps.',
      logo: '/pr_logo.svg',
      previewImage: '/PR_review_agent_image.png',
      link: 'https://github.com/apps/codemate-ai-pr-review-agent',
      isExternal: true,
    },
  ],
};

export interface AcademySectionData {
  overline: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  highlights: {
    title: string;
    description: string;
    badge: string;
  }[];
}

export const ACADEMY_DATA: AcademySectionData = {
  overline: 'Empower Next-Gen Engineers',
  titlePrefix: 'CodeMate ',
  titleHighlight: 'Academy.',
  titleSuffix: ' Master Modern AI Development.',
  description:
    'AI-powered classroom management, curriculum pathways, and hands-on coding labs built for universities, educators, and aspiring software engineers.',
  ctaText: 'Explore Academy',
  ctaLink: 'https://edu.codemate.ai/',
  highlights: [
    {
      title: 'Interactive AI Labs',
      description:
        'Real-time automated grading, intelligent code suggestions, and guided problem solving for students.',
      badge: 'Interactive',
    },
    {
      title: 'University & Enterprise MoUs',
      description:
        'Partnered with leading institutions like GLA University to bridge academic training with industry-ready AI development.',
      badge: 'Accredited',
    },
    {
      title: 'Comprehensive Curriculums',
      description:
        'From software engineering fundamentals to advanced LLM-powered autonomous agent architectures.',
      badge: 'Full Stack',
    },
  ],
};

export interface ProductFeatureCard {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface ProductTabItem {
  id: string;
  tabName: string;
  productLabel: string;
  headline: string;
  description: string;
  cards: ProductFeatureCard[];
}

export interface ProductTabsSectionData {
  tabs: ProductTabItem[];
}

export const PRODUCT_TABS_DATA: ProductTabsSectionData = {
  tabs: [
    {
      id: 'work',
      tabName: 'Work',
      productLabel: 'CodeMate Work',
      headline: 'Think before you develop.',
      description:
        'Turn ideas, requirements, and scattered information into clear, actionable plans for software development.',
      cards: [
        {
          id: 'work-1',
          title: 'Rules & Context',
          description:
            'Define instructions, attach files, and reference remote resources to guide how Work handles tasks.',
          image: '/figma/img_6_figma_to_code.png',
        },
        {
          id: 'work-2',
          title: 'Connected Tools',
          description:
            'Connect external services through MCP to bring relevant information and workflows into Work.',
          image: '/figma/img_7_figma_to_code.png',
        },
        {
          id: 'work-3',
          title: 'Research & Explore',
          description:
            'Investigate ideas, explore possibilities, and gather the context you need before making decisions.',
          image: '/figma/img_8_background_border_shadow.png',
        },
        {
          id: 'work-4',
          title: 'Resources & Knowledge',
          description:
            'Organize files, documents, and project resources in one searchable workspace.',
          image: '/figma/img_9_background_border_shadow.png',
        },
        {
          id: 'work-5',
          title: 'Requirements to Plans',
          description:
            'Structure requirements into clear scopes, deliverables, and actionable next steps.',
          image: '/figma/img_10_background_border_shadow.png',
        },
      ],
    },
    {
      id: 'build',
      tabName: 'Build',
      productLabel: 'CodeMate Build',
      headline: 'From idea to working software.',
      description:
        'Turn natural-language prompts and visual designs into functional applications, faster.',
      cards: [
        {
          id: 'build-1',
          title: 'Prompt-to-App',
          description:
            'Describe what you want to build and turn your idea into a functional application.',
          image: '/build-prompt-to-app.png',
        },
        {
          id: 'build-2',
          title: 'Design-to-Code',
          description:
            'Translate visual designs into working interfaces and code.',
          image: '/figma-to-code-static.png',
        },
        {
          id: 'build-3',
          title: 'Design Mode',
          description:
            'Explore and refine interface ideas while shaping the experience you want to build.',
          image: '/figma/img_16_background_border_shadow.png',
        },
        {
          id: 'build-4',
          title: 'Rapid Prototyping',
          description:
            'Move from an early concept to a working prototype without building everything from scratch.',
          image: '/figma/img_17_background_border_shadow.png',
        },
      ],
    },
    {
      id: 'cora',
      tabName: 'CORA',
      productLabel: 'CodeMate CORA',
      headline: 'Give your codebase an AI engineer.',
      description:
        'Work with an AI coding agent that understands your codebase and helps you implement, debug, and improve software.',
      cards: [
        {
          id: 'cora-1',
          title: 'Codebase Understanding',
          description:
            'Work with code in context, using relationships between files and your existing project knowledge.',
          image: '/figma/img_18_background_border_shadow.png',
        },
        {
          id: 'cora-2',
          title: 'Agentic Coding',
          description:
            'Delegate coding tasks to an AI agent that can help implement changes across your project.',
          image: '/figma/img_19_background_border_shadow.png',
        },
        {
          id: 'cora-3',
          title: 'Debug & Fix',
          description:
            'Identify syntax, logical, and runtime issues, understand their causes, and work toward targeted fixes.',
          image: '/figma/img_20_background_border_shadow.png',
        },
        {
          id: 'cora-4',
          title: 'Refactor & Optimize',
          description:
            'Improve code quality, readability, and efficiency with context-aware suggestions.',
          image: '/figma/img_21_background_border_shadow.png',
        },
        {
          id: 'cora-5',
          title: 'Test Generation',
          description:
            'Generate unit tests for your code and inspect results to validate implementation behavior.',
          image: '/figma/img_22_background_border_shadow.png',
        },
        {
          id: 'cora-6',
          title: 'Commit Prompt Generation',
          description:
            'Generate a commit message with the Cora extension.',
          image: '/figma/img_23_background_border_shadow.png',
        },
      ],
    },
    {
      id: 'cora-cli',
      tabName: 'Cora CLI',
      productLabel: 'CodeMate Cora CLI',
      headline: 'Your terminal, with intelligence.',
      description:
        'Use natural language to work with your terminal, troubleshoot errors, and improve code without leaving the command line.',
      cards: [
        {
          id: 'cli-1',
          title: 'Natural Language Commands',
          description:
            'Describe what you want to do and get executable terminal commands without memorizing syntax.',
          image: '/figma/img_28_background_border_shadow.png',
        },
        {
          id: 'cli-2',
          title: 'Debug from the Terminal',
          description:
            'Investigate errors and get AI-assisted guidance to help diagnose and resolve issues.',
          image: '/figma/img_29_background_border_shadow.png',
        },
        {
          id: 'cli-3',
          title: 'Review & Improve Code',
          description:
            'Get code-review feedback and optimization suggestions from your command-line workflow.',
          image: '/figma/img_30_background_border_shadow.png',
        },
        {
          id: 'cli-4',
          title: 'Process Monitoring',
          description:
            'Monitor development processes and get suggestions based on errors printed to the console.',
          image: '/figma/img_31_figma_to_code.png',
        },
        {
          id: 'cli-5',
          title: 'Work in Your Existing Shell',
          description:
            'Access AI-assisted development from familiar terminal environments, including Bash, PowerShell, and Command Prompt.',
          image: '/figma/img_33_image_10.png',
        },
      ],
    },
    {
      id: 'academy',
      tabName: 'Academy',
      productLabel: 'CodeMate Academy',
      headline: 'Master Modern AI Development.',
      description:
        'AI-powered classroom management, curriculum pathways, and hands-on coding labs built for universities, educators, and aspiring software engineers.',
      cards: [
        {
          id: 'academy-1',
          title: 'Coding Playground',
          description:
            'Interactive notebook and editor support hands-on coding, debugging, and experimentation.',
          image: '/academy/academy-playground.png',
        },
        {
          id: 'academy-2',
          title: 'CodeMate Chatbot',
          description:
            'Built-in AI assistant helps students solve assignments and learn faster.',
          image: '/academy/academy-chatbot.png',
        },
        {
          id: 'academy-3',
          title: 'Offline Learning Support',
          description:
            'Resource syncing and local storage keep learning usable without internet.',
          image: '/academy/academy-offline-support.png',
        },
        {
          id: 'academy-4',
          title: 'Structured Courses',
          description:
            'Guided modules organize topics, resources, and progress into clear learning paths.',
          image: '/academy/academy-courses.png',
        },
        {
          id: 'academy-5',
          title: 'Certification Tracking',
          description:
            'Earn certifications that demonstrate industry-relevant skills and practical understanding of real-world enterprise workflows.',
          image: '/academy/academy-certification.png',
        },
      ],
    },
    {
      id: 'pr-review',
      tabName: 'PR Review Agent',
      productLabel: 'CodeMate PR Review Agent',
      headline: 'Every pull request, reviewed.',
      description:
        'Automate code reviews with actionable feedback on correctness, maintainability, security, and performance: directly in your pull request.',
      cards: [
        {
          id: 'pr-1',
          title: 'Automated PR Reviews',
          description:
            'Analyze pull requests and surface potential issues with structured, actionable feedback.',
          image: '/figma/img_24_image__15__1.png',
        },
        {
          id: 'pr-2',
          title: 'Security & Quality Checks',
          description:
            'Identify potential security concerns, code smells, complexity, and maintainability issues.',
          image: '/figma/img_25_image__15__1.png',
        },
        {
          id: 'pr-3',
          title: 'Actionable Improvements',
          description:
            'Get AI-generated suggestions to improve readability, performance, and coding practices.',
          image: '/figma/img_26_image__15__1.png',
        },
        {
          id: 'pr-4',
          title: 'PR Documentation',
          description:
            'Generate pull request descriptions, code walkthroughs, labels, and changelog updates.',
          image: '/figma/img_27_image__15__1.png',
        },
        {
          id: 'pr-5',
          title: 'Command-Driven Workflows',
          description:
            'Trigger reviews, tests, documentation, and targeted improvements directly through PR comments.',
          image: '/figma/img_25_image__15__1.png',
        },
      ],
    },
  ],
};

export interface SocialProofMetric {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface PartnerLogoItem {
  id: string;
  name: string;
  logo: string;
  className?: string;
}

export interface SocialProofSectionData {
  titleHighlight: string;
  titlePrefix: string;
  userCountValue: number;
  userCountSuffix: string;
  titleSuffix?: string;
  subtitle: string;
  metrics: SocialProofMetric[];
  partners: PartnerLogoItem[];
}

export const SOCIAL_PROOF_DATA: SocialProofSectionData = {
  titleHighlight: 'Trusted',
  titlePrefix: 'by',
  userCountValue: 100000,
  userCountSuffix: '+',
  titleSuffix: 'by 100,000+',
  subtitle: 'Developers across the globe and from startups to Fortune 500 companies',
  metrics: [
    {
      id: 'stat-coding',
      value: 55,
      suffix: '%',
      label: 'Faster coding',
    },
    {
      id: 'stat-quality',
      value: 39,
      suffix: '%',
      label: 'Improvement in code quality',
    },
    {
      id: 'stat-experience',
      value: 68,
      suffix: '%',
      label: 'Had a positive experience',
    },
  ],
  partners: [
    {
      id: 'dell',
      name: 'Dell',
      logo: 'dell.svg',
      className: 'object-contain size-[30vw] lg:size-[12vw] opacity-100 brightness-150 lg:mt-0 shrink-0',
    },
    {
      id: 'qual',
      name: 'Qualcomm',
      logo: 'qual.svg',
      className: 'object-contain w-[65vw] lg:w-[20vw] mb-[2vw] opacity-100 brightness-150 lg:mt-9 shrink-0',
    },
    {
      id: 'paytm',
      name: 'PayPal',
      logo: 'paytm.svg',
      className: 'object-contain w-[40vw] lg:w-[18vw] opacity-100 brightness-150 shrink-0',
    },
    {
      id: 'amazon',
      name: 'Amazon',
      logo: 'amazon.svg',
      className: 'object-contain w-[40vw] lg:w-[18vw] opacity-100 brightness-150 mt-5 lg:mt-10 shrink-0',
    },
    {
      id: 'fampay',
      name: 'FamPay',
      logo: 'fampay.svg',
      className: 'object-contain w-[45vw] lg:w-[20vw] opacity-100 brightness-150 shrink-0',
    },
    {
      id: 'inno',
      name: 'Innovaccer',
      logo: 'inno.svg',
      className: 'object-contain w-[50vw] lg:w-[20vw] opacity-100 brightness-150 shrink-0',
    },
    {
      id: 'maruti',
      name: 'Maruti Suzuki',
      logo: 'maruti-suzuki.svg',
      className: 'object-contain w-[64vw] lg:w-[26vw] opacity-100 brightness-150 shrink-0',
    },
    {
      id: 'atl',
      name: 'Atlassian',
      logo: 'atl.svg',
      className: 'object-contain w-[50vw] lg:w-[20vw] opacity-100 brightness-150 shrink-0',
    },
  ],
};

export interface EnterpriseArchitectureItem {
  id: string;
  title: string;
  subtitle: string;
}

export interface EnterpriseArchitectureGroup {
  id: string;
  category: string;
  columns: number;
  items: EnterpriseArchitectureItem[];
}

export interface EnterpriseArchitectureSectionData {
  titlePrefix: string;
  titleAccent: string;
  titleHighlight: string;
  backgroundImage: string;
  groups: EnterpriseArchitectureGroup[];
}

export const ENTERPRISE_ARCHITECTURE_DATA: EnterpriseArchitectureSectionData = {
  titlePrefix: 'From Legacy Systems to Next-Gen Apps :',
  titleAccent: 'CodeMate AI Accelerates',
  titleHighlight: 'Your Enterprise Journey.',
  backgroundImage: '/figma/img_11_image_5.png',
  groups: [
    {
      id: 'group-orchestration',
      category: 'Enterprise-Ready AI Orchestration',
      columns: 4,
      items: [
        {
          id: 'agent-orchestration',
          title: 'Agent Orchestration',
          subtitle: 'Coordinate AI agents across workflows',
        },
        {
          id: 'human-in-the-loop',
          title: 'Human-in-the-loop',
          subtitle: 'Human oversight and approvals',
        },
        {
          id: 'enterprise-integrations',
          title: 'Enterprise Integrations',
          subtitle: 'Connect tools and existing systems',
        },
        {
          id: 'shared-context',
          title: 'Shared Context & Knowledge',
          subtitle: 'Leverage organizational context',
        },
      ],
    },
    {
      id: 'group-toolbox',
      category: 'One Toolbox. Your Entire SDLC.',
      columns: 6,
      items: [
        {
          id: 'codemate-work',
          title: 'CodeMate Work',
          subtitle: 'AI-powered development workspace',
        },
        {
          id: 'codemate-build',
          title: 'CodeMate Build',
          subtitle: 'Design and prototype applications',
        },
        {
          id: 'codemate-cora',
          title: 'CodeMate CORA',
          subtitle: 'Autonomous coding agent',
        },
        {
          id: 'pr-review-agent',
          title: 'PR Review Agent',
          subtitle: 'Automated code review and quality checks',
        },
        {
          id: 'cora-cli',
          title: 'CORA-CLI',
          subtitle: 'AI-powered development in your terminal',
        },
        {
          id: 'codemate-academy',
          title: 'CodeMate Academy',
          subtitle: 'Master modern AI development with interactive labs',
        },
      ],
    },
    {
      id: 'group-infrastructure',
      category: 'Your Models. Your Infrastructure. Your Control.',
      columns: 3,
      items: [
        {
          id: 'on-premise',
          title: 'On-Premise',
          subtitle: 'Deploy within your own environment',
        },
        {
          id: 'hybrid',
          title: 'Hybrid',
          subtitle: 'Run workloads across private and public cloud environments.',
        },
        {
          id: 'cloud',
          title: 'Cloud',
          subtitle: 'Flexible, scalable deployment',
        },
      ],
    },
  ],
};

export interface WatchActionSectionData {
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  title: string;
  description: string;
  buttonText: string;
  youtubeVideoId: string;
}

export const WATCH_ACTION_DATA: WatchActionSectionData = {
  titlePrefix: 'Watch ',
  titleHighlight: 'CodeMate',
  titleSuffix: ' in Action',
  title: 'Watch CodeMate in Action',
  description:
    'From developers to non-developers, it acts like your autonomous team mate that assist you in shipping code with AI.',
  buttonText: 'Watch Video',
  youtubeVideoId: 'ux5jJgNkslE',
};

