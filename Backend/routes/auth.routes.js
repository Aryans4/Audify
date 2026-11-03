const express = require('express')
const router = express.Router()
const authController = require("../controllers/auth.controller")
const { authUser } = require("../middlewares/auth.middleware")
const { rateLimit } = require("express-rate-limit")
const {
    registerUserValidationRules,
    loginValidationRules,
    passwordResetRequestValidationRules,
    passwordResetValidationRules
} = require("../middlewares/validation.middleware")

const authRateLimit = (limit, message) => rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message }
})

router.post("/register", authRateLimit(10, "Too many registration attempts. Please try again later."), registerUserValidationRules, authController.registerUser)
router.post("/login", authRateLimit(10, "Too many sign-in attempts. Please try again later."), loginValidationRules, authController.loginUser)
router.post("/forgot-password", authRateLimit(5, "Too many password reset requests. Please try again later."), passwordResetRequestValidationRules, authController.requestPasswordReset)
router.post("/reset-password", authRateLimit(10, "Too many password reset attempts. Please try again later."), passwordResetValidationRules, authController.resetPassword)
router.get("/me", authUser, authController.getCurrentUser)
router.post("/logout",authController.logOut)


module.exports = router