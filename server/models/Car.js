import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const carSchema = new mongoose.Schema(
  {
    owner: { type: ObjectId, ref: "User", required: true },

    brand: { type: String, required: true },
    model: { type: String, required: true },
    image: { type: String, required: true },

    year: { type: Number, required: true },
    category: { type: String, required: true },

    // ✅ FIXED (NUMBER)
    seating_capacity: { type: Number, required: true },

    fuel_type: { type: String, required: true },
    transmission: { type: String, required: true },

    price_per_day: { type: Number, required: true },

    // ✅ STANDARD FIELD (KEEP THIS ONLY)
    isAvailable: { type: Boolean, default: true },

    location: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
export default Car;