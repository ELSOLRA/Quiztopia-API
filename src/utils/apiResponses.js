import { error } from "console";

export const sendResponse = (statusCode = 200, data) => ({
  statusCode,
  body: JSON.stringify(data),
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendError = (statusCode = 400, message) => ({
  statusCode,
  body: JSON.stringify({ error: message }),
  headers: {
    "Content-Type": "application/json",
  },
});
