import { Logger } from "../logs/logger.js"; // pathingga mosla

export const errorMiddleware = (error, req, res, next) => {
  const meta = {
    method: req.method,
    url: req.url,
    name: error.name,
  };

  if (error.status && error.status < 500) {
    Logger.warn(error.message || "Bad Request", meta);

    return res.status(error.status).json({
      status: error.status,
      message: error.message || "Bad Request",
      name: error.name,
    });
  }

  Logger.error(error.message || "Internal Server Error", meta);

  return res.status(500).json({
    status: 500,
    message: "Internal Server Error",
    name: error.name,
  });
};
