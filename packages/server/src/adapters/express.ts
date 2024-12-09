// packages/server/src/adapters/express.ts
import type { Request, Response } from 'express';
import { ServerAdapter } from './base';

export class ExpressAdapter extends ServerAdapter {
  async handleRequest(req: Request, res: Response): Promise<void> {
    try {
      const params = this.parseParams(req.query);
      const result = await this.optimizer.optimize(params);

      res.setHeader('Content-Type', result.contentType);
      res.sendFile(result.path);
    } catch {
      res.status(500).json({ error: 'Image optimization failed' });
    }
  }
}
