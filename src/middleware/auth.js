import { sendError } from "../utils/apiResponses";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = () => ({
  before: async (handler) => {
    const authHeader =
      handler.event.headers.Authorization ||
      handler.event.headers.authorization;
    try {
      if (!authHeader) {
        throw new Error(error.message);
      }
      const token = authHeader.replace("Bearer ", "").trim();

      const decodedData = verifyToken(token);

      handler.event.userId = decodedData.userId;
    } catch (error) {
      return sendError(401, "Invalid token");
    }
  },
});
