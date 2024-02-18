import Joi from "joi";

export const createFileSchema: Joi.Schema = Joi.object().keys({
  content: Joi.string().required()
});

export const shareFileSchema: Joi.Schema = Joi.object().keys({
   loggedInUser : Joi.string().required(),
   fileId : Joi.string().length(64).required().messages({"string.length" : "Invalid File ID"}),
   username : Joi.string().required()
});
