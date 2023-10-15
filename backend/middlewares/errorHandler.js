const errorHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  if (err instanceof ValidationError) {
    // Client input validation error
    res.status(400).json({ error: 'Validation error: ' + err.message });
  } else if (err instanceof AuthenticationError) {
    // Authentication or authorization error
    res.status(401).json({ error: 'Authentication error: ' + err.message });
  } else if (err instanceof NotFoundError) {
    // Resource not found error
    res.status(404).json({ error: 'Resource not found: ' + err.message });
  } else {
    // Generic server error
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { errorHandler };
