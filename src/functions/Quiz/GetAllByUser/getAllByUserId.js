import middy from "@middy/core";
import { getAllQuizzes } from "../../../services/quizService";
import { sendError, sendResponse } from "../../../utils/apiResponses";

const getAllByUserId = async (event) => {
  try {
    const userId = event.pathParameters.userId;
    console.log("userid in path:", userId);

    if (!userId) {
      return sendError(400, "Missing required path parameter: userId");
    }
    const quizzes = await getAllQuizzes(userId);
    return sendResponse(200, { quizzes });
  } catch (error) {
    console.error("error getting quizzes", error.message);
    return sendError(500, "Could not retrieve quizzes");
  }
};

export const handler = middy(getAllByUserId);
