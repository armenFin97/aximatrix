/**
 * Animations module — reserved for scroll, reveal, and motion effects.
 */

/**
 * Initialize animation hooks.
 * Extend when sections and motion specs are defined.
 */
export function initAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  if (animatedElements.length === 0) {
    return;
  }

  animatedElements.forEach((element) => {
    element.classList.add('is-animate-ready');
  });
}
