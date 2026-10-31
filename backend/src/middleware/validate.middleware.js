const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const errorMessages = parsed.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: errorMessages,
      });
    }
    req.body = parsed.data;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validate;
