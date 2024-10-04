import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import * as dynamoDbUtils from "../utils/dynamoDbUtils";
import { generateToken } from "../utils/jwt";

const usersTable = process.env.USERS_TABLE;

export const getUserByUsername = async (username) => {
  try {
    const params = {
      TableName: usersTable,
      IndexName: "UsernameIndex",
      KeyConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": username,
      },
    };

    const result = await dynamoDbUtils.query(params);
    return result.Items[0] || null;
  } catch (error) {
    throw new Error("error fetching user by username");
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await dynamoDbUtils.getItem(usersTable, { userId });
    return user.Item || null;
  } catch (error) {
    throw new Error("Database error: error fetching user by id");
  }
};

export const signupUser = async (username, password) => {
  const userId = uuid();
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUsername = await getUserByUsername(username);

  if (existingUsername) {
    throw new Error("Username already exists");
  }

  const user = {
    userId,
    username,
    password: hashedPassword,
  };
  try {
    await dynamoDbUtils.putItem(usersTable, user);
    return user;
  } catch (error) {
    throw new Error("Database error: failed to create user");
  }
};

export const loginUser = async (username, password) => {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const token = generateToken(user.userId);
  return { user, token };
};
