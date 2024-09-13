import express from "express";

const reviewRoutr = express.Router();
import { authenticateUser } from "../middleware/authentication";

import * as Controllers from "../controllers/reviewController";

reviewRoutr.route("/").post(authenticateUser, Controllers.createReview).get(Controllers.getAllReviews);

reviewRoutr
  .route("/:id")
  .get(Controllers.getSingleReview)
  .patch(authenticateUser, Controllers.updateReview)
  .delete(authenticateUser, Controllers.deleteReview);

export default reviewRoutr;
