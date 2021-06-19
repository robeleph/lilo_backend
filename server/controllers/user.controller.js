const UserService = require("../services/user.service");
const ResponsesUtil = require("../utils/response.util");

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
}

module.exports = userRouteController;