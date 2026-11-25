import { FORBIDDEN } from "../config.js";

export class BadRequestError extends Error {
  constructor(message, page, options) {
    super(message, options);
    this.statusCode = FORBIDDEN;
    this.page = page;
    this.name = this.constructor.name;
  }
}
