import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { sendEmail } from "../utils/sendEmail";
import { Request, Response, NextFunction } from "express";
import Inquiry from "../models/Inquiry.model";

export const submitInquiry = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, budget, requirement } = req.body;

  if (!name || !email || !phone) {
    throw new ApiError(400, "Required fields missing");
  }

  const inquiry = await Inquiry.create({
    name,
    email,
    phone,
    budget,
    requirement,
  });

  // 📧 2. EMAIL TO ADMIN
  await sendEmail(
    process.env.EMAIL_USER!,
    "New Property Inquiry",
    `
    <h2>New Inquiry Received</h2>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Budget:</b> ${budget}</p>
    <p><b>Requirement:</b> ${requirement}</p>
    `
  );

  
  await sendEmail(
    email,
    "Thank You for Your Inquiry 🏠",
    `
    <h2>Hi ${name},</h2>
    <p>Thank you for reaching out to <b>Vishora Real Estate</b>.</p>
    <p>We have received your requirement and our team will contact you shortly.</p>

    <br/>
    <p><b>Your Details:</b></p>
    <p>Budget: ${budget}</p>
    <p>Requirement: ${requirement}</p>

    <br/>
    <p>Best Regards,<br/>Vishora Team</p>
    `
  );

  res.status(201).json({
    success: true,
    message: "Inquiry submitted successfully",
    inquiry, // 🔥 return saved data
  });
});


export const getInquiries = asyncHandler(async (req:Request, res:Response) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: inquiries.length,
    inquiries,
  });
});


export const deleteInquiry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const inquiry = await Inquiry.findById(id);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  await inquiry.deleteOne();

  res.status(200).json({
    success: true,
    message: "Inquiry deleted successfully",
  });
});


export const updateInquiryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  // ✅ Validate status
  const validStatus = ["new", "contacted", "closed"];

  if (!validStatus.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const inquiry = await Inquiry.findById(id);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  inquiry.status = status;
  await inquiry.save();

  res.status(200).json({
    success: true,
    message: "Status updated successfully",
    inquiry,
  });
});