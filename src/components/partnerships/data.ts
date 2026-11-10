export type PartnershipItem = { label: string; text: string };

export type PartnershipSection = {
  heading: string;
  paragraphs: string[];
  items?: PartnershipItem[];
  closing?: string[];
};

export type StackDiagram = {
  type: 'stack';
  title: string;
  description: string;
  /** Top to bottom: what gets built sits on top, infrastructure at the base */
  layers: { owner: string; role: string; items: string[]; highlight?: boolean }[];
};

export type WorkloadDiagram = {
  type: 'workload';
  title: string;
  description: string;
  engines: string[];
  rows: { task: string; uses: string[]; note?: string }[];
  caption?: string;
};

export type PartnershipDiagram = StackDiagram | WorkloadDiagram;

export type Partnership = {
  slug: string;
  partner: string;
  /** Full title, used for metadata */
  title: string;
  /** Small line above the h1, e.g. "CodeMate AI × HPE" */
  partnerLine: string;
  /** The h1 */
  headline: string;
  subtitle: string;
  cover: string;
  coverAlt: string;
  lead: string;
  sections: PartnershipSection[];
  metaDescription: string;
  diagram?: PartnershipDiagram;
  /** Index of the section the diagram follows; omit to place it right after the lead */
  diagramAfter?: number;
};

export const hpePartnership: Partnership = {
  slug: 'hpe',
  partner: 'HPE',
  title: 'CodeMate AI × HPE: Powering Enterprise Software Innovation',
  partnerLine: 'CodeMate AI × HPE',
  headline: 'Powering enterprise software innovation',
  diagram: {
    type: 'stack',
    title: 'How the stack fits together',
    description:
      'HPE provides the computing foundation, CodeMate AI helps teams build on it, and the result is software shaped around each business.',
    layers: [
      {
        owner: 'Your business',
        role: 'What gets built',
        items: [
          'Business process automation',
          'Enterprise resource planning',
          'Data and reporting',
          'AI-powered applications',
          'Legacy modernization',
        ],
      },
      {
        owner: 'CodeMate AI',
        role: 'How it gets built',
        items: ['Work', 'Build', 'CORA', 'CORA CLI', 'PR Review Agent'],
        highlight: true,
      },
      {
        owner: 'HPE',
        role: 'Where it runs',
        items: ['Compute', 'GPU-accelerated computing', 'Storage', 'Networking', 'Private cloud'],
      },
    ],
  },
  subtitle:
    'As businesses adopt AI and modernize their operations, they need technology that can support both their infrastructure requirements and software development needs. Building effective digital solutions requires a reliable computing foundation, along with the tools and expertise to turn business ideas into working applications.',
  cover: '/partners/hpe-cover.png',
  coverAlt: 'CodeMate AI and HPE logos',
  lead:
    'The collaboration between Hewlett Packard Enterprise (HPE) and CodeMate AI brings these capabilities together. HPE provides enterprise infrastructure to support computing and AI workloads, while CodeMate offers an AI-powered software development platform that helps organizations create applications and solutions around their business requirements.',
  metaDescription:
    'HPE and CodeMate AI bring enterprise infrastructure and AI-powered software development together to help organizations build solutions around their business requirements.',
  sections: [
    {
      heading: 'HPE: The infrastructure behind enterprise solutions',
      paragraphs: [
        'Modern applications require reliable computing resources to process data, run services and support demanding workloads. As organizations adopt AI, these requirements can also include GPU-powered processing and scalable infrastructure.',
        'HPE offers enterprise technology across several areas:',
      ],
      items: [
        { label: 'Compute', text: 'Servers and computing systems that provide the processing power required to run applications and workloads.' },
        { label: 'GPU-accelerated computing', text: 'Infrastructure designed to handle demanding AI and data-intensive workloads.' },
        { label: 'Storage and data management', text: 'Solutions for storing, accessing and managing business data.' },
        { label: 'Networking', text: 'Infrastructure that connects applications, systems and enterprise environments.' },
        { label: 'Private cloud', text: 'Environments that give organizations greater control over how their applications and workloads are hosted and managed.' },
      ],
      closing: [
        'These capabilities provide the underlying technology foundation that organizations can use to support their software and AI initiatives.',
      ],
    },
    {
      heading: 'CodeMate AI: From development assistance to complete software solutions',
      paragraphs: [
        'CodeMate AI brings AI-powered capabilities into the software development lifecycle (SDLC), helping developers move from understanding requirements and existing codebases to building, testing and improving applications.',
        'Its product ecosystem supports different parts of this process:',
      ],
      items: [
        { label: 'Work', text: 'An AI-powered workspace for interacting with codebases, exploring technical questions, understanding projects and getting development assistance.' },
        { label: 'Build', text: 'Helps turn ideas and requirements into functional application prototypes and software solutions through AI-assisted development.' },
        { label: 'CORA', text: 'An autonomous IDE agent that works within the development environment to understand code, implement changes and assist with development tasks.' },
        { label: 'CORA CLI', text: 'An agentic coding tool that runs directly in the terminal, allowing developers to interact with AI to understand, modify, debug and work across entire codebases.' },
        { label: 'PR Review Agent', text: 'Helps review pull requests, identify potential issues and improve code quality before changes are merged.' },
      ],
      closing: [
        'Together, these capabilities help development teams work across different stages of software creation, from initial planning and prototyping to implementation and code review.',
      ],
    },
    {
      heading: 'Bringing infrastructure and software development together',
      paragraphs: [
        'The collaboration connects two important parts of enterprise technology: the infrastructure required to run applications and the software development capabilities needed to create them.',
        "For example, consider an organization looking to develop an AI-powered application to improve an internal business process. HPE's infrastructure can provide the computing environment required to support the solution, while CodeMate can help development teams build the application according to the organization's workflows and technical requirements.",
        'This approach brings infrastructure and software development into the same solution journey, with the implementation shaped around the needs of each customer.',
      ],
    },
    {
      heading: 'From business challenges to practical solutions',
      paragraphs: [
        'Every business has processes that can be improved through technology, but the requirements are rarely the same. Some organizations need better ways to manage internal operations, while others may want to automate existing workflows or develop applications around their business processes.',
        "With HPE's infrastructure capabilities and CodeMate's AI-powered development tools, these requirements can be approached through solutions designed around each organization's needs. From developing internal business applications to modernizing existing systems, the focus is on addressing practical challenges rather than offering one solution for every business.",
      ],
    },
    {
      heading: 'Applications across enterprise workflows',
      paragraphs: [
        'Different organizations have different operational challenges. The combination of enterprise infrastructure and AI-powered software development can support the creation of solutions across a range of business areas.',
        'Some potential applications include:',
      ],
      items: [
        { label: 'Business process automation', text: 'Applications that digitize repetitive tasks, manage approvals and streamline internal workflows.' },
        { label: 'Enterprise resource planning', text: 'Customized systems for managing business operations, resources, records and organizational activities.' },
        { label: 'Data and reporting applications', text: 'Solutions that bring business data together, generate reports and help teams access relevant information.' },
        { label: 'AI-powered business applications', text: 'Software that uses AI to process information, assist users and support decision-making.' },
        { label: 'Legacy system modernization', text: 'Updating existing applications, improving their functionality and extending their capabilities to meet changing requirements.' },
      ],
    },
    {
      heading: 'Enabling the next phase of enterprise software development',
      paragraphs: [
        'The collaboration between HPE and CodeMate AI brings together enterprise infrastructure and AI-powered software development to address the changing technology needs of businesses.',
        'With HPE providing the computing foundation and CodeMate enabling development teams to create customized software, organizations can explore new ways to develop and implement solutions that support their operations.',
        'As businesses continue to invest in AI and digital transformation, this collaboration creates opportunities to turn infrastructure capabilities and software innovation into practical outcomes.',
      ],
    },
  ],
};

