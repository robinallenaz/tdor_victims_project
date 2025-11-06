// Loads a list of image paths from data/photos.json and renders a responsive grid.
// Start with local "photos/<filename>.jpg". You can later switch entries to full URLs.

(async () => {
  const grid = document.getElementById('grid');

  function addImage(src) {
    const img = new Image();
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = src.startsWith('http') ? src : `photos/${src}`;
    img.alt = '';
    grid.appendChild(img);
  }

  try {
    const res = await fetch('data/photos.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const images = Array.isArray(data?.images) ? data.images : [];
    images.forEach(addImage);
  } catch (err) {
    console.error('Failed to load photos.json', err);
    grid.innerHTML = '<p style="padding:12px;text-align:center">Unable to load collage images.</p>';
  }
})();
