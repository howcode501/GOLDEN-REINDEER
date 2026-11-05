/*!
 * Golden Reindeer — 3D particle reindeer for the homepage
 * Needs: three.js r149 (vendor/three.min.js, loaded before this file)
 *
 * What it does
 *  1. On load: a small reindeer appears at the header "Book free demo" button,
 *     gallops and grows until it stands full-size beside the hero "Book a demo" button.
 *  2. First 300px of scroll: it trots back to the left edge of the screen.
 *  3. Further scrolling: it runs left to right down the page and stops on top of
 *     the final "See what Google shows your customers" card.
 *  Legs only move while the page scrolls. Mouse movement turns its head/body when standing.
 *
 * How it finds its route — these attributes in index.html are the waypoints:
 *    data-gr-anchor="navdemo"  start   (header "Book free demo")
 *    data-gr-anchor="demo"     stand   (hero "Book a demo")
 *    data-gr-anchor="end"      finish  (final WhatsApp report card)
 *  The drawing surface is <canvas data-gr-gl> (sticky, full viewport, pointer-events: none).
 *
 * Tuning (search in this file):
 *    runDur  intro run length in seconds (3.0)
 *    big / mid / small / endH   reindeer height in px at each stage
 *    sB      scroll distance for the "trot to the left" step (300)
 *    uC1 / uC2   particle colours (gold / amber)
 *
 * Respects prefers-reduced-motion (no running, no particle shimmer).
 * If WebGL is unavailable the page works normally without the reindeer.
 */
(function () {
  'use strict';
  var GR = {
    gl: null, glCanvas: null, glTries: 0, glRaf: 0, gmx: 0, gmy: 0,
    reduced: !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    initGL() {
    if (this.gl) return;
    if (!this.glCanvas) this.glCanvas = document.querySelector('canvas[data-gr-gl]');
    const T = window.THREE;
    if (!T || !this.glCanvas) {
      this.glTries = (this.glTries || 0) + 1;
      if (this.glTries < 150) setTimeout(() => this.initGL(), 100);
      return;
    }
    const canvas = this.glCanvas;
    const q$ = (k) => document.querySelector('[data-gr-anchor="' + k + '"]');
    let renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true }); } catch (err) { return; }
    this.gl = renderer;
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
    renderer.setClearColor(0x000000, 0);
    const scene = new T.Scene();
    // orthographic camera in CSS pixels, so 3D objects can sit exactly on page sections
    const camera = new T.OrthographicCamera(-1, 1, 1, -1, -3000, 3000);
    camera.position.set(0, 0, 1000);

    // ---- seeded random ----
    let seed = 20261104;
    const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

    // ---- the golden reindeer, built as a cloud of points ----
    const P = [];
    const PART = []; let curPart = 0;   // 0 body, 1-4 legs, 6 map
    const add = (x, y, z) => { P.push(x, y, z); PART.push(curPart); };
    const ell = (cx, cy, cz, rx, ry, rz, n) => {
      for (let i = 0; i < n; i++) {
        const u = rnd() * 2 - 1, a = rnd() * 6.2832, s = Math.sqrt(1 - u * u), k = 0.84 + 0.16 * rnd();
        add(cx + rx * s * Math.cos(a) * k, cy + ry * u * k, cz + rz * s * Math.sin(a) * k);
      }
    };
    const tube = (pts, r0, r1, n) => {
      const L = [0];
      for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])); }
      const tot = L[L.length - 1];
      for (let k = 0; k < n; k++) {
        const d = rnd() * tot;
        let i = 1; while (i < L.length - 1 && L[i] < d) i++;
        const a = pts[i - 1], b = pts[i];
        const f = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
        const px = a[0] + (b[0] - a[0]) * f, py = a[1] + (b[1] - a[1]) * f, pz = a[2] + (b[2] - a[2]) * f;
        let tx = b[0] - a[0], ty = b[1] - a[1], tz = b[2] - a[2];
        const tl = Math.hypot(tx, ty, tz) || 1; tx /= tl; ty /= tl; tz /= tl;
        let ux = 0, uy = 0, uz = 1; if (Math.abs(tz) > 0.9) { ux = 1; uz = 0; }
        let cx = ty * uz - tz * uy, cy = tz * ux - tx * uz, cz = tx * uy - ty * ux;
        const cl = Math.hypot(cx, cy, cz) || 1; cx /= cl; cy /= cl; cz /= cl;
        const vx = ty * cz - tz * cy, vy = tz * cx - tx * cz, vz = tx * cy - ty * cx;
        const r = (r0 + (r1 - r0) * d / tot) * (0.85 + 0.15 * rnd());
        const an = rnd() * 6.2832, ca = Math.cos(an) * r, sa = Math.sin(an) * r;
        add(px + cx * ca + vx * sa, py + cy * ca + vy * sa, pz + cz * ca + vz * sa);
      }
    };
    ell(0, 1.15, 0, 0.85, 0.36, 0.31, 1500);
    ell(0.58, 1.2, 0, 0.4, 0.42, 0.3, 600);
    ell(-0.66, 1.2, 0, 0.38, 0.37, 0.3, 500);
    tube([[0.72, 1.32, 0], [0.92, 1.66, 0], [1.06, 1.88, 0]], 0.2, 0.12, 520);
    ell(1.16, 1.96, 0, 0.24, 0.15, 0.13, 360);
    tube([[1.2, 1.94, 0], [1.38, 1.86, 0], [1.5, 1.8, 0]], 0.1, 0.065, 200);
    ell(-1.04, 1.38, 0, 0.08, 0.1, 0.06, 40);
    [[0.55, 0.17, 1], [0.55, -0.17, 1], [-0.62, 0.17, -1], [-0.62, -0.17, -1]].forEach((L, li) => {
      curPart = li + 1;
      const x = L[0], z = L[1];
      if (L[2] > 0) tube([[x, 1.0, z], [x + 0.05, 0.52, z], [x, 0.05, z]], 0.1, 0.045, 270);
      else tube([[x, 1.05, z], [x - 0.12, 0.58, z], [x + 0.02, 0.05, z]], 0.11, 0.045, 270);
      ell(x, 0.05, z, 0.06, 0.04, 0.05, 30);
    });
    curPart = 0;
    [1, -1].forEach((s) => {
      tube([[1.06, 2.05, 0.07 * s], [1.0, 2.4, 0.2 * s], [0.86, 2.75, 0.32 * s], [0.92, 3.08, 0.36 * s]], 0.045, 0.025, 330);
      tube([[1.0, 2.38, 0.2 * s], [1.22, 2.58, 0.24 * s]], 0.03, 0.018, 80);
      tube([[0.88, 2.68, 0.3 * s], [1.06, 2.95, 0.33 * s]], 0.028, 0.016, 80);
      tube([[0.87, 2.82, 0.33 * s], [0.68, 3.02, 0.38 * s]], 0.026, 0.015, 80);
      tube([[1.03, 2.22, 0.12 * s], [1.2, 2.3, 0.1 * s]], 0.025, 0.015, 50);
      tube([[1.04, 2.05, 0.1 * s], [0.94, 2.16, 0.22 * s]], 0.035, 0.02, 40);
    });
    const deerCount = P.length / 3;
    // ---- the map it stands on ----
    curPart = 6;
    for (let gx = -2.6; gx <= 2.6; gx += 0.13) {
      for (let gz = -2.6; gz <= 2.6; gz += 0.13) {
        if (gx * gx + gz * gz < 6.76 && rnd() < 0.9) add(gx + 0.3, 0.02, gz);
      }
    }
    for (let i = 0; i < 240; i++) { const a = (i / 240) * 6.2832; add(0.3 + Math.cos(a) * 1.4, 0.02, Math.sin(a) * 1.4); }
    const count = P.length / 3;
    for (let i = 0; i < count; i++) { P[i * 3] -= 0.35; P[i * 3 + 1] -= 1.55; }

    // ---- second object: the "shared brain" globe the deer turns into ----
    const B = new Float32Array(count * 3), rand = new Float32Array(count), size = new Float32Array(count), part = new Float32Array(count);
    const G = count - deerCount;
    for (let i = 0; i < count; i++) {
      let x, y, z;
      if (i < deerCount) {
        y = 1 - 2 * (i + 0.5) / deerCount;
        const rr = Math.sqrt(1 - y * y), th = i * 2.39996, j = 1 + (rnd() - 0.5) * 0.06;
        x = Math.cos(th) * rr * j; z = Math.sin(th) * rr * j; y *= j;
      } else {
        const k = i - deerCount, ring = k % 3, a = (k / G) * 6.2832 * 3 + ring;
        const R = 1.45, tx = 1.2 + ring * 0.5, ty = ring * 1.1;
        x = Math.cos(a) * R; y = 0; z = Math.sin(a) * R;
        const y1 = y * Math.cos(tx) - z * Math.sin(tx), z1 = y * Math.sin(tx) + z * Math.cos(tx);
        const x2 = x * Math.cos(ty) + z1 * Math.sin(ty), z2 = -x * Math.sin(ty) + z1 * Math.cos(ty);
        x = x2; y = y1; z = z2;
      }
      B[i * 3] = x; B[i * 3 + 1] = y; B[i * 3 + 2] = z;
      rand[i] = rnd();
      part[i] = PART[i];
      size[i] = i >= deerCount ? 0.8 + rnd() * 0.4 : (rnd() < 0.04 ? 2.6 : 0.9 + rnd() * 0.8);
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(new Float32Array(P), 3));
    geo.setAttribute('aB', new T.BufferAttribute(B, 3));
    geo.setAttribute('aRand', new T.BufferAttribute(rand, 1));
    geo.setAttribute('aSize', new T.BufferAttribute(size, 1));
    geo.setAttribute('aPart', new T.BufferAttribute(part, 1));
    const mA = new T.Matrix4(), mB = new T.Matrix4();
    const mat = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.NormalBlending,
      uniforms: {
        uMA: { value: mA }, uMB: { value: mB }, uM: { value: 0 }, uRun: { value: 0 }, uTime: { value: 0 },
        uPR: { value: renderer.getPixelRatio() }, uGround: { value: 0 }, uVel: { value: new T.Vector3() },
        uC1: { value: new T.Color(0.86, 0.6, 0.2) }, uC2: { value: new T.Color(0.52, 0.25, 0.03) }
      },
      vertexShader: [
        'attribute vec3 aB; attribute float aRand; attribute float aSize; attribute float aPart;',
        'uniform mat4 uMA; uniform mat4 uMB; uniform float uM; uniform float uRun; uniform float uTime; uniform float uPR; uniform float uGround; uniform vec3 uVel;',
        'varying float vA; varying float vR;',
        'void main(){',
        '  vec3 a = position;',
        '  if (aPart > 0.5 && aPart < 4.5) {',
        '    vec2 pv = aPart < 2.5 ? vec2(0.2,-0.55) : vec2(-0.97,-0.5);',
        '    float ph = aPart < 1.5 ? 0.0 : (aPart < 2.5 ? 0.7 : (aPart < 3.5 ? 3.14 : 3.84));',
        '    float ang = uRun*0.65*sin(uTime*13.0+ph);',
        '    vec2 d = a.xy - pv; float s = sin(ang); float c = cos(ang);',
        '    a.xy = pv + vec2(c*d.x - s*d.y, s*d.x + c*d.y);',
        '  }',
        '  if (aPart < 5.5) { a.y += uRun*0.08*sin(uTime*26.0); }',
        '  a += 0.012*vec3(sin(uTime*1.3+aRand*40.0), cos(uTime*1.1+aRand*30.0), sin(uTime*0.9+aRand*20.0));',
        '  vec3 wa = (uMA*vec4(a,1.0)).xyz - uVel*aRand*uRun;',
        '  vec3 wb = (uMB*vec4(aB,1.0)).xyz;',
        '  float m = clamp((uM - aRand*0.3)/0.7, 0.0, 1.0); m = m*m*(3.0-2.0*m);',
        '  vec3 p = mix(wa, wb, m);',
        '  float arc = sin(m*3.14159);',
        '  p.x += arc*(aRand-0.5)*320.0;',
        '  p.z += arc*(fract(aRand*7.31)-0.5)*240.0;',
        '  gl_Position = projectionMatrix*viewMatrix*vec4(p,1.0);',
        '  gl_PointSize = aSize*uPR*2.6*clamp(1.0+p.z/900.0, 0.5, 1.8);',
        '  float g = aPart > 5.5 ? max(uGround, m) : 1.0;',
        '  vA = (0.62+0.38*sin(uTime*2.0+aRand*60.0))*g;',
        '  vR = aRand;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uC1; uniform vec3 uC2;',
        'varying float vA; varying float vR;',
        'void main(){',
        '  float d = length(gl_PointCoord-0.5);',
        '  if (d > 0.5) discard;',
        '  float a = smoothstep(0.5,0.12,d);',
        '  gl_FragColor = vec4(mix(uC2,uC1,vR), a*vA*0.92);',
        '}'
      ].join('\n')
    });
    const pts = new T.Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);

    const reduced = this.reduced;
    const runDur = reduced ? 0 : 3.0;
    const t0 = performance.now();
    const q = new T.Quaternion(), eu = new T.Euler(), v = new T.Vector3(), sc = new T.Vector3();
    let lw = 0, lh = 0, smx = 0, smy = 0, lastS = -1, speed = 0, runS = 0, face = 0, lastX = null, ry = null;
    const lerp = (a, b, t) => a + (b - a) * t;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const loop = () => {
      this.glRaf = requestAnimationFrame(loop);
      const W = canvas.clientWidth, H = canvas.clientHeight;
      if (!W || !H) return;
      if (W !== lw || H !== lh) {
        renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1, 8000 / H));
        renderer.setSize(W, H, false);
        mat.uniforms.uPR.value = renderer.getPixelRatio();
        camera.left = -W / 2; camera.right = W / 2; camera.top = H / 2; camera.bottom = -H / 2;
        camera.updateProjectionMatrix();
        lw = W; lh = H;
      }
      const now = (performance.now() - t0) / 1000;
      const s = window.scrollY || document.documentElement.scrollTop || 0;
      const cr = canvas.getBoundingClientRect();
      // anchor points in page coordinates (x from the canvas's left edge, y from the top of the page)
      const doc = (el, fx, fy) => { if (!el) return null; const r = el.getBoundingClientRect(); return [r.left - cr.left + r.width * fx, r.top + s + r.height * fy]; };
      const aStart = doc(q$('navdemo'), 0.5, 1), aDemo = doc(q$('demo'), 1, 1), aEnd = doc(q$('end'), 1, 0);
      if (lastS < 0) lastS = s;
      speed += (Math.abs(s - lastS) - speed) * 0.2; lastS = s;
      smx += (this.gmx - smx) * 0.05; smy += (this.gmy - smy) * 0.05;
      const vh = window.innerHeight || H;
      const big = Math.min(300, W * 0.32), mid = Math.min(160, W * 0.24), small = 64, endH = Math.min(130, W * 0.22);

      // 1) on load: starts small at the header's "Book free demo", runs and grows until it stands beside "Book a demo"
      const p0 = aStart ? [aStart[0], aStart[1]] : [W * 0.8, 70];
      const p1 = aDemo ? [Math.min(W - big * 0.5, aDemo[0] + big * 0.45 + 150), aDemo[1]] : [W * 0.6, 560];
      const rt = runDur ? Math.min(1, Math.max(0, (now - 0.3) / runDur)) : 1;
      const re = ease(rt);
      let fx = lerp(p0[0], p1[0], re), fy = lerp(p0[1], p1[1], re) - Math.sin(re * Math.PI) * 60;
      let hp = lerp(small, big, re);

      // 2) first scroll: trots back to the left edge
      const sB = 300;
      const pL = [Math.max(mid * 0.5, W * 0.08), sB + vh * 0.62];
      const b = Math.min(1, s / sB), be = ease(b);
      fx = lerp(fx, pL[0], be); fy = lerp(fy, pL[1], be); hp = lerp(hp, mid, be);

      // 3) then runs left to right, down the page, and stops on top of the WhatsApp report card
      const pE = aEnd ? [aEnd[0] - Math.max(110, W * 0.1), aEnd[1]] : [W * 0.85, sB + vh * 3];
      const endS = Math.max(sB + 1, pE[1] - vh * 0.7);
      let u = 0;
      if (s > sB) {
        u = Math.min(1, (s - sB) / (endS - sB));
        fx = lerp(pL[0], pE[0], u);
        fy = lerp(pL[1], pE[1], u);
        hp = lerp(mid, endH, u);
      }

      // running: during the intro, and whenever the page is scrolling
      const introRun = reduced ? 0 : Math.min(1, Math.max(0, (1 - rt) / 0.25));
      const scrollRun = reduced || u >= 1 ? 0 : Math.min(1, speed / 6);
      runS += (Math.max(introRun, scrollRun) - runS) * 0.15;
      if (lastX !== null) { const dx = fx - lastX; if (dx > 0.4) face = 0; else if (dx < -0.4) face = Math.PI; }
      lastX = fx;
      const settle = 1 - runS;
      const look = settle * (-0.45 + (reduced ? 0 : Math.sin(now * 0.25) * 0.2) + smx * 0.45);
      const targetRy = face + (face ? -look : look);
      ry = ry === null ? targetRy : ry + (targetRy - ry) * 0.2;
      eu.set(settle * (0.06 + smy * 0.06), ry, 0);
      q.setFromEuler(eu);
      const scale = hp / 3.1;
      v.set(fx - W / 2, -(fy - s - H / 2) + 1.53 * scale + Math.abs(Math.sin(now * 13)) * 0.06 * hp * runS, 0);
      sc.setScalar(scale);
      mA.compose(v, q, sc);

      mat.uniforms.uVel.value.set(face ? -60 : 60, 0, 0);
      mat.uniforms.uM.value = 0;
      mat.uniforms.uRun.value = runS;
      mat.uniforms.uGround.value = settle * (1 - b);
      mat.uniforms.uTime.value = reduced ? 0 : now;
      renderer.render(scene, camera);
    };
    loop();
    }
  };
  window.addEventListener('mousemove', function (e) {
    GR.gmx = (e.clientX / (window.innerWidth || 1)) * 2 - 1;
    GR.gmy = (e.clientY / (window.innerHeight || 1)) * 2 - 1;
  }, { passive: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { GR.initGL(); });
  else GR.initGL();
  window.GoldenReindeer = GR;
})();
