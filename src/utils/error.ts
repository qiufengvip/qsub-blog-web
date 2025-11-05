export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    // Set the prototype explicitly
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }

  getError() {
    return this.message;
  }
}
