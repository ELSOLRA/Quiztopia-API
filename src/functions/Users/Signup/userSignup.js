import middy from "@middy/core";
import { signupUser } from "../../../services/userService";
import { sendError, sendSuccessResponse } from "../../../utils/apiResponses";
import { validationMiddleware } from "../../../middleware/validation";
import { registerSchema } from "../../../utils/validationUtils";

const signupHandler = async (event) => {
  try {
    const { username, password } = event.body;
    const user = await signupUser(username, password);

    return sendSuccessResponse(201, {
      message: `User ${user.username} created successfully`,
    });
  } catch (error) {
    if (error.message === "Username already exists") {
      return sendError(409, "Username already exists");
    }
    if (error.message.includes("Database error")) {
      return sendError(500, "Failed to create user due to a database error");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(signupHandler).use(
  validationMiddleware(registerSchema)
);
