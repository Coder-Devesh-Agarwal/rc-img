import { ImgHTMLAttributes } from 'react';

export type LoaderType = 'none' | 'server' | 'aws' | 'custom';
export interface LoaderConfig {
  src: string;
  width: number;
  quality?: number;
  format?: string;
}

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  width: number;
  height: number;
  src: string;
  alt: string;
  quality?: number;
  priority?: boolean;
  loader?: LoaderType;
  loaderUrl?: string;
  className?: string;
  customLoader?: (config: LoaderConfig) => string;
  sizes?: string;
}
