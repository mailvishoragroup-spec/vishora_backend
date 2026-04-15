import mongoose, { Document, Schema } from "mongoose";

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  budget?: string;
  requirement?: string;
  status: "new" | "contacted" | "closed"; // ✅ added
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    budget: String,
    requirement: String,

    // 🔥 NEW FIELD
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;