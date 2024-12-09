// packages/client/src/loaders/awsLoader.ts
import { BaseLoader } from './baseLoader';
import type { LoaderConfig } from '../types';

export class AWSLoader extends BaseLoader {
  constructor(private baseUrl: string = '/api/optimize') {
    super();
  }

  generateUrl(config: LoaderConfig): string {
    const url = new URL(`${this.baseUrl}${config.src}`);
    return this.appendSearchParams(url, {
      format: 'auto',
      width: config.width.toString(),
      quality: (config.quality || 75).toString(),
    }).href;
  }
}
