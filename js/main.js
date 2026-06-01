/**
 * Aximatrix entry point — initializes modules only.
 */

import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initSlashDividers } from './divider.js';

function initFooterYear() {
  const yearEl = document.getElementById('footer-year');

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAnimations();
  initSlashDividers();
  initFooterYear();
});
