// Loads the heavy 3D Spline viewer AFTER the page is usable, and skips it on
// weak phones / data-saver mode (a lightweight gradient is shown instead).
(function () {
  var nav = navigator;
  var smallScreen = window.matchMedia("(max-width: 700px)").matches;
  var saveData = nav.connection && nav.connection.saveData;
  var lowMemory = nav.deviceMemory && nav.deviceMemory <= 4;
  var fewCores = nav.hardwareConcurrency && nav.hardwareConcurrency <= 4;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var skip3D = saveData || reducedMotion || (smallScreen && (lowMemory || fewCores));

  if (skip3D) {
    document.body.classList.add("no-3d");
    var viewer = document.querySelector("spline-viewer");
    if (viewer) viewer.remove();
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
