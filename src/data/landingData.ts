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
      id: 'academy',
      name: 'CodeMate Academy',
      description:
        'AI-powered classroom management, curriculum pathways, and hands-on coding labs for modern developers.',
      logo: '/academy_logo.svg',
      previewImage: '/Codemate Education Static.png',
      link: 'https://edu.codemate.ai/',
      isExternal: true,
    },
    {
      id: 'pr-review',
      name: 'CodeMate PR Review Agent',
      description:
        'Automates code reviews and security analysis across GitHub, GitLab, Bitbucket, and Azure DevOps.',
      logo: '/pr_logo.svg',
      previewImage: '/figma/img_4_codemate_c0.png',
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
          image: '/figma/img_14_screenshot_2026-10-10_at_2_09_.png',
        },
        {
          id: 'build-2',
          title: 'Design-to-Code',
          description:
            'Translate visual designs into working interfaces and code.',
          image: '/figma/img_15_figma_to_code.png',
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
          title: 'Interactive AI Labs',
          description:
            'Real-time automated grading, intelligent code suggestions, and guided problem solving for students.',
          image: '/Codemate Education Static.png',
        },
        {
          id: 'academy-2',
          title: 'University & Enterprise MoUs',
          description:
            'Partnered with leading institutions like GLA University to bridge academic training with industry-ready AI development.',
          image: '/GLA_MOU.jpg',
        },
        {
          id: 'academy-3',
          title: 'Comprehensive Curriculums',
          description:
            'From software engineering fundamentals to advanced LLM-powered autonomous agent architectures.',
          image: '/Codemate Education Static.png',
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
