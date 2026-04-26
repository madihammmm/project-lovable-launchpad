import floralImage from "@/assets/perfume-card-floral.jpg";
import freshImage from "@/assets/perfume-card-fresh.jpg";
import luxuryImage from "@/assets/perfume-card-luxury.jpg";
import oudImage from "@/assets/perfume-card-oud.jpg";
import sweetImage from "@/assets/perfume-card-sweet.jpg";

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

const PERFUMES_KEY = "dreamscents_perfumes";
const CONTACTS_KEY = "dreamscents_contacts";

export const categories: PerfumeCategory[] = ["Floral", "Oud", "Fresh", "Luxury", "Sweet"];

export const defaultPerfumes: Perfume[] = [
  { id: "moonlit-peony", name: "Moonlit Peony", brand: "DreamScents Atelier", price: 89, category: "Floral", description: "Velvet peony, white musk, and sugared rose wrapped in a soft lavender haze.", image: floralImage, createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "royal-oud-veil", name: "Royal Oud Veil", brand: "Nocturne Maison", price: 145, category: "Oud", description: "A luminous oud blend with saffron, amber resin, and midnight vanilla.", image: oudImage, createdAt: "2026-01-02T00:00:00.000Z" },
  { id: "sky-mist-neroli", name: "Sky Mist Neroli", brand: "Aurelia Bloom", price: 72, category: "Fresh", description: "Airy neroli, pear blossom, and rain-kissed citrus for an effortless daytime aura.", image: freshImage, createdAt: "2026-01-03T00:00:00.000Z" },
  { id: "pearl-fantasy", name: "Pearl Fantasy", brand: "DreamScents Atelier", price: 168, category: "Luxury", description: "Iris powder, champagne petals, and creamy sandalwood with a couture finish.", image: luxuryImage, createdAt: "2026-01-04T00:00:00.000Z" },
  { id: "blush-macaron", name: "Blush Macaron", brand: "Sucre Lune", price: 64, category: "Sweet", description: "Raspberry cream, almond sugar, and vanilla cloud for a delicious romantic trail.", image: sweetImage, createdAt: "2026-01-05T00:00:00.000Z" },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(key);
  if (!stored) return fallback;
  try { return JSON.parse(stored) as T; } catch { return fallback; }
}

function write<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

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
  if (name.length > 120 || brand.length > 120 || description.length > 1000 || image.length > 1000) return "Some fields are too long.";
  return null;
}

export function listPerfumes() {
  const perfumes = read<Perfume[] | null>(PERFUMES_KEY, null);
  if (perfumes) return perfumes;
  write(PERFUMES_KEY, defaultPerfumes);
  return defaultPerfumes;
}

export function createPerfume(input: Partial<Perfume>) {
  const perfumes = listPerfumes();
  const perfume: Perfume = {
    id: `perfume-${Date.now()}`,
    name: String(input.name ?? "").trim().slice(0, 120),
    brand: String(input.brand ?? "").trim().slice(0, 120),
    price: Number(input.price),
    category: normalizeCategory(input.category),
    description: String(input.description ?? "").trim().slice(0, 1000),
    image: String(input.image ?? "").trim().slice(0, 1000),
    createdAt: new Date().toISOString(),
  };
  write(PERFUMES_KEY, [perfume, ...perfumes]);
  return perfume;
}

export function updatePerfume(id: string, input: Partial<Perfume>) {
  const perfumes = listPerfumes();
  const updated = perfumes.map((perfume) => perfume.id === id ? { ...perfume, ...input, price: Number(input.price ?? perfume.price), category: normalizeCategory(input.category ?? perfume.category) } : perfume);
  write(PERFUMES_KEY, updated);
  return updated.find((perfume) => perfume.id === id) ?? null;
}

export function deletePerfume(id: string) {
  const perfumes = listPerfumes();
  write(PERFUMES_KEY, perfumes.filter((perfume) => perfume.id !== id));
}

export function createContact(input: Partial<ContactMessage>) {
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim();
  const message = String(input.message ?? "").trim();
  if (!name || !email.includes("@") || message.length < 5) return null;
  const contact: ContactMessage = { id: `contact-${Date.now()}`, name: name.slice(0, 100), email: email.slice(0, 200), message: message.slice(0, 1000), createdAt: new Date().toISOString() };
  write(CONTACTS_KEY, [contact, ...read<ContactMessage[]>(CONTACTS_KEY, [])]);
  return contact;
}