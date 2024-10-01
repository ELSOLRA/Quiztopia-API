import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import dynamoDb from "../services/dynamoDb";

export const putItem = async (tableName, item) => {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  });
  return dynamoDb.send(command);
};

export const getItem = async (tableName, key) => {
  const command = new GetCommand({
    TableName: tableName,
    Key: key,
  });
  return dynamoDb.send(command);
};

export const query = async (params) => {
  const command = new QueryCommand(params);
  return dynamoDb.send(command);
};

export const scan = async (params) => {
  const command = new ScanCommand(params);
  return dynamoDb.send(command);
};

export const updateItem = async (
  tableName,
  key,
  updateExpression,
  attributeValues
) => {
  const command = new UpdateCommand({
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: attributeValues,
    ReturnValues: "ALL_NEW",
  });
  return dynamoDb.send(command);
};

export const deleteItem = async (tableName, key) => {
  const command = new DeleteCommand({
    TableName: tableName,
    Key: key,
  });
  return dynamoDb.send(command);
};
