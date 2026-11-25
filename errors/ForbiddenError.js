import { FORBIDDEN } from "../config.js";

export class ForbiddenError extends Error {
  constructor(message, page, options) {
    super(message, options);
    this.status_code = FORBIDDEN;
    this.page = page;
    this.name = this.constructor.name;
  }
}
