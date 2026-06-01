/**
 * Fills slash divider lines to match container width (full slashes, no clipping).
 */

const SLASH_CHAR = '/';
const SELECTOR = '[data-slash-line]';

function getSlashCount(element) {
  const style = window.getComputedStyle(element);
  const probe = document.createElement('span');
  probe.textContent = SLASH_CHAR;
  probe.style.cssText = `
    position: absolute;
    visibility: hidden;
    white-space: nowrap;
    font: ${style.fontWeight} ${style.fontSize} / ${style.lineHeight} ${style.fontFamily};
    letter-spacing: ${style.letterSpacing};
  `;
  document.body.appendChild(probe);
  const charWidth = probe.getBoundingClientRect().width;
  probe.remove();

  if (charWidth <= 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(element.clientWidth / charWidth));
}

function fillSlashLine(element) {
  const count = getSlashCount(element);
  element.textContent = SLASH_CHAR.repeat(count);
}

/**
 * Initialize slash divider lines.
 */
export function initSlashDividers() {
  const lines = document.querySelectorAll(SELECTOR);

  if (lines.length === 0) {
    return;
  }

  lines.forEach((line) => {
    const update = () => fillSlashLine(line);

    update();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(update);
      observer.observe(line);
    } else {
      window.addEventListener('resize', update);
    }
  });
}
