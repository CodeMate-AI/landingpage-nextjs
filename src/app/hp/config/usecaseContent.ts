// Page content for /hp/usecases/[slug], keyed by the slug in hpUsecases.
// Kept apart from hpData.ts so this copy stays out of the /hp page bundle.

export interface UsecaseDetail {
  title: string;
  description: string;
}

export interface UsecaseSoftware {
  tag: string;
  name: string;
  description: string;
  linkLabel: string;
  url?: string;
}

export interface UsecaseContent {
  description: string;
  usecases: readonly UsecaseDetail[];
  benefits: readonly string[];
  softwares: readonly UsecaseSoftware[];
}

export const hpUsecaseContent: Readonly<Record<string, UsecaseContent>> = {
  manufacturing: {
    description:
      "Manufacturers need efficient ways to manage equipment, maintain product quality and coordinate production. Purpose-built software can streamline these operations, improve visibility and help teams make informed decisions.",
    usecases: [
      {
        title: "AI-Powered Maintenance Assistant",
        description:
          "Retrieve equipment manuals, error codes and service records through an AI-powered assistant that provides troubleshooting guidance. This helps maintenance teams investigate faults and manage repair requests more efficiently.",
      },
      {
        title: "Quality Inspection Dashboard",
        description:
          "Integrate computer vision models to identify potential product defects from inspection images. The dashboard records inspection results and highlights recurring quality issues for review.",
      },
      {
        title: "Production Planning & Monitoring System",
        description:
          "Manage production schedules, work orders and machine availability through a centralised platform. This helps teams track production progress, identify delays and monitor operations.",
      },
      {
        title: "Inventory and Material Tracking System",
        description:
          "Track raw materials, stock levels and material movement across production units. Low-stock alerts and inventory reports help teams manage supplies and avoid production disruptions.",
      },
      {
        title: "Supplier & Purchase Order Management System",
        description:
          "Maintain supplier records, manage purchase orders and track delivery schedules in one place. This helps procurement teams monitor orders and coordinate material supplies.",
      },
      {
        title: "Manufacturing Expense & Cost Tracking Dashboard",
        description:
          "Record production expenses, raw material costs and operational spending through a centralised dashboard. This helps managers monitor budgets and analyse manufacturing costs.",
      },
      {
        title: "Employee Training & Compliance Management Portal",
        description:
          "Manage employee training records, safety certifications and compliance documents. This helps organisations track training completion and maintain updated workforce records.",
      },
    ],
    benefits: [
      "Faster identification and resolution of equipment issues.",
      "Better visibility into production, inventory and material requirements.",
      "Reduced manual effort in invoice, supplier and purchase order management.",
      "Improved tracking of production costs and operational expenses.",
      "Better coordination of workforce training and compliance activities.",
    ],
    softwares: [
      {
        tag: "ERP Platform",
        name: "CoreSync - ERP",
        description:
          "An integrated business platform for managing inventory, sales, finance and operations. Its inventory and operational workflows are relevant to manufacturing resource coordination.",
        linkLabel: "Visit CoreSync",
        url: "https://erpsphere.codemate.build/",
      },
      {
        tag: "Support System",
        name: "SupportHub",
        description:
          "A ticket-management platform for reporting, assigning and tracking issues. These workflows are relevant to equipment maintenance requests and repair coordination.",
        linkLabel: "Visit SupportHub",
        url: "https://supporthub.codemate.build/",
      },
    ],
  },
  retail: {
    description:
      "Retail operations involve managing stock, processing supplier transactions and keeping sales and marketing activities organised. Efficient software can help retailers maintain product availability, track performance and streamline daily operations.",
    usecases: [
      {
        title: "AI-Powered Invoice and Purchase Order Verification",
        description:
          "Extract invoice details and compare them with purchase orders to identify incorrect prices, mismatched quantities and billing discrepancies. This helps retailers reduce manual verification and review errors faster.",
      },
      {
        title: "Inventory and Stock Discrepancy Management System",
        description:
          "Connect inventory, sales and purchasing records to identify differences between recorded and actual stock. Dashboards and alerts help teams investigate discrepancies and maintain accurate inventory.",
      },
      {
        title: "Customer Relationship Management (CRM) System",
        description:
          "Manage customer profiles, purchase history, enquiries and sales interactions in one place. This helps retailers organise customer relationships and streamline follow-ups.",
      },
      {
        title: "Retail Campaign and Marketing Management Platform",
        description:
          "Plan promotional campaigns, manage leads and track marketing activities across channels. Performance dashboards help teams monitor campaign results and identify effective strategies.",
      },
      {
        title: "Point-of-Sale (POS) and Billing Management System",
        description:
          "Process customer purchases, generate invoices and maintain transaction records through a centralised billing application. This helps retailers manage daily sales and track revenue.",
      },
      {
        title: "Returns and Refund Management System",
        description:
          "Record product returns, manage refund requests and track exchange status. This helps teams handle post-purchase requests and maintain clear transaction records.",
      },
      {
        title: "Retail Store Performance Dashboard",
        description:
          "Consolidate sales, revenue, product performance and store-level data into visual reports. This helps managers compare store performance and make informed business decisions.",
      },
    ],
    benefits: [
      "Improved inventory accuracy and reduced manual verification.",
      "Faster identification of invoice, billing and stock discrepancies.",
      "Better organisation of customer records and sales activities.",
      "Easier management of marketing campaigns, returns and refunds.",
      "Clearer visibility into sales performance and store operations.",
    ],
    softwares: [
      {
        tag: "CRM Platform",
        name: "Orbit CRM",
        description:
          "A CRM platform for managing customer records, companies, deals and sales pipelines, helping teams organise customer relationships and track sales progress.",
        linkLabel: "Visit Orbit CRM",
        url: "https://crmly.codemate.build/",
      },
      {
        tag: "Marketing Platform",
        name: "Growth Cloud",
        description:
          "A marketing platform for managing campaigns, generating leads and automating marketing activities, helping teams coordinate campaigns and monitor performance.",
        linkLabel: "Visit Growth Cloud",
        url: "https://growthcloud.codemate.build/",
      },
      {
        tag: "ERP Platform",
        name: "CoreSync - ERP",
        description:
          "An integrated business platform for managing inventory, sales, finance and operations, with workflows relevant to retail stock and operational management.",
        linkLabel: "Visit CoreSync",
        url: "https://erpsphere.codemate.build/",
      },
    ],
  },
  healthcare: {
    description:
      "Healthcare providers aim to deliver timely, reliable care while managing patient information, administrative tasks and hospital resources. Efficient systems can simplify these processes, reduce administrative workload and help healthcare teams focus more on patient care.",
    usecases: [
      {
        title: "AI-Assisted Healthcare Document Processing",
        description:
          "Extract details from patient forms, insurance claims and medical reports using document-processing models. This helps staff organise records, identify missing information and reduce manual data entry.",
      },
      {
        title: "Hospital Support and Equipment Management System",
        description:
          "Record IT issues, equipment faults and facility-related requests, then assign them to the relevant teams. This helps hospitals track requests and monitor resolution progress.",
      },
      {
        title: "Healthcare Staff Verification Portal",
        description:
          "Manage staff verification requests, employment records and supporting credentials through a centralised portal. This helps HR teams organise documentation and track verification status.",
      },
      {
        title: "Patient Appointment Management System",
        description:
          "Manage patient bookings, doctor schedules and follow-up appointments through a centralised application. Automated reminders help reduce missed appointments and scheduling conflicts.",
      },
      {
        title: "Patient Records Management System",
        description:
          "Maintain patient profiles, visit history, prescriptions and medical documents in an organised digital system. This helps authorised healthcare staff access relevant records when needed.",
      },
      {
        title: "Medical Inventory and Pharmacy Management System",
        description:
          "Track medicines, medical supplies, stock levels and expiry dates across hospital stores and pharmacies. Low-stock and expiry alerts help teams manage inventory more effectively.",
      },
      {
        title: "Hospital Staff and Shift Management Dashboard",
        description:
          "Organise staff schedules, department assignments, attendance and shift availability through a centralised dashboard. This helps hospital administrators coordinate workforce requirements.",
      },
    ],
    benefits: [
      "Reduced manual effort in document processing and staff verification.",
      "Better coordination of hospital support requests and equipment issues.",
      "More organised patient records and appointment schedules.",
      "Improved tracking of medical supplies and medicine inventory.",
      "Better visibility into staff availability and hospital operations.",
    ],
    softwares: [
      {
        tag: "Verification Portal",
        name: "Employee Verification Portal",
        description:
          "Manages employee verification requests and work history checks, relevant to healthcare staff onboarding and credential verification.",
        linkLabel: "Visit Employee Verification Portal",
        url: "https://ex-employee-verification-portal.codemate.build/",
      },
      {
        tag: "Support System",
        name: "SupportHub",
        description:
          "Helps teams report, assign and track issues, with workflows relevant to hospital IT support, equipment maintenance and facility management.",
        linkLabel: "Visit SupportHub",
        url: "https://supporthub.codemate.build/",
      },
    ],
  },
  "automotive-robotics": {
    description:
      "Automotive and robotics teams need efficient ways to troubleshoot technical issues, access service documentation and manage equipment maintenance. Software applications can simplify these processes, improve access to relevant information and streamline maintenance workflows.",
    usecases: [
      {
        title: "AI-Powered Vehicle Service Assistant",
        description:
          "Retrieve repair manuals, diagnostic error codes and service records through an AI-powered assistant that provides troubleshooting guidance. This helps technicians find relevant information and investigate vehicle issues faster.",
      },
      {
        title: "Robotics Fault and Maintenance Management System",
        description:
          "Record equipment faults, analyse error logs and track maintenance activities through a centralised platform. This helps teams monitor recurring issues and coordinate repairs.",
      },
      {
        title: "Vehicle Inspection and Service History Portal",
        description:
          "Maintain vehicle inspection reports, repair details and service histories in one place. This helps service centres track completed work and access previous records easily.",
      },
      {
        title: "Spare Parts and Inventory Management System",
        description:
          "Track spare parts, replacement components, stock levels and usage across workshops and robotics facilities. Low-stock alerts help teams manage replenishment requirements.",
      },
      {
        title: "Vehicle Service Booking and Workshop Management System",
        description:
          "Manage customer appointments, service requests, technician assignments and repair status through a centralised application. This helps workshops organise daily service operations.",
      },
      {
        title: "Warranty and Claims Management Portal",
        description:
          "Record warranty details, manage claim requests and track approval status for vehicles and equipment. This helps service teams organise claims and monitor their progress.",
      },
      {
        title: "Robotics Operations Monitoring Dashboard",
        description:
          "Monitor robot status, task assignments, operational logs and reported errors through a centralised dashboard. This helps teams track ongoing activities and identify equipment requiring attention.",
      },
    ],
    benefits: [
      "Faster access to technical information and vehicle service records.",
      "Better tracking of equipment faults, repairs and inspections.",
      "Improved visibility into spare parts and inventory levels.",
      "Easier management of workshop schedules and warranty claims.",
      "Better monitoring of robotics operations and equipment status.",
    ],
    softwares: [
      {
        tag: "HR Platform",
        name: "HRMS",
        description:
          "A centralised platform for managing employee records, attendance, leave requests, payroll and workforce operations. It helps automotive and robotics organisations coordinate their workforce, manage employee-related activities and streamline administrative processes.",
        linkLabel: "Visit HRMS",
        url: "https://hrms-community.codemate.build/",
      },
      {
        tag: "Support System",
        name: "SupportHub",
        description:
          "An enterprise helpdesk platform for managing support tickets through secure authentication, workspaces, real-time synchronisation and role-based workflows. Its ticket-management features are relevant to tracking vehicle service requests and robotics maintenance issues.",
        linkLabel: "Visit SupportHub",
        url: "https://supporthub.codemate.build/",
      },
    ],
  },
  "smart-cities": {
    description:
      "From resolving civic complaints to maintaining roads, streetlights and waste collection services, city authorities manage a wide range of public services. Software applications can bring these activities together, making it easier to track issues, coordinate departments and monitor progress.",
    usecases: [
      {
        title: "Civic Issue Tracking and Resolution System",
        description:
          "Record public complaints about damaged roads, faulty street lights and other civic issues, then assign them to the relevant departments. This helps authorities track requests and monitor resolution progress.",
      },
      {
        title: "Public Infrastructure Management System",
        description:
          "Maintain records of roads, streetlights, drainage networks and other public assets, including inspection and repair history. This helps municipal teams organise maintenance activities.",
      },
      {
        title: "Traffic and Road Incident Management Dashboard",
        description:
          "Record accidents, road closures and traffic-related incidents, along with their location and status. This helps authorities coordinate responses and monitor ongoing incidents.",
      },
      {
        title: "Waste Collection and Monitoring System",
        description:
          "Manage waste collection schedules, service requests, missed pickups and task assignments across different areas. This helps municipal teams monitor collection activities and track completion.",
      },
      {
        title: "Public Transport Management Dashboard",
        description:
          "Manage bus routes, schedules, vehicle assignments and service updates through a centralised platform. This helps transport authorities coordinate operations and monitor service performance.",
      },
      {
        title: "Water Supply and Complaint Management System",
        description:
          "Track water supply schedules, reported leaks, service interruptions and maintenance requests across different areas. This helps authorities organise repair activities and monitor unresolved complaints.",
      },
      {
        title: "Municipal Tax and Payment Management Portal",
        description:
          "Manage property tax records, payment details, outstanding dues and digital payment records. This helps municipal departments organise collections and track payment status.",
      },
    ],
    benefits: [
      "Faster tracking and resolution of civic complaints.",
      "Easier access to infrastructure and maintenance records.",
      "Better coordination of traffic, transport and municipal services.",
      "Improved monitoring of waste collection and water supply activities.",
      "More organised municipal records and payment tracking.",
    ],
    softwares: [
      {
        tag: "HR Platform",
        name: "HRMS: Department & Workforce Management",
        description:
          "A centralised platform for managing employee records, attendance, leave requests, payroll and staff operations. It helps municipal departments organise workforce information, streamline administrative processes and coordinate employee-related activities.",
        linkLabel: "Visit HRMS",
        url: "https://hrms-community.codemate.build/",
      },
      {
        tag: "Municipal Platform",
        name: "CityPulse",
        description:
          "A municipal management platform that helps city authorities register and manage public complaints, assign issues to relevant departments, coordinate staff and monitor resolution progress. It provides a centralised dashboard for tracking civic issues, analysing department performance and improving the efficiency of public service operations.",
        linkLabel: "Visit CityPulse",
        url: "https://citypulse.codemate.build/",
      },
    ],
  },
  "energy-utilities": {
    description:
      "Energy providers rely on software to manage utility operations, monitor infrastructure and maintain reliable services. Well-developed applications can simplify operational workflows, improve system maintenance and help engineering teams manage software updates more effectively.",
    usecases: [
      {
        title: "Legacy Utility Software Modernisation",
        description:
          "Analyse existing codebases, generate technical documentation and refactor legacy applications to make them easier to maintain. This helps utility providers modernise older software and simplify future updates.",
      },
      {
        title: "Automated Testing for Utility Software",
        description:
          "Generate test cases and automate checks for billing, smart metering and asset management applications. This helps identify potential errors and regressions before software updates are released.",
      },
      {
        title: "Energy Consumption Forecasting Dashboard",
        description:
          "Analyse historical usage and weather data using forecasting models to estimate future electricity demand. This helps utility providers plan energy supply and monitor consumption trends.",
      },
      {
        title: "Utility Asset Management System",
        description:
          "Maintain records of transformers, power lines and other infrastructure, including inspection schedules and repair history. This helps teams organise asset maintenance and track equipment conditions.",
      },
      {
        title: "Electricity Billing and Payment Management System",
        description:
          "Manage consumer accounts, billing records, meter readings and payment history through a centralised platform. This helps utility providers track outstanding bills and organise payment records.",
      },
      {
        title: "Power Outage and Fault Management Dashboard",
        description:
          "Record power outages, equipment faults, affected locations and restoration updates. This helps utility teams coordinate repair activities and monitor service restoration.",
      },
      {
        title: "Field Workforce and Maintenance Scheduling System",
        description:
          "Assign field engineers to inspections, repair requests and maintenance tasks based on location and availability. This helps teams coordinate field activities and track job completion.",
      },
    ],
    benefits: [
      "Easier maintenance and modernisation of existing utility software.",
      "Earlier identification of software errors and potential regressions.",
      "Better visibility into energy consumption and demand trends.",
      "Improved tracking of infrastructure, faults and maintenance activities.",
      "More organised billing, payment and field operations.",
    ],
    softwares: [
      {
        tag: "Energy Platform",
        name: "VoltEdge",
        description:
          "An energy operations platform for managing utility assets, tracking faults, coordinating maintenance work orders and inspections, and monitoring energy consumption. It brings essential utility workflows and operational insights together through a centralised dashboard.",
        linkLabel: "Visit VoltEdge",
        url: "https://voltedge.codemate.build/",
      },
      {
        tag: "Billing Platform",
        name: "GridPay: Utility Billing & Consumer Management",
        description:
          "A platform for managing consumer accounts, recording meter readings, generating electricity bills and tracking payments. It provides a centralised dashboard for monitoring revenue, outstanding dues and billing operations.",
        linkLabel: "Visit GridPay",
        url: "https://gridpay.codemate.build/",
      },
    ],
  },
};
