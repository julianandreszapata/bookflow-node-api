import { randomUUID } from 'node:crypto';
import { BusinessRuleError } from './errors';

export class Book {
  readonly id: string;
  readonly createdAt: string;
  availableCopies: number;

  constructor(
    public readonly title: string,
    public readonly author: string,
    public readonly isbn: string,
    public readonly totalCopies: number,
    id = randomUUID(),
    availableCopies?: number,
    createdAt = new Date().toISOString()
  ) {
    if (!title.trim()) throw new BusinessRuleError('Title is required.');
    if (!author.trim()) throw new BusinessRuleError('Author is required.');
    if (!isbn.trim()) throw new BusinessRuleError('ISBN is required.');
    if (!Number.isInteger(totalCopies) || totalCopies < 1) throw new BusinessRuleError('Total copies must be at least 1.');
    this.id = id;
    this.availableCopies = availableCopies ?? totalCopies;
    this.createdAt = createdAt;
  }

  checkoutCopy(): void {
    if (this.availableCopies <= 0) throw new BusinessRuleError('No copies are currently available.');
    this.availableCopies -= 1;
  }

  returnCopy(): void {
    if (this.availableCopies >= this.totalCopies) throw new BusinessRuleError('Returned copies cannot exceed the inventory.');
    this.availableCopies += 1;
  }
}
