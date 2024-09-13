import mongoose, { Document } from "mongoose";
import { UserType } from "./User";

interface ProductDocument extends Document {
  name: string;
  price: number;
  description: string;
  image?: string;
  company: string;
  category: string;
  color: string[];
  featured: boolean;
  freeShipping?: boolean;
  inventory: number;
  averageRating?: number;
  numberOfReviews?: number;
  user: UserType;
}

const ProductSchema = new mongoose.Schema<ProductDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      maxlength: [100, "Name is too long"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description is too long"],
    },
    image: {
      type: String,
      default: "default",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["office", "kitchen"],
    },
    company: {
      type: String,
      required: [true, "Company is required"],
    },
    color: {
      type: [String],
      default: ["#fff"],
      required: true,
    },
    featured: {
      type: Boolean,
      required: true,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 10,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

export const Product = mongoose.model("Product", ProductSchema);
