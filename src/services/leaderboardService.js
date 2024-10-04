import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import * as dynamoDbUtils from "../utils/dynamoDbUtils";
import { getQuizById } from "./quizService";
import { getUserById } from "./userService";

const leaderboard = process.env.LEADERBOARD_TABLE;

export const updateLeaderboard = async (quizId, userId, score) => {
  const quiz = await getQuizById(quizId);
  if (!quiz) {
    throw new Error("Quiz not found");
  }

  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  /*   const entryToLeaderboard = {
    quizId,
    player: {
      userId,
      username: user.username,
    },
    score,
  };

  const params = {
    TableName: leaderboard,
    Item: entryToLeaderboard,
    //  a condition that must be satisfied in order for a conditional PutItem operation to succeed.
    ConditionExpression:
      "attribute_not_exists(quizId) OR attribute_not_exists(score) OR :newScore > score",
    ExpressionAttributeValues: {
      ":newScore": score,
    },
  };
 */
  const params = {
    TableName: leaderboard,
    Key: {
      quizId,
      userId,
    },
    UpdateExpression: "SET score = :score, username= :username",
    ConditionExpression: "attribute_not_exists(score) OR :score > score",
    ExpressionAttributeValues: {
      ":score": score,
      ":username": user.username,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    /*       await dynamoDbUtils.putItemWithParams(params);
    return entryToLeaderboard; */
    const result = await dynamoDbUtils.updateItemWithParams(params);
    return result.Attributes;
  } catch (error) {
    //  if a condition specified in the operation could not be evaluated.
    if (error instanceof ConditionalCheckFailedException) {
      throw new Error("current leaderboard entry has a higher score");
    }
    throw new Error("Database error: failed to update leaderboard");
  }
};

export const getTopScores = async (quizId, limit) => {
  const quiz = await getQuizById(quizId);
  if (!quiz) {
    throw new Error("Quiz not found");
  }
  const params = {
    TableName: leaderboard,
    IndexName: "ScoreIndex",
    KeyConditionExpression: "quizId = :quizId",
    ExpressionAttributeValues: {
      ":quizId": quizId,
    },
    //   reads the results in reverse order by sort key value
    ScanIndexForward: false,
    //   result can be limited (number)
    Limit: limit,
  };
  try {
    const result = await dynamoDbUtils.query(params);
    return result.Items;
  } catch (error) {
    throw new Error("Database error: failed to retrieve top scores");
  }
};
