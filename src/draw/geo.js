/* ─────────────────────────────────────────────────────────────
   Geometry drawing kit: pen lines, points, labels, arrows, marks,
   and the four drawing tools of MAT.5.3.1 — kalem (pencil),
   cetvel (ruler), gönye (set square), pergel (compass).
   All sizes are world units; 60 units = 1 cm (LI.CM).
   ───────────────────────────────────────────────────────────── */
(function (LI) {
  'use strict';
  const { clamp, lerp, smooth } = LI.E;
  const { noise } = LI.rng;
  const Ink = LI.Ink;
  const TAU = Math.PI * 2;
  const tool = (a) => `rgba(${LI.TOOL_RGB},${a})`;
  const red = (a) => `rgba(${LI.RED_RGB},${a})`;

  /** ruled (straight, crisp) pen line a→b, drawn-on with p */
  function pen(ctx, a, b, o = {}) {
    const n = 16, pts = [];
    for (let i = 0; i <= n; i++) pts.push([lerp(a[0], b[0], i / n), lerp(a[1], b[1], i / n)]);
    Ink.path(ctx, pts, { w: o.w ?? 5, p: o.p ?? 1, from: o.from ?? 0, alpha: o.alpha ?? 1, color: o.color, seed: o.seed ?? 3, wob: o.wob ?? 0.06, taper: o.taper ?? [0.02, 0.02], minW: 0.7, bleed: o.bleed ?? 0.25 });
  }
  /** freehand wobbly path (the "not straight" lines) */
  function free(ctx, pts, o = {}) { Ink.path(ctx, LI.E.smoothPath(pts, 8), Object.assign({ w: 4, wob: 0.35, taper: [0.1, 0.2] }, o)); }

  function point(ctx, x, y, o = {}) {
    const r = (o.r ?? 7) * (o.grow ?? 1);
    if (r <= 0.1) return;
    Ink.dot(ctx, x, y, r, { seed: o.seed ?? 1, bleed: 0.5, alpha: o.alpha ?? 1, color: o.color, irregular: 0.06 });
  }

  /** handwritten label with left→right draw-on */
  function label(ctx, text, x, y, o = {}) {
    const p = o.p ?? 1, a = o.alpha ?? 1;
    if (p <= 0 || a <= 0) return;
    const size = o.size ?? 44;
    ctx.save();
    ctx.font = `${o.weight ?? 700} ${size}px "GS Hand", "Comic Sans MS", cursive`;
    ctx.textAlign = o.align ?? 'center'; ctx.textBaseline = 'middle';
    const w = ctx.measureText(text).width;
    const left = ctx.textAlign === 'center' ? x - w / 2 : ctx.textAlign === 'right' ? x - w : x;
    ctx.beginPath(); ctx.rect(left - 6, y - size, (w + 12) * clamp(p), size * 2); ctx.clip();
    ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.translate(-x, -y);
    ctx.fillStyle = o.color || `rgba(${LI.INK_RGB},${a})`;
    if (o.color) ctx.globalAlpha = a;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /** open arrowhead at `tip`, pointing along `ang` */
  function arrow(ctx, tip, ang, o = {}) {
    const L = o.len ?? 26, s = 0.5, a = o.alpha ?? 1;
    if (a <= 0) return;
    const b1 = [tip[0] - Math.cos(ang - s) * L, tip[1] - Math.sin(ang - s) * L];
    const b2 = [tip[0] - Math.cos(ang + s) * L, tip[1] - Math.sin(ang + s) * L];
    Ink.path(ctx, [b1, tip, b2], { w: o.w ?? 5, alpha: a, color: o.color, taper: [0.2, 0.2], wob: 0.05, minW: 0.6, p: o.p ?? 1 });
  }

  /** little square that marks a right angle at vertex v between unit dirs u1,u2 */
  function rightMark(ctx, v, u1, u2, o = {}) {
    const s = o.s ?? 26, p = o.p ?? 1;
    const a = [v[0] + u1[0] * s, v[1] + u1[1] * s], c = [v[0] + u2[0] * s, v[1] + u2[1] * s], b = [a[0] + u2[0] * s, a[1] + u2[1] * s];
    Ink.path(ctx, [a, b, c], { w: 3.4, p, color: LI.RED_RGB, taper: [0.05, 0.05], wob: 0.05 });
  }
  /** angle arc at vertex from a0 to a1 (radians) */
  function arc(ctx, v, r, a0, a1, o = {}) {
    const pts = [], n = 30;
    for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); pts.push([v[0] + Math.cos(a) * r, v[1] + Math.sin(a) * r]); }
    Ink.path(ctx, pts, { w: o.w ?? 3.4, p: o.p ?? 1, color: o.color ?? LI.RED_RGB, alpha: o.alpha ?? 1, taper: [0.05, 0.05], wob: 0.08 });
  }
  /** red dimension line with end ticks and a centred text */
  function dimension(ctx, a, b, text, o = {}) {
    const p = o.p ?? 1, off = o.off ?? 46;
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    const A = [a[0] + nx * off, a[1] + ny * off], B = [b[0] + nx * off, b[1] + ny * off];
    Ink.path(ctx, [A, B], { w: 2.6, p, color: LI.RED_RGB, taper: [0.02, 0.02], wob: 0.05 });
    [A, B].forEach((q, i) => { if (p > i * 0.9) Ink.path(ctx, [[q[0] - nx * 12, q[1] - ny * 12], [q[0] + nx * 12, q[1] + ny * 12]], { w: 2.6, color: LI.RED_RGB, taper: [0.1, 0.1] }); });
    if (text) label(ctx, text, (A[0] + B[0]) / 2 + nx * 34, (A[1] + B[1]) / 2 + ny * 34, { p: clamp(p * 2 - 1), color: red(1), size: o.size ?? 40 });
  }

  /* ─────────────── the tools ─────────────── */

  /** kalem: tip at (x,y), body pointing along ang (default up-right) */
  function pencil(ctx, x, y, o = {}) {
    const a = o.alpha ?? 1; if (a <= 0.01) return;
    const ang = o.ang ?? -1.05, L = o.len ?? 380, W = 34;
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha = a;
    // soft shadow
    ctx.fillStyle = 'rgba(40,50,70,0.10)'; ctx.fillRect(40, W / 2 + 4, L - 40, 12);
    // graphite tip + sharpened wood cone
    ctx.fillStyle = '#EFE3C8'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(62, -W / 2); ctx.lineTo(62, W / 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2B2F38'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(18, -5); ctx.lineTo(18, 5); ctx.closePath(); ctx.fill();
    // hexagonal body
    ctx.fillStyle = '#F2EFE6'; ctx.fillRect(62, -W / 2, L - 110, W);
    ctx.fillStyle = 'rgba(74,82,99,0.10)'; ctx.fillRect(62, W / 6, L - 110, W / 3);
    // ferrule + eraser
    ctx.fillStyle = '#C9CDD6'; ctx.fillRect(L - 48, -W / 2 - 1, 22, W + 2);
    ctx.fillStyle = '#E9C9C0'; ctx.fillRect(L - 26, -W / 2, 26, W);
    ctx.globalAlpha = 1;
    const ln = (pts, w = 2.6) => Ink.path(ctx, pts, { w, color: LI.TOOL_RGB, alpha: a, taper: [0.05, 0.05], wob: 0.08, minW: 0.7 });
    ln([[0, 0], [62, -W / 2], [L, -W / 2], [L, W / 2], [62, W / 2], [0, 0]]);
    ln([[62, -W / 6], [L - 48, -W / 6]], 1.4); ln([[62, W / 6], [L - 48, W / 6]], 1.4);
    ln([[L - 48, -W / 2], [L - 48, W / 2]], 2); ln([[L - 26, -W / 2], [L - 26, W / 2]], 2);
    ctx.restore();
  }

  /** cetvel: zero mark at (x,y), measuring edge along ang; o.cm length */
  function ruler(ctx, x, y, o = {}) {
    const a = o.alpha ?? 1; if (a <= 0.01) return;
    const cm = o.cm ?? 12, CM = LI.CM, H = 78, pad = 26, side = o.side ?? 1, len = cm * CM;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.ang ?? 0); ctx.scale(1, side);
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(-pad, 0, len + pad * 2, H);
    ctx.fillStyle = 'rgba(120,160,205,0.10)'; ctx.fillRect(-pad, 0, len + pad * 2, H);
    ctx.fillStyle = 'rgba(40,50,70,0.08)'; ctx.fillRect(-pad + 6, H, len + pad * 2, 8);
    ctx.globalAlpha = 1;
    Ink.path(ctx, [[-pad, 0], [len + pad, 0], [len + pad, H], [-pad, H], [-pad, 0]], { w: 2.4, color: LI.TOOL_RGB, alpha: a, taper: [0, 0], wob: 0.05, minW: 0.8 });
    ctx.strokeStyle = tool(0.85 * a);
    const mm = CM / 10;
    const hi = o.highlight ?? -1; // highlight ticks up to this cm (measuring)
    for (let i = 0; i <= cm * 10; i++) {
      const tx = i * mm, L = i % 10 === 0 ? 24 : i % 5 === 0 ? 16 : 9;
      ctx.lineWidth = i % 10 === 0 ? 2 : 1.1;
      ctx.strokeStyle = hi >= 0 && i % 10 === 0 && i / 10 <= hi ? red(a) : tool(0.85 * a);
      ctx.beginPath(); ctx.moveTo(tx, 0); ctx.lineTo(tx, L); ctx.stroke();
    }
    ctx.font = '600 19px "GS Mono", ui-monospace, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let c = 0; c <= cm; c++) {
      ctx.save(); ctx.translate(c * CM, 42); ctx.scale(1, side);
      ctx.fillStyle = hi >= 0 && c <= hi ? red(a) : tool(0.9 * a);
      ctx.fillText(String(c), 0, 0); ctx.restore();
    }
    ctx.save(); ctx.translate(len / 2, 64); ctx.scale(1, side); ctx.font = '400 13px "GS Mono", monospace'; ctx.fillStyle = tool(0.5 * a); ctx.fillText('cm', 0, 0); ctx.restore();
    ctx.restore();
  }

  /** gönye: right-angle corner at (x,y); leg1 along ang, leg2 along ang - 90° (up) */
  function setSquare(ctx, x, y, o = {}) {
    const a = o.alpha ?? 1; if (a <= 0.01) return;
    const L1 = o.l1 ?? 360, L2 = o.l2 ?? 250;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.ang ?? 0); ctx.scale(o.flip ?? 1, 1);
    const P = [[0, 0], [L1, 0], [0, -L2]];
    ctx.globalAlpha = a;
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    // inner cut-out
    const k = 0.42, c = [40, -38];
    ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0], c[1] - (L2 - 38) * k * 1.5); ctx.lineTo(c[0] + (L1 - 40) * k * 1.5, c[1]); ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill('evenodd');
    ctx.fillStyle = 'rgba(120,160,205,0.12)'; ctx.fill('evenodd');
    ctx.globalAlpha = 1;
    Ink.path(ctx, [...P, P[0]], { w: 2.4, color: LI.TOOL_RGB, alpha: a, taper: [0, 0], wob: 0.05, minW: 0.8 });
    Ink.path(ctx, [c, [c[0], c[1] - (L2 - 38) * k * 1.5], [c[0] + (L1 - 40) * k * 1.5, c[1]], c], { w: 1.6, color: LI.TOOL_RGB, alpha: a * 0.8, taper: [0, 0], wob: 0.05 });
    ctx.strokeStyle = tool(0.8 * a); ctx.lineWidth = 1.1;
    for (let i = 1; i < L1 / 6 - 4; i++) { const L = i % 10 === 0 ? 14 : i % 5 === 0 ? 10 : 6; ctx.beginPath(); ctx.moveTo(i * 6, 0); ctx.lineTo(i * 6, -L); ctx.stroke(); }
    // right-angle corner mark printed on the tool
    ctx.strokeStyle = red(0.9 * a); ctx.lineWidth = 2; ctx.strokeRect(0, -22, 22, 22);
    ctx.restore();
  }

  /** pergel: needle at pivot, pencil leg at angle th with opening r */
  function compass(ctx, pivot, r, th, o = {}) {
    const a = o.alpha ?? 1; if (a <= 0.01) return;
    const L = o.leg ?? 330;
    const q = [pivot[0] + Math.cos(th) * r, pivot[1] + Math.sin(th) * r];
    const mid = [(pivot[0] + q[0]) / 2, (pivot[1] + q[1]) / 2];
    const h = Math.sqrt(Math.max(40 * 40, L * L - (r / 2) ** 2)) * 0.62 + (o.hop ?? 0);
    const H = [mid[0], mid[1] - h];
    ctx.save();
    // shadow of the legs on the paper
    ctx.globalAlpha = 0.12 * a; Ink.path(ctx, [pivot, [H[0] + 30, H[1] + h * 0.55], q], { w: 8, color: '40,50,70', taper: [0.3, 0.3] }); ctx.globalAlpha = 1;
    const leg = (from, to, w) => Ink.path(ctx, [from, to], { w, color: LI.TOOL_RGB, alpha: a, taper: [0.5, 0.05], minW: 0.25, wob: 0.03 });
    leg(pivot, H, 12); // needle leg (tapers to the needle)
    // pencil leg with lead holder
    const d = [q[0] - H[0], q[1] - H[1]], dl = Math.hypot(d[0], d[1]) || 1, u = [d[0] / dl, d[1] / dl];
    const hold = [q[0] - u[0] * 70, q[1] - u[1] * 70];
    leg(q, H, 12);
    Ink.path(ctx, [hold, [q[0] - u[0] * 10, q[1] - u[1] * 10]], { w: 20, color: '239,227,200', alpha: a, taper: [0.02, 0.5] });
    Ink.path(ctx, [[q[0] - u[0] * 14, q[1] - u[1] * 14], q], { w: 6, color: '43,47,56', alpha: a, taper: [0.02, 0.9] });
    // hinge + handle
    ctx.fillStyle = `rgba(201,205,214,${a})`; ctx.beginPath(); ctx.arc(H[0], H[1], 17, 0, TAU); ctx.fill();
    Ink.ring(ctx, H[0], H[1], 17, { w: 2.4, color: LI.TOOL_RGB, alpha: a, gap: 0.02 });
    Ink.path(ctx, [[H[0], H[1] - 16], [H[0], H[1] - 62]], { w: 11, color: LI.TOOL_RGB, alpha: a, taper: [0.02, 0.3] });
    ctx.restore();
    return { q, H };
  }

  /** a circle (çember) drawn on with p from start angle */
  function circle(ctx, c, r, o = {}) {
    const pts = [], n = 96, a0 = o.a0 ?? 0, p = o.p ?? 1;
    for (let i = 0; i <= n; i++) { const a = a0 + (i / n) * TAU; pts.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]); }
    Ink.path(ctx, pts, { w: o.w ?? 5, p, color: o.color, alpha: o.alpha ?? 1, taper: [0.02, 0.02], wob: 0.05, minW: 0.8, bleed: 0.25, seed: o.seed ?? 5 });
  }

  /** a pulsing red highlight ring (to point at something) */
  function ping(ctx, x, y, k, o = {}) {
    if (k <= 0 || k >= 1) return;
    const r = (o.r ?? 16) + k * (o.grow ?? 26);
    ctx.strokeStyle = red(0.9 * (1 - k)); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  }

  LI.Geo = { pen, free, point, label, arrow, rightMark, arc, dimension, pencil, ruler, setSquare, compass, circle, ping, red, tool };
})(window.LI = window.LI || {});
