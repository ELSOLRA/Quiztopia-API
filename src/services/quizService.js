import { v4 as uuid } from "uuid";
import * as dynamoDbUtils from "../utils/dynamoDbUtils";
import { getUserById } from "./userService";

const quizTable = process.env.QUIZ_TABLE;

export const createQuiz = async (userId, quizName) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const quizId = uuid();

  const quiz = {
    quizId,
    quizName,
    userId,
    username: user.username,
    questions: [],
    createdAt: new Date().toISOString(),
  };

  try {
    await dynamoDbUtils.putItem(quizTable, quiz);
    return quiz;
  } catch (error) {
    throw new Error("Database error: failed to create quiz");
  }
};

export const getAllQuizzes = async () => {
  const params = { TableName: quizTable };
  const result = await dynamoDbUtils.scan(params);

  return result.Items;
};

export const getQuizById = async (quizId /* , userId */) => {
  try {
    const result = await dynamoDbUtils.getItem(quizTable, { quizId });
    if (!result.Item) {
      throw new Error("Quiz not found");
    }
    return result.Item;
  } catch (error) {
    if (error.message === "Quiz not found") {
      throw error;
    }
    throw new Error("Failed to retrieve quiz from database");
  }
};

export const getQuizzesByUserId = async (userId) => {
  const userIdIndex = "UserIdIndex";
  console.log("Quiz Table:", quizTable);
  console.log("UserID Index:", userIdIndex);
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const params = {
    TableName: quizTable,
    IndexName: "UserIdIndex",
    // The condition that specifies the key values for items to be retrieved
    // The condition must perform an equality test on a single partition key value.
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };
  console.log("Query Params:", JSON.stringify(params, null, 2));
  try {
    const result = await dynamoDbUtils.query(params);
    console.log("Query Result:", JSON.stringify(result, null, 2));
    return result.Items;
  } catch (error) {
    throw new Error("Database error: failed to retrieve quizzes from database");
  }
};

export const addQuestion = async (quizId, userId, questionData) => {
  const quiz = await getQuizById(quizId);
  if (!quiz) {
    throw new Error("Quiz not found or invalid quizId");
  }
  if (quiz.userId !== userId) {
    throw new Error(
      "Unauthorized to modify this quiz, you can only modify your own quiz"
    );
  }

  const newQuestion = {
    id: uuid(),
    ...questionData,
  };

  const params = {
    TableName: quizTable,
    Key: { quizId },
    // list_append (operand, operand) - evaluates to a list with a new element added to it.
    // if questions exists: it will append the new question to the existing list.
    // if questions does not exist: it will initialize questions as an empty array ([]) and then append the new question.
    UpdateExpression:
      "SET questions = list_append(if_not_exists(questions, :empty_list), :question)",
    ExpressionAttributeValues: {
      ":question": [newQuestion],
      ":empty_list": [],
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDbUtils.updateItem(params);

    return result.Attributes;
  } catch (error) {
    throw new Error("Database error: failed to add question to quiz");
  }
};

export const deleteQuiz = async (quizId, userId) => {
  const quiz = await getQuizById(quizId);
  if (!quiz) {
    throw new Error("Quiz not found or invalid quizId");
  }
  if (quiz.userId !== userId) {
    throw new Error(
      "Unauthorized to delete this quiz. You can only delete your own quizzes"
    );
  }
  try {
    const result = await dynamoDbUtils.deleteItem(quizTable, { quizId });
    return result.Attributes;
  } catch (error) {
    throw new Error("Failed to delete quiz from database");
  }
};
