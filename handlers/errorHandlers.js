// Bad Request Handler
exports.catchErrors = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      //Validation Errors
      if (typeof err === "string") {
        res.status(400).json({
          message: err,
        });
      } else {
        next(err);
      }
    });
  };
};

// MongoDB Validation Error Handler
exports.mongooseErrors = (err, req, res, next) => {
  if (!err.errors) return next(err);
  const errorKeys = Object.keys(err.errors);
  let message = "";
  errorKeys.forEach((key) => (message += err.errors[key].message + ", "));

  message = message.substring(0, message.length - 1);

  res.status(400).json({
    message,
  });
};

// Dev Error handler
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";
  const errorDetails = {
    message: err.message,
    status: err.status,
    stack: err.stack,
  };

  res.status(err.status || 500).json(errorDetails); // send JSON back
};

// Prod Error handler
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: "Internal Server Error",
  }); // send JSON back
};

// Page not found handler
exports.notFound = (req, res) => {
  res.status(404).json({
    message: "This page does not exist",
  });
};
