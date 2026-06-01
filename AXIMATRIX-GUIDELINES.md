# Aximatrix — Development Guidelines (Source of Truth)

Internal reference for all work on this project. Check against this list **before writing any code**.

## Stack (mandatory)

- Plain **HTML**, **CSS**, and **vanilla JavaScript** only
- **No** frameworks, build tools, preprocessors, or libraries unless the user explicitly requests them
- **No** React, Vue, Tailwind, SCSS, Vite, Webpack, TypeScript, jQuery, or unnecessary dependencies

## Folder structure

```
aximatrix/
├── index.html
├── favicon.ico
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── css/
│   ├── normalize.css
│   ├── main.css
│   └── responsive.css
└── js/
    ├── main.js
    ├── animations.js
    └── navigation.js
```

## HTML

- Semantic tags: `header`, `main`, `section`, `footer`, `nav`, `button`, `form`
- **BEM** for classes — no random names (`box1`, `text-big`, `item2`)
- No inline styles
- 2-space indentation, lowercase file names

## CSS

- `normalize.css` — normalization only (not reset.css)
- `main.css` — base styles, layout, components; **CSS variables in `:root`**
- `responsive.css` — **media queries only**
- Consistent spacing and typography via variables
- No inline styles

## JavaScript

- `main.js` — **initialization only** (wire modules on `DOMContentLoaded`)
- `navigation.js` — navigation logic
- `animations.js` — animation logic
- ES modules (`type="module"`), clear function names, no magic numbers (use constants/variables)
- No huge mixed-responsibility files

## General

- Optimize images before upload
- Test responsive behavior (desktop + mobile)
- No console errors
- Readable code for other developers
- **Do not overengineer** — simplest correct solution
- Scalable for future: animations, section rewrites, possible dashboard integration

## Pre-implementation checklist

- [ ] Matches folder structure
- [ ] Semantic HTML + BEM
- [ ] Styles in correct CSS files (`:root` vars in main; MQs in responsive)
- [ ] JS modular; init only in `main.js`
- [ ] No frameworks, tooling, or extra dependencies
- [ ] Responsive and performant
- [ ] Clean, minimal diff scope
