import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

// 🔐 Role Types
export enum AdminRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
}

// 🧾 Interface
export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
  comparePassword(password: string): Promise<boolean>;
}

// 📦 Schema
const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: Object.values(AdminRole),
      default: AdminRole.ADMIN,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

AdminSchema.pre("save", async function (this: IAdmin) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

AdminSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
