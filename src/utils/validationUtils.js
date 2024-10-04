import vine, { errors } from "@vinejs/vine";

// Defining different schemas for validation

export const registerSchema = vine.object({
  username: vine.string().alphaNumeric().minLength(3).maxLength(30),
  password: vine.string().minLength(3).maxLength(30),
});

export const loginSchema = vine.object({
  username: vine.string(),
  password: vine.string(),
});

export const quizNameSchema = vine.object({
  quizName: vine.string().minLength(3).maxLength(100),
});

export const addQuestionSchema = vine.object({
  quizId: vine.string(),
  question: vine.string().minLength(5).maxLength(300),
  answer: vine.string().minLength(1).maxLength(100),
  location: vine.object({
    lat: vine.number().min(-90).max(90),
    long: vine.number().min(-180).max(180),
  }),
});

export const scoreSchema = vine.object({
  quizId: vine.string(),
  score: vine.number().min(0),
});

//validation function for all schemas
export const validate = async (schema, data) => {
  try {
    const validator = vine.compile(schema);
    const validatedData = await validator.validate(data);
    return validatedData;
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      throw new Error(JSON.stringify(error.messages));
    }
    throw error;
  }
};
