const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// get config vars
dotenv.config();

const user = process.env.user;
const pass = process.env.pass;

class NodeMailer {
  static transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: user,
      pass: pass,
    },
  });
  static async sendConfirmationEmail(userModel) {
    NodeMailer.transport
      .sendMail({
        from: user,
        to: userModel.email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
            <h2>Hello ${userModel.firstName}</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <a href=http://localhost:4200/user/confirm/${userModel.token}> Click here</a>
            </div>`,
      })
      .catch((err) => console.log(err));
    return userModel;
  }
}
module.exports = NodeMailer;
