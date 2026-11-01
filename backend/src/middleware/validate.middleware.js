const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const issues = parsed.error?.issues || parsed.error?.errors || [];
      const errorMessages = issues.map((err) => `${err.path.join(".")}: ${err.message}`);
      return res.status(400).json({
        success: false,
        message: issues[0]?.message || "Invalid input data",
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
