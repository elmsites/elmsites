/* Demo fan showcase — vanilla port of the reference React/GSAP card-fan.
   Tuned values below are carried over verbatim; retune here. */
(function () {
  /* rotation°, scale, x-offset (rem), y-offset (rem), z-index */
  var FAN = [
    { rot: -21, scale: 0.7756, x: -30, y: 7.3, z: 1  },
    { rot: -14, scale: 0.8498, x: -22, y: 4.0, z: 2  },
    { rot:  -7, scale: 0.9346, x: -11, y: 1.3, z: 3  },
    { rot:   0, scale: 1.0000, x:   0, y: 0.0, z: 10 },
    { rot:   7, scale: 0.9346, x:  11, y: 1.3, z: 3  },
    { rot:  14, scale: 0.8498, x:  22, y: 4.0, z: 2  },
    { rot:  21, scale: 0.7756, x:  30, y: 7.3, z: 1  }
  ];

  /* horizontal spread multiplier by viewport width */
  function xMul(w) {
    if (w < 480) return 0.28;
    if (w < 640) return 0.38;
    if (w < 768) return 0.5;
    if (w < 1024) return 0.75;
    return 1.0;
  }

  /* entry animation */
  var ENTER_FROM_Y = 12;      /* rem */
  var ENTER_FROM_SCALE = 0.5;
  var ENTER_DUR = 1.2;
  var ENTER_EASE = 'elastic.out(1.05,.78)';
  var ENTER_DELAY = 0.2;
  var ENTER_STAGGER = 0.06;

  /* hover */
  var HOVER_LIFT = 2.5;       /* rem, hovered card rises */
  var HOVER_SCALE = 1.08;     /* hovered card grows */
  var HOVER_PUSH = 2.4;       /* rem at distance 1, falls off as PUSH/dist */
  var HOVER_ROT = 3;          /* neighbour rotates ROT/(dist+1) degrees away */
  var HOVER_DUR = 0.5;
  var HOVER_EASE = 'elastic.out(1,.75)';
  var HOVER_DELAY = 0.02;     /* * distance */

  /* fan layout only above this width; below it CSS takes over with snap-scroll */
  var FAN_MIN_WIDTH = 640;

  var root = document.getElementById('fan');
  if (!root) return;
  var cards = Array.prototype.slice.call(root.querySelectorAll('.fan-card'));
  if (!cards.length) return;

  /* Without GSAP the absolute fan would stack every card in one spot —
     fall back to the flat scroll layout instead. */
  if (typeof window.gsap === 'undefined') {
    root.classList.add('is-flat');
    return;
  }

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* hover choreography is for real pointers only */
  var canHover = window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function rem() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  }
  function isFan() { return window.innerWidth >= FAN_MIN_WIDTH; }

  function base(i) {
    var p = FAN[i], r = rem(), m = xMul(window.innerWidth);
    return { x: p.x * m * r, y: p.y * r, rot: p.rot, scale: p.scale, z: p.z };
  }

  function place(i, animate) {
    var b = base(i);
    var vars = { x: b.x, y: b.y, rotation: b.rot, scale: b.scale, zIndex: b.z, opacity: 1 };
    if (animate) {
      vars.duration = HOVER_DUR; vars.ease = HOVER_EASE;
      gsap.to(cards[i], vars);
    } else {
      gsap.set(cards[i], vars);
    }
  }

  function placeAll(animate) {
    for (var i = 0; i < cards.length; i++) place(i, animate);
  }

  function clearFan() {
    /* hand layout back to CSS for the mobile scroll strip */
    for (var i = 0; i < cards.length; i++) gsap.set(cards[i], { clearProps: 'all' });
  }

  var entered = false;

  function runEntry() {
    if (entered) return;
    entered = true;
    var r = rem();
    for (var i = 0; i < cards.length; i++) {
      var b = base(i);
      gsap.set(cards[i], {
        x: b.x, y: b.y + ENTER_FROM_Y * r, rotation: b.rot,
        scale: ENTER_FROM_SCALE, zIndex: b.z, opacity: 0
      });
      gsap.to(cards[i], {
        y: b.y, scale: b.scale, opacity: 1,
        duration: ENTER_DUR, ease: ENTER_EASE,
        delay: ENTER_DELAY + i * ENTER_STAGGER
      });
    }
  }

  function hoverIn(h) {
    var r = rem();
    for (var i = 0; i < cards.length; i++) {
      var b = base(i), dist = Math.abs(i - h);
      if (i === h) {
        gsap.to(cards[i], {
          x: b.x, y: b.y - HOVER_LIFT * r, rotation: b.rot,
          scale: b.scale * HOVER_SCALE, zIndex: 20,
          duration: HOVER_DUR, ease: HOVER_EASE
        });
      } else {
        var dir = i > h ? 1 : -1;
        gsap.to(cards[i], {
          x: b.x + dir * (HOVER_PUSH / dist) * r,
          y: b.y,
          rotation: b.rot + dir * (HOVER_ROT / (dist + 1)),
          scale: b.scale, zIndex: b.z,
          duration: HOVER_DUR, ease: HOVER_EASE, delay: dist * HOVER_DELAY
        });
      }
    }
  }

  function hoverOut() { placeAll(true); }

  if (canHover) {
    cards.forEach(function (card, i) {
      card.addEventListener('mouseenter', function () { if (isFan()) hoverIn(i); });
      card.addEventListener('mouseleave', function () { if (isFan()) hoverOut(); });
    });
  }

  function boot() {
    if (!isFan()) { clearFan(); entered = false; return; }
    if (reduced) { placeAll(false); entered = true; return; }
    if (entered) { placeAll(false); return; }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { io.disconnect(); runEntry(); }
      }, { threshold: 0.25 });
      io.observe(root);
    } else {
      runEntry();
    }
  }

  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(boot, 150);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
