import middy from "@middy/core";
import { deleteQuiz } from "../../../services/quizService";
import { sendError, sendResponse } from "../../../utils/apiResponses";
import { authMiddleware } from "../../../middleware/auth";

const remove = async (event) => {
  try {
    const { quizId } = event.pathParameters.quizId;
    const userId = event.userId;
    await deleteQuiz(quizId, userId);
    return sendResponse(204, { message: "Quiz deleted successfully" });
  } catch (error) {
    if (error.message.includes("Unauthorized")) {
      return sendError(403, error.message);
    }
    return sendError(500, "Could not delete quiz");
  }
};

export const handler = middy(remove).use(authMiddleware);
