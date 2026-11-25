import { FORBIDDEN } from "../config.js";

export class ForbiddenError extends Error {
  constructor(message, options) {
    super(message, options);
    this.status_code = FORBIDDEN;
    this.name = this.constructor.name;
  }
}