export const qualcommPartnership: Partnership = {
  slug: 'qualcomm',
  partner: 'Qualcomm',
  title: 'CodeMate AI × Qualcomm: Transforming the Developer Experience with On-Device Intelligence',
  partnerLine: 'CodeMate AI × Qualcomm',
  headline: 'Transforming the developer experience with on-device intelligence',
  diagramAfter: 2,
  diagram: {
    type: 'workload',
    title: 'Where each task runs',
    description: 'On Snapdragon X Series devices, CodeMate routes each AI task to the hardware best suited to it.',
    engines: ['CPU', 'GPU', 'NPU'],
    rows: [
      { task: 'Code autocompletion', uses: ['NPU'], note: 'Under 50 ms' },
      { task: 'Token generation and embeddings search', uses: ['NPU'] },
      { task: 'Larger context processing', uses: ['CPU', 'NPU'] },
    ],
    caption:
      "Workloads are distributed across the CPU, GPU and NPU depending on the task and the device's power and thermal conditions.",
  },
  subtitle:
    "Qualcomm's expertise in advanced computing and AI processing, combined with CodeMate AI's capabilities in intelligent software development, brings AI-powered coding assistance closer to developers.",
  cover: '/partners/qualcomm-cover.png',
  coverAlt: 'CodeMate AI and Qualcomm logos',
  lead:
    'Through this collaboration, we have optimized CodeMate for Windows on Snapdragon, enabling context-aware AI assistance and local processing on Snapdragon-powered devices while delivering a more responsive development experience.',
  metaDescription:
    'CodeMate AI is optimized for Windows on Snapdragon, bringing context-aware, on-device AI coding assistance to developers on Snapdragon-powered devices.',
  sections: [
    {
      heading: 'Bringing AI closer to software developers',
      paragraphs: [
        'AI is changing how developers write, understand and maintain software. From generating code and debugging errors to working with complex codebases, AI-powered coding assistants are becoming an important part of modern development workflows.',
        'However, many of these tools depend on cloud infrastructure to process developer requests. This can create concerns around data privacy, network dependency and the handling of sensitive source code.',
        'On-device AI offers another approach by bringing model inference closer to the developer. With CodeMate optimized for Windows on Snapdragon, developers can access AI-powered coding assistance directly on their devices, with support for local processing and greater control over their development data.',
      ],
    },
    {
      heading: "Combining Snapdragon technology with CodeMate's AI capabilities",
      paragraphs: [
        "CodeMate uses Qualcomm's AI technologies to make better use of the computing resources available on Snapdragon X Series devices. Its AI workloads can run across the CPU, GPU and NPU, depending on the processing requirements.",
        'This allows different development tasks to use the hardware best suited to them, helping CodeMate deliver AI assistance while balancing performance and power efficiency.',
      ],
    },
    {
      heading: 'Engineering AI for on-device development',
      paragraphs: [
        'Getting an AI coding assistant to run efficiently on a local device requires optimizing both the software architecture and the way AI models use available hardware. To support CodeMate on Windows on Snapdragon, our engineering team developed a separate middleware layer that manages model requests, task priorities and project context directly on the device.',
        "We also optimized our in-house language models for Snapdragon X Series processors and used Qualcomm's AI development tools to run key operations, such as token generation and embeddings search, on the NPU.",
        "CodeMate can dynamically distribute AI workloads across the CPU, GPU and NPU depending on the task and the device's power and thermal conditions. For example, smaller tasks like code autocompletion can prioritize NPU processing, delivering responses in under 50 milliseconds, while larger context processing tasks can use a combination of CPU and NPU resources to handle more information efficiently.",
      ],
    },
    {
      heading: 'A more context-aware development experience',
      paragraphs: [
        'CodeMate goes beyond basic code suggestions by helping developers work with the context of their entire projects. Instead of relying only on the information available within an AI model, it can use project files, documentation and organizational knowledge to provide more relevant assistance.',
        'Its VS Code extension on Snapdragon offers several development capabilities:',
      ],
      items: [
        { label: 'Codebase search and understanding', text: 'Search entire codebases and understand complex projects through natural language conversations.' },
        { label: 'Context-aware code generation', text: 'Generate code using information from files, folders, terminals, errors, Git commits, pull requests and API documentation.' },
        { label: 'Code modification and debugging', text: 'Make changes to existing codebases and identify issues with AI assistance.' },
        { label: 'Automated testing and documentation', text: 'Generate test cases, review code and create technical documentation.' },
        { label: 'Knowledge base integration', text: 'Connect personal and organizational knowledge bases containing documentation, Git repositories, codebases and Swagger specifications.' },
      ],
    },
    {
      heading: 'Privacy and productivity through local AI',
      paragraphs: [
        "One of the key advantages of running AI locally is that developers can work with sensitive project information without having to send every request to cloud-based services. With CodeMate's supported on-device workflows, source code, documentation and organizational knowledge can be processed locally, giving organizations greater control over their development data.",
        'CodeMate supports both on-device and hybrid AI execution, allowing workloads to be handled locally or in the cloud according to their requirements. This helps balance response times, processing needs and power consumption.',
        'By reducing dependence on cloud connectivity for supported workloads, this approach also allows developers to access AI assistance in offline or low-connectivity environments. For organizations handling confidential code and business information, local processing can help reduce exposure to cloud-based security risks and support data privacy requirements.',
      ],
    },
    {
      heading: 'Advancing the future of AI-powered software development',
      paragraphs: [
        'Qualcomm brings the computing technologies and hardware expertise needed to run AI workloads efficiently on devices, while CodeMate brings the software intelligence that helps developers understand codebases, write code and manage complex development tasks. Together, these capabilities create opportunities to take AI-powered software development beyond traditional cloud-based tools.',
        'Looking ahead, this collaboration can open new possibilities for bringing more advanced AI development capabilities to Snapdragon-powered devices. From working with larger codebases to supporting more development tasks locally, the focus is on making AI assistance a more natural part of how developers build software.',
        'As computing and AI continue to evolve, Qualcomm and CodeMate AI aim to contribute to a future where developers have more powerful, flexible and intelligent tools right at their fingertips.',
      ],
    },
  ],
};

export type PartnershipCard = {
  href: string;
  cover: string;
  alt: string;
  title: string;
};

// Cards shown on the /partnerships hub, in display order
export const partnershipCards: PartnershipCard[] = [
  {
    href: '/partnerships/hp',
    cover: '/partners/hp-cover.png',
    alt: 'CodeMate AI and HP logos',
    title: 'HP and CodeMate AI bring AI-powered coding to HP partners and their customers',
  },
  {
    href: '/partnerships/hpe',
    cover: hpePartnership.cover,
    alt: hpePartnership.coverAlt,
    title: 'CodeMate AI and HPE power enterprise software innovation',
  },
  {
    href: '/partnerships/qualcomm',
    cover: qualcommPartnership.cover,
    alt: qualcommPartnership.coverAlt,
    title: 'CodeMate AI and Qualcomm bring on-device intelligence to developers',
  },
];
