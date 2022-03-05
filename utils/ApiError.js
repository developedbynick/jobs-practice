class APIError {
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode || 500;
    // prettier-ignore
    this.status = this.statusCode + "".startsWith("4") ? "Fail" : "Internal Server Error";
  }
}
module.exports = APIError;
