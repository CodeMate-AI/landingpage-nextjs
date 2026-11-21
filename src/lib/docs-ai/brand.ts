import type { StreamTextTransform, ToolSet } from "ai";

// Plain "CodeMate" becomes "CodeMate AI". Skipped when it is part of a URL, path or file name
// (github.com/CodeMate-AI, CodeMate-Build-User-Manual, CodeMate.ai) so links keep working.
export const fixBrand = (text: string) => text.replace(/(?<![\w./-])CodeMate(?![\w-]|\.\w| AI\b)/g, "CodeMate AI");

// Where it is safe to cut `buf`: before the last unfinished word, and before a trailing "CodeMate"
// that may still be followed by " AI". Cutting only at whitespace keeps the lookarounds above correct.
function safeCut(buf: string) {
  const cut = buf.search(/\S*$/);
  const brand = buf.slice(0, cut).search(/CodeMate\s*$/);
  return brand >= 0 ? brand : cut;
}

// Rewrites the brand name in streamed text even when "CodeMate" and "AI" arrive in separate deltas
export const brandTransform = <T extends ToolSet>(): StreamTextTransform<T> => () => {
  let buf = "";
  let id = "";
  return new TransformStream({
    transform(chunk, controller) {
      if (chunk.type === "text-delta") {
        buf += chunk.text;
        id = chunk.id;
        const cut = safeCut(buf);
        if (cut > 0) controller.enqueue({ ...chunk, text: fixBrand(buf.slice(0, cut)) });
        buf = buf.slice(cut);
        return;
      }
      // Any other part ends the run of text, so release what was held
      if (buf) controller.enqueue({ type: "text-delta", id, text: fixBrand(buf) });
      buf = "";
      controller.enqueue(chunk);
    },
  });
};

// Self-check
console.assert(
  fixBrand("CodeMate Toolbox, CodeMate AI, CodeMate. https://github.com/CodeMate-AI/x CodeMate-Build-User-Manual app.codemate.ai") ===
    "CodeMate AI Toolbox, CodeMate AI, CodeMate AI. https://github.com/CodeMate-AI/x CodeMate-Build-User-Manual app.codemate.ai"
);
