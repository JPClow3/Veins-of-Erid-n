import logger from './logger';

class BlobManager {
  private urls = new Set<string>();

  create(data: Blob | MediaSource): string {
    const url = URL.createObjectURL(data);
    this.urls.add(url);
    logger.info('Blob URL created', { url, count: this.urls.size });
    return url;
  }

  revoke(url: string | null | undefined) {
    if (url && url.startsWith('blob:') && this.urls.has(url)) {
      URL.revokeObjectURL(url);
      this.urls.delete(url);
      logger.info('Blob URL revoked', { url, count: this.urls.size });
    }
  }

  cleanupAll() {
    logger.info(`Cleaning up ${this.urls.size} blob URLs.`);
    this.urls.forEach(url => {
        if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url)
        }
    });
    this.urls.clear();
  }
}

export const blobManager = new BlobManager();
