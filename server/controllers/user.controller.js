const UserService = require("../services/user.service");
const ResponsesUtil = require("../utils/response.util");
const User = require("../models/user.model");
const NodeMailer = require("../config/nodemailer.config");
const bcrypt = require("bcrypt");

const RESPONSE_UTIL = new ResponsesUtil();

class userRouteController {
  static async signUp(req, res) {
    try {
      const USER_RESPONSE = await UserService.registerUser(req);
      if (USER_RESPONSE) {
        RESPONSE_UTIL.setSuccess(
          200,
          "User Registered Successfully!",
          USER_RESPONSE
        );
      }
      return RESPONSE_UTIL.send(res);
    } catch (error) {
      RESPONSE_UTIL.setError(400, error);
      return RESPONSE_UTIL.send(res);
    }
  }
  static async login(req, res) {
    User.findOne({
      email: req.body.email,
    }).then(async (user) => {
      if (user && user.status == "PENDING") {
        NodeMailer.sendConfirmationEmail(user);
        RESPONSE_UTIL.setSuccess(200, "Please Verify Account", user);
        return RESPONSE_UTIL.send(res);
      } else if (user) {
        bcrypt.compare(req.body.password, user.password).then((res) => {
          if (res) {
            // res = user;
            res.status(200).send("Login Successful!");
            // RESPONSE_UTIL.setSuccess(200, "Login Successful", user);
            // return RESPONSE_UTIL.send(res);
          }
          RESPONSE_UTIL.setError(404, error);
          return RESPONSE_UTIL.send(res);
        });
      } else {
        RESPONSE_UTIL.setError(404, error);
        // return RESPONSE_UTIL.send(res);
      }
    });
  }
  static async confirmUser(req, res, next) {
    User.findOne({
      token: req.params.confirmationCode,
    })
      .then(async (user) => {
        if (!user) {
          RESPONSE_UTIL.setError(404, error);
          return RESPONSE_UTIL.send();
        }
        user.status = "ACTIVE";
        user = await user.save();
        RESPONSE_UTIL.setSuccess(200, "Verification Successful!", user);
        return RESPONSE_UTIL.send(res);
      })
      .catch((e) => console.log("error", e));
  }
}

module.exports = userRouteController;
