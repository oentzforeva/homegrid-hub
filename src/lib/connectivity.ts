/**
 * Enhanced connectivity checking utilities for local networks and mixed content scenarios
 */

interface ConnectivityCheckOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ConnectivityResult {
  isReachable: boolean;
  method: 'fetch' | 'image' | 'websocket' | 'fallback';
  error?: string;
  protocol?: 'http' | 'https';
  blockedByMixedContent?: boolean;
}

/**
 * Detects if a URL is a local/private network address
 */
export function isLocalNetwork(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // IPv4 private ranges
    const ipv4Patterns = [
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^127\./,
      /^localhost$/i
    ];
    
    // Check if it's an IP address in private ranges
    if (ipv4Patterns.some(pattern => pattern.test(hostname))) {
      return true;
    }
    
    // Check for local domain patterns (no dots or .local)
    if (!hostname.includes('.') || hostname.endsWith('.local')) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * Normalizes URL and adds appropriate protocol
 */
export function normalizeUrl(url: string, preferHttpForLocal: boolean = true): string {
  // If URL already has protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Add protocol based on whether it's local network
  const testUrl = `http://${url}`;
  const isLocal = isLocalNetwork(testUrl);
  
  if (isLocal && preferHttpForLocal) {
    return `http://${url}`;
  } else {
    return `https://${url}`;
  }
}

/**
 * Checks connectivity using image loading as fallback
 */
async function checkWithImage(url: string, timeout: number = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => {
      img.onload = img.onerror = null;
      resolve(false);
    }, timeout);
    
    img.onload = () => {
      clearTimeout(timer);
      resolve(true);
    };
    
    img.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };
    
    // Try to load favicon or a common endpoint
    try {
      const urlObj = new URL(url);
      img.src = `${urlObj.protocol}//${urlObj.host}/favicon.ico?${Date.now()}`;
    } catch {
      resolve(false);
    }
  });
}

/**
 * Checks connectivity using WebSocket as fallback
 */
async function checkWithWebSocket(url: string, timeout: number = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const wsProtocol = urlObj.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${urlObj.host}`;
      
      const ws = new WebSocket(wsUrl);
      const timer = setTimeout(() => {
        ws.close();
        resolve(false);
      }, timeout);
      
      ws.onopen = () => {
        clearTimeout(timer);
        ws.close();
        resolve(true);
      };
      
      ws.onerror = () => {
        clearTimeout(timer);
        resolve(false);
      };
    } catch {
      resolve(false);
    }
  });
}

/**
 * Main connectivity checking function with fallback strategies
 */
export async function checkConnectivity(
  url: string, 
  options: ConnectivityCheckOptions = {}
): Promise<ConnectivityResult> {
  const { timeout = 5000, retries = 1, retryDelay = 1000 } = options;
  
  // Normalize the URL
  let normalizedUrl: string;
  try {
    normalizedUrl = normalizeUrl(url);
  } catch (error) {
    return {
      isReachable: false,
      method: 'fallback',
      error: 'Invalid URL format'
    };
  }
  
  const isLocal = isLocalNetwork(normalizedUrl);
  const urlObj = new URL(normalizedUrl);
  
  // Strategy 1: Try direct fetch (works for same-origin and CORS-enabled)
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(normalizedUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        redirect: 'follow',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // For no-cors mode, we can't check response.ok, but no error means reachable
      return {
        isReachable: true,
        method: 'fetch',
        protocol: urlObj.protocol.slice(0, -1) as 'http' | 'https'
      };
    } catch (error) {
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      // If it's a mixed content error and we're using HTTP on an HTTPS page
      if (window.location.protocol === 'https:' && urlObj.protocol === 'http:') {
        // Try HTTPS version for local networks that might support it
        if (isLocal) {
          try {
            const httpsUrl = normalizedUrl.replace('http:', 'https:');
            const httpsResponse = await fetch(httpsUrl, {
              method: 'HEAD',
              mode: 'no-cors',
              cache: 'no-store',
              redirect: 'follow',
              signal: AbortSignal.timeout(timeout),
            });
            
            return {
              isReachable: true,
              method: 'fetch',
              protocol: 'https'
            };
          } catch {
            // Continue to fallback methods
          }
        }
      }
    }
  }
  
  // Strategy 2: Try image loading fallback (more permissive for cross-origin)
  try {
    const imageResult = await checkWithImage(normalizedUrl, timeout);
    if (imageResult) {
      return {
        isReachable: true,
        method: 'image',
        protocol: urlObj.protocol.slice(0, -1) as 'http' | 'https'
      };
    }
  } catch (error) {
    console.debug('Image fallback failed:', error);
  }
  
  // Strategy 3: Try WebSocket fallback for local networks
  if (isLocal) {
    try {
      const wsResult = await checkWithWebSocket(normalizedUrl, timeout);
      if (wsResult) {
        return {
          isReachable: true,
          method: 'websocket',
          protocol: urlObj.protocol.slice(0, -1) as 'http' | 'https'
        };
      }
    } catch (error) {
      console.debug('WebSocket fallback failed:', error);
    }
  }
  
  // All methods failed
  return {
    isReachable: false,
    method: 'fallback',
    error: 'All connectivity methods failed',
    protocol: urlObj.protocol.slice(0, -1) as 'http' | 'https'
  };
}

/**
 * Checks general internet connectivity
 */
export async function checkInternetConnectivity(timeout: number = 5000): Promise<boolean> {
  try {
    const response = await fetch('https://dns.google/resolve?name=google.com&type=A', {
      method: 'GET',
      signal: AbortSignal.timeout(timeout),
    });
    
    return response.ok;
  } catch {
    return false;
  }
}