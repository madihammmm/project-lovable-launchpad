import express from "express";
import mongoose from "mongoose";
import Perfume from "../models/Perfume.js";

const router = express.Router();
const categories = ["Floral", "Oud", "Fresh", "Luxury", "Sweet"];
const memoryPerfumes = [
  { id: "1", name: "Moonlit Peony", brand: "DreamScents Atelier", price: 89, category: "Floral", description: "Velvet peony, white musk, and sugared rose.", image: "", createdAt: new Date().toISOString() },
  { id: "2", name: "Royal Oud Veil", brand: "Nocturne Maison", price: 145, category: "Oud", description: "Oud, saffron, amber resin, and midnight vanilla.", image: "", createdAt: new Date().toISOString() },
];

function usingMongo() {
  return mongoose.connection.readyState === 1;
}

function validate(body) {
  if (!body.name || !body.brand || !body.description) return "Name, brand, and description are required.";
  if (!Number.isFinite(Number(body.price)) || Number(body.price) <= 0) return "Price must be a positive number.";
  if (!categories.includes(body.category)) return "Category must be Floral, Oud, Fresh, Luxury, or Sweet.";
  return null;
}

router.get("/", async (_req, res, next) => {
  try {
    if (usingMongo()) return res.json({ perfumes: await Perfume.find().sort({ createdAt: -1 }) });
    res.json({ perfumes: memoryPerfumes });
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const perfume = usingMongo() ? await Perfume.findById(req.params.id) : memoryPerfumes.find((p) => p.id === req.params.id);
    if (!perfume) return res.status(404).json({ error: "Perfume not found" });
    res.json({ perfume });
  } catch (error) { next(error); }
});

router.post("/", async (req, res, next) => {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    if (usingMongo()) return res.status(201).json({ perfume: await Perfume.create(req.body) });
    const perfume = { id: Date.now().toString(), ...req.body, price: Number(req.body.price), createdAt: new Date().toISOString() };
    memoryPerfumes.unshift(perfume);
    res.status(201).json({ perfume });
  } catch (error) { next(error); }
});

router.put("/:id", async (req, res, next) => {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    if (usingMongo()) {
      const perfume = await Perfume.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!perfume) return res.status(404).json({ error: "Perfume not found" });
      return res.json({ perfume });
    }
    const index = memoryPerfumes.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Perfume not found" });
    memoryPerfumes[index] = { ...memoryPerfumes[index], ...req.body, price: Number(req.body.price) };
    res.json({ perfume: memoryPerfumes[index] });
  } catch (error) { next(error); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (usingMongo()) {
      const perfume = await Perfume.findByIdAndDelete(req.params.id);
      if (!perfume) return res.status(404).json({ error: "Perfume not found" });
      return res.json({ success: true });
    }
    const index = memoryPerfumes.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Perfume not found" });
    memoryPerfumes.splice(index, 1);
    res.json({ success: true });
  } catch (error) { next(error); }
});

export default router;
