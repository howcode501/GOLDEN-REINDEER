/*!
 * Golden Reindeer — homepage interactions (no dependencies)
 *  - Automation Store on/off switches + "x of 6 switched on" counter
 *  - FAQ accordion (one answer open at a time)
 *  - "Stop juggling five apps" panel: the cards fly in from 3D space and
 *    assemble into one platform as the section scrolls into view; tilts with the mouse.
 */
(function () {
  'use strict';
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // ---- Automation Store switches ----
  var toggles = Array.prototype.slice.call(document.querySelectorAll('[data-toggle]'));
  var count = document.getElementById('auto-count');
  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', (on ? 'Turn off ' : 'Turn on ') + btn.getAttribute('data-title'));
      if (count) count.textContent = toggles.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
    });
  });

  // ---- FAQ accordion ----
  var qs = Array.prototype.slice.call(document.querySelectorAll('[data-faq]'));
  qs.forEach(function (q) {
    q.addEventListener('click', function () {
      var opening = q.getAttribute('aria-expanded') !== 'true';
      qs.forEach(function (o) {
        var open = o === q && opening;
        o.setAttribute('aria-expanded', open ? 'true' : 'false');
        o.querySelector('.faq-sign').textContent = open ? '−' : '+';
        document.getElementById(o.getAttribute('aria-controls')).hidden = !open;
      });
    });
  });

  // ---- "One shared brain" panel ----
  var section = document.getElementById('one-brain');
  var panel = document.getElementById('brain-panel');
  if (!section || !panel) return;
  var p = reduced ? 1 : 0, mx = 0, my = 0, raf = 0;

  function render() {
    var t = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    var L = function (a, b) { return (a + (b - a) * t).toFixed(1); };
    var card = function (x0, y0, z0, r0, x1, y1, z1) {
      return 'translate3d(' + L(x0, x1) + 'px,' + L(y0, y1) + 'px,' + L(z0, z1) + 'px) rotateZ(' + L(r0, 0) + 'deg) rotateY(' + L(r0 * -2, 0) + 'deg)';
    };
    var chip = function (x0, y0, z0, x1, y1) {
      return 'translate(-50%,-50%) translate3d(' + L(x0, x1) + 'px,' + L(y0, y1) + 'px,' + L(z0, -60) + 'px) scale(' + L(1, 0.4) + ')';
    };
    var v = {
      stageT: 'rotateX(' + (Number(L(16, 4)) - my * 7).toFixed(1) + 'deg) rotateY(' + (Number(L(-20, 0)) + mx * 10).toFixed(1) + 'deg)',
      c1: card(-150, -150, 140, -9, -130, -110, 20),
      c2: card(160, -70, 240, 7, 130, -110, 20),
      c3: card(-30, 150, 60, -3, 0, 92, 20),
      c4: chip(-210, 40, 180, -60, 0),
      c5: chip(205, 110, 120, 60, 0),
      c6: chip(150, -205, 60, 0, -40),
      capA: (1 - Math.min(1, t * 2)).toFixed(2),
      capB: Math.max(0, t * 2 - 1).toFixed(2),
      hintA: (1 - Math.min(1, t * 3)).toFixed(2),
      hubO: Math.max(0, t * 1.6 - 0.6).toFixed(2),
      hubS: L(0.85, 1),
      chipO: (1 - t).toFixed(2)
    };
    for (var k in v) panel.style.setProperty('--' + k, v[k]);
  }
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      var vh = window.innerHeight || 800;
      var top = section.getBoundingClientRect().top;
      var np = Math.max(0, Math.min(1, (vh - top) / (vh * 0.85)));
      if (Math.abs(np - p) > 0.004) { p = np; render(); }
    });
  }
  panel.addEventListener('mousemove', function (e) {
    var r = panel.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    my = ((e.clientY - r.top) / r.height) * 2 - 1;
    render();
  });
  panel.addEventListener('mouseleave', function () { mx = 0; my = 0; render(); });
  if (!reduced) { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
  render();
})();
