#!/usr/bin/node

const Joi = require('joi');

async function validateSignUp(username, email, password, securityQuestion) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(12).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().regex(/^[a-zA-Z0-9_.+-]+@(gmail|yahoo)\.com$/).required(),
    securityQuestion: Joi.string().min(3).max(15).required(),
  });
  const data = {
    username,
    email,
    password,
    securityQuestion,
  }
  const result = await schema.validate(data);

  if (result.error) {
    return result.error.details[0].path[0];
  } else {
    return true;
  }
}

module.exports = validateSignUp;
