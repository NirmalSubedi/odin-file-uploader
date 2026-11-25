import { UNAUTHORIZED } from "../config.js";

export class UnauthorizedError extends Error {
  constructor(message, options) {
    super(message, options);
    this.status_code = UNAUTHORIZED;
    this.name = this.constructor.name;
  }
}
