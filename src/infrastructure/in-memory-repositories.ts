import { Book } from '../domain/book';
import { Loan } from '../domain/loan';
import { LibraryStore } from '../application/ports';

export class InMemoryLibraryStore implements LibraryStore {
  private readonly books = new Map<string, Book>();
  private readonly loans = new Map<string, Loan>();

  constructor() {
    [
      new Book('Clean Code', 'Robert C. Martin', '9780132350884', 3),
      new Book('The Pragmatic Programmer', 'David Thomas and Andrew Hunt', '9780135957059', 2),
      new Book('Domain-Driven Design', 'Eric Evans', '9780321125217', 1)
    ].forEach((book) => this.books.set(book.id, book));
  }

  allBooks(): Book[] { return [...this.books.values()].sort((a, b) => a.title.localeCompare(b.title)); }
  allLoans(): Loan[] { return [...this.loans.values()].sort((a, b) => b.loanedAt.localeCompare(a.loanedAt)); }
  findBookById(id: string): Book | undefined { return this.books.get(id); }
  findLoanById(id: string): Loan | undefined { return this.loans.get(id); }
  findByIsbn(isbn: string): Book | undefined { return [...this.books.values()].find((book) => book.isbn.toLowerCase() === isbn.toLowerCase()); }
  saveBook(book: Book): void { this.books.set(book.id, book); }
  saveLoan(loan: Loan): void { this.loans.set(loan.id, loan); }
}
