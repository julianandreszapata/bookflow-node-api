import { describe, expect, it } from 'vitest';
import { Book } from '../src/domain/book';
import { BusinessRuleError } from '../src/domain/errors';
import { Loan } from '../src/domain/loan';

describe('Book domain rules', () => {
  it('decrements available copies when a copy is checked out', () => {
    const book = new Book('Clean Code', 'Robert C. Martin', 'isbn-1', 2);
    book.checkoutCopy();
    expect(book.availableCopies).toBe(1);
  });

  it('rejects checkout when no copies are available', () => {
    const book = new Book('Clean Code', 'Robert C. Martin', 'isbn-1', 1);
    book.checkoutCopy();
    expect(() => book.checkoutCopy()).toThrow(BusinessRuleError);
  });

  it('rejects a loan with a due date in the past', () => {
    expect(() => Loan.create('book-id', 'Reader', '2020-01-01T00:00:00.000Z')).toThrow(BusinessRuleError);
  });
});
