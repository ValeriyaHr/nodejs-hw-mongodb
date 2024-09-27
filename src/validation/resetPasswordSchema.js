import Joi from 'joi';

const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});

export default resetPasswordSchema;
