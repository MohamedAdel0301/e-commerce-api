import { Request, Response } from "express";
import { Product } from "../models/Product";
import { StatusCodes } from "http-status-codes";
import { CustomErrors } from "../errors";
import { MAX_SIZE } from "../constants";
import path from "path";

export const createProduct = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new CustomErrors.UnauthorizedError(
      "Not authorized to make this request"
    );
  }
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

export const getSingleProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id }).populate('reviews');
  if (!product) {
    throw new CustomErrors.NotFoundError("Product not found");
  }
  return res.status(StatusCodes.OK).json({ product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    runValidators: true,
    new: true,
  });
  if (!product) {
    return new CustomErrors.NotFoundError("Product not found");
  }
  return res.status(StatusCodes.OK).json({ product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  if (!product) {
    return new CustomErrors.NotFoundError("Product not found");
  }
  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Successfully deleted product" });
};

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.files) {
    throw new CustomErrors.BadRequestError("No files specified");
  }

  const productImage = req.files.image;
  if (Array.isArray(productImage)) {
    productImage.forEach((file) => {
      if (!file.mimetype.startsWith("image")) {
        throw new CustomErrors.BadRequestError("Invalid file type");
      }
    });
  } else {
    if (!productImage.mimetype.startsWith("image")) {
      throw new CustomErrors.BadRequestError("Invalid file type");
    } else {
      if (productImage.size > MAX_SIZE) {
        throw new CustomErrors.BadRequestError("Image must be less than 1MB");
      } else {
        const imagePath = path.join(
          __dirname,
          "../public/uploads." + `${productImage.name}`
        );
        await productImage.mv(imagePath);
        return res
          .status(StatusCodes.OK)
          .json({ msg: "Successfully uploaded image" });
      }
    }
  }
};
