// packages/server/src/adapters/base.ts

import { ImageOptimizer } from '../optimizer';
import { AllowedFormat, OptimizeParams, ParsedParams } from '../types';

// This abstract class defines what all server adapters must implement
export abstract class ServerAdapter {
  constructor(protected optimizer: ImageOptimizer) {}

  protected parseParams(params: ParsedParams): OptimizeParams {
    const width = this.parseNumber(params.w ?? params.width);
    const quality = this.parseNumber(params.q ?? params.quality) ?? 75;
    const format = this.parseFormat(params.f ?? params.format);
    const imagePath = params.url ?? params.path;

    if (!imagePath) {
      throw new Error('Image path is required');
    }

    if (!width) {
      throw new Error('Width is required');
    }

    return {
      imagePath,
      width,
      quality,
      format,
    };
  }

  private parseNumber(value: string | number | undefined): number | undefined {
    if (typeof value === 'number') return value;
    if (!value) return undefined;
    const parsed = parseInt(value);
    return isNaN(parsed) ? undefined : parsed;
  }

  private parseFormat(format: string | undefined): AllowedFormat {
    if (!format) return 'webp';
    const normalized = format.toLowerCase();
    if (this.isAllowedFormat(normalized)) {
      return normalized;
    }
    return 'webp';
  }

  private isAllowedFormat(format: string): format is AllowedFormat {
    return ['webp', 'avif', 'jpeg'].includes(format);
  }

  abstract handleRequest(req: any, res: any): Promise<void>;
}
