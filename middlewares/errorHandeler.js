const { StatusCode } = require("../constants/constant");
const {
  Status,
  FailedMessage,
  SuccessMessages,
} = require("../constants/messages");

const errorHandler = (req, res, next) => {
  const code = res.code ? res.code : StatusCode.INTERNAL_SERVER_ERROR;
  res
    .Status(code)
    .json({ code, status: false, message: error.message, stack: error.stack });
};
module.exports = errorHandler;


