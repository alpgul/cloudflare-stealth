/**
 * @fileoverview cloudflare-stealth TypeScript wrapper providing fetch-compatible API
 * 
 * This module provides a TypeScript wrapper around the cloudflare-stealth WASM implementation,
 * offering a fetch-compatible API for making HTTP requests through the proxy.
 * It handles header management, request processing, and provides a clean interface
 * for Cloudflare Workers and other JavaScript environments.
 * 
 * @author cloudflare-stealth
 * @version 1.0.0
 * @since 1.0.0
 */

import wasm from "./build/index.js";
const wasmFetch2=wasm.prototype.fetch2
/**
 * Request information type - compatible with native fetch API
 * 
 * This type represents the input parameter for fetch requests, supporting
 * the same types as the native fetch API: Request objects, strings, or URL objects.
 * 
 * @typedef {Request | string | URL} RequestInfo
 */
type RequestInfo = Request | string;

/**
 * Headers initialization type - compatible with native fetch API
 * 
 * This type represents the different ways headers can be provided:
 * - Headers object
 * - Array of key-value pairs
 * - Plain object with string keys and values
 * 
 * @typedef {Headers | string[][] | Record<string, string>} HeadersInit
 */
type HeadersInit = Headers | string[][] | Record<string, string>;

/**
 * Body initialization type - compatible with native fetch API
 * 
 * This type represents the different ways request bodies can be provided:
 * - ReadableStream of Uint8Array
 * - Various binary and text formats
 * 
 * @typedef {ReadableStream<Uint8Array> | XMLHttpRequestBodyInit} BodyInit
 */
type BodyInit = 
  | ReadableStream<Uint8Array>
  | XMLHttpRequestBodyInit;

/**
 * XMLHttpRequest body initialization type - compatible with native fetch API
 * 
 * This type represents the various formats supported for request bodies:
 * - String data
 * - ArrayBuffer and views
 * - Blob objects
 * - FormData
 * - URLSearchParams
 * 
 * @typedef {string | ArrayBuffer | ArrayBufferView | Blob | FormData | URLSearchParams} XMLHttpRequestBodyInit
 */
type XMLHttpRequestBodyInit = 
  | string
  | ArrayBuffer
  | ArrayBufferView
  | Blob
  | FormData
  | URLSearchParams;

/**
 * Request initialization interface - compatible with native fetch API
 * 
 * This interface defines the options that can be passed to fetch requests.
 * Only basic properties are supported to maintain compatibility with the
 * underlying WASM implementation.
 * 
 * @interface RequestInit
 */
interface RequestInit {
  /** HTTP method (GET, POST, PUT, DELETE, etc.) */
  method?: string;
  
  /** Request headers */
  headers?: HeadersInit;
  
  /** Request body */
  body?: BodyInit | null;
}

/**
 * Headers that should be ignored when proxying requests
 * 
 * These headers are automatically removed from requests because they are:
 * - Cloudflare-specific headers that shouldn't be forwarded
 * - Proxy-specific headers that could cause issues
 * - Headers that should be set by the proxy itself
 * 
 * @constant {Set<string>} IGNORED_HEADERS
 */
const IGNORED_HEADERS = new Set([
    "cf-connecting-ip",        // Cloudflare connecting IP
    "cf-ipcountry",            // Cloudflare IP country
    "cf-ray",                  // Cloudflare Ray ID
    "cf-request-id",           // Cloudflare request ID
    "cf-request-ip",          // Cloudflare request IP
    "cf-request-ipcountry",   // Cloudflare request IP country
    "cf-visitor",              // Cloudflare visitor information
    "x-real-ip",               // Real IP header
    "host"                     // Host header (set automatically)
]);

/**
 * Fetch2 class providing fetch-compatible API for cloudflare-stealth
 * 
 * This class wraps the WASM implementation of cloudflare-stealth and provides a
 * fetch-compatible interface. It handles header management, request
 * processing, and provides both instance and static methods.
 * 
 * @class Fetch2
 * @example
 * // Using static method (recommended)
 * const response = await fetch2("https://example.com", {
 *   method: "GET",
 *   headers: { "Authorization": "Bearer token" }
 * });
 * 
 * // Using instance method
 * const fetcher = new Fetch2();
 * const response = await fetcher.fetch("https://api.example.com/data");
 */
class Fetch2 {
    /** Reference to the WASM fetch2 implementation */
    private wasmFetch2: typeof wasmFetch2;
    
    /** Singleton instance for static method usage */
    private static instance: Fetch2 | null = null;

    /**
     * Creates a new Fetch2 instance
     * 
     * Initializes the Fetch2 wrapper with the WASM implementation.
     * This constructor is typically not called directly; use the static
     * fetch method instead for better performance.
     * 
     * @constructor
     * @example
     * const fetcher = new Fetch2();
     * const response = await fetcher.fetch("https://example.com");
     */
    constructor() {
        this.wasmFetch2 = wasmFetch2;
    }

