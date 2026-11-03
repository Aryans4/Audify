const express = require('express')
const router = express.Router()
const authController = require("../controllers/auth.controller")
const {registerUserValidationRules}=require("../middlewares/validation.middleware")

router.post("/register", registerUserValidationRules, authController.registerUser)
router.post('/login',authController.loginUser)
router.post("/logout",authController.logOut)


module.exports = router