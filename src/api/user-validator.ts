import Joi from 'joi';

export const userNameRegex = /^[a-zA-Z0-9-_() ]+$/;

export const schema = Joi.object({
  name: Joi.string()
  .required()
  .min(3)
  .max(20)
  .pattern(userNameRegex),

  pass: Joi.string()
  .required()
  .min(6)
  .max(30)
  .pattern(/[!-~]/),

  email: Joi.string()
  .email()
});

export default function validator(user: object) {
  return schema.validate(user, { abortEarly: false });
}
