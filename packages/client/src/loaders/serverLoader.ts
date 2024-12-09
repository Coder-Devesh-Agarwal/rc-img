// packages/client/src/loaders/serverLoader.ts
import { BaseLoader } from './baseLoader';
import type { LoaderConfig } from '../types';

export class ServerLoader extends BaseLoader {
  constructor(private baseUrl: string = '/api/optimize') {}

  generateUrl(config: LoaderConfig): string {
    const url = new URL(this.baseUrl, window.location.origin);
    return this.appendSearchParams(url, {
      url: config.src,
      w: config.width.toString(),
      q: (config.quality || 75).toString(),
      f: config.format,
    }).href;
  }
}
