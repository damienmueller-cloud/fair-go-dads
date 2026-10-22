/* Mobile menu: upgrades the no-JS checkbox toggle to a real button with aria-expanded. */
(function () {
  var btn = document.querySelector(".menu-btn--js"), cb = document.getElementById("menu-toggle"),
      lbl = document.querySelector('label[for="menu-toggle"]'), nav = document.getElementById("main-nav");
  if (!btn || !nav) return;
  document.documentElement.classList.add("menu-js");
  if (cb) cb.hidden = true; if (lbl) lbl.hidden = true;
  btn.hidden = false;
  btn.addEventListener("click", function () {
    var open = btn.getAttribute("aria-expanded") !== "true";
    var lp = document.querySelector(".lang-picker details");
    if (open && lp && lp.open) lp.open = false;
    btn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { btn.click(); btn.focus(); }
  });
})();
/* Language panel: on narrow screens it is position:fixed; place it just under the button. */
(function () {
  var d = document.querySelector(".lang-picker details");
  if (!d) return;
  var s = d.querySelector("summary");
  function place() {
    if (!d.open || !s) return;
    // Sit below the whole header (so the menu button stays tappable); if that leaves too little room
    // above the Call bar (short landscape screens), float the panel near the top instead.
    var hd = d.closest("header"), cb = document.querySelector(".call-bar");
    var top = Math.round((hd ? Math.max(hd.getBoundingClientRect().bottom, s.getBoundingClientRect().bottom) : s.getBoundingClientRect().bottom) + 6);
    var floor = cb && getComputedStyle(cb).display !== "none" ? cb.getBoundingClientRect().top : window.innerHeight;
    if (floor - top - 12 < 180) top = 8;
    document.documentElement.style.setProperty("--lang-top", Math.max(8, top) + "px");
  }
  d.addEventListener("toggle", function () {
    if (d.open) {
      var mb = document.querySelector(".menu-btn--js"), nav = document.getElementById("main-nav");
      if (mb) mb.setAttribute("aria-expanded", "false");
      if (nav) nav.classList.remove("is-open");
      var cb = document.getElementById("menu-toggle"); if (cb) cb.checked = false;
    }
    place();
  });
  window.addEventListener("resize", place);
  window.addEventListener("scroll", place, { passive: true });
  function outside(e) { if (d.open && !d.contains(e.target)) d.open = false; }
  document.addEventListener("click", outside);
  document.addEventListener("pointerdown", outside);
  document.addEventListener("touchstart", outside, { passive: true });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && d.open) { d.open = false; s && s.focus(); } });
})();
