const SuccessMessages = {
  SAVE_SUCCESS: "Saved successfully",
  USER_CREATED_SUCCESS: "user created successfully",
  USER_FETCHED_SUCCESS: "User fetched successfully ",
  DELETE_SUCCESS: "Deleted successfully",
  UPDATE_SUCCESS: "Updated successfully",
  LOGIN_SUCCESS: "logged In successfully",
  LOGOUT_SUCESS: "Logged out successfully",
  PASSWORD_CHANGE_SUCCESS: "Password changed successfully",
  USER_VERIFIED_SUCCESSFULLY: "User verified successfully ",
  VERIFICATION_CODE_SENT_SUCCESSFULLY:
    "User verification code sent successfully",
  FORGOT_PASSWORD_CODE_SENT: "Forgot password code sent successfully",
  PASSWORD_RECOVERED_SUCCESSFULLY: "Password recovered successfully",
  USER_PROFILE_UPDATED_SUCCESSFULLY: "User profile updated successfully",
  CATEGORY_ADDED_SUCCESSFULLY: "Category added successfully ",
  CATEGORY_UPDATED_SUCCESSFULLY: "Category updated successfully",
  CATEGORY_DELETED_SUCCESSFULLY: "Category deleted successfully",
  CATEGORY_LIST_FETCHED_SUCCESSFULLY: "Category list fetched successfully ",
  POST_CREATED_SUCCESSFULLY: "Post created successfully",
  POST_UPDATED_SUCCESSFULLY: "Post updated successfully ",
  POST_DELETED_SUCCESSFULLY:"Post deleted successfully",
  POST_FETCHED_SUCCESSFULLY:"Post fetched successfully",
  FILE_UPLOADED_SUCCESSFULLY:"File uploaded successfully"
};
const FailedMessage = {
  INTERNAL_SERVER_ERROR: "Internal server error",
  NOT_FOUND: "Not Found",
  MISSING_QUERY_PARAMS: "Missing query parameters",
  USER_UNAUTHENTICATED: "user unauthenticated ",
  USER_NOT_FOUND: "User Not Found",
  USER_IS_ALREADY_VERIFIED: "User is Already Verified",
  INVALID_FORGOT_PASSWORD_CODE: "Invalid forget password code",
  INVALID_PASSWORD:"Invalid password",
  TOKEN_IS_REQUIRED: "token is required",
  SOMETHING_WENT_WRONG:"Something  went wrong",
  AUTHORIZATION_FAILED:"Not Authorized to make a request",
  INVALID_TOKEN: "Invalid token",
  USER_UNAUTHORIZED: "User Unauthorized",
  OLD_PASSWORD_DOES_NOT_MATCH: "Old Password Does not match",
  SAME_OLD_AND_NEW_PASSWORD: "You are providing the same old and new password ",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  CATEGORY_ALREADY_EXISTS: "Category already exists",
  CATEGORY_NOT_FOUND: "Category not found",
  TITLE_ALREADY_EXISTS: "Title Already Exists",
  FILE_NOT_FOUND: "File not found",
  POST_NOT_FOUND: "Post not found",
};

const EmailMessages = {
  VERIFY_YOUR_ACCOUNT: "verify your account",
  CHANGE_YOUR_PASSWORD: "Change your password",
  EMAIL_VERIFICATION_CODE: "Email verification code",
};

const Status = {
  SUCCESS: "success",
  FAILED: "failed",
};
module.exports = {
  SuccessMessages,
  FailedMessage,
  Status,
  EmailMessages,
};