    /**
     * Removes conflicting headers from target Headers object
     * 
     * This private method removes headers from the target Headers object
     * that have the same keys (case-insensitive) as headers in the source.
     * This prevents duplicate headers and ensures proper header merging.
     * 
     * @private
     * @param {Headers} target - The target Headers object to modify
     * @param {HeadersInit} source - The source headers to check for conflicts
     * 
     * @example
     * const target = new Headers([["content-type", "application/json"]]);
     * const source = [["Content-Type", "text/plain"]]; // Case-insensitive conflict
     * this.removeConflictingHeaders(target, source);
     * // target now has no content-type header
     */
    private removeConflictingHeaders(target: Headers, source: HeadersInit): void {
        const sourceKeys: string[] = [];
        
        // Collect keys from source
        if (source instanceof Headers) {
            for (const [key, value] of source.entries()) {
                sourceKeys.push(key.toLowerCase());
            }
        } else if (Array.isArray(source)) {
            for (const [key, value] of source) {
                sourceKeys.push(key.toLowerCase());
            }
        } else if (typeof source === 'object') {
            for (const [key, value] of Object.entries(source)) {
                if (typeof key === 'string' && typeof value === 'string') {
                    sourceKeys.push(key.toLowerCase());
                }
            }
        }
        
        // Remove conflicting headers from target
        const headersToDelete: string[] = [];
        for (const [key, value] of target.entries()) {
            if (sourceKeys.includes(key.toLowerCase())) {
                headersToDelete.push(key);
            }
        }
        
        // Batch deletion for efficiency
        for (const key of headersToDelete) {
            target.delete(key);
        }
    }

    /**
     * Merges headers from source into target Headers object
     * 
     * This private method adds headers from the source to the target Headers object.
     * It supports all HeadersInit formats: Headers objects, arrays, and plain objects.
     * 
     * @private
     * @param {Headers} target - The target Headers object to modify
     * @param {HeadersInit} source - The source headers to merge
     * 
     * @example
     * const target = new Headers();
     * const source = { "Authorization": "Bearer token", "Content-Type": "application/json" };
     * this.mergeHeaders(target, source);
     * // target now contains the authorization and content-type headers
     */
    private mergeHeaders(target: Headers, source: HeadersInit): void {
        if (source instanceof Headers) {
            for (const [key, value] of source.entries()) {
                target.set(key, value);
            }
        } else if (Array.isArray(source)) {
            // string[][] format
            for (const [key, value] of source) {
                target.set(key, value);
            }
        } else if (typeof source === 'object') {
            // Record<string, string> format
            for (const [key, value] of Object.entries(source)) {
                if (typeof key === 'string' && typeof value === 'string') {
                    target.set(key, value);
                }
            }
        }
    }

    /**
     * Makes an HTTP request using cloudflare-stealth with fetch-compatible API
     * 
     * This method provides a fetch-compatible interface for making HTTP requests
     * through the cloudflare-stealth. It handles URL parsing, header management, body
     * processing, and request forwarding to the WASM implementation.
     * 
     * @param {RequestInfo | URL} input - The URL or Request object to fetch
     * @param {RequestInit} [init={}] - Optional request configuration
     * @returns {Promise<Response>} Promise that resolves to the Response object
     * 
     * @throws {Error} Throws error for invalid URLs or unsupported input types
     * 
     * @example
     * // Simple GET request
     * const response = await fetch2("https://api.example.com/data");
     * 
     * @example
     * // POST request with headers and body
     * const response = await fetch2("https://api.example.com/users", {
     *   method: "POST",
     *   headers: {
     *     "Content-Type": "application/json",
     *     "Authorization": "Bearer token"
     *   },
     *   body: JSON.stringify({ name: "John", email: "john@example.com" })
     * });
     * 
     * @example
     * // Using with Request object
     * const request = new Request("https://api.example.com/data", {
     *   method: "GET",
     *   headers: { "Accept": "application/json" }
     * });
     * const response = await fetch2(request);
     * 
     * @example
     * // Using with URL object
     * const url = new URL("https://api.example.com/search");
     * url.searchParams.set("q", "cloudflare-stealth");
     * const response = await fetch2(url);
     */
    async fetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
        let url: string;
        let method: string = "GET";
        let headers: Headers;
        let body: BodyInit | null = null;
        
