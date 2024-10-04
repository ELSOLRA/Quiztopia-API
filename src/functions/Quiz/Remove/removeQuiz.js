import middy from "@middy/core";
import { deleteQuiz, getQuizById } from "../../../services/quizService";
import { sendError, sendSuccessResponse } from "../../../utils/apiResponses";
import { authMiddleware } from "../../../middleware/auth";

const remove = async (event) => {
  try {
    const quizId = event.pathParameters.quizId;
    const userId = event.userId;

    const deletedQuiz = await deleteQuiz(quizId, userId);
    return sendSuccessResponse(200, {
      message: `Quiz ${deletedQuiz.quizName} with quizId:${deletedQuiz.quizId} deleted successfully`,
    });
  } catch (error) {
    if (error.message.includes("Quiz not found")) {
      return sendError(404, error.message);
    }
    if (error.message.includes("Unauthorized")) {
      return sendError(403, error.message);
    }
    if (error.message.includes("Failed to delete")) {
      return sendError(500, "Database error: failed to delete");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(remove).use(authMiddleware());
