import middy from "@middy/core";
import { getQuizzesByUserId } from "../../../services/quizService";
import { sendError, sendResponse } from "../../../utils/apiResponses";

const getAllByUserId = async (event) => {
  try {
    const userId = event.pathParameters.userId;
    // console.log("user id in path:", userId);

    if (!userId) {
      return sendError(400, "Missing required path parameter: userId");
    }
    const quizzes = await getQuizzesByUserId(userId);
    return sendResponse(200, { quizzes });
  } catch (error) {
    // console.error("error getting quizzes", error.message);
    if (error.message === "User not found") {
      return sendError(404, "User not found");
    }
    if (error.message.includes("Database error")) {
      return sendError(
        500,
        "Database error: failed to retrieve quizzes from database"
      );
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(getAllByUserId);
