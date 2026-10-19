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
      name: 'Work',
      description:
        'Turns deep research and feasibility into production-ready code through AI-driven intelligence.',
      logo: '/logos/brand/codemate-work-logo.png',
      previewImage: '/work/work-preview-toolbox.png',
      link: 'https://app.codemate.ai/chat',
      isExternal: true,
    },
    {
      id: 'build',
      name: 'Build',
      description:
        'Turns prompts and Figma designs into deployable apps instantly with full design mode support.',
      logo: '/logos/brand/codemate-build-logo.png',
      previewImage: '/build/build-preview-toolbox.png',
      link: 'http://build.codemate.ai/',
      isExternal: true,
    },
    {
      id: 'cora',
      name: 'Cora',
      description:
        'End-to-end AI coding agent for writing, securing, and quality-gating code directly in your IDE.',
      logo: '/logos/brand/codemate-cora-logo.png',
      previewImage: '/cora/cora-preview-toolbox.png',
      link: 'https://marketplace.visualstudio.com/items?itemName=CodeMateAI.codemate-agent',
      isExternal: true,
    },
    {
      id: 'cora-cli',
      name: 'Cora CLI',
      description:
        'Run code and scripts instantly through an AI-powered command-line interface directly in your terminal.',
      logo: '/logos/brand/codemate-cora-logo.png',
      previewImage: '/cora-cli/cora-cli-preview-toolbox.png',
      link: 'https://cli.codemate.ai/',
      isExternal: true,
    },
    {
      id: 'pr-review',
      name: 'PR Review Agent',
      description:
        'Automates code reviews and security analysis across GitHub, GitLab, Bitbucket, and Azure DevOps.',
      logo: '/logos/brand/codemate-pr-review-logo.svg',
      previewImage: '/pr-review/pr-review-preview-toolbox.png',
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
          image: '/work/work-rules-context.png',
        },
        {
          id: 'work-2',
          title: 'Connected Tools',
          description:
            'Connect external services through MCP to bring relevant information and workflows into Work.',
          image: '/work/work-connected-tools.png',
        },
        {
          id: 'work-3',
          title: 'Research & Explore',
          description:
            'Investigate ideas, explore possibilities, and gather the context you need before making decisions.',
          image: '/work/work-research-explore.png',
        },
        {
          id: 'work-4',
          title: 'Resources & Knowledge',
          description:
            'Organize files, documents, and project resources in one searchable workspace.',
          image: '/work/work-resources-knowledge.png',
        },
        {
          id: 'work-5',
          title: 'Requirements to Plans',
          description:
            'Structure requirements into clear scopes, deliverables, and actionable next steps.',
          image: '/work/work-requirements-to-plans.png',
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
          image: '/build/build-prompt-to-app.png',
        },
        {
          id: 'build-2',
          title: 'Design-to-Code',
          description:
            'Translate visual designs into working interfaces and code.',
          image: '/build/build-figma-to-code.png',
        },
        {
          id: 'build-3',
          title: 'Design Mode',
          description:
            'Explore and refine interface ideas while shaping the experience you want to build.',
          image: '/build/build-design-mode.png',
        },
        {
          id: 'build-4',
          title: 'Rapid Prototyping',
          description:
            'Move from an early concept to a working prototype without building everything from scratch.',
          image: '/build/build-rapid-prototyping.png',
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
          image: '/cora/cora-codebase-understanding.png',
        },
        {
          id: 'cora-2',
          title: 'Agentic Coding',
          description:
            'Delegate coding tasks to an AI agent that can help implement changes across your project.',
          image: '/cora/cora-agentic-coding.png',
        },
        {
          id: 'cora-3',
          title: 'Debug & Fix',
          description:
            'Identify syntax, logical, and runtime issues, understand their causes, and work toward targeted fixes.',
          image: '/cora/cora-debug-fix.png',
        },
        {
          id: 'cora-4',
          title: 'Refactor & Optimize',
          description:
            'Improve code quality, readability, and efficiency with context-aware suggestions.',
          image: '/cora/cora-refactor-optimize.png',
        },
        {
          id: 'cora-5',
          title: 'Test Generation',
          description:
            'Generate unit tests for your code and inspect results to validate implementation behavior.',
          image: '/cora/cora-test-generation.png',
        },
        {
          id: 'cora-6',
          title: 'Commit Prompt Generation',
          description:
            'Generate a commit message with the Cora extension.',
          image: '/cora/cora-commit-prompt-generation.png',
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
          image: '/cora-cli/cora-cli-natural-language-commands.png',
        },
        {
          id: 'cli-2',
          title: 'Debug from the Terminal',
          description:
            'Investigate errors and get AI-assisted guidance to help diagnose and resolve issues.',
          image: '/cora-cli/cora-cli-debug-terminal.png',
        },
        {
          id: 'cli-3',
          title: 'Review & Improve Code',
          description:
            'Get code-review feedback and optimization suggestions from your command-line workflow.',
          image: '/cora-cli/cora-cli-review-improve.png',
        },
        {
          id: 'cli-4',
          title: 'Process Monitoring',
          description:
            'Monitor development processes and get suggestions based on errors printed to the console.',
          image: '/cora-cli/cora-cli-process-monitoring.png',
        },
        {
          id: 'cli-5',
          title: 'Work in Your Existing Shell',
          description:
            'Access AI-assisted development from familiar terminal environments, including Bash, PowerShell, and Command Prompt.',
          image: '/cora-cli/cora-cli-existing-shell.png',
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
          image: '/pr-review/pr-automated-reviews.png',
        },
        {
          id: 'pr-2',
          title: 'Security & Quality Checks',
          description:
            'Identify potential security concerns, code smells, complexity, and maintainability issues.',
          image: '/pr-review/pr-security-quality.png',
        },
        {
          id: 'pr-3',
          title: 'Actionable Improvements',
          description:
            'Get AI-generated suggestions to improve readability, performance, and coding practices.',
          image: '/pr-review/pr-actionable-improvements.png',
        },
        {
          id: 'pr-4',
          title: 'PR Documentation',
          description:
            'Generate pull request descriptions, code walkthroughs, labels, and changelog updates.',
          image: '/pr-review/pr-documentation.png',
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
      logo: '/logos/partners/dell.svg',
      className: 'object-contain size-[30vw] lg:size-[12vw] opacity-100 brightness-150 lg:mt-0 shrink-0',
    },
    {
      id: 'qual',
      name: 'Qualcomm',
      logo: '/logos/partners/qualcomm.svg',
      className: 'object-contain w-[65vw] lg:w-[20vw] mb-[2vw] opacity-100 brightness-150 lg:mt-9 shrink-0',
    },
    {
      id: 'paytm',
      name: 'PayPal',
      logo: '/logos/partners/paytm.svg',
      className: 'object-contain w-[40vw] lg:w-[18vw] opacity-100 brightness-150 shrink-0',
    },
    {
      id: 'amazon',
      name: 'Amazon',
      logo: '/logos/partners/amazon.svg',
      className: 'object-contain w-[40vw] lg:w-[18vw] opacity-100 brightness-150 mt-5 lg:mt-10 shrink-0',
    },
    {
      id: 'fampay',
      name: 'FamPay',
      logo: '/logos/partners/fampay.svg',
      className: 'object-contain w-[45vw] lg:w-[20vw] opacity-100 brightness-150 shrink-0',
    },
    {
      id: 'inno',
      name: 'Innovaccer',
      logo: '/logos/partners/innovaccer.svg',
      className: 'object-contain w-[50vw] lg:w-[20vw] opacity-100 brightness-150 shrink-0',
    },
    {
      id: 'maruti',
      name: 'Maruti Suzuki',
      logo: '/logos/partners/maruti-suzuki.svg',
      className: 'object-contain w-[64vw] lg:w-[26vw] opacity-100 brightness-150 shrink-0',
    },
    {
      id: 'atl',
      name: 'Atlassian',
      logo: '/logos/partners/atlassian.svg',
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
  backgroundImage: '/enterprise-architecture/enterprise-architecture-bg.png',
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
      columns: 5,
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
          id: 'cora-cli',
          title: 'CORA-CLI',
          subtitle: 'AI-powered development in your terminal',
        },
        {
          id: 'pr-review-agent',
          title: 'PR Review Agent',
          subtitle: 'Automated code review and quality checks',
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

