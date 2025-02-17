const express = require("express");
const router = express.Router();

const { login, signUp, sendOtp } = require("../controller/Auth");
const { resetPassword, resetPasswordToken } = require("../controller/ResetPassword");
const { auth } = require("../middleware/auth");

router.post("/login", login);
router.post("/signup", signUp);
router.post("/sendOtp", sendOtp);

router.post("/reset-password-token", resetPasswordToken);
router.put("/reset-password", resetPassword);

module.exports = router;
