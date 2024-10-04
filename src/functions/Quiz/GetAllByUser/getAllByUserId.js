import middy from "@middy/core";
import { getQuizzesByUserId } from "../../../services/quizService";
import { sendError, sendResponse } from "../../../utils/apiResponses";

const getAllByUserIdHandler = async (event) => {
  try {
    const userId = event.pathParameters.userId;

    if (!userId) {
      return sendError(400, "Missing required path parameter: userId");
    }
    const quizzes = await getQuizzesByUserId(userId);

    return sendResponse(200, { quizzes });
  } catch (error) {
    if (error.message === "User not found") {
      return sendError(404, "User not found");
    }
    if (error.message.includes("Database error")) {
      return sendError(
        500,
        "Database error: failed to retrieve quizzes from database"
      );
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(getAllByUserIdHandler);
