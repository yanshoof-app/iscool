/**
 * Represents an error resulting from an HTTP request
 */
export class HTTPError extends Error {
  static get errorName() {
    return 'HTTP Error';
  }

  static isHTTPError(err: unknown): err is HTTPError {
    return err instanceof Error && err.name === HTTPError.errorName && 'code' in err;
  }

  readonly code;
  constructor(code: number, message?: string) {
    super(message);
    this.code = code;
    this.name = HTTPError.errorName;
  }
}
