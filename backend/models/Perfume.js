import mongoose from "mongoose";

const perfumeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    brand: { type: String, required: true, trim: true, maxlength: 120 },
    price: { type: Number, required: true, min: 1 },
    category: { type: String, required: true, enum: ["Floral", "Oud", "Fresh", "Luxury", "Sweet"] },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    image: { type: String, trim: true, maxlength: 1000, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model("Perfume", perfumeSchema);
