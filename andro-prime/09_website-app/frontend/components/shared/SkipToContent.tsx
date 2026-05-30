/**
 * Accessibility skip link. Visually hidden until keyboard-focused, then it
 * appears top-left so keyboard / screen-reader users can jump past the Nav
 * straight to the page's <main id="main-content">. Must be the first focusable
 * element in the DOM, so it's rendered at the top of the root <body>, before
 * the route-group layouts (and their Nav) mount.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-black focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-black focus:uppercase focus:tracking-widest focus:text-white focus:no-underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-black"
    >
      Skip to content
    </a>
  )
}
