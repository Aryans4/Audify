const userModel = require("../models/user.model.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const crypto = require("node:crypto")
const {
    isEmailConfigured,
    sendPasswordResetEmail
} = require("../services/email.service")

const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000
const AUTH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

function getJwtSecret() {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is required")
    }
    return process.env.JWT_SECRET
}

function createAuthToken(user) {
    return jwt.sign({
        id: user._id.toString(),
        role: user.role,
        tokenVersion: user.tokenVersion || 0
    }, getJwtSecret(), { expiresIn: "7d" })
}

function setAuthCookie(res, token) {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: AUTH_TOKEN_TTL_MS,
        path: "/"
    })
}

function publicUser(user) {
    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
    }
}

async function registerUser(req, res) {
    const { password, role = "user" } = req.body
    const username = req.body.username.trim()
    const email = req.body.email.trim().toLowerCase()

    const existingUser = await userModel.findOne({
        $or: [
            { username },
            { email: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } }
        ]
    })

    if (existingUser) {
        return res.status(409).json({ message: "Username or email is already in use" })
    }

    let user
    try {
        user = await userModel.create({
            username,
            password: await bcrypt.hash(password, 12),
            email,
            role: role === "artist" ? "artist" : "user"
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Username or email is already in use" })
        }
        throw error
    }
    const token = createAuthToken(user)

    setAuthCookie(res, token)
    return res.status(201).json({
        message: "Registration successful",
        token,
        user: publicUser(user)
    })
}

async function loginUser(req, res) {
    const identifier = req.body.username.trim()
    const escapedIdentifier = identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const user = await userModel.findOne({
        $or: [
            { username: identifier },
            { email: { $regex: `^${escapedIdentifier}$`, $options: "i" } }
        ]
    })

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(401).json({ message: "Invalid username/email or password" })
    }

    const token = createAuthToken(user)
    setAuthCookie(res, token)
    return res.status(200).json({
        message: "Login successful",
        token,
        user: publicUser(user)
    })
}

async function requestPasswordReset(req, res) {
    if (!isEmailConfigured()) {
        return res.status(503).json({
            message: "Password reset email is not configured. Please contact support."
        })
    }

    const email = req.body.email.trim().toLowerCase()
    const user = await userModel.findOne({ email: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } })

    if (user) {
        const token = crypto.randomBytes(32).toString("hex")
        user.passwordResetTokenHash = crypto.createHash("sha256").update(token).digest("hex")
        user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_TTL_MS)
        await user.save()

        const frontendUrl = process.env.FRONTEND_URL || "https://audify-music.netlify.app"
        const resetUrl = new URL("/", frontendUrl)
        resetUrl.searchParams.set("resetToken", token)

        try {
            await sendPasswordResetEmail({ to: user.email, resetUrl: resetUrl.toString() })
        } catch (error) {
            user.passwordResetTokenHash = undefined
            user.passwordResetExpires = undefined
            await user.save()
            console.error("Password reset email delivery failed:", error.message)
            return res.status(502).json({
                message: "Unable to send the password reset email. Please try again later."
            })
        }
    }

    return res.status(200).json({
        message: "If an account exists for that email, a password reset link has been sent."
    })
}

async function resetPassword(req, res) {
    const tokenHash = crypto.createHash("sha256").update(req.body.token).digest("hex")
    const user = await userModel.findOneAndUpdate({
        passwordResetTokenHash: tokenHash,
        passwordResetExpires: { $gt: new Date() }
    }, {
        $set: { password: await bcrypt.hash(req.body.password, 12) },
        $unset: { passwordResetTokenHash: 1, passwordResetExpires: 1 },
        $inc: { tokenVersion: 1 }
    }, {
        new: true,
        runValidators: true
    })

    if (!user) {
        return res.status(400).json({ message: "This password reset link is invalid or has expired" })
    }

    user.password = await bcrypt.hash(req.body.password, 12)
    user.passwordResetTokenHash = undefined
    user.passwordResetExpires = undefined
    user.tokenVersion = (user.tokenVersion || 0) + 1
    await user.save()

    return res.status(200).json({
        message: "Password reset successful. Please sign in with your new password."
    })
}

async function getCurrentUser(req, res) {
    return res.status(200).json({ user: req.user })
}

function logOut(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    })
    return res.status(200).json({ message: "Logout successful" })
}

module.exports = {
    registerUser,
    loginUser,
    requestPasswordReset,
    resetPassword,
    getCurrentUser,
    logOut
}