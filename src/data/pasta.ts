// data/pasta.ts
export type PastaItem = {
  id: number;
  name: string;
  desc?: string;
  tags?: string[];
  price?: number;
  priceBySize: { small: number; medium: number; large: number };
  sauces?: string[]; // enkel gebruikt voor 'gewone' pasta (customizer toont 1–2)
};

export const PASTA_TIMESLOTS = ["11:30", "12:00", "12:30", "13:00"] as const;
export type PastaTimeslot = (typeof PASTA_TIMESLOTS)[number];

export const PRICE_BY_SIZE = { small: 6.00, medium: 8.00, large: 10.00 } as const;
export const PRICE_BY_SIZE_SPECIAL = { small: 8.00, medium: 10.00, large: 12.00}

export const COMMON_SAUCES = [
  "Bolognese",
  "Carbonara",
  "Pesto",
  "Arrabbiata",
  "Vier kazen",
  "Roomsaus",
];

// Gewone pasta's (zonder individuele bestelknop)
export const PASTA_LIST: PastaItem[] = [
  {
    id: 501,
    name: "Bolognaise",
    desc: "Tomatensaus met vlees",
    tags: ["warm", "klassieker", "vlees"],
    priceBySize: PRICE_BY_SIZE,
  },
  {
    id: 502,
    name: "Diabolique",
    desc: "Pikante tomatensaus met vlees",
    tags: ["warm", "pikant", "vlees"],
    priceBySize: PRICE_BY_SIZE,
  },
  {
    id: 503,
    name: "Arrabbiata",
    desc: "Pittige tomatensaus",
    tags: ["warm", "pikant", "veggie"],
    priceBySize: PRICE_BY_SIZE,
  },
  {
    id: 504,
    name: "Vier kazen",
    desc: "Romige vier-kazensaus",
    tags: ["warm", "veggie"],
    priceBySize: PRICE_BY_SIZE,
  },
  {
    id: 505,
    name: "Carbonara",
    desc: "Romige kaassaus met gebakken spek",
    tags: ["warm", "klassieker", "vlees"],
    priceBySize: PRICE_BY_SIZE,
  },
  {
    id: 506,
    name: "Spinazie",
    desc: "Spinazieroomsaus",
    tags: ["warm", "veggie"],
    price: PRICE_BY_SIZE.medium,
    priceBySize: PRICE_BY_SIZE,
  },
  {
    id: 507,
    name: "Pomodoro",
    desc: "Romige tomatensaus met topping pijnboompitten en rucola",
    tags: ["warm", "veggie"],
    priceBySize: PRICE_BY_SIZE,
  },
  {
    id: 508,
    name: "Pesto",
    desc: "Groene pesto met topping pijnboompitten en rucola",
    tags: ["warm", "veggie"],
    priceBySize: PRICE_BY_SIZE,
  },
];


// Speciale pasta's (elk met eigen bestelknop; géén sauskeuze in customizer)
// Specials uit de foto (geen sauskeuze in customizer)
export const SPECIAL_PASTA_LIST: PastaItem[] = [
  {
    id: 601,
    name: "Meat Lover Mix",
    desc: "Diabolique & carbonara",
    tags: ["special", "vlees", "pikant"],
    priceBySize: PRICE_BY_SIZE,
  },
  {
    id: 602,
    name: "Veggie Mix",
    desc: "Arrabbiata & vier kazen",
    tags: ["special", "veggie", "pikant"],
    priceBySize: PRICE_BY_SIZE,
  },
  // "Switch & Mix" bewust weggelaten
  {
    id: 603,
    name: "Spicy",
    desc: "Pasta met diabolique, spek en pesto",
    tags: ["special", "pikant", "vlees"],
    priceBySize: PRICE_BY_SIZE_SPECIAL,
  },
  {
    id: 604,
    name: "Popeye",
    desc: "Pasta met spinazie, spek, mozzarella en rucola",
    tags: ["special", "vlees"],
    priceBySize: PRICE_BY_SIZE_SPECIAL,
  },
  {
    id: 605,
    name: "Basic-Italian",
    desc: "Pasta met pomodoro, mozzarella, pesto, kerstomaten, pijnboompitten en rucola",
    tags: ["special", "veggie"],
    priceBySize: PRICE_BY_SIZE_SPECIAL,
  },
  {
    id: 606,
    name: "Pasta-Love",
    desc: "Pasta met vier kazen, pesto, zongedroogde tomaten, pijnboompitten en rucola",
    tags: ["special", "veggie"],
    priceBySize: PRICE_BY_SIZE_SPECIAL,
  },
];
