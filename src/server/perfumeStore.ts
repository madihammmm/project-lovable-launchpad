export type PerfumeCategory = "Floral" | "Oud" | "Fresh" | "Luxury" | "Sweet";

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: PerfumeCategory;
  description: string;
  image: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __DREAMSCENTS_PERFUMES__: Perfume[] | undefined;
  // eslint-disable-next-line no-var
  var __DREAMSCENTS_CONTACTS__: ContactMessage[] | undefined;
}

export const categories: PerfumeCategory[] = ["Floral", "Oud", "Fresh", "Luxury", "Sweet"];

function seedPerfumes(): Perfume[] {
  const now = new Date().toISOString();
  return [
    {
      id: crypto.randomUUID(),
      name: "Moonlit Peony",
      brand: "DreamScents Atelier",
      price: 89,
      category: "Floral",
      description: "Velvet peony, white musk, and sugared rose wrapped in a soft lavender haze.",
      image: "",
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Royal Oud Veil",
      brand: "Nocturne Maison",
      price: 145,
      category: "Oud",
      description: "A luminous oud blend with saffron, amber resin, and midnight vanilla.",
      image: "",
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Sky Mist Neroli",
      brand: "Aurelia Bloom",
      price: 72,
      category: "Fresh",
      description: "Airy neroli, pear blossom, and rain-kissed citrus for an effortless daytime aura.",
      image: "",
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Pearl Fantasy",
      brand: "DreamScents Atelier",
      price: 168,
      category: "Luxury",
      description: "Iris powder, champagne petals, and creamy sandalwood with a couture finish.",
      image: "",
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Blush Macaron",
      brand: "Sucre Lune",
      price: 64,
      category: "Sweet",
      description: "Raspberry cream, almond sugar, and vanilla cloud for a delicious romantic trail.",
      image: "",
      createdAt: now,
    },
  ];
}

export const perfumes: Perfume[] = (globalThis.__DREAMSCENTS_PERFUMES__ ??= seedPerfumes());
export const contacts: ContactMessage[] = (globalThis.__DREAMSCENTS_CONTACTS__ ??= []);

function normalizeCategory(value: unknown): PerfumeCategory {
  return categories.includes(value as PerfumeCategory) ? (value as PerfumeCategory) : "Floral";
}

export function validatePerfume(input: Partial<Perfume>) {
  const name = String(input.name ?? "").trim();
  const brand = String(input.brand ?? "").trim();
  const description = String(input.description ?? "").trim();
  const image = String(input.image ?? "").trim();
  const price = Number(input.price);

  if (!name || !brand || !description) return "Name, brand, and description are required.";
  if (!Number.isFinite(price) || price <= 0) return "Price must be a positive number.";
  if (name.length > 120 || brand.length > 120 || description.length > 1000 || image.length > 1000) {
    return "Some fields are too long.";
  }
  return null;
}

export function listPerfumes() {
  return perfumes;
}

export function findPerfume(id: string) {
  return perfumes.find((perfume) => perfume.id === id);
}

export function createPerfume(input: Partial<Perfume>): Perfume {
  const perfume: Perfume = {
    id: crypto.randomUUID(),
    name: String(input.name ?? "").trim().slice(0, 120),
    brand: String(input.brand ?? "").trim().slice(0, 120),
    price: Number(input.price),
    category: normalizeCategory(input.category),
    description: String(input.description ?? "").trim().slice(0, 1000),
    image: String(input.image ?? "").trim().slice(0, 1000),
    createdAt: new Date().toISOString(),
  };
  perfumes.unshift(perfume);
  return perfume;
}

export function updatePerfume(id: string, input: Partial<Perfume>) {
  const perfume = findPerfume(id);
  if (!perfume) return null;
  if (input.name !== undefined) perfume.name = String(input.name).trim().slice(0, 120);
  if (input.brand !== undefined) perfume.brand = String(input.brand).trim().slice(0, 120);
  if (input.price !== undefined) perfume.price = Number(input.price);
  if (input.category !== undefined) perfume.category = normalizeCategory(input.category);
  if (input.description !== undefined) perfume.description = String(input.description).trim().slice(0, 1000);
  if (input.image !== undefined) perfume.image = String(input.image).trim().slice(0, 1000);
  return perfume;
}

export function deletePerfume(id: string) {
  const index = perfumes.findIndex((perfume) => perfume.id === id);
  if (index === -1) return false;
  perfumes.splice(index, 1);
  return true;
}

export function createContact(input: Partial<ContactMessage>) {
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim();
  const message = String(input.message ?? "").trim();
  if (!name || !email.includes("@") || message.length < 5) return null;
  const contact: ContactMessage = {
    id: crypto.randomUUID(),
    name: name.slice(0, 100),
    email: email.slice(0, 200),
    message: message.slice(0, 1000),
    createdAt: new Date().toISOString(),
  };
  contacts.unshift(contact);
  return contact;
}
