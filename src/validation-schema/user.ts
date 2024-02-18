import Joi from "joi";

export const registerSchema: Joi.Schema = Joi.object().keys({
  username: Joi.string().required()
});
