"use client";

import { memo, useMemo, type MouseEventHandler } from "react";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

// Answers are text; no images (a remote image would be a tracking pixel) or embedded elements
const clean = (md: string) => DOMPurify.sanitize(marked.parse(md, { async: false }) as string, { FORBID_TAGS: ["img", "svg", "style", "form", "input"] });

// Each top-level block is its own element with a stable key, so while an answer streams only the last
// block changes and earlier blocks keep their DOM. New blocks fade in once instead of the whole answer
// re-animating on every chunk.
const Block = memo(function Block({ html }: { html: string }) {
  return <div className="docs-ask-block" dangerouslySetInnerHTML={{ __html: html }} />;
});

export function AnswerMarkdown({ text, onClick }: { text: string; onClick?: MouseEventHandler<HTMLDivElement> }) {
  const blocks = useMemo(
    () =>
      marked
        .lexer(text)
        .filter((t) => t.type !== "space")
        .map((t) => clean(t.raw)),
    [text]
  );
  return (
    <div className="docs-ask-answer prose prose-sm max-w-none" onClick={onClick}>
      {blocks.map((html, i) => (
        <Block key={i} html={html} />
      ))}
    </div>
  );
}
