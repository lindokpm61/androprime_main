/**
 * Accessibility skip link. Visually hidden until keyboard-focused, then it
 * appears top-left so keyboard / screen-reader users can jump past the Nav
 * straight to the page's <main id="main-content">. Must be the first focusable
 * element in the DOM, so it's rendered at the top of the root <body>, before
 * the route-group layouts (and their Nav) mount.
 *
 * Rebuilt in Direction F on 2026-09-14 (defect register C1). It was the last
 * piece of site-wide chrome in the retired vocabulary. The appearance, the
 * hiding technique and the reason this element cannot use the shared `.f-page`
 * focus block are all recorded on `.f-skip` in f-primitives.css.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="f-skip"
    >
      Skip to content
    </a>
  )
}
