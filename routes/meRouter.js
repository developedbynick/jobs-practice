const router = require("express").Router();
const protect = require("../middlewares/protect");
const userController = require("../controllers/userController");
// Middleware
router.use(protect);
// Routes
router.get("/", userController.attachUserId, userController.getUser);
router.patch("/change-password", userController.changePassword);
module.exports = router;
