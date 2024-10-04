import middy from "@middy/core";
import { addQuestion } from "../../../services/quizService";
import { sendError, sendSuccessResponse } from "../../../utils/apiResponses";
import { authMiddleware } from "../../../middleware/auth";
import { validationMiddleware } from "../../../middleware/validation";
import { addQuestionSchema } from "../../../utils/validationUtils";

const addQuestionToQuiz = async (event) => {
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
    const updatedQuiz = await addQuestion(quizId, userId, questionData);
    return sendSuccessResponse(200, { quiz: updatedQuiz });
  } catch (error) {
    console.error("Error adding question:", error);
    if (error.message.includes("Unauthorized")) {
      return sendError(403, error.message);
    }
    return sendError(500, "Could not add question");
  }
};

export const handler = middy(addQuestionToQuiz)
  .use(authMiddleware())
  .use(validationMiddleware(addQuestionSchema));
