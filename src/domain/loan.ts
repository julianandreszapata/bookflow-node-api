import { randomUUID } from 'node:crypto';
import { BusinessRuleError } from './errors';

export class Loan {
  readonly id: string;
  readonly loanedAt: string;
  returnedAt: string | null = null;

  private constructor(
    public readonly bookId: string,
    public readonly borrowerName: string,
    public readonly dueDate: string,
    id = randomUUID(),
    loanedAt = new Date().toISOString(),
    returnedAt: string | null = null
  ) {
    this.id = id;
    this.loanedAt = loanedAt;
    this.returnedAt = returnedAt;
  }

  static create(bookId: string, borrowerName: string, dueDate: string): Loan {
    if (!bookId.trim()) throw new BusinessRuleError('A valid book is required.');
    if (!borrowerName.trim()) throw new BusinessRuleError('Borrower name is required.');
    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime()) || parsed.getTime() <= Date.now()) throw new BusinessRuleError('Due date must be in the future.');
    return new Loan(bookId, borrowerName.trim(), parsed.toISOString());
  }

  get isReturned(): boolean { return this.returnedAt !== null; }

  markReturned(): void {
    if (this.isReturned) throw new BusinessRuleError('This loan has already been returned.');
    this.returnedAt = new Date().toISOString();
  }
}
