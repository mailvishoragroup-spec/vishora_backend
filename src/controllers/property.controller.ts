import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import Property from "../models/Property.model";
import { Request, Response, NextFunction } from "express";


export const createProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      description,
      price,
      location,
      city,
      type,
      bedrooms,
      bathrooms,
      area,
      images,
    } = req.body;

    if (!title || !price || !location || !city || !type || !area) {
      throw new ApiError(400, "Required fields missing");
    }
    if (!req.admin) {
      throw new ApiError(401, "Not authorized");
    }

    const property = await Property.create({
      ...req.body,
      createdBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      property,
    });
  },
);




export const getProperties = asyncHandler(async (req:Request, res:Response) => {
  const {
    page = "1",
    limit = "10",
    search,
    city,
    type,
    minPrice,
    maxPrice,
  } = req.query;

  const query: any = {};

  // 🔍 Search
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // 📍 Filters
  if (city) query.city = city;
  if (type) query.type = type;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // 📄 Pagination
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const total = await Property.countDocuments(query);

  const properties = await Property.find(query)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    page: pageNumber,
    limit: limitNumber,
    total,
    totalPages: Math.ceil(total / limitNumber),
    properties,
  });
});



export const updateProperty = asyncHandler(async (req:Request, res:Response) => {
  const { id } = req.params;

  if (!req.admin) {
    throw new ApiError(401, "Not authorized");
  }

  const property = await Property.findById(id);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  const isOwner =
    property.createdBy.toString() === req.admin._id.toString();

  const isSuperAdmin = req.admin.role === "super_admin";

  // 🔐 Authorization
  if (!isOwner && !isSuperAdmin) {
    throw new ApiError(403, "You cannot update this property");
  }

  // 📝 Update fields
  Object.assign(property, req.body);

  await property.save();

  res.status(200).json({
    success: true,
    message: "Property updated successfully",
    property,
  });
});



export const deleteProperty = asyncHandler(async (req:Request, res:Response) => {
  const { id } = req.params;

  if (!req.admin) {
    throw new ApiError(401, "Not authorized");
  }

  const property = await Property.findById(id);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  const isOwner =
    property.createdBy.toString() === req.admin._id.toString();

  const isSuperAdmin = req.admin.role === "super_admin";

  // 🔐 Authorization
  if (!isOwner && !isSuperAdmin) {
    throw new ApiError(403, "You cannot delete this property");
  }

  await property.deleteOne();

  res.status(200).json({
    success: true,
    message: "Property deleted successfully",
  });
});


export const getPropertyById = asyncHandler(async (req:Request, res:Response) => {
  const { id } = req.params;

  const property = await Property.findById(id).populate(
    "createdBy",
    "name email role"
  );

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  res.status(200).json({
    success: true,
    property,
  });
});