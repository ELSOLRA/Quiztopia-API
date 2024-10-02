import vine, { errors } from "@vinejs/vine";

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
  quizId: vine.string().required(),
  question: vine.string().minLength(5).maxLength(300),
  answer: vine.string().minLength(1).maxLength(100),
  location: vine.object({
    lat: vine.number().min(-90).max(90),
    long: vine.number().min(-180).max(180),
  }),
});

export const scoreSchema = vine.object({
  score: vine.number().min(0),
});

export const validate = async (schema, data) => {
  try {
    const validator = vine.compile(schema);
    return await validator.validate(data);
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR)
      throw new Error(error.messages.join(", "));
    throw error;
  }
};
