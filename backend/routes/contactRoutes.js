import express from "express";
import mongoose from "mongoose";
import Contact from "../models/Contact.js";

const router = express.Router();
const memoryContacts = [];
const usingMongo = () => mongoose.connection.readyState === 1;

router.post("/", async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email?.includes("@") || !message || message.length < 5) {
      return res.status(400).json({ error: "Valid name, email, and message are required." });
    }
    if (usingMongo()) return res.status(201).json({ success: true, contact: await Contact.create({ name, email, message }) });
    const contact = { id: Date.now().toString(), name, email, message, createdAt: new Date().toISOString() };
    memoryContacts.unshift(contact);
    res.status(201).json({ success: true, contact });
  } catch (error) { next(error); }
});

export default router;
