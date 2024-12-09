// packages/client/src/Image.tsx
import React, { useState, useRef, useEffect } from 'react';
import type { ImageProps, LoaderConfig } from './types';
import { AWSLoader, ServerLoader } from './loaders';

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 75,
  priority = false,
  loader = 'none',
  loaderUrl,
  className = '',
  customLoader,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  const getLoader = () => {
    switch (loader) {
      case 'aws':
        return new AWSLoader();
      case 'server':
        return new ServerLoader(loaderUrl);
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

  const activeLoader = getLoader();

  const getImageUrl = (options: Partial<LoaderConfig> = {}) => {
    return activeLoader.generateUrl({
      src,
      width: options.width ?? width,
      quality: options.quality ?? quality,
      format: options.format,
    });
  };

  useEffect(() => {
    if (!priority && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && imgRef.current) {
            imgRef.current.src = getImageUrl();
            observer.disconnect();
          }
        },
        { rootMargin: '50px' },
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }
  }, [src, width, priority]);

  const shouldShowSources = loader !== 'none';

  return (
    <picture>
      {shouldShowSources && (
        <>
          <source
            type="image/avif"
            srcSet={priority ? getImageUrl({ format: 'avif' }) : undefined}
            sizes={`(max-width: ${width}px) 100vw, ${width}px`}
          />
          <source
            type="image/webp"
            srcSet={priority ? getImageUrl({ format: 'webp' }) : undefined}
            sizes={`(max-width: ${width}px) 100vw, ${width}px`}
          />
        </>
      )}
      <img
        ref={imgRef}
        src={priority ? getImageUrl() : ''}
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
      />
    </picture>
  );
};
