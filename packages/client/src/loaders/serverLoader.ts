// packages/client/src/loaders/serverLoader.ts
import { BaseLoader } from './baseLoader';
import type { LoaderConfig } from '../types';

export class ServerLoader extends BaseLoader {
  constructor(private baseUrl: string = '/_rc/image') {
    super();
  }

  generateUrl(config: LoaderConfig): string {
    // Instead of handling buffers, we just generate the correct path
    const url = new URL(this.baseUrl, window.location.origin);
    // Add query parameters that specify how we want the image optimized
    return this.appendSearchParams(url, {
      url: config.src, // Original image path
      w: config.width.toString(), // Desired width
      q: (config.quality || 75).toString(), // Quality
      f: config.format || 'webp', // Format
    }).href;
  }
}
