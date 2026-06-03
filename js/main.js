/**
 * Aximatrix entry point — initializes modules only.
 */

import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initAboutTerminal } from './about-terminal.js';
import { initForm } from './form.js';
import { initSlashDividers } from './divider.js';
import { initCasesMedia } from './cases-media.js';

function initFooterYear() {
  const yearEl = document.getElementById('footer-year');

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAnimations();
  initAboutTerminal();
  initForm();
  initSlashDividers();
  initCasesMedia();
  initFooterYear();
});
