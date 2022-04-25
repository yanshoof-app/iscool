/**
 * Represents an error resulting from a change whose date is not in this week
 * @version 1.3.0
 */
export class IrrelevantDateException extends Error {
  static get errorName() {
    return 'IrrelevantChangeException';
  }

  static isIrrevlevantChangeException(err: unknown): err is IrrelevantDateException {
    return err instanceof Error && err.name === IrrelevantDateException.errorName;
  }

  constructor(message?: string) {
    super(message);
    this.name = IrrelevantDateException.errorName;
  }
}
