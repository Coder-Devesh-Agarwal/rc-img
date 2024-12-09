// packages/client/src/loaders/awsLoader.ts
import { BaseLoader } from './baseLoader';
import type { LoaderConfig } from '../types';

export class AWSLoader extends BaseLoader {
  generateUrl(config: LoaderConfig): string {
    const url = new URL(`https://example.com${config.src}`);
    return this.appendSearchParams(url, {
      format: 'auto',
      width: config.width.toString(),
      quality: (config.quality || 75).toString(),
    }).href;
  }
}
