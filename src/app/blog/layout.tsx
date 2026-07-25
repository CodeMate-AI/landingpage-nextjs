"use client";

import React, { useEffect } from "react";
import "./blog.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Clean up any remaining Lenis classes, inline styles, or instances
    document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-scrolling");
    document.documentElement.style.removeProperty("scroll-behavior");
    document.body.style.removeProperty("overflow");

    const win = window as any;
    if (win.lenis) {
      try {
        win.lenis.destroy();
        win.lenis = null;
      } catch (e) {}
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="blog-body">
        {children}
      </div>
      <Footer />
    </>
  );
}
