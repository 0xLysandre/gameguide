/* =======================================================================
   GAMEGUIDE — APP LOGIC
   Screen flow, gamification (XP/combo/level/achievements), matching engine.
   ======================================================================= */

(() => {
  "use strict";

  /* ---------- tiny DOM helpers ---------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  /* ---------- state ---------- */
  const state = {
    idx: 0,                 // current question index
    answers: [],            // chosen answer index per question
    vector: zeroVector(),   // accumulated user vibe vector
    xp: 0,
    level: 1,
    combo: 1,
    maxCombo: 1,
    lastAnswerTime: 0,
    started: 0
  };

  function zeroVector() {
    const v = {};
    window.DIMENSIONS.forEach(d => (v[d] = 0));
    return v;
  }

  const XP_PER_LEVEL = 250;

  /* ---------- screens ---------- */
  const screens = {
    start:   $("#screen-start"),
    quiz:    $("#screen-quiz"),
    loading: $("#screen-loading"),
    results: $("#screen-results")
  };

  function show(name) {
    Object.entries(screens).forEach(([k, node]) => {
      const active = k === name;
      node.hidden = !active;
      node.classList.toggle("is-active", active);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ===================================================================
     START SCREEN
     =================================================================== */
  function initStart() {
    $("#game-count").textContent = window.GAMES.length;

    // build the scrolling marquee from game emojis + names
    const track = $("#marquee-track");
    const items = window.GAMES.map(g => `<span class="marquee-item">${g.emoji} ${g.name}</span>`).join("");
    track.innerHTML = items + items; // duplicate for seamless loop

    const startBtn = $("#btn-start");
    startBtn.addEventListener("click", () => {
      Sound.unlock();
      Sound.start();
      beginQuiz();
    });

    attachHoverSfx();
  }

  function attachHoverSfx() {
    $$(".btn").forEach(b => {
      if (b.dataset.sfx) return;
      b.dataset.sfx = "1";
      b.addEventListener("mouseenter", () => Sound.hover());
    });
  }

  /* ===================================================================
     QUIZ FLOW
     =================================================================== */
  function beginQuiz() {
    state.idx = 0;
    state.answers = [];
    state.vector = zeroVector();
    state.xp = 0;
    state.level = 1;
    state.combo = 1;
    state.maxCombo = 1;
    state.started = Date.now();
    $("#hud").hidden = false;
    updateHud(true);
    show("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    const total = window.QUESTIONS.length;
    const q = window.QUESTIONS[state.idx];

    // progress
    const pct = (state.idx / total) * 100;
    $("#progress-fill").style.width = pct + "%";
    $("#progress-label").textContent =
      String(state.idx + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");

    // question content
    $("#q-tag").textContent = q.tag;
    $("#question-text").textContent = q.q;

    // re-trigger entrance animation
    const card = $("#question-card");
    card.classList.remove("pop");
    void card.offsetWidth; // reflow
    card.classList.add("pop");

    // answers
    const wrap = $("#answers");
    wrap.innerHTML = "";
    q.a.forEach((ans, i) => {
      const btn = el("button", "answer");
      btn.style.setProperty("--i", i);
      btn.innerHTML =
        `<span class="answer-emoji">${ans.emoji}</span>
         <span class="answer-label">${ans.label}</span>
         <span class="answer-key">${i + 1}</span>`;
      btn.addEventListener("mouseenter", () => Sound.hover());
      btn.addEventListener("click", () => choose(i, btn));
      wrap.appendChild(btn);
    });

    // back button availability
    $("#btn-back").style.visibility = state.idx === 0 ? "hidden" : "visible";
  }

  function choose(answerIdx, btnEl) {
    const q = window.QUESTIONS[state.idx];
    const ans = q.a[answerIdx];

    // visual lock
    $$(".answer").forEach(b => (b.disabled = true));
    btnEl.classList.add("chosen");
    Sound.select();

    // if re-answering (came back), strip previous weights first
    const prev = state.answers[state.idx];
    if (prev != null) {
      applyWeights(q.a[prev].w, -1);
    }
    applyWeights(ans.w, +1);
    state.answers[state.idx] = answerIdx;

    // combo logic: fast answers (< 6s) build combo
    const now = Date.now();
    const quick = state.lastAnswerTime && (now - state.lastAnswerTime) < 6000;
    if (quick) {
      state.combo = clamp(state.combo + 1, 1, 9);
      state.maxCombo = Math.max(state.maxCombo, state.combo);
      Sound.combo();
      flashCombo();
    } else {
      state.combo = 1;
    }
    state.lastAnswerTime = now;

    // award XP
    const base = 30;
    const gain = base * state.combo;
    awardXp(gain, btnEl);

    // advance after a beat
    setTimeout(() => {
      state.idx++;
      if (state.idx >= window.QUESTIONS.length) {
        runCalculation();
      } else {
        renderQuestion();
      }
    }, 480);
  }

  function applyWeights(w, sign) {
    Object.entries(w).forEach(([dim, val]) => {
      state.vector[dim] = (state.vector[dim] || 0) + val * sign;
    });
  }

  function goBack() {
    if (state.idx === 0) return;
    Sound.back();
    state.idx--;
    renderQuestion();
    // restore previously chosen highlight
    const prev = state.answers[state.idx];
    if (prev != null) {
      const btns = $$(".answer");
      if (btns[prev]) btns[prev].classList.add("chosen");
    }
  }

  /* ---------- gamification HUD ---------- */
  function awardXp(amount, anchorEl) {
    state.xp += amount;
    // level up?
    const newLevel = Math.floor(state.xp / XP_PER_LEVEL) + 1;
    const leveled = newLevel > state.level;
    state.level = newLevel;

    Sound.xp();
    floatXp("+" + amount + " XP", anchorEl);
    updateHud();

    if (leveled) {
      Sound.levelup();
      flashLevelUp();
    }
  }

  function updateHud(instant) {
    $("#hud-level").textContent = state.level;
    $("#hud-xp").textContent = state.xp;
    $("#hud-combo").textContent = "x" + state.combo;
    const into = state.xp % XP_PER_LEVEL;
    const pct = (into / XP_PER_LEVEL) * 100;
    const fill = $("#xp-fill");
    if (instant) fill.style.transition = "none";
    fill.style.width = pct + "%";
    if (instant) requestAnimationFrame(() => (fill.style.transition = ""));
  }

  function floatXp(text, anchorEl) {
    const f = $("#xp-floaty");
    f.textContent = text;
    f.classList.remove("go");
    void f.offsetWidth;
    f.classList.add("go");
  }

  function flashCombo() {
    const c = $("#hud-combo");
    c.classList.remove("bump");
    void c.offsetWidth;
    c.classList.add("bump");
  }

  function flashLevelUp() {
    const toast = el("div", "levelup-toast", `★ LEVEL ${state.level}!`);
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 1200);
  }

  /* ===================================================================
     CALCULATING SCREEN
     =================================================================== */
  const CALC_LINES = [
    "booting matchmaker.exe",
    "reading your vibe vector",
    "weighting chaos coefficients",
    "cross-referencing 57 worlds",
    "rejecting bad recommendations",
    "consulting the neon oracle",
    "compiling your destiny"
  ];

  function runCalculation() {
    show("loading");
    const fill = $("#loader-fill");
    const log = $("#calc-log");
    fill.style.width = "0%";

    let p = 0;
    let line = 0;
    const tick = setInterval(() => {
      p = clamp(p + Math.random() * 16 + 6, 0, 100);
      fill.style.width = p + "%";
      Sound.calc();
      const targetLine = Math.min(CALC_LINES.length - 1, Math.floor((p / 100) * CALC_LINES.length));
      if (targetLine !== line) {
        line = targetLine;
        log.textContent = CALC_LINES[line];
      }
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(showResults, 450);
      }
    }, 230);
  }

  /* ===================================================================
     MATCHING ENGINE
     Cosine-like similarity between user vector & each game vector.
     =================================================================== */
  function scoreGames() {
    const u = state.vector;
    const dims = window.DIMENSIONS;

    // user magnitude (ignore negatives for magnitude so penalties don't inflate)
    let uMag = 0;
    dims.forEach(d => { const x = Math.max(0, u[d]); uMag += x * x; });
    uMag = Math.sqrt(uMag) || 1;

    return window.GAMES.map(g => {
      let dot = 0, gMag = 0;
      dims.forEach(d => {
        const uv = u[d];
        const gv = g.tags[d];
        dot += uv * gv;
        gMag += gv * gv;
      });
      gMag = Math.sqrt(gMag) || 1;
      const sim = dot / (uMag * gMag); // can dip below 0 via penalties
      return { game: g, score: sim };
    }).sort((a, b) => b.score - a.score);
  }

  // map raw cosine score to a friendly "match %" (85-99 for top picks)
  function toPercent(rank, score, best) {
    const norm = best > 0 ? clamp(score / best, 0, 1) : 0;
    const pct = Math.round(72 + norm * 27); // 72..99
    return clamp(pct - rank, 50, 99);
  }

  /* ---------- derive a player "profile" from the vector ---------- */
  function buildProfile() {
    const u = state.vector;
    const dims = window.DIMENSIONS.slice().sort((a, b) => u[b] - u[a]);
    const top = dims.slice(0, 3).filter(d => u[d] > 0);

    const TITLES = {
      action: "The Adrenaline Junkie", story: "The Story Seeker",
      explore: "The Wanderer", strategy: "The Mastermind",
      puzzle: "The Puzzle Cracker", social: "The Party Starter",
      compete: "The Apex Competitor", chill: "The Cozy Connoisseur",
      challenge: "The Masochist (affectionate)", fantasy: "The Fantasy Dreamer",
      scifi: "The Spacefarer", horror: "The Thrill-Chaser",
      retro: "The Pixel Purist", creative: "The World-Builder",
      short: "The Quick-Hit Gamer"
    };
    const LABELS = {
      action:"Action", story:"Story", explore:"Exploration", strategy:"Strategy",
      puzzle:"Puzzles", social:"Multiplayer", compete:"Competition", chill:"Cozy",
      challenge:"Difficulty", fantasy:"Fantasy", scifi:"Sci-Fi", horror:"Horror",
      retro:"Retro", creative:"Creativity", short:"Quick Play"
    };

    const title = top.length ? TITLES[top[0]] : "The Open-Minded Player";
    const traits = top.map(d => LABELS[d]);
    return { title, traits, top, LABELS };
  }

  /* ===================================================================
     RESULTS SCREEN
     =================================================================== */
  function showResults() {
    const ranked = scoreGames();
    const best = ranked[0].score;
    const profile = buildProfile();

    show("results");
    Sound.reveal();

    // hero (top match)
    const hero = ranked[0];
    const heroPct = toPercent(0, hero.score, best);
    const h = $("#hero-match");
    h.innerHTML = `
      <div class="hero-badge">★ ${heroPct}% MATCH</div>
      <div class="hero-emoji">${hero.game.emoji}</div>
      <div class="hero-body">
        <h3 class="hero-name">${hero.game.name}</h3>
        <p class="hero-meta">${hero.game.year} · ${hero.game.platform}</p>
        <p class="hero-blurb">${hero.game.blurb}</p>
        <div class="hero-tags">${topTagChips(hero.game)}</div>
      </div>`;

    // runner-ups grid (next 6)
    const grid = $("#match-grid");
    grid.innerHTML = "";
    ranked.slice(1, 7).forEach((r, i) => {
      const pct = toPercent(i + 1, r.score, best);
      const card = el("article", "match-card");
      card.style.setProperty("--i", i);
      card.innerHTML = `
        <div class="match-pct">${pct}%</div>
        <div class="match-emoji">${r.game.emoji}</div>
        <h4 class="match-name">${r.game.name}</h4>
        <p class="match-blurb">${r.game.blurb}</p>
        <p class="match-meta">${r.game.year} · ${r.game.platform}</p>`;
      grid.appendChild(card);
    });

    // profile card
    const pc = $("#profile-card");
    pc.innerHTML = `
      <span class="profile-kicker">PLAYER PROFILE</span>
      <h3 class="profile-title">${profile.title}</h3>
      <div class="profile-traits">
        ${profile.traits.map(t => `<span class="trait-chip">${t}</span>`).join("") || '<span class="trait-chip">Eclectic</span>'}
      </div>
      ${dimBars(profile)}`;

    // achievements
    renderAchievements();

    // store last result for sharing
    state.lastResult = { hero, ranked, profile, heroPct };

    attachHoverSfx();
  }

  function topTagChips(game) {
    const LABELS = {
      action:"Action", story:"Story", explore:"Exploration", strategy:"Strategy",
      puzzle:"Puzzles", social:"Multiplayer", compete:"Competition", chill:"Cozy",
      challenge:"Hardcore", fantasy:"Fantasy", scifi:"Sci-Fi", horror:"Horror",
      retro:"Retro", creative:"Creative", short:"Quick"
    };
    return window.DIMENSIONS
      .slice()
      .sort((a, b) => game.tags[b] - game.tags[a])
      .slice(0, 4)
      .filter(d => game.tags[d] >= 3)
      .map(d => `<span class="hero-tag">#${LABELS[d]}</span>`)
      .join("");
  }

  function dimBars(profile) {
    const u = state.vector;
    const maxVal = Math.max(1, ...window.DIMENSIONS.map(d => u[d]));
    const rows = profile.top.slice(0, 4).map(d => {
      const pct = clamp((u[d] / maxVal) * 100, 6, 100);
      return `
        <div class="dim-row">
          <span class="dim-name">${profile.LABELS[d]}</span>
          <div class="dim-track"><div class="dim-fill" style="width:${pct}%"></div></div>
        </div>`;
    }).join("");
    return `<div class="dim-bars">${rows}</div>`;
  }

  /* ---------- achievements (based on how they played) ---------- */
  function renderAchievements() {
    const list = $("#ach-list");
    list.innerHTML = "";
    const earned = [];
    const elapsed = (Date.now() - state.started) / 1000;

    earned.push({ icon: "🎮", name: "Quiz Complete", desc: "Finished all 10 questions." });
    if (state.maxCombo >= 5) earned.push({ icon: "🔥", name: "On Fire", desc: `Hit a x${state.maxCombo} combo.` });
    if (state.level >= 4) earned.push({ icon: "⭐", name: "Level " + state.level, desc: "Racked up serious XP." });
    if (elapsed < 35) earned.push({ icon: "⚡", name: "Speed Demon", desc: "Blazed through the quiz." });
    if (elapsed > 90) earned.push({ icon: "🧘", name: "Deep Thinker", desc: "Took your sweet time." });
    if (state.xp >= 800) earned.push({ icon: "💎", name: "XP Tycoon", desc: "Banked 800+ XP." });

    earned.forEach((a, i) => {
      const node = el("div", "ach");
      node.style.setProperty("--i", i);
      node.innerHTML = `<span class="ach-icon">${a.icon}</span>
        <span class="ach-text"><strong>${a.name}</strong><em>${a.desc}</em></span>`;
      list.appendChild(node);
      setTimeout(() => { node.classList.add("show"); Sound.achieve(); }, 300 + i * 220);
    });
  }

  /* ---------- share / copy ---------- */
  function shareResult() {
    const r = state.lastResult;
    if (!r) return;
    const text =
`🎮 GAMEGUIDE says my next game is:
★ ${r.hero.game.name} — ${r.heroPct}% match
Profile: ${r.profile.title}
Runner-ups: ${r.ranked.slice(1,4).map(x => x.game.name).join(", ")}
Find yours → GAMEGUIDE`;

    const done = () => {
      Sound.achieve();
      const btn = $("#btn-share");
      const old = btn.textContent;
      btn.textContent = "✓ COPIED!";
      setTimeout(() => (btn.textContent = old), 1600);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
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
      done();
    }
  }

  /* ===================================================================
     WIRING
     =================================================================== */
  function init() {
    initStart();

    $("#btn-back").addEventListener("click", goBack);
    $("#btn-replay").addEventListener("click", () => { Sound.start(); beginQuiz(); });
    $("#btn-share").addEventListener("click", shareResult);

    // sound toggle
    const st = $("#sound-toggle");
    st.addEventListener("click", () => {
      const on = Sound.toggle();
      st.textContent = on ? "♪ ON" : "♪ OFF";
      st.classList.toggle("off", !on);
      if (on) Sound.select();
    });

    // keyboard: 1-4 to answer, Backspace to go back, Enter to start
    document.addEventListener("keydown", (e) => {
      if (!screens.quiz.classList.contains("is-active")) {
        if (e.key === "Enter" && screens.start.classList.contains("is-active")) {
          $("#btn-start").click();
        }
        return;
      }
      if (e.key >= "1" && e.key <= "4") {
        const btns = $$(".answer");
        const i = parseInt(e.key, 10) - 1;
        if (btns[i] && !btns[i].disabled) btns[i].click();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        goBack();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