        // Extract URL and other information based on input type
        if (typeof input === 'string') {
            // If string, use directly as URL
            url = input;
            headers = new Headers();
        } else if (input instanceof URL) {
            // If URL object, convert to string
            url = input.toString();
            headers = new Headers();
        } else if (input instanceof Request) {
            // If Request object, extract information from Request
            url = input.url;
            method = input.method;
            
            // Get headers from Request (by cloning)
            if (input.headers) {
                headers = new Headers(input.headers);
            } else {
                headers = new Headers();
            }
            
            // Get body from Request (if exists and init.body is not provided)
            if (input.body && !init.body) {
                body = input.body;
            }
        } else {
            // Unknown type - throw error
            throw new Error(`Unsupported input type: ${typeof input}`);
        }
        // URL validation and object creation - at the top of the method
        let urlObj: URL;
        try {
            urlObj = new URL(url);
        } catch (e) {
            throw new Error(`Invalid URL: ${url}`);
        }
        
        // Merge information from init (overrides Request information)
        if (init.method) {
            method = init.method;
        }
        
        // Merge init.headers
        if (init.headers) {
            // First remove conflicting headers from init.headers (case-insensitive)
            this.removeConflictingHeaders(headers, init.headers);
            // Then merge
            this.mergeHeaders(headers, init.headers);
        }
        
        if (init.body) {
            body = init.body;
        }
        
        // Remove ignored headers (case-insensitive) - O(n) complexity
        const headersToDelete: string[] = [];
        for (const [key, value] of headers.entries()) {
            if (IGNORED_HEADERS.has(key.toLowerCase())) {
                headersToDelete.push(key);
            }
        }
        // Batch deletion - more efficient
        for (const key of headersToDelete) {
            headers.delete(key);
        }
        
        // Extract host from URL and add Host header (last, cannot be overridden)
        headers.set("Host", urlObj.host);
        
        // Create Request object
        const requestInit: any = {
            method: method,
            headers: headers
        };
        
        // Add body only if it exists
        if (body !== null) {
            requestInit.body = body;
        }
        
        const request = new Request(url, requestInit);
        
        // Call WASM fetch2 (only Request)
        const response = await this.wasmFetch2(request);
        
        return response;
    }
    
    /**
     * Static method for making HTTP requests using cloudflare-stealth
     * 
     * This static method provides a convenient way to use fetch2 without
     * creating an instance. It uses a singleton pattern internally for
     * better performance and memory efficiency.
     * 
     * @static
     * @param {RequestInfo | URL} input - The URL or Request object to fetch
     * @param {RequestInit} [init={}] - Optional request configuration
     * @returns {Promise<Response>} Promise that resolves to the Response object
     * 
     * @example
     * // Using static method (recommended)
     * const response = await Fetch2.fetch("https://api.example.com/data");
     * 
     * @example
     * // With options
     * const response = await Fetch2.fetch("https://api.example.com/users", {
     *   method: "POST",
     *   headers: { "Content-Type": "application/json" },
     *   body: JSON.stringify({ name: "John" })
     * });
     */
    static async fetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
        if (!Fetch2.instance) {
            Fetch2.instance = new Fetch2();
        }
        return Fetch2.instance.fetch(input, init);
    }
}

/**
 * Global fetch2 function - fetch-compatible API for cloudflare-stealth
 * 
 * This is the main export that provides a fetch-compatible interface
 * for making HTTP requests through cloudflare-stealth. It's equivalent to calling
 * Fetch2.fetch() and is the recommended way to use the library.
 * 
 * @param {RequestInfo | URL} input - The URL or Request object to fetch
 * @param {RequestInit} [init={}] - Optional request configuration
 * @returns {Promise<Response>} Promise that resolves to the Response object
 * 
 * @example
 * import { fetch2 } from './fetch2.js';
 * 
 * // Simple GET request
 * const response = await fetch2("https://api.example.com/data");
 * const data = await response.json();
 * 
 * @example
 * // POST request with authentication
 * const response = await fetch2("https://api.example.com/users", {
 *   method: "POST",
 *   headers: {
 *     "Content-Type": "application/json",
 *     "Authorization": "Bearer your-token"
 *   },
 *   body: JSON.stringify({ name: "John Doe", email: "john@example.com" })
 * });
 */
export const fetch2 = Fetch2.fetch;

/**
 * Fetch2 class export for advanced usage
 * 
 * Export the Fetch2 class for users who need more control over
 * the fetch implementation or want to create multiple instances.
 * 
 * @example
 * import { Fetch2 } from './fetch2.js';
 * 
 * const fetcher = new Fetch2();
 * const response = await fetcher.fetch("https://api.example.com/data");
 */
export { Fetch2 };

/**
 * Default export - same as fetch2 function
 * 
 * Provides a default export for convenience, equivalent to the fetch2 function.
 * 
 * @example
 * import fetch2 from './fetch2.js';
 * const response = await fetch2("https://api.example.com/data");
 */
export default fetch2;
