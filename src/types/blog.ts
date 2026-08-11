// Represents an article classification tag with its display label and color tone
export interface Tag {
  label: string;
  tone: "slate" | "blue" | "cyan" | "purple" | "indigo" | "violet" | "teal";
}

// Represents a section entry in the article Table of Contents / Outline navigation
export interface BlogSection {
  id: string;
  title: string;
}

// Comprehensive data model for a blog article used across reader views and feed components
export interface BlogDetailPost {
  id: number | string;
  slug: string;
  title: string;
  category: string;
  date: string;
  dateValue: string;
  tags: Tag[];
  filterLabels?: string[];
  visualMarkup?: string;
  sections: BlogSection[];
  dek: string;
  readTime: string;
  image?: string;
  coverImage?: string;
  htmlContent?: string;
  author?: string;
  authorRole?: string;
}
