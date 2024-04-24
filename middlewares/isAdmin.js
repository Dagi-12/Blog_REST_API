const { StatusCode } = require("../constants/constant");
const { FailedMessage, SuccessMessages } = require("../constants/messages");

const isAdmin = (req, res, next) => {
  try {
    if (req.user && (req.user.role === 1 || req.user.role === 2)) {
      next();
    } else {
      return res
        .status(StatusCode.UNAUTHORIZED)
        .send({ message: FailedMessage.USER_UNAUTHORIZED });
    }
  } catch (error) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: FailedMessage.INTERNAL_SERVER_ERROR });
  }
};

module.exports = isAdmin;
