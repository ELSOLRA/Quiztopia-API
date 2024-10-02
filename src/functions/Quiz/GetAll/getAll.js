import middy from "@middy/core";
import { getAllQuizzes } from "../../../services/quizService";
import { sendError, sendResponse } from "../../../utils/apiResponses";

const getAll = async () => {
  try {
    const quizzes = await getAllQuizzes();
    return sendResponse(200, { quizzes });
  } catch (error) {
    console.error("error getting quizzes", error);
    return sendError(500, "Could not retrieve quizzes");
  }
};

export const handler = middy(getAll);
