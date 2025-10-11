export type CartItem = {
id: number;
name: string;
price: number;
qty: number;
// bestaande velden uit je broodjes-flow
removed?: string[];
note?: string;
// nieuw voor pasta
category?: "pasta" | "broodje" | "dessert" | "drank" | string;
timeslot?: "11:30" | "12:00" | "12:30" | "13:00"; // verplicht voor category === "pasta"
};


export type Customer = {
name: string;
phone: string;
note?: string;
};