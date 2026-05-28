// Configuration and Globals
const frameCount = 228;
const folderName = 'ezgif-6434652fda05ab12-jpg';
const filePrefix = 'ezgif-frame-';
const fileExtension = '.jpg';
const images = [];

// Scroll Animation State
const scrollState = {
  currentFrame: 1,
  targetFrame: 1,
  lerpFactor: 0.06, // Smooth scrolling inertia factor (0.06 is ultra-smooth)
};

// Custom Cursor Coordinates
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
const follower = { x: 0, y: 0 };

// Helper: Format frame index with leading zeros (e.g., 5 -> "005", 50 -> "050")
function getFrameFilename(index) {
  const paddedIndex = String(index).padStart(3, '0');
  return `${folderName}/${filePrefix}${paddedIndex}${fileExtension}`;
}

// DOM Elements
const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');
const loaderOverlay = document.getElementById('loader-overlay');
const loaderBar = document.getElementById('loader-bar');
const loaderStatus = document.getElementById('loader-status');
const customCursor = document.getElementById('custom-cursor');
const customCursorFollower = document.getElementById('custom-cursor-follower');

// Initialize Canvas Sizing
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  renderFrame(Math.round(scrollState.currentFrame));
}

// Draw Frame on Canvas with cover scaling (similar to background-size: cover)
function renderFrame(frameIndex) {
  const img = images[frameIndex - 1];
  if (!img || !img.complete) return;

  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  // Clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Aspect ratio calculations for cropping (cover mode)
  const imageAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = canvasWidth / canvasHeight;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (canvasAspect > imageAspect) {
    // Canvas is wider than image aspect ratio - fit width, crop height
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imageAspect;
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  } else {
    // Canvas is taller than image aspect ratio - fit height, crop width
    drawWidth = canvasHeight * imageAspect;
    drawHeight = canvasHeight;
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

// Progressive Preloading Queue
function preloadFrames() {
  let loadedCount = 0;

  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = getFrameFilename(i);

    img.onload = () => {
      loadedCount++;
      const progress = Math.round((loadedCount / frameCount) * 100);

      // Update loader UI
      if (loaderBar) loaderBar.style.width = `${progress}%`;
      if (loaderStatus) loaderStatus.textContent = `Loading Energy... ${progress}%`;

      // If critical first frames are ready, draw first frame immediately
      if (i === 1) {
        images[0] = img;
        resizeCanvas();
      }

      if (loadedCount === frameCount) {
        // Preloading Complete
        setTimeout(() => {
          if (loaderOverlay) {
            loaderOverlay.style.opacity = '0';
            loaderOverlay.style.pointerEvents = 'none';
          }
          requestAnimationFrame(animationTick);
        }, 600);
      }
    };

    img.onerror = () => {
      // Gracefully handle load error, keep progress moving
      loadedCount++;
      console.warn(`Could not load frame index ${i} at path: ${img.src}`);
    };

    images.push(img);
  }
}

// Scroll Update Logic
function updateScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollSpacer = document.getElementById('scroll-spacer');
  if (!scrollSpacer) return;

  const maxScroll = scrollSpacer.offsetHeight;
  if (maxScroll <= 0) return;

  const scrollPercent = Math.min(1, Math.max(0, scrollTop / maxScroll));

  // Map scroll percent smoothly as a FLOAT to enable continuous sub-pixel/sub-frame lerp!
  scrollState.targetFrame = Math.max(1, Math.min(frameCount, 1 + scrollPercent * (frameCount - 1)));

  // Animate the hero text overlay fade out & slide up based on scroll
  const heroOverlay = document.getElementById('scroll-hero-overlay');
  if (heroOverlay) {
    if (scrollPercent <= 0.30) {
      const opacity = 1 - (scrollPercent / 0.30);
      heroOverlay.style.opacity = opacity;
      heroOverlay.style.transform = `translateY(${-scrollPercent * 80}px)`;
      heroOverlay.style.pointerEvents = 'none';
      heroOverlay.style.visibility = 'visible';
    } else {
      heroOverlay.style.opacity = '0';
      heroOverlay.style.visibility = 'hidden';
    }
  }
}

// Custom Cursor Interactions
function initCustomCursor() {
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  // Interactive cursor expansion using highly scalable event delegation
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .interactive, [role="button"]')) {
      document.body.classList.add('hover-active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .interactive, [role="button"]')) {
      document.body.classList.remove('hover-active');
    }
  });
}

// 60FPS Game/Animation Loop Tick
function animationTick() {
  // 1. Lerp Image Frame Scroll Transition
  const frameDelta = scrollState.targetFrame - scrollState.currentFrame;

  if (Math.abs(frameDelta) > 0.01) {
    scrollState.currentFrame += frameDelta * scrollState.lerpFactor;
    renderFrame(Math.round(scrollState.currentFrame));
  } else {
    scrollState.currentFrame = scrollState.targetFrame;
  }

  // 2. Lerp Custom Cursor Pointer
  const cursorFollowDeltaX = mouse.targetX - follower.x;
  const cursorFollowDeltaY = mouse.targetY - follower.y;

  follower.x += cursorFollowDeltaX * 0.12;
  follower.y += cursorFollowDeltaY * 0.12;

  // Immediate pointer follow
  if (customCursor) {
    customCursor.style.left = `${mouse.targetX}px`;
    customCursor.style.top = `${mouse.targetY}px`;
  }

  // Delayed springy follower
  if (customCursorFollower) {
    customCursorFollower.style.left = `${follower.x}px`;
    customCursorFollower.style.top = `${follower.y}px`;
  }

  // Continuous loop
  requestAnimationFrame(animationTick);
}

// Event Listeners
window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', () => {
  updateScrollProgress();
});

// Initialization
function init() {
  initCustomCursor();
  preloadFrames();
}

// Start app
window.addEventListener('DOMContentLoaded', init);
