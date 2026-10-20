export class BusinessRuleError extends Error {
  constructor(message: string) { super(message); this.name = 'BusinessRuleError'; }
}

export class NotFoundError extends Error {
  constructor(message: string) { super(message); this.name = 'NotFoundError'; }
}
