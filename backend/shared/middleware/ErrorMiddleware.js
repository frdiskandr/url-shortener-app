import { logger } from "../utils/logger.js";

const ErrorMiddleware = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  const statusCandidate = err.statusCode ?? err.status ?? err.code
  let statusCode = Number(statusCandidate)

  if (!Number.isInteger(statusCode) || statusCode < 100 || statusCode >= 600) {
    statusCode = 500
  }

  const message = err.message || 'Internal Server Error'

  logger.error(err)

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
};

export default ErrorMiddleware;
