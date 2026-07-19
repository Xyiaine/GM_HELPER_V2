// GM Helper — Validation Middleware
// Uses Zod to validate request body, params, and query

/**
 * Creates an Express middleware that validates the request against a Zod schema.
 * @param {import('zod').ZodSchema} schema - Zod schema object with optional body, params, query keys
 * @param {'body'|'params'|'query'} source - Which part of the request to validate
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }
    // Replace with parsed (coerced/transformed) data
    req[source] = result.data;
    next();
  };
}

module.exports = { validate };
