/**
 * Represents an error caused by the iscool server
 */
export class IscoolServerException extends Error {
  static get errorName() {
    return 'IscoolServerException';
  }

  static isIscoolServerException(err: unknown): err is IscoolServerException {
    return err instanceof Error && err.name === IscoolServerException.errorName;
  }

  constructor(message?: string) {
    super(message);
    this.name = IscoolServerException.errorName;
  }
}
