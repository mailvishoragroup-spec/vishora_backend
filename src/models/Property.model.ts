import mongoose, { Document, Schema } from "mongoose";


export type PropertyType =
  | "apartment"
  | "flat"
  | "villa"
  | "bungalow"
  | "plot"
  | "land"
  | "commercial";


export type PropertyStatus = "available" | "sold" | "rented";


export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  type: PropertyType;
  status: PropertyStatus;

  bedrooms: number;
  bathrooms: number;
  area: number;

  images: string[];

  amenities: string[];

  isHotDeal: boolean;
  isFeatured: boolean;

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
      index: true, // 🔥 faster search
    },

    type: {
      type: String,
      enum: [
        "apartment",
        "flat",
        "villa",
        "bungalow",
        "plot",
        "land",
        "commercial",
      ],
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
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

    amenities: [
      {
        type: String,
      },
    ],

    // 🔥 Highlight Fields
    isHotDeal: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

// 🔥 Index for performance
PropertySchema.index({ price: 1 });
PropertySchema.index({ city: 1, type: 1 });

const Property = mongoose.model<IProperty>("Property", PropertySchema);

export default Property;