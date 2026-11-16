import { bundledLanguages, codeToHtml } from "shiki";

// Server-side syntax highlighting for published docs. Replaces <pre><code class="language-x"> blocks
// with Shiki output (light and dark colors as CSS variables, switched by the .dark class), keeping
// data-title for DocsEnhance. Unknown languages and any failure leave the plain block untouched.
const BLOCK = /<pre((?:\s[^>]*)?)><code class="language-([\w+#.-]+)">([\s\S]*?)<\/code><\/pre>/g;

const decode = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");

export async function highlightCodeBlocks(html: string): Promise<string> {
  const blocks = [...html.matchAll(BLOCK)];
  if (!blocks.length) return html;

  const done = await Promise.all(
    blocks.map(async ([whole, preAttrs, lang, raw]) => {
      if (!(lang in bundledLanguages)) return whole;
      try {
        const out = await codeToHtml(decode(raw).replace(/\n$/, ""), {
          lang,
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: false,
        });
        const title = /data-title="[^"]*"/.exec(preAttrs)?.[0];
        return title ? out.replace("<pre ", `<pre ${title} `) : out;
      } catch {
        return whole;
      }
    }),
  );

  let i = 0;
  return html.replace(BLOCK, () => done[i++]);
}
