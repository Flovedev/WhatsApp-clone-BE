import mongoose from "mongoose";
import { ErrorRequestHandler } from "express";
import { validationError } from "./interfaces/IError";


export const badRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status === 400 || err instanceof mongoose.Error.ValidationError) {
    if (err.errorsList) {
      res.status(400).send({ message: err.message, errorsList: err.errorsList.map((e: validationError) => e.msg) })

    } else {
      res.status(400).send({ message: err.message })
    }
  } else {
    next(err);
  }
};

export const unauthorizedHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (err.status === 401) {
    res.status(401).send({ message: err.message });
  } else {
    next(err);
  }
};

export const forbiddenHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status === 403) {
    res.status(403).send({ message: err.message });
  } else {
    next(err);
  }
};

export const notFoundHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ message: err.message });
  } else {
    next(err);
  }
};

export const genericErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  console.log(err);
  res.status(500).send({ message: "We gonna fix this ASAP!" });
};
