/**
 * Case study card images — skeleton state until each image finishes loading.
 */

const LOADED_CLASS = 'cases__item-media--loaded';

/**
 * @param {HTMLImageElement} image
 */
function revealCaseImage(image) {
  const media = image.closest('.cases__item-media');

  if (media) {
    media.classList.add(LOADED_CLASS);
  }
}

/**
 * @param {HTMLImageElement} image
 */
function bindCaseImage(image) {
  if (image.complete && image.naturalWidth > 0) {
    revealCaseImage(image);
    return;
  }

  image.addEventListener('load', () => revealCaseImage(image), { once: true });
  image.addEventListener('error', () => revealCaseImage(image), { once: true });
}

/**
 * Initialize skeleton loading for all case study card images.
 */
export function initCasesMedia() {
  const images = document.querySelectorAll('.cases__item-image');

  images.forEach(bindCaseImage);
}
