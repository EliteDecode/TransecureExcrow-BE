const domainValidation = (req, res, next) => {
  const { domain } = req.headers;

  if (!domain) {
    return res.status(400).json({
      error: { message: "Domain is required" },
    });
  }

  next();
};

module.exports = { domainValidation };
