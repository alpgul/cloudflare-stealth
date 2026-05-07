/**
 * @fileoverview Simple Cloudflare Worker example demonstrating cloudflare-stealth usage
 * 
 * This example shows how to use the cloudflare-stealth library in a Cloudflare Worker
 * environment. It demonstrates the basic usage of the fetch2 function for
 * proxying HTTP requests.
 * 
 * @author cloudflare-stealth
 * @version 1.0.0
 * @since 1.0.0
 */

import { fetch2 } from "../../dist/fetch2.js";
//import { fetch2 } from "../../fetch2.ts";
/**
 * Cloudflare Worker entry point
 * 
 * This is the main handler function that Cloudflare Workers calls for each
 * incoming request. It demonstrates how to use the cloudflare-stealth library to
 * proxy requests to external servers.
 * 
 * @param {Request} request - The incoming HTTP request from the client
 * @param {Object} env - Environment variables and bindings
 * @param {ExecutionContext} ctx - Execution context for the worker
 * @returns {Promise<Response>} The proxied response from the target server
 * 
 * @example
 * // The worker will proxy requests to example.com
 * // GET / -> proxies to https://example.com/
 * // POST /api -> proxies to https://example.com/api
 * 
 * @since 1.0.0
 */
export default {
    async fetch(request, env, ctx) {
        // Test the fetch2 proxy functionality
        if (new URL(request.url).pathname !== "/") {
            return new Response("Not found", { status: 404 });
        }
        const testResponse = await fetch2("https://tls.browserleaks.com/tls", {
            method: "GET",
            headers: request.headers,
            body: request.body,
        });
        
        // Log some aesthetics and summary information about the proxy response
        console.log("✨ cloudflare-stealth example: fetch2 performed a proxy request to https://example.com");
        console.log("📦 Status:", testResponse.status, testResponse.statusText);

        // Optionally log the response headers (display first 5 for brevity)
        let count = 0;
        for (const [key, value] of testResponse.headers) {
            if (count++ >= 5) break;
            console.log(`🔑 Header: ${key} = ${value}`);
        }
        return testResponse;
    },
};