const Joi = require('joi');

const addressValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone must be a valid 10-digit Indian number',
    }),
  email: Joi.string().email().required(),
  address: Joi.string().min(5).required(),
  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Pincode must be a 6-digit number',
    }),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().default('India'),
});

module.exports = { addressValidationSchema };
