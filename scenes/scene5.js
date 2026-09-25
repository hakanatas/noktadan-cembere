/* SAHNE 5 — AÇI ve DİKME (54–70 s)       MAT.5.3.1 (a–c) · MAT.5.3.2 (b)
   Two rays with a common start make an angle: vertex B, arms [BA and [BC.
   Turning an arm opens or closes the angle. Then the set square draws a
   perpendicular from P to line d: a right angle. */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, track, outBack, outCubic, inCubic, inOut, hump } = LI.E;
  const G = LI.Geo, S = LI.Stage;
  const V = [-330, 170];           // vertex B
  const RLEN = 620;
  const P = [180, -200], H = [180, 200];

  function camera(t, env) {
    return LI.Camera.breathe(S.track(env, [
      [54, { x: 20, y: -10, zoom: 1.15 }], [60, { x: -40, y: 0, zoom: 1.2 }], [63.4, { x: -20, y: 0, zoom: 1.15 }],
      [64.4, { x: 120, y: 20, zoom: 1.15 }], [70, { x: 120, y: 20, zoom: 1.22 }],
    ], t), t, 0.4);
  }
  /** angle of arm BA (radians, screen coords: negative = upward) */
  const armAng = (t) => track([[55.6, -0.72], [61.6, -0.72], [62.3, -1.25], [62.9, -0.38], [63.4, -0.72]], t);

  function render(ctx, lt, env, t) {
    const cam = camera(t, env);
    S.begin(ctx, env, cam, t);
    const r = S.pr(cam, 10);
    // ── the angle
    const aA = 1 - seg(t, 63.4, 64.0);
    if (aA > 0) {
      ctx.globalAlpha = aA;
      const th = armAng(t), dA = [Math.cos(th), Math.sin(th)];
      const kol = hump(t, 61.0, 62.2); // arms highlighted
      const pC = inOut(seg(t, 54.8, 55.6)), pA = inOut(seg(t, 55.5, 56.3));
      const C = [V[0] + RLEN, V[1]], Aend = [V[0] + dA[0] * RLEN, V[1] + dA[1] * RLEN];
      G.pen(ctx, V, C, { p: pC, w: 5.5 + 3 * kol, seed: 11 });
      G.pen(ctx, V, Aend, { p: pA, w: 5.5 + 3 * kol, seed: 12 });
      if (pC >= 1) G.arrow(ctx, C, 0, { len: 28 });
      if (pA >= 1) G.arrow(ctx, Aend, th, { len: 28 });
      // points on the arms, and names
      const ptA = [V[0] + dA[0] * 380, V[1] + dA[1] * 380], ptC = [V[0] + 380, V[1]];
      G.point(ctx, V[0], V[1], { r, grow: outBack(seg(t, 54.3, 54.6)) });
      if (pC > 0.7) G.point(ctx, ptC[0], ptC[1], { r, seed: 3 });
      if (pA > 0.7) G.point(ctx, ptA[0], ptA[1], { r, seed: 4 });
      G.label(ctx, 'B', V[0] - 38, V[1] + 40, { p: seg(t, 54.5, 54.9) });
      G.label(ctx, 'C', ptC[0] + 4, ptC[1] + 50, { p: seg(t, 55.5, 55.9) });
      G.label(ctx, 'A', ptA[0] - 40, ptA[1] - 30, { p: seg(t, 56.1, 56.5) });
      // the opening: an arc between the arms
      const ap = seg(t, 56.6, 57.4);
      if (ap > 0) G.arc(ctx, V, 96, th, 0, { p: ap, w: 4 });
      G.label(ctx, 'ABC açısı', V[0] + 250, V[1] - 60, { size: 42, color: G.red(1), p: seg(t, 57.5, 58.4), align: 'left' });
      // vertex and arms named
      G.ping(ctx, V[0], V[1], seg(t, 60.8, 61.6), { r: 16, grow: 34 });
      G.label(ctx, 'köşe', V[0] - 60, V[1] + 100, { size: 40, color: G.red(1), p: seg(t, 60.9, 61.4) });
      G.label(ctx, 'kol', V[0] + 520, V[1] + 48, { size: 40, color: G.red(1), p: seg(t, 61.2, 61.7) });
      G.label(ctx, 'kol', Aend[0] - 60, Aend[1] + 20, { size: 40, color: G.red(1), p: seg(t, 61.4, 61.9) });
      // pencil drawing the two rays
      const tip = t < 55.6 ? track([[54.5, [V[0] + 200, V[1] - 300]], [54.8, V], [55.6, C]], t) : track([[55.6, C], [55.8, V], [56.3, Aend], [56.8, [Aend[0] + 300, Aend[1] - 300]]], t);
      G.pencil(ctx, tip[0], tip[1], { alpha: seg(t, 54.4, 54.6) * (1 - seg(t, 56.5, 56.8)) });
      ctx.globalAlpha = 1;
    }

    // ── perpendicular with the set square
    const dA = seg(t, 63.8, 64.3);
    if (dA > 0) {
      const R = 1400;
      G.pen(ctx, [H[0] - R, H[1]], [H[0] + R, H[1]], { p: dA, w: 5.5, seed: 21 });
      G.label(ctx, 'd', H[0] + 620, H[1] + 44, { p: seg(t, 64.1, 64.4) });
      G.point(ctx, P[0], P[1], { r, grow: outBack(seg(t, 64.1, 64.4)), seed: 5 });
      G.label(ctx, 'P', P[0] + 38, P[1] - 30, { p: seg(t, 64.2, 64.6) });
      // gönye slides along d until its edge meets P
      const sq = track([[64.4, -700], [65.5, H[0]], [67.0, H[0]], [67.7, H[0] + 900]], t);
      const sa = seg(t, 64.4, 64.7) * (1 - seg(t, 67.3, 67.7));
      G.setSquare(ctx, sq, H[1], { alpha: sa, l1: 360, l2: 470, flip: -1 });
      // draw the perpendicular along the edge
      const pp = inOut(seg(t, 65.8, 66.8));
      G.pen(ctx, P, [P[0], lerp(P[1], H[1], 1)], { p: pp, w: 5.5, seed: 22 });
      const tip = track([[65.5, [P[0] + 260, P[1] - 260]], [65.8, P], [66.8, H], [67.2, [H[0] + 300, H[1] - 300]]], t);
      G.pencil(ctx, tip[0], tip[1], { alpha: seg(t, 65.5, 65.7) * (1 - seg(t, 66.9, 67.2)) });
      // right-angle mark + 90°
      const m = seg(t, 67.4, 67.9);
      if (m > 0) { G.rightMark(ctx, H, [1, 0], [0, -1], { p: m, s: 30 }); G.point(ctx, H[0], H[1], { r, seed: 6 }); }
      G.label(ctx, 'dik açı · 90°', H[0] + 70, H[1] - 64, { size: 40, color: G.red(1), p: seg(t, 67.8, 68.5), align: 'left' });
      G.label(ctx, 'dikme', P[0] - 30, (P[1] + H[1]) / 2, { size: 40, color: G.red(1), p: seg(t, 68.2, 68.8), align: 'right' });
    }
    if (t > 69.4) { LI.Camera.screen(ctx); ctx.fillStyle = `rgba(${LI.PAPER_RGB},${seg(t, 69.4, 70) * 0.85})`; ctx.fillRect(0, 0, env.W, env.H); }
  }

  LI.registerScene({ id: 5, start: 54, end: 70, name: 'Angle & perpendicular', nameTr: 'Açı ve dikme',
    concept: 'Two rays, one start: vertex and arms; set square: right angle', conceptTr: 'Ortak başlangıçlı iki ışın: köşe ve kollar; gönye ile dik açı', outcome: 'MAT.5.3.1 · MAT.5.3.2', render });
})(window.LI = window.LI || {});
