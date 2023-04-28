const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (res.headerSent) {
    return next(err);
  }

  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = { errorHandler };