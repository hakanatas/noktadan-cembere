/* SAHNE 1 — NOKTA (0–11 s)            MAT.5.3.1 (a–c) · MAT.5.3.2 (b)
   The pencil taps the paper: a point. We zoom in 10× — the grid grows,
   the point does not: it marks a place and has no size. Points are
   named with capital letters. */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, track, outBack, outCubic, inOut, hump } = LI.E;
  const G = LI.Geo, S = LI.Stage;
  const A = S.A, B = S.B;
  const EXTRA = [['C', [-40, -210]], ['D', [130, 200]], ['K', [470, -170]], ['M', [-560, 170]]];

  function camera(t, env) {
    return S.track(env, [
      [0, { x: A[0], y: 0, zoom: 1.35 }],
      [3.3, { x: A[0], y: 0, zoom: 1.35 }],
      [5.3, { x: A[0], y: 0, zoom: 13 }, inOut],     // dive in: the grid grows, the point does not
      [6.2, { x: A[0], y: 0, zoom: 13 }],
      [7.4, { x: 0, y: 0, zoom: 1.1 }, inOut],
      [11, { x: 0, y: 10, zoom: 1.2 }],
    ], t);
  }

  function render(ctx, lt, env, t) {
    const cam = camera(t, env);
    S.begin(ctx, env, cam, t);
    const r = S.pr(cam, 10);
    // the tap
    const tap = outBack(seg(t, 1.95, 2.25));
    if (t > 1.95) {
      G.point(ctx, A[0], A[1], { r, grow: tap, seed: 1 });
      G.ping(ctx, A[0], A[1], seg(t, 2.0, 2.8), { r: 14 / cam.zoom, grow: 34 / cam.zoom });
    }
    // name: A
    G.label(ctx, 'A', A[0] - 34, A[1] - 46, { p: seg(t, 2.5, 3.1), size: 50, alpha: 1 - seg(t, 3.4, 3.9) + seg(t, 6.3, 6.9) });
    // while zoomed in: show that the point stays tiny (a size mark in red)
    const zin = seg(t, 4.8, 5.3) * (1 - seg(t, 6.0, 6.4));
    if (zin > 0) {
      // written in screen space so the letters stay crisp at 13× zoom
      ctx.save(); LI.Camera.screen(ctx);
      const sx = env.W / 2, sy = env.H / 2;
      G.label(ctx, 'hâlâ aynı küçüklükte', sx + 40, sy - 58, { size: 46, color: G.red(zin), p: seg(t, 4.9, 5.6), align: 'left' });
      LI.Ink.path(ctx, LI.E.quadPts([sx + 36, sy - 30], [sx + 22, sy - 20], [sx + 12, sy - 10], 6), { w: 3, color: LI.RED_RGB, alpha: zin, p: seg(t, 5.2, 5.6) });
      ctx.restore(); LI.Camera.apply(ctx, env, cam);
    }
    // more points, each named with a capital letter
    EXTRA.forEach(([name, p], i) => {
      const t0 = 7.4 + i * 0.28, g = outBack(seg(t, t0, t0 + 0.3)) * (1 - seg(t, 9.8, 10.6));
      if (g <= 0) return;
      G.point(ctx, p[0], p[1], { r, grow: g, seed: 10 + i, alpha: Math.min(1, g) });
      G.label(ctx, name, p[0] - 30, p[1] - 42, { p: seg(t, t0 + 0.2, t0 + 0.6), alpha: 1 - seg(t, 9.8, 10.6), size: 46 });
    });
    const gB = outBack(seg(t, 7.2, 7.5));
    if (gB > 0) { G.point(ctx, B[0], B[1], { r, grow: gB, seed: 2 }); G.label(ctx, 'B', B[0] + 32, B[1] - 46, { p: seg(t, 7.4, 7.8), size: 50 }); }

    // the pencil
    const tip = track([[0.9, [A[0] + 520, A[1] - 420]], [1.75, [A[0] + 6, A[1] - 36]], [2.0, A], [2.35, [A[0] + 70, A[1] - 110]], [3.1, [A[0] + 560, A[1] - 480]]], t);
    const pa = seg(t, 0.9, 1.2) * (1 - seg(t, 2.8, 3.1));
    G.pencil(ctx, tip[0], tip[1], { alpha: pa });
    // second pencil pass taps B and the extra points
    const taps = [[7.2, B], ...EXTRA.map(([, p], i) => [7.4 + i * 0.28, p])];
    let tip2 = null;
    for (let i = 0; i < taps.length; i++) {
      const [tt, p] = taps[i], nxt = taps[i + 1];
      if (t >= tt - 0.2 && (!nxt || t < nxt[0] - 0.2)) {
        const k = seg(t, tt - 0.2, tt);
        const from = i ? taps[i - 1][1] : [B[0] + 300, -300];
        tip2 = [lerp(from[0], p[0], outCubic(k)), lerp(from[1], p[1], outCubic(k)) - Math.sin(Math.PI * k) * 60];
      }
    }
    const pa2 = seg(t, 6.9, 7.1) * (1 - seg(t, 8.8, 9.2));
    if (tip2 && pa2 > 0) G.pencil(ctx, tip2[0], tip2[1], { alpha: pa2 });
    if (!tip2 && pa2 > 0) { const last = EXTRA[EXTRA.length - 1][1]; G.pencil(ctx, last[0] + 120 * seg(t, 8.6, 9.2), last[1] - 200 * seg(t, 8.6, 9.2), { alpha: pa2 }); }
  }

  LI.registerScene({ id: 1, start: 0, end: 11, name: 'Point', nameTr: 'Nokta',
    concept: 'A point marks a place; named with a capital letter', conceptTr: 'Nokta yer belirtir; büyük harfle adlandırılır', outcome: 'MAT.5.3.1 · MAT.5.3.2', render });
})(window.LI = window.LI || {});
