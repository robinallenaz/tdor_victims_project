// Loads a list of image paths from data/photos.json and renders a responsive grid.
// Start with local "photos/<filename>.jpg". You can later switch entries to full URLs.

(async () => {
  const grid = document.getElementById('grid');
  const gridClone = document.getElementById('gridClone');
  const track = document.getElementById('track');
  const loop = document.getElementById('loop');
  const soundToggle = document.getElementById('sound-toggle');

  function makeImage(src) {
    const img = new Image();
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = src.startsWith('http') ? src : `photos/${src}`;
    img.alt = '';
    return img;
  }

  try {
    const res = await fetch(`data/photos.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const images = Array.isArray(data?.images) ? data.images : [];
    const fragA = document.createDocumentFragment();
    const fragB = document.createDocumentFragment();
    images.forEach(src => {
      fragA.appendChild(makeImage(src));
      fragB.appendChild(makeImage(src));
    });
    grid.appendChild(fragA);
    gridClone.appendChild(fragB);

    // Continuous vertical loop animation
    let offset = 0;            // current translateY
    let speed = 40;            // px per second
    let last = performance.now();

    function step(now) {
      const dt = (now - last) / 1000;
      last = now;
      const gridHeight = grid.getBoundingClientRect().height + 12; // include gap
      if (gridHeight > 0) {
        offset -= speed * dt;
        if (-offset >= gridHeight) {
          // When first grid has fully scrolled out, wrap offset by one grid height
          offset += gridHeight;
        }
        track.style.transform = `translateY(${offset}px)`;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
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
