import mongoose, { Types } from "mongoose";

interface ReviewDocument extends Document {
  rating: number;
  title: string;
  comment: string;
  user: Types.ObjectId;
  product: Types.ObjectId;
}

const ReviewSchema = new mongoose.Schema<ReviewDocument>(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);
ReviewSchema.index({ product: 1, user: 1 }, { unique: true }); //setup a compound index

export const Review = mongoose.model("Review", ReviewSchema);
