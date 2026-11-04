/**
 * Natural language commands: a terminal window, its header rule, two dim
 * rows of history and the active prompt nearest the front, and floating just
 * off its left corner a chat bubble holding a loose request: two lines of
 * words of uneven length and spacing, its tail pointing at the prompt. The
 * pointer's x scrubs the translation: word by word the request lights and
 * lifts, a packet runs down the tail, and the matching token types itself
 * onto the prompt: crisp, one height, evenly spaced, the flags marked by a
 * small square. Spent words settle back, dim. Once the command is whole, its
 * output row draws in below, the spent bubble settles, and the window takes
 * the bright edge. At rest
 * the first token and a half are typed. The slider is the bubble's float.
 *
 * The pattern: scrub. One spring for progress, each token read from it in
 * order, and a hit test on the pointer's screen x, which never moves.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, rrect, prism, poly, open, seg, clamp, lerp,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

const TX = 8, TY = 2, TW = 32, TD = 21, TH = 3, ROW = 13, X0 = TX - TW + 10, REST_P = 0.4, ZMAX = 5;
const BX = -38, BY = 34, BW = 15, BD = 10, BH = 2.5, TIP = [-23, 18];
// the request: [row, start, length], loose and uneven
const WORDS = [[-3.5, 0, 6], [-3.5, 7.8, 3], [-3.5, 13.4, 7], [3.5, 0, 8], [3.5, 10.2, 5]];
// the command: [length, flag?] and the words each token is made of
const TOKENS = [[10, false], [4, true], [8, false], [5, true]], MAP = [[0], [1], [2, 3], [4]], GAP = 2.4;
const HISTORY = [[-5, [7, 4, 9]], [4, [9, 6]]];
const A = [Math.SQRT1_2, -Math.SQRT1_2], Bv = [Math.SQRT1_2, Math.SQRT1_2];
/** A prompt chevron at (cx, cy), three points in the screen's own axes, pointing right. */
const chevron = (cx, cy, s) => [[-2.4, -5], [2.4, 0], [-2.4, 5]].map(([a, b]) => [cx + a * s * A[0] + b * s * Bv[0], cy + a * s * A[1] + b * s * Bv[1]]);
/** Token k's share at progress p: each starts 0.2 after the one before and takes 0.2; the output follows. */
const trip = (p, k) => clamp((p - 0.08 - k * 0.2) / 0.2, 0, 1);
const bar = (x0, x1, y, h = 1.3) => rings(x0, y - h, x1, y + h, h, h * 0.42);
const NONE = { sil: "", crease: "" };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let bz = value;

  const C = Cam(45, 0.5, 3.3);
  fit(C, [[TX - TW, TY - TD, 0], [TX + TW, TY - TD, 0], [TX + TW, TY + TD, 0], [TX - TW, TY + TD, 0],
    [BX - BW, BY - BD, TH + ZMAX + BH + 1.5], [BX - BW, BY + BD, TH + ZMAX], [BX + BW, BY + BD, TH + ZMAX]], 200, 166);
  const P = proj(C), front = facing(C);
  const sxL = P(BX, BY, 0)[0], sxR = P(TX + TW - 6, ROW, 0)[0];

  const g = mk("g", {}, svg);
  // the terminal: plate, header rule, history, the prompt
  const win = solid(g);
  put(win, prism(P, front, ...rings(TX - TW, TY - TD, TX + TW, TY + TD, 4, 1.3), 0, TH));
  mk("path", { d: seg(P(TX - TW + 2, TY - TD + 6, TH), P(TX + TW - 2, TY - TD + 6, TH)), class: "nf lo" }, g);
  for (const [y, lens] of HISTORY) {
    mk("path", { d: open(chevron(X0 - 5, y, 0.55).map(([u, v]) => P(u, v, TH))), class: "nf lo" }, g);
    let x = X0;
    // history is dim, so the live command is the brightest row in the window
    for (const l of lens) { const b = solid(g); put(b, prism(P, front, ...bar(x, x + l, y, 1), TH, TH + 0.5)); b.sil.classList.add("lo"); x += l + GAP; }
  }
  mk("path", { d: open(chevron(X0 - 5, ROW, 0.65).map(([u, v]) => P(u, v, TH))), class: "sil nf" }, g);
  const marks = TOKENS.map(() => solid(g)), toks = TOKENS.map(() => solid(g)), cursor = solid(g);
  const output = mk("path", { class: "nf lo" }, g);
  // the bubble, floating: its tail on its underside, then the plate, the words, and the packet riding the tail
  const tail = mk("path", { class: "sil" }, g), packet = mk("path", { class: "hi" }, g), bubble = solid(g);
  const words = WORDS.map(() => solid(g));

  const prog = spring(REST_P, { eps: 0.002 });
  let drawn = "";

  function draw() {
    const p = prog.x, key = p.toFixed(4) + bz;
    if (key === drawn) return;
    drawn = key;
    // once the command is whole the request has been sent, and the spent bubble settles low
    const out = clamp((p - 0.9) / 0.1, 0, 1), z0 = TH + bz * (1 - 0.8 * out), top = z0 + BH;
    // the bubble and its tail, pointing back into the window at the prompt
    tail.setAttribute("d", poly([[BX + BW - 3, BY - BD + 9], [BX + BW - 6, BY - BD + 2], TIP].map(([x, y]) => P(x, y, z0))));
    put(bubble, prism(P, front, rrect(BX - BW, BY - BD, BX + BW, BY + BD, 7, 14), rrect(BX - BW + 1.3, BY - BD + 1.3, BX + BW - 1.3, BY + BD - 1.3, 5.7, 14), z0, top));
    // a word lifts and lights while its token is being typed, and settles dim once spent
    WORDS.forEach(([v, u, l], w) => {
      const k = MAP.findIndex((m) => m.includes(w)), t = trip(p, k), live = t > 0 && t < 1;
      put(words[w], prism(P, front, ...bar(BX - 11 + u, BX - 11 + u + l, BY + v, 1.1), top, top + (live ? 1.6 : 0.6)));
      words[w].sil.setAttribute("class", live ? "hi" : t >= 1 ? "lo" : "");
    });
    // the command: tokens grow along the prompt, flags behind their mark, the cursor just past the last
    let x = X0, typing = -1;
    TOKENS.forEach(([len, flag], k) => {
      const t = trip(p, k);
      if (t > 0 && t < 1) typing = k;
      put(marks[k], flag && t > 0 ? prism(P, front, ...bar(x, x + 1.8, ROW, 0.9), TH, TH + 0.9) : NONE);
      const x0 = flag ? x + 2.8 : x, w = len * t;
      put(toks[k], w < 0.4 ? NONE : prism(P, front, ...bar(x0, x0 + w, ROW), TH, TH + 0.9));
      if (t > 0) x = x0 + w + (t >= 1 ? GAP : 0);
    });
    put(cursor, prism(P, front, ...bar(x + 0.4, x + 4.4, ROW + 0.9, 0.45), TH, TH + 0.35));
    // the output, once the command is whole
    output.setAttribute("d", out <= 0 ? "" : [[0, 9], [11, 6], [19, 12]].map(([u, l]) => seg(P(X0 + u, ROW + 7.5, TH), P(X0 + u + l * out, ROW + 7.5, TH))).join(""));
    // the packet runs from the bubble down its tail while a token is typed
    const t = typing < 0 ? -1 : trip(p, typing), [rx, ry] = P(BX + BW - 4.5, BY - BD + 5.5, z0), [tx, ty] = P(...TIP, z0);
    const cx = lerp(rx, tx, t), cy = lerp(ry, ty, t);
    packet.setAttribute("d", t < 0 ? "" : poly(Array.from({ length: 12 }, (_, i) => [cx + 1.6 * Math.cos(i * Math.PI / 6), cy + 1.6 * Math.sin(i * Math.PI / 6)])));
    // the bright edge: the bubble before a token (from the spring's target), the cursor while typing,
    // and the window only once the command has really finished, so it never lights ahead of the typing
    const asking = trip(prog.t, 0) === 0, done = p >= 0.92;
    bubble.sil.classList.toggle("hi", asking);
    cursor.sil.classList.toggle("hi", !asking && !done);
    win.sil.classList.toggle("hi", done);
  }

  const B = register(stage, (dt) => {
    const m = stepS(prog, dt);
    draw();
    return m;
  });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: ([sx]) => {
      prog.t = clamp((sx - sxL) / (sxR - sxL), 0, 1);
      const n = TOKENS.filter((_, k) => trip(prog.t, k) > 0).length;
      read.textContent = n === 0 ? "request" : prog.t >= 0.92 ? "command" : "token " + n;
      B.wake();
    },
    leave: () => { prog.t = REST_P; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { bz = clamp(v, 2, ZMAX); drawn = ""; B.wake(); },
    destroy: bag.dispose,
  };
}

const nlcmd = {
  name: "nlcmd",
  means: "A request becomes a command: as the pointer moves right, the bubble's words light one by one and the terminal types the command they make.",
  rules: [1, 5, 6, 10],
  range: [1.5, 3, 5],
  tour: [[90, 160], [185, 165], [300, 165], null],
  mount,
};

export default nlcmd;
