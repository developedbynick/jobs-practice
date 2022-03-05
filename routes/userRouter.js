const router = require("express").Router();
const authController = require("../controllers/authController");
router.post("/sign-up", authController.signup);
router.post("/login", authController.login);

// Email
router.patch("/verify-email/:otp", authController.verifyEmail);
router.post("/resend-code", authController.resendEmailVerificationCode);

module.exports = router;
