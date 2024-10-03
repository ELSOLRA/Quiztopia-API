import middy from "@middy/core";
import { updateLeaderboard } from "../../../services/leaderboardService";
import { sendError, sendResponse } from "../../../utils/apiResponses";
import { validationMiddleware } from "../../../middleware/validation";
import { scoreSchema } from "../../../utils/validationUtils";

const updateLeaderboardHandler = async (event) => {
  try {
    const { quizId, userId, score } = event.body;

    const result = await updateLeaderboard(quizId, userId, score);
    return sendResponse(200, {
      message: "Leaderboard updated successfully",
      entry: result,
    });
  } catch (error) {
    if (
      error.message === "Quiz not found" ||
      error.message === "User not found"
    ) {
      return sendError(404, error.message);
    }
    if (error.message === "current leaderboard entry has a higher score") {
      return sendError(409, error.message);
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(updateLeaderboardHandler).use(
  validationMiddleware(scoreSchema)
);
