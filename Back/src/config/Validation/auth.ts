import Joi from "joi";

export const AuthSchema = Joi.object({
  username: Joi.string().required().min(3).max(20),
  password: Joi.string().required().min(3).max(20),
});
