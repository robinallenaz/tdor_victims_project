// Loads a list of image paths from data/photos.json and renders a responsive grid.
// Start with local "photos/<filename>.jpg". You can later switch entries to full URLs.

(async () => {
  const grid = document.getElementById('grid');
  const gridClone = document.getElementById('gridClone');
  const track = document.getElementById('track');
  const loop = document.getElementById('loop');

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
    const tryPlay = () => {
      const p = bgAudio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          window.removeEventListener('pointerdown', onFirstInteraction);
          window.removeEventListener('keydown', onFirstInteraction);
        }).catch(() => {
          // Ignore autoplay errors; we'll start on user interaction.
        });
      }
    };

    const onFirstInteraction = () => {
      tryPlay();
    };

    window.addEventListener('pointerdown', onFirstInteraction, { once: true });
    window.addEventListener('keydown', onFirstInteraction, { once: true });

    // Attempt autoplay immediately (may be blocked in some browsers).
    tryPlay();
  }

})();
