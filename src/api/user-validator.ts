import { default as Joi, ExternalValidationFunction } from 'joi';

import User from '../schemas/User';

export const userNameRegex = /^[a-zA-Z0-9-_() ]+$/;

export const schema = Joi.object({
  username: Joi.string()
  .required()
  .$
  .min(3)
  .max(20)
  .message('usernames must be 3 to 20 characters in length')
  .pattern(userNameRegex)
  .messages({
    'string.empty': 'a username must be provided',
    'string.pattern.base': 'usernames must consist of only letters, numbers, underscores (_), dashes (-), parentheses, or spaces'
  }),

  password: Joi.string()
  .required()
  .$
  .min(6)
  .max(30)
  .message('passwords must be 6 to 30 characters in length')
  .pattern(/[!-~]/)
  .messages({
    'string.empty': 'a password must be provided',
    'string.pattern.base': 'passwords may only contain letters, numbers, and punctuation (ASCII codes 33-126)'
  }),

  email: Joi.string()
  .email()
  .message('emails must be valid')
});

export const uniqueName: ExternalValidationFunction = name => {
  if (!User.exists({ name })) throw Error('non unique username');
  return;
}

export default function validator(user: object) {
  return schema.validate(user, { abortEarly: false });
}
