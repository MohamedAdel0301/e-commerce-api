import { errorHandlerMiddleware } from "./middleware/error-handler";
import { connectDB } from "./db/db-connect";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { notFound as NotFoundMiddleware } from "./middleware/not-found";
import morgan from "morgan";
import cookieParser from "cookie-parser";

require("express-async-errors"); //to simplify try/catch for all controllers
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

import { authRouter } from "./routes/authRouter";

app.use(morgan("tiny"));
app.use(express.json()); //access json data in req.body
app.use(cookieParser(process.env.JWT_SECRET)); //parse & sign cookies
app.get("/", (req: Request, res: Response) => {
  res.send("E-commerce api");
});

app.get("/api/v1/auth", (req: Request, res: Response) => {
  console.log(req.signedCookies);
  res.send("e-commerce-api");
});

app.use("/api/v1/auth", authRouter);

app.use(NotFoundMiddleware);
app.use(errorHandlerMiddleware); //catch errors if not 404

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_STRING!);
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
