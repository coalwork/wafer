import { default as Joi, ExternalValidationFunction } from 'joi';

import User from '../schemas/User';

export const userNameRegex = /^[a-zA-Z0-9-_() ]+$/;

const uniqueName: ExternalValidationFunction = async (name, helpers) => {
  try {
    if (!(await User.exists({ name }))) return;
    return helpers.message({ '*': `a user with the name "${name}" already exists` });
  }
  catch(error) {
    throw Error();
  }
}

const uniqueEmail: ExternalValidationFunction = async (email, helpers) => {
  try {
    if (!email) return;
    if (!(await User.exists({ email }))) return;
    return helpers.message({ '*': `a user has already registered under "${email}"` });
  }
  catch(error) {
    throw Error();
  }
}

export const schema = Joi.object({
  username: Joi.string()
  .required()
  .$
  .min(3)
  .max(20)
  .message('usernames must be 3 to 20 characters in length')
  .pattern(userNameRegex)
  .external(uniqueName)
  .messages({
    'any.required': 'a username must be provided',
    'string.pattern.base': 'usernames must consist of only letters, numbers, underscores (_), dashes (-), parentheses, or spaces',
  }),

  password: Joi.string()
  .required()
  .$
  .min(6)
  .max(30)
  .message('passwords must be 6 to 30 characters in length')
  .pattern(/[!-~]/)
  .messages({
    'any.required': 'a password must be provided',
    'string.pattern.base': 'passwords may only contain letters, numbers, and punctuation (ASCII codes 33-126)'
  }),

  email: Joi.string()
  .optional()
  .allow('')
  .email()
  .message('emails must be valid')
  .external(uniqueEmail)
});

export default function validator(user: object) {
  return schema.validateAsync(user, { abortEarly: false });
}
