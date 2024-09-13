import express, { Request, Response } from "express";
import "express-async-errors"; //to simplify try/catch for all controllers
import { errorHandlerMiddleware } from "./middleware/error-handler";
import { connectDB } from "./db/db-connect";
import dotenv from "dotenv";
import { notFound as NotFoundMiddleware } from "./middleware/not-found";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter, userRouter, productRouter } from "./routes";
import helmet from "helmet";
// @ts-ignore
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import fileUpload from "express-fileupload";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(morgan("tiny"));
app.use(express.json()); //access json data in req.body
app.use(cookieParser(process.env.JWT_SECRET)); //parse & sign cookies

app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req: Request, res: Response) => {
  res.send("E-commerce api");
});

app.get("/api/v1/auth", (req: Request, res: Response) => {
  console.log(req.signedCookies);
  res.send("e-commerce-api");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

app.use(NotFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_STRING!);
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
