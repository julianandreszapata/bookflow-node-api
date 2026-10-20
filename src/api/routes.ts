import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { LibraryService } from '../application/library-service';
import { InMemoryLibraryStore } from '../infrastructure/in-memory-repositories';
import { BusinessRuleError, NotFoundError } from '../domain/errors';

const bookSchema = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().min(1).max(160),
  isbn: z.string().trim().min(1).max(32),
  totalCopies: z.number().int().min(1).max(10000)
});
const loanSchema = z.object({
  bookId: z.string().uuid(),
  borrowerName: z.string().trim().min(1).max(160),
  dueDate: z.string().datetime({ offset: true })
});

export function createRouter(store = new InMemoryLibraryStore()): Router {
  const router = Router();
  const service = new LibraryService(store);
  const endpoint = (handler: (req: Request, res: Response) => unknown) =>
    (req: Request, res: Response, next: NextFunction) => {
      try { Promise.resolve(handler(req, res)).catch(next); } catch (error) { next(error); }
    };

  router.get('/health', (_req, res) => res.json({ status: 'ok', service: 'bookflow-node-api' }));
  router.get('/books', endpoint((_req, res) => res.json(service.listBooks())));
  router.post('/books', endpoint((req, res) => {
    const parsed = bookSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return res.status(201).json(service.createBook(parsed.data));
  }));
  router.get('/loans', endpoint((_req, res) => res.json(service.listLoans())));
  router.post('/loans', endpoint((req, res) => {
    const parsed = loanSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return res.status(201).json(service.createLoan(parsed.data));
  }));
  router.patch('/loans/:id/return', endpoint((req, res) => res.json(service.returnLoan(req.params.id))));
  router.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof BusinessRuleError) return res.status(400).json({ error: error.message });
    if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
    console.error(error);
    return res.status(500).json({ error: 'Unexpected server error.' });
  });
  return router;
}
