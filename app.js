// Loads a list of image paths from data/photos.json and renders a responsive grid.
// Start with local "photos/<filename>.jpg". You can later switch entries to full URLs.

(async () => {
  const grid = document.getElementById('grid');
  const gridClone = document.getElementById('gridClone');
  const track = document.getElementById('track');
  const loop = document.getElementById('loop');
  const soundToggle = document.getElementById('sound-toggle');

  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let reduceMotion = Boolean(motionQuery?.matches);

  function makeImage(entry, scheduleHeightUpdate) {
    const img = new Image();
    img.loading = 'lazy';
    img.decoding = 'async';
    const src = typeof entry === 'string' ? entry : entry?.src;
    img.src = String(src || '').startsWith('http') ? src : `photos/${src}`;
    img.alt = typeof entry === 'object' && entry && typeof entry.alt === 'string' ? entry.alt : '';
    if (scheduleHeightUpdate) {
      img.addEventListener('load', scheduleHeightUpdate, { once: true });
      img.addEventListener('error', scheduleHeightUpdate, { once: true });
    }
    return img;
  }

  try {
    const res = await fetch(`data/photos.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const images = Array.isArray(data?.images) ? data.images : [];
    const fragA = document.createDocumentFragment();
    const fragB = document.createDocumentFragment();

    const computed = window.getComputedStyle(grid);
    const gap = Number.parseFloat(computed.rowGap || computed.gap) || 12;
    let gridHeight = 0;
    let heightUpdatePending = false;
    const updateGridHeight = () => {
      gridHeight = grid.offsetHeight + gap;
    };
    const scheduleHeightUpdate = () => {
      if (heightUpdatePending) return;
      heightUpdatePending = true;
      requestAnimationFrame(() => {
        heightUpdatePending = false;
        updateGridHeight();
      });
    };

    images.forEach(entry => {
      fragA.appendChild(makeImage(entry, scheduleHeightUpdate));
      fragB.appendChild(makeImage(entry, scheduleHeightUpdate));
    });
    grid.appendChild(fragA);
    gridClone.appendChild(fragB);

    scheduleHeightUpdate();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => scheduleHeightUpdate());
      ro.observe(grid);
    } else {
      window.addEventListener('resize', scheduleHeightUpdate);
    }

    // Continuous vertical loop animation
    let offset = 0;            // current translateY
    let speed = 40;            // px per second
    let last = performance.now();

    let rafId = 0;

    function step(now) {
      const dt = (now - last) / 1000;
      last = now;
      if (gridHeight > 0) {
        offset -= speed * dt;
        if (-offset >= gridHeight) {
          // When first grid has fully scrolled out, wrap offset by one grid height
          offset += gridHeight;
        }
        track.style.transform = `translateY(${offset}px)`;
      }
      rafId = requestAnimationFrame(step);
    }

    const stopAnimation = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      offset = 0;
      track.style.transform = 'translateY(0px)';
    };

    const startAnimation = () => {
      if (rafId) return;
      last = performance.now();
      rafId = requestAnimationFrame(step);
    };

    if (reduceMotion) stopAnimation();
    else startAnimation();

    if (motionQuery) {
      const onMotionChange = (e) => {
        reduceMotion = Boolean(e.matches);
        if (reduceMotion) stopAnimation();
        else startAnimation();
      };
      if (typeof motionQuery.addEventListener === 'function') motionQuery.addEventListener('change', onMotionChange);
      else if (typeof motionQuery.addListener === 'function') motionQuery.addListener(onMotionChange);
    }
  } catch (err) {
    console.error('Failed to load photos.json', err);
    grid.innerHTML = '<p style="padding:12px;text-align:center">Unable to load collage images.</p>';
  }

  // Background audio: best-effort autoplay with graceful fallback
  const bgAudio = document.getElementById('bg-audio');
  if (bgAudio) {
    bgAudio.loop = true;
    const storageKey = 'tdor_sound_enabled';

    const setToggleUi = (state) => {
      if (!soundToggle) return;
      if (state === 'on') {
        soundToggle.setAttribute('aria-pressed', 'true');
        soundToggle.textContent = 'Sound: On';
        return;
      }
      soundToggle.setAttribute('aria-pressed', 'false');
      soundToggle.textContent =
        state === 'starting'
          ? 'Sound: Starting…'
          : state === 'blocked'
            ? 'Tap to start sound'
            : 'Sound: Off';
    };

    const readPref = () => {
      try {
        return localStorage.getItem(storageKey) === 'true';
      } catch {
        return false;
      }
    };

    const writePref = (enabled) => {
      try {
        localStorage.setItem(storageKey, enabled ? 'true' : 'false');
      } catch {
        // ignore
      }
    };

    let intentEnabled = readPref();
    let playing = false;

    const stopPlayback = () => {
      intentEnabled = false;
      playing = false;
      writePref(false);
      bgAudio.pause();
      bgAudio.muted = true;
      setToggleUi('off');
    };

    const startPlayback = async () => {
      if (!intentEnabled) return;
      setToggleUi('starting');
      bgAudio.muted = false;
      try {
        await bgAudio.play();
        playing = true;
        setToggleUi('on');
        window.removeEventListener('pointerdown', onUserGesture);
        window.removeEventListener('keydown', onUserGesture);
      } catch {
        playing = false;
        setToggleUi('blocked');
      }
    };

    const onUserGesture = () => {
      if (intentEnabled && !playing) startPlayback();
    };

    // Default for first-time visitors: sound off (muted). If the user previously enabled
    // sound, attempt to start immediately, and retry on the next user gesture if blocked.
    bgAudio.muted = true;
    if (intentEnabled) {
      window.addEventListener('pointerdown', onUserGesture);
      window.addEventListener('keydown', onUserGesture);
      startPlayback();
    } else {
      setToggleUi('off');
    }

    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        if (intentEnabled) {
          stopPlayback();
          return;
        }
        intentEnabled = true;
        writePref(true);
        window.addEventListener('pointerdown', onUserGesture);
        window.addEventListener('keydown', onUserGesture);
        startPlayback();
      });
    }
  }

})();
