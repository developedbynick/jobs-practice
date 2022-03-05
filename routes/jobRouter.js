const router = require("express").Router();
const jobController = require("../controllers/jobController");
const requestBodyFilter = require("../middlewares/requestFilter");
const protect = require("../middlewares/protect");
const restrictTo = require("../middlewares/restrictTo");
const Job = require("../models/jobModel");
const checkIfAuthor = require("../middlewares/checkIfAuthor");
router
  .route("/")
  .get(jobController.getAllJobs)
  .post(
    protect,
    restrictTo("employer"),
    requestBodyFilter("active", "createdAt"),
    jobController.createJob
  );
// router.use(protect);
router.route("/:id").get(jobController.getOne);
router
  .route("/:id")
  .patch(
    protect,
    requestBodyFilter("active", "createdAt"),
    restrictTo("employer", "admin"),
    checkIfAuthor(Job),
    jobController.updateOne
  )
  .delete(
    protect,
    restrictTo("employer", "admin"),
    checkIfAuthor(Job),
    jobController.deleteJob
  );

module.exports = router;
