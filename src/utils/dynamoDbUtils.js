import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import dynamoDb from "../services/dynamoDb";

const TableName = process.env.QUIZ_TABLE;

export const putItem = async (item) => {
  const command = new PutCommand({
    TableName,
    Item: item,
  });
  return dynamoDb.send(command);
};

export const getItem = async (key) => {
  const command = new GetCommand({
    TableName,
    Key: key,
  });
  return dynamoDb.send(command);
};

export const query = async (params) => {
  const command = new QueryCommand({
    TableName,
    ...params,
  });
  return dynamoDb.send(command);
};

export const updateItem = async (key, updateExpression, attributeValues) => {
  const command = new UpdateCommand({
    TableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: attributeValues,
    ReturnValues: "ALL_NEW",
  });
  return dynamoDb.send(command);
};

export const deleteItem = async (key) => {
  const command = new DeleteCommand({
    TableName,
    Key: key,
  });
  return dynamoDb.send(command);
};
