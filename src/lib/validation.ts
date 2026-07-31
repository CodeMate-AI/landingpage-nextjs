import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid admin email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const TiptapNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.any()).optional(),
    content: z.array(TiptapNodeSchema).optional(),
    marks: z
      .array(
        z.object({
          type: z.string(),
          attrs: z.record(z.any()).optional(),
        })
      )
      .optional(),
    text: z.string().optional(),
  })
);

const SectionSchema = z.object({
  id: z
    .string()
    .min(1, "ID is required")
    .regex(/^[a-z0-9-]+$/, "Anchor ID must contain only lowercase letters, numbers, and hyphens"),
  title: z.string().min(1, "Title is required"),
});

export const BlogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subheading: z.string().min(1, "Subheading is required"),
  coverImage: z
    .string()
    .refine(
      (val) =>
        val === "" ||
        val.startsWith("/") ||
        val.startsWith("http://") ||
        val.startsWith("https://"),
      { message: "Cover image must be a valid URL or local path" }
    ),
  category: z.string().min(1, "Category is required"),
  tags: z
    .array(
      z.object({
        label: z.string(),
        tone: z.enum(["slate", "blue", "cyan", "purple", "indigo", "violet", "teal"]),
      })
    )
    .min(1, "At least one tag is required"),
  content: z.object({
    type: z.literal("doc"),
    content: z.array(TiptapNodeSchema),
  }),
  published: z.boolean().default(false),
  author: z.string().min(1, "Author Name is required"),
  authorRole: z.string().min(1, "Author Role Title is required"),
  readTime: z.string().min(1, "Read Time is required"),
  publishedAtCustom: z.string().min(1, "Date is required"),
  bgColor: z.string().optional(),
  filterLabels: z.array(z.string()).optional(),
  sections: z.array(SectionSchema).optional().refine(
    (items) => {
      if (!items) return true;
      const ids = items.map((item) => item.id);
      return ids.length === new Set(ids).size;
    },
    { message: "Section Anchor IDs must be unique" }
  ),
});
