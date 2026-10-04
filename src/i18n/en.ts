import type { NavTarget, SectionId } from "@/data/cafe";

export const en = {
  brand: "LAYALI",
  brandSub: "Café · Lounge · Games",
  loading: "Brewing your night",
  skip: "Skip to the menu",

  nav: {
    menu: "Menu",
    more: "More",
    close: "Close",
    reserve: "Reserve",
    soundOn: "Sound on",
    soundOff: "Sound off",
    links: [
      ["inside", "The Café"],
      ["drinks", "Drinks"],
      ["shisha", "Shisha"],
      ["billiards", "Billiards"],
      ["cards", "Cards"],
      ["seating", "Seating"],
      ["week", "This Week"],
      ["/menu", "Menu"],
      ["/contact", "Contact"],
    ] as [NavTarget, string][],
    tagline: "Open every night until 2 AM",
    page: "Page",
  },

  pages: {
    label: "Pages",
    "/": "Home",
    "/menu": "Menu",
    "/contact": "Contact",
  },

  menuPage: {
    kicker: "Layali · Amman · Since 2026",
    title: "The Menu",
    sub: "Specialty coffee roasted in Amman, shisha mixed by hand, cold drinks that glow and desserts worth staying for.",
    stats: { items: "Items", categories: "Categories", signatures: "Signatures" },
    scroll: "Scroll to taste",
    search: "Search the menu…",
    signatureOnly: "Signatures only",
    count: (n: string) => `${n} items`,
    empty: "Nothing on the menu matches that.",
    clear: "Clear filters",
    ctaKicker: "Hungry yet?",
    ctaTitle: "Your table is waiting.",
    ctaSub: "Reserve a corner and we'll have the kettle on before you arrive.",
    reserve: "Reserve a table",
    ask: "Ask us on WhatsApp",
    notes: [
      "Prices in Jordanian Dinar, service included.",
      "Oat or almond milk on any coffee, +0.50.",
      "Allergies? Tell us — the kitchen will adapt.",
    ],
  },

  contactPage: {
    kicker: "Contact",
    title: "Let's talk.",
    sub: "Questions, reservations, birthdays or just saying hi — we're one message away.",
    inAmman: "in Amman right now",
    actions: [
      { key: "call", label: "Call us", hint: "Answered 4 PM — 2 AM" },
      { key: "whatsapp", label: "WhatsApp", hint: "Fastest reply" },
      { key: "instagram", label: "Instagram", hint: "Tonight's stories" },
      { key: "email", label: "Email", hint: "Events & partnerships" },
    ],
    mapKicker: "Find us",
    mapTitle: "Halfway down Rainbow Street.",
    landmark:
      "Two minutes from First Circle, between the old stone houses. Look for the warm light and the glass door.",
    openMaps: "Open in Google Maps",
    copy: "Copy address",
    copied: "Copied!",
    hoursKicker: "Hours",
    hoursTitle: "Every night, the same promise.",
    hoursNote:
      "Kitchen and last shisha at 1:30 AM. Open on public holidays and during Ramadan after iftar.",
    today: "Today",
    formKicker: "Write to us",
    formTitle: "Send a message.",
    formSub: "It opens WhatsApp with your message ready — we usually reply within minutes.",
    name: "Your name",
    phone: "Phone (optional)",
    topic: "What's it about?",
    topics: ["Just saying hi", "Reservation", "Birthday / event", "Feedback", "Work with us"],
    message: "Your message",
    send: "Send on WhatsApp",
    sent: "WhatsApp is open with your message — just hit send.",
    required: "Required",
    reserveInstead: "Looking for a table? Reserve instead",
    text: (d: { name: string; phone: string; topic: string; message: string }) =>
      `Hi Layali! ${d.topic}\n\n${d.message}\n\n— ${d.name}${d.phone ? ` (${d.phone})` : ""}`,
    gettingKicker: "Getting here",
    getting: [
      {
        title: "By car",
        text: "Valet at the door for 2 JOD, or the public lot two minutes up Rainbow Street.",
      },
      {
        title: "By taxi",
        text: "Ask Careem or Uber for “Layali, Rainbow Street” — every driver knows it.",
      },
      {
        title: "On foot",
        text: "From First Circle, walk down Rainbow Street for three minutes. We're on the left.",
      },
    ],
    socialKicker: "Follow the night",
  },

  cursor: {
    enter: "Enter",
    drag: "Drag",
    view: "View",
    explore: "Explore",
    open: "Open",
    go: "Go",
    taste: "Taste",
    swipe: "Swipe",
  },

  alt: {
    facade: "Layali café at night, warm light pouring through a glass door onto a wet street",
    indoor: "Leather sofas and brass lamps in Layali's indoor lounge",
    outdoor: "The terrace at night under string lights, overlooking Amman",
    lounge: "A private corner with velvet sofas and a crystal shisha",
    friends: "Friends laughing over a card game at a wooden table",
    billiards: "A player lining up a shot under the billiards lamp",
    coffee: "A latte with rosetta art on a dark wooden table",
    drinks: "Three mocktails glowing under neon lights at the bar",
  },

  entrance: {
    title: "Your night starts here.",
    enter: "Enter",
    hint: "Scroll to walk in",
    est: "EST. 2026 · AMMAN",
    open: "Open",
  },

  inside: {
    words: ["Coffee.", "Friends.", "Games.", "Nights."],
    lines: [
      "Roasted fresh, poured slow, served like it matters.",
      "The corner table that somehow is always yours.",
      "Billiards, cards and the rivalries that never end.",
      "Stay as long as you like — the lights stay on.",
    ],
    welcome: "Welcome to Layali",
  },

  coffee: {
    kicker: "Chapter 01 — The Coffee Lab",
    ingredients: ["Espresso", "Milk", "Caramel", "Chocolate", "Ice"],
  },

  drinks: {
    kicker: "Chapter 02 — Drinks Universe",
    hint: "The bar moves sideways — keep scrolling",
    swipe: "Swipe through the bar",
  },

  shisha: {
    kicker: "Chapter 03 — Shisha Lounge",
    relax: "Relax.",
    flavor: "Your flavor.",
    hint: "Hover a flavor to light the lounge",
    hintTouch: "Tap a flavor to light the lounge",
    from: "From",
  },

  billiards: {
    kicker: "Chapter 04 — Billiards Room",
    words: ["Play.", "Challenge.", "Win."],
    info: (tables: number, price: string) => `${tables} tables · ${price} per hour`,
    sub: "Four tables under warm lamps. Bring your rival.",
  },

  cards: {
    kicker: "Chapter 05 — The Cards Table",
    lines: ["One more game?", "One more round.", "One more night."],
    info: "Tarneeb · Trix · Basra · Hand — decks are on the house.",
  },

  seating: {
    kicker: "Chapter 06 — Seating",
    lines: ["Your corner.", "Your people.", "Your night."],
    places: [
      "Indoor Lounge",
      "Outdoor Terrace",
      "Private Corners",
      "Group Tables",
      "Night Seating",
    ],
  },

  table: {
    kicker: "Chapter 07 — The Table",
    title: "Everything, on one table.",
    hint: "Hover anything on the table. Tap to open.",
    hintTouch: "Tap anything on the table.",
    items: {
      coffee: "Coffee",
      dessert: "Desserts",
      cold: "Cold Drinks",
      shisha: "Shisha",
      cards: "Games",
      ball: "Billiards",
      phone: "Wi-Fi & details",
    },
    viewAll: "Open the full list",
    games: {
      title: "Games on the house",
      text: "Every table gets a free deck, backgammon and Uno. Tarneeb tournament every Thursday at 9 PM.",
      list: ["Tarneeb", "Trix", "Basra", "Hand", "Backgammon", "Uno"],
    },
    billiards: {
      title: "The billiards room",
      text: "Four tournament tables, cues and chalk included. Book a table or just walk in.",
    },
    phone: {
      title: "The details",
      wifi: "Wi-Fi",
      charging: "A charger at every corner",
      hours: "Hours",
      phone: "Phone",
    },
  },

  menu: {
    kicker: "Chapter 08 — The Menu",
    title: "The full menu",
    note: "Prices in Jordanian Dinar, service included.",
    signature: "Signature",
    cta: "Open the full menu",
  },

  moments: {
    kicker: "Chapter 09 — Night Moments",
    title: "Memories from a night.",
    captions: [
      "Good coffee.",
      "Good people.",
      "Late nights.",
      "One more shot.",
      "The best table.",
      "Still early.",
      "Cold and bright.",
      "Our corner.",
      "The city below.",
      "Who's dealing?",
    ],
    hint: "Scroll to walk through the night",
  },

  clock: {
    kicker: "Chapter 10 — The Clock",
    title: "Time moves differently here.",
    events: [
      "A first coffee",
      "Friends arrive",
      "Billiards",
      "Shisha",
      "Cards",
      "Late night drinks",
      "One last coffee",
    ],
    am: "AM",
    pm: "PM",
  },

  end: {
    kicker: "Chapter 11 — End of the Night",
    closing: "2:00 AM — last call",
    title: "Come again tomorrow.",
    sub: "The lights go off at two. The table stays yours.",
    location: "Location",
    hours: "Opening hours",
    phone: "Phone",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    maps: "Google Maps",
    reserve: "Reserve a table",
    directions: "Get directions",
    call: "Call us",
    whatsappBtn: "WhatsApp",
    signBack: "LAYALI",
    contactCta: "All the ways to reach us",
  },

  status: {
    open: "Open now · until 2 AM",
    closed: "Closed · opens at 4 PM",
  },

  chapters: {
    entrance: "The Door",
    inside: "The Café",
    coffee: "The Coffee Lab",
    drinks: "Drinks Universe",
    shisha: "Shisha Lounge",
    billiards: "Billiards Room",
    cards: "The Cards Table",
    seating: "Seating",
    house: "The House",
    table: "The Table",
    week: "The Week",
    menu: "The Menu",
    reviews: "The Regulars",
    moments: "Night Moments",
    clock: "The Clock",
    end: "End of the Night",
    faq: "Good to Know",
  } satisfies Record<SectionId, string>,
  interlude: "Interlude",

  strips: {
    night: [
      "Specialty coffee",
      "Crystal shisha",
      "Four billiards tables",
      "Tarneeb nights",
      "Rooftop terrace",
      "Open till 2 AM",
    ],
    menu: [
      "Spanish latte",
      "Lemon mint",
      "Double apple",
      "Kunafa cheesecake",
      "Blue lagoon",
      "Iced mocha",
    ],
  },

  house: {
    kicker: "Interlude — The House",
    title: "A café built for long nights.",
    story:
      "Layali started with one table and an argument about who makes the best coffee in Jabal Amman. Today it's three floors of warm light: a roastery bar on the ground floor, a lounge and billiards room above, and a terrace that looks over the whole city.",
    story2:
      "We roast our beans in Amman every week, mix our shisha by hand, and keep the decks on every table. Stay as long as you like — nobody here will ever hand you the bill before you ask.",
    sign: "— The Layali family",
    stats: {
      menu: "Things on the menu",
      flavors: "Shisha flavors",
      tables: "Billiards tables",
      hours: "Hours open, every night",
    },
    amenitiesTitle: "The little things",
    amenities: [
      { title: "Fast Wi-Fi", text: "Fiber, 300 Mbps. Work late, we won't mind." },
      { title: "Valet parking", text: "Leave the keys at the door. 2 JOD." },
      { title: "Rooftop terrace", text: "Heaters in winter, breeze in summer." },
      { title: "Live matches", text: "Big screen for every derby and final." },
      { title: "Chargers everywhere", text: "USB-C and Lightning at every table." },
      { title: "Non-smoking hall", text: "A quiet hall with clean air, always." },
      { title: "Cards & CliQ", text: "Pay cash, card, Apple Pay or CliQ." },
      { title: "Board games", text: "Backgammon, chess, Uno and Jenga." },
    ],
  },

  week: {
    kicker: "Interlude — The Week",
    title: "Every night has a plan.",
    sub: "Seven nights, seven reasons to come back. Entry is always free.",
    tonight: "Tonight",
    nights: [
      {
        day: "Sunday",
        short: "Su",
        name: "Study & Chill",
        text: "Lo-fi playlist, quiet tables and refills on filter coffee until midnight.",
        time: "From 4 PM",
        tag: "Free refills",
      },
      {
        day: "Monday",
        short: "Mo",
        name: "Backgammon Night",
        text: "Boards on every table. Beat the house champion and your shisha is on us.",
        time: "From 8 PM",
        tag: "Prize",
      },
      {
        day: "Tuesday",
        short: "Tu",
        name: "Shisha Tasting",
        text: "Our mixologist brings a new blend every week. Taste three, keep your favorite.",
        time: "From 9 PM",
        tag: "New blend",
      },
      {
        day: "Wednesday",
        short: "We",
        name: "Billiards League",
        text: "Eight-ball doubles, league table on the wall, bragging rights all week.",
        time: "9 PM",
        tag: "League",
      },
      {
        day: "Thursday",
        short: "Th",
        name: "Tarneeb Tournament",
        text: "Sixteen teams, one trophy. Sign up at the bar before nine.",
        time: "9 PM",
        tag: "Trophy",
      },
      {
        day: "Friday",
        short: "Fr",
        name: "Match Night",
        text: "The big screen comes down, the volume goes up. Every major game, live.",
        time: "From 6 PM",
        tag: "Live",
      },
      {
        day: "Saturday",
        short: "Sa",
        name: "Oud on the Terrace",
        text: "Live oud under the string lights, with the city glowing behind.",
        time: "10 PM",
        tag: "Live music",
      },
    ],
  },

  reviews: {
    kicker: "Interlude — The Regulars",
    title: "What the regulars say.",
    rating: "Google rating",
    count: (n: string) => `from ${n} reviews`,
    hint: "Hover to pause",
    items: [
      {
        name: "Lina H.",
        text: "The Spanish latte is dangerous. Came for one coffee, stayed until 1 AM.",
        when: "2 weeks ago",
      },
      {
        name: "Omar K.",
        text: "Best billiards tables in Amman, and the staff actually keep the cloth clean.",
        when: "a month ago",
      },
      {
        name: "Rania S.",
        text: "The terrace at sunset with a lemon mint — nothing beats it.",
        when: "3 weeks ago",
      },
      {
        name: "Yazan A.",
        text: "Thursday Tarneeb tournament is chaos in the best way. We lost, we'll be back.",
        when: "a week ago",
      },
      {
        name: "Dana M.",
        text: "Finally a café with a real non-smoking hall. Quiet, warm, great Wi-Fi.",
        when: "2 months ago",
      },
      {
        name: "Kareem F.",
        text: "Double apple with mint, perfectly packed. The coals guy is a legend.",
        when: "5 days ago",
      },
      {
        name: "Sara Q.",
        text: "Booked a corner for my birthday, they brought out the cake with sparklers.",
        when: "a month ago",
      },
      { name: "Hamza T.", text: "Kunafa cheesecake. That's the review.", when: "yesterday" },
    ],
  },

  faq: {
    kicker: "FAQ — Good to Know",
    title: "Good to know.",
    sub: "Anything else? Send us a message on WhatsApp — we reply fast.",
    ask: "Ask on WhatsApp",
    items: [
      {
        q: "Do I need to reserve?",
        a: "Weekdays you can just walk in. Thursday to Saturday after 9 PM gets busy, so reserving a table — especially billiards — is a good idea.",
      },
      {
        q: "Is there a minimum charge?",
        a: "No minimum on weekdays. Thursday to Saturday after 9 PM there's a 5 JOD minimum per person, which goes towards anything on the menu.",
      },
      {
        q: "Can I bring kids?",
        a: "Of course. Families are welcome until 10 PM in the non-smoking hall, and we have a few kid-friendly drinks on the menu.",
      },
      {
        q: "What's the shisha age limit?",
        a: "Shisha is served to guests 18 and over only. We may ask for an ID.",
      },
      {
        q: "Is there parking?",
        a: "Yes — valet parking at the door for 2 JOD, and a public lot two minutes up Rainbow Street.",
      },
      {
        q: "How can I pay?",
        a: "Cash, Visa, Mastercard, Apple Pay and CliQ. Splitting the bill is never a problem.",
      },
      {
        q: "Can we celebrate a birthday?",
        a: "Yes! Book a private corner, bring your own cake and we'll handle the candles, the plates and the music.",
      },
    ],
  },

  footer: {
    phrase: "Coffee. Friends. Games. Nights.",
    rights: "All rights reserved.",
    top: "Back to top",
  },

  reserve: {
    title: "Reserve a table",
    sub: "Tell us when you're coming. We'll confirm on WhatsApp.",
    name: "Your name",
    phone: "Phone number",
    date: "Date",
    time: "Time",
    guests: "Guests",
    area: "Where would you like to sit?",
    areas: ["Indoor Lounge", "Terrace", "Shisha Lounge", "Billiards Room", "Private Corner"],
    notes: "Anything we should know?",
    submit: "Send reservation",
    success: "You're on the list.",
    successSub: "We opened WhatsApp with your request — send it and we'll confirm within minutes.",
    again: "Make another reservation",
    required: "Required",
    invalidPhone: "Enter a valid phone number",
    message: (d: {
      name: string;
      phone: string;
      date: string;
      time: string;
      guests: number;
      area: string;
      notes: string;
    }) =>
      `Hi Layali! I'd like to reserve a table.\nName: ${d.name}\nPhone: ${d.phone}\nDate: ${d.date} at ${d.time}\nGuests: ${d.guests}\nArea: ${d.area}${d.notes ? `\nNotes: ${d.notes}` : ""}`,
  },
};

export type Dict = typeof en;
