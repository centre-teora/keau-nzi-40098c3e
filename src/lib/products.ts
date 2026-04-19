import yogaMatImg from "@/assets/product-yoga-mat.jpg";
import towelImg from "@/assets/product-towel.jpg";

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  features: string[];
  printfulId?: string;
};

export const products: Product[] = [
  {
    slug: "tapis-fleur-de-vie",
    name: "Tapis Fleur de Vie — Base 12",
    tagline: "Le sol sacré de votre pratique",
    price: 89,
    currency: "EUR",
    image: yogaMatImg,
    description:
      "Conçu pour ancrer chaque posture dans une géométrie millénaire, ce tapis de yoga premium porte la Fleur de Vie base 12 imprimée à l'or chaud sur un noir profond. Surface antidérapante, mousse haute densité, énergie alignée.",
    features: [
      "Dimensions 183 × 61 cm — épaisseur 6 mm",
      "Imprimé à l'encre dorée écologique",
      "Surface antidérapante double face",
      "Sangle de transport offerte",
      "Production éthique via Printful",
    ],
  },
  {
    slug: "serviette-fleur-de-vie",
    name: "Serviette Fleur de Vie — Base 12",
    tagline: "Douceur sacrée, ancrage doré",
    price: 39,
    currency: "EUR",
    image: towelImg,
    description:
      "Une serviette d'exception en microfibre absorbante, brodée de la Fleur de Vie base 12. Parfaite après votre séance, votre douche rituelle ou comme tapis d'appoint pour le hot yoga.",
    features: [
      "Dimensions 180 × 60 cm",
      "Microfibre haute absorption",
      "Broderie dorée résistante",
      "Lavable en machine 30°",
      "Production éthique via Printful",
    ],
  },
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);
