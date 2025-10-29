var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// build/index.js
import { WorkerEntrypoint as ae } from "cloudflare:workers";
import H from "./index_bg.wasm";
import { connect as G } from "cloudflare:sockets";
var r;
var g = 0;
var S = null;
function W() {
  return (S === null || S.byteLength === 0) && (S = new Uint8Array(r.memory.buffer)), S;
}
__name(W, "W");
var j = new TextEncoder();
"encodeInto" in j || (j.encodeInto = function(e, t) {
  let n = j.encode(e);
  return t.set(n), { read: e.length, written: n.length };
});
function m(e, t, n) {
  if (n === void 0) {
    let a = j.encode(e), d = t(a.length, 1) >>> 0;
    return W().subarray(d, d + a.length).set(a), g = a.length, d;
  }
  let _ = e.length, o = t(_, 1) >>> 0, u = W(), c = 0;
  for (; c < _; c++) {
    let a = e.charCodeAt(c);
    if (a > 127)
      break;
    u[o + c] = a;
  }
  if (c !== _) {
    c !== 0 && (e = e.slice(c)), o = n(o, _, _ = c + e.length * 3, 1) >>> 0;
    let a = W().subarray(o + c, o + _), d = j.encodeInto(e, a);
    c += d.written, o = n(o, _, c, 1) >>> 0;
  }
  return g = c, o;
}
__name(m, "m");
var p = null;
function b() {
  return (p === null || p.buffer.detached === true || p.buffer.detached === void 0 && p.buffer !== r.memory.buffer) && (p = new DataView(r.memory.buffer)), p;
}
__name(b, "b");
function L(e) {
  let t = typeof e;
  if (t == "number" || t == "boolean" || e == null)
    return `${e}`;
  if (t == "string")
    return `"${e}"`;
  if (t == "symbol") {
    let o = e.description;
    return o == null ? "Symbol" : `Symbol(${o})`;
  }
  if (t == "function") {
    let o = e.name;
    return typeof o == "string" && o.length > 0 ? `Function(${o})` : "Function";
  }
  if (Array.isArray(e)) {
    let o = e.length, u = "[";
    o > 0 && (u += L(e[0]));
    for (let c = 1; c < o; c++)
      u += ", " + L(e[c]);
    return u += "]", u;
  }
  let n = /\[object ([^\]]+)\]/.exec(toString.call(e)), _;
  if (n && n.length > 1)
    _ = n[1];
  else
    return toString.call(e);
  if (_ == "Object")
    try {
      return "Object(" + JSON.stringify(e) + ")";
    } catch {
      return "Object";
    }
  return e instanceof Error ? `${e.name}: ${e.message}
${e.stack}` : _;
}
__name(L, "L");
function f(e) {
  return e == null;
}
__name(f, "f");
var V = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
V.decode();
function K(e, t) {
  return V.decode(W().subarray(e, e + t));
}
__name(K, "K");
function l(e, t) {
  return e = e >>> 0, K(e, t);
}
__name(l, "l");
function w(e) {
  let t = r.__externref_table_alloc();
  return r.__wbindgen_externrefs.set(t, e), t;
}
__name(w, "w");
function s(e, t) {
  try {
    return e.apply(this, t);
  } catch (n) {
    let _ = w(n);
    r.__wbindgen_exn_store(_);
  }
}
__name(s, "s");
function P(e, t) {
  return e = e >>> 0, W().subarray(e / 1, e / 1 + t);
}
__name(P, "P");
var D = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e) => {
  e.instance === i && e.dtor(e.a, e.b);
});
function Q(e, t, n, _) {
  let o = { a: e, b: t, cnt: 1, dtor: n, instance: i }, u = /* @__PURE__ */ __name((...c) => {
    if (o.instance !== i)
      throw new Error("Cannot invoke closure from previous WASM instance");
    o.cnt++;
    let a = o.a;
    o.a = 0;
    try {
      return _(a, o.b, ...c);
    } finally {
      o.a = a, u._wbg_cb_unref();
    }
  }, "u");
  return u._wbg_cb_unref = () => {
    --o.cnt === 0 && (o.dtor(o.a, o.b), o.a = 0, D.unregister(o));
  }, D.register(u, o, o), u;
}
__name(Q, "Q");
function B(e) {
  return r.fetch2(e);
}
__name(B, "B");
function U(e) {
  r.setPanicHook(e);
}
__name(U, "U");
function X(e, t) {
  e = e >>> 0;
  let n = b(), _ = [];
  for (let o = e; o < e + 4 * t; o += 4)
    _.push(r.__wbindgen_externrefs.get(n.getUint32(o, true)));
  return r.__externref_drop_slice(e, t), _;
}
__name(X, "X");
function Y(e, t) {
  let n = t(e.length * 4, 4) >>> 0;
  for (let _ = 0; _ < e.length; _++) {
    let o = w(e[_]);
    b().setUint32(n + 4 * _, o, true);
  }
  return g = e.length, n;
}
__name(Y, "Y");
function Z(e, t, n) {
  r.wasm_bindgen__convert__closures_____invoke__he87dc3d386a20d87(e, t, n);
}
__name(Z, "Z");
function ee(e, t, n, _) {
  r.wasm_bindgen__convert__closures_____invoke__hb7212ed9f4b56775(e, t, n, _);
}
__name(ee, "ee");
var te = ["bytes"];
var i = 0;
function $() {
  i++, p = null, S = null, typeof numBytesDecoded < "u" && (numBytesDecoded = 0), typeof g < "u" && (g = 0), r = new WebAssembly.Instance(H, N).exports, r.__wbindgen_start();
}
__name($, "$");
var ne = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: e, instance: t }) => {
  t === i && r.__wbg_containerstartupoptions_free(e >>> 0, 1);
});
var _a;
var v = (_a = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ne.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_containerstartupoptions_free(t, 0);
  }
  get entrypoint() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = r.__wbg_get_containerstartupoptions_entrypoint(this.__wbg_ptr);
    var n = X(t[0], t[1]).slice();
    return r.__wbindgen_free(t[0], t[1] * 4, 4), n;
  }
  set entrypoint(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    let n = Y(t, r.__wbindgen_malloc), _ = g;
    r.__wbg_set_containerstartupoptions_entrypoint(this.__wbg_ptr, n, _);
  }
  get enableInternet() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = r.__wbg_get_containerstartupoptions_enableInternet(this.__wbg_ptr);
    return t === 16777215 ? void 0 : t !== 0;
  }
  set enableInternet(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_containerstartupoptions_enableInternet(this.__wbg_ptr, f(t) ? 16777215 : t ? 1 : 0);
  }
  get env() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.__wbg_get_containerstartupoptions_env(this.__wbg_ptr);
  }
  set env(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_containerstartupoptions_env(this.__wbg_ptr, t);
  }
}, __name(_a, "v"), _a);
Symbol.dispose && (v.prototype[Symbol.dispose] = v.prototype.free);
var re = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: e, instance: t }) => {
  t === i && r.__wbg_intounderlyingbytesource_free(e >>> 0, 1);
});
var _a2;
var x = (_a2 = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, re.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_intounderlyingbytesource_free(t, 0);
  }
  get type() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = r.intounderlyingbytesource_type(this.__wbg_ptr);
    return te[t];
  }
  get autoAllocateChunkSize() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr) >>> 0;
  }
  start(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.intounderlyingbytesource_start(this.__wbg_ptr, t);
  }
  pull(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.intounderlyingbytesource_pull(this.__wbg_ptr, t);
  }
  cancel() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = this.__destroy_into_raw();
    r.intounderlyingbytesource_cancel(t);
  }
}, __name(_a2, "x"), _a2);
Symbol.dispose && (x.prototype[Symbol.dispose] = x.prototype.free);
var _e = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: e, instance: t }) => {
  t === i && r.__wbg_intounderlyingsink_free(e >>> 0, 1);
});
var _a3;
var I = (_a3 = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, _e.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_intounderlyingsink_free(t, 0);
  }
  write(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.intounderlyingsink_write(this.__wbg_ptr, t);
  }
  close() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = this.__destroy_into_raw();
    return r.intounderlyingsink_close(t);
  }
  abort(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    let n = this.__destroy_into_raw();
    return r.intounderlyingsink_abort(n, t);
  }
}, __name(_a3, "I"), _a3);
Symbol.dispose && (I.prototype[Symbol.dispose] = I.prototype.free);
var q = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: e, instance: t }) => {
  t === i && r.__wbg_intounderlyingsource_free(e >>> 0, 1);
});
var _a4;
var h = (_a4 = class {
  static __wrap(t) {
    t = t >>> 0;
    let n = Object.create(_a4.prototype);
    return n.__wbg_ptr = t, n.__wbg_inst = i, q.register(n, { ptr: t, instance: i }, n), n;
  }
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, q.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_intounderlyingsource_free(t, 0);
  }
  pull(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.intounderlyingsource_pull(this.__wbg_ptr, t);
  }
  cancel() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = this.__destroy_into_raw();
    r.intounderlyingsource_cancel(t);
  }
}, __name(_a4, "e"), _a4);
Symbol.dispose && (h.prototype[Symbol.dispose] = h.prototype.free);
var oe = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: e, instance: t }) => {
  t === i && r.__wbg_minifyconfig_free(e >>> 0, 1);
});
var _a5;
var R = (_a5 = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, oe.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_minifyconfig_free(t, 0);
  }
  get js() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.__wbg_get_minifyconfig_js(this.__wbg_ptr) !== 0;
  }
  set js(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_minifyconfig_js(this.__wbg_ptr, t);
  }
  get html() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.__wbg_get_minifyconfig_html(this.__wbg_ptr) !== 0;
  }
  set html(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_minifyconfig_html(this.__wbg_ptr, t);
  }
  get css() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.__wbg_get_minifyconfig_css(this.__wbg_ptr) !== 0;
  }
  set css(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_minifyconfig_css(this.__wbg_ptr, t);
  }
}, __name(_a5, "R"), _a5);
Symbol.dispose && (R.prototype[Symbol.dispose] = R.prototype.free);
var ie = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: e, instance: t }) => {
  t === i && r.__wbg_r2range_free(e >>> 0, 1);
});
var _a6;
var E = (_a6 = class {
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ie.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_r2range_free(t, 0);
  }
  get offset() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = r.__wbg_get_r2range_offset(this.__wbg_ptr);
    return t[0] === 0 ? void 0 : t[1];
  }
  set offset(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_r2range_offset(this.__wbg_ptr, !f(t), f(t) ? 0 : t);
  }
  get length() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = r.__wbg_get_r2range_length(this.__wbg_ptr);
    return t[0] === 0 ? void 0 : t[1];
  }
  set length(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_r2range_length(this.__wbg_ptr, !f(t), f(t) ? 0 : t);
  }
  get suffix() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = r.__wbg_get_r2range_suffix(this.__wbg_ptr);
    return t[0] === 0 ? void 0 : t[1];
  }
  set suffix(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_r2range_suffix(this.__wbg_ptr, !f(t), f(t) ? 0 : t);
  }
}, __name(_a6, "E"), _a6);
Symbol.dispose && (E.prototype[Symbol.dispose] = E.prototype.free);
var N = { __wbindgen_placeholder__: { __wbg_String_8f0eb39a4a4c2f66: function(e, t) {
  let n = String(t), _ = m(n, r.__wbindgen_malloc, r.__wbindgen_realloc), o = g;
  b().setInt32(e + 4, o, true), b().setInt32(e + 0, _, true);
}, __wbg___wbindgen_debug_string_df47ffb5e35e6763: function(e, t) {
  let n = L(t), _ = m(n, r.__wbindgen_malloc, r.__wbindgen_realloc), o = g;
  b().setInt32(e + 4, o, true), b().setInt32(e + 0, _, true);
}, __wbg___wbindgen_is_falsy_46b8d2f2aba49112: function(e) {
  return !e;
}, __wbg___wbindgen_is_function_ee8a6c5833c90377: function(e) {
  return typeof e == "function";
}, __wbg___wbindgen_is_object_c818261d21f283a4: function(e) {
  let t = e;
  return typeof t == "object" && t !== null;
}, __wbg___wbindgen_is_string_fbb76cb2940daafd: function(e) {
  return typeof e == "string";
}, __wbg___wbindgen_is_undefined_2d472862bd29a478: function(e) {
  return e === void 0;
}, __wbg___wbindgen_string_get_e4f06c90489ad01b: function(e, t) {
  let n = t, _ = typeof n == "string" ? n : void 0;
  var o = f(_) ? 0 : m(_, r.__wbindgen_malloc, r.__wbindgen_realloc), u = g;
  b().setInt32(e + 4, u, true), b().setInt32(e + 0, o, true);
}, __wbg___wbindgen_throw_b855445ff6a94295: function(e, t) {
  throw new Error(l(e, t));
}, __wbg__wbg_cb_unref_2454a539ea5790d9: function(e) {
  e._wbg_cb_unref();
}, __wbg_body_134fbdf9222264fa: function(e) {
  let t = e.body;
  return f(t) ? 0 : w(t);
}, __wbg_buffer_ccc4520b36d3ccf4: function(e) {
  return e.buffer;
}, __wbg_byobRequest_2344e6975f27456e: function(e) {
  let t = e.byobRequest;
  return f(t) ? 0 : w(t);
}, __wbg_byteLength_bcd42e4025299788: function(e) {
  return e.byteLength;
}, __wbg_byteOffset_ca3a6cf7944b364b: function(e) {
  return e.byteOffset;
}, __wbg_call_525440f72fbfc0ea: function() {
  return s(function(e, t, n) {
    return e.call(t, n);
  }, arguments);
}, __wbg_call_e762c39fa8ea36bf: function() {
  return s(function(e, t) {
    return e.call(t);
  }, arguments);
}, __wbg_cancel_48ab6f9dc366e369: function(e) {
  return e.cancel();
}, __wbg_catch_943836faa5d29bfb: function(e, t) {
  return e.catch(t);
}, __wbg_cause_2551549fc39b3b73: function(e) {
  return e.cause;
}, __wbg_cf_909cdf99a01f342e: function() {
  return s(function(e) {
    let t = e.cf;
    return f(t) ? 0 : w(t);
  }, arguments);
}, __wbg_close_5a6caed3231b68cd: function() {
  return s(function(e) {
    e.close();
  }, arguments);
}, __wbg_close_6956df845478561a: function() {
  return s(function(e) {
    e.close();
  }, arguments);
}, __wbg_close_dd3c97459a36cc60: function(e) {
  return e.close();
}, __wbg_connect_13f39c64b4dba24b: function() {
  return s(function(e, t) {
    return G(e, t);
  }, arguments);
}, __wbg_crypto_574e78ad8b13b65f: function(e) {
  return e.crypto;
}, __wbg_done_2042aa2670fb1db1: function(e) {
  return e.done;
}, __wbg_enqueue_7b18a650aec77898: function() {
  return s(function(e, t) {
    e.enqueue(t);
  }, arguments);
}, __wbg_entries_e383c0065742ec0c: function(e) {
  return e.entries();
}, __wbg_error_6f1d0762f6c8ae2f: function(e, t) {
  console.error(e, t);
}, __wbg_error_7534b8e9a36f1ab4: function(e, t) {
  let n, _;
  try {
    n = e, _ = t, console.error(l(e, t));
  } finally {
    r.__wbindgen_free(n, _, 1);
  }
}, __wbg_error_a7f8fbb0523dae15: function(e) {
  console.error(e);
}, __wbg_getRandomValues_b8f5dbd5f3995a9e: function() {
  return s(function(e, t) {
    e.getRandomValues(t);
  }, arguments);
}, __wbg_getReader_15e2d3098e32c359: function(e) {
  return e.getReader();
}, __wbg_getReader_48e00749fe3f6089: function() {
  return s(function(e) {
    return e.getReader();
  }, arguments);
}, __wbg_getWriter_c891ce50cc187493: function() {
  return s(function(e) {
    return e.getWriter();
  }, arguments);
}, __wbg_get_7bed016f185add81: function(e, t) {
  return e[t >>> 0];
}, __wbg_get_done_a0463af43a1fc764: function(e) {
  let t = e.done;
  return f(t) ? 16777215 : t ? 1 : 0;
}, __wbg_get_efcb449f58ec27c2: function() {
  return s(function(e, t) {
    return Reflect.get(e, t);
  }, arguments);
}, __wbg_get_value_5ce96c9f81ce7398: function(e) {
  return e.value;
}, __wbg_headers_7ae6dbb1272f8fc6: function(e) {
  return e.headers;
}, __wbg_instanceof_Error_a944ec10920129e2: function(e) {
  let t;
  try {
    t = e instanceof Error;
  } catch {
    t = false;
  }
  return t;
}, __wbg_instanceof_ReadableStreamDefaultReader_33a4601dd218c69d: function(e) {
  let t;
  try {
    t = e instanceof ReadableStreamDefaultReader;
  } catch {
    t = false;
  }
  return t;
}, __wbg_instanceof_ReadableStream_c34776a5fb889c65: function(e) {
  let t;
  try {
    t = e instanceof ReadableStream;
  } catch {
    t = false;
  }
  return t;
}, __wbg_length_69bca3cb64fc8748: function(e) {
  return e.length;
}, __wbg_log_8cec76766b8c0e33: function(e) {
  console.log(e);
}, __wbg_method_07a9b3454994db22: function(e, t) {
  let n = t.method, _ = m(n, r.__wbindgen_malloc, r.__wbindgen_realloc), o = g;
  b().setInt32(e + 4, o, true), b().setInt32(e + 0, _, true);
}, __wbg_msCrypto_a61aeb35a24c1329: function(e) {
  return e.msCrypto;
}, __wbg_new_1acc0b6eea89d040: function() {
  return new Object();
}, __wbg_new_3c3d849046688a66: function(e, t) {
  try {
    var n = { a: e, b: t }, _ = /* @__PURE__ */ __name((u, c) => {
      let a = n.a;
      n.a = 0;
      try {
        return ee(a, n.b, u, c);
      } finally {
        n.a = a;
      }
    }, "_");
    return new Promise(_);
  } finally {
    n.a = n.b = 0;
  }
}, __wbg_new_8a6f238a6ece86ea: function() {
  return new Error();
}, __wbg_new_9edf9838a2def39c: function() {
  return s(function() {
    return new Headers();
  }, arguments);
}, __wbg_new_a7442b4b19c1a356: function(e, t) {
  return new Error(l(e, t));
}, __wbg_new_from_slice_92f4d78ca282a2d2: function(e, t) {
  return new Uint8Array(P(e, t));
}, __wbg_new_no_args_ee98eee5275000a4: function(e, t) {
  return new Function(l(e, t));
}, __wbg_new_with_byte_offset_and_length_46e3e6a5e9f9e89b: function(e, t, n) {
  return new Uint8Array(e, t >>> 0, n >>> 0);
}, __wbg_new_with_into_underlying_source_b47f6a6a596a7f24: function(e, t) {
  return new ReadableStream(h.__wrap(e), t);
}, __wbg_new_with_length_01aa0dc35aa13543: function(e) {
  return new Uint8Array(e >>> 0);
}, __wbg_new_with_opt_buffer_source_and_init_d7e792cdf59c8ea6: function() {
  return s(function(e, t) {
    return new Response(e, t);
  }, arguments);
}, __wbg_new_with_opt_readable_stream_and_init_b3dac7204db32cac: function() {
  return s(function(e, t) {
    return new Response(e, t);
  }, arguments);
}, __wbg_new_with_opt_str_and_init_271896583401be6f: function() {
  return s(function(e, t, n) {
    return new Response(e === 0 ? void 0 : l(e, t), n);
  }, arguments);
}, __wbg_next_020810e0ae8ebcb0: function() {
  return s(function(e) {
    return e.next();
  }, arguments);
}, __wbg_node_905d3e251edff8a2: function(e) {
  return e.node;
}, __wbg_now_793306c526e2e3b6: function() {
  return Date.now();
}, __wbg_opened_e8d7733e4bb7081e: function() {
  return s(function(e) {
    return e.opened;
  }, arguments);
}, __wbg_process_dc0fbacc7c1c06f7: function(e) {
  return e.process;
}, __wbg_prototypesetcall_2a6620b6922694b2: function(e, t, n) {
  Uint8Array.prototype.set.call(P(e, t), n);
}, __wbg_queueMicrotask_34d692c25c47d05b: function(e) {
  return e.queueMicrotask;
}, __wbg_queueMicrotask_9d76cacb20c84d58: function(e) {
  queueMicrotask(e);
}, __wbg_randomFillSync_ac0988aba3254290: function() {
  return s(function(e, t) {
    e.randomFillSync(t);
  }, arguments);
}, __wbg_read_48f1593df542f968: function(e) {
  return e.read();
}, __wbg_readable_a44199f2cc75b645: function() {
  return s(function(e) {
    return e.readable;
  }, arguments);
}, __wbg_releaseLock_5d0b5a68887b891d: function(e) {
  e.releaseLock();
}, __wbg_releaseLock_b6532de53da4cce6: function(e) {
  e.releaseLock();
}, __wbg_require_60cc747a6bc5215a: function() {
  return s(function() {
    return module.require;
  }, arguments);
}, __wbg_resolve_caf97c30b83f7053: function(e) {
  return Promise.resolve(e);
}, __wbg_respond_0f4dbf5386f5c73e: function() {
  return s(function(e, t) {
    e.respond(t >>> 0);
  }, arguments);
}, __wbg_set_8b342d8cd9d2a02c: function() {
  return s(function(e, t, n, _, o) {
    e.set(l(t, n), l(_, o));
  }, arguments);
}, __wbg_set_9e6516df7b7d0f19: function(e, t, n) {
  e.set(P(t, n));
}, __wbg_set_c2abbebe8b9ebee1: function() {
  return s(function(e, t, n) {
    return Reflect.set(e, t, n);
  }, arguments);
}, __wbg_set_headers_107379072e02fee5: function(e, t) {
  e.headers = t;
}, __wbg_set_high_water_mark_5142ac1d2fb46365: function(e, t) {
  e.highWaterMark = t;
}, __wbg_set_status_886bf143c25d0706: function(e, t) {
  e.status = t;
}, __wbg_stack_0ed75d68575b0f3c: function(e, t) {
  let n = t.stack, _ = m(n, r.__wbindgen_malloc, r.__wbindgen_realloc), o = g;
  b().setInt32(e + 4, o, true), b().setInt32(e + 0, _, true);
}, __wbg_static_accessor_GLOBAL_89e1d9ac6a1b250e: function() {
  let e = typeof global > "u" ? null : global;
  return f(e) ? 0 : w(e);
}, __wbg_static_accessor_GLOBAL_THIS_8b530f326a9e48ac: function() {
  let e = typeof globalThis > "u" ? null : globalThis;
  return f(e) ? 0 : w(e);
}, __wbg_static_accessor_SELF_6fdf4b64710cc91b: function() {
  let e = typeof self > "u" ? null : self;
  return f(e) ? 0 : w(e);
}, __wbg_static_accessor_WINDOW_b45bfc5a37f6cfa2: function() {
  let e = typeof window > "u" ? null : window;
  return f(e) ? 0 : w(e);
}, __wbg_subarray_480600f3d6a9f26c: function(e, t, n) {
  return e.subarray(t >>> 0, n >>> 0);
}, __wbg_then_4f46f6544e6b4a28: function(e, t) {
  return e.then(t);
}, __wbg_then_70d05cf780a18d77: function(e, t, n) {
  return e.then(t, n);
}, __wbg_toString_8eec07f6f4c057e4: function(e) {
  return e.toString();
}, __wbg_url_3e15bfb59fa6b660: function(e, t) {
  let n = t.url, _ = m(n, r.__wbindgen_malloc, r.__wbindgen_realloc), o = g;
  b().setInt32(e + 4, o, true), b().setInt32(e + 0, _, true);
}, __wbg_value_692627309814bb8c: function(e) {
  return e.value;
}, __wbg_versions_c01dfd4722a88165: function(e) {
  return e.versions;
}, __wbg_view_f6c15ac9fed63bbd: function(e) {
  let t = e.view;
  return f(t) ? 0 : w(t);
}, __wbg_writable_4c2a4f21f74ac302: function() {
  return s(function(e) {
    return e.writable;
  }, arguments);
}, __wbg_write_5f693b62e780062e: function(e, t) {
  return e.write(t);
}, __wbindgen_cast_2241b6af4c4b2941: function(e, t) {
  return l(e, t);
}, __wbindgen_cast_bd249ea5b7ce5dd1: function(e, t) {
  return Q(e, t, r.wasm_bindgen__closure__destroy__h4fba4fb83c696808, Z);
}, __wbindgen_cast_cb9088102bce6b30: function(e, t) {
  return P(e, t);
}, __wbindgen_cast_d6cd19b81560fd6e: function(e) {
  return e;
}, __wbindgen_init_externref_table: function() {
  let e = r.__wbindgen_externrefs, t = e.grow(4);
  e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, true), e.set(t + 3, false);
} } };
var se = new WebAssembly.Instance(H, N);
r = se.exports;
r.__wbindgen_start();
Error.stackTraceLimit = 100;
var k = false;
function J() {
  U && U(function(e) {
    let t = new Error("Rust panic: " + e);
    console.error("Critical", t), k = true;
  });
}
__name(J, "J");
J();
var z = 0;
function C() {
  k && (console.log("Reinitializing Wasm application"), $(), k = false, J(), z++);
}
__name(C, "C");
addEventListener("error", (e) => {
  T(e.error);
});
function T(e) {
  e instanceof WebAssembly.RuntimeError && (console.error("Critical", e), k = true);
}
__name(T, "T");
var _a7;
var O = (_a7 = class extends ae {
}, __name(_a7, "O"), _a7);
O.prototype.fetch2 = B;
var ue = { set: (e, t, n, _) => Reflect.set(e.instance, t, n, _), has: (e, t) => Reflect.has(e.instance, t), deleteProperty: (e, t) => Reflect.deleteProperty(e.instance, t), apply: (e, t, n) => Reflect.apply(e.instance, t, n), construct: (e, t, n) => Reflect.construct(e.instance, t, n), getPrototypeOf: (e) => Reflect.getPrototypeOf(e.instance), setPrototypeOf: (e, t) => Reflect.setPrototypeOf(e.instance, t), isExtensible: (e) => Reflect.isExtensible(e.instance), preventExtensions: (e) => Reflect.preventExtensions(e.instance), getOwnPropertyDescriptor: (e, t) => Reflect.getOwnPropertyDescriptor(e.instance, t), defineProperty: (e, t, n) => Reflect.defineProperty(e.instance, t, n), ownKeys: (e) => Reflect.ownKeys(e.instance) };
var y = { construct(e, t, n) {
  try {
    C();
    let _ = { instance: Reflect.construct(e, t, n), instanceId: z, ctor: e, args: t, newTarget: n };
    return new Proxy(_, { ...ue, get(o, u, c) {
      o.instanceId !== z && (o.instance = Reflect.construct(o.ctor, o.args, o.newTarget), o.instanceId = z);
      let a = Reflect.get(o.instance, u, c);
      return typeof a != "function" ? a : a.constructor === Function ? new Proxy(a, { apply(d, A, M) {
        C();
        try {
          return d.apply(A, M);
        } catch (F) {
          throw T(F), F;
        }
      } }) : new Proxy(a, { async apply(d, A, M) {
        C();
        try {
          return await d.apply(A, M);
        } catch (F) {
          throw T(F), F;
        }
      } });
    } });
  } catch (_) {
    throw k = true, _;
  }
} };
var we = new Proxy(O, y);
var de = new Proxy(v, y);
var le = new Proxy(x, y);
var pe = new Proxy(I, y);
var he = new Proxy(h, y);
var ye = new Proxy(R, y);
var me = new Proxy(E, y);

// fetch2.ts
var wasmFetch2 = we.prototype.fetch2;
var IGNORED_HEADERS = /* @__PURE__ */ new Set([
  "cf-connecting-ip",
  // Cloudflare connecting IP
  "cf-ipcountry",
  // Cloudflare IP country
  "cf-ray",
  // Cloudflare Ray ID
  "cf-request-id",
  // Cloudflare request ID
  "cf-request-ip",
  // Cloudflare request IP
  "cf-request-ipcountry",
  // Cloudflare request IP country
  "cf-visitor",
  // Cloudflare visitor information
  "x-real-ip",
  // Real IP header
  "host"
  // Host header (set automatically)
]);
var _Fetch2 = class _Fetch2 {
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
  removeConflictingHeaders(target, source) {
    const sourceKeys = [];
    if (source instanceof Headers) {
      for (const [key, value] of source.entries()) {
        sourceKeys.push(key.toLowerCase());
      }
    } else if (Array.isArray(source)) {
      for (const [key, value] of source) {
        sourceKeys.push(key.toLowerCase());
      }
    } else if (typeof source === "object") {
      for (const [key, value] of Object.entries(source)) {
        if (typeof key === "string" && typeof value === "string") {
          sourceKeys.push(key.toLowerCase());
        }
      }
    }
    const headersToDelete = [];
    for (const [key, value] of target.entries()) {
      if (sourceKeys.includes(key.toLowerCase())) {
        headersToDelete.push(key);
      }
    }
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
  mergeHeaders(target, source) {
    if (source instanceof Headers) {
      for (const [key, value] of source.entries()) {
        target.set(key, value);
      }
    } else if (Array.isArray(source)) {
      for (const [key, value] of source) {
        target.set(key, value);
      }
    } else if (typeof source === "object") {
      for (const [key, value] of Object.entries(source)) {
        if (typeof key === "string" && typeof value === "string") {
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
  async fetch(input, init = {}) {
    let url;
    let method = "GET";
    let headers;
    let body = null;
    if (typeof input === "string") {
      url = input;
      headers = new Headers();
    } else if (input instanceof URL) {
      url = input.toString();
      headers = new Headers();
    } else if (input instanceof Request) {
      url = input.url;
      method = input.method;
      if (input.headers) {
        headers = new Headers(input.headers);
      } else {
        headers = new Headers();
      }
      if (input.body && !init.body) {
        body = input.body;
      }
    } else {
      throw new Error(`Unsupported input type: ${typeof input}`);
    }
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      throw new Error(`Invalid URL: ${url}`);
    }
    if (init.method) {
      method = init.method;
    }
    if (init.headers) {
      this.removeConflictingHeaders(headers, init.headers);
      this.mergeHeaders(headers, init.headers);
    }
    if (init.body) {
      body = init.body;
    }
    const headersToDelete = [];
    for (const [key, value] of headers.entries()) {
      if (IGNORED_HEADERS.has(key.toLowerCase())) {
        headersToDelete.push(key);
      }
    }
    for (const key of headersToDelete) {
      headers.delete(key);
    }
    headers.set("Host", urlObj.host);
    const requestInit = {
      method,
      headers
    };
    if (body !== null) {
      requestInit.body = body;
    }
    const request = new Request(url, requestInit);
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
  static async fetch(input, init = {}) {
    if (!_Fetch2.instance) {
      _Fetch2.instance = new _Fetch2();
    }
    return _Fetch2.instance.fetch(input, init);
  }
};
__name(_Fetch2, "Fetch2");
/** Singleton instance for static method usage */
_Fetch2.instance = null;
var Fetch2 = _Fetch2;
var fetch2 = Fetch2.fetch;
var fetch2_default = fetch2;
export {
  Fetch2,
  fetch2_default as default,
  fetch2
};
//# sourceMappingURL=fetch2.js.map
