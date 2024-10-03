import middy from "@middy/core";
import { getQuizById } from "../../../services/quizService";
import { sendError, sendResponse } from "../../../utils/apiResponses";

const getQuiz = async (event) => {
  try {
    const quizId = event.pathParameters.quizId;
    const quiz = await getQuizById(quizId);
    if (!quiz) {
      return sendError(404, "Quiz not found");
    }
    return sendResponse(200, quiz);
  } catch (error) {
    console.error(`Error getting ${quizId} quiz:`, error);
    return sendError(500, "Could not retrieve quiz");
  }
};

export const handler = middy(getQuiz);
