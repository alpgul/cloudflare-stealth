var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// build/index.js
import { WorkerEntrypoint as nt } from "cloudflare:workers";
import L from "./index_bg.wasm";
import { connect as D } from "cloudflare:sockets";
var r;
var g = 0;
var S = null;
function E() {
  return (S === null || S.byteLength === 0) && (S = new Uint8Array(r.memory.buffer)), S;
}
__name(E, "E");
var W = new TextEncoder();
"encodeInto" in W || (W.encodeInto = function(t, e) {
  let n = W.encode(t);
  return e.set(n), { read: t.length, written: n.length };
});
function h(t, e, n) {
  if (n === void 0) {
    let f = W.encode(t), R = e(f.length, 1) >>> 0;
    return E().subarray(R, R + f.length).set(f), g = f.length, R;
  }
  let i = t.length, _ = e(i, 1) >>> 0, a = E(), c = 0;
  for (; c < i; c++) {
    let f = t.charCodeAt(c);
    if (f > 127)
      break;
    a[_ + c] = f;
  }
  if (c !== i) {
    c !== 0 && (t = t.slice(c)), _ = n(_, i, i = c + t.length * 3, 1) >>> 0;
    let f = E().subarray(_ + c, _ + i), R = W.encodeInto(t, f);
    c += R.written, _ = n(_, i, c, 1) >>> 0;
  }
  return g = c, _;
}
__name(h, "h");
var l = null;
function b() {
  return (l === null || l.buffer.detached === true || l.buffer.detached === void 0 && l.buffer !== r.memory.buffer) && (l = new DataView(r.memory.buffer)), l;
}
__name(b, "b");
function u(t) {
  return t == null;
}
__name(u, "u");
function w(t) {
  let e = r.__externref_table_alloc();
  return r.__wbindgen_export_3.set(e, t), e;
}
__name(w, "w");
function s(t, e) {
  try {
    return t.apply(this, e);
  } catch (n) {
    let i = w(n);
    r.__wbindgen_exn_store(i);
  }
}
__name(s, "s");
var T = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
T.decode();
function q(t, e) {
  return T.decode(E().subarray(t, t + e));
}
__name(q, "q");
function d(t, e) {
  return t = t >>> 0, q(t, e);
}
__name(d, "d");
function j(t, e) {
  return t = t >>> 0, E().subarray(t / 1, t / 1 + e);
}
__name(j, "j");
function k(t) {
  let e = typeof t;
  if (e == "number" || e == "boolean" || t == null)
    return `${t}`;
  if (e == "string")
    return `"${t}"`;
  if (e == "symbol") {
    let _ = t.description;
    return _ == null ? "Symbol" : `Symbol(${_})`;
  }
  if (e == "function") {
    let _ = t.name;
    return typeof _ == "string" && _.length > 0 ? `Function(${_})` : "Function";
  }
  if (Array.isArray(t)) {
    let _ = t.length, a = "[";
    _ > 0 && (a += k(t[0]));
    for (let c = 1; c < _; c++)
      a += ", " + k(t[c]);
    return a += "]", a;
  }
  let n = /\[object ([^\]]+)\]/.exec(toString.call(t)), i;
  if (n && n.length > 1)
    i = n[1];
  else
    return toString.call(t);
  if (i == "Object")
    try {
      return "Object(" + JSON.stringify(t) + ")";
    } catch {
      return "Object";
    }
  return t instanceof Error ? `${t.name}: ${t.message}
${t.stack}` : i;
}
__name(k, "k");
var O = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => {
  t.instance === o && r.__wbindgen_export_6.get(t.dtor)(t.a, t.b);
});
function H(t, e, n, i) {
  let _ = { a: t, b: e, cnt: 1, dtor: n, instance: o }, a = /* @__PURE__ */ __name((...c) => {
    if (_.instance !== o)
      throw new Error("Cannot invoke closure from previous WASM instance");
    _.cnt++;
    let f = _.a;
    _.a = 0;
    try {
      return i(f, _.b, ...c);
    } finally {
      --_.cnt === 0 ? (r.__wbindgen_export_6.get(_.dtor)(f, _.b), O.unregister(_)) : _.a = f;
    }
  }, "a");
  return a.original = _, O.register(a, _, _), a;
}
__name(H, "H");
function ot(t) {
  return r.fetch2(t);
}
__name(ot, "ot");
function V(t, e) {
  t = t >>> 0;
  let n = b(), i = [];
  for (let _ = t; _ < t + 4 * e; _ += 4)
    i.push(r.__wbindgen_export_3.get(n.getUint32(_, true)));
  return r.__externref_drop_slice(t, e), i;
}
__name(V, "V");
function B(t, e) {
  let n = e(t.length * 4, 4) >>> 0;
  for (let i = 0; i < t.length; i++) {
    let _ = w(t[i]);
    b().setUint32(n + 4 * i, _, true);
  }
  return g = t.length, n;
}
__name(B, "B");
function z(t) {
  r.setPanicHook(t);
}
__name(z, "z");
function $(t, e, n) {
  r.closure1220_externref_shim(t, e, n);
}
__name($, "$");
function N(t, e, n, i) {
  r.closure1252_externref_shim(t, e, n, i);
}
__name(N, "N");
var J = ["bytes"];
var o = 0;
var K = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: t, instance: e }) => {
  e === o && r.__wbg_containerstartupoptions_free(t >>> 0, 1);
});
var _a;
var y = (_a = class {
  __destroy_into_raw() {
    let e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, K.unregister(this), e;
  }
  free() {
    let e = this.__destroy_into_raw();
    r.__wbg_containerstartupoptions_free(e, 0);
  }
  get entrypoint() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = r.__wbg_get_containerstartupoptions_entrypoint(this.__wbg_ptr);
    var n = V(e[0], e[1]).slice();
    return r.__wbindgen_free(e[0], e[1] * 4, 4), n;
  }
  set entrypoint(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    let n = B(e, r.__wbindgen_malloc), i = g;
    r.__wbg_set_containerstartupoptions_entrypoint(this.__wbg_ptr, n, i);
  }
  get enableInternet() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = r.__wbg_get_containerstartupoptions_enableInternet(this.__wbg_ptr);
    return e === 16777215 ? void 0 : e !== 0;
  }
  set enableInternet(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_containerstartupoptions_enableInternet(this.__wbg_ptr, u(e) ? 16777215 : e ? 1 : 0);
  }
  get env() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.__wbg_get_containerstartupoptions_env(this.__wbg_ptr);
  }
  set env(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_containerstartupoptions_env(this.__wbg_ptr, e);
  }
}, __name(_a, "y"), _a);
Symbol.dispose && (y.prototype[Symbol.dispose] = y.prototype.free);
var Q = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: t, instance: e }) => {
  e === o && r.__wbg_intounderlyingbytesource_free(t >>> 0, 1);
});
var _a2;
var m = (_a2 = class {
  __destroy_into_raw() {
    let e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Q.unregister(this), e;
  }
  free() {
    let e = this.__destroy_into_raw();
    r.__wbg_intounderlyingbytesource_free(e, 0);
  }
  get type() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = r.intounderlyingbytesource_type(this.__wbg_ptr);
    return J[e];
  }
  get autoAllocateChunkSize() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr) >>> 0;
  }
  start(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.intounderlyingbytesource_start(this.__wbg_ptr, e);
  }
  pull(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.intounderlyingbytesource_pull(this.__wbg_ptr, e);
  }
  cancel() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = this.__destroy_into_raw();
    r.intounderlyingbytesource_cancel(e);
  }
}, __name(_a2, "m"), _a2);
Symbol.dispose && (m.prototype[Symbol.dispose] = m.prototype.free);
var X = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: t, instance: e }) => {
  e === o && r.__wbg_intounderlyingsink_free(t >>> 0, 1);
});
var _a3;
var x = (_a3 = class {
  __destroy_into_raw() {
    let e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, X.unregister(this), e;
  }
  free() {
    let e = this.__destroy_into_raw();
    r.__wbg_intounderlyingsink_free(e, 0);
  }
  write(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.intounderlyingsink_write(this.__wbg_ptr, e);
  }
  close() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = this.__destroy_into_raw();
    return r.intounderlyingsink_close(e);
  }
  abort(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    let n = this.__destroy_into_raw();
    return r.intounderlyingsink_abort(n, e);
  }
}, __name(_a3, "x"), _a3);
Symbol.dispose && (x.prototype[Symbol.dispose] = x.prototype.free);
var U = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: t, instance: e }) => {
  e === o && r.__wbg_intounderlyingsource_free(t >>> 0, 1);
});
var _a4;
var p = (_a4 = class {
  static __wrap(e) {
    e = e >>> 0;
    let n = Object.create(_a4.prototype);
    return n.__wbg_ptr = e, n.__wbg_inst = o, U.register(n, { ptr: e, instance: o }, n), n;
  }
  __destroy_into_raw() {
    let e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, U.unregister(this), e;
  }
  free() {
    let e = this.__destroy_into_raw();
    r.__wbg_intounderlyingsource_free(e, 0);
  }
  pull(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.intounderlyingsource_pull(this.__wbg_ptr, e);
  }
  cancel() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = this.__destroy_into_raw();
    r.intounderlyingsource_cancel(e);
  }
}, __name(_a4, "t"), _a4);
Symbol.dispose && (p.prototype[Symbol.dispose] = p.prototype.free);
var Y = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: t, instance: e }) => {
  e === o && r.__wbg_minifyconfig_free(t >>> 0, 1);
});
var _a5;
var v = (_a5 = class {
  __destroy_into_raw() {
    let e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Y.unregister(this), e;
  }
  free() {
    let e = this.__destroy_into_raw();
    r.__wbg_minifyconfig_free(e, 0);
  }
  get js() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.__wbg_get_minifyconfig_js(this.__wbg_ptr) !== 0;
  }
  set js(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_minifyconfig_js(this.__wbg_ptr, e);
  }
  get html() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.__wbg_get_minifyconfig_html(this.__wbg_ptr) !== 0;
  }
  set html(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_minifyconfig_html(this.__wbg_ptr, e);
  }
  get css() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    return r.__wbg_get_minifyconfig_css(this.__wbg_ptr) !== 0;
  }
  set css(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_minifyconfig_css(this.__wbg_ptr, e);
  }
}, __name(_a5, "v"), _a5);
Symbol.dispose && (v.prototype[Symbol.dispose] = v.prototype.free);
var Z = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: t, instance: e }) => {
  e === o && r.__wbg_r2range_free(t >>> 0, 1);
});
var _a6;
var I = (_a6 = class {
  __destroy_into_raw() {
    let e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Z.unregister(this), e;
  }
  free() {
    let e = this.__destroy_into_raw();
    r.__wbg_r2range_free(e, 0);
  }
  get offset() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = r.__wbg_get_r2range_offset(this.__wbg_ptr);
    return e[0] === 0 ? void 0 : e[1];
  }
  set offset(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_r2range_offset(this.__wbg_ptr, !u(e), u(e) ? 0 : e);
  }
  get length() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = r.__wbg_get_r2range_length(this.__wbg_ptr);
    return e[0] === 0 ? void 0 : e[1];
  }
  set length(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_r2range_length(this.__wbg_ptr, !u(e), u(e) ? 0 : e);
  }
  get suffix() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = r.__wbg_get_r2range_suffix(this.__wbg_ptr);
    return e[0] === 0 ? void 0 : e[1];
  }
  set suffix(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o)
      throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_r2range_suffix(this.__wbg_ptr, !u(e), u(e) ? 0 : e);
  }
}, __name(_a6, "I"), _a6);
Symbol.dispose && (I.prototype[Symbol.dispose] = I.prototype.free);
var P = { __wbindgen_placeholder__: { __wbg_String_8f0eb39a4a4c2f66: function(t, e) {
  let n = String(e), i = h(n, r.__wbindgen_malloc, r.__wbindgen_realloc), _ = g;
  b().setInt32(t + 4, _, true), b().setInt32(t + 0, i, true);
}, __wbg_body_78d0ac75aa69aa32: function(t) {
  let e = t.body;
  return u(e) ? 0 : w(e);
}, __wbg_buffer_8d40b1d762fb3c66: function(t) {
  return t.buffer;
}, __wbg_byobRequest_2c036bceca1e6037: function(t) {
  let e = t.byobRequest;
  return u(e) ? 0 : w(e);
}, __wbg_byteLength_331a6b5545834024: function(t) {
  return t.byteLength;
}, __wbg_byteOffset_49a5b5608000358b: function(t) {
  return t.byteOffset;
}, __wbg_call_13410aac570ffff7: function() {
  return s(function(t, e) {
    return t.call(e);
  }, arguments);
}, __wbg_call_a5400b25a865cfd8: function() {
  return s(function(t, e, n) {
    return t.call(e, n);
  }, arguments);
}, __wbg_cancel_8bb5b8f4906b658a: function(t) {
  return t.cancel();
}, __wbg_catch_c80ecae90cb8ed4e: function(t, e) {
  return t.catch(e);
}, __wbg_cause_61050b860539c54b: function(t) {
  return t.cause;
}, __wbg_cf_b1ad1dbf5d915558: function() {
  return s(function(t) {
    let e = t.cf;
    return u(e) ? 0 : w(e);
  }, arguments);
}, __wbg_close_37f6f0a06ac796c6: function(t) {
  return t.close();
}, __wbg_close_cccada6053ee3a65: function() {
  return s(function(t) {
    t.close();
  }, arguments);
}, __wbg_close_d71a78219dc23e91: function() {
  return s(function(t) {
    t.close();
  }, arguments);
}, __wbg_connect_3c97107b1584d4a7: function() {
  return s(function(t, e) {
    return D(t, e);
  }, arguments);
}, __wbg_crypto_574e78ad8b13b65f: function(t) {
  return t.crypto;
}, __wbg_done_75ed0ee6dd243d9d: function(t) {
  return t.done;
}, __wbg_enqueue_452bc2343d1c2ff9: function() {
  return s(function(t, e) {
    t.enqueue(e);
  }, arguments);
}, __wbg_entries_52c6afbe1794bc36: function(t) {
  return t.entries();
}, __wbg_error_4700bbeb78363714: function(t, e) {
  console.error(t, e);
}, __wbg_error_7534b8e9a36f1ab4: function(t, e) {
  let n, i;
  try {
    n = t, i = e, console.error(d(t, e));
  } finally {
    r.__wbindgen_free(n, i, 1);
  }
}, __wbg_error_99981e16d476aa5c: function(t) {
  console.error(t);
}, __wbg_getRandomValues_b8f5dbd5f3995a9e: function() {
  return s(function(t, e) {
    t.getRandomValues(e);
  }, arguments);
}, __wbg_getReader_48e00749fe3f6089: function() {
  return s(function(t) {
    return t.getReader();
  }, arguments);
}, __wbg_getReader_b31811cbe47772c1: function(t) {
  return t.getReader();
}, __wbg_getWriter_03d7689e275ac6a4: function() {
  return s(function(t) {
    return t.getWriter();
  }, arguments);
}, __wbg_get_0da715ceaecea5c8: function(t, e) {
  return t[e >>> 0];
}, __wbg_get_458e874b43b18b25: function() {
  return s(function(t, e) {
    return Reflect.get(t, e);
  }, arguments);
}, __wbg_getdone_f026246f6bbe58d3: function(t) {
  let e = t.done;
  return u(e) ? 16777215 : e ? 1 : 0;
}, __wbg_getvalue_31e5a08f61e5aa42: function(t) {
  return t.value;
}, __wbg_headers_af04c3eb495104ed: function(t) {
  return t.headers;
}, __wbg_instanceof_Error_76149ae9b431750e: function(t) {
  let e;
  try {
    e = t instanceof Error;
  } catch {
    e = false;
  }
  return e;
}, __wbg_instanceof_ReadableStreamDefaultReader_3af4eea5dfde4c26: function(t) {
  let e;
  try {
    e = t instanceof ReadableStreamDefaultReader;
  } catch {
    e = false;
  }
  return e;
}, __wbg_instanceof_ReadableStream_c4b8ebd11b2bc326: function(t) {
  let e;
  try {
    e = t instanceof ReadableStream;
  } catch {
    e = false;
  }
  return e;
}, __wbg_length_6bb7e81f9d7713e4: function(t) {
  return t.length;
}, __wbg_log_6c7b5f4f00b8ce3f: function(t) {
  console.log(t);
}, __wbg_method_8e0e977407edb4c6: function(t, e) {
  let n = e.method, i = h(n, r.__wbindgen_malloc, r.__wbindgen_realloc), _ = g;
  b().setInt32(t + 4, _, true), b().setInt32(t + 0, i, true);
}, __wbg_msCrypto_a61aeb35a24c1329: function(t) {
  return t.msCrypto;
}, __wbg_new_19c25a3f2fa63a02: function() {
  return new Object();
}, __wbg_new_2e3c58a15f39f5f9: function(t, e) {
  try {
    var n = { a: t, b: e }, i = /* @__PURE__ */ __name((a, c) => {
      let f = n.a;
      n.a = 0;
      try {
        return N(f, n.b, a, c);
      } finally {
        n.a = f;
      }
    }, "i");
    return new Promise(i);
  } finally {
    n.a = n.b = 0;
  }
}, __wbg_new_8a6f238a6ece86ea: function() {
  return new Error();
}, __wbg_new_da9dc54c5db29dfa: function(t, e) {
  return new Error(d(t, e));
}, __wbg_new_f6e53210afea8e45: function() {
  return s(function() {
    return new Headers();
  }, arguments);
}, __wbg_newfromslice_074c56947bd43469: function(t, e) {
  return new Uint8Array(j(t, e));
}, __wbg_newnoargs_254190557c45b4ec: function(t, e) {
  return new Function(d(t, e));
}, __wbg_newwithbyteoffsetandlength_e8f53910b4d42b45: function(t, e, n) {
  return new Uint8Array(t, e >>> 0, n >>> 0);
}, __wbg_newwithintounderlyingsource_b47f6a6a596a7f24: function(t, e) {
  return new ReadableStream(p.__wrap(t), e);
}, __wbg_newwithlength_a167dcc7aaa3ba77: function(t) {
  return new Uint8Array(t >>> 0);
}, __wbg_newwithoptbuffersourceandinit_b492b23a1fc82449: function() {
  return s(function(t, e) {
    return new Response(t, e);
  }, arguments);
}, __wbg_newwithoptreadablestreamandinit_438b8943bcc5c115: function() {
  return s(function(t, e) {
    return new Response(t, e);
  }, arguments);
}, __wbg_newwithoptstrandinit_e43b4aa9635e7001: function() {
  return s(function(t, e, n) {
    return new Response(t === 0 ? void 0 : d(t, e), n);
  }, arguments);
}, __wbg_next_692e82279131b03c: function() {
  return s(function(t) {
    return t.next();
  }, arguments);
}, __wbg_node_905d3e251edff8a2: function(t) {
  return t.node;
}, __wbg_now_1e80617bcee43265: function() {
  return Date.now();
}, __wbg_opened_f640a72bf5d9c717: function() {
  return s(function(t) {
    return t.opened;
  }, arguments);
}, __wbg_process_dc0fbacc7c1c06f7: function(t) {
  return t.process;
}, __wbg_prototypesetcall_3d4a26c1ed734349: function(t, e, n) {
  Uint8Array.prototype.set.call(j(t, e), n);
}, __wbg_queueMicrotask_25d0739ac89e8c88: function(t) {
  queueMicrotask(t);
}, __wbg_queueMicrotask_4488407636f5bf24: function(t) {
  return t.queueMicrotask;
}, __wbg_randomFillSync_ac0988aba3254290: function() {
  return s(function(t, e) {
    t.randomFillSync(e);
  }, arguments);
}, __wbg_read_bc925c758aa4d897: function(t) {
  return t.read();
}, __wbg_readable_38a5dcfd06e00a09: function() {
  return s(function(t) {
    return t.readable;
  }, arguments);
}, __wbg_releaseLock_62151472ae632176: function(t) {
  t.releaseLock();
}, __wbg_releaseLock_ff29b586502a8221: function(t) {
  t.releaseLock();
}, __wbg_require_60cc747a6bc5215a: function() {
  return s(function() {
    return module.require;
  }, arguments);
}, __wbg_resolve_4055c623acdd6a1b: function(t) {
  return Promise.resolve(t);
}, __wbg_respond_6c2c4e20ef85138e: function() {
  return s(function(t, e) {
    t.respond(e >>> 0);
  }, arguments);
}, __wbg_set_1353b2a5e96bc48c: function(t, e, n) {
  t.set(j(e, n));
}, __wbg_set_1c17f9738fac2718: function() {
  return s(function(t, e, n, i, _) {
    t.set(d(e, n), d(i, _));
  }, arguments);
}, __wbg_set_453345bcda80b89a: function() {
  return s(function(t, e, n) {
    return Reflect.set(t, e, n);
  }, arguments);
}, __wbg_setheaders_ea17f6abcffa069c: function(t, e) {
  t.headers = e;
}, __wbg_sethighwatermark_3d5961f834647d41: function(t, e) {
  t.highWaterMark = e;
}, __wbg_setstatus_5964ea9c49463997: function(t, e) {
  t.status = e;
}, __wbg_stack_0ed75d68575b0f3c: function(t, e) {
  let n = e.stack, i = h(n, r.__wbindgen_malloc, r.__wbindgen_realloc), _ = g;
  b().setInt32(t + 4, _, true), b().setInt32(t + 0, i, true);
}, __wbg_static_accessor_GLOBAL_8921f820c2ce3f12: function() {
  let t = typeof global > "u" ? null : global;
  return u(t) ? 0 : w(t);
}, __wbg_static_accessor_GLOBAL_THIS_f0a4409105898184: function() {
  let t = typeof globalThis > "u" ? null : globalThis;
  return u(t) ? 0 : w(t);
}, __wbg_static_accessor_SELF_995b214ae681ff99: function() {
  let t = typeof self > "u" ? null : self;
  return u(t) ? 0 : w(t);
}, __wbg_static_accessor_WINDOW_cde3890479c675ea: function() {
  let t = typeof window > "u" ? null : window;
  return u(t) ? 0 : w(t);
}, __wbg_subarray_70fd07feefe14294: function(t, e, n) {
  return t.subarray(e >>> 0, n >>> 0);
}, __wbg_then_b33a773d723afa3e: function(t, e, n) {
  return t.then(e, n);
}, __wbg_then_e22500defe16819f: function(t, e) {
  return t.then(e);
}, __wbg_toString_d8f537919ef401d6: function(t) {
  return t.toString();
}, __wbg_url_79bd91c4e84e8270: function(t, e) {
  let n = e.url, i = h(n, r.__wbindgen_malloc, r.__wbindgen_realloc), _ = g;
  b().setInt32(t + 4, _, true), b().setInt32(t + 0, i, true);
}, __wbg_value_dd9372230531eade: function(t) {
  return t.value;
}, __wbg_versions_c01dfd4722a88165: function(t) {
  return t.versions;
}, __wbg_view_91cc97d57ab30530: function(t) {
  let e = t.view;
  return u(e) ? 0 : w(e);
}, __wbg_wbindgencbdrop_eb10308566512b88: function(t) {
  let e = t.original;
  return e.cnt-- == 1 ? (e.a = 0, true) : false;
}, __wbg_wbindgendebugstring_99ef257a3ddda34d: function(t, e) {
  let n = k(e), i = h(n, r.__wbindgen_malloc, r.__wbindgen_realloc), _ = g;
  b().setInt32(t + 4, _, true), b().setInt32(t + 0, i, true);
}, __wbg_wbindgenisfalsy_03f4059e2ea4ee87: function(t) {
  return !t;
}, __wbg_wbindgenisfunction_8cee7dce3725ae74: function(t) {
  return typeof t == "function";
}, __wbg_wbindgenisobject_307a53c6bd97fbf8: function(t) {
  let e = t;
  return typeof e == "object" && e !== null;
}, __wbg_wbindgenisstring_d4fa939789f003b0: function(t) {
  return typeof t == "string";
}, __wbg_wbindgenisundefined_c4b71d073b92f3c5: function(t) {
  return t === void 0;
}, __wbg_wbindgenstringget_0f16a6ddddef376f: function(t, e) {
  let n = e, i = typeof n == "string" ? n : void 0;
  var _ = u(i) ? 0 : h(i, r.__wbindgen_malloc, r.__wbindgen_realloc), a = g;
  b().setInt32(t + 4, a, true), b().setInt32(t + 0, _, true);
}, __wbg_wbindgenthrow_451ec1a8469d7eb6: function(t, e) {
  throw new Error(d(t, e));
}, __wbg_writable_eb1ff1bb8001323c: function() {
  return s(function(t) {
    return t.writable;
  }, arguments);
}, __wbg_write_2e39e04a4c8c9e9d: function(t, e) {
  return t.write(e);
}, __wbindgen_cast_2241b6af4c4b2941: function(t, e) {
  return d(t, e);
}, __wbindgen_cast_6858675ce130c472: function(t, e) {
  return H(t, e, 1219, $);
}, __wbindgen_cast_cb9088102bce6b30: function(t, e) {
  return j(t, e);
}, __wbindgen_cast_d6cd19b81560fd6e: function(t) {
  return t;
}, __wbindgen_init_externref_table: function() {
  let t = r.__wbindgen_export_3, e = t.grow(4);
  t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
} } };
var tt = new WebAssembly.Instance(L, P);
r = tt.exports;
r.__wbindgen_start();
Error.stackTraceLimit = 100;
var C = null;
function rt() {
  z && z(function(t) {
    C = new Error("Critical Rust panic: " + t), console.error(C);
  });
}
__name(rt, "rt");
rt();
var A = 0;
var F = { construct(t, e, n) {
  let i = { instance: Reflect.construct(t, e, n), instanceId: A, ctor: t, args: e, newTarget: n };
  return new Proxy(i, { get(_, a, c) {
    return _.instanceId !== A && (_.instance = Reflect.construct(_.ctor, _.args, _.newTarget), _.instanceId = A), Reflect.get(_.instance, a, c);
  } });
} };
var ct = new Proxy(y, F);
var ut = new Proxy(m, F);
var at = new Proxy(x, F);
var ft = new Proxy(p, F);
var bt = new Proxy(v, F);
var gt = new Proxy(I, F);

// fetch2.ts
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
    this.wasmFetch2 = ot;
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
   * Makes an HTTP request using cf-proxy with fetch-compatible API
   * 
   * This method provides a fetch-compatible interface for making HTTP requests
   * through the cf-proxy. It handles URL parsing, header management, body
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
   * url.searchParams.set("q", "cf-proxy");
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
   * Static method for making HTTP requests using cf-proxy
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
