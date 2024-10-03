export const sendResponse = (
  statusCode,
  data
) /* (statusCode, data, addSuccess=true) */ => ({
  //   const responseBody = addSuccess ? { success: true, ...data } : data;
  statusCode,
  body: JSON.stringify({ success: true, ...data }),
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendError = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify({ success: false, error: message }),
  headers: {
    "Content-Type": "application/json",
  },
});
