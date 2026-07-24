import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "./posts";
import BlogPostClient from "./BlogPostClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((candidate) => candidate.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const title = `${post.title} | CodeMate AI Blog`;
  const description = post.dek || `Read about ${post.title} on the CodeMate AI Blog.`;
  const imageUrl = post.image || '/codemateLogo.svg';

  return {
    title,
    description,
    alternates: {
      canonical: `https://blog.codemate.ai/${slug}`,
    },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: `https://blog.codemate.ai/${slug}`,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((candidate) => candidate.slug === slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} posts={blogPosts} />;
}
