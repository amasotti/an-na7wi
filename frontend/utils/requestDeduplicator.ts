/**
 * Request deduplicator utility for preventing duplicate API calls
 * 
 * This utility provides a clean solution for coordinating API calls across
 * components and stores to prevent duplicate requests without dirty workarounds.
 */

type RequestKey = string
type RequestPromise<T> = Promise<T>

class RequestDeduplicator {
  private pendingRequests = new Map<RequestKey, RequestPromise<any>>()

  /**
   * Execute a request with deduplication
   * If the same request is already in progress, return the existing promise
   */
  async dedupe<T>(key: RequestKey, requestFn: () => Promise<T>): Promise<T> {
    const existing = this.isPending(key)
    if (existing) {
      return this.pendingRequests.get(key) as Promise<T>
    }

    const promise = requestFn().finally(() => {
      this.clear(key)
    })

    this.pendingRequests.set(key, promise)
    return promise
  }

  /**
   * Check if a request is currently pending
   */
  isPending(key: RequestKey): boolean {
    return this.pendingRequests.has(key)
  }

  /**
   * Cancel/clear a pending request
   */
  clear(key: RequestKey): void {
    this.pendingRequests.delete(key)
  }
}

// Global instance for app-wide request deduplication
export const requestDeduplicator = new RequestDeduplicator()

/**
 * Create a scoped deduplicator for a specific store or component
 */
export const createDeduplicator = () => new RequestDeduplicator()
