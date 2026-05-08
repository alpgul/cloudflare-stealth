var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// build/index.js
import { WorkerEntrypoint as ge } from "cloudflare:workers";
import { connect as Z } from "cloudflare:sockets";
import N from "./index_bg.wasm";
var q = globalThis.__worker_init_state = { criticalError: false, instanceId: 0 };
var _a;
var I = (_a = class {
  __destroy_into_raw() {
    let e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, _e.unregister(this), e;
  }
  free() {
    let e = this.__destroy_into_raw();
    o(), _.__wbg_containerstartupoptions_free(e, 0);
  }
  get enableInternet() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e;
    return o(), e = _.__wbg_get_containerstartupoptions_enableInternet(this.__wbg_ptr), e === 16777215 ? void 0 : e !== 0;
  }
  get entrypoint() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e;
    o(), e = _.__wbg_get_containerstartupoptions_entrypoint(this.__wbg_ptr);
    var t = ae(e[0], e[1]).slice();
    return _.__wbindgen_free(e[0], e[1] * 4, 4), t;
  }
  get env() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e;
    return o(), e = _.__wbg_get_containerstartupoptions_env(this.__wbg_ptr), e;
  }
  set enableInternet(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    o(), _.__wbg_set_containerstartupoptions_enableInternet(this.__wbg_ptr, b(e) ? 16777215 : e ? 1 : 0);
  }
  set entrypoint(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = ue(e, _.__wbindgen_malloc), r = g;
    o(), _.__wbg_set_containerstartupoptions_entrypoint(this.__wbg_ptr, t, r);
  }
  set env(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    o(), _.__wbg_set_containerstartupoptions_env(this.__wbg_ptr, e);
  }
}, __name(_a, "I"), _a);
Symbol.dispose && (I.prototype[Symbol.dispose] = I.prototype.free);
var _a2;
var R = (_a2 = class {
  __destroy_into_raw() {
    let e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ie.unregister(this), e;
  }
  free() {
    let e = this.__destroy_into_raw();
    o(), _.__wbg_intounderlyingbytesource_free(e, 0);
  }
  get autoAllocateChunkSize() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e;
    return o(), e = _.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr), e >>> 0;
  }
  cancel() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = this.__destroy_into_raw();
    o(), _.intounderlyingbytesource_cancel(e);
  }
  pull(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t;
    return o(), t = _.intounderlyingbytesource_pull(this.__wbg_ptr, e), t;
  }
  start(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    o(), _.intounderlyingbytesource_start(this.__wbg_ptr, e);
  }
  get type() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e;
    return o(), e = _.intounderlyingbytesource_type(this.__wbg_ptr), re[e];
  }
}, __name(_a2, "R"), _a2);
Symbol.dispose && (R.prototype[Symbol.dispose] = R.prototype.free);
var _a3;
var E = (_a3 = class {
  __destroy_into_raw() {
    let e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, oe.unregister(this), e;
  }
  free() {
    let e = this.__destroy_into_raw();
    o(), _.__wbg_intounderlyingsink_free(e, 0);
  }
  abort(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t = this.__destroy_into_raw(), r;
    return o(), r = _.intounderlyingsink_abort(t, e), r;
  }
  close() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = this.__destroy_into_raw(), t;
    return o(), t = _.intounderlyingsink_close(e), t;
  }
  write(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t;
    return o(), t = _.intounderlyingsink_write(this.__wbg_ptr, e), t;
  }
}, __name(_a3, "E"), _a3);
Symbol.dispose && (E.prototype[Symbol.dispose] = E.prototype.free);
var _a4;
var v = (_a4 = class {
  static __wrap(e) {
    let t = Object.create(_a4.prototype);
    return t.__wbg_ptr = e, Object.defineProperty(t, "__wbg_inst", { value: s, writable: true }), V.register(t, { ptr: e, instance: s }, t), t;
  }
  __destroy_into_raw() {
    let e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, V.unregister(this), e;
  }
  free() {
    let e = this.__destroy_into_raw();
    o(), _.__wbg_intounderlyingsource_free(e, 0);
  }
  cancel() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e = this.__destroy_into_raw();
    o(), _.intounderlyingsource_cancel(e);
  }
  pull(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let t;
    return o(), t = _.intounderlyingsource_pull(this.__wbg_ptr, e), t;
  }
}, __name(_a4, "n"), _a4);
Symbol.dispose && (v.prototype[Symbol.dispose] = v.prototype.free);
var _a5;
var S = (_a5 = class {
  __destroy_into_raw() {
    let e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, se.unregister(this), e;
  }
  free() {
    let e = this.__destroy_into_raw();
    o(), _.__wbg_minifyconfig_free(e, 0);
  }
  get css() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e;
    return o(), e = _.__wbg_get_minifyconfig_css(this.__wbg_ptr), e !== 0;
  }
  get html() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e;
    return o(), e = _.__wbg_get_minifyconfig_html(this.__wbg_ptr), e !== 0;
  }
  get js() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e;
    return o(), e = _.__wbg_get_minifyconfig_js(this.__wbg_ptr), e !== 0;
  }
  set css(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    o(), _.__wbg_set_minifyconfig_css(this.__wbg_ptr, e);
  }
  set html(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    o(), _.__wbg_set_minifyconfig_html(this.__wbg_ptr, e);
  }
  set js(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    o(), _.__wbg_set_minifyconfig_js(this.__wbg_ptr, e);
  }
}, __name(_a5, "S"), _a5);
Symbol.dispose && (S.prototype[Symbol.dispose] = S.prototype.free);
var _a6;
var F = (_a6 = class {
  __destroy_into_raw() {
    let e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ce.unregister(this), e;
  }
  free() {
    let e = this.__destroy_into_raw();
    o(), _.__wbg_r2range_free(e, 0);
  }
  get length() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e;
    return o(), e = _.__wbg_get_r2range_length(this.__wbg_ptr), e[0] === 0 ? void 0 : e[1];
  }
  get offset() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e;
    return o(), e = _.__wbg_get_r2range_offset(this.__wbg_ptr), e[0] === 0 ? void 0 : e[1];
  }
  get suffix() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    let e;
    return o(), e = _.__wbg_get_r2range_suffix(this.__wbg_ptr), e[0] === 0 ? void 0 : e[1];
  }
  set length(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    o(), _.__wbg_set_r2range_length(this.__wbg_ptr, !b(e), b(e) ? 0 : e);
  }
  set offset(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    o(), _.__wbg_set_r2range_offset(this.__wbg_ptr, !b(e), b(e) ? 0 : e);
  }
  set suffix(e) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== s)
      throw new Error("Invalid stale object from previous Wasm instance");
    o(), _.__wbg_set_r2range_suffix(this.__wbg_ptr, !b(e), b(e) ? 0 : e);
  }
}, __name(_a6, "F"), _a6);
Symbol.dispose && (F.prototype[Symbol.dispose] = F.prototype.free);
function U() {
  s++, m = null, P = null, typeof numBytesDecoded < "u" && (numBytesDecoded = 0), typeof g < "u" && (g = 0), X = false, L = new WebAssembly.Instance(N, Q()), _ = L.exports, _.__wbindgen_start();
}
__name(U, "U");
function H() {
  let n;
  return o(), n = _.__worker_init_state(), n;
}
__name(H, "H");
function J(n) {
  let e;
  return o(), e = _.fetch2(n), e;
}
__name(J, "J");
function G() {
  o(), _.greet();
}
__name(G, "G");
function K() {
  o(), _.init();
}
__name(K, "K");
function Q() {
  return { __proto__: null, "./index_bg.js": { __proto__: null, __wbg_String_8564e559799eccda: function(e, t) {
    let r = String(t), i = y(r, _.__wbindgen_malloc, _.__wbindgen_realloc), c = g;
    d().setInt32(e + 4, c, true), d().setInt32(e + 0, i, true);
  }, __wbg___wbindgen_debug_string_edece8177ad01481: function(e, t) {
    let r = M(t), i = y(r, _.__wbindgen_malloc, _.__wbindgen_realloc), c = g;
    d().setInt32(e + 4, c, true), d().setInt32(e + 0, i, true);
  }, __wbg___wbindgen_is_falsy_402d3af0d5f09bc6: function(e) {
    return !e;
  }, __wbg___wbindgen_is_function_5cd60d5cf78b4eef: function(e) {
    return typeof e == "function";
  }, __wbg___wbindgen_is_object_b4593df85baada48: function(e) {
    let t = e;
    return typeof t == "object" && t !== null;
  }, __wbg___wbindgen_is_string_dde0fd9020db4434: function(e) {
    return typeof e == "string";
  }, __wbg___wbindgen_is_undefined_35bb9f4c7fd651d5: function(e) {
    return e === void 0;
  }, __wbg___wbindgen_string_get_d109740c0d18f4d7: function(e, t) {
    let r = t, i = typeof r == "string" ? r : void 0;
    var c = b(i) ? 0 : y(i, _.__wbindgen_malloc, _.__wbindgen_realloc), a = g;
    d().setInt32(e + 4, a, true), d().setInt32(e + 0, c, true);
  }, __wbg___wbindgen_throw_9c31b086c2b26051: function(e, t) {
    throw new Error(p(e, t));
  }, __wbg__wbg_cb_unref_3fa391f3fcdb55f8: function(e) {
    e._wbg_cb_unref();
  }, __wbg_buffer_8d6798e32d1afd34: function(e) {
    return e.buffer;
  }, __wbg_byobRequest_9d8c3b7b2f692560: function(e) {
    let t = e.byobRequest;
    return b(t) ? 0 : l(t);
  }, __wbg_byteLength_c0cecdd68fab1693: function(e) {
    return e.byteLength;
  }, __wbg_byteOffset_3791b0030cc3b490: function(e) {
    return e.byteOffset;
  }, __wbg_call_dfde26266607c996: function() {
    return u(function(e, t, r) {
      return e.call(t, r);
    }, arguments);
  }, __wbg_cancel_bee68d5707c614fb: function(e) {
    return e.cancel();
  }, __wbg_catch_ec5061a695c26496: function(e, t) {
    return e.catch(t);
  }, __wbg_cause_af1d0ccfb7354a29: function(e) {
    return e.cause;
  }, __wbg_cf_da3280bfacc59d75: function() {
    return u(function(e) {
      let t = e.cf;
      return b(t) ? 0 : l(t);
    }, arguments);
  }, __wbg_close_3b4a9a43141c17f7: function(e) {
    return e.close();
  }, __wbg_close_53179a3d37ed525d: function() {
    return u(function(e) {
      e.close();
    }, arguments);
  }, __wbg_close_807d553ef8405788: function() {
    return u(function(e) {
      e.close();
    }, arguments);
  }, __wbg_connect_aad46d0c3b210168: function() {
    return u(function(e, t) {
      return Z(e, t);
    }, arguments);
  }, __wbg_crypto_48300657fced39f9: function(e) {
    return e.crypto;
  }, __wbg_done_54b8da57023b7ed2: function(e) {
    return e.done;
  }, __wbg_enqueue_c3ce0a986a355a8c: function() {
    return u(function(e, t) {
      e.enqueue(t);
    }, arguments);
  }, __wbg_error_19d45ba06d627441: function(e, t) {
    console.error(e, t);
  }, __wbg_error_a6fa202b58aa1cd3: function(e, t) {
    let r, i;
    try {
      r = e, i = t, console.error(p(e, t));
    } finally {
      o(), _.__wbindgen_free(r, i, 1);
    }
  }, __wbg_error_f085d7e62279b703: function(e) {
    console.error(e);
  }, __wbg_getRandomValues_263d0aa5464054ee: function() {
    return u(function(e, t) {
      e.getRandomValues(t);
    }, arguments);
  }, __wbg_getRandomValues_76dfc69825c9c552: function() {
    return u(function(e, t) {
      globalThis.crypto.getRandomValues(k(e, t));
    }, arguments);
  }, __wbg_getReader_9facd4f899beac89: function() {
    return u(function(e) {
      return e.getReader();
    }, arguments);
  }, __wbg_getReader_c8a7370df46b86f6: function(e) {
    return e.getReader();
  }, __wbg_getWriter_71942e3fdd56b7fc: function() {
    return u(function(e) {
      return e.getWriter();
    }, arguments);
  }, __wbg_get_0b3f3bb74d16b7ad: function() {
    return u(function(e, t, r, i) {
      let c = t.get(p(r, i));
      var a = b(c) ? 0 : y(c, _.__wbindgen_malloc, _.__wbindgen_realloc), f = g;
      d().setInt32(e + 4, f, true), d().setInt32(e + 0, a, true);
    }, arguments);
  }, __wbg_get_dcf82ab8aad1a593: function() {
    return u(function(e, t) {
      return Reflect.get(e, t);
    }, arguments);
  }, __wbg_get_done_06210bfbda89c407: function(e) {
    let t = e.done;
    return b(t) ? 16777215 : t ? 1 : 0;
  }, __wbg_get_value_31eb9abef97d98cb: function(e) {
    return e.value;
  }, __wbg_headers_4cfb0c75793d7a8d: function(e) {
    return e.headers;
  }, __wbg_instanceId_23752a922e5c7aef: function(e) {
    return e.instanceId;
  }, __wbg_instanceof_Error_b3f7e146d654031a: function(e) {
    let t;
    try {
      t = e instanceof Error;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_ReadableStreamDefaultReader_19ba70025559b420: function(e) {
    let t;
    try {
      t = e instanceof ReadableStreamDefaultReader;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_ReadableStream_9a3d74fc91aa9c55: function(e) {
    let t;
    try {
      t = e instanceof ReadableStream;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_keys_610666c87d9e3542: function(e) {
    return e.keys();
  }, __wbg_length_56fcd3e2b7e0299d: function(e) {
    return e.length;
  }, __wbg_log_eb752234eec406d1: function(e) {
    console.log(e);
  }, __wbg_method_eadeb6c481ed3b2d: function(e, t) {
    let r = t.method, i = y(r, _.__wbindgen_malloc, _.__wbindgen_realloc), c = g;
    d().setInt32(e + 4, c, true), d().setInt32(e + 0, i, true);
  }, __wbg_msCrypto_8c6d45a75ef1d3da: function(e) {
    return e.msCrypto;
  }, __wbg_new_02d162bc6cf02f60: function() {
    return new Object();
  }, __wbg_new_1f236d63ba0c4784: function(e, t) {
    return new Error(p(e, t));
  }, __wbg_new_227d7c05414eb861: function() {
    return new Error();
  }, __wbg_new_ee0be486d8f01282: function() {
    return u(function() {
      return new Headers();
    }, arguments);
  }, __wbg_new_from_slice_269e35316ed2d061: function(e, t) {
    return new Uint8Array(k(e, t));
  }, __wbg_new_typed_c072c4ce9a2a0cdf: function(e, t) {
    try {
      var r = { a: e, b: t }, i = /* @__PURE__ */ __name((a, f) => {
        let w = r.a;
        r.a = 0;
        try {
          return ne(w, r.b, a, f);
        } finally {
          r.a = w;
        }
      }, "i");
      return new Promise(i);
    } finally {
      r.a = 0;
    }
  }, __wbg_new_with_byte_offset_and_length_a87e79143162d67f: function(e, t, r) {
    return new Uint8Array(e, t >>> 0, r >>> 0);
  }, __wbg_new_with_into_underlying_source_fd904252f385f59c: function(e, t) {
    return new ReadableStream(v.__wrap(e), t);
  }, __wbg_new_with_length_99887c91eae4abab: function(e) {
    return new Uint8Array(e >>> 0);
  }, __wbg_new_with_opt_buffer_source_and_init_b007ac889af621a0: function() {
    return u(function(e, t) {
      return new Response(e, t);
    }, arguments);
  }, __wbg_new_with_opt_readable_stream_and_init_802af9500a04b75d: function() {
    return u(function(e, t) {
      return new Response(e, t);
    }, arguments);
  }, __wbg_new_with_opt_str_and_init_1dd0a9ed589dcc68: function() {
    return u(function(e, t, r) {
      return new Response(e === 0 ? void 0 : p(e, t), r);
    }, arguments);
  }, __wbg_next_6429a146bf756f93: function() {
    return u(function(e) {
      return e.next();
    }, arguments);
  }, __wbg_node_95beb7570492fd97: function(e) {
    return e.node;
  }, __wbg_now_81363d44c96dd239: function() {
    return Date.now();
  }, __wbg_opened_409be5d8c83e8c32: function() {
    return u(function(e) {
      return e.opened;
    }, arguments);
  }, __wbg_process_b2fea42461d03994: function(e) {
    return e.process;
  }, __wbg_prototypesetcall_5f9bdc8d75e07276: function(e, t, r) {
    Uint8Array.prototype.set.call(k(e, t), r);
  }, __wbg_queueMicrotask_78d584b53af520f5: function(e) {
    return e.queueMicrotask;
  }, __wbg_queueMicrotask_b39ea83c7f01971a: function(e) {
    queueMicrotask(e);
  }, __wbg_randomFillSync_ca9f178fb14c88cb: function() {
    return u(function(e, t) {
      e.randomFillSync(t);
    }, arguments);
  }, __wbg_read_254bf22401498310: function(e) {
    return e.read();
  }, __wbg_readable_6ac206bfc2944af0: function() {
    return u(function(e) {
      return e.readable;
    }, arguments);
  }, __wbg_releaseLock_65f356509fef84ac: function(e) {
    e.releaseLock();
  }, __wbg_releaseLock_887f86f91af9259d: function(e) {
    e.releaseLock();
  }, __wbg_require_7a9419e39d796c95: function() {
    return u(function() {
      return module.require;
    }, arguments);
  }, __wbg_resolve_d17db9352f5a220e: function(e) {
    return Promise.resolve(e);
  }, __wbg_respond_0196e052b003e1db: function() {
    return u(function(e, t) {
      e.respond(t >>> 0);
    }, arguments);
  }, __wbg_set_24d0fa9e104112f9: function(e, t, r) {
    e.set(k(t, r));
  }, __wbg_set_a0e911be3da02782: function() {
    return u(function(e, t, r) {
      return Reflect.set(e, t, r);
    }, arguments);
  }, __wbg_set_criticalError_a317cc58ad3efd1a: function(e, t) {
    e.criticalError = t !== 0;
  }, __wbg_set_d57e5106f0271787: function() {
    return u(function(e, t, r, i, c) {
      e.set(p(t, r), p(i, c));
    }, arguments);
  }, __wbg_set_headers_179cf42797c4a305: function(e, t) {
    e.headers = t;
  }, __wbg_set_high_water_mark_6b567b5c596d9cc7: function(e, t) {
    e.highWaterMark = t;
  }, __wbg_set_instanceId_f98d02561c814f7f: function(e, t) {
    e.instanceId = t >>> 0;
  }, __wbg_set_status_0ec29746ab53cab4: function(e, t) {
    e.status = t;
  }, __wbg_stack_3b0d974bbf31e44f: function(e, t) {
    let r = t.stack, i = y(r, _.__wbindgen_malloc, _.__wbindgen_realloc), c = g;
    d().setInt32(e + 4, c, true), d().setInt32(e + 0, i, true);
  }, __wbg_static_accessor_GLOBAL_THIS_02344c9b09eb08a9: function() {
    let e = typeof globalThis > "u" ? null : globalThis;
    return b(e) ? 0 : l(e);
  }, __wbg_static_accessor_GLOBAL_ac6d4ac874d5cd54: function() {
    let e = typeof global > "u" ? null : global;
    return b(e) ? 0 : l(e);
  }, __wbg_static_accessor_INIT_STATE_64fa719d0e4673b7: function() {
    return q;
  }, __wbg_static_accessor_SELF_9b2406c23aeb2023: function() {
    let e = typeof self > "u" ? null : self;
    return b(e) ? 0 : l(e);
  }, __wbg_static_accessor_WINDOW_b34d2126934e16ba: function() {
    let e = typeof window > "u" ? null : window;
    return b(e) ? 0 : l(e);
  }, __wbg_subarray_7c6a0da8f3b4a1ba: function(e, t, r) {
    return e.subarray(t >>> 0, r >>> 0);
  }, __wbg_then_837494e384b37459: function(e, t) {
    return e.then(t);
  }, __wbg_then_bd927500e8905df2: function(e, t, r) {
    return e.then(t, r);
  }, __wbg_toString_a5ee42947b978082: function(e) {
    return e.toString();
  }, __wbg_url_f1cddff1f5b9519a: function(e, t) {
    let r = t.url, i = y(r, _.__wbindgen_malloc, _.__wbindgen_realloc), c = g;
    d().setInt32(e + 4, c, true), d().setInt32(e + 0, i, true);
  }, __wbg_value_9cc0518af87a489c: function(e) {
    return e.value;
  }, __wbg_versions_215a3ab1c9d5745a: function(e) {
    return e.versions;
  }, __wbg_view_1b637c097280508c: function(e) {
    let t = e.view;
    return b(t) ? 0 : l(t);
  }, __wbg_writable_7eada3393974593f: function() {
    return u(function(e) {
      return e.writable;
    }, arguments);
  }, __wbg_write_9b48635cbf59dc91: function(e, t) {
    return e.write(t);
  }, __wbindgen_cast_0000000000000001: function(e, t) {
    return $(e, t, ee);
  }, __wbindgen_cast_0000000000000002: function(e, t) {
    return $(e, t, te);
  }, __wbindgen_cast_0000000000000003: function(e) {
    return e;
  }, __wbindgen_cast_0000000000000004: function(e, t) {
    return k(e, t);
  }, __wbindgen_cast_0000000000000005: function(e, t) {
    return p(e, t);
  }, __wbindgen_init_externref_table: function() {
    let e = _.__wbindgen_externrefs, t = e.grow(4);
    e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, true), e.set(t + 3, false);
  } } };
}
__name(Q, "Q");
function o() {
  if (X) {
    U();
    return;
  }
}
__name(o, "o");
function ee(n, e, t) {
  o(), _.wasm_bindgen__convert__closures_____invoke__h99573538e4240966(n, e, t);
}
__name(ee, "ee");
function te(n, e, t) {
  let r;
  if (o(), r = _.wasm_bindgen__convert__closures_____invoke__h5fde5866f91ee6e8(n, e, t), r[1])
    throw fe(r[0]);
}
__name(te, "te");
function ne(n, e, t, r) {
  o(), _.wasm_bindgen__convert__closures_____invoke__h1449b564fe748386(n, e, t, r);
}
__name(ne, "ne");
var re = ["bytes"];
var s = 0;
var _e = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: n, instance: e }) => {
  e === s && _.__wbg_containerstartupoptions_free(n, 1);
});
var ie = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: n, instance: e }) => {
  e === s && _.__wbg_intounderlyingbytesource_free(n, 1);
});
var oe = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: n, instance: e }) => {
  e === s && _.__wbg_intounderlyingsink_free(n, 1);
});
var V = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: n, instance: e }) => {
  e === s && _.__wbg_intounderlyingsource_free(n, 1);
});
var se = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: n, instance: e }) => {
  e === s && _.__wbg_minifyconfig_free(n, 1);
});
var ce = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry(({ ptr: n, instance: e }) => {
  e === s && _.__wbg_r2range_free(n, 1);
});
function l(n) {
  let e = _.__externref_table_alloc();
  return _.__wbindgen_externrefs.set(e, n), e;
}
__name(l, "l");
var B = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((n) => {
  n.instance === s && _.__wbindgen_destroy_closure(n.a, n.b);
});
function M(n) {
  let e = typeof n;
  if (e == "number" || e == "boolean" || n == null)
    return `${n}`;
  if (e == "string")
    return `"${n}"`;
  if (e == "symbol") {
    let i = n.description;
    return i == null ? "Symbol" : `Symbol(${i})`;
  }
  if (e == "function") {
    let i = n.name;
    return typeof i == "string" && i.length > 0 ? `Function(${i})` : "Function";
  }
  if (Array.isArray(n)) {
    let i = n.length, c = "[";
    i > 0 && (c += M(n[0]));
    for (let a = 1; a < i; a++)
      c += ", " + M(n[a]);
    return c += "]", c;
  }
  let t = /\[object ([^\]]+)\]/.exec(toString.call(n)), r;
  if (t && t.length > 1)
    r = t[1];
  else
    return toString.call(n);
  if (r == "Object")
    try {
      return "Object(" + JSON.stringify(n) + ")";
    } catch {
      return "Object";
    }
  return n instanceof Error ? `${n.name}: ${n.message}
${n.stack}` : r;
}
__name(M, "M");
function ae(n, e) {
  n = n >>> 0;
  let t = d(), r = [];
  for (let i = n; i < n + 4 * e; i += 4)
    r.push(_.__wbindgen_externrefs.get(t.getUint32(i, true)));
  return _.__externref_drop_slice(n, e), r;
}
__name(ae, "ae");
function k(n, e) {
  return n = n >>> 0, z().subarray(n / 1, n / 1 + e);
}
__name(k, "k");
var m = null;
function d() {
  return (m === null || m.buffer.detached === true || m.buffer.detached === void 0 && m.buffer !== _.memory.buffer) && (m = new DataView(_.memory.buffer)), m;
}
__name(d, "d");
function p(n, e) {
  return be(n >>> 0, e);
}
__name(p, "p");
var P = null;
function z() {
  return (P === null || P.byteLength === 0) && (P = new Uint8Array(_.memory.buffer)), P;
}
__name(z, "z");
function u(n, e) {
  try {
    return n.apply(this, e);
  } catch (t) {
    let r = l(t);
    _.__wbindgen_exn_store(r);
  }
}
__name(u, "u");
function b(n) {
  return n == null;
}
__name(b, "b");
function $(n, e, t) {
  let r = { a: n, b: e, cnt: 1, instance: s }, i = /* @__PURE__ */ __name((...c) => {
    if (r.instance !== s)
      throw new Error("Cannot invoke closure from previous WASM instance");
    r.cnt++;
    let a = r.a;
    r.a = 0;
    try {
      return t(a, r.b, ...c);
    } finally {
      r.a = a, i._wbg_cb_unref();
    }
  }, "i");
  return i._wbg_cb_unref = () => {
    --r.cnt === 0 && (_.__wbindgen_destroy_closure(r.a, r.b), r.a = 0, B.unregister(r));
  }, B.register(i, r, r), i;
}
__name($, "$");
function ue(n, e) {
  let t = e(n.length * 4, 4) >>> 0;
  for (let r = 0; r < n.length; r++) {
    let i = l(n[r]);
    d().setUint32(t + 4 * r, i, true);
  }
  return g = n.length, t;
}
__name(ue, "ue");
function y(n, e, t) {
  if (t === void 0) {
    let f = O.encode(n), w = e(f.length, 1) >>> 0;
    return z().subarray(w, w + f.length).set(f), g = f.length, w;
  }
  let r = n.length, i = e(r, 1) >>> 0, c = z(), a = 0;
  for (; a < r; a++) {
    let f = n.charCodeAt(a);
    if (f > 127)
      break;
    c[i + a] = f;
  }
  if (a !== r) {
    a !== 0 && (n = n.slice(a)), i = t(i, r, r = a + n.length * 3, 1) >>> 0;
    let f = z().subarray(i + a, i + r), w = O.encodeInto(n, f);
    a += w.written, i = t(i, r, a, 1) >>> 0;
  }
  return g = a, i;
}
__name(y, "y");
var X = false;
function fe(n) {
  let e = _.__wbindgen_externrefs.get(n);
  return _.__externref_table_dealloc(n), e;
}
__name(fe, "fe");
var Y = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
Y.decode();
function be(n, e) {
  return Y.decode(z().subarray(n, n + e));
}
__name(be, "be");
var O = new TextEncoder();
"encodeInto" in O || (O.encodeInto = function(n, e) {
  let t = O.encode(n);
  return e.set(t), { read: n.length, written: t.length };
});
var g = 0;
var L = new WebAssembly.Instance(N, Q());
var _ = L.exports;
_.__wbindgen_start();
Error.stackTraceLimit = 100;
var h = H();
function C() {
  h.criticalError && (console.log("Reinitializing Wasm application"), U(), h.criticalError = false, h.instanceId++);
}
__name(C, "C");
addEventListener("error", (n) => {
  D(n.error);
});
function D(n) {
  n instanceof WebAssembly.RuntimeError && (console.error("Critical", n), h.criticalError = true);
}
__name(D, "D");
var _a7;
var W = (_a7 = class extends ge {
}, __name(_a7, "W"), _a7);
W.prototype.fetch2 = J;
W.prototype.greet = G;
W.prototype.init = K;
var we = { set: (n, e, t, r) => Reflect.set(n.instance, e, t, r), has: (n, e) => Reflect.has(n.instance, e), deleteProperty: (n, e) => Reflect.deleteProperty(n.instance, e), apply: (n, e, t) => Reflect.apply(n.instance, e, t), construct: (n, e, t) => Reflect.construct(n.instance, e, t), getPrototypeOf: (n) => Reflect.getPrototypeOf(n.instance), setPrototypeOf: (n, e) => Reflect.setPrototypeOf(n.instance, e), isExtensible: (n) => Reflect.isExtensible(n.instance), preventExtensions: (n) => Reflect.preventExtensions(n.instance), getOwnPropertyDescriptor: (n, e) => Reflect.getOwnPropertyDescriptor(n.instance, e), defineProperty: (n, e, t) => Reflect.defineProperty(n.instance, e, t), ownKeys: (n) => Reflect.ownKeys(n.instance) };
var x = { construct(n, e, t) {
  try {
    C();
    let r = { instance: Reflect.construct(n, e, t), instanceId: h.instanceId, ctor: n, args: e, newTarget: t };
    return new Proxy(r, { ...we, get(i, c, a) {
      i.instanceId !== h.instanceId && (i.instance = Reflect.construct(i.ctor, i.args, i.newTarget), i.instanceId = h.instanceId);
      let f = Reflect.get(i.instance, c, a);
      return typeof f != "function" ? f : f.constructor === Function ? new Proxy(f, { apply(w, A, T) {
        C();
        try {
          return w.apply(A, T);
        } catch (j) {
          throw D(j), j;
        }
      } }) : new Proxy(f, { async apply(w, A, T) {
        C();
        try {
          return await w.apply(A, T);
        } catch (j) {
          throw D(j), j;
        }
      } });
    } });
  } catch (r) {
    throw h.criticalError = true, r;
  }
} };
var ve = new Proxy(W, x);
var xe = new Proxy(I, x);
var Ie = new Proxy(R, x);
var Re = new Proxy(E, x);
var Ee = new Proxy(v, x);
var Se = new Proxy(S, x);
var Fe = new Proxy(F, x);

// fetch2.ts
var wasmFetch2 = ve.prototype.fetch2;
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
