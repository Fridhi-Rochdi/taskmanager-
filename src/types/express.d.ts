declare global {
  namespace Express {
    interface Request {
      traceId?: string;
      requestId?: string;
    }
  }
}
