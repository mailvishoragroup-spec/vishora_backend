import mongoose, { Document, Schema } from "mongoose";

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  budget?: string;
  requirement?: string;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    budget: String,
    requirement: String,
  },
  { timestamps: true }
);

const Inquiry = mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;