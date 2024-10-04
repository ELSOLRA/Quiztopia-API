import middy from "@middy/core";
import { getQuizById } from "../../../services/quizService";
import { sendError, sendResponse } from "../../../utils/apiResponses";

const getQuizHandler = async (event) => {
  try {
    const quizId = event.pathParameters.quizId;
    if (!quizId) {
      return sendError(400, "Missing quizId ");
    }
    const quiz = await getQuizById(quizId);
    return sendResponse(200, quiz);
  } catch (error) {
    console.error(`Error getting ${quizId} quiz:`, error);
    if (error.message === "Quiz not found") {
      return sendError(404, "Quiz not found");
    }
    if (error.message.includes("Failed to retrieve")) {
      return sendError(500, "Database error: Could not retrieve quiz");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(getQuizHandler);
