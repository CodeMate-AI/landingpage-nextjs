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
        title: "Production Planning and Monitoring System",
        description:
          "Manage production schedules, work orders and machine availability through a centralised platform. This helps teams track production progress, identify delays and monitor operations.",
      },
      {
        title: "Inventory and Material Tracking System",
        description:
          "Track raw materials, stock levels and material movement across production units. Low-stock alerts and inventory reports help teams manage supplies and avoid production disruptions.",
      },
      {
        title: "Supplier and Purchase Order Management System",
        description:
          "Maintain supplier records, manage purchase orders and track delivery schedules in one place. This helps procurement teams monitor orders and coordinate material supplies.",
      },
      {
        title: "Manufacturing Expense and Cost Tracking Dashboard",
        description:
          "Record production expenses, raw material costs and operational spending through a centralised dashboard. This helps managers monitor budgets and analyse manufacturing costs.",
      },
      {
        title: "Employee Training and Compliance Management Portal",
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
        name: "Support - HUB",
        description:
          "A ticket-management platform for reporting, assigning and tracking issues. These workflows are relevant to equipment maintenance requests and repair coordination.",
        linkLabel: "Visit SupportHub",
        url: "https://supporthub.codemate.build/",
      },
    ],
  },
};
