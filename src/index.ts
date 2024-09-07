import { errorHandlerMiddleware } from "./middleware/error-handler";
import { connectDB } from "./db/db-connect";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { notFound as NotFoundMiddleware } from "./middleware/not-found";
import morgan from "morgan";
require("express-async-errors"); //to simplify try/catch for all controllers

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(morgan("tiny"));

app.use(express.json()); //access json data in req.body

app.get("/", (req: Request, res: Response) => {
  res.send("E-commerce api");
});

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
