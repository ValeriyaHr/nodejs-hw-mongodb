import Joi from 'joi';

const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export default sendResetEmailSchema;
