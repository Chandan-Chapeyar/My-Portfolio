// Desktop / laptop: load the 3D Spline robot (after the page is usable).
// Phones & tablets (small or touch-only screens): no 3D at all, plain dark background.
(function () {
  var isPhoneOrTablet = window.matchMedia(
    "(max-width: 900px), (hover: none) and (pointer: coarse)"
  ).matches;

  if (isPhoneOrTablet) {
    document.body.classList.add("no-3d");
    var viewer = document.querySelector("spline-viewer");
    if (viewer) viewer.remove(); // the scene is never downloaded
    return;
  }

  function loadViewer() {
    var s = document.createElement("script");
    s.type = "module";
    s.src = "https://cdn.spline.design/@splinetool/viewer@2.0.75/build/spline-viewer.js";
    document.head.appendChild(s);
  }

  function whenIdle() {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadViewer, { timeout: 2500 });
    } else {
      setTimeout(loadViewer, 800);
    }
  }

  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle);
})();