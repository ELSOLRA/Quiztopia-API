import middy from "@middy/core";
import { getTopScores } from "../../../services/leaderboardService";
import { sendResponse } from "../../../utils/apiResponses";

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
      return sendError(404, error.message);
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(getTopScoresHandler);
