import type { LoaderConfig } from '../types';

export abstract class BaseLoader {
  constructor() {}

  abstract generateUrl(config: LoaderConfig): string;

  protected appendSearchParams(url: URL, params: Record<string, string>) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url;
  }
}
