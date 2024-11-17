const validateRequest = (schema) => (req, res, next) => {
  try {
    // Body, query, param validations
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next(); // Proceed if validation is successful
  } catch (error) {
    // Catch errors
    return res.status(400).json({
      success: false,
      message: "Validation error",
      error: error.errors,
    });
  }
};

module.exports = validateRequest;
