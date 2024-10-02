import { v4 as uuid } from "uuid";
import * as dynamoDbUtils from "../utils/dynamoDbUtils";
import { getUserById } from "./userService";

const quizTable = process.env.QUIZ_TABLE;

export const createQuiz = async (userId, quizName) => {
  try {
    const quizId = uuid();

    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const quiz = {
      quizId,
      userId,
      quizName,
      createdBy: {
        userId,
        username: user.username,
      },
      questions: [],
      createdAt: new Date().toISOString(),
    };

    await dynamoDbUtils.putItem(quizTable, quiz);
    return quiz;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw new Error("Failed to create quiz");
  }
};

export const getAllQuizzes = async () => {
  const params = { TableName: quizTable };
  const result = await dynamoDbUtils.scan(params);

  /*   const quizzesWithUserName = await Promise.all(
    result.Items.map(async (quiz) => {
      try {
        const user = await getUserById(quiz.userId);
        return {
          ...quiz,
          createdBy: user ? user.username : "-",
        };
      } catch (error) {
        console.error(`Error fetching quiz -${quiz.quizId}:`, error);
        return {
          ...quiz,
          createdBy: "-",
        };
      }
    })
  );

  return quizzesWithUserName; */
  return result.Items;
};

export const getQuizById = async (quizId /* , userId */) => {
  const result = await dynamoDbUtils.getItem(quizTable, { quizId });
  if (!result.Item) {
    return null;
  }
  /*   if (result.Item.userId !== userId) {
    return null;
  } */
  return result.Item;
};

export const getQuizzesByUserId = async (userId) => {
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

  const result = await dynamoDbUtils.query(params);
  return result.Items;
};

export const addQuestion = async (quizId, userId, questionData) => {
  const quiz = await getQuizById(quizId);
  if (!quiz || quiz.createdBy.userId !== userId) {
    throw new Error(
      "Unauthorized to modify this quiz, you can only modify your own quiz"
    );
  }

  const newQuestion = {
    id: uuid(),
    ...questionData,
    createdAt: new Date().toISOString(),
  };
  // list_append (operand, operand) - evaluates to a list with a new element added to it.
  // if_not_exists (path, operand) - if the item does not contain an attribute at the specified path, then if_not_exists evaluates to operand; otherwise, it evaluates to path.
  /* 
  if questions exists: it will append the new question to the existing list. 
  if questions does not exist: it will initialize questions as an empty array ([]) and then append the new question.
  */
  const updateExpression =
    "SET questions = list_append(if_not_exists(questions, :empty_list), :question)";
  const attributeValues = {
    ":question": [newQuestion],
    ":empty_list": [],
  };

  const result = await dynamoDbUtils.updateItem(
    quizTable,
    { quizId },
    updateExpression,
    attributeValues
  );

  return result.Attributes;
};

export const deleteQuiz = async (quizId, userId) => {
  const quiz = await getQuizById(quizId);
  if (!quiz || quiz.userId !== userId) {
    throw new Error(
      "Unauthorized to delete this quiz. You can only delete your own quizzes"
    );
  }
  const result = await dynamoDbUtils.deleteItem(quizTable, { quizId });
  return result.Attributes;
};
