import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import * as dynamoDbUtils from "../utils/dynamoDbUtils";

export const signupUser = async (username, password) => {
  const userId = uuid();
  const hashedPassword = await bcrypt.hash(password, 10);
};
