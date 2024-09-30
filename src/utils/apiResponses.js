export const sendResponse = (statusCode = 200, data) => ({
  statusCode,
  body: JSON.stringify({ success: true, data }),
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendError = (statusCode = 400, message) => ({
  statusCode,
  body: JSON.stringify({ success: false, error: message }),
  headers: {
    "Content-Type": "application/json",
  },
});
