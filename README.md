# Quiztopia

Individuell examination / individual course examination

![Serverless_4.4.0](https://img.shields.io/badge/Serverless_4.4.0-red)

This project is a serverless API for a quiz application. It provides endpoints
for user authentication, quiz management, and quiz interaction. The API is
designed to support front-end applications in creating a full quiz experience.

## Features

- User account creation and login
- Retrieve all quizzes
- Retrieve all quizzes from a specific user
- Retrieve questions for a specific quiz
- Create a new quiz
- Add questions to a quiz
- Delete a quiz
- Leaderboard functionality:
  - Endpoint to register scores for users
  - Endpoint to retrieve top scores and users for each quiz
- Error handling for DynamoDB interactions

## Project Structure

The project is organized as follows:

- **`/src`**: The main source folder containing all application logic.
- **`/src/functions`**: Contains Lambda function handlers
- **`/src/middleware`**: Contains all function folders with functions
- **`/src/services`**: Contains functions with logic and data access for
  interacting with DynamoDB
- **`/src/utils`**: Contains utility functions and helper modules used across
  different parts.
- **`/serverless.yml`**: Contains serverless configuration details
- **`/config`**: Contains configuration files
  - **`/dynamoDb-tables.yml`**: Defines the structure and properties of DynamoDB
    tables used in the project
- **`/package.json`**: Contains project dependencies, scripts

## Dependencies

**List of main dependencies used in the project:**

- aws-sdk/client-dynamodb: 3.658.1
- aws-sdk/lib-dynamodb: 3.658.1
- middy/core: 5.5.0
- vinejs/vine: 2.1.0
- bcryptjs: 2.4.3
- jsonwebtoken: 9.0.2
- uuid: 10.0.0

## API Endpoints

**User**

- **POST `/users`:** Create a new user account
- **POST `/login`:** Authenticate a user and receive a JWT

**Quiz**

- **POST `/quiz`:** Create a new quiz
- **POST `/quiz/question`:** Add a new question to a specific quiz
- **GET `/quiz`:** Retrieve a list of all quizzes
- **GET `/quiz/:quizId`:** Retrieve all questions for a specific quiz
- **GET `/quiz/user/:userId`:** Retrieve all quizzes from a specific user
- **DELETE `/quiz/:quizId`:** Delete a specific quiz

**Leaderboard**

- **POST `/leaderboard`:** Register a user's score for a specific quiz
- **GET `/leaderboard/:quizId`:** Retrieve the top scores and users for a
  specific quiz
