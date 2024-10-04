import middy from "@middy/core";
import { updateLeaderboard } from "../../../services/leaderboardService";
import { sendError, sendSuccessResponse } from "../../../utils/apiResponses";
import { validationMiddleware } from "../../../middleware/validation";
import { scoreSchema } from "../../../utils/validationUtils";

const updateLeaderboardHandler = async (event) => {
  try {
    const { quizId, userId, score } = event.body;

    const result = await updateLeaderboard(quizId, userId, score);
    return sendSuccessResponse(200, {
      // message: "Leaderboard updated successfully",
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
      return sendError(409, "current leaderboard entry has a higher score");
    }
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error: failed to update leaderboard");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(updateLeaderboardHandler).use(
  validationMiddleware(scoreSchema)
);
