export interface decoded extends Request{
  userId: string;
}
// Add this to your types file (e.g., types.ts)
declare namespace Express {
  interface Request {
    userId?: string;
  }
}