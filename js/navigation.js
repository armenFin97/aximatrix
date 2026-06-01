/**
 * Navigation module — mobile menu and nav state.
 */

const SELECTORS = {
  nav: '.nav',
  toggle: '.nav__toggle',
  list: '.nav__list',
};

const CLASSES = {
  listOpen: 'nav__list--open',
};

const ARIA = {
  expanded: 'aria-expanded',
};

/**
 * Initialize navigation behavior.
 */
export function initNavigation() {
  const nav = document.querySelector(SELECTORS.nav);
  if (!nav) {
    return;
  }

  const toggle = nav.querySelector(SELECTORS.toggle);
  const list = nav.querySelector(SELECTORS.list);

  if (!toggle || !list) {
    return;
  }

  toggle.addEventListener('click', () => {
    const isOpen = list.classList.toggle(CLASSES.listOpen);
    toggle.setAttribute(ARIA.expanded, String(isOpen));
  });

  list.addEventListener('click', (event) => {
    if (event.target.matches('.nav__link')) {
      list.classList.remove(CLASSES.listOpen);
      toggle.setAttribute(ARIA.expanded, 'false');
    }
  });
}
