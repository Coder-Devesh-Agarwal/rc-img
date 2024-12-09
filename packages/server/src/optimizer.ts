// packages/server/src/optimizer.ts
import sharp from 'sharp';
import path from 'path';
import {
  // promises as fs,
  existsSync,
  mkdirSync,
} from 'fs';
import { OptimizeParams, OptimizeResult } from './types';

export class ImageOptimizer {
  constructor(private optimizedDir: string = 'public/optimized') {
    // Create optimized directory if it doesn't exist
    if (!existsSync(optimizedDir)) {
      mkdirSync(optimizedDir, { recursive: true });
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
      await sharp(imagePath)
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
