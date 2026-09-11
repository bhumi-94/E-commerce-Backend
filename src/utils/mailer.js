const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const info = await transporter.sendMail({
      from: `"Nexora" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Reset your Nexora password",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          background-color: #fcfbf8;
        ">
          <div style="
            background-color: white;
            padding: 35px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          ">

            <h1 style="color: #8b3905; margin-bottom: 10px;">
              Nexora
            </h1>

            <h2>Reset Your Password</h2>

            <p>
              We received a request to reset your Nexora account password.
            </p>

            <p>
              Click the button below to create a new password.
            </p>

            <div style="margin: 30px 0;">
              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  padding: 14px 24px;
                  background-color: #8b3905;
                  color: white;
                  text-decoration: none;
                  border-radius: 10px;
                  font-weight: bold;
                "
              >
                Reset Password
              </a>
            </div>

            <p>
              This link will expire in
              <strong>15 minutes</strong>.
            </p>

            <p>
              If you did not request a password reset,
              you can safely ignore this email.
            </p>

            <hr style="
              border: none;
              border-top: 1px solid #eee;
              margin: 30px 0;
            " />

            <p style="color: #777; font-size: 13px;">
              © Nexora E-commerce
            </p>

          </div>
        </div>
      `,
    });

    return info;
  } catch (error) {
    console.error("EMAIL SENDING ERROR:", error);
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail,
};

