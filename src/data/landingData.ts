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
