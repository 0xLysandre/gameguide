/* =======================================================================
   GAMEGUIDE — CHIPTUNE SOUND ENGINE
   Tiny Web Audio synth so we ship zero audio files. Bleeps & bloops only.
   ======================================================================= */

const Sound = (() => {
  let ctx = null;
  let enabled = true;

  function ensure() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { enabled = false; }
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  /* a single oscillator blip */
  function blip(freq, dur, type = "square", vol = 0.12) {
    if (!enabled) return;
    const ac = ensure();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    gain.gain.setValueAtTime(0.0001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + dur + 0.02);
  }

  /* a quick arpeggio for celebratory moments */
  function arp(freqs, step = 0.07, type = "square", vol = 0.12) {
    if (!enabled) return;
    freqs.forEach((f, i) => setTimeout(() => blip(f, step * 1.6, type, vol), i * step * 1000));
  }

  const api = {
    unlock() { ensure(); },
    toggle() { enabled = !enabled; if (enabled) ensure(); return enabled; },
    isOn() { return enabled; },

    hover()  { blip(420, 0.04, "square", 0.05); },
    select() { blip(660, 0.08, "square", 0.12); blip(880, 0.06, "square", 0.08); },
    back()   { blip(300, 0.08, "triangle", 0.08); },
    start()  { arp([330, 440, 550, 660, 880], 0.06, "square"); },
    xp()     { blip(990, 0.05, "square", 0.07); },
    combo()  { blip(1180, 0.06, "square", 0.1); },
    levelup(){ arp([523, 659, 784, 1046, 1318], 0.08, "square", 0.14); },
    calc()   { blip(220 + Math.random() * 400, 0.03, "sawtooth", 0.04); },
    reveal() { arp([392, 523, 659, 784, 1046, 1318, 1568], 0.09, "square", 0.13); },
    achieve(){ arp([784, 988, 1318], 0.08, "triangle", 0.12); }
  };

  return api;
})();

window.Sound = Sound;
