/* Squared notebook paper. The page tone + grain live in screen space;
   the printed 5 mm grid lives in WORLD space (LI.Grid) so it zooms and
   pans with the camera — that is how the film shows scale and infinity. */
(function (LI) {
  'use strict';
  const { gen } = LI.rng;
  const cache = {};
  const mk = (W, H) => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };

  function build(W, H) {
    const base = mk(W, H), b = base.getContext('2d');
    const g = b.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#F8F6EF'); g.addColorStop(1, '#F1EEE3');
    b.fillStyle = g; b.fillRect(0, 0, W, H);
    const R = gen('gpaper' + W + 'x' + H);
    for (let i = 0; i < 500; i++) {
      const x = R() * W, y = R() * H, L = 5 + R() * 18, a = R() * Math.PI * 2;
      b.strokeStyle = `rgba(110,110,130,${0.03 + R() * 0.04})`; b.lineWidth = 0.6;
      b.beginPath(); b.moveTo(x, y); b.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); b.stroke();
    }
    const grain = mk(W, H), gc = grain.getContext('2d');
    const id = gc.createImageData(W, H), d = id.data; let s = 97531;
    for (let i = 0; i < d.length; i += 4) {
      s = (Math.imul(s, 1103515245) + 12345) >>> 0;
      const n = (s >>> 16) & 255, v = 255 - (n > 215 ? (n - 215) * 0.8 : 0) - (n & 7) * 0.8;
      d[i] = v; d[i + 1] = v; d[i + 2] = v - 2; d[i + 3] = 255;
    }
    gc.putImageData(id, 0, 0);
    const vig = mk(W, H), vc = vig.getContext('2d');
    const vg = vc.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.4, W / 2, H / 2, Math.hypot(W, H) * 0.62);
    vg.addColorStop(0, 'rgba(60,70,90,0)'); vg.addColorStop(1, 'rgba(60,70,90,0.12)');
    vc.fillStyle = vg; vc.fillRect(0, 0, W, H);
    return { base, grain, vig };
  }

  LI.Paper = {
    get(env) { const k = env.W + 'x' + env.H; return cache[k] || (cache[k] = build(env.W, env.H)); },
    draw(ctx, env) { ctx.drawImage(this.get(env).base, 0, 0); },
    overlay(ctx, env) {
      const p = this.get(env);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.45; ctx.drawImage(p.grain, 0, 0);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(p.vig, 0, 0);
    },
  };

  /** world-space squared grid: 30 world units = 5 mm, so 60 units = 1 cm */
  LI.CM = 60;
  LI.Grid = {
    draw(ctx, env, cam, o = {}) {
      LI.Camera.apply(ctx, env, cam);
      const z = cam.zoom * (cam.tilt || 1);
      const hw = (Math.hypot(env.W, env.H) / 2) / Math.min(cam.zoom, z) + 60;
      let step = 30;
      while (step * cam.zoom < 9) step *= 5;
      const x0 = Math.floor((cam.x - hw) / step) * step, x1 = cam.x + hw;
      const y0 = Math.floor((cam.y - hw) / step) * step, y1 = cam.y + hw;
      const lw = Math.max(0.6, 1.1) / cam.zoom;
      const a = o.alpha ?? 1;
      ctx.lineWidth = lw;
      ctx.strokeStyle = `rgba(${LI.GRID_RGB},${0.32 * a})`;
      ctx.beginPath();
      for (let x = x0; x <= x1; x += step) { ctx.moveTo(x, y0); ctx.lineTo(x, y1); }
      for (let y = y0; y <= y1; y += step) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); }
      ctx.stroke();
      // notebook margin
      const mx = o.margin ?? -1020;
      if (mx > x0 && mx < x1) { ctx.strokeStyle = `rgba(${LI.RED_RGB},${0.35 * a})`; ctx.lineWidth = 2.2 / cam.zoom; ctx.beginPath(); ctx.moveTo(mx, y0); ctx.lineTo(mx, y1); ctx.stroke(); }
    },
  };
})(window.LI = window.LI || {});
