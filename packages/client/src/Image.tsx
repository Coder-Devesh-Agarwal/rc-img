// packages/client/src/Image.tsx
import React, { useState, useRef } from 'react';
import type { ImageProps, LoaderConfig } from './types';
import { AWSLoader, ServerLoader } from './loaders/index';
import { DEVICE_SIZES } from './constants';

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 75,
  priority = false,
  loader = 'none',
  loaderUrl,
  loaderRoute,
  className = '',
  customLoader,
  sizes = '100vw',
  ...othProps
}) => {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  //Set Loader
  const getLoader = () => {
    switch (loader) {
      case 'aws':
        return new AWSLoader(loaderUrl);
      case 'server':
        return new ServerLoader(loaderRoute, loaderUrl);
      case 'custom':
        return {
          generateUrl: (config: LoaderConfig) =>
            customLoader?.(config) ?? config.src,
        };
      default:
        return {
          generateUrl: (config: LoaderConfig) => config.src,
        };
    }
  };

  //GET ACTIVE URL
  const activeLoader = getLoader();

  //GET IMAGE URL
  const getImageUrl = (options: Partial<LoaderConfig> = {}) => {
    return activeLoader.generateUrl({
      src,
      width: options.width ?? width,
      quality: options.quality ?? quality,
      format: options.format,
    });
  };

  // Generate srcSet
  const generateSrcSet = () => {
    // if (loader === 'none') {
    //   return `${getImageUrl()} ${DEVICE_SIZES.slice(-1)[0]}w`;
    // }

    return DEVICE_SIZES.filter((w) => {
      return w >= width && w <= width * 2;
    }) // Only include sizes between target width and upto 2x the target width
      .map((w) => `${getImageUrl({ width: w })} ${w}w`)
      .join(', ');
  };

  // ADD PRELOAD TAGS
  if (typeof window !== 'undefined' && priority && !isPreloaded) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.imageSrcset = generateSrcSet();
    link.imageSizes = sizes;
    document.head.appendChild(link);
    setIsPreloaded(true);

    return;
  }

  return (
    <img
      ref={imgRef}
      srcSet={generateSrcSet()}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      onLoad={() => setIsLoading(false)}
      className={`transition-opacity duration-200 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      } ${className}`}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
      //OTHER PROPS ADDITION
      {...othProps}
    />
  );
};
