// packages/server/src/optimizer.ts
import sharp from 'sharp';
import path from 'path';
import * as fs from 'fs/promises';
import { OptimizeParams, OptimizeResult } from './types';
import { existsSync } from 'fs';

export class ImageOptimizer {
  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days default

  constructor(
    private optimizedDir: string = 'public/optimized',
    private maxAgeMs: number = this.MAX_AGE_MS, // Allow custom max age
  ) {
    // Start cleanup on initialization
    this.initializeOptimizer();
  }

  private async initializeOptimizer() {
    // Create directory if it doesn't exist
    try {
      await fs.mkdir(this.optimizedDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create optimizer directory:', error);
    }

    // Completely clear all cached files
    await this.clearCache(true);

    // Set up periodic cleanup
    this.startCleanupInterval();
  }

  private startCleanupInterval() {
    // Run cleanup every 24 hours
    this.cleanupInterval = setInterval(
      () => {
        this.clearCache();
      },
      24 * 60 * 60 * 1000,
    );
  }

  private async clearCache(completeCleanup: boolean = false) {
    try {
      const files = await fs.readdir(this.optimizedDir);
      const now = Date.now();

      // Check each file's age and remove if too old
      for (const file of files) {
        const filePath = path.join(this.optimizedDir, file);

        if (completeCleanup) {
          // If complete cleanup is requested, delete all files
          await fs.unlink(filePath);
        } else {
          // For regular cleanup, check file age
          const stats = await fs.stat(filePath);
          if (now - stats.mtimeMs > this.maxAgeMs) {
            await fs.unlink(filePath);
          }
        }
      }

      if (completeCleanup) {
        console.log('Cache completely cleared on startup');
      }
    } catch (error) {
      console.error('Cache cleanup failed:', error);
    }
  }

  // Cleanup when the optimizer is no longer needed
  public dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  // Generate a consistent path for the optimized version of an image
  private getOptimizedPath({
    imagePath,
    width,
    quality,
    format,
  }: OptimizeParams): string {
    const filename = path.basename(imagePath);
    const optimizedName = `${path.parse(filename).name}-w${width}-q${quality}.${format}`;
    return path.join(this.optimizedDir, optimizedName);
  }

  async optimize(params: OptimizeParams): Promise<OptimizeResult> {
    const { imagePath, width, quality = 75, format = 'webp' } = params;

    // Get path where optimized version should be stored
    const optimizedPath = this.getOptimizedPath(params);

    // Create optimized version if it doesn't exist
    if (!existsSync(optimizedPath)) {
      let buffer: string | Buffer = imagePath;

      if (imagePath.includes('https')) {
        const response = await fetch(imagePath);
        buffer = Buffer.from(await response.arrayBuffer());
      }

      await sharp(buffer)
        .resize(width)
        ?.[format]({ quality })
        .toFile(optimizedPath);
    }

    return {
      path: optimizedPath,
      contentType: `image/${format}`,
    };
  }
}

// export class ImageOptimizero {
//   constructor(private cacheDir: string) {
//     this.initCache();
//   }

//   private async initCache() {
//     await fs.mkdir(this.cacheDir, { recursive: true });
//   }

//   async optimize(
//     url: string,
//     width: number,
//     quality: number = 75,
//     format: string = 'webp',
//   ) {
//     const cacheKey = Buffer.from(
//       `${url}-${width}-${quality}-${format}`,
//     ).toString('base64url');
//     const cachePath = path.join(this.cacheDir, cacheKey);

//     try {
//       return await fs.readFile(cachePath);
//     } catch {
//       const response = await fetch(url);
//       const buffer = Buffer.from(await response.arrayBuffer());

//       const optimized = await sharp(buffer)
//         .resize(width)
//         .jpeg({ quality })
//         .toBuffer();

//       await fs.writeFile(cachePath, optimized);
//       return optimized;
//     }
//   }
// }
