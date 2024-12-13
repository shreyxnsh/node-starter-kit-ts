import { ErrorRequestHandler, Response } from "express";

export const errorHandler: ErrorRequestHandler = (
  err: any,
  _,
  res: Response,
) => {
  const message =
    err.errors || err.message || "Something went wrong, please try again.";

  console.log("Error=>\t", err, typeof err.message);
  res.error(message);
};
