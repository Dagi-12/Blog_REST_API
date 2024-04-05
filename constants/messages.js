const SuccessMessages = {
  SAVE_SUCCESS: "Saved successfully",
  USER_CREATED_SUCCESS: "user created successfully",
  DELETE_SUCCESS: "Deleted successfully",
  UPDATE_SUCCESS: "Updated successfully",
  LOGIN_SUCCESS: "logged In successfully",
  LOGOUT_SUCESS: "Logged out successfully",
  PASSWORD_CHANGE_SUCCESS: "Password changed successfully",
};
const FailedMessage = {
  INTERNAL_SERVER_ERROR: "Internal server error",
  NOT_FOUND: "Not Found",
  MISSING_QUERY_PARAMS:"Missing query parameters"
};


const Status = {
  SUCCESS:"success",
  FAILED:"failed"
}
module.exports = {
  SuccessMessages,
  FailedMessage,
  Status,
};
