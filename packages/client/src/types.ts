export type LoaderType = 'none' | 'server' | 'aws' | 'custom';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface LoaderConfig {
  src: string;
  width: number;
  quality?: number;
  format?: string;
}

export interface ImageProps extends ImageDimensions {
  src: string;
  alt: string;
  quality?: number;
  priority?: boolean;
  loader?: LoaderType;
  loaderUrl?: string;
  className?: string;
  customLoader?: (config: LoaderConfig) => string;
}
