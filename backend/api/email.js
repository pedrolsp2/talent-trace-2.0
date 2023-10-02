import express from "express"
import bodyParser from "body-parser"
import nodemailer from "nodemailer"

const app = express()

app.use(bodyParser.json())

app.post("/api/send-email", async (req, res) => {
  const { email, subject, message } = req.body

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "YOUR_EMAIL@gmail.com",
      pass: "YOUR_PASSWORD",
    },
  })

  const mailOptions = {
    from: "YOUR_EMAIL@gmail.com",
    to: email,
    subject: subject,
    text: message,
  }

  try {
    await transporter.sendMail(mailOptions)
    res.json({ success: true })
  } catch (error) {
    res.json({ success: false })
  }
})

app.listen(3001, () => {
  console.log("Server started on port 3001")
})
