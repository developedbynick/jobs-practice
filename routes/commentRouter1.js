/*      *    Explanations   *
 * This file is for updating and deleting comments.

 * We do not need the "jobId", here because we are just finding and updating/deleting documents.
 * We do not need the "jobId" to perform these actions.
 *
 */
const router = require("express").Router();
const checkIfAuthor = require("../middlewares/checkIfAuthor");
const protect = require("../middlewares/protect");
const requestFilter = require("../middlewares/requestFilter");
const restrictTo = require("../middlewares/restrictTo");
const Comment = require("../models/commentModel");
const commentController = require("../controllers/commentController");
router.use(protect);
// Update
router
  .route("/:id")
  .patch(
    restrictTo("user", "admin"),
    checkIfAuthor(Comment),
    requestFilter("createdAt", "author", "edited", "active", "job"),
    commentController.setEdited,
    commentController.updateComment
  )
  // Delete
  .delete(
    restrictTo("user", "admin"),
    checkIfAuthor(Comment),
    commentController.deleteComment
  );
module.exports = router;
