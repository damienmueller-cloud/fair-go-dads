/* Fair Go Dads helpline switch.
 * ONE flag controls the phone number badge AND the "Talk to us online" widget.
 *   LIVE = false  -> number shows an "Opening soon" badge; the online button says
 *                    "Opening soon", is disabled and loads nothing from ElevenLabs.
 *   LIVE = true   -> badge removed, "opening soon" wording swapped for live wording,
 *                    the online button turns on and (on tap) loads the ElevenLabs widget:
 *                      <elevenlabs-convai agent-id="AGENT_ID"></elevenlabs-convai>
 *                      <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
 * NOTE 2026-10-22: CHAT_ENABLED = false overrides the above; with LIVE = true only the phone wording goes live.
 * Only flip LIVE after the go-live test bank passes and Damien approves (PLAN.md, Helpline number).
 */
var FGD_HELPLINE = {
  LIVE: true,
  // Online chat is switched OFF (2026-10-22): no agent is configured, so nothing can load the TEST
  // agent. "Talk to us online" stays disabled with "Opening soon" even when LIVE = true.
  // Re-enabling chat is a separate, reviewed change (set CHAT_ENABLED and a PROD agent id together).
  CHAT_ENABLED: false,
  AGENT_ID: "",
  WIDGET_SRC: "https://unpkg.com/@elevenlabs/convai-widget-embed"
};

(function () {
  var cfg = FGD_HELPLINE;
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  function chatOn() { return cfg.CHAT_ENABLED === true && /^agent_/.test(cfg.AGENT_ID || ""); }

  function loadWidget() {
    if (!chatOn() || document.querySelector("elevenlabs-convai")) return;
    var w = document.createElement("elevenlabs-convai");
    w.setAttribute("agent-id", cfg.AGENT_ID);
    document.body.appendChild(w);
    var s = document.createElement("script");
    s.src = cfg.WIDGET_SRC; s.async = true; s.type = "text/javascript";
    document.body.appendChild(s);
  }

  function init() {
    if (chatOn()) document.documentElement.classList.add("chat-on");
    if (cfg.LIVE !== true) return; // default HTML is the safe "opening soon" state
    document.documentElement.classList.add("helpline-live");
    each("[data-helpline-badge]", function (el) {
      if (!chatOn() && el.closest("[data-helpline-online]")) return; // chat off: keep its "Opening soon"
      el.parentNode.removeChild(el);
    });
    each("[data-live-text]", function (el) { el.textContent = el.getAttribute("data-live-text"); });
    each("[data-live-content]", function (el) { el.setAttribute("content", el.getAttribute("data-live-content")); });
    if (!chatOn()) return; // chat off: button stays disabled, nothing loaded from ElevenLabs
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
