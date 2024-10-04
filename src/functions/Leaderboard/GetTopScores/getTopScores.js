import middy from "@middy/core";
import { getTopScores } from "../../../services/leaderboardService";
import { sendError, sendResponse } from "../../../utils/apiResponses";

const getTopScoresHandler = async (event) => {
  try {
    const quizId = event.pathParameters.quizId;
    const limit = event.queryStringParameters?.limit
      ? parseInt(event.queryStringParameters.limit)
      : 10;

    const topScoresList = await getTopScores(quizId, limit);
    return sendResponse(200, { topScores: topScoresList });
  } catch (error) {
    if (error.message === "Quiz not found") {
      return sendError(404, "Quiz not found");
    }
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error: failed to retrieve top scores");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(getTopScoresHandler);
