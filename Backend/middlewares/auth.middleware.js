const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const MAX_LEGACY_TOKEN_AGE_SECONDS = 7 * 24 * 60 * 60

async function authenticate(req, res, next, allowedRoles) {
    const authorization = req.headers.authorization
    const token = req.cookies?.token || (
        authorization?.startsWith("Bearer ") ? authorization.slice(7) : null
    )

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded.exp && (!decoded.iat || decoded.iat < Date.now() / 1000 - MAX_LEGACY_TOKEN_AGE_SECONDS)) {
            return res.status(401).json({ message: "Invalid or expired token" })
        }
        const user = await userModel.findById(decoded.id).select("username email role tokenVersion")

        if (!user || (decoded.tokenVersion || 0) !== (user.tokenVersion || 0)) {
            return res.status(401).json({ message: "Your session is no longer valid. Please sign in again." })
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: "Unauthorized" })
        }

        req.user = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role
        }
        return next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Invalid or expired token" })
        }
        return next(error)
    }
}

function authArtist(req, res, next) {
    return authenticate(req, res, next, ["artist"])
}

function authUser(req, res, next) {
    return authenticate(req, res, next, ["user", "artist"])
}

module.exports = { authArtist, authUser }