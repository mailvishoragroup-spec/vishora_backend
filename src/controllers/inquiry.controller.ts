import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { sendEmail } from "../utils/sendEmail";
import { Request, Response, NextFunction } from "express";

export const submitInquiry = asyncHandler(async (req:Request, res:Response) => {
  const { name, email, phone, budget, requirement } = req.body;

  if (!name || !email || !phone) {
    throw new ApiError(400, "Required fields missing");
  }

  // 📧 Email to YOU (admin)
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

  // 📧 Auto Reply to USER
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

  res.status(200).json({
    success: true,
    message: "Inquiry submitted successfully",
  });
});