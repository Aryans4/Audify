const nodemailer = require("nodemailer")

function isEmailConfigured() {
    return ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM_EMAIL"]
        .every(name => Boolean(process.env[name]))
}

async function sendPasswordResetEmail({ to, resetUrl }) {
    if (!isEmailConfigured()) {
        throw new Error("SMTP is not configured")
    }

    const port = Number(process.env.SMTP_PORT || 587)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    })

    await transporter.sendMail({
        from: `"Audify" <${process.env.SMTP_FROM_EMAIL}>`,
        to,
        subject: "Reset your Audify password",
        text: `Use this link to reset your Audify password. It expires in 30 minutes:\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>Use the link below to reset your Audify password. It expires in 30 minutes.</p><p><a href="${resetUrl}">Reset your password</a></p><p>If you did not request this, you can ignore this email.</p>`
    })
}

module.exports = { isEmailConfigured, sendPasswordResetEmail }
