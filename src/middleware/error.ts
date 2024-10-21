import { Request, Response, NextFunction } from "express";
import ApiError from "../errors/ApiError";

/**
 * Error Convrter to be parsable by the error handler
 * @param err Error object
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export function converter(err: ApiError, _req: Request, _res: Response, next: NextFunction) {
  let error = err;
  if (!(error instanceof ApiError)) {
    const status = err.status || 400;
    const message = err.message || "Bad request";
    error = new ApiError(status, message, false, err.stack);
  }
  next(error);
}

/**
 * Error Handler
 * @param err Error object
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export function handler(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
  let { status, message } = err;
  if (process.env.NODE_ENV === "production" && !err.operational) {
    status = 500;
    message = "Internal Server Error";
  }

  res.locals.errorMessage = err.message;

  const response = {
    status,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  };

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  return res.status(status).send(response);
}
