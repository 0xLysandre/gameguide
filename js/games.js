/* =======================================================================
   GAMEGUIDE — GAME DATABASE
   Each game is scored 0..5 across a set of "vibe" dimensions.
   The quiz builds a user vector across the same dimensions and we match
   via weighted cosine-ish similarity (see app.js).

   DIMENSIONS:
     action      - twitch combat, reflexes, intensity
     story        - narrative depth, characters, writing
     explore      - open spaces, discovery, freedom
     strategy     - planning, systems, management
     puzzle       - brain teasers, logic
     social       - multiplayer / co-op / party
     compete      - PvP, ranked, mastery vs others
     chill        - cozy, low-stakes, relaxing
     challenge    - punishing difficulty, "git gud"
     fantasy      - magic, dragons, swords, lore
     scifi        - space, tech, cyber, future
     horror       - fear, tension, dread
     retro        - pixel / old-school / arcade feel
     creative     - building, crafting, sandbox, expression
     short        - pick-up-and-play / quick sessions
   ======================================================================= */

const DIMENSIONS = [
  "action","story","explore","strategy","puzzle","social","compete",
  "chill","challenge","fantasy","scifi","horror","retro","creative","short"
];

/* helper to keep data terse: t(...) lets us write only the non-zero dims */
function t(obj) {
  const v = {};
  DIMENSIONS.forEach(d => v[d] = obj[d] || 0);
  return v;
}

