import groundnut from "@/assets/groundnut.asset.json";
import coconut from "@/assets/coconut.asset.json";
import sesame from "@/assets/sesame.asset.json";

export type Product = {
  id: string;
  name: string;
  category: "oils" | "dryfruits";
  description: string;
  image?: string;
  variants: { size: string; price: number }[];
  tags?: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: "groundnut-oil",
    name: "Groundnut Oil",
    category: "oils",
    description:
      "Traditional cold-pressed groundnut oil extracted without chemicals. Rich in antioxidants and perfect for everyday cooking.",
    image: groundnut.url,
    variants: [
      { size: "500 ml", price: 175 },
      { size: "1 Litre", price: 320 },
    ],
    tags: ["Best Seller"],
  },
  {
    id: "sesame-oil",
    name: "Sesame Oil",
    category: "oils",
    description:
      "Wood-pressed sesame oil rich in calcium, vitamins and healthy fats. Ideal for cooking and traditional uses.",
    image: sesame.url,
    variants: [
      { size: "500 ml", price: 220 },
      { size: "1 Litre", price: 410 },
    ],
    tags: ["Popular"],
  },
  {
    id: "coconut-oil",
    name: "Coconut Oil",
    category: "oils",
    description:
      "Pure cold-pressed coconut oil from fresh coconuts. Excellent for cooking, skin care and hair care.",
    image: coconut.url,
    variants: [
      { size: "500 ml", price: 250 },
      { size: "1 Litre", price: 480 },
    ],
    tags: ["New"],
  },
  {
    id: "castor-oil",
    name: "Castor Oil",
    category: "oils",
    description: "Natural castor oil known for hair growth and medicinal benefits.",
    variants: [
      { size: "500 ml", price: 190 },
      { size: "1 Litre", price: 360 },
    ],
  },
  {
    id: "mustard-oil",
    name: "Mustard Oil",
    category: "oils",
    description: "Traditional mustard oil rich in omega fatty acids with natural flavour.",
    variants: [
      { size: "500 ml", price: 160 },
      { size: "1 Litre", price: 295 },
    ],
  },
  {
    id: "neem-oil",
    name: "Neem Oil",
    category: "oils",
    description: "100% pure neem oil for agricultural and external applications.",
    variants: [
      { size: "500 ml", price: 210 },
      { size: "1 Litre", price: 395 },
    ],
  },
  // Dry fruits
  ...(
    [
      ["almonds", "Almonds", 850],
      ["cashews", "Cashews", 920],
      ["pistachios", "Pistachios", 1100],
      ["walnuts", "Walnuts", 980],
      ["raisins", "Raisins", 350],
      ["dates", "Dates", 420],
      ["figs", "Figs", 780],
      ["mixed-dry-fruits", "Mixed Dry Fruits", 890],
    ] as const
  ).map(
    ([id, name, price]): Product => ({
      id,
      name,
      category: "dryfruits",
      description: `Premium quality ${name.toLowerCase()}, hand-picked and freshly packed.`,
      variants: [
        { size: "250 g", price: Math.round(price / 4) },
        { size: "500 g", price: Math.round(price / 2) },
        { size: "1 Kg", price },
      ],
    })
  ),
];