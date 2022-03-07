/* *    Explanations   *
 * This file is for creating and getting comments for a job.

 * We will be finding/posting documents with the "jobId".
 * Without the "jobId" we would not be able to get comments for a specific job.
 * We would also not have a way of telling what job the comment belongs to without the "jobId"

 *
 */
const router = require("express").Router({ mergeParams: true });
const restrictTo = require("../middlewares/restrictTo");
const protect = require("../middlewares/protect");
const commentController = require("../controllers/commentController");
router.use(protect);
router
  .route("/")
  .get(commentController.getComments)
  .post(
    restrictTo("user"),
    commentController.populatePostBody,
    commentController.createComment
  );

module.exports = router;
