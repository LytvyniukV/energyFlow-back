import HttpError from '../helpers/httpError.js';

export const validateDateMiddleware = (JoiSchema) => {
  return (req, res, next) => {
    let schema;
    if (typeof JoiSchema === 'function') {
      schema = JoiSchema();
    } else {
      schema = JoiSchema;
    }

    const { error } = schema.validate(req.body);
    if (error)
      throw HttpError(400, `Joi validator: ${error.details[0].message}`);
    next();
  };
};
