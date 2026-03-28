import mongoose, { Document, Schema } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  type: "apartment" | "villa" | "plot";
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  createdBy: mongoose.Types.ObjectId;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["apartment", "villa", "plot"],
      required: true,
    },

    bedrooms: {
      type: Number,
      default: 0,
    },

    bathrooms: {
      type: Number,
      default: 0,
    },

    area: {
      type: Number,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model<IProperty>("Property", PropertySchema);

export default Property;