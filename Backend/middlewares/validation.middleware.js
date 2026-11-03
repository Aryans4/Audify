const {body,validationResult}=require("express-validator")



function validateRegistration(req, res, next) {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({ message: error.array() })
    }
    next()
}

const registerUserValidationRules=[
    body("username")
    .isString()
    .trim()
    .withMessage("Username must be a string")
    .isLength({min:3,max:30})
    .withMessage("username must be between 3 and 30 characters long"),

    body("email")
    .isString()
    .trim()
    .customSanitizer(value => value.toLowerCase())
    .isEmail()
    .withMessage("Invalid Email Address"),

    body("password")
    .isString()
    .isLength({min:8,max:72})
    .withMessage("Password must be between 8 and 72 characters long")
    .custom(value => Buffer.byteLength(value, "utf8") <= 72)
    .withMessage("Password must be no more than 72 bytes"),

    body("role")
    .optional()
    .isIn(["user", "artist"])
    .withMessage("Role must be either 'user' or 'artist'"),
    validateRegistration
]

const loginValidationRules = [
    body("username")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Enter your username or email"),

    body("password")
    .isString()
    .notEmpty()
    .withMessage("Enter your password"),
    validateRegistration
]

const passwordResetRequestValidationRules = [
    body("email")
    .isString()
    .trim()
    .customSanitizer(value => value.toLowerCase())
    .isEmail()
    .withMessage("Enter a valid email address"),
    validateRegistration
]

const passwordResetValidationRules = [
    body("token")
    .isString()
    .isHexadecimal()
    .isLength({min:64,max:64})
    .withMessage("Invalid or expired reset link"),

    body("password")
    .isString()
    .isLength({min:8,max:72})
    .withMessage("Password must be between 8 and 72 characters long")
    .custom(value => Buffer.byteLength(value, "utf8") <= 72)
    .withMessage("Password must be no more than 72 bytes"),
    validateRegistration
]

module.exports = {
    registerUserValidationRules,
    loginValidationRules,
    passwordResetRequestValidationRules,
    passwordResetValidationRules
}