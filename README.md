# 🎮 GAMEGUIDE

> A gamified, retro-neon quiz that finds your next favorite video game.

GameGuide asks you 10 loud, fast questions, builds a "vibe vector" from your
answers, and matches it against a database of **50+ games** to recommend your
next obsession — complete with a top match, runner-ups, a player profile, and
unlockable achievements.

## ✨ Features

- **Smart matching engine** — your answers build a 15-dimension preference
  vector (action, story, chill, horror, strategy, …) matched against every game
  via cosine-style similarity.
- **Full gamification** — XP, level-ups, combo multipliers for fast answers,
  achievements, and a live HUD.
- **Chiptune sound** — a tiny Web Audio synth (no audio files) for bleeps,
  combos, and victory fanfares. Toggleable.
- **Player profile** — get a title ("The Cozy Connoisseur", "The Apex
  Competitor", …) and a breakdown of your taste.
- **Retro / acid / brutalist styling** — purple neon, CRT scanlines, animated
  synthwave grid, glitch text, chunky offset shadows.
- **Keyboard friendly** — press `1`–`4` to answer, `Backspace` to go back,
  `Enter` to start.
- **Zero dependencies, zero build step, zero tracking** — everything runs
  locally in the browser.

## 🚀 Run it

It's a static site. Just open `index.html` in a browser:

```bash
# option 1: open the file directly
open index.html        # macOS
xdg-open index.html    # Linux

# option 2: serve it (recommended so fonts/audio behave nicely)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 🗂️ Project structure

```
gameguide/
├── index.html          # markup + screen scaffold
├── css/
│   └── styles.css      # all the neon
└── js/
    ├── games.js        # the game database + vibe dimensions
    ├── questions.js    # quiz questions & answer weights
    ├── sound.js        # Web Audio chiptune engine
    └── app.js          # screen flow, gamification, matching engine
```

## ➕ Adding a game

Add an entry to `GAMES` in `js/games.js`. Use the `t({...})` helper and only
list the dimensions that matter (everything else defaults to 0):

```js
{
  name: "Your Game",
  year: 2024, emoji: "🎲", platform: "Everything",
  blurb: "One punchy sentence that sells it.",
  tags: t({ strategy: 5, puzzle: 4, short: 3 })
}
```

The matcher and marquee pick it up automatically.

## 🎚️ Tuning the quiz

Edit `js/questions.js`. Each answer's `w` object adds weights to dimensions
(negatives push *away* from a vibe). The dimension list lives at the top of
`js/games.js`.

---

Built for fun. No data leaves your machine.
