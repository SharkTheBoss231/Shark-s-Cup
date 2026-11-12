/* ============================================================
   SHARK’S CUP: EDIT THIS FILE ONLY. The website builds itself from it.
   ============================================================ */
window.CUP = {
  name: "Shark’s Cup",
  tagline: "Play. Compete. Win.",
  game: "To be announced",          // e.g. "FC 26", "eFootball", "Tekken 8"
  date: "To be announced",
  venue: "Monrovia",
  entryFee: "$500 LD",
  prize: "To be announced",
  maxPlayers: 32,
  registrationOpen: true,

  // YOUR WhatsApp number for payment confirmation.
  // Country code first, digits only (no + or spaces). Liberia = 231.
  whatsapp: "231XXXXXXXXX",

  paymentInfo: "Pay the entry fee, then send your username and proof of payment on WhatsApp. Your spot is confirmed once we reply.",

  // Points used in league tables / groups / Swiss
  points: { win: 3, draw: 1, loss: 0 },

  rules: [
    "Entry fee is $500 LD, paid before the tournament starts.",
    "Each player registers one username. Use the same name you play with.",
    "Be ready at your scheduled time. A no-show can lose the match.",
    "Disputes go to the organizer on WhatsApp. The organizer’s decision is final."
  ],

  // Confirmed players (paid: true shows a green tick). Registrations arrive on WhatsApp;
  // add each confirmed player here.
  players: [
    { name: "SharkOne", paid: true },
    { name: "BlueFin", paid: true },
    { name: "GoldTooth", paid: true },
    { name: "TideRider", paid: false }
  ],

  /* ----------------------------------------------------------
     STAGES: add, remove or reorder as you like. Mix any formats.
     Types:
       "league"   : round robin or Swiss. Standings are calculated from results.
       "groups"   : several league tables (group stage).
       "bracket"  : single elimination, double elimination, or any knockout.
                    Use several "sections" for double elimination.
     A match is { a: "Name", b: "Name", sa: 2, sb: 1, when: "Sat 4pm", round: "Round 1" }
     Leave sa/sb out until the match is played. Leave a/b out for "to be decided".
     ---------------------------------------------------------- */
  stages: [
    {
      name: "Group stage",
      type: "groups",
      groups: [
        {
          name: "Group A",
          matches: [
            { a: "SharkOne", b: "BlueFin", sa: 2, sb: 1, when: "Day 1" },
            { a: "SharkOne", b: "GoldTooth", sa: 0, sb: 0, when: "Day 1" },
            { a: "BlueFin", b: "GoldTooth", when: "Day 2" }
          ]
        }
      ]
    },
    {
      name: "Knockout",
      type: "bracket",
      sections: [
        {
          title: "Main bracket",
          rounds: [
            { name: "Semi-finals", matches: [{ a: "SharkOne", b: "TideRider" }, { a: "BlueFin", b: "GoldTooth" }] },
            { name: "Final", matches: [{}] }
          ]
        }
      ]
    }
    /* League / Swiss example:
    { name: "Swiss", type: "league", players: ["A","B","C","D"],
      matches: [ { round: "Round 1", a: "A", b: "B", sa: 1, sb: 0 } ] }
    Double elimination example: type "bracket" with
      sections: [ {title:"Winners", rounds:[...]}, {title:"Losers", rounds:[...]}, {title:"Grand final", rounds:[...]} ]
    */
  ]
};
