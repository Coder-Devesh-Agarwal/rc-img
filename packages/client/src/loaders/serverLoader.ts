// packages/client/src/loaders/serverLoader.ts
import { BaseLoader } from './baseLoader';
import type { LoaderConfig } from '../types';

export class ServerLoader extends BaseLoader {
  constructor(
    private baseRoute: string = '/_rc/image',
    private baseUrl?: string | URL,
  ) {
    super();
  }

  generateUrl(config: LoaderConfig): string {
    // Create query parameters
    const params = new URLSearchParams({
      url: config.src,
      w: config.width.toString(),
      q: (config.quality || 75).toString(),
      f: config.format || 'webp',
    });

    if (this.baseUrl) {
      // If we have a baseUrl, use the URL constructor for proper joining
      const url = new URL(this.baseRoute, this.baseUrl);
      url.search = params.toString();
      return url.toString();
    } else {
      // If no baseUrl, just combine the route and parameters
      return `${this.baseRoute}?${params.toString()}`;
    }
  }
}
