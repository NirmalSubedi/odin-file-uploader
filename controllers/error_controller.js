import { validationResult } from "express-validator";
import { BadRequestError } from "../errors/BadRequestError.js";

export const correct_values_for = (page) => (req, res, next) => {
  try {
    validationResult(req).throw();
    next();
  } catch (error) {
    next(new BadRequestError("Client validation error(s).", page));
  }
};
