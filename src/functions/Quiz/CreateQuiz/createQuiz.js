import middy from "@middy/core";
import { createQuiz } from "../../../services/quizService";
import { sendError, sendSuccessResponse } from "../../../utils/apiResponses";
import { authMiddleware } from "../../../middleware/auth";
import { validationMiddleware } from "../../../middleware/validation";
import { quizNameSchema } from "../../../utils/validationUtils";

const createHandler = async (event) => {
  try {
    const { quizName } = event.body;
    const userId = event.userId;
    if (!userId) {
      return sendError(401, "Unauthorized");
    }
    const quiz = await createQuiz(userId, quizName);
    return sendSuccessResponse(201, {
      quizId: quiz.quizId,
      quizName: quiz.quizName,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    if (error.message === "User not found") {
      return sendError(404, "User not found");
    }
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error: failed to create quiz");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(createHandler)
  .use(authMiddleware())
  .use(validationMiddleware(quizNameSchema));
