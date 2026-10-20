import { Book } from '../domain/book';
import { Loan } from '../domain/loan';

export interface BookRepository {
  allBooks(): Book[];
  findBookById(id: string): Book | undefined;
  findByIsbn(isbn: string): Book | undefined;
  saveBook(book: Book): void;
}

export interface LoanRepository {
  allLoans(): Loan[];
  findLoanById(id: string): Loan | undefined;
  saveLoan(loan: Loan): void;
}

export interface LibraryStore extends BookRepository, LoanRepository {}
