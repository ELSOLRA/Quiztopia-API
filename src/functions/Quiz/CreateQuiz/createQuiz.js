import middy from "@middy/core";
import { createQuiz } from "../../../services/quizService";
import { sendError, sendResponse } from "../../../utils/apiResponses";
import { authMiddleware } from "../../../middleware/auth";
import { validationMiddleware } from "../../../middleware/validation";
import { quizNameSchema } from "../../../utils/validationUtils";

const create = async (event) => {
  try {
    const { quizName } = JSON.parse(event.body);
    const userId = event.userId;
    if (!userId) {
      return sendError(401, "Unauthorized");
    }
    const quiz = await createQuiz(userId, quizName);
    return sendResponse(201, { quizId: quiz.quizId, quizName: quiz.quizName });
  } catch (error) {
    console.error("Error creating quiz:", error);
    if (error.message === "User not found") {
      return sendError(404, "User not found");
    }
    return sendError(500, `Couldn't create ${quizName} quiz `);
  }
};

export const handler = middy(create)
  .use(authMiddleware())
  .use(validationMiddleware(quizNameSchema));
