import middy from "@middy/core";
import { getAllQuizzes } from "../../../services/quizService";

const getAllByUserId = async (event) => {
  try {
    const quizzes = await getAllQuizzes(event.userId);
    return sendResponse(200, { quizzes });
  } catch (error) {
    console.error("error getting quizzes", error);
    return sendError(500, "Could not retrieve quizzes");
  }
};

export const handler = middy(getAllByUserId);
