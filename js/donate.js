/* =======================================================================
   GAMEGUIDE — DONATIONS
   Discrete, non-invasive crypto tip jar. Opens from a tiny footer link.
   ======================================================================= */

(() => {
  "use strict";

  const COINS = [
    { sym: "BTC", name: "Bitcoin",  emoji: "₿", addr: "bc1qyfv9lk30muwuescxnu3d4jw5nqxvgtkkv0fxmt" },
    { sym: "ETH", name: "Ethereum", emoji: "Ξ", addr: "0xFd22A27E7B290839bFcf9D6dF7706a3ac68B927e" },
    { sym: "XMR", name: "Monero",   emoji: "ɱ", addr: "83SowFb91vY26vsefLgXE9T8ZUBWCmWenCzbCtkszEnzSkAnM5RJPdVWoxYVtgBPfz71tBHwBEc8d3GJniuvXbbUKoW42XM" }
  ];

  const $ = (s) => document.querySelector(s);

  function copyText(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone).catch(fallback);
    } else {
      fallback();
    }
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      ta.remove();
      onDone();
    }
  }

  function buildCoins() {
    const wrap = $("#donate-coins");
    if (!wrap) return;
    wrap.innerHTML = "";
    COINS.forEach((c) => {
      const row = document.createElement("button");
      row.className = "coin-row";
      row.type = "button";
      row.setAttribute("aria-label", "Copy " + c.name + " address");
      row.innerHTML =
        `<span class="coin-sym">${c.emoji}</span>
         <span class="coin-info">
           <span class="coin-name">${c.name} <em>${c.sym}</em></span>
         </span>
         <span class="coin-copy">COPY</span>`;
      row.addEventListener("click", () => {
        copyText(c.addr, () => {
          if (window.Sound) Sound.achieve();
          const tag = row.querySelector(".coin-copy");
          tag.textContent = "✓ COPIED";
          row.classList.add("copied");
          setTimeout(() => { tag.textContent = "COPY"; row.classList.remove("copied"); }, 1600);
        });
      });
      wrap.appendChild(row);
    });
  }

  function open() {
    const ov = $("#donate-overlay");
    if (!ov) return;
    ov.hidden = false;
    requestAnimationFrame(() => ov.classList.add("show"));
    if (window.Sound) { Sound.unlock(); Sound.select(); }
  }
  function close() {
    const ov = $("#donate-overlay");
    if (!ov) return;
    ov.classList.remove("show");
    setTimeout(() => { ov.hidden = true; }, 250);
    if (window.Sound) Sound.back();
  }

  function init() {
    buildCoins();
    const openBtn = $("#donate-open");
    const closeBtn = $("#donate-close");
    const overlay = $("#donate-overlay");
    if (openBtn) openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (overlay) overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay && !overlay.hidden) close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