const GAMES = [
  {
    name: "The Legend of Zelda: Breath of the Wild",
    year: 2017, emoji: "🗡️", platform: "Switch / Wii U",
    blurb: "Glide off mountains, cook questionable meals, and get distracted by every shrine on the horizon.",
    tags: t({ action:4, explore:5, fantasy:5, story:3, puzzle:3, chill:2, creative:2 })
  },
  {
    name: "Stardew Valley",
    year: 2016, emoji: "🌱", platform: "Everything",
    blurb: "Inherit a farm, befriend a town, lose 200 hours to crop optimization. Pure serotonin.",
    tags: t({ chill:5, creative:4, social:3, explore:2, retro:3, story:3, strategy:2 })
  },
  {
    name: "Hollow Knight",
    year: 2017, emoji: "🐛", platform: "Everything",
    blurb: "A gorgeous, gloomy bug kingdom that will absolutely wreck you with grace.",
    tags: t({ action:4, explore:4, challenge:5, fantasy:3, story:3, retro:2 })
  },
  {
    name: "Dark Souls",
    year: 2011, emoji: "💀", platform: "PC / Console",
    blurb: "You will die. A lot. Then you'll feel like a god for ten seconds. Repeat.",
    tags: t({ action:5, challenge:5, fantasy:4, explore:3, story:2 })
  },
  {
    name: "Elden Ring",
    year: 2022, emoji: "🌳", platform: "PC / Console",
    blurb: "Souls combat let loose in a vast, hostile, jaw-dropping open world. Touch grass (it bites).",
    tags: t({ action:5, challenge:5, explore:5, fantasy:5, story:3 })
  },
  {
    name: "Celeste",
    year: 2018, emoji: "🏔️", platform: "Everything",
    blurb: "A pixel-perfect platformer about climbing a mountain and your own anxiety. Stick with it.",
    tags: t({ action:3, challenge:5, story:4, retro:4, puzzle:2, short:2 })
  },
  {
    name: "Disco Elysium",
    year: 2019, emoji: "🕵️", platform: "PC / Console",
    blurb: "A detective RPG where your worst enemy is your own brain. Read more than you've read in years.",
    tags: t({ story:5, puzzle:3, strategy:2, chill:1 })
  },
  {
    name: "Portal 2",
    year: 2011, emoji: "🌀", platform: "PC / Console",
    blurb: "Think with portals. Laugh at a passive-aggressive AI. Best co-op brain workout around.",
    tags: t({ puzzle:5, story:4, social:3, scifi:4, short:2 })
  },
  {
    name: "Minecraft",
    year: 2011, emoji: "⛏️", platform: "Everything",
    blurb: "Punch tree. Build castle. Accidentally engineer a working computer. Infinite sandbox.",
    tags: t({ creative:5, explore:4, chill:3, social:4, retro:3, strategy:2 })
  },
  {
    name: "Hades",
    year: 2020, emoji: "🔥", platform: "Everything",
    blurb: "Fail upward out of hell with snappy combat, killer art, and a soap-opera of Greek gods.",
    tags: t({ action:5, story:4, challenge:4, fantasy:4, short:3 })
  },
  {
    name: "The Witcher 3: Wild Hunt",
    year: 2015, emoji: "🐺", platform: "Everything",
    blurb: "A monster hunter with great hair and even better side quests. Gwent will consume you.",
    tags: t({ story:5, explore:5, action:4, fantasy:5, strategy:2 })
  },
  {
    name: "Red Dead Redemption 2",
    year: 2018, emoji: "🤠", platform: "PC / Console",
    blurb: "Slow, gorgeous, melancholic cowboy life sim. You'll pet every horse and feel every goodbye.",
    tags: t({ story:5, explore:5, action:4, chill:2 })
  },
  {
    name: "Tetris Effect",
    year: 2018, emoji: "🟪", platform: "Everything",
    blurb: "The block game you know, reborn as a synesthetic light show. Genuinely transcendent.",
    tags: t({ puzzle:5, chill:3, retro:5, short:4, compete:2 })
  },
  {
    name: "Overwatch 2",
    year: 2022, emoji: "🎯", platform: "Everything",
    blurb: "Hero shooter chaos. Find your main, blame your team, queue again immediately.",
    tags: t({ action:5, compete:5, social:4, scifi:3, short:3 })
  },
  {
    name: "League of Legends",
    year: 2009, emoji: "⚔️", platform: "PC",
    blurb: "The MOBA that ate a decade. Deep, brutal, endlessly competitive. Bring patience.",
    tags: t({ strategy:5, compete:5, social:4, action:3, challenge:4, fantasy:2 })
  },
  {
    name: "Civilization VI",
    year: 2016, emoji: "🏛️", platform: "PC / Console",
    blurb: "Build an empire to stand the test of time. \"One more turn\" until sunrise.",
    tags: t({ strategy:5, explore:3, chill:2, compete:3 })
  },
  {
    name: "Animal Crossing: New Horizons",
    year: 2020, emoji: "🏝️", platform: "Switch",
    blurb: "Decorate an island, pay off a raccoon, vibe in real time. Maximum cozy.",
    tags: t({ chill:5, creative:5, social:3, explore:2, short:3 })
  },
  {
    name: "DOOM Eternal",
    year: 2020, emoji: "😈", platform: "Everything",
    blurb: "A heavy-metal power fantasy. Rip, tear, and never stop moving. Pure adrenaline.",
    tags: t({ action:5, challenge:4, scifi:3, horror:2, short:2 })
  },
  {
    name: "Resident Evil 2 (Remake)",
    year: 2019, emoji: "🧟", platform: "Everything",
    blurb: "Survival horror at its tensest. Mr. X is walking. He is always walking.",
    tags: t({ horror:5, action:3, story:3, challenge:3, puzzle:2 })
  },
  {
    name: "Outer Wilds",
    year: 2019, emoji: "🪐", platform: "Everything",
    blurb: "A 22-minute time loop and a solar system of secrets. The best game you can only play once.",
    tags: t({ explore:5, puzzle:5, scifi:5, story:4 })
  },
  {
    name: "Among Us",
    year: 2018, emoji: "🔪", platform: "Everything",
    blurb: "Do chores. Accuse your friends. Get ejected into the void. Friendship-ending fun.",
    tags: t({ social:5, compete:3, puzzle:2, short:4, scifi:2 })
  },
  {
    name: "Mario Kart 8 Deluxe",
    year: 2017, emoji: "🏎️", platform: "Switch",
    blurb: "The great equalizer. Blue shells, broken couches, eternal rivalries.",
    tags: t({ social:5, compete:4, short:5, action:3, retro:2 })
  },
  {
    name: "Cyberpunk 2077",
    year: 2020, emoji: "🌃", platform: "PC / Console",
    blurb: "Neon dystopia, chrome implants, and a city that finally works. Jack in.",
    tags: t({ story:5, explore:4, action:4, scifi:5 })
  },
  {
    name: "Slay the Spire",
    year: 2019, emoji: "🃏", platform: "Everything",
    blurb: "Deckbuilding roguelike perfection. \"I'll just do one run\" is a lie you tell yourself.",
    tags: t({ strategy:5, puzzle:3, challenge:4, short:3, fantasy:2 })
  },
  {
    name: "Final Fantasy VII",
    year: 1997, emoji: "🌸", platform: "Everything",
    blurb: "The JRPG that defined a generation. Big swords, bigger feelings, iconic everything.",
    tags: t({ story:5, fantasy:4, scifi:3, strategy:3, retro:4, explore:3 })
  },
  {
    name: "Super Mario Odyssey",
    year: 2017, emoji: "🎩", platform: "Switch",
    blurb: "Pure, gleeful 3D platforming joy. Throw your hat, become a dinosaur, smile a lot.",
    tags: t({ action:3, explore:4, chill:2, creative:2, short:3 })
  },
  {
    name: "Sekiro: Shadows Die Twice",
    year: 2019, emoji: "🥷", platform: "PC / Console",
    blurb: "Rhythmic, lethal sword duels. Posture broken, ego broken, you become the blade.",
    tags: t({ action:5, challenge:5, story:3, explore:2, fantasy:3 })
  },
  {
    name: "Baldur's Gate 3",
    year: 2023, emoji: "🎲", platform: "PC / Console",
    blurb: "A tabletop dream realized. Roll dice, romance everyone, break the rules creatively.",
    tags: t({ story:5, strategy:5, social:4, fantasy:5, explore:3, creative:2 })
  },
  {
    name: "Vampire Survivors",
    year: 2022, emoji: "🧛", platform: "Everything",
    blurb: "Stand still-ish, watch the screen fill with violence. Absurdly moreish for $5.",
    tags: t({ action:4, short:5, retro:4, challenge:2, chill:2 })
  },
  {
    name: "It Takes Two",
    year: 2021, emoji: "🧸", platform: "Everything",
    blurb: "A co-op-only adventure bursting with ideas. Grab a partner; it's not optional.",
    tags: t({ social:5, action:3, puzzle:3, story:4, creative:2 })
  },
  {
    name: "Factorio",
    year: 2020, emoji: "🏭", platform: "PC / Console",
    blurb: "Automate a planet. \"The factory must grow.\" Time becomes a flat circle of conveyor belts.",
    tags: t({ strategy:5, creative:4, puzzle:4, scifi:3, challenge:3 })
  },
  {
    name: "Journey",
    year: 2012, emoji: "🏜️", platform: "PC / PlayStation",
    blurb: "A wordless pilgrimage through sand and light. Two hours that stay with you forever.",
    tags: t({ chill:4, explore:4, story:4, social:2, short:3 })
  },
  {
    name: "Counter-Strike 2",
    year: 2023, emoji: "🔫", platform: "PC",
    blurb: "Tactical shooting distilled to its purest form. Easy to learn, lifetime to master.",
    tags: t({ action:5, compete:5, social:3, challenge:4, short:3 })
  },
  {
    name: "Terraria",
    year: 2011, emoji: "🌳", platform: "Everything",
    blurb: "2D dig-build-fight sandbox with absurd depth. Like Minecraft's chaotic sidekick.",
    tags: t({ creative:5, explore:4, action:3, social:3, retro:4, challenge:2 })
  },
  {
    name: "Persona 5 Royal",
    year: 2019, emoji: "🃏", platform: "Everything",
    blurb: "Stylish teens steal hearts by night, ace exams by day. The drip is unmatched.",
    tags: t({ story:5, strategy:4, fantasy:3, social:2, explore:2 })
  },
  {
    name: "Rocket League",
    year: 2015, emoji: "⚽", platform: "Everything",
    blurb: "Soccer. With rocket cars. Somehow the controls feel perfect. Aerial goals = euphoria.",
    tags: t({ compete:5, social:4, action:4, short:4, challenge:3 })
  },
  {
    name: "Inside",
    year: 2016, emoji: "🌫️", platform: "Everything",
    blurb: "A bleak, wordless puzzle-platformer that escalates into something unforgettable.",
    tags: t({ puzzle:4, horror:3, story:4, short:3, explore:2 })
  },
  {
    name: "Cuphead",
    year: 2017, emoji: "☕", platform: "Everything",
    blurb: "A 1930s cartoon that wants you dead. Boss-rush brutal, hand-drawn beautiful.",
    tags: t({ action:4, challenge:5, retro:4, short:3, social:2 })
  },
  {
    name: "No Man's Sky",
    year: 2016, emoji: "🚀", platform: "Everything",
    blurb: "An entire galaxy to explore, build, and trade across. Redemption-arc poster child.",
    tags: t({ explore:5, scifi:5, creative:4, chill:3, social:2 })
  },
  {
    name: "Phasmophobia",
    year: 2020, emoji: "👻", platform: "PC",
    blurb: "Co-op ghost hunting that turns brave friends into screaming cowards. Bring a flashlight.",
    tags: t({ horror:5, social:5, puzzle:3, challenge:2 })
  },
  {
    name: "Pokémon Scarlet / Violet",
    year: 2022, emoji: "⚡", platform: "Switch",
    blurb: "Gotta catch 'em all in an open world. Cozy, collectible, endlessly comforting.",
    tags: t({ explore:4, chill:3, strategy:3, social:3, story:2, fantasy:2 })
  },
  {
    name: "Death Stranding",
    year: 2019, emoji: "📦", platform: "PC / PlayStation",
    blurb: "A walking-delivery sim that's weirdly meditative and deeply strange. Reconnect a broken world.",
    tags: t({ explore:5, story:5, scifi:4, chill:3, challenge:2 })
  },
  {
    name: "Apex Legends",
    year: 2019, emoji: "🪂", platform: "Everything",
    blurb: "Fast, slick battle royale with the best movement in the genre. Squad up and slide.",
    tags: t({ action:5, compete:5, social:4, scifi:3, short:3 })
  },
  {
    name: "Undertale",
    year: 2015, emoji: "❤️", platform: "Everything",
    blurb: "A tiny RPG where you don't have to kill anyone. It knows what you did. It remembers.",
    tags: t({ story:5, puzzle:3, retro:4, short:3, fantasy:2 })
  },
  {
    name: "Monster Hunter: World",
    year: 2018, emoji: "🐉", platform: "Everything",
    blurb: "Hunt enormous beasts, craft cooler gear, repeat. Best with friends and a big screen.",
    tags: t({ action:5, social:4, challenge:4, fantasy:4, strategy:3 })
  },
  {
    name: "Subnautica",
    year: 2018, emoji: "🐙", platform: "Everything",
    blurb: "Survive an alien ocean. Equal parts wonder and pure thalassophobic terror. Don't go deep.",
    tags: t({ explore:5, horror:3, scifi:4, creative:3, story:3, challenge:2 })
  },
  {
    name: "Fall Guys",
    year: 2020, emoji: "🫘", platform: "Everything",
    blurb: "60 beans, one crown, total slapstick mayhem. The wholesome battle royale.",
    tags: t({ social:5, compete:4, short:5, action:2, chill:2 })
  },
  {
    name: "Return of the Obra Dinn",
    year: 2018, emoji: "⚓", platform: "Everything",
    blurb: "Deduce the fate of 60 sailors from frozen moments of death. A 1-bit detective masterpiece.",
    tags: t({ puzzle:5, story:4, retro:4, explore:2 })
  },
  {
    name: "Diablo IV",
    year: 2023, emoji: "🔥", platform: "Everything",
    blurb: "Click demons, collect loot, chase numbers go up. The original dopamine treadmill.",
    tags: t({ action:5, fantasy:4, social:3, strategy:2, horror:2 })
  },
  {
    name: "Tunic",
    year: 2022, emoji: "🦊", platform: "Everything",
    blurb: "A tiny fox, a cryptic in-game manual, and secrets stacked on secrets. Zelda but mysterious.",
    tags: t({ puzzle:5, explore:4, action:3, challenge:3, fantasy:3 })
  },
  {
    name: "Balatro",
    year: 2024, emoji: "🂡", platform: "Everything",
    blurb: "Poker fused with a roguelike deckbuilder. \"One more hand\" is a documented health hazard.",
    tags: t({ strategy:5, puzzle:4, short:4, retro:3, challenge:3 })
  },
  {
    name: "Sea of Thieves",
    year: 2018, emoji: "🏴‍☠️", platform: "Everything",
    blurb: "Be a pirate with your pals. Sail, sing, dig for treasure, get betrayed. Story you make yourself.",
    tags: t({ social:5, explore:4, action:3, compete:3, creative:2 })
  },
  {
    name: "Ori and the Will of the Wisps",
    year: 2020, emoji: "🌟", platform: "Everything",
    blurb: "A heart-melting, breathtaking platformer. Will make you cry, then make you platform through tears.",
    tags: t({ action:3, explore:4, story:4, challenge:3, fantasy:4, chill:2 })
  },
  {
    name: "Valorant",
    year: 2020, emoji: "💥", platform: "PC",
    blurb: "Tactical shooter meets hero abilities. Precise, punishing, ranked-anxiety incarnate.",
    tags: t({ action:5, compete:5, social:3, challenge:4, scifi:2 })
  },
  {
    name: "Spiritfarer",
    year: 2020, emoji: "⛴️", platform: "Everything",
    blurb: "A cozy management game about ferrying spirits to the afterlife. Gentle, gutting, beautiful.",
    tags: t({ chill:5, story:5, creative:3, explore:2, social:2 })
  },
  {
    name: "Half-Life: Alyx",
    year: 2020, emoji: "🥽", platform: "PC VR",
    blurb: "The VR game that justifies the headset. Immersive, tense, and genuinely groundbreaking.",
    tags: t({ action:4, story:4, scifi:5, horror:3, puzzle:3, explore:2 })
  },
  {
    name: "Kingdom Come: Deliverance",
    year: 2018, emoji: "🏰", platform: "PC / Console",
    blurb: "A grounded medieval RPG with zero magic and real consequences. You're a peasant. Stay humble.",
    tags: t({ story:5, explore:4, strategy:3, action:3, challenge:3 })
  },
  {
    name: "Pikmin 4",
    year: 2023, emoji: "🌼", platform: "Switch",
    blurb: "Command tiny plant armies in a chill real-time strategy puzzle. Surprisingly tense, deeply cute.",
    tags: t({ strategy:4, chill:3, puzzle:3, explore:3, short:2 })
  }
];

/* expose */
window.DIMENSIONS = DIMENSIONS;
window.GAMES = GAMES;
