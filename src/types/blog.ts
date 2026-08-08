export interface Tag {
  label: string;
  tone: "slate" | "blue" | "cyan" | "purple" | "indigo" | "violet" | "teal";
}

export interface BlogSection {
  id: string;
  title: string;
}

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
