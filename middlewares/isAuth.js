const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");
const { StatusCode } = require("../constants/constant");
const { FailedMessage, SuccessMessages } = require("../constants/messages");

const isAuth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .send({ message: FailedMessage.TOKEN_IS_REQUIRED });
    }

    const tokenParts = authorization.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res
        .status(StatusCode.BAD_REQUEST)
        .send({ message: FailedMessage.INVALID_TOKEN });
    }

    const token = tokenParts[1];
    const payload = jwt.verify(token, jwtSecret);

    if (!payload) {
      return res
        .status(StatusCode.UNAUTHORIZED)
        .send({ message: FailedMessage.USER_UNAUTHORIZED });
    }

    req.user = {
      _id: payload._id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (error) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports = isAuth;
