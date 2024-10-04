import { sendError } from "../utils/apiResponses";
import { validate } from "../utils/validationUtils";

export const validationMiddleware = (schema) => ({
  before: async (handler) => {
    try {
      // parsing the body if it's a string, otherwise using it as is
      const body =
        typeof handler.event.body === "string"
          ? JSON.parse(handler.event.body)
          : handler.event.body;

      // body validation
      const validatedBody = await validate(schema, body);
      // replacing the original body with the validated body
      handler.event.body = validatedBody;
    } catch (error) {
      try {
        const errorMessages = JSON.parse(error.message);
        // formats error messages into a single string
        const formattedError = errorMessages
          .map((err) => `${err.field}: ${err.message}`)
          .join(". ");
        return sendError(400, `Validation failed. ${formattedError}`);
      } catch {
        //  parsing fails, it's not a validation error then
        return sendError(400, error.message);
      }
    }
  },
});
