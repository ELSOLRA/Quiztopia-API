import { sendError } from "../utils/apiResponses";
import { validate } from "../utils/validationUtils";

export const validationMiddleware = (schema) => ({
  before: async (handler) => {
    try {
      handler.event.body = await validate(schema, handler.event.body);
    } catch (error) {
      return sendError(400, error.message);
    }
  },
});
