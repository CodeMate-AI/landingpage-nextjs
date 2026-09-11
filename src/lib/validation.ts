import { z } from "zod";

// Validates credentials provided during admin login attempts
export const LoginSchema = z.object({
  email: z.string().email("Invalid admin email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Recursive schema validating the hierarchical AST node structure of the Tiptap editor
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

// Validates table-of-contents section anchors ensuring URL-friendly lowercase IDs
const SectionSchema = z.object({
  id: z
    .string()
    .min(1, "ID is required")
    .regex(/^[a-z0-9-]+$/, "Anchor ID must contain only lowercase letters, numbers, and hyphens"),
  title: z.string().min(1, "Title is required"),
});

// Validates full blog post creation and update request payloads
export const BlogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subheading: z.string().default(""),
  coverImage: z
    .string()
    .default("")
    .refine(
      (val) =>
        val === "" ||
        val.startsWith("/") ||
        val.startsWith("http://") ||
        val.startsWith("https://"),
      { message: "Cover image must be a valid URL or local path" }
    ),
  category: z.string().default("General"),
  tags: z
    .array(
      z.object({
        label: z.string(),
        tone: z.enum(["slate", "blue", "cyan", "purple", "indigo", "violet", "teal"]),
      })
    )
    .default([]),
  content: z.object({
    type: z.literal("doc"),
    content: z.array(TiptapNodeSchema).optional().default([]),
  }),
  published: z.boolean().default(false),
  saveMode: z.enum(["draft", "publish"]).optional(),
  author: z.string().default(""),
  authorRole: z.string().default(""),
  authorImage: z.string().optional().default(""),
  readTime: z.string().optional().default(""),
  publishedAtCustom: z.string().optional().default(""),
  filterLabels: z.array(z.string()).optional(),
  // Enforces that all table-of-contents anchor IDs within an article are unique
  sections: z.array(SectionSchema).optional().refine(
    (items) => {
      if (!items) return true;
      const ids = items.map((item) => item.id);
      return new Set(ids).size === ids.length;
    },
    { message: "Section anchor IDs must be unique within an article" }
  ),
});
