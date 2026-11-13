/* ============================================================
   SHARK’S CUP: EDIT THIS FILE ONLY. The website builds itself from it.
   ============================================================ */
window.CUP = {
  name: "Shark’s Cup",
  tagline: "Play. Compete. Win.",
  game: "eFootball & FC Mobile",
  tournamentType: "eFootball & FC Mobile Tournament",
  games: ["eFootball", "FC Mobile"],   // players pick one when registering
  date: "To be announced",
  venue: "Monrovia",
  entryFee: "$500 LD",
  prize: "To be announced",
  maxPlayers: 32,                   // spots per game
  registrationOpen: true,

  // YOUR WhatsApp number for payment confirmation.
  // Country code first, digits only (no + or spaces). Liberia = 231.
  whatsapp: "231770212200",

  paymentInfo: "Pay the entry fee, then send your username and proof of payment on WhatsApp. Your spot is confirmed once we reply.",

  // Points used in league tables / groups / Swiss
  points: { win: 3, draw: 1, loss: 0 },

  rules: [
    "This tournament has two competitions: eFootball and FC Mobile. Register for the game you will play.",
    "Entry fee is $500 LD, paid before the tournament starts.",
    "Each player registers one username. Use the same name you play with.",
    "Be ready at your scheduled time. A no-show can lose the match.",
    "Disputes go to the organizer on WhatsApp. The organizer’s decision is final."
  ],

  // Confirmed players (paid: true shows a green tick). Registrations arrive on WhatsApp;
  // add each confirmed player here.
  players: [],

  /* ----------------------------------------------------------
     STAGES: add, remove or reorder. Each stage is a tab on the site.

     AUTOMATIC (the site builds the fixtures for you):
       type: "auto", format: "single_elim" | "double_elim" | "round_robin" | "swiss" | "groups_knockout"
       players: "all" (default), "paid" (confirmed only), or a list of names
       seed: any text. Same seed = same draw for every visitor. Change it to redraw.
       shuffle: false keeps the order of the players list (no draw)
       Options: groups, advance (groups_knockout) | legs: 2 (round_robin, groups)
                rounds (swiss) | thirdPlace: true (single_elim, groups_knockout)
       results: add each finished match once, any order: { a: "Name", b: "Name", sa: 2, sb: 1 }
                For a drawn knockout match add the winner: w: "Name".
                Winners move to the next round by themselves.

     MANUAL still works: type "league", "groups" or "bracket" with matches typed by hand,
     e.g. { type: "league", name: "Friendlies", matches: [ { a: "A", b: "B", sa: 1, sb: 0 } ] }
     ---------------------------------------------------------- */
  stages: []
};
