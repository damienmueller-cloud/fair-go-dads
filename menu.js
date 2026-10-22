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
    btn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { btn.click(); btn.focus(); }
  });
})();
