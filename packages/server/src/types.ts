export type AllowedFormat = 'webp' | 'avif' | 'jpeg';

export interface OptimizeParams {
  imagePath: string;
  width: number;
  quality?: number;
  format?: AllowedFormat;
}

export interface OptimizeResult {
  path: string;
  contentType: string;
}

export interface ParsedParams {
  url?: string;
  path?: string;
  w?: string | number;
  width?: string | number;
  q?: string | number;
  quality?: string | number;
  f?: string;
  format?: string;
}
