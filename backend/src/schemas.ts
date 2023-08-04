import Joi from "joi";

export const hourSchema = Joi.object({
    date: Joi.date().required(),
    hours: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    supervisor_name: Joi.string().required(),
    supervisor_contact: Joi.string().email().required(),
  })