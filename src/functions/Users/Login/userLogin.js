import middy from "@middy/core";
import { loginUser } from "../../../services/userService";
import { sendError, sendResponse } from "../../../utils/apiResponses";
import { validationMiddleware } from "../../../middleware/validation";
import { loginSchema } from "../../../utils/validationUtils";

const login = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);
    const data = await loginUser(username, password);
    return sendResponse(200, { token: data.token, userId: data.user.userId });
  } catch (error) {
    return sendError(401, error.message);
  }
};

export const handler = middy(login).use(validationMiddleware(loginSchema));
