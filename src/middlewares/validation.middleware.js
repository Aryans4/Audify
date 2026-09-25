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
    .withMessage("Username must be a string")
    .isLength({min:3,max:30})
    .withMessage("username must be between 3 and 30 characters long"),

    body("email")
    .isEmail()
    .withMessage("Invalid Email Address"),

    body("password")
    .isLength({min:6})
    .withMessage("Password must be atleast 6 characters long"),

    body("role")
    .optional()
    .isIn(["user", "artist"])
    .withMessage("Role must be either 'user' or 'artist'"),
    validateRegistration
]
module.exports={registerUserValidationRules}