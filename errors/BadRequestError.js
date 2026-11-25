import { BAD_REQUEST } from "../config.js";

export class BadRequestError extends Error {
  constructor(message, page, options) {
    super(message, options);
    this.status_code = BAD_REQUEST;
    this.page = page;
    this.name = this.constructor.name;
  }
}
