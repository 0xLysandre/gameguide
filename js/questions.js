/* =======================================================================
   GAMEGUIDE — QUIZ QUESTIONS
   Each answer carries weights across the same DIMENSIONS used by games.
   Weights can be negative to push AWAY from a vibe.
   ======================================================================= */

const QUESTIONS = [
  {
    tag: "VIBE CHECK",
    q: "It's finally game night. What are you actually in the mood for?",
    a: [
      { label: "Adrenaline. Make my palms sweat.", emoji: "⚡", w: { action:3, compete:2, challenge:1 } },
      { label: "A story that wrecks me emotionally.", emoji: "🎭", w: { story:3, explore:1 } },
      { label: "Quiet me-time. No pressure.", emoji: "🍵", w: { chill:3, creative:1 } },
      { label: "Big brain puzzles & systems.", emoji: "🧠", w: { puzzle:3, strategy:2 } }
    ]
  },
  {
    tag: "SOCIAL BATTERY",
    q: "Who's joining you on the couch / call?",
    a: [
      { label: "Just me, myself, and my headphones.", emoji: "🎧", w: { story:2, chill:1, explore:1, social:-2 } },
      { label: "One ride-or-die co-op partner.", emoji: "🤝", w: { social:3, puzzle:1 } },
      { label: "A whole rowdy squad.", emoji: "🎉", w: { social:3, compete:2, short:1 } },
      { label: "Strangers I will crush online.", emoji: "🌐", w: { compete:3, social:1, action:1 } }
    ]
  },
  {
    tag: "TIME BUDGET",
    q: "How much of your life are you willing to sacrifice?",
    a: [
      { label: "15 min bursts between life things.", emoji: "⏱️", w: { short:3, retro:1 } },
      { label: "A solid evening session.", emoji: "🌙", w: { action:1, story:1 } },
      { label: "All weekend. Cancel my plans.", emoji: "📆", w: { explore:2, story:2, strategy:1 } },
      { label: "This is my new personality. 1000 hrs.", emoji: "♾️", w: { explore:2, creative:2, strategy:2, social:1 } }
    ]
  },
  {
    tag: "DIFFICULTY DIAL",
    q: "How do you feel about a game that fights back?",
    a: [
      { label: "Break me. I want to earn it.", emoji: "💀", w: { challenge:3, action:2 } },
      { label: "Fair but firm is perfect.", emoji: "⚖️", w: { challenge:1, action:1, strategy:1 } },
      { label: "Let me relax, I'm fragile.", emoji: "🫧", w: { chill:3, creative:1, challenge:-2 } },
      { label: "I want to FEEL smart, not punished.", emoji: "🎓", w: { puzzle:2, story:1, strategy:1 } }
    ]
  },
  {
    tag: "WORLD TYPE",
    q: "Pick the world you want to fall into.",
    a: [
      { label: "Dragons, magic, ancient ruins.", emoji: "🐉", w: { fantasy:3, explore:1 } },
      { label: "Neon cities, space, cold tech.", emoji: "🛸", w: { scifi:3, action:1 } },
      { label: "Dread, shadows, things that hunt me.", emoji: "🕯️", w: { horror:3, story:1 } },
      { label: "Cozy towns & soft pastel everything.", emoji: "🏡", w: { chill:3, creative:2, social:1 } }
    ]
  },
  {
    tag: "FREEDOM",
    q: "Open world or tight, crafted experience?",
    a: [
      { label: "Drop me anywhere. I'll wander for hours.", emoji: "🧭", w: { explore:3, chill:1 } },
      { label: "Guide me through a great ride.", emoji: "🎢", w: { story:2, action:1 } },
      { label: "Give me a sandbox & raw materials.", emoji: "🧱", w: { creative:3, strategy:1 } },
      { label: "A tight loop I can master & repeat.", emoji: "🔁", w: { compete:2, short:2, challenge:1 } }
    ]
  },
  {
    tag: "THE HANDS",
    q: "What should your hands be doing?",
    a: [
      { label: "Twitchy reflexes & fast inputs.", emoji: "🎮", w: { action:3, compete:1 } },
      { label: "Slow, deliberate planning.", emoji: "♟️", w: { strategy:3, puzzle:1 } },
      { label: "Building, decorating, tinkering.", emoji: "🔧", w: { creative:3, chill:1 } },
      { label: "Reading, choosing, talking.", emoji: "💬", w: { story:3, strategy:1 } }
    ]
  },
  {
    tag: "AESTHETIC",
    q: "Which look makes you go 'oh that's the one'?",
    a: [
      { label: "Crunchy pixels & arcade nostalgia.", emoji: "👾", w: { retro:3, short:1 } },
      { label: "Photoreal, cinematic, jaw-drop.", emoji: "🎬", w: { story:2, explore:1, action:1 } },
      { label: "Bold, stylized, art-you'd-frame.", emoji: "🎨", w: { story:1, creative:2, fantasy:1 } },
      { label: "Honestly? I don't care, just fun.", emoji: "🤷", w: { social:1, compete:1, short:1 } }
    ]
  },
  {
    tag: "FEAR FACTOR",
    q: "A scary game is on the table. Your move?",
    a: [
      { label: "YES. Let it terrify me.", emoji: "😱", w: { horror:3, challenge:1 } },
      { label: "A little tension is spicy.", emoji: "🌶️", w: { horror:1, action:1, story:1 } },
      { label: "Hard pass. No nightmares.", emoji: "🙅", w: { chill:2, horror:-3, creative:1 } },
      { label: "Only if my friends suffer too.", emoji: "👹", w: { horror:2, social:3 } }
    ]
  },
  {
    tag: "WIN CONDITION",
    q: "What does a perfect gaming moment feel like?",
    a: [
      { label: "Clutching a win against real people.", emoji: "🏆", w: { compete:3, action:1, social:1 } },
      { label: "A story beat that gives me chills.", emoji: "🥹", w: { story:3 } },
      { label: "Finally solving the thing.", emoji: "💡", w: { puzzle:3, strategy:1 } },
      { label: "Watching my creation come together.", emoji: "✨", w: { creative:3, explore:1 } }
    ]
  }
];

window.QUESTIONS = QUESTIONS;
