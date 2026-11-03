import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred.'
    }
  });
});

export default app;
