// src/utils/validator.js

/**
 * validate(schema) returns middleware
 * schema must be Joi, Zod, Yup, or compatible validator.
 *
 * Example:
 *   router.post('/register', validate(registerSchema), controller.register);
 */
export default function validate(schema) {
  return async (req, res, next) => {
    try {
      await schema.parseAsync
        ? schema.parseAsync(req.body)
        : schema.validateAsync(req.body);

      return next();
    } catch (err) {
      return res.status(422).json({
        success: false,
        error: 'Validation failed',
        details: err.errors || err.details || err.message
      });
    }
  };
}
