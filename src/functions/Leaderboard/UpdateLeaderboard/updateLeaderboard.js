import middy from "@middy/core";
import { updateLeaderboard } from "../../../services/leaderboardService";
import { sendError, sendSuccessResponse } from "../../../utils/apiResponses";
import { validationMiddleware } from "../../../middleware/validation";
import { scoreSchema } from "../../../utils/validationUtils";
import { authMiddleware } from "../../../middleware/auth";

// This function can very simply be transformed to work with or without authorization
const updateLeaderboardHandler = async (event) => {
  try {
    const { quizId, score } = event.body;
    const userId = event.userId;
    if (!userId) {
      return sendError(401, "Unauthorized");
    }
    const result = await updateLeaderboard(quizId, userId, score);
    return sendSuccessResponse(200, {
      entry: result,
    });
  } catch (error) {
    if (
      error.message === "Quiz not found" ||
      error.message === "User not found"
    ) {
      return sendError(404, "Quiz or User not found");
    }
    if (error.message.includes("current leaderboard entry")) {
      return sendError(
        409,
        "This user has a higher score entry in leaderboard then this update"
      );
    }
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error: failed to update leaderboard");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(updateLeaderboardHandler)
  .use(authMiddleware())
  .use(validationMiddleware(scoreSchema));
