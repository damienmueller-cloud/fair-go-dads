/* Fair Go Dads helpline switch.
 * ONE flag controls the phone number badge AND the "Talk to us online" widget.
 *   LIVE = false  -> number shows an "Opening soon" badge; the online button says
 *                    "Opening soon", is disabled and loads nothing from ElevenLabs.
 *   LIVE = true   -> badge removed, "opening soon" wording swapped for live wording,
 *                    the online button turns on and (on tap) loads the ElevenLabs widget:
 *                      <elevenlabs-convai agent-id="AGENT_ID"></elevenlabs-convai>
 *                      <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
 * Only flip LIVE after the go-live test bank passes and Damien approves (PLAN.md, Helpline number).
 */
var FGD_HELPLINE = {
  LIVE: false,
  AGENT_ID: "agent_9901m59r2z6hf519thq7s3p317jz", // ElevenLabs: Fair Go Dads Helpline (TEST)
  WIDGET_SRC: "https://unpkg.com/@elevenlabs/convai-widget-embed"
};

(function () {
  var cfg = FGD_HELPLINE;
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  function loadWidget() {
    if (document.querySelector("elevenlabs-convai")) return;
    var w = document.createElement("elevenlabs-convai");
    w.setAttribute("agent-id", cfg.AGENT_ID);
    document.body.appendChild(w);
    var s = document.createElement("script");
    s.src = cfg.WIDGET_SRC; s.async = true; s.type = "text/javascript";
    document.body.appendChild(s);
  }

  function init() {
    if (cfg.LIVE !== true) return; // default HTML is the safe "opening soon" state
    document.documentElement.classList.add("helpline-live");
    each("[data-helpline-badge]", function (el) { el.parentNode.removeChild(el); });
    each("[data-live-text]", function (el) { el.textContent = el.getAttribute("data-live-text"); });
    each("[data-helpline-online]", function (btn) {
      btn.disabled = false;
      btn.removeAttribute("aria-disabled");
      btn.textContent = btn.getAttribute("data-live-label") || "Talk to us online";
      btn.addEventListener("click", function () {
        loadWidget();
        btn.textContent = btn.getAttribute("data-opening-label") || "Opening the chat…";
        setTimeout(function () { btn.textContent = btn.getAttribute("data-live-label") || "Talk to us online"; }, 4000);
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
