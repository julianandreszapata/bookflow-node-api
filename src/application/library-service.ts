import { Book } from '../domain/book';
import { Loan } from '../domain/loan';
import { BusinessRuleError, NotFoundError } from '../domain/errors';
import { LibraryStore } from './ports';

export class LibraryService {
  constructor(private readonly store: LibraryStore) {}

  listBooks() { return this.store.allBooks(); }
  listLoans() { return this.store.allLoans().map((loan) => this.mapLoan(loan)); }

  createBook(input: { title: string; author: string; isbn: string; totalCopies: number }) {
    if (this.store.findByIsbn(input.isbn)) throw new BusinessRuleError('A book with this ISBN already exists.');
    const book = new Book(input.title, input.author, input.isbn, input.totalCopies);
    this.store.saveBook(book);
    return book;
  }

  createLoan(input: { bookId: string; borrowerName: string; dueDate: string }) {
    const book = this.store.findBookById(input.bookId);
    if (!book) throw new NotFoundError('Book was not found.');
    const loan = Loan.create(input.bookId, input.borrowerName, input.dueDate);
    book.checkoutCopy();
    this.store.saveBook(book);
    this.store.saveLoan(loan);
    return this.mapLoan(loan);
  }

  returnLoan(id: string) {
    const loan = this.store.findLoanById(id);
    if (!loan) throw new NotFoundError('Loan was not found.');
    const book = this.store.findBookById(loan.bookId);
    if (!book) throw new NotFoundError('Book linked to loan was not found.');
    loan.markReturned();
    book.returnCopy();
    this.store.saveBook(book);
    this.store.saveLoan(loan);
    return this.mapLoan(loan);
  }

  private mapLoan(loan: Loan) {
    const book = this.store.findBookById(loan.bookId);
    return { ...loan, bookTitle: book?.title ?? 'Unknown book', isReturned: loan.isReturned };
  }
}
