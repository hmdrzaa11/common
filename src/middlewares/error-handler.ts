import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export let errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  //unknown error
  console.error(err);
  res.status(400).send({
    errors: [
      {
        message: err.message,
      },
    ],
  });
};
