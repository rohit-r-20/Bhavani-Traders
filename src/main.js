/**
 * Bhavani Traders - Main Client Application Logic
 */

import { ClampVisualizer } from './models3D.js';
import { sound } from './sound.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Clamp Visualizer in Hero
  const clampViz = new ClampVisualizer('hero-clamp-canvas-container');


  // 2. Sound Toggle Button
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isEnabled = sound.toggle();
      soundBtn.setAttribute('aria-pressed', isEnabled ? 'true' : 'false');
      soundBtn.setAttribute('title', isEnabled ? 'Mute tactile sound effects' : 'Enable tactile sound effects');
      soundBtn.innerHTML = isEnabled
        ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
        : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      
      showToast(isEnabled ? 'Tactile sound enabled' : 'Sound muted');
    });
  }

  // 3. Mobile Navigation Drawer Controller
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

  const setMobileNavState = (isOpen) => {
    if (!mobileMenuBtn || !mobileNavDrawer) return;
    mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileNavDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    mobileNavDrawer.classList.toggle('is-open', isOpen);
    if (mobileNavOverlay) {
      mobileNavOverlay.classList.toggle('is-open', isOpen);
      mobileNavOverlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }
    document.body.classList.toggle('mobile-nav-active', isOpen);
  };

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      setMobileNavState(!isExpanded);
      sound.playMetallicTap(740, 0.04);
    });

    if (mobileNavOverlay) {
      mobileNavOverlay.addEventListener('click', () => {
        setMobileNavState(false);
      });
    }

    // Close on any drawer navigation click
    const drawerLinks = mobileNavDrawer.querySelectorAll('a');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        setMobileNavState(false);
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('is-open')) {
        setMobileNavState(false);
        mobileMenuBtn.focus();
      }
    });
  }

  // 4. Clipboard Copy Handlers (Plus Code & Address)
  const copyButtons = document.querySelectorAll('[data-copy-text]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy-text');
      const label = btn.getAttribute('data-copy-label') || 'Text';

      try {
        await navigator.clipboard.writeText(textToCopy);
        sound.playSuccessTone();
        showToast(`Copied ${label} to clipboard`);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        sound.playSuccessTone();
        showToast(`Copied ${label} to clipboard`);
      }
    });
  });

  // 5. Stylized Vector Map Preview Canvas
  initMapCanvas();

  // 6. Sound hooks on interactive elements
  const interactiveBtns = document.querySelectorAll('button, .btn-primary, .btn-secondary, .btn-call-compact, .btn-brass-outline');
  interactiveBtns.forEach(el => {
    el.addEventListener('mouseenter', () => {
      sound.playMetallicTap(980, 0.015);
    });
  });
});

/**
 * Toast notification for clipboard copy and system notifications
 */
let toastTimeout = null;
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast-notice';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> <span>${message}</span>`;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/**
 * Procedural Stylized Cartographic Canvas for Store Location
 * Renders an architectural editorial street layout representation
 */
function initMapCanvas() {
  const canvas = document.getElementById('map-preview-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const draw = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Warm cartographic base
    ctx.fillStyle = '#E8E4DC';
    ctx.fillRect(0, 0, w, h);

    // Subtle grid
    ctx.strokeStyle = '#DCD6CB';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Main arterial road (Nerkundram / Karanodai highway artery)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.72);
    ctx.lineTo(w * 0.45, h * 0.65);
    ctx.lineTo(w, h * 0.45);
    ctx.stroke();

    // Road casing
    ctx.strokeStyle = '#C9C2B5';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Iyyar Street (approaching Bhavani Traders)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(w * 0.45, h * 0.65);
    ctx.lineTo(w * 0.5, h * 0.32);
    ctx.lineTo(w * 0.62, h * 0.2);
    ctx.stroke();

    // Secondary connector streets
    ctx.strokeStyle = '#F2EFE9';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, 0);
    ctx.lineTo(w * 0.3, h * 0.68);
    ctx.moveTo(w * 0.5, h * 0.32);
    ctx.lineTo(w * 0.85, h * 0.35);
    ctx.stroke();

    // Street labels in micro editorial style
    ctx.fillStyle = '#83796D';
    ctx.font = '500 9px "JetBrains Mono", monospace';
    ctx.fillText('STORE SITE', w * 0.53, h * 0.28);
    ctx.fillText('CHENNAI', w * 0.1, h * 0.85);

    // Location indicator concentric pulse circles
    ctx.strokeStyle = 'rgba(184, 82, 51, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.38, 22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(184, 82, 51, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.38, 38, 0, Math.PI * 2);
    ctx.stroke();
  };

  draw();

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas.parentElement || canvas);
  } else {
    window.addEventListener('resize', draw);
  }
}
