/**
 * About section — terminal boot-sequence typewriter animation.
 */

const PAUSE_BETWEEN_LINES_MS = 400;
const PAUSE_BEFORE_REVEAL_MS = 400;
const INITIAL_CURSOR_DELAY_MS = 280;

/**
 * @param {string} char
 * @returns {number}
 */
function getCharDelay(char) {
  if (char === ' ') {
    return 28;
  }

  if ('.:!?'.includes(char)) {
    return 110;
  }

  if (char === ',') {
    return 75;
  }

  if (char === '-') {
    return 55;
  }

  return 38 + Math.floor(Math.random() * 32);
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/**
 * @param {HTMLElement} layerEl
 * @param {HTMLElement} textEl
 * @param {HTMLElement} cursorEl
 * @param {string} text
 * @returns {Promise<void>}
 */
async function typeText(layerEl, textEl, cursorEl, text) {
  layerEl.appendChild(cursorEl);

  for (let index = 0; index < text.length; index += 1) {
    textEl.textContent += text.charAt(index);
    await wait(getCharDelay(text.charAt(index)));
  }
}

/**
 * @param {HTMLElement} lineEl
 * @returns {string}
 */
function getLineText(lineEl) {
  const reserveEl = lineEl.querySelector('.about__typewriter-reserve');

  if (reserveEl) {
    return reserveEl.textContent.trim();
  }

  return lineEl.dataset.aboutText?.trim() ?? lineEl.textContent.trim();
}

/**
 * @param {HTMLElement} section
 * @param {HTMLElement} titleLine
 * @param {HTMLElement} subtitleLine
 * @param {HTMLElement} titleLayer
 * @param {HTMLElement} subtitleLayer
 * @param {HTMLElement} titleTextEl
 * @param {HTMLElement} subtitleTextEl
 * @param {HTMLElement} cursorEl
 * @param {HTMLElement} descriptionEl
 * @param {string} titleText
 * @param {string} subtitleText
 */
async function runTerminalSequence(
  section,
  titleLine,
  subtitleLine,
  titleLayer,
  subtitleLayer,
  titleTextEl,
  subtitleTextEl,
  cursorEl,
  descriptionEl,
  titleText,
  subtitleText,
) {
  section.classList.add('is-terminal-active');
  titleLayer.appendChild(cursorEl);

  await wait(INITIAL_CURSOR_DELAY_MS);
  await typeText(titleLayer, titleTextEl, cursorEl, titleText);

  await wait(PAUSE_BETWEEN_LINES_MS);

  await typeText(subtitleLayer, subtitleTextEl, cursorEl, subtitleText);

  await wait(PAUSE_BEFORE_REVEAL_MS);

  descriptionEl.classList.add('is-terminal-description-visible');
  titleTextEl.removeAttribute('aria-hidden');
  subtitleTextEl.removeAttribute('aria-hidden');
  section.classList.add('is-terminal-complete');
  section.classList.remove('is-terminal-active', 'about--terminal-pending');
}

/**
 * @param {HTMLElement} section
 */
function showTerminalImmediately(section) {
  const titleLine = section.querySelector('.about__title');
  const subtitleLine = section.querySelector('.about__subtitle');
  const descriptionEl = section.querySelector('.about__description');

  [titleLine, subtitleLine].forEach((lineEl) => {
    if (!lineEl) {
      return;
    }

    const text = getLineText(lineEl);
    const textEl = lineEl.querySelector('.about__typewriter-text');
    const reserveEl = lineEl.querySelector('.about__typewriter-reserve');

    if (textEl) {
      textEl.textContent = text;
      textEl.removeAttribute('aria-hidden');
    } else {
      lineEl.textContent = text;
    }

    if (reserveEl) {
      reserveEl.remove();
    }
  });

  if (descriptionEl) {
    descriptionEl.classList.add('is-terminal-description-visible');
  }

  section.classList.add('is-terminal-complete', 'is-terminal-reduced');
  section.classList.remove('about--terminal-pending', 'is-terminal-active');
}

/**
 * @param {HTMLElement} section
 */
function prepareTerminalElements(section) {
  const titleLine = section.querySelector('.about__title');
  const subtitleLine = section.querySelector('.about__subtitle');

  if (!titleLine || !subtitleLine) {
    return null;
  }

  const titleLayer = titleLine.querySelector('.about__typewriter-layer');
  const subtitleLayer = subtitleLine.querySelector('.about__typewriter-layer');
  const titleTextEl = titleLine.querySelector('.about__typewriter-text');
  const subtitleTextEl = subtitleLine.querySelector('.about__typewriter-text');

  if (!titleLayer || !subtitleLayer || !titleTextEl || !subtitleTextEl) {
    return null;
  }

  const titleText = getLineText(titleLine);
  const subtitleText = getLineText(subtitleLine);

  titleTextEl.textContent = '';
  subtitleTextEl.textContent = '';
  titleTextEl.setAttribute('aria-hidden', 'true');
  subtitleTextEl.setAttribute('aria-hidden', 'true');

  const cursorEl = document.createElement('span');
  cursorEl.className = 'about__cursor';
  cursorEl.textContent = '|';
  cursorEl.setAttribute('aria-hidden', 'true');

  return {
    titleLine,
    subtitleLine,
    titleLayer,
    subtitleLayer,
    titleTextEl,
    subtitleTextEl,
    cursorEl,
    titleText,
    subtitleText,
  };
}

/**
 * Initialize About terminal typing animation.
 */
export function initAboutTerminal() {
  const section = document.querySelector('.about[data-about-terminal]');

  if (!section) {
    return;
  }

  const descriptionEl = section.querySelector('.about__description');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  section.classList.add('about--terminal-pending');

  if (prefersReducedMotion) {
    showTerminalImmediately(section);
    return;
  }

  const elements = prepareTerminalElements(section);

  if (!elements || !descriptionEl) {
    showTerminalImmediately(section);
    return;
  }

  let hasStarted = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || hasStarted) {
          return;
        }

        hasStarted = true;
        observer.disconnect();

        runTerminalSequence(
          section,
          elements.titleLine,
          elements.subtitleLine,
          elements.titleLayer,
          elements.subtitleLayer,
          elements.titleTextEl,
          elements.subtitleTextEl,
          elements.cursorEl,
          descriptionEl,
          elements.titleText,
          elements.subtitleText,
        );
      });
    },
    {
      threshold: 0.25,
      rootMargin: '0px 0px -5% 0px',
    },
  );

  observer.observe(section);
}
