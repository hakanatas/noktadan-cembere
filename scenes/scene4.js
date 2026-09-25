/* SAHNE 4 — DOĞRU (40–54 s)              MAT.5.3.1 (c) · MAT.5.3.2 (b, c)
   The ray's start opens too: a line, endless both ways (AB with ↔).
   Then an experiment: through ONE point we can draw endless lines;
   through TWO points only one line passes. */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, track, outBack, outCubic, inCubic, inOut, hump, smooth } = LI.E;
  const G = LI.Geo, S = LI.Stage, CM = LI.CM;
  const A = S.A, B = S.B;
  const FAR = 5200;
  const K = [-80, 40], Lp = [340, -170];

  const leftX = (t) => lerp(A[0], -FAR, Math.pow(seg(t, 40.2, 41.9), 2));

  function camera(t, env) {
    const over = S.cam(env, 760, 20, 0.55);
    const both = S.cam(env, 0, 20, 0.5);
    const test = S.cam(env, 60, -20, 1.15);
    let cam = LI.Camera.mix(over, both, inOut(seg(t, 40.1, 41.9)));
    cam = LI.Camera.mix(cam, test, inOut(seg(t, 45.9, 47.0)));
    return LI.Camera.breathe(cam, t, 0.4);
  }

  function render(ctx, lt, env, t) {
    const cam = camera(t, env), z = cam.zoom;
    S.begin(ctx, env, cam, t);
    const r = S.pr(cam, 10), lw = Math.max(5.5, 6 / z), s2 = 34 / z;
    const vl = cam.x - env.W / 2 / z, vr = cam.x + env.W / 2 / z;
    // ── the line AB
    const la = 1 - seg(t, 45.8, 46.4);
    if (la > 0) {
      ctx.globalAlpha = la;
      const L = leftX(t);
      G.pen(ctx, [L, 0], [FAR, 0], { w: lw });
      G.arrow(ctx, [vr - 70 / z, 0], 0, { len: 34 / z, w: lw });
      if (L < vl + 40 / z || t > 41.9) G.arrow(ctx, [vl + 70 / z, 0], Math.PI, { len: 34 / z, w: lw });
      G.point(ctx, A[0], A[1], { r, seed: 1 }); G.point(ctx, B[0], B[1], { r, seed: 2 });
      G.label(ctx, 'A', A[0] - s2 * 0.8, -s2 * 1.1, { size: s2 * 1.4 }); G.label(ctx, 'B', B[0] + s2 * 0.8, -s2 * 1.1, { size: s2 * 1.4 });
      // previous ray labels fade
      const f = 1 - seg(t, 40, 40.5);
      G.label(ctx, '[AB', A[0] + 240, -2.1 * (40 / 0.55), { size: 40 / 0.55 * 1.5, alpha: f });
      // pencil keeps drawing to the left
      const pa = seg(t, 40.1, 40.3) * (1 - seg(t, 41.7, 42.0));
      G.pencil(ctx, L, -2, { alpha: pa, len: 380 });
      // notation: AB with a two-headed arrow on top; and the name d
      const np = seg(t, 42.2, 42.9);
      G.label(ctx, 'AB', 0, -2.6 * s2, { size: s2 * 1.7, p: np });
      if (np > 0) {
        const y = -4.1 * s2, hw = 1.25 * s2;
        G.pen(ctx, [-hw, y], [hw, y], { w: lw * 0.7, p: seg(t, 42.8, 43.3) });
        if (t > 43.3) { G.arrow(ctx, [hw, y], 0, { len: s2 * 0.45, w: lw * 0.7 }); G.arrow(ctx, [-hw, y], Math.PI, { len: s2 * 0.45, w: lw * 0.7 }); }
      }
      G.label(ctx, 'd', vr - 180 / z, -1.8 * s2, { size: s2 * 1.6, p: seg(t, 43.6, 44.1) });
      G.label(ctx, 'd doğrusu', vr - 180 / z, 1.9 * s2, { size: s2, color: G.red(1), p: seg(t, 44.0, 44.7) });
      ctx.globalAlpha = 1;
    }

    // ── experiment 1: through one point, endless lines
    const e1 = seg(t, 46.6, 47.0);
    if (e1 > 0) {
      const settle = inOut(seg(t, 50.5, 51.5));
      const fanA = 1 - seg(t, 50.5, 51.1);
      const R = 1400;
      for (let i = 0; i < 9; i++) {
        const t0 = 47.0 + i * 0.28, a = -1.35 + i * 0.34 + 0.05 * Math.sin(t + i);
        const p = seg(t, t0, t0 + 0.35);
        if (p <= 0) continue;
        const d = [Math.cos(a), Math.sin(a)];
        G.pen(ctx, [K[0] - d[0] * R * p, K[1] - d[1] * R * p], [K[0] + d[0] * R * p, K[1] + d[1] * R * p], { w: 3.2, alpha: 0.5 * fanA, color: LI.INK_RGB, seed: i });
      }
      // one line keeps turning… then locks through L
      const spin = 0.2 + (Math.min(t, 50.5) - 47.0) * 1.3;
      const target = Math.atan2(Lp[1] - K[1], Lp[0] - K[0]);
      let ang = spin;
      const tgt = target + Math.PI * Math.round((spin - target) / Math.PI);
      ang = lerp(spin, tgt, settle);
      if (t > 47.0) {
        const d = [Math.cos(ang), Math.sin(ang)];
        G.pen(ctx, [K[0] - d[0] * R, K[1] - d[1] * R], [K[0] + d[0] * R, K[1] + d[1] * R], { w: lerp(4.5, 6, settle), seed: 99 });
      }
      G.point(ctx, K[0], K[1], { r, grow: outBack(seg(t, 46.6, 46.9)) });
      G.label(ctx, 'K', K[0] - 40, K[1] + 44, { size: 50, p: seg(t, 46.8, 47.2) });
      G.label(ctx, 'sonsuz sayıda', K[0] - 60, K[1] - 260, { size: 40, color: G.red(1 - seg(t, 50.4, 50.9)), p: seg(t, 48.3, 49.0) });
      // experiment 2: a second point → only one line
      const gL = outBack(seg(t, 50.3, 50.6));
      if (gL > 0) {
        G.point(ctx, Lp[0], Lp[1], { r, grow: gL, seed: 7 });
        G.label(ctx, 'L', Lp[0] + 34, Lp[1] - 44, { size: 50, p: seg(t, 50.5, 50.9) });
        G.ping(ctx, Lp[0], Lp[1], seg(t, 51.4, 52.2), { r: 16, grow: 30 });
        G.ping(ctx, K[0], K[1], seg(t, 51.4, 52.2), { r: 16, grow: 30 });
        G.label(ctx, 'tek doğru', Lp[0] + 150, Lp[1] + 40, { size: 42, color: G.red(1), p: seg(t, 51.6, 52.3), align: 'left' });
      }
    }
    // fade out at the very end
    if (t > 53.4) { LI.Camera.screen(ctx); ctx.fillStyle = `rgba(${LI.PAPER_RGB},${seg(t, 53.4, 54) * 0.85})`; ctx.fillRect(0, 0, env.W, env.H); }
  }

  LI.registerScene({ id: 4, start: 40, end: 54, name: 'Line', nameTr: 'Doğru',
    concept: 'Endless both ways; one point: endless lines; two points: one line', conceptTr: 'İki yönde sonsuz; bir noktadan sonsuz, iki noktadan tek doğru', outcome: 'MAT.5.3.1 · MAT.5.3.2', render });
})(window.LI = window.LI || {});
