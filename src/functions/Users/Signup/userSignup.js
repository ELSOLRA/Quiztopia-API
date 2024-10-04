import middy from "@middy/core";
import { signupUser } from "../../../services/userService";
import {
  sendError,
  sendResponse,
  sendSuccessResponse,
} from "../../../utils/apiResponses";
import { validationMiddleware } from "../../../middleware/validation";
import { registerSchema } from "../../../utils/validationUtils";

const register = async (event) => {
  try {
    const { username, password } = event.body;
    const user = await signupUser(username, password);

    return sendSuccessResponse(201, { userId: user.userId });
  } catch (error) {
    if (error.message === "Username already exists") {
      return sendError(409, "Username already exists");
    }
    /*     if (error instanceof SyntaxError) {
      return sendError(400, "Invalid JSON in request body");
    } */
    return sendError(500, error.message);
  }
};

export const handler = middy(register).use(
  validationMiddleware(registerSchema)
);
