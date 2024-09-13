import { Review } from "../models/Review";
import { Product } from "../models/Product";
import { StatusCodes } from "http-status-codes";
import { CustomErrors } from "../errors";
import { Request, Response } from "express";
import { getUserPermission } from "../utils/utils";

export const createReview = async (req: Request, res: Response) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new CustomErrors.NotFoundError(`No product with id : ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user!.userId,
  });

  if (alreadySubmitted) {
    throw new CustomErrors.BadRequestError(
      "Already submitted review for this product"
    );
  }

  req.body.user = req.user!.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
export const getAllReviews = async (req: Request, res: Response) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
export const getSingleReview = async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomErrors.NotFoundError(`No review with id ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};
export const updateReview = async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomErrors.NotFoundError(`No review with id ${reviewId}`);
  }

  getUserPermission(
    { userId: req.user!.userId, role: req.user!.role },
    review.user
  );

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};
export const deleteReview = async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomErrors.NotFoundError(`No review with id ${reviewId}`);
  }

  getUserPermission(
    { userId: req.user!.userId, role: req.user!.role },
    review.user
  );
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Review removed" });
};

export const getSingleProductReviews = async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
