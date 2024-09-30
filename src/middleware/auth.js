import { sendError } from "../utils/apiResponses";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = () => ({
  before: async (handler) => {
    const authHeader = handler.event.headers.Authorization;
    try {
      if (!authHeader) {
        throw new Error(error.message);
      }
      const token = authHeader.replace("Bearer ", "").trim(); // eller split(' ')[1];
      const decodedData = verifyToken(token);

      handler.event.userId = decodedData.userId;
    } catch (error) {
      return sendError(401, "Invalid token");
    }
  },
});
