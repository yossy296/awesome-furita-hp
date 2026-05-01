/**
 * Full-screen loading overlay shown until window.load fires (all images,
 * scripts, fonts, stylesheets fetched). Renders inline CSS + script so it's
 * present in the very first HTML byte — no flash of unstyled content.
 *
 * The script:
 *   1) Locks scroll while the overlay is visible
 *   2) Hides the overlay with a fade on `window.load`
 *   3) Forces the overlay to hide after 15s as a safety net
 */
const css = `
  html.furi-loading, html.furi-loading body {
    overflow: hidden !important;
  }
  /* If we've already loaded once this session, never paint the loader. */
  html.furi-skip-loader #furi-loader { display: none !important; }
  #furi-loader {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    background: #0E1014;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans",
                 "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
    font-size: 18px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 500;
    transition: opacity 480ms ease, visibility 480ms;
    visibility: visible;
    opacity: 1;
    pointer-events: all;
  }
  #furi-loader.is-hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
  #furi-loader .furi-loader__inner {
    display: inline-flex;
    align-items: baseline;
    white-space: nowrap;
  }
  #furi-loader .furi-loader__dot {
    display: inline-block;
    width: 0.4em;
    text-align: center;
    opacity: 0;
    animation: furiLoaderPulse 1.4s ease-in-out infinite;
  }
  #furi-loader .furi-loader__dot:nth-child(1) { animation-delay: 0s; }
  #furi-loader .furi-loader__dot:nth-child(2) { animation-delay: 0.2s; }
  #furi-loader .furi-loader__dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes furiLoaderPulse {
    0%, 80%, 100% { opacity: 0; }
    40% { opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    #furi-loader .furi-loader__dot { animation-duration: 2.4s; }
  }
`;

// Runs BEFORE the loader div is parsed. If we've already shown the loader
// once this session, set a class so CSS hides it instantly (zero paint).
const earlyScript = `
  try {
    if (sessionStorage.getItem('furi:loaded') === '1') {
      document.documentElement.classList.add('furi-skip-loader');
    } else {
      document.documentElement.classList.add('furi-loading');
    }
  } catch (e) {
    document.documentElement.classList.add('furi-loading');
  }
`;

// Runs AFTER the loader div, sets up the hide-on-load behavior. No-op when
// the early script flagged this as a repeat visit.
const lateScript = `
  (function () {
    var html = document.documentElement;
    if (html.classList.contains('furi-skip-loader')) return;

    function hide() {
      var el = document.getElementById('furi-loader');
      if (el && !el.classList.contains('is-hidden')) {
        el.classList.add('is-hidden');
        setTimeout(function () {
          if (el && el.parentNode) el.parentNode.removeChild(el);
        }, 600);
      }
      html.classList.remove('furi-loading');
      try { sessionStorage.setItem('furi:loaded', '1'); } catch (e) {}
    }

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });
    }
    // Safety net so a stuck asset can't trap the user forever.
    setTimeout(hide, 15000);
  })();
`;

export default function InitialLoader() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {/* IMPORTANT: this script must run before the div below is parsed so the
          skip-class can hide it before any paint. */}
      <script dangerouslySetInnerHTML={{ __html: earlyScript }} />
      <div
        id="furi-loader"
        aria-busy="true"
        aria-live="polite"
        role="status"
        suppressHydrationWarning
      >
        <div className="furi-loader__inner">
          <span>Loading</span>
          <span className="furi-loader__dot">.</span>
          <span className="furi-loader__dot">.</span>
          <span className="furi-loader__dot">.</span>
        </div>
      </div>
      <noscript>
        <style>{"#furi-loader{display:none}"}</style>
      </noscript>
      <script dangerouslySetInnerHTML={{ __html: lateScript }} />
    </>
  );
}
