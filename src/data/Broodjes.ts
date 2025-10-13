export type Broodje = {
  id: number;
  name: string;
  price: number;
  desc: string;
  tags: string[];
};

export const broodjes: Broodje[] = [
  { id: 201, name: "Broodje hesp",              price: 5.30, desc: "Hesp, mayonaise, sla, tomaat, komkommer, wortel en ei", tags: [] },
  { id: 202, name: "Broodje kaas",              price: 5.30, desc: "Kaas, mayonaise, sla, tomaat, komkommer, wortel en ei", tags: ["Vega"] },
  { id: 203, name: "Broodje préparé",           price: 5.50, desc: "Préparé, mayonaise, sla, tomaat, komkommer, wortel en ei", tags: [] },
  { id: 204, name: "Broodje Smos",              price: 5.60, desc: "Kaas, hesp, mayonaise, sla, tomaat, komkommer, wortel en ei", tags: [] },
  { id: 205, name: "Broodje Tropical",          price: 5.60, desc: "Hesp, kaas, cocktailsaus, sla, tomaat, komkommer, wortel, ei, ananas", tags: [] },
  { id: 206, name: "Broodje Kip Curry",         price: 5.30, desc: "Kip curry, sla, tomaat, komkommer, wortel, ei", tags: [] },
  { id: 207, name: "Broodje Vleessalade",       price: 5.30, desc: "Vleessalade, sla, tomaat, komkommer, wortel, ei", tags: [] },
  { id: 208, name: "Broodje Tonijn",            price: 5.90, desc: "Tonijn, sla, tomaat, komkommer, wortel, ei", tags: ["Vis"] },
  { id: 209, name: "Broodje Krabsalade",        price: 5.90, desc: "Krabsalade, sla, tomaat, komkommer, wortel, ei", tags: ["Vis"] },
  { id: 210, name: "Broodje garnalensalade",    price: 10.30, desc: "Garnalensalade, sla, tomaat, komkommer, wortel, ei", tags: ["Vis"] },
  { id: 211, name: "Broodje eiersalade",        price: 5.30, desc: "Eiersalade, sla, tomaat, komkommer, wortel, ei", tags: ["Vega"] },
  { id: 212, name: "Broodje tonijntino",        price: 6.20, desc: "Tonijn, mosterd, tabasco, martinosaus, tomaat, ansjovis, augurk", tags: ["Vis"] },
  { id: 213, name: "Broodje Toscaans",          price: 6.90, desc: "Rauwe ham, mozzarella, pesto, rucola, zongedroogde tomaten", tags: [] },
  { id: 214, name: "Broodje Boulet",            price: 5.50, desc: "Gebakken boulet, bickysaus, augurk, gedroogde ui", tags: [] },
  { id: 215, name: "Broodje Gezond",            price: 4.50, desc: "Sla, tomaat, komkommer, cresson, wortel, ei, mayonaise", tags: ["Vega"] },
  { id: 216, name: "Broodje brie",              price: 6.20, desc: "Brie, honing, nootjes, rucola", tags: ["Vega"] },
  { id: 217, name: "Broodje Rauwe Ham",         price: 6.40, desc: "Rauwe ham, pesto, rucola, zongedroogde tomaat", tags: [] },
  { id: 218, name: "Broodje zalm",              price: 6.40, desc: "Gerookte zalm, cocktailsaus, sla, verse ui, tomaten", tags: ["Vis"] },
  { id: 219, name: "Broodje Bicky",             price: 6.20, desc: "Préparé, bickysaus, augurk, gedroogde ui", tags: [] },
  { id: 220, name: "Broodje Mozzarella",        price: 6.40, desc: "Mozzarella, pesto, sla, tomaat", tags: ["Vega"] },
  { id: 221, name: "Broodje César",             price: 7.40, desc: "Gebakken kip, parmezan, caeserdressing, sla, tomaat, komkommer, wortel, ei, rucola en tuinkers", tags: [] },
  { id: 222, name: "Broodje Martino",           price: 6.20, desc: "Préparé, martinosaus, mosterd, tabasco, ansjovis, augurk, tomaat", tags: [] },
  { id: 223, name: "Broodje kip Curry deluxe",  price: 6.40, desc: "Gebakken kip, verse currysaus, appel en sla", tags: [] },
  { id: 224, name: "Broodje zalm met kruidenkaas", price: 7.10, desc: "Zalm, kruidenkaas, tuinkers, sla en tomaat", tags: ["Vis"] },
  { id: 225, name: "Broodje kipfilet",          price: 5.80, desc: "Kipfilet, sla, tuinkers, mayonaise, tomaat, komkommer, wortels en ei", tags: [] },
  { id: 226, name: "Broodje kipsalade",         price: 5.50, desc: "Kipsalade, cocktailsaus, perzik en tuinkers", tags: [] },
  { id: 227, name: "Broodje rosbief",           price: 7.90, desc: "Rosbief, tuinkers, tomaat, parmezan en truffelmayonnaise", tags: [] },

  
  { id: 228, name: "Broodje carpacio",          price: 8.70, desc: "Carpaccio van rund, parmezan, rucola, truffelolie", tags: [] },
  { id: 229, name: "Broodje tonijn pikant",     price: 5.90, desc: "Tonijn, pikante saus, tomaat, augurk", tags: ["Vis"] },
  { id: 230, name: "Broodje iberico",           price: 10.80, desc: "Iberico ham, rucola, tomaat, olijfolie", tags: [] },
  { id: 231, name: "Broodje pastrami",          price: 8.70, desc: "Pastrami, mosterd, augurk, sla", tags: [] },
];
