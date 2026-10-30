/**
 * Prompt to App: a prompt sheet of five lines on the left, an app window on
 * the right (a title strip, then a sidebar, a header, two
 * cards and an action row laid out as dashed footprints on its floor), and
 * between them three stepping tiles that turn a flat bar into a block. The
 * pointer's x scrubs how far the build has come: each line of the prompt
 * shrinks as its part of the app rises out of its footprint, one after
 * another. The part being built takes the bright edge; before anything is
 * built, the prompt has it. At rest the app is more than half built. The slider is the
 * tallest part's height.
 *
 * The pattern: scrub. One spring for progress, each part's rise read from it
 * in order, and a hit test on the pointer's screen x, which never moves.
 */
import HL from '../kernel';

const {
  Cam, fit, proj, facing, rings, prism, ringAt, poly, seg, clamp,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

const SX = -46, SY = 44, WX = 26, WY = -24, WH = 3, PH = 2, REST_P = 0.6, HMAX = 16;
// the window's parts in its own coordinates, in the order the prompt builds them, and each one's share of the height
const PARTS = [
  [-27, -19, -15, 27, 0.4], [-12, -19, 27, -13, 0.3], [-12, -9, 6, 11, 1],
  [9, -9, 27, 11, 0.75], [-12, 15, 27, 23, 0.45],
];
// the prompt's lines: where each lies along the sheet, and its length
const LINES = [[-14, 20], [-7, 14], [0, 18], [7, 11], [14, 16]];
// the stepping tiles between: a bar, a tile, a block, as half sizes and heights
const TILES = [[3.2, 1.1, 1], [2.4, 1.8, 1.8], [2.2, 2.2, 3]];
/** Part k's share of its rise at progress p: each starts 0.15 after the one before and takes 0.4. */
const trip = (p, k) => clamp((p - k * 0.15) / 0.4, 0, 1);
const ease = (t) => t * t * (3 - 2 * t);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let hmax = value;

  const C = Cam(45, 0.5, 2.25);
  fit(C, [[SX - 15, SY - 21, 0], [SX + 15, SY + 21, 0], [SX - 15, SY + 21, 0], [WX + 30, WY - 30, 0],
    [WX - 30, WY + 30, 0], [WX + 30, WY + 30, 0], [WX - 30, WY - 30, WH], [WX - 3, WY - 9, WH + HMAX]], 200, 166);
  const P = proj(C), front = facing(C);
  const sxL = P(SX, SY, 0)[0], sxR = P(WX, WY, 0)[0];

  const g = mk("g", {}, svg);
  // the prompt sheet and its lines
  const sheet = solid(g);
  put(sheet, prism(P, front, ...rings(SX - 15, SY - 21, SX + 15, SY + 21, 3, 1.2), 0, PH));
  const lines = LINES.map(() => solid(g));

  // the stepping tiles on a dashed rail, from the sheet's right corner to the window's left
  const A = [SX + 15, SY - 21], Bp = [WX - 30, WY + 30];
  mk("path", { d: seg(P(...A, 0), P(...Bp, 0)), class: "nf dash" }, g);
  TILES.forEach(([hx, hy, h], k) => {
    const f = (k + 1) / (TILES.length + 1), x = A[0] + (Bp[0] - A[0]) * f, y = A[1] + (Bp[1] - A[1]) * f;
    put(solid(g), prism(P, front, ...rings(x - hx, y - hy, x + hx, y + hy, 1, 0.5), 0, h));
  });

  // the window: its plate, the title strip's crease, then the parts' footprints
  put(solid(g), prism(P, front, ...rings(WX - 30, WY - 30, WX + 30, WY + 30, 4, 1.4), 0, WH));
  mk("path", { d: seg(P(WX - 28, WY - 22, WH), P(WX + 28, WY - 22, WH)), class: "nf lo" }, g);
  const parts = PARTS.map(([x0, y0, x1, y1, share], k) => {
    const [ring, inner] = rings(WX + x0, WY + y0, WX + x1, WY + y1, 2, 0.9);
    mk("path", { d: poly(ringAt(P, ring, WH)), class: "nf dash" }, g);
    return { k, ring, inner, share, d: x0 + x1 + y0 + y1, drawn: "" };
  });
  // back to front by where each part's centre lies; none of them move on the ground
  for (const pt of parts.slice().sort((a, b) => a.d - b.d)) pt.el = solid(g);

  const prog = spring(REST_P, { eps: 0.002 });
  let lit = null;

  function draw() {
    const p = prog.x;
    parts.forEach((pt) => {
      const t = ease(trip(p, pt.k)), h = hmax * pt.share * t;
      const key = h.toFixed(2);
      if (key !== pt.drawn) {
        pt.drawn = key;
        put(pt.el, h < 0.3 ? { sil: "", crease: "" } : prism(P, front, pt.ring, pt.inner, WH, WH + h));
        // its line on the prompt shrinks to a stub as the part rises
        const [v, len] = LINES[pt.k], x0 = SX - 11, x1 = x0 + Math.max(2.4, len * (1 - 0.85 * t));
        put(lines[pt.k], prism(P, front, ...rings(x0, SY + v - 1.2, x1, SY + v + 1.2, 1.2, 0.5), PH, PH + 0.8));
      }
    });
    // the part being built, read from the spring's target: the last to have started; the prompt before any has
    let f = -1;
    parts.forEach((pt) => { if (trip(prog.t, pt.k) > 0) f = pt.k; });
    if (f !== lit) {
      lit = f;
      sheet.sil.classList.toggle("hi", f < 0);
      parts.forEach((pt) => pt.el.sil.classList.toggle("hi", pt.k === f));
    }
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
      let f = -1;
      parts.forEach((pt) => { if (trip(prog.t, pt.k) > 0) f = pt.k; });
      read.textContent = f < 0 ? "prompt" : "part " + (f + 1);
      B.wake();
    },
    leave: () => { prog.t = REST_P; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { hmax = clamp(v, 4, HMAX); B.wake(); },
    destroy: bag.dispose,
  };
}

const promptToApp = {
  name: "prompt-to-app",
  means: "A prompt becomes an app: as the pointer moves right, each line of the prompt shrinks as its part of the window rises.",
  rules: [1, 5, 6, 9],
  range: [6, 11, 16],
  tour: [[110, 166], [230, 166], [330, 166], null],
  mount,
};

export default promptToApp;
