import { body } from "express-validator";
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LOWER_CASE,
  PASSWORD_MIN_NUMBERS,
  PASSWORD_MIN_SYMBOLS,
  PASSWORD_MIN_UPPER_CASE,
} from "../config.js";

const empty_error = "must be filled.";

const get_email_field_chain = () =>
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email ${empty_error}`)
    .isLength({ max: EMAIL_MAX_LENGTH })
    .withMessage(`Email must not exceed ${EMAIL_MAX_LENGTH} characters.`)
    .isEmail()
    .withMessage(
      "Email must be formatted correctly (e.g., johndoe@example.com).",
    );

const get_password_field_chain = () =>
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password ${empty_error}`)
    .isLength({ max: PASSWORD_MAX_LENGTH })
    .withMessage(`Password must not exceed ${PASSWORD_MAX_LENGTH} characters.`)
    .isStrongPassword({
      minLength: PASSWORD_MIN_LENGTH,
      minLowerCase: PASSWORD_MIN_LOWER_CASE,
      minUppercase: PASSWORD_MIN_UPPER_CASE,
      minNumbers: PASSWORD_MIN_NUMBERS,
      minSymbols: PASSWORD_MIN_SYMBOLS,
    })
    .withMessage(
      `Password must at least be ${PASSWORD_MIN_LENGTH} characters long with ${PASSWORD_MIN_UPPER_CASE} uppercase character, ${PASSWORD_MIN_LOWER_CASE} lowercase character, ${PASSWORD_MIN_NUMBERS} number, and ${PASSWORD_MIN_SYMBOLS} symbol.`,
    );

export const check_signup = [
  get_email_field_chain(),
  get_password_field_chain(),
];

export const check_signin = [
  get_email_field_chain(),
  get_password_field_chain(),
];
