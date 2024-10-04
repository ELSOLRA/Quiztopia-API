import middy from "@middy/core";
import { addQuestion } from "../../../services/quizService";
import { sendError, sendSuccessResponse } from "../../../utils/apiResponses";
import { authMiddleware } from "../../../middleware/auth";
import { validationMiddleware } from "../../../middleware/validation";
import { addQuestionSchema } from "../../../utils/validationUtils";

const addQuestionHandler = async (event) => {
  try {
    const { quizId, question, answer, location } = event.body;
    const userId = event.userId;

    if (!quizId || !question || !answer) {
      return sendError(
        400,
        "Missing required fields: quizId, question or answer"
      );
    }

    const questionData = { question, answer, location };
    const { createdAt, ...updatedQuiz } = await addQuestion(
      quizId,
      userId,
      questionData
    );

    return sendSuccessResponse(200, { quiz: updatedQuiz });
  } catch (error) {
    if (error.message.includes("Quiz not found")) {
      return sendError(404, "Quiz not found or invalid quizId");
    }
    if (error.message.includes("Unauthorized")) {
      return sendError(403, "Unauthorized to modify this quiz");
    }
    if (error.message.includes("Failed to add")) {
      return sendError(500, "Database error: could not add question to quiz");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(addQuestionHandler)
  .use(authMiddleware())
  .use(validationMiddleware(addQuestionSchema));
