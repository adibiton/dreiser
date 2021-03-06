if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.isDef = function(a) {
  return void 0 !== a;
};
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for (var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {};
  }
};
goog.define = function(a, b) {
  var c = b;
  COMPILED || (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, a) ? c = goog.global.CLOSURE_UNCOMPILED_DEFINES[a] : goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (c = goog.global.CLOSURE_DEFINES[a]));
  goog.exportPath_(a, c);
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.provide = function(a) {
  if (!COMPILED) {
    if (goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
    for (var b = a;(b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) {
      goog.implicitNamespaces_[b] = !0;
    }
  }
  goog.exportPath_(a);
};
goog.setTestOnly = function(a) {
  if (COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
  }
};
goog.forwardDeclare = function(a) {
};
COMPILED || (goog.isProvided_ = function(a) {
  return!goog.implicitNamespaces_[a] && goog.isDefAndNotNull(goog.getObjectByName(a));
}, goog.implicitNamespaces_ = {});
goog.getObjectByName = function(a, b) {
  for (var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if (goog.isDefAndNotNull(d[e])) {
      d = d[e];
    } else {
      return null;
    }
  }
  return d;
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for (d in a) {
    c[d] = a[d];
  }
};
goog.addDependency = function(a, b, c) {
  if (goog.DEPENDENCIES_ENABLED) {
    var d;
    a = a.replace(/\\/g, "/");
    for (var e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0;
    }
    for (d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0;
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if (!COMPILED && !goog.isProvided_(a)) {
    if (goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if (b) {
        goog.included_[b] = !0;
        goog.writeScripts_();
        return;
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a, b) {
  return a;
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if (a.instance_) {
      return a.instance_;
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a;
  };
};
goog.instantiatedSingletons_ = [];
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return "undefined" != typeof a && "write" in a;
}, goog.findBasePath_ = function() {
  if (goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH;
  } else {
    if (goog.inHtmlDocument_()) {
      for (var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;0 <= b;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = -1 == d ? c.length : d;
        if ("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break;
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0);
}, goog.writeScriptTag_ = function(a) {
  if (goog.inHtmlDocument_()) {
    var b = goog.global.document;
    if ("complete" == b.readyState) {
      if (/\bdeps.js$/.test(a)) {
        return!1;
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    b.write('\x3cscript type\x3d"text/javascript" src\x3d"' + a + '"\x3e\x3c/script\x3e');
    return!0;
  }
  return!1;
}, goog.writeScripts_ = function() {
  function a(e) {
    if (!(e in d.written)) {
      if (!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
        for (var g in d.requires[e]) {
          if (!goog.isProvided_(g)) {
            if (g in d.nameToPath) {
              a(d.nameToPath[g]);
            } else {
              throw Error("Undefined nameToPath for " + g);
            }
          }
        }
      }
      e in c || (c[e] = !0, b.push(e));
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for (e in goog.included_) {
    d.written[e] || a(e);
  }
  for (e = 0;e < b.length;e++) {
    if (b[e]) {
      goog.importScript_(goog.basePath + b[e]);
    } else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null;
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if ("object" == b) {
    if (a) {
      if (a instanceof Array) {
        return "array";
      }
      if (a instanceof Object) {
        return b;
      }
      var c = Object.prototype.toString.call(a);
      if ("[object Window]" == c) {
        return "object";
      }
      if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == b && "undefined" == typeof a.call) {
      return "object";
    }
  }
  return b;
};
goog.isNull = function(a) {
  return null === a;
};
goog.isDefAndNotNull = function(a) {
  return null != a;
};
goog.isArray = function(a) {
  return "array" == goog.typeOf(a);
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return "array" == b || "object" == b && "number" == typeof a.length;
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear;
};
goog.isString = function(a) {
  return "string" == typeof a;
};
goog.isBoolean = function(a) {
  return "boolean" == typeof a;
};
goog.isNumber = function(a) {
  return "number" == typeof a;
};
goog.isFunction = function(a) {
  return "function" == goog.typeOf(a);
};
goog.isObject = function(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(a) {
  return!!a[goog.UID_PROPERTY_];
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_];
  } catch (b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if ("object" == b || "array" == b) {
    if (a.clone) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, c;
    for (c in a) {
      b[c] = goog.cloneObject(a[c]);
    }
    return b;
  }
  return a;
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments);
};
goog.bindJs_ = function(a, b, c) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
};
goog.bind = function(a, b, c) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments);
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = c.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b);
  };
};
goog.mixin = function(a, b) {
  for (var c in b) {
    a[c] = b[c];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date;
};
goog.globalEval = function(a) {
  if (goog.global.execScript) {
    goog.global.execScript(a, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ \x3d 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(a);
      } else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a;
  }, d = function(a) {
    a = a.split("-");
    for (var b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]));
    }
    return b.join("-");
  }, d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
    return a;
  };
  return b ? a + "-" + d(b) : d(a);
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b;
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  b && (a = a.replace(/\{\$([^}]+)}/g, function(a, d) {
    return d in b ? b[d] : a;
  }));
  return a;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c);
};
goog.exportProperty = function(a, b, c) {
  a[b] = c;
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.base = function(a, c, f) {
    var g = Array.prototype.slice.call(arguments, 2);
    return b.prototype[c].apply(a, g);
  };
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !d) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
  }
  for (var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if (g.prototype[b] === d) {
      f = !0;
    } else {
      if (f) {
        return g.prototype[b].apply(a, e);
      }
    }
  }
  if (a[b] === d) {
    return a.constructor.prototype[b].apply(a, e);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global);
};
COMPILED || (goog.global.COMPILED = COMPILED);
goog.defineClass = function(a, b) {
  var c = b.constructor, d = b.statics;
  c && c != Object.prototype.constructor || (c = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  c = goog.defineClass.createSealingConstructor_(c, a);
  a && goog.inherits(c, a);
  delete b.constructor;
  delete b.statics;
  goog.defineClass.applyProperties_(c.prototype, b);
  null != d && (d instanceof Function ? d(c) : goog.defineClass.applyProperties_(c, d));
  return c;
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function(a, b) {
  if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
    if (b && b.prototype && b.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) {
      return a;
    }
    var c = function() {
      var b = a.apply(this, arguments) || this;
      this.constructor === c && Object.seal(b);
      return b;
    };
    return c;
  }
  return a;
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_ = function(a, b) {
  for (var c in b) {
    Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
  }
  for (var d = 0;d < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;d++) {
    c = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d], Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
  }
};
goog.tagUnsealableClass = function(a) {
  !COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES && (a.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = !0);
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.disposable = {};
goog.disposable.IDisposable = function() {
};
goog.Disposable = function() {
  goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (goog.Disposable.INCLUDE_STACK_ON_CREATION && (this.creationStack = Error().stack), goog.Disposable.instances_[goog.getUid(this)] = this);
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.INCLUDE_STACK_ON_CREATION = !0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var a = [], b;
  for (b in goog.Disposable.instances_) {
    goog.Disposable.instances_.hasOwnProperty(b) && a.push(goog.Disposable.instances_[Number(b)]);
  }
  return a;
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {};
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_;
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
    var a = goog.getUid(this);
    if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(a)) {
      throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
    }
    delete goog.Disposable.instances_[a];
  }
};
goog.Disposable.prototype.registerDisposable = function(a) {
  this.addOnDisposeCallback(goog.partial(goog.dispose, a));
};
goog.Disposable.prototype.addOnDisposeCallback = function(a, b) {
  this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []);
  this.onDisposeCallbacks_.push(goog.isDef(b) ? goog.bind(a, b) : a);
};
goog.Disposable.prototype.disposeInternal = function() {
  if (this.onDisposeCallbacks_) {
    for (;this.onDisposeCallbacks_.length;) {
      this.onDisposeCallbacks_.shift()();
    }
  }
};
goog.Disposable.isDisposed = function(a) {
  return a && "function" == typeof a.isDisposed ? a.isDisposed() : !1;
};
goog.dispose = function(a) {
  a && "function" == typeof a.dispose && a.dispose();
};
goog.disposeAll = function(a) {
  for (var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    goog.isArrayLike(d) ? goog.disposeAll.apply(null, d) : goog.dispose(d);
  }
};
goog.debug = {};
goog.debug.Error = function(a) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var b = Error().stack;
    b && (this.stack = b);
  }
  a && (this.message = String(a));
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.dom = {};
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.string = {};
goog.string.DETECT_DOUBLE_ESCAPING = !1;
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0);
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c;
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length));
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length));
};
goog.string.caseInsensitiveEquals = function(a, b) {
  return a.toLowerCase() == b.toLowerCase();
};
goog.string.subs = function(a, b) {
  for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1);e.length && 1 < c.length;) {
    d += c.shift() + e.shift();
  }
  return d + c.join("%s");
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a);
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a));
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a);
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a);
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a);
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a);
};
goog.string.isSpace = function(a) {
  return " " == a;
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a;
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(), d = String(b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1;
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if (a == b) {
    return 0;
  }
  if (!a) {
    return-1;
  }
  if (!b) {
    return 1;
  }
  for (var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if (g != h) {
      return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1;
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1;
};
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a));
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "\x3cbr /\x3e" : "\x3cbr\x3e");
};
goog.string.htmlEscape = function(a, b) {
  if (b) {
    a = a.replace(goog.string.AMP_RE_, "\x26amp;").replace(goog.string.LT_RE_, "\x26lt;").replace(goog.string.GT_RE_, "\x26gt;").replace(goog.string.QUOT_RE_, "\x26quot;").replace(goog.string.SINGLE_QUOTE_RE_, "\x26#39;").replace(goog.string.NULL_RE_, "\x26#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(goog.string.E_RE_, "\x26#101;"));
  } else {
    if (!goog.string.ALL_RE_.test(a)) {
      return a;
    }
    -1 != a.indexOf("\x26") && (a = a.replace(goog.string.AMP_RE_, "\x26amp;"));
    -1 != a.indexOf("\x3c") && (a = a.replace(goog.string.LT_RE_, "\x26lt;"));
    -1 != a.indexOf("\x3e") && (a = a.replace(goog.string.GT_RE_, "\x26gt;"));
    -1 != a.indexOf('"') && (a = a.replace(goog.string.QUOT_RE_, "\x26quot;"));
    -1 != a.indexOf("'") && (a = a.replace(goog.string.SINGLE_QUOTE_RE_, "\x26#39;"));
    -1 != a.indexOf("\x00") && (a = a.replace(goog.string.NULL_RE_, "\x26#0;"));
    goog.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(goog.string.E_RE_, "\x26#101;"));
  }
  return a;
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "\x26") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a;
};
goog.string.unescapeEntitiesWithDocument = function(a, b) {
  return goog.string.contains(a, "\x26") ? goog.string.unescapeEntitiesUsingDom_(a, b) : a;
};
goog.string.unescapeEntitiesUsingDom_ = function(a, b) {
  var c = {"\x26amp;":"\x26", "\x26lt;":"\x3c", "\x26gt;":"\x3e", "\x26quot;":'"'}, d;
  d = b ? b.createElement("div") : goog.global.document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, b) {
    var g = c[a];
    if (g) {
      return g;
    }
    if ("#" == b.charAt(0)) {
      var h = Number("0" + b.substr(1));
      isNaN(h) || (g = String.fromCharCode(h));
    }
    g || (d.innerHTML = a + " ", g = d.firstChild.nodeValue.slice(0, -1));
    return c[a] = g;
  });
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return "\x26";
      case "lt":
        return "\x3c";
      case "gt":
        return "\x3e";
      case "quot":
        return'"';
      default:
        if ("#" == c.charAt(0)) {
          var d = Number("0" + c.substr(1));
          if (!isNaN(d)) {
            return String.fromCharCode(d);
          }
        }
        return a;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " \x26#160;"), b);
};
goog.string.preserveSpaces = function(a) {
  return a.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(a, b) {
  for (var c = b.length, d = 0;d < c;d++) {
    var e = 1 == c ? b : b.charAt(d);
    if (a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1);
    }
  }
  return a;
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a;
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if (d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d;
    a = a.substring(0, b - d) + "..." + a.substring(e);
  } else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e));
  }
  c && (a = goog.string.htmlEscape(a));
  return a;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if (a.quote) {
    return a.quote();
  }
  for (var b = ['"'], c = 0;c < a.length;c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d));
  }
  b.push('"');
  return b.join("");
};
goog.string.escapeString = function(a) {
  for (var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c));
  }
  return b.join("");
};
goog.string.escapeChar = function(a) {
  if (a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a];
  }
  if (a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];
  }
  var b = a, c = a.charCodeAt(0);
  if (31 < c && 127 > c) {
    b = a;
  } else {
    if (256 > c) {
      if (b = "\\x", 16 > c || 256 < c) {
        b += "0";
      }
    } else {
      b = "\\u", 4096 > c && (b += "0");
    }
    b += c.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[a] = b;
};
goog.string.toMap = function(a) {
  for (var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0;
  }
  return b;
};
goog.string.contains = function(a, b) {
  return-1 != a.indexOf(b);
};
goog.string.caseInsensitiveContains = function(a, b) {
  return goog.string.contains(a.toLowerCase(), b.toLowerCase());
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0;
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d;
};
goog.string.remove = function(a, b) {
  var c = new RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "");
};
goog.string.removeAll = function(a, b) {
  var c = new RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "");
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a);
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a;
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a);
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(a, b) {
  for (var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0;0 == c && g < f;g++) {
    var h = d[g] || "", k = e[g] || "", l = RegExp("(\\d*)(\\D*)", "g"), m = RegExp("(\\d*)(\\D*)", "g");
    do {
      var n = l.exec(h) || ["", "", ""], p = m.exec(k) || ["", "", ""];
      if (0 == n[0].length && 0 == p[0].length) {
        break;
      }
      var c = 0 == n[1].length ? 0 : parseInt(n[1], 10), q = 0 == p[1].length ? 0 : parseInt(p[1], 10), c = goog.string.compareElements_(c, q) || goog.string.compareElements_(0 == n[2].length, 0 == p[2].length) || goog.string.compareElements_(n[2], p[2]);
    } while (0 == c);
  }
  return c;
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for (var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_;
  }
  return b;
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b;
};
goog.string.isLowerCamelCase = function(a) {
  return/^[a-z]+([A-Z][a-z]*)*$/.test(a);
};
goog.string.isUpperCamelCase = function(a) {
  return/^([A-Z][a-z]*)+$/.test(a);
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase();
  });
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(a, b) {
  var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
  return a.replace(new RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
    return b + c.toUpperCase();
  });
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;
};
goog.string.splitLimit = function(a, b, c) {
  a = a.split(b);
  for (var d = [];0 < c && a.length;) {
    d.push(a.shift()), c--;
  }
  a.length && d.push(a.join(b));
  return d;
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a;
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(a) {
  throw a;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if (c) {
    var e = e + (": " + c), f = d
  } else {
    a && (e += ": " + a, f = b);
  }
  a = new goog.asserts.AssertionError("" + e, f || []);
  goog.asserts.errorHandler_(a);
};
goog.asserts.setErrorHandler = function(a) {
  goog.asserts.ENABLE_ASSERTS && (goog.asserts.errorHandler_ = a);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.fail = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)));
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertElement = function(a, b, c) {
  !goog.asserts.ENABLE_ASSERTS || goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
  return a;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var a in Object.prototype) {
    goog.asserts.fail(a + " should not be enumerable in Object.prototype.");
  }
};
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = !1;
goog.debug.entryPointRegistry.register = function(a) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = a;
  if (goog.debug.entryPointRegistry.monitorsMayExist_) {
    for (var b = goog.debug.entryPointRegistry.monitors_, c = 0;c < b.length;c++) {
      a(goog.bind(b[c].wrap, b[c]));
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function(a) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
  for (var b = goog.bind(a.wrap, a), c = 0;c < goog.debug.entryPointRegistry.refList_.length;c++) {
    goog.debug.entryPointRegistry.refList_[c](b);
  }
  goog.debug.entryPointRegistry.monitors_.push(a);
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(a) {
  var b = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(a == b[b.length - 1], "Only the most recent monitor can be unwrapped.");
  a = goog.bind(a.unwrap, a);
  for (var c = 0;c < goog.debug.entryPointRegistry.refList_.length;c++) {
    goog.debug.entryPointRegistry.refList_[c](a);
  }
  b.length--;
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.ASSUME_NATIVE_FUNCTIONS = !1;
goog.array.peek = function(a) {
  return a[a.length - 1];
};
goog.array.last = goog.array.peek;
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c);
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if (goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1;
  }
  for (;c < a.length;c++) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return-1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c);
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if (goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1;
  }
  for (;0 <= c;c--) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return-1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a);
  }
};
goog.array.forEachRight = function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;--d) {
    d in e && b.call(c, e[d], d, a);
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if (h in g) {
      var k = g[h];
      b.call(c, k, h, a) && (e[f++] = k);
    }
  }
  return e;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a));
  }
  return e;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  d && (b = goog.bind(b, d));
  return goog.array.ARRAY_PROTOTYPE_.reduce.call(a, b, c);
} : function(a, b, c, d) {
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a);
  });
  return e;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  d && (b = goog.bind(b, d));
  return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(a, b, c);
} : function(a, b, c, d) {
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a);
  });
  return e;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if (f in e && b.call(c, e[f], f, a)) {
      return!0;
    }
  }
  return!1;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if (f in e && !b.call(c, e[f], f, a)) {
      return!1;
    }
  }
  return!0;
};
goog.array.count = function(a, b, c) {
  var d = 0;
  goog.array.forEach(a, function(a, f, g) {
    b.call(c, a, f, g) && ++d;
  }, c);
  return d;
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b];
};
goog.array.findIndex = function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if (f in e && b.call(c, e[f], f, a)) {
      return f;
    }
  }
  return-1;
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b];
};
goog.array.findIndexRight = function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;d--) {
    if (d in e && b.call(c, e[d], d, a)) {
      return d;
    }
  }
  return-1;
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b);
};
goog.array.isEmpty = function(a) {
  return 0 == a.length;
};
goog.array.clear = function(a) {
  if (!goog.isArray(a)) {
    for (var b = a.length - 1;0 <= b;b--) {
      delete a[b];
    }
  }
  a.length = 0;
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b);
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b);
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b);
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d);
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = 0 <= c) && goog.array.removeAt(a, c);
  return d;
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length;
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1;
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.join = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.toArray = function(a) {
  var b = a.length;
  if (0 < b) {
    for (var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d];
    }
    return c;
  }
  return[];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
  for (var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if (goog.isArray(d) || (e = goog.isArrayLike(d)) && Object.prototype.hasOwnProperty.call(d, "callee")) {
      a.push.apply(a, d);
    } else {
      if (e) {
        for (var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h];
        }
      } else {
        a.push(d);
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1));
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c);
};
goog.array.removeDuplicates = function(a, b, c) {
  b = b || a;
  var d = function(a) {
    return goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
  };
  c = c || d;
  for (var d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = c(g);
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, b[e++] = g);
  }
  b.length = e;
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b);
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c);
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for (var f = 0, g = a.length, h;f < g;) {
    var k = f + g >> 1, l;
    l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
    0 < l ? f = k + 1 : (g = k, h = !l);
  }
  return h ? f : ~f;
};
goog.array.sort = function(a, b) {
  a.sort(b || goog.array.defaultCompare);
};
goog.array.stableSort = function(a, b) {
  for (var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]};
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index;
  });
  for (c = 0;c < a.length;c++) {
    a[c] = a[c].value;
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b]);
  });
};
goog.array.isSorted = function(a, b, c) {
  b = b || goog.array.defaultCompare;
  for (var d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if (0 < e || 0 == e && c) {
      return!1;
    }
  }
  return!0;
};
goog.array.equals = function(a, b, c) {
  if (!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1;
  }
  var d = a.length;
  c = c || goog.array.defaultCompareEquality;
  for (var e = 0;e < d;e++) {
    if (!c(a[e], b[e])) {
      return!1;
    }
  }
  return!0;
};
goog.array.compare3 = function(a, b, c) {
  c = c || goog.array.defaultCompare;
  for (var d = Math.min(a.length, b.length), e = 0;e < d;e++) {
    var f = c(a[e], b[e]);
    if (0 != f) {
      return f;
    }
  }
  return goog.array.defaultCompare(a.length, b.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1;
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1;
};
goog.array.bucket = function(a, b, c) {
  for (var d = {}, e = 0;e < a.length;e++) {
    var f = a[e], g = b.call(c, f, e, a);
    goog.isDef(g) && (d[g] || (d[g] = [])).push(f);
  }
  return d;
};
goog.array.toObject = function(a, b, c) {
  var d = {};
  goog.array.forEach(a, function(e, f) {
    d[b.call(c, e, f, a)] = e;
  });
  return d;
};
goog.array.range = function(a, b, c) {
  var d = [], e = 0, f = a;
  c = c || 1;
  void 0 !== b && (e = a, f = b);
  if (0 > c * (f - e)) {
    return[];
  }
  if (0 < c) {
    for (a = e;a < f;a += c) {
      d.push(a);
    }
  } else {
    for (a = e;a > f;a += c) {
      d.push(a);
    }
  }
  return d;
};
goog.array.repeat = function(a, b) {
  for (var c = [], d = 0;d < b;d++) {
    c[d] = a;
  }
  return c;
};
goog.array.flatten = function(a) {
  for (var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d);
  }
  return b;
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a;
};
goog.array.moveItem = function(a, b, c) {
  goog.asserts.assert(0 <= b && b < a.length);
  goog.asserts.assert(0 <= c && c < a.length);
  b = goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1);
  goog.array.ARRAY_PROTOTYPE_.splice.call(a, c, 0, b[0]);
};
goog.array.zip = function(a) {
  if (!arguments.length) {
    return[];
  }
  for (var b = [], c = 0;;c++) {
    for (var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if (c >= f.length) {
        return b;
      }
      d.push(f[c]);
    }
    b.push(d);
  }
};
goog.array.shuffle = function(a, b) {
  for (var c = b || Math.random, d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f;
  }
};
goog.labs = {};
goog.labs.userAgent = {};
goog.labs.userAgent.util = {};
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
  var a = goog.labs.userAgent.util.getNavigator_();
  return a && (a = a.userAgent) ? a : "";
};
goog.labs.userAgent.util.getNavigator_ = function() {
  return goog.global.navigator;
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(a) {
  goog.labs.userAgent.util.userAgent_ = a || goog.labs.userAgent.util.getNativeUserAgentString_();
};
goog.labs.userAgent.util.getUserAgent = function() {
  return goog.labs.userAgent.util.userAgent_;
};
goog.labs.userAgent.util.matchUserAgent = function(a) {
  var b = goog.labs.userAgent.util.getUserAgent();
  return goog.string.contains(b, a);
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(a) {
  var b = goog.labs.userAgent.util.getUserAgent();
  return goog.string.caseInsensitiveContains(b, a);
};
goog.labs.userAgent.util.extractVersionTuples = function(a) {
  for (var b = RegExp("(\\w[\\w ]+)/([^\\s]+)\\s*(?:\\((.*?)\\))?", "g"), c = [], d;d = b.exec(a);) {
    c.push([d[1], d[2], d[3] || void 0]);
  }
  return c;
};
goog.labs.userAgent.browser = {};
goog.labs.userAgent.browser.matchOpera_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR");
};
goog.labs.userAgent.browser.matchIE_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Firefox");
};
goog.labs.userAgent.browser.matchSafari_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Safari") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS") && !goog.labs.userAgent.util.matchUserAgent("Android");
};
goog.labs.userAgent.browser.matchChrome_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS");
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS");
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
  return goog.labs.userAgent.util.matchUserAgent("Silk");
};
goog.labs.userAgent.browser.getVersion = function() {
  var a = goog.labs.userAgent.util.getUserAgent();
  if (goog.labs.userAgent.browser.isIE()) {
    return goog.labs.userAgent.browser.getIEVersion_(a);
  }
  if (goog.labs.userAgent.browser.isOpera()) {
    return goog.labs.userAgent.browser.getOperaVersion_(a);
  }
  a = goog.labs.userAgent.util.extractVersionTuples(a);
  return goog.labs.userAgent.browser.getVersionFromTuples_(a);
};
goog.labs.userAgent.browser.isVersionOrHigher = function(a) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), a);
};
goog.labs.userAgent.browser.getIEVersion_ = function(a) {
  var b = /rv: *([\d\.]*)/.exec(a);
  if (b && b[1]) {
    return b[1];
  }
  var b = "", c = /MSIE +([\d\.]+)/.exec(a);
  if (c && c[1]) {
    if (a = /Trident\/(\d.\d)/.exec(a), "7.0" == c[1]) {
      if (a && a[1]) {
        switch(a[1]) {
          case "4.0":
            b = "8.0";
            break;
          case "5.0":
            b = "9.0";
            break;
          case "6.0":
            b = "10.0";
            break;
          case "7.0":
            b = "11.0";
        }
      } else {
        b = "7.0";
      }
    } else {
      b = c[1];
    }
  }
  return b;
};
goog.labs.userAgent.browser.getOperaVersion_ = function(a) {
  a = goog.labs.userAgent.util.extractVersionTuples(a);
  var b = goog.array.peek(a);
  return "OPR" == b[0] && b[1] ? b[1] : goog.labs.userAgent.browser.getVersionFromTuples_(a);
};
goog.labs.userAgent.browser.getVersionFromTuples_ = function(a) {
  goog.asserts.assert(2 < a.length, "Couldn't extract version tuple from user agent string");
  return a[2] && a[2][1] ? a[2][1] : "";
};
goog.labs.userAgent.engine = {};
goog.labs.userAgent.engine.isPresto = function() {
  return goog.labs.userAgent.util.matchUserAgent("Presto");
};
goog.labs.userAgent.engine.isTrident = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.engine.isWebKit = function() {
  return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit");
};
goog.labs.userAgent.engine.isGecko = function() {
  return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident();
};
goog.labs.userAgent.engine.getVersion = function() {
  var a = goog.labs.userAgent.util.getUserAgent();
  if (a) {
    var a = goog.labs.userAgent.util.extractVersionTuples(a), b = a[1];
    if (b) {
      return "Gecko" == b[0] ? goog.labs.userAgent.engine.getVersionForKey_(a, "Firefox") : b[1];
    }
    var a = a[0], c;
    if (a && (c = a[2]) && (c = /Trident\/([^\s;]+)/.exec(c))) {
      return c[1];
    }
  }
  return "";
};
goog.labs.userAgent.engine.isVersionOrHigher = function(a) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), a);
};
goog.labs.userAgent.engine.getVersionForKey_ = function(a, b) {
  var c = goog.array.find(a, function(a) {
    return b == a[0];
  });
  return c && c[1] || "";
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.labs.userAgent.util.getUserAgent();
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator || null;
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
  return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile");
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var a = goog.userAgent.getNavigator();
  return a && a.platform || "";
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11");
  var a = goog.userAgent.getUserAgentString();
  goog.userAgent.detectedAndroid_ = !!a && goog.string.contains(a, "Android");
  goog.userAgent.detectedIPhone_ = !!a && goog.string.contains(a, "iPhone");
  goog.userAgent.detectedIPad_ = !!a && goog.string.contains(a, "iPad");
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.userAgent.detectedAndroid_;
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.userAgent.detectedIPhone_;
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.userAgent.detectedIPad_;
goog.userAgent.determineVersion_ = function() {
  var a = "", b;
  if (goog.userAgent.OPERA && goog.global.opera) {
    return a = goog.global.opera.version, goog.isFunction(a) ? a() : a;
  }
  goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/);
  b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : "");
  return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a)) ? String(b) : a;
};
goog.userAgent.getDocumentMode_ = function() {
  var a = goog.global.document;
  return a ? a.documentMode : void 0;
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
  return goog.string.compareVersions(a, b);
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(a) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[a] || (goog.userAgent.isVersionOrHigherCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a));
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(a) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= a;
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
  var a = goog.global.document;
  return a && goog.userAgent.IE ? goog.userAgent.getDocumentMode_() || ("CSS1Compat" == a.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5) : void 0;
}();
goog.events = {};
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE && 
goog.userAgent.isVersionOrHigher("8") || goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), TOUCH_ENABLED:"ontouchstart" in goog.global || !!(goog.global.document && document.documentElement && "ontouchstart" in document.documentElement) || !(!goog.global.navigator || 
!goog.global.navigator.msMaxTouchPoints)};
goog.events.EventId = function(a) {
  this.id = a;
};
goog.events.EventId.prototype.toString = function() {
  return this.id;
};
goog.events.Event = function(a, b) {
  this.type = a instanceof goog.events.EventId ? String(a) : a;
  this.currentTarget = this.target = b;
  this.defaultPrevented = this.propagationStopped_ = !1;
  this.returnValue_ = !0;
};
goog.events.Event.prototype.disposeInternal = function() {
};
goog.events.Event.prototype.dispose = function() {
};
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = !0;
};
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
  this.returnValue_ = !1;
};
goog.events.Event.stopPropagation = function(a) {
  a.stopPropagation();
};
goog.events.Event.preventDefault = function(a) {
  a.preventDefault();
};
goog.events.getVendorPrefixedName_ = function(a) {
  return goog.userAgent.WEBKIT ? "webkit" + a : goog.userAgent.OPERA ? "o" + a.toLowerCase() : a.toLowerCase();
};
goog.events.EventType = {CLICK:"click", RIGHTCLICK:"rightclick", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", MOUSEENTER:"mouseenter", MOUSELEAVE:"mouseleave", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", 
SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", DRAGSTART:"dragstart", DRAG:"drag", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", DRAGEND:"dragend", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", BEFOREUNLOAD:"beforeunload", CONSOLEMESSAGE:"consolemessage", CONTEXTMENU:"contextmenu", DOMCONTENTLOADED:"DOMContentLoaded", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", 
ORIENTATIONCHANGE:"orientationchange", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", ANIMATIONSTART:goog.events.getVendorPrefixedName_("AnimationStart"), ANIMATIONEND:goog.events.getVendorPrefixedName_("AnimationEnd"), 
ANIMATIONITERATION:goog.events.getVendorPrefixedName_("AnimationIteration"), TRANSITIONEND:goog.events.getVendorPrefixedName_("TransitionEnd"), POINTERDOWN:"pointerdown", POINTERUP:"pointerup", POINTERCANCEL:"pointercancel", POINTERMOVE:"pointermove", POINTEROVER:"pointerover", POINTEROUT:"pointerout", POINTERENTER:"pointerenter", POINTERLEAVE:"pointerleave", GOTPOINTERCAPTURE:"gotpointercapture", LOSTPOINTERCAPTURE:"lostpointercapture", MSGESTURECHANGE:"MSGestureChange", MSGESTUREEND:"MSGestureEnd", 
MSGESTUREHOLD:"MSGestureHold", MSGESTURESTART:"MSGestureStart", MSGESTURETAP:"MSGestureTap", MSGOTPOINTERCAPTURE:"MSGotPointerCapture", MSINERTIASTART:"MSInertiaStart", MSLOSTPOINTERCAPTURE:"MSLostPointerCapture", MSPOINTERCANCEL:"MSPointerCancel", MSPOINTERDOWN:"MSPointerDown", MSPOINTERENTER:"MSPointerEnter", MSPOINTERHOVER:"MSPointerHover", MSPOINTERLEAVE:"MSPointerLeave", MSPOINTERMOVE:"MSPointerMove", MSPOINTEROUT:"MSPointerOut", MSPOINTEROVER:"MSPointerOver", MSPOINTERUP:"MSPointerUp", TEXTINPUT:"textinput", 
COMPOSITIONSTART:"compositionstart", COMPOSITIONUPDATE:"compositionupdate", COMPOSITIONEND:"compositionend", EXIT:"exit", LOADABORT:"loadabort", LOADCOMMIT:"loadcommit", LOADREDIRECT:"loadredirect", LOADSTART:"loadstart", LOADSTOP:"loadstop", RESPONSIVE:"responsive", SIZECHANGED:"sizechanged", UNRESPONSIVE:"unresponsive", VISIBILITYCHANGE:"visibilitychange", STORAGE:"storage", DOMSUBTREEMODIFIED:"DOMSubtreeModified", DOMNODEINSERTED:"DOMNodeInserted", DOMNODEREMOVED:"DOMNodeRemoved", DOMNODEREMOVEDFROMDOCUMENT:"DOMNodeRemovedFromDocument", 
DOMNODEINSERTEDINTODOCUMENT:"DOMNodeInsertedIntoDocument", DOMATTRMODIFIED:"DOMAttrModified", DOMCHARACTERDATAMODIFIED:"DOMCharacterDataModified"};
goog.reflect = {};
goog.reflect.object = function(a, b) {
  return b;
};
goog.reflect.sinkValue = function(a) {
  goog.reflect.sinkValue[" "](a);
  return a;
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(a, b) {
  try {
    return goog.reflect.sinkValue(a[b]), !0;
  } catch (c) {
  }
  return!1;
};
goog.events.BrowserEvent = function(a, b) {
  goog.events.Event.call(this, a ? a.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.charCode = this.keyCode = this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
  this.state = null;
  this.platformModifierKey = !1;
  this.event_ = null;
  a && this.init(a, b);
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.init = function(a, b) {
  var c = this.type = a.type;
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  d ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty(d, "nodeName") || (d = null)) : c == goog.events.EventType.MOUSEOVER ? d = a.fromElement : c == goog.events.EventType.MOUSEOUT && (d = a.toElement);
  this.relatedTarget = d;
  this.offsetX = goog.userAgent.WEBKIT || void 0 !== a.offsetX ? a.offsetX : a.layerX;
  this.offsetY = goog.userAgent.WEBKIT || void 0 !== a.offsetY ? a.offsetY : a.layerY;
  this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
  this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
  this.screenX = a.screenX || 0;
  this.screenY = a.screenY || 0;
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.event_ = a;
  a.defaultPrevented && this.preventDefault();
};
goog.events.BrowserEvent.prototype.isButton = function(a) {
  return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : "click" == this.type ? a == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[a]);
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey);
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0;
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var a = this.event_;
  if (a.preventDefault) {
    a.preventDefault();
  } else {
    if (a.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1;
        }
      } catch (b) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_;
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {
};
goog.events.Listenable = function() {
};
goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (1E6 * Math.random() | 0);
goog.events.Listenable.addImplementation = function(a) {
  a.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = !0;
};
goog.events.Listenable.isImplementedBy = function(a) {
  return!(!a || !a[goog.events.Listenable.IMPLEMENTED_BY_PROP]);
};
goog.events.ListenableKey = function() {
};
goog.events.ListenableKey.counter_ = 0;
goog.events.ListenableKey.reserveKey = function() {
  return++goog.events.ListenableKey.counter_;
};
goog.events.Listener = function(a, b, c, d, e, f) {
  goog.events.Listener.ENABLE_MONITORING && (this.creationStack = Error().stack);
  this.listener = a;
  this.proxy = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.handler = f;
  this.key = goog.events.ListenableKey.reserveKey();
  this.removed = this.callOnce = !1;
};
goog.events.Listener.ENABLE_MONITORING = !1;
goog.events.Listener.prototype.markAsRemoved = function() {
  this.removed = !0;
  this.handler = this.src = this.proxy = this.listener = null;
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for (var d in a) {
    b.call(c, a[d], d, a);
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for (e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e]);
  }
  return d;
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for (e in a) {
    d[e] = b.call(c, a[e], e, a);
  }
  return d;
};
goog.object.some = function(a, b, c) {
  for (var d in a) {
    if (b.call(c, a[d], d, a)) {
      return!0;
    }
  }
  return!1;
};
goog.object.every = function(a, b, c) {
  for (var d in a) {
    if (!b.call(c, a[d], d, a)) {
      return!1;
    }
  }
  return!0;
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for (c in a) {
    b++;
  }
  return b;
};
goog.object.getAnyKey = function(a) {
  for (var b in a) {
    return b;
  }
};
goog.object.getAnyValue = function(a) {
  for (var b in a) {
    return a[b];
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b);
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = a[d];
  }
  return b;
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = d;
  }
  return b;
};
goog.object.getValueByKeys = function(a, b) {
  for (var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length && (a = a[d[c]], goog.isDef(a));c++) {
  }
  return a;
};
goog.object.containsKey = function(a, b) {
  return b in a;
};
goog.object.containsValue = function(a, b) {
  for (var c in a) {
    if (a[c] == b) {
      return!0;
    }
  }
  return!1;
};
goog.object.findKey = function(a, b, c) {
  for (var d in a) {
    if (b.call(c, a[d], d, a)) {
      return d;
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b];
};
goog.object.isEmpty = function(a) {
  for (var b in a) {
    return!1;
  }
  return!0;
};
goog.object.clear = function(a) {
  for (var b in a) {
    delete a[b];
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c;
};
goog.object.add = function(a, b, c) {
  if (b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c);
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c;
};
goog.object.set = function(a, b, c) {
  a[b] = c;
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c;
};
goog.object.clone = function(a) {
  var b = {}, c;
  for (c in a) {
    b[c] = a[c];
  }
  return b;
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if ("object" == b || "array" == b) {
    if (a.clone) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, c;
    for (c in a) {
      b[c] = goog.object.unsafeClone(a[c]);
    }
    return b;
  }
  return a;
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for (c in a) {
    b[a[c]] = c;
  }
  return b;
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
  for (var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for (c in d) {
      a[c] = d[c];
    }
    for (var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if (1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (b % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1];
  }
  return c;
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if (1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  for (var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0;
  }
  return c;
};
goog.object.createImmutableView = function(a) {
  var b = a;
  Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
  return b;
};
goog.object.isImmutableView = function(a) {
  return!!Object.isFrozen && Object.isFrozen(a);
};
goog.events.ListenerMap = function(a) {
  this.src = a;
  this.listeners = {};
  this.typeCount_ = 0;
};
goog.events.ListenerMap.prototype.getTypeCount = function() {
  return this.typeCount_;
};
goog.events.ListenerMap.prototype.getListenerCount = function() {
  var a = 0, b;
  for (b in this.listeners) {
    a += this.listeners[b].length;
  }
  return a;
};
goog.events.ListenerMap.prototype.add = function(a, b, c, d, e) {
  var f = a.toString();
  a = this.listeners[f];
  a || (a = this.listeners[f] = [], this.typeCount_++);
  var g = goog.events.ListenerMap.findListenerIndex_(a, b, d, e);
  -1 < g ? (b = a[g], c || (b.callOnce = !1)) : (b = new goog.events.Listener(b, null, this.src, f, !!d, e), b.callOnce = c, a.push(b));
  return b;
};
goog.events.ListenerMap.prototype.remove = function(a, b, c, d) {
  a = a.toString();
  if (!(a in this.listeners)) {
    return!1;
  }
  var e = this.listeners[a];
  b = goog.events.ListenerMap.findListenerIndex_(e, b, c, d);
  return-1 < b ? (e[b].markAsRemoved(), goog.array.removeAt(e, b), 0 == e.length && (delete this.listeners[a], this.typeCount_--), !0) : !1;
};
goog.events.ListenerMap.prototype.removeByKey = function(a) {
  var b = a.type;
  if (!(b in this.listeners)) {
    return!1;
  }
  var c = goog.array.remove(this.listeners[b], a);
  c && (a.markAsRemoved(), 0 == this.listeners[b].length && (delete this.listeners[b], this.typeCount_--));
  return c;
};
goog.events.ListenerMap.prototype.removeAll = function(a) {
  a = a && a.toString();
  var b = 0, c;
  for (c in this.listeners) {
    if (!a || c == a) {
      for (var d = this.listeners[c], e = 0;e < d.length;e++) {
        ++b, d[e].markAsRemoved();
      }
      delete this.listeners[c];
      this.typeCount_--;
    }
  }
  return b;
};
goog.events.ListenerMap.prototype.getListeners = function(a, b) {
  var c = this.listeners[a.toString()], d = [];
  if (c) {
    for (var e = 0;e < c.length;++e) {
      var f = c[e];
      f.capture == b && d.push(f);
    }
  }
  return d;
};
goog.events.ListenerMap.prototype.getListener = function(a, b, c, d) {
  a = this.listeners[a.toString()];
  var e = -1;
  a && (e = goog.events.ListenerMap.findListenerIndex_(a, b, c, d));
  return-1 < e ? a[e] : null;
};
goog.events.ListenerMap.prototype.hasListener = function(a, b) {
  var c = goog.isDef(a), d = c ? a.toString() : "", e = goog.isDef(b);
  return goog.object.some(this.listeners, function(a, g) {
    for (var h = 0;h < a.length;++h) {
      if (!(c && a[h].type != d || e && a[h].capture != b)) {
        return!0;
      }
    }
    return!1;
  });
};
goog.events.ListenerMap.findListenerIndex_ = function(a, b, c, d) {
  for (var e = 0;e < a.length;++e) {
    var f = a[e];
    if (!f.removed && f.listener == b && f.capture == !!c && f.handler == d) {
      return e;
    }
  }
  return-1;
};
goog.events.LISTENER_MAP_PROP_ = "closure_lm_" + (1E6 * Math.random() | 0);
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.CaptureSimulationMode = {OFF_AND_FAIL:0, OFF_AND_SILENT:1, ON:2};
goog.events.CAPTURE_SIMULATION_MODE = 2;
goog.events.listenerCountEstimate_ = 0;
goog.events.listen = function(a, b, c, d, e) {
  if (goog.isArray(b)) {
    for (var f = 0;f < b.length;f++) {
      goog.events.listen(a, b[f], c, d, e);
    }
    return null;
  }
  c = goog.events.wrapListener(c);
  return goog.events.Listenable.isImplementedBy(a) ? a.listen(b, c, d, e) : goog.events.listen_(a, b, c, !1, d, e);
};
goog.events.listen_ = function(a, b, c, d, e, f) {
  if (!b) {
    throw Error("Invalid event type");
  }
  var g = !!e;
  if (g && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_FAIL) {
      return goog.asserts.fail("Can not register capture listener in IE8-."), null;
    }
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_SILENT) {
      return null;
    }
  }
  var h = goog.events.getListenerMap_(a);
  h || (a[goog.events.LISTENER_MAP_PROP_] = h = new goog.events.ListenerMap(a));
  c = h.add(b, c, d, e, f);
  if (c.proxy) {
    return c;
  }
  d = goog.events.getProxy();
  c.proxy = d;
  d.src = a;
  d.listener = c;
  a.addEventListener ? a.addEventListener(b.toString(), d, g) : a.attachEvent(goog.events.getOnString_(b.toString()), d);
  goog.events.listenerCountEstimate_++;
  return c;
};
goog.events.getProxy = function() {
  var a = goog.events.handleBrowserEvent_, b = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(c) {
    return a.call(b.src, b.listener, c);
  } : function(c) {
    c = a.call(b.src, b.listener, c);
    if (!c) {
      return c;
    }
  };
  return b;
};
goog.events.listenOnce = function(a, b, c, d, e) {
  if (goog.isArray(b)) {
    for (var f = 0;f < b.length;f++) {
      goog.events.listenOnce(a, b[f], c, d, e);
    }
    return null;
  }
  c = goog.events.wrapListener(c);
  return goog.events.Listenable.isImplementedBy(a) ? a.listenOnce(b, c, d, e) : goog.events.listen_(a, b, c, !0, d, e);
};
goog.events.listenWithWrapper = function(a, b, c, d, e) {
  b.listen(a, c, d, e);
};
goog.events.unlisten = function(a, b, c, d, e) {
  if (goog.isArray(b)) {
    for (var f = 0;f < b.length;f++) {
      goog.events.unlisten(a, b[f], c, d, e);
    }
    return null;
  }
  c = goog.events.wrapListener(c);
  if (goog.events.Listenable.isImplementedBy(a)) {
    return a.unlisten(b, c, d, e);
  }
  if (!a) {
    return!1;
  }
  d = !!d;
  if (a = goog.events.getListenerMap_(a)) {
    if (b = a.getListener(b, c, d, e)) {
      return goog.events.unlistenByKey(b);
    }
  }
  return!1;
};
goog.events.unlistenByKey = function(a) {
  if (goog.isNumber(a) || !a || a.removed) {
    return!1;
  }
  var b = a.src;
  if (goog.events.Listenable.isImplementedBy(b)) {
    return b.unlistenByKey(a);
  }
  var c = a.type, d = a.proxy;
  b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent && b.detachEvent(goog.events.getOnString_(c), d);
  goog.events.listenerCountEstimate_--;
  (c = goog.events.getListenerMap_(b)) ? (c.removeByKey(a), 0 == c.getTypeCount() && (c.src = null, b[goog.events.LISTENER_MAP_PROP_] = null)) : a.markAsRemoved();
  return!0;
};
goog.events.unlistenWithWrapper = function(a, b, c, d, e) {
  b.unlisten(a, c, d, e);
};
goog.events.removeAll = function(a, b) {
  if (!a) {
    return 0;
  }
  if (goog.events.Listenable.isImplementedBy(a)) {
    return a.removeAllListeners(b);
  }
  var c = goog.events.getListenerMap_(a);
  if (!c) {
    return 0;
  }
  var d = 0, e = b && b.toString(), f;
  for (f in c.listeners) {
    if (!e || f == e) {
      for (var g = c.listeners[f].concat(), h = 0;h < g.length;++h) {
        goog.events.unlistenByKey(g[h]) && ++d;
      }
    }
  }
  return d;
};
goog.events.removeAllNativeListeners = function() {
  return goog.events.listenerCountEstimate_ = 0;
};
goog.events.getListeners = function(a, b, c) {
  return goog.events.Listenable.isImplementedBy(a) ? a.getListeners(b, c) : a ? (a = goog.events.getListenerMap_(a)) ? a.getListeners(b, c) : [] : [];
};
goog.events.getListener = function(a, b, c, d, e) {
  c = goog.events.wrapListener(c);
  d = !!d;
  return goog.events.Listenable.isImplementedBy(a) ? a.getListener(b, c, d, e) : a ? (a = goog.events.getListenerMap_(a)) ? a.getListener(b, c, d, e) : null : null;
};
goog.events.hasListener = function(a, b, c) {
  if (goog.events.Listenable.isImplementedBy(a)) {
    return a.hasListener(b, c);
  }
  a = goog.events.getListenerMap_(a);
  return!!a && a.hasListener(b, c);
};
goog.events.expose = function(a) {
  var b = [], c;
  for (c in a) {
    a[c] && a[c].id ? b.push(c + " \x3d " + a[c] + " (" + a[c].id + ")") : b.push(c + " \x3d " + a[c]);
  }
  return b.join("\n");
};
goog.events.getOnString_ = function(a) {
  return a in goog.events.onStringMap_ ? goog.events.onStringMap_[a] : goog.events.onStringMap_[a] = goog.events.onString_ + a;
};
goog.events.fireListeners = function(a, b, c, d) {
  return goog.events.Listenable.isImplementedBy(a) ? a.fireListeners(b, c, d) : goog.events.fireListeners_(a, b, c, d);
};
goog.events.fireListeners_ = function(a, b, c, d) {
  var e = 1;
  if (a = goog.events.getListenerMap_(a)) {
    if (b = a.listeners[b.toString()]) {
      for (b = b.concat(), a = 0;a < b.length;a++) {
        var f = b[a];
        f && f.capture == c && !f.removed && (e &= !1 !== goog.events.fireListener(f, d));
      }
    }
  }
  return Boolean(e);
};
goog.events.fireListener = function(a, b) {
  var c = a.listener, d = a.handler || a.src;
  a.callOnce && goog.events.unlistenByKey(a);
  return c.call(d, b);
};
goog.events.getTotalListenerCount = function() {
  return goog.events.listenerCountEstimate_;
};
goog.events.dispatchEvent = function(a, b) {
  goog.asserts.assert(goog.events.Listenable.isImplementedBy(a), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance.");
  return a.dispatchEvent(b);
};
goog.events.protectBrowserEventEntryPoint = function(a) {
  goog.events.handleBrowserEvent_ = a.protectEntryPoint(goog.events.handleBrowserEvent_);
};
goog.events.handleBrowserEvent_ = function(a, b) {
  if (a.removed) {
    return!0;
  }
  if (!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var c = b || goog.getObjectByName("window.event"), d = new goog.events.BrowserEvent(c, this), e = !0;
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.ON) {
      if (!goog.events.isMarkedIeEvent_(c)) {
        goog.events.markIeEvent_(c);
        for (var c = [], f = d.currentTarget;f;f = f.parentNode) {
          c.push(f);
        }
        for (var f = a.type, g = c.length - 1;!d.propagationStopped_ && 0 <= g;g--) {
          d.currentTarget = c[g], e &= goog.events.fireListeners_(c[g], f, !0, d);
        }
        for (g = 0;!d.propagationStopped_ && g < c.length;g++) {
          d.currentTarget = c[g], e &= goog.events.fireListeners_(c[g], f, !1, d);
        }
      }
    } else {
      e = goog.events.fireListener(a, d);
    }
    return e;
  }
  return goog.events.fireListener(a, new goog.events.BrowserEvent(b, this));
};
goog.events.markIeEvent_ = function(a) {
  var b = !1;
  if (0 == a.keyCode) {
    try {
      a.keyCode = -1;
      return;
    } catch (c) {
      b = !0;
    }
  }
  if (b || void 0 == a.returnValue) {
    a.returnValue = !0;
  }
};
goog.events.isMarkedIeEvent_ = function(a) {
  return 0 > a.keyCode || void 0 != a.returnValue;
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(a) {
  return a + "_" + goog.events.uniqueIdCounter_++;
};
goog.events.getListenerMap_ = function(a) {
  a = a[goog.events.LISTENER_MAP_PROP_];
  return a instanceof goog.events.ListenerMap ? a : null;
};
goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
goog.events.wrapListener = function(a) {
  goog.asserts.assert(a, "Listener can not be null.");
  if (goog.isFunction(a)) {
    return a;
  }
  goog.asserts.assert(a.handleEvent, "An object listener must have handleEvent method.");
  a[goog.events.LISTENER_WRAPPER_PROP_] || (a[goog.events.LISTENER_WRAPPER_PROP_] = function(b) {
    return a.handleEvent(b);
  });
  return a[goog.events.LISTENER_WRAPPER_PROP_];
};
goog.debug.entryPointRegistry.register(function(a) {
  goog.events.handleBrowserEvent_ = a(goog.events.handleBrowserEvent_);
});
goog.events.EventTarget = function() {
  goog.Disposable.call(this);
  this.eventTargetListeners_ = new goog.events.ListenerMap(this);
  this.actualEventTarget_ = this;
  this.parentEventTarget_ = null;
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.Listenable.addImplementation(goog.events.EventTarget);
goog.events.EventTarget.MAX_ANCESTORS_ = 1E3;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_;
};
goog.events.EventTarget.prototype.setParentEventTarget = function(a) {
  this.parentEventTarget_ = a;
};
goog.events.EventTarget.prototype.addEventListener = function(a, b, c, d) {
  goog.events.listen(this, a, b, c, d);
};
goog.events.EventTarget.prototype.removeEventListener = function(a, b, c, d) {
  goog.events.unlisten(this, a, b, c, d);
};
goog.events.EventTarget.prototype.dispatchEvent = function(a) {
  this.assertInitialized_();
  var b, c = this.getParentEventTarget();
  if (c) {
    b = [];
    for (var d = 1;c;c = c.getParentEventTarget()) {
      b.push(c), goog.asserts.assert(++d < goog.events.EventTarget.MAX_ANCESTORS_, "infinite loop");
    }
  }
  return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, a, b);
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  this.removeAllListeners();
  this.parentEventTarget_ = null;
};
goog.events.EventTarget.prototype.listen = function(a, b, c, d) {
  this.assertInitialized_();
  return this.eventTargetListeners_.add(String(a), b, !1, c, d);
};
goog.events.EventTarget.prototype.listenOnce = function(a, b, c, d) {
  return this.eventTargetListeners_.add(String(a), b, !0, c, d);
};
goog.events.EventTarget.prototype.unlisten = function(a, b, c, d) {
  return this.eventTargetListeners_.remove(String(a), b, c, d);
};
goog.events.EventTarget.prototype.unlistenByKey = function(a) {
  return this.eventTargetListeners_.removeByKey(a);
};
goog.events.EventTarget.prototype.removeAllListeners = function(a) {
  return this.eventTargetListeners_ ? this.eventTargetListeners_.removeAll(a) : 0;
};
goog.events.EventTarget.prototype.fireListeners = function(a, b, c) {
  a = this.eventTargetListeners_.listeners[String(a)];
  if (!a) {
    return!0;
  }
  a = a.concat();
  for (var d = !0, e = 0;e < a.length;++e) {
    var f = a[e];
    if (f && !f.removed && f.capture == b) {
      var g = f.listener, h = f.handler || f.src;
      f.callOnce && this.unlistenByKey(f);
      d = !1 !== g.call(h, c) && d;
    }
  }
  return d && !1 != c.returnValue_;
};
goog.events.EventTarget.prototype.getListeners = function(a, b) {
  return this.eventTargetListeners_.getListeners(String(a), b);
};
goog.events.EventTarget.prototype.getListener = function(a, b, c, d) {
  return this.eventTargetListeners_.getListener(String(a), b, c, d);
};
goog.events.EventTarget.prototype.hasListener = function(a, b) {
  var c = goog.isDef(a) ? String(a) : void 0;
  return this.eventTargetListeners_.hasListener(c, b);
};
goog.events.EventTarget.prototype.setTargetForTesting = function(a) {
  this.actualEventTarget_ = a;
};
goog.events.EventTarget.prototype.assertInitialized_ = function() {
  goog.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?");
};
goog.events.EventTarget.dispatchEventInternal_ = function(a, b, c) {
  var d = b.type || b;
  if (goog.isString(b)) {
    b = new goog.events.Event(b, a);
  } else {
    if (b instanceof goog.events.Event) {
      b.target = b.target || a;
    } else {
      var e = b;
      b = new goog.events.Event(d, a);
      goog.object.extend(b, e);
    }
  }
  var e = !0, f;
  if (c) {
    for (var g = c.length - 1;!b.propagationStopped_ && 0 <= g;g--) {
      f = b.currentTarget = c[g], e = f.fireListeners(d, !0, b) && e;
    }
  }
  b.propagationStopped_ || (f = b.currentTarget = a, e = f.fireListeners(d, !0, b) && e, b.propagationStopped_ || (e = f.fireListeners(d, !1, b) && e));
  if (c) {
    for (g = 0;!b.propagationStopped_ && g < c.length;g++) {
      f = b.currentTarget = c[g], e = f.fireListeners(d, !1, b) && e;
    }
  }
  return e;
};
goog.Timer = function(a, b) {
  goog.events.EventTarget.call(this);
  this.interval_ = a || 1;
  this.timerObject_ = b || goog.Timer.defaultTimerObject;
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now();
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.prototype.enabled = !1;
goog.Timer.defaultTimerObject = goog.global;
goog.Timer.intervalScale = .8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.getInterval = function() {
  return this.interval_;
};
goog.Timer.prototype.setInterval = function(a) {
  this.interval_ = a;
  this.timer_ && this.enabled ? (this.stop(), this.start()) : this.timer_ && this.stop();
};
goog.Timer.prototype.tick_ = function() {
  if (this.enabled) {
    var a = goog.now() - this.last_;
    0 < a && a < this.interval_ * goog.Timer.intervalScale ? this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - a) : (this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null), this.dispatchTick(), this.enabled && (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now()));
  }
};
goog.Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK);
};
goog.Timer.prototype.start = function() {
  this.enabled = !0;
  this.timer_ || (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now());
};
goog.Timer.prototype.stop = function() {
  this.enabled = !1;
  this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null);
};
goog.Timer.prototype.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_;
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(a, b, c) {
  if (goog.isFunction(a)) {
    c && (a = goog.bind(a, c));
  } else {
    if (a && "function" == typeof a.handleEvent) {
      a = goog.bind(a.handleEvent, a);
    } else {
      throw Error("Invalid listener argument");
    }
  }
  return b > goog.Timer.MAX_TIMEOUT_ ? -1 : goog.Timer.defaultTimerObject.setTimeout(a, b || 0);
};
goog.Timer.clear = function(a) {
  goog.Timer.defaultTimerObject.clearTimeout(a);
};
goog.json = {};
goog.json.USE_NATIVE_JSON = !1;
goog.json.isValid = function(a) {
  return/^\s*$/.test(a) ? !1 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""));
};
goog.json.parse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(a) {
  a = String(a);
  if (goog.json.isValid(a)) {
    try {
      return eval("(" + a + ")");
    } catch (b) {
    }
  }
  throw Error("Invalid JSON string: " + a);
};
goog.json.unsafeParse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(a) {
  return eval("(" + a + ")");
};
goog.json.serialize = goog.json.USE_NATIVE_JSON ? goog.global.JSON.stringify : function(a, b) {
  return(new goog.json.Serializer(b)).serialize(a);
};
goog.json.Serializer = function(a) {
  this.replacer_ = a;
};
goog.json.Serializer.prototype.serialize = function(a) {
  var b = [];
  this.serializeInternal(a, b);
  return b.join("");
};
goog.json.Serializer.prototype.serializeInternal = function(a, b) {
  switch(typeof a) {
    case "string":
      this.serializeString_(a, b);
      break;
    case "number":
      this.serializeNumber_(a, b);
      break;
    case "boolean":
      b.push(a);
      break;
    case "undefined":
      b.push("null");
      break;
    case "object":
      if (null == a) {
        b.push("null");
        break;
      }
      if (goog.isArray(a)) {
        this.serializeArray(a, b);
        break;
      }
      this.serializeObject_(a, b);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof a);;
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(a, b) {
  b.push('"', a.replace(goog.json.Serializer.charsToReplace_, function(a) {
    if (a in goog.json.Serializer.charToJsonCharCache_) {
      return goog.json.Serializer.charToJsonCharCache_[a];
    }
    var b = a.charCodeAt(0), e = "\\u";
    16 > b ? e += "000" : 256 > b ? e += "00" : 4096 > b && (e += "0");
    return goog.json.Serializer.charToJsonCharCache_[a] = e + b.toString(16);
  }), '"');
};
goog.json.Serializer.prototype.serializeNumber_ = function(a, b) {
  b.push(isFinite(a) && !isNaN(a) ? a : "null");
};
goog.json.Serializer.prototype.serializeArray = function(a, b) {
  var c = a.length;
  b.push("[");
  for (var d = "", e = 0;e < c;e++) {
    b.push(d), d = a[e], this.serializeInternal(this.replacer_ ? this.replacer_.call(a, String(e), d) : d, b), d = ",";
  }
  b.push("]");
};
goog.json.Serializer.prototype.serializeObject_ = function(a, b) {
  b.push("{");
  var c = "", d;
  for (d in a) {
    if (Object.prototype.hasOwnProperty.call(a, d)) {
      var e = a[d];
      "function" != typeof e && (b.push(c), this.serializeString_(d, b), b.push(":"), this.serializeInternal(this.replacer_ ? this.replacer_.call(a, d, e) : e, b), c = ",");
    }
  }
  b.push("}");
};
goog.structs = {};
goog.structs.getCount = function(a) {
  return "function" == typeof a.getCount ? a.getCount() : goog.isArrayLike(a) || goog.isString(a) ? a.length : goog.object.getCount(a);
};
goog.structs.getValues = function(a) {
  if ("function" == typeof a.getValues) {
    return a.getValues();
  }
  if (goog.isString(a)) {
    return a.split("");
  }
  if (goog.isArrayLike(a)) {
    for (var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d]);
    }
    return b;
  }
  return goog.object.getValues(a);
};
goog.structs.getKeys = function(a) {
  if ("function" == typeof a.getKeys) {
    return a.getKeys();
  }
  if ("function" != typeof a.getValues) {
    if (goog.isArrayLike(a) || goog.isString(a)) {
      var b = [];
      a = a.length;
      for (var c = 0;c < a;c++) {
        b.push(c);
      }
      return b;
    }
    return goog.object.getKeys(a);
  }
};
goog.structs.contains = function(a, b) {
  return "function" == typeof a.contains ? a.contains(b) : "function" == typeof a.containsValue ? a.containsValue(b) : goog.isArrayLike(a) || goog.isString(a) ? goog.array.contains(a, b) : goog.object.containsValue(a, b);
};
goog.structs.isEmpty = function(a) {
  return "function" == typeof a.isEmpty ? a.isEmpty() : goog.isArrayLike(a) || goog.isString(a) ? goog.array.isEmpty(a) : goog.object.isEmpty(a);
};
goog.structs.clear = function(a) {
  "function" == typeof a.clear ? a.clear() : goog.isArrayLike(a) ? goog.array.clear(a) : goog.object.clear(a);
};
goog.structs.forEach = function(a, b, c) {
  if ("function" == typeof a.forEach) {
    a.forEach(b, c);
  } else {
    if (goog.isArrayLike(a) || goog.isString(a)) {
      goog.array.forEach(a, b, c);
    } else {
      for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
        b.call(c, e[g], d && d[g], a);
      }
    }
  }
};
goog.structs.filter = function(a, b, c) {
  if ("function" == typeof a.filter) {
    return a.filter(b, c);
  }
  if (goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.filter(a, b, c);
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if (e) {
    d = {};
    for (var h = 0;h < g;h++) {
      b.call(c, f[h], e[h], a) && (d[e[h]] = f[h]);
    }
  } else {
    for (d = [], h = 0;h < g;h++) {
      b.call(c, f[h], void 0, a) && d.push(f[h]);
    }
  }
  return d;
};
goog.structs.map = function(a, b, c) {
  if ("function" == typeof a.map) {
    return a.map(b, c);
  }
  if (goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.map(a, b, c);
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if (e) {
    d = {};
    for (var h = 0;h < g;h++) {
      d[e[h]] = b.call(c, f[h], e[h], a);
    }
  } else {
    for (d = [], h = 0;h < g;h++) {
      d[h] = b.call(c, f[h], void 0, a);
    }
  }
  return d;
};
goog.structs.some = function(a, b, c) {
  if ("function" == typeof a.some) {
    return a.some(b, c);
  }
  if (goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.some(a, b, c);
  }
  for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
    if (b.call(c, e[g], d && d[g], a)) {
      return!0;
    }
  }
  return!1;
};
goog.structs.every = function(a, b, c) {
  if ("function" == typeof a.every) {
    return a.every(b, c);
  }
  if (goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.every(a, b, c);
  }
  for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
    if (!b.call(c, e[g], d && d[g], a)) {
      return!1;
    }
  }
  return!0;
};
goog.structs.Collection = function() {
};
goog.functions = {};
goog.functions.constant = function(a) {
  return function() {
    return a;
  };
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(a, b) {
  return a;
};
goog.functions.error = function(a) {
  return function() {
    throw Error(a);
  };
};
goog.functions.fail = function(a) {
  return function() {
    throw a;
  };
};
goog.functions.lock = function(a, b) {
  b = b || 0;
  return function() {
    return a.apply(this, Array.prototype.slice.call(arguments, 0, b));
  };
};
goog.functions.nth = function(a) {
  return function() {
    return arguments[a];
  };
};
goog.functions.withReturnValue = function(a, b) {
  return goog.functions.sequence(a, goog.functions.constant(b));
};
goog.functions.compose = function(a, b) {
  var c = arguments, d = c.length;
  return function() {
    var a;
    d && (a = c[d - 1].apply(this, arguments));
    for (var b = d - 2;0 <= b;b--) {
      a = c[b].call(this, a);
    }
    return a;
  };
};
goog.functions.sequence = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for (var a, e = 0;e < c;e++) {
      a = b[e].apply(this, arguments);
    }
    return a;
  };
};
goog.functions.and = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for (var a = 0;a < c;a++) {
      if (!b[a].apply(this, arguments)) {
        return!1;
      }
    }
    return!0;
  };
};
goog.functions.or = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for (var a = 0;a < c;a++) {
      if (b[a].apply(this, arguments)) {
        return!0;
      }
    }
    return!1;
  };
};
goog.functions.not = function(a) {
  return function() {
    return!a.apply(this, arguments);
  };
};
goog.functions.create = function(a, b) {
  var c = function() {
  };
  c.prototype = a.prototype;
  c = new c;
  a.apply(c, Array.prototype.slice.call(arguments, 1));
  return c;
};
goog.functions.CACHE_RETURN_VALUE = !0;
goog.functions.cacheReturnValue = function(a) {
  var b = !1, c;
  return function() {
    if (!goog.functions.CACHE_RETURN_VALUE) {
      return a();
    }
    b || (c = a(), b = !0);
    return c;
  };
};
goog.math = {};
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a);
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a);
};
goog.math.clamp = function(a, b, c) {
  return Math.min(Math.max(a, b), c);
};
goog.math.modulo = function(a, b) {
  var c = a % b;
  return 0 > c * b ? c + b : c;
};
goog.math.lerp = function(a, b, c) {
  return a + c * (b - a);
};
goog.math.nearlyEquals = function(a, b, c) {
  return Math.abs(a - b) <= (c || 1E-6);
};
goog.math.standardAngle = function(a) {
  return goog.math.modulo(a, 360);
};
goog.math.standardAngleInRadians = function(a) {
  return goog.math.modulo(a, 2 * Math.PI);
};
goog.math.toRadians = function(a) {
  return a * Math.PI / 180;
};
goog.math.toDegrees = function(a) {
  return 180 * a / Math.PI;
};
goog.math.angleDx = function(a, b) {
  return b * Math.cos(goog.math.toRadians(a));
};
goog.math.angleDy = function(a, b) {
  return b * Math.sin(goog.math.toRadians(a));
};
goog.math.angle = function(a, b, c, d) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)));
};
goog.math.angleDifference = function(a, b) {
  var c = goog.math.standardAngle(b) - goog.math.standardAngle(a);
  180 < c ? c -= 360 : -180 >= c && (c = 360 + c);
  return c;
};
goog.math.sign = function(a) {
  return 0 == a ? 0 : 0 > a ? -1 : 1;
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
  c = c || function(a, b) {
    return a == b;
  };
  d = d || function(b, c) {
    return a[b];
  };
  for (var e = a.length, f = b.length, g = [], h = 0;h < e + 1;h++) {
    g[h] = [], g[h][0] = 0;
  }
  for (var k = 0;k < f + 1;k++) {
    g[0][k] = 0;
  }
  for (h = 1;h <= e;h++) {
    for (k = 1;k <= f;k++) {
      c(a[h - 1], b[k - 1]) ? g[h][k] = g[h - 1][k - 1] + 1 : g[h][k] = Math.max(g[h - 1][k], g[h][k - 1]);
    }
  }
  for (var l = [], h = e, k = f;0 < h && 0 < k;) {
    c(a[h - 1], b[k - 1]) ? (l.unshift(d(h - 1, k - 1)), h--, k--) : g[h - 1][k] > g[h][k - 1] ? h-- : k--;
  }
  return l;
};
goog.math.sum = function(a) {
  return goog.array.reduce(arguments, function(a, c) {
    return a + c;
  }, 0);
};
goog.math.average = function(a) {
  return goog.math.sum.apply(null, arguments) / arguments.length;
};
goog.math.sampleVariance = function(a) {
  var b = arguments.length;
  if (2 > b) {
    return 0;
  }
  var c = goog.math.average.apply(null, arguments);
  return goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
    return Math.pow(a - c, 2);
  })) / (b - 1);
};
goog.math.standardDeviation = function(a) {
  return Math.sqrt(goog.math.sampleVariance.apply(null, arguments));
};
goog.math.isInt = function(a) {
  return isFinite(a) && 0 == a % 1;
};
goog.math.isFiniteNumber = function(a) {
  return isFinite(a) && !isNaN(a);
};
goog.math.log10Floor = function(a) {
  if (0 < a) {
    var b = Math.round(Math.log(a) * Math.LOG10E);
    return b - (parseFloat("1e" + b) > a);
  }
  return 0 == a ? -Infinity : NaN;
};
goog.math.safeFloor = function(a, b) {
  goog.asserts.assert(!goog.isDef(b) || 0 < b);
  return Math.floor(a + (b || 2E-15));
};
goog.math.safeCeil = function(a, b) {
  goog.asserts.assert(!goog.isDef(b) || 0 < b);
  return Math.ceil(a - (b || 2E-15));
};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : Error("StopIteration");
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(a) {
  return this;
};
goog.iter.toIterator = function(a) {
  if (a instanceof goog.iter.Iterator) {
    return a;
  }
  if ("function" == typeof a.__iterator__) {
    return a.__iterator__(!1);
  }
  if (goog.isArrayLike(a)) {
    var b = 0, c = new goog.iter.Iterator;
    c.next = function() {
      for (;;) {
        if (b >= a.length) {
          throw goog.iter.StopIteration;
        }
        if (b in a) {
          return a[b++];
        }
        b++;
      }
    };
    return c;
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(a, b, c) {
  if (goog.isArrayLike(a)) {
    try {
      goog.array.forEach(a, b, c);
    } catch (d) {
      if (d !== goog.iter.StopIteration) {
        throw d;
      }
    }
  } else {
    a = goog.iter.toIterator(a);
    try {
      for (;;) {
        b.call(c, a.next(), void 0, a);
      }
    } catch (e) {
      if (e !== goog.iter.StopIteration) {
        throw e;
      }
    }
  }
};
goog.iter.filter = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    for (;;) {
      var a = d.next();
      if (b.call(c, a, void 0, d)) {
        return a;
      }
    }
  };
  return a;
};
goog.iter.filterFalse = function(a, b, c) {
  return goog.iter.filter(a, goog.functions.not(b), c);
};
goog.iter.range = function(a, b, c) {
  var d = 0, e = a, f = c || 1;
  1 < arguments.length && (d = a, e = b);
  if (0 == f) {
    throw Error("Range step argument must not be zero");
  }
  var g = new goog.iter.Iterator;
  g.next = function() {
    if (0 < f && d >= e || 0 > f && d <= e) {
      throw goog.iter.StopIteration;
    }
    var a = d;
    d += f;
    return a;
  };
  return g;
};
goog.iter.join = function(a, b) {
  return goog.iter.toArray(a).join(b);
};
goog.iter.map = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    var a = d.next();
    return b.call(c, a, void 0, d);
  };
  return a;
};
goog.iter.reduce = function(a, b, c, d) {
  var e = c;
  goog.iter.forEach(a, function(a) {
    e = b.call(d, e, a);
  });
  return e;
};
goog.iter.some = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for (;;) {
      if (b.call(c, a.next(), void 0, a)) {
        return!0;
      }
    }
  } catch (d) {
    if (d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return!1;
};
goog.iter.every = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for (;;) {
      if (!b.call(c, a.next(), void 0, a)) {
        return!1;
      }
    }
  } catch (d) {
    if (d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return!0;
};
goog.iter.chain = function(a) {
  var b = goog.iter.toIterator(arguments), c = new goog.iter.Iterator, d = null;
  c.next = function() {
    for (;;) {
      if (null == d) {
        var a = b.next();
        d = goog.iter.toIterator(a);
      }
      try {
        return d.next();
      } catch (c) {
        if (c !== goog.iter.StopIteration) {
          throw c;
        }
        d = null;
      }
    }
  };
  return c;
};
goog.iter.chainFromIterable = function(a) {
  return goog.iter.chain.apply(void 0, a);
};
goog.iter.dropWhile = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  var e = !0;
  a.next = function() {
    for (;;) {
      var a = d.next();
      if (!e || !b.call(c, a, void 0, d)) {
        return e = !1, a;
      }
    }
  };
  return a;
};
goog.iter.takeWhile = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  var e = !0;
  a.next = function() {
    for (;;) {
      if (e) {
        var a = d.next();
        if (b.call(c, a, void 0, d)) {
          return a;
        }
        e = !1;
      } else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return a;
};
goog.iter.toArray = function(a) {
  if (goog.isArrayLike(a)) {
    return goog.array.toArray(a);
  }
  a = goog.iter.toIterator(a);
  var b = [];
  goog.iter.forEach(a, function(a) {
    b.push(a);
  });
  return b;
};
goog.iter.equals = function(a, b) {
  var c = goog.iter.zipLongest({}, a, b);
  return goog.iter.every(c, function(a) {
    return a[0] == a[1];
  });
};
goog.iter.nextOrValue = function(a, b) {
  try {
    return goog.iter.toIterator(a).next();
  } catch (c) {
    if (c != goog.iter.StopIteration) {
      throw c;
    }
    return b;
  }
};
goog.iter.product = function(a) {
  if (goog.array.some(arguments, function(a) {
    return!a.length;
  }) || !arguments.length) {
    return new goog.iter.Iterator;
  }
  var b = new goog.iter.Iterator, c = arguments, d = goog.array.repeat(0, c.length);
  b.next = function() {
    if (d) {
      for (var a = goog.array.map(d, function(a, b) {
        return c[b][a];
      }), b = d.length - 1;0 <= b;b--) {
        goog.asserts.assert(d);
        if (d[b] < c[b].length - 1) {
          d[b]++;
          break;
        }
        if (0 == b) {
          d = null;
          break;
        }
        d[b] = 0;
      }
      return a;
    }
    throw goog.iter.StopIteration;
  };
  return b;
};
goog.iter.cycle = function(a) {
  var b = goog.iter.toIterator(a), c = [], d = 0;
  a = new goog.iter.Iterator;
  var e = !1;
  a.next = function() {
    var a = null;
    if (!e) {
      try {
        return a = b.next(), c.push(a), a;
      } catch (g) {
        if (g != goog.iter.StopIteration || goog.array.isEmpty(c)) {
          throw g;
        }
        e = !0;
      }
    }
    a = c[d];
    d = (d + 1) % c.length;
    return a;
  };
  return a;
};
goog.iter.count = function(a, b) {
  var c = a || 0, d = goog.isDef(b) ? b : 1, e = new goog.iter.Iterator;
  e.next = function() {
    var a = c;
    c += d;
    return a;
  };
  return e;
};
goog.iter.repeat = function(a) {
  var b = new goog.iter.Iterator;
  b.next = goog.functions.constant(a);
  return b;
};
goog.iter.accumulate = function(a) {
  var b = goog.iter.toIterator(a), c = 0;
  a = new goog.iter.Iterator;
  a.next = function() {
    return c += b.next();
  };
  return a;
};
goog.iter.zip = function(a) {
  var b = arguments, c = new goog.iter.Iterator;
  if (0 < b.length) {
    var d = goog.array.map(b, goog.iter.toIterator);
    c.next = function() {
      return goog.array.map(d, function(a) {
        return a.next();
      });
    };
  }
  return c;
};
goog.iter.zipLongest = function(a, b) {
  var c = goog.array.slice(arguments, 1), d = new goog.iter.Iterator;
  if (0 < c.length) {
    var e = goog.array.map(c, goog.iter.toIterator);
    d.next = function() {
      var b = !1, c = goog.array.map(e, function(c) {
        var d;
        try {
          d = c.next(), b = !0;
        } catch (e) {
          if (e !== goog.iter.StopIteration) {
            throw e;
          }
          d = a;
        }
        return d;
      });
      if (!b) {
        throw goog.iter.StopIteration;
      }
      return c;
    };
  }
  return d;
};
goog.iter.compress = function(a, b) {
  var c = goog.iter.toIterator(b);
  return goog.iter.filter(a, function() {
    return!!c.next();
  });
};
goog.iter.GroupByIterator_ = function(a, b) {
  this.iterator = goog.iter.toIterator(a);
  this.keyFunc = b || goog.functions.identity;
};
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);
goog.iter.GroupByIterator_.prototype.next = function() {
  for (;this.currentKey == this.targetKey;) {
    this.currentValue = this.iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
  }
  this.targetKey = this.currentKey;
  return[this.currentKey, this.groupItems_(this.targetKey)];
};
goog.iter.GroupByIterator_.prototype.groupItems_ = function(a) {
  for (var b = [];this.currentKey == a;) {
    b.push(this.currentValue);
    try {
      this.currentValue = this.iterator.next();
    } catch (c) {
      if (c !== goog.iter.StopIteration) {
        throw c;
      }
      break;
    }
    this.currentKey = this.keyFunc(this.currentValue);
  }
  return b;
};
goog.iter.groupBy = function(a, b) {
  return new goog.iter.GroupByIterator_(a, b);
};
goog.iter.starMap = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    var a = goog.iter.toArray(d.next());
    return b.apply(c, goog.array.concat(a, void 0, d));
  };
  return a;
};
goog.iter.tee = function(a, b) {
  var c = goog.iter.toIterator(a), d = goog.isNumber(b) ? b : 2, e = goog.array.map(goog.array.range(d), function() {
    return[];
  }), f = function() {
    var a = c.next();
    goog.array.forEach(e, function(b) {
      b.push(a);
    });
  };
  return goog.array.map(e, function(a) {
    var b = new goog.iter.Iterator;
    b.next = function() {
      goog.array.isEmpty(a) && f();
      goog.asserts.assert(!goog.array.isEmpty(a));
      return a.shift();
    };
    return b;
  });
};
goog.iter.enumerate = function(a, b) {
  return goog.iter.zip(goog.iter.count(b), a);
};
goog.iter.limit = function(a, b) {
  goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
  var c = goog.iter.toIterator(a), d = new goog.iter.Iterator, e = b;
  d.next = function() {
    if (0 < e--) {
      return c.next();
    }
    throw goog.iter.StopIteration;
  };
  return d;
};
goog.iter.consume = function(a, b) {
  goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
  for (var c = goog.iter.toIterator(a);0 < b--;) {
    goog.iter.nextOrValue(c, null);
  }
  return c;
};
goog.iter.slice = function(a, b, c) {
  goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
  a = goog.iter.consume(a, b);
  goog.isNumber(c) && (goog.asserts.assert(goog.math.isInt(c) && c >= b), a = goog.iter.limit(a, c - b));
  return a;
};
goog.iter.hasDuplicates_ = function(a) {
  var b = [];
  goog.array.removeDuplicates(a, b);
  return a.length != b.length;
};
goog.iter.permutations = function(a, b) {
  var c = goog.iter.toArray(a), d = goog.isNumber(b) ? b : c.length, c = goog.array.repeat(c, d), c = goog.iter.product.apply(void 0, c);
  return goog.iter.filter(c, function(a) {
    return!goog.iter.hasDuplicates_(a);
  });
};
goog.iter.combinations = function(a, b) {
  function c(a) {
    return d[a];
  }
  var d = goog.iter.toArray(a), e = goog.iter.range(d.length), e = goog.iter.permutations(e, b), f = goog.iter.filter(e, function(a) {
    return goog.array.isSorted(a);
  }), e = new goog.iter.Iterator;
  e.next = function() {
    return goog.array.map(f.next(), c);
  };
  return e;
};
goog.iter.combinationsWithReplacement = function(a, b) {
  function c(a) {
    return d[a];
  }
  var d = goog.iter.toArray(a), e = goog.array.range(d.length), e = goog.array.repeat(e, b), e = goog.iter.product.apply(void 0, e), f = goog.iter.filter(e, function(a) {
    return goog.array.isSorted(a);
  }), e = new goog.iter.Iterator;
  e.next = function() {
    return goog.array.map(f.next(), c);
  };
  return e;
};
goog.structs.Map = function(a, b) {
  this.map_ = {};
  this.keys_ = [];
  this.version_ = this.count_ = 0;
  var c = arguments.length;
  if (1 < c) {
    if (c % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1]);
    }
  } else {
    a && this.addAll(a);
  }
};
goog.structs.Map.prototype.getCount = function() {
  return this.count_;
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  for (var a = [], b = 0;b < this.keys_.length;b++) {
    a.push(this.map_[this.keys_[b]]);
  }
  return a;
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat();
};
goog.structs.Map.prototype.containsKey = function(a) {
  return goog.structs.Map.hasKey_(this.map_, a);
};
goog.structs.Map.prototype.containsValue = function(a) {
  for (var b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    if (goog.structs.Map.hasKey_(this.map_, c) && this.map_[c] == a) {
      return!0;
    }
  }
  return!1;
};
goog.structs.Map.prototype.equals = function(a, b) {
  if (this === a) {
    return!0;
  }
  if (this.count_ != a.getCount()) {
    return!1;
  }
  var c = b || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for (var d, e = 0;d = this.keys_[e];e++) {
    if (!c(this.get(d), a.get(d))) {
      return!1;
    }
  }
  return!0;
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b;
};
goog.structs.Map.prototype.isEmpty = function() {
  return 0 == this.count_;
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0;
};
goog.structs.Map.prototype.remove = function(a) {
  return goog.structs.Map.hasKey_(this.map_, a) ? (delete this.map_[a], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1;
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if (this.count_ != this.keys_.length) {
    for (var a = 0, b = 0;a < this.keys_.length;) {
      var c = this.keys_[a];
      goog.structs.Map.hasKey_(this.map_, c) && (this.keys_[b++] = c);
      a++;
    }
    this.keys_.length = b;
  }
  if (this.count_ != this.keys_.length) {
    for (var d = {}, b = a = 0;a < this.keys_.length;) {
      c = this.keys_[a], goog.structs.Map.hasKey_(d, c) || (this.keys_[b++] = c, d[c] = 1), a++;
    }
    this.keys_.length = b;
  }
};
goog.structs.Map.prototype.get = function(a, b) {
  return goog.structs.Map.hasKey_(this.map_, a) ? this.map_[a] : b;
};
goog.structs.Map.prototype.set = function(a, b) {
  goog.structs.Map.hasKey_(this.map_, a) || (this.count_++, this.keys_.push(a), this.version_++);
  this.map_[a] = b;
};
goog.structs.Map.prototype.addAll = function(a) {
  var b;
  a instanceof goog.structs.Map ? (b = a.getKeys(), a = a.getValues()) : (b = goog.object.getKeys(a), a = goog.object.getValues(a));
  for (var c = 0;c < b.length;c++) {
    this.set(b[c], a[c]);
  }
};
goog.structs.Map.prototype.forEach = function(a, b) {
  for (var c = this.getKeys(), d = 0;d < c.length;d++) {
    var e = c[d], f = this.get(e);
    a.call(b, f, e, this);
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this);
};
goog.structs.Map.prototype.transpose = function() {
  for (var a = new goog.structs.Map, b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    a.set(this.map_[c], c);
  }
  return a;
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  for (var a = {}, b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    a[c] = this.map_[c];
  }
  return a;
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(!0);
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(!1);
};
goog.structs.Map.prototype.__iterator__ = function(a) {
  this.cleanupKeysArray_();
  var b = 0, c = this.keys_, d = this.map_, e = this.version_, f = this, g = new goog.iter.Iterator;
  g.next = function() {
    for (;;) {
      if (e != f.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if (b >= c.length) {
        throw goog.iter.StopIteration;
      }
      var g = c[b++];
      return a ? g : d[g];
    }
  };
  return g;
};
goog.structs.Map.hasKey_ = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
goog.structs.Set = function(a) {
  this.map_ = new goog.structs.Map;
  a && this.addAll(a);
};
goog.structs.Set.getKey_ = function(a) {
  var b = typeof a;
  return "object" == b && a || "function" == b ? "o" + goog.getUid(a) : b.substr(0, 1) + a;
};
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount();
};
goog.structs.Set.prototype.add = function(a) {
  this.map_.set(goog.structs.Set.getKey_(a), a);
};
goog.structs.Set.prototype.addAll = function(a) {
  a = goog.structs.getValues(a);
  for (var b = a.length, c = 0;c < b;c++) {
    this.add(a[c]);
  }
};
goog.structs.Set.prototype.removeAll = function(a) {
  a = goog.structs.getValues(a);
  for (var b = a.length, c = 0;c < b;c++) {
    this.remove(a[c]);
  }
};
goog.structs.Set.prototype.remove = function(a) {
  return this.map_.remove(goog.structs.Set.getKey_(a));
};
goog.structs.Set.prototype.clear = function() {
  this.map_.clear();
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty();
};
goog.structs.Set.prototype.contains = function(a) {
  return this.map_.containsKey(goog.structs.Set.getKey_(a));
};
goog.structs.Set.prototype.containsAll = function(a) {
  return goog.structs.every(a, this.contains, this);
};
goog.structs.Set.prototype.intersection = function(a) {
  var b = new goog.structs.Set;
  a = goog.structs.getValues(a);
  for (var c = 0;c < a.length;c++) {
    var d = a[c];
    this.contains(d) && b.add(d);
  }
  return b;
};
goog.structs.Set.prototype.difference = function(a) {
  var b = this.clone();
  b.removeAll(a);
  return b;
};
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues();
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this);
};
goog.structs.Set.prototype.equals = function(a) {
  return this.getCount() == goog.structs.getCount(a) && this.isSubsetOf(a);
};
goog.structs.Set.prototype.isSubsetOf = function(a) {
  var b = goog.structs.getCount(a);
  if (this.getCount() > b) {
    return!1;
  }
  !(a instanceof goog.structs.Set) && 5 < b && (a = new goog.structs.Set(a));
  return goog.structs.every(this, function(b) {
    return goog.structs.contains(a, b);
  });
};
goog.structs.Set.prototype.__iterator__ = function(a) {
  return this.map_.__iterator__(!1);
};
goog.debug.LOGGING_ENABLED = goog.DEBUG;
goog.debug.catchErrors = function(a, b, c) {
  c = c || goog.global;
  var d = c.onerror, e = !!b;
  goog.userAgent.WEBKIT && !goog.userAgent.isVersionOrHigher("535.3") && (e = !e);
  c.onerror = function(b, c, h, k, l) {
    d && d(b, c, h, k, l);
    a({message:b, fileName:c, line:h, col:k, error:l});
    return e;
  };
};
goog.debug.expose = function(a, b) {
  if ("undefined" == typeof a) {
    return "undefined";
  }
  if (null == a) {
    return "NULL";
  }
  var c = [], d;
  for (d in a) {
    if (b || !goog.isFunction(a[d])) {
      var e = d + " \x3d ";
      try {
        e += a[d];
      } catch (f) {
        e += "*** " + f + " ***";
      }
      c.push(e);
    }
  }
  return c.join("\n");
};
goog.debug.deepExpose = function(a, b) {
  var c = [], d = function(a, f, g) {
    var h = f + "  ";
    g = new goog.structs.Set(g);
    try {
      if (goog.isDef(a)) {
        if (goog.isNull(a)) {
          c.push("NULL");
        } else {
          if (goog.isString(a)) {
            c.push('"' + a.replace(/\n/g, "\n" + f) + '"');
          } else {
            if (goog.isFunction(a)) {
              c.push(String(a).replace(/\n/g, "\n" + f));
            } else {
              if (goog.isObject(a)) {
                if (g.contains(a)) {
                  c.push("*** reference loop detected ***");
                } else {
                  g.add(a);
                  c.push("{");
                  for (var k in a) {
                    if (b || !goog.isFunction(a[k])) {
                      c.push("\n"), c.push(h), c.push(k + " \x3d "), d(a[k], h, g);
                    }
                  }
                  c.push("\n" + f + "}");
                }
              } else {
                c.push(a);
              }
            }
          }
        }
      } else {
        c.push("undefined");
      }
    } catch (l) {
      c.push("*** " + l + " ***");
    }
  };
  d(a, "", new goog.structs.Set);
  return c.join("");
};
goog.debug.exposeArray = function(a) {
  for (var b = [], c = 0;c < a.length;c++) {
    goog.isArray(a[c]) ? b.push(goog.debug.exposeArray(a[c])) : b.push(a[c]);
  }
  return "[ " + b.join(", ") + " ]";
};
goog.debug.exposeException = function(a, b) {
  try {
    var c = goog.debug.normalizeErrorObject(a);
    return "Message: " + goog.string.htmlEscape(c.message) + '\nUrl: \x3ca href\x3d"view-source:' + c.fileName + '" target\x3d"_new"\x3e' + c.fileName + "\x3c/a\x3e\nLine: " + c.lineNumber + "\n\nBrowser stack:\n" + goog.string.htmlEscape(c.stack + "-\x3e ") + "[end]\n\nJS stack traversal:\n" + goog.string.htmlEscape(goog.debug.getStacktrace(b) + "-\x3e ");
  } catch (d) {
    return "Exception trying to expose exception! You win, we lose. " + d;
  }
};
goog.debug.normalizeErrorObject = function(a) {
  var b = goog.getObjectByName("window.location.href");
  if (goog.isString(a)) {
    return{message:a, name:"Unknown error", lineNumber:"Not available", fileName:b, stack:"Not available"};
  }
  var c, d, e = !1;
  try {
    c = a.lineNumber || a.line || "Not available";
  } catch (f) {
    c = "Not available", e = !0;
  }
  try {
    d = a.fileName || a.filename || a.sourceURL || goog.global.$googDebugFname || b;
  } catch (g) {
    d = "Not available", e = !0;
  }
  return!e && a.lineNumber && a.fileName && a.stack && a.message && a.name ? a : {message:a.message || "Not available", name:a.name || "UnknownError", lineNumber:c, fileName:d, stack:a.stack || "Not available"};
};
goog.debug.enhanceError = function(a, b) {
  var c;
  "string" == typeof a ? (c = Error(a), Error.captureStackTrace && Error.captureStackTrace(c, goog.debug.enhanceError)) : c = a;
  c.stack || (c.stack = goog.debug.getStacktrace(goog.debug.enhanceError));
  if (b) {
    for (var d = 0;c["message" + d];) {
      ++d;
    }
    c["message" + d] = String(b);
  }
  return c;
};
goog.debug.getStacktraceSimple = function(a) {
  if (goog.STRICT_MODE_COMPATIBLE) {
    var b = goog.debug.getNativeStackTrace_(goog.debug.getStacktraceSimple);
    if (b) {
      return b;
    }
  }
  for (var b = [], c = arguments.callee.caller, d = 0;c && (!a || d < a);) {
    b.push(goog.debug.getFunctionName(c));
    b.push("()\n");
    try {
      c = c.caller;
    } catch (e) {
      b.push("[exception trying to get caller]\n");
      break;
    }
    d++;
    if (d >= goog.debug.MAX_STACK_DEPTH) {
      b.push("[...long stack...]");
      break;
    }
  }
  a && d >= a ? b.push("[...reached max depth limit...]") : b.push("[end]");
  return b.join("");
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getNativeStackTrace_ = function(a) {
  var b = Error();
  if (Error.captureStackTrace) {
    return Error.captureStackTrace(b, a), String(b.stack);
  }
  try {
    throw b;
  } catch (c) {
    b = c;
  }
  return(a = b.stack) ? String(a) : null;
};
goog.debug.getStacktrace = function(a) {
  var b;
  goog.STRICT_MODE_COMPATIBLE && (b = goog.debug.getNativeStackTrace_(a || goog.debug.getStacktrace));
  b || (b = goog.debug.getStacktraceHelper_(a || arguments.callee.caller, []));
  return b;
};
goog.debug.getStacktraceHelper_ = function(a, b) {
  var c = [];
  if (goog.array.contains(b, a)) {
    c.push("[...circular reference...]");
  } else {
    if (a && b.length < goog.debug.MAX_STACK_DEPTH) {
      c.push(goog.debug.getFunctionName(a) + "(");
      for (var d = a.arguments, e = 0;d && e < d.length;e++) {
        0 < e && c.push(", ");
        var f;
        f = d[e];
        switch(typeof f) {
          case "object":
            f = f ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            f = String(f);
            break;
          case "boolean":
            f = f ? "true" : "false";
            break;
          case "function":
            f = (f = goog.debug.getFunctionName(f)) ? f : "[fn]";
            break;
          default:
            f = typeof f;
        }
        40 < f.length && (f = f.substr(0, 40) + "...");
        c.push(f);
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(goog.debug.getStacktraceHelper_(a.caller, b));
      } catch (g) {
        c.push("[exception trying to get caller]\n");
      }
    } else {
      a ? c.push("[...long stack...]") : c.push("[end]");
    }
  }
  return c.join("");
};
goog.debug.setFunctionResolver = function(a) {
  goog.debug.fnNameResolver_ = a;
};
goog.debug.getFunctionName = function(a) {
  if (goog.debug.fnNameCache_[a]) {
    return goog.debug.fnNameCache_[a];
  }
  if (goog.debug.fnNameResolver_) {
    var b = goog.debug.fnNameResolver_(a);
    if (b) {
      return goog.debug.fnNameCache_[a] = b;
    }
  }
  a = String(a);
  goog.debug.fnNameCache_[a] || (b = /function ([^\(]+)/.exec(a), goog.debug.fnNameCache_[a] = b ? b[1] : "[Anonymous]");
  return goog.debug.fnNameCache_[a];
};
goog.debug.makeWhitespaceVisible = function(a) {
  return a.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]");
};
goog.debug.fnNameCache_ = {};
goog.debug.LogRecord = function(a, b, c, d, e) {
  this.reset(a, b, c, d, e);
};
goog.debug.LogRecord.prototype.sequenceNumber_ = 0;
goog.debug.LogRecord.prototype.exception_ = null;
goog.debug.LogRecord.prototype.exceptionText_ = null;
goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = !0;
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(a, b, c, d, e) {
  goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS && (this.sequenceNumber_ = "number" == typeof e ? e : goog.debug.LogRecord.nextSequenceNumber_++);
  this.time_ = d || goog.now();
  this.level_ = a;
  this.msg_ = b;
  this.loggerName_ = c;
  delete this.exception_;
  delete this.exceptionText_;
};
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_;
};
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_;
};
goog.debug.LogRecord.prototype.setException = function(a) {
  this.exception_ = a;
};
goog.debug.LogRecord.prototype.getExceptionText = function() {
  return this.exceptionText_;
};
goog.debug.LogRecord.prototype.setExceptionText = function(a) {
  this.exceptionText_ = a;
};
goog.debug.LogRecord.prototype.setLoggerName = function(a) {
  this.loggerName_ = a;
};
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_;
};
goog.debug.LogRecord.prototype.setLevel = function(a) {
  this.level_ = a;
};
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_;
};
goog.debug.LogRecord.prototype.setMessage = function(a) {
  this.msg_ = a;
};
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_;
};
goog.debug.LogRecord.prototype.setMillis = function(a) {
  this.time_ = a;
};
goog.debug.LogRecord.prototype.getSequenceNumber = function() {
  return this.sequenceNumber_;
};
goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
  this.clear();
};
goog.debug.LogBuffer.getInstance = function() {
  goog.debug.LogBuffer.instance_ || (goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer);
  return goog.debug.LogBuffer.instance_;
};
goog.debug.LogBuffer.CAPACITY = 0;
goog.debug.LogBuffer.prototype.addRecord = function(a, b, c) {
  var d = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = d;
  if (this.isFull_) {
    return d = this.buffer_[d], d.reset(a, b, c), d;
  }
  this.isFull_ = d == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[d] = new goog.debug.LogRecord(a, b, c);
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return 0 < goog.debug.LogBuffer.CAPACITY;
};
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = !1;
};
goog.debug.LogBuffer.prototype.forEachRecord = function(a) {
  var b = this.buffer_;
  if (b[0]) {
    var c = this.curIndex_, d = this.isFull_ ? c : -1;
    do {
      d = (d + 1) % goog.debug.LogBuffer.CAPACITY, a(b[d]);
    } while (d != c);
  }
};
goog.debug.Logger = function(a) {
  this.name_ = a;
  this.handlers_ = this.children_ = this.level_ = this.parent_ = null;
};
goog.debug.Logger.ROOT_LOGGER_NAME = "";
goog.debug.Logger.ENABLE_HIERARCHY = !0;
goog.debug.Logger.ENABLE_HIERARCHY || (goog.debug.Logger.rootHandlers_ = []);
goog.debug.Logger.Level = function(a, b) {
  this.name = a;
  this.value = b;
};
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name;
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1E3);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {};
  for (var a = 0, b;b = goog.debug.Logger.Level.PREDEFINED_LEVELS[a];a++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[b.value] = b, goog.debug.Logger.Level.predefinedLevelsCache_[b.name] = b;
  }
};
goog.debug.Logger.Level.getPredefinedLevel = function(a) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  return goog.debug.Logger.Level.predefinedLevelsCache_[a] || null;
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(a) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  if (a in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[a];
  }
  for (var b = 0;b < goog.debug.Logger.Level.PREDEFINED_LEVELS.length;++b) {
    var c = goog.debug.Logger.Level.PREDEFINED_LEVELS[b];
    if (c.value <= a) {
      return c;
    }
  }
  return null;
};
goog.debug.Logger.getLogger = function(a) {
  return goog.debug.LogManager.getLogger(a);
};
goog.debug.Logger.logToProfilers = function(a) {
  goog.global.console && (goog.global.console.timeStamp ? goog.global.console.timeStamp(a) : goog.global.console.markTimeline && goog.global.console.markTimeline(a));
  goog.global.msWriteProfilerMark && goog.global.msWriteProfilerMark(a);
};
goog.debug.Logger.prototype.getName = function() {
  return this.name_;
};
goog.debug.Logger.prototype.addHandler = function(a) {
  goog.debug.LOGGING_ENABLED && (goog.debug.Logger.ENABLE_HIERARCHY ? (this.handlers_ || (this.handlers_ = []), this.handlers_.push(a)) : (goog.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), goog.debug.Logger.rootHandlers_.push(a)));
};
goog.debug.Logger.prototype.removeHandler = function(a) {
  if (goog.debug.LOGGING_ENABLED) {
    var b = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_;
    return!!b && goog.array.remove(b, a);
  }
  return!1;
};
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_;
};
goog.debug.Logger.prototype.getChildren = function() {
  this.children_ || (this.children_ = {});
  return this.children_;
};
goog.debug.Logger.prototype.setLevel = function(a) {
  goog.debug.LOGGING_ENABLED && (goog.debug.Logger.ENABLE_HIERARCHY ? this.level_ = a : (goog.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), goog.debug.Logger.rootLevel_ = a));
};
goog.debug.Logger.prototype.getLevel = function() {
  return goog.debug.LOGGING_ENABLED ? this.level_ : goog.debug.Logger.Level.OFF;
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if (!goog.debug.LOGGING_ENABLED) {
    return goog.debug.Logger.Level.OFF;
  }
  if (!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_;
  }
  if (this.level_) {
    return this.level_;
  }
  if (this.parent_) {
    return this.parent_.getEffectiveLevel();
  }
  goog.asserts.fail("Root logger has no level set.");
  return null;
};
goog.debug.Logger.prototype.isLoggable = function(a) {
  return goog.debug.LOGGING_ENABLED && a.value >= this.getEffectiveLevel().value;
};
goog.debug.Logger.prototype.log = function(a, b, c) {
  goog.debug.LOGGING_ENABLED && this.isLoggable(a) && (goog.isFunction(b) && (b = b()), this.doLogRecord_(this.getLogRecord(a, b, c, goog.debug.Logger.prototype.log)));
};
goog.debug.Logger.prototype.getLogRecord = function(a, b, c, d) {
  a = goog.debug.LogBuffer.isBufferingEnabled() ? goog.debug.LogBuffer.getInstance().addRecord(a, b, this.name_) : new goog.debug.LogRecord(a, String(b), this.name_);
  c && (a.setException(c), a.setExceptionText(goog.debug.exposeException(c, d || goog.debug.Logger.prototype.getLogRecord)));
  return a;
};
goog.debug.Logger.prototype.shout = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.SHOUT, a, b);
};
goog.debug.Logger.prototype.severe = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.SEVERE, a, b);
};
goog.debug.Logger.prototype.warning = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.WARNING, a, b);
};
goog.debug.Logger.prototype.info = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.INFO, a, b);
};
goog.debug.Logger.prototype.config = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.CONFIG, a, b);
};
goog.debug.Logger.prototype.fine = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.FINE, a, b);
};
goog.debug.Logger.prototype.finer = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.FINER, a, b);
};
goog.debug.Logger.prototype.finest = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.FINEST, a, b);
};
goog.debug.Logger.prototype.logRecord = function(a) {
  goog.debug.LOGGING_ENABLED && this.isLoggable(a.getLevel()) && this.doLogRecord_(a);
};
goog.debug.Logger.prototype.doLogRecord_ = function(a) {
  goog.debug.Logger.logToProfilers("log:" + a.getMessage());
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    for (var b = this;b;) {
      b.callPublish_(a), b = b.getParent();
    }
  } else {
    for (var b = 0, c;c = goog.debug.Logger.rootHandlers_[b++];) {
      c(a);
    }
  }
};
goog.debug.Logger.prototype.callPublish_ = function(a) {
  if (this.handlers_) {
    for (var b = 0, c;c = this.handlers_[b];b++) {
      c(a);
    }
  }
};
goog.debug.Logger.prototype.setParent_ = function(a) {
  this.parent_ = a;
};
goog.debug.Logger.prototype.addChild_ = function(a, b) {
  this.getChildren()[a] = b;
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
  goog.debug.LogManager.rootLogger_ || (goog.debug.LogManager.rootLogger_ = new goog.debug.Logger(goog.debug.Logger.ROOT_LOGGER_NAME), goog.debug.LogManager.loggers_[goog.debug.Logger.ROOT_LOGGER_NAME] = goog.debug.LogManager.rootLogger_, goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG));
};
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_;
};
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.rootLogger_;
};
goog.debug.LogManager.getLogger = function(a) {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.loggers_[a] || goog.debug.LogManager.createLogger_(a);
};
goog.debug.LogManager.createFunctionForCatchErrors = function(a) {
  return function(b) {
    (a || goog.debug.LogManager.getRoot()).severe("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.line + ")");
  };
};
goog.debug.LogManager.createLogger_ = function(a) {
  var b = new goog.debug.Logger(a);
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    var c = a.lastIndexOf("."), d = a.substr(0, c), c = a.substr(c + 1), d = goog.debug.LogManager.getLogger(d);
    d.addChild_(c, b);
    b.setParent_(d);
  }
  return goog.debug.LogManager.loggers_[a] = b;
};
goog.log = {};
goog.log.ENABLED = goog.debug.LOGGING_ENABLED;
goog.log.ROOT_LOGGER_NAME = goog.debug.Logger.ROOT_LOGGER_NAME;
goog.log.Logger = goog.debug.Logger;
goog.log.Level = goog.debug.Logger.Level;
goog.log.LogRecord = goog.debug.LogRecord;
goog.log.getLogger = function(a, b) {
  if (goog.log.ENABLED) {
    var c = goog.debug.LogManager.getLogger(a);
    b && c && c.setLevel(b);
    return c;
  }
  return null;
};
goog.log.addHandler = function(a, b) {
  goog.log.ENABLED && a && a.addHandler(b);
};
goog.log.removeHandler = function(a, b) {
  return goog.log.ENABLED && a ? a.removeHandler(b) : !1;
};
goog.log.log = function(a, b, c, d) {
  goog.log.ENABLED && a && a.log(b, c, d);
};
goog.log.error = function(a, b, c) {
  goog.log.ENABLED && a && a.severe(b, c);
};
goog.log.warning = function(a, b, c) {
  goog.log.ENABLED && a && a.warning(b, c);
};
goog.log.info = function(a, b, c) {
  goog.log.ENABLED && a && a.info(b, c);
};
goog.log.fine = function(a, b, c) {
  goog.log.ENABLED && a && a.fine(b, c);
};
goog.net = {};
goog.net.ErrorCode = {NO_ERROR:0, ACCESS_DENIED:1, FILE_NOT_FOUND:2, FF_SILENT_ERROR:3, CUSTOM_ERROR:4, EXCEPTION:5, HTTP_ERROR:6, ABORT:7, TIMEOUT:8, OFFLINE:9};
goog.net.ErrorCode.getDebugMessage = function(a) {
  switch(a) {
    case goog.net.ErrorCode.NO_ERROR:
      return "No Error";
    case goog.net.ErrorCode.ACCESS_DENIED:
      return "Access denied to content document";
    case goog.net.ErrorCode.FILE_NOT_FOUND:
      return "File not found";
    case goog.net.ErrorCode.FF_SILENT_ERROR:
      return "Firefox silently errored";
    case goog.net.ErrorCode.CUSTOM_ERROR:
      return "Application custom error";
    case goog.net.ErrorCode.EXCEPTION:
      return "An exception occurred";
    case goog.net.ErrorCode.HTTP_ERROR:
      return "Http response at 400 or 500 level";
    case goog.net.ErrorCode.ABORT:
      return "Request was aborted";
    case goog.net.ErrorCode.TIMEOUT:
      return "Request timed out";
    case goog.net.ErrorCode.OFFLINE:
      return "The resource is not available offline";
    default:
      return "Unrecognized error code";
  }
};
goog.net.EventType = {COMPLETE:"complete", SUCCESS:"success", ERROR:"error", ABORT:"abort", READY:"ready", READY_STATE_CHANGE:"readystatechange", TIMEOUT:"timeout", INCREMENTAL_DATA:"incrementaldata", PROGRESS:"progress"};
goog.net.HttpStatus = {CONTINUE:100, SWITCHING_PROTOCOLS:101, OK:200, CREATED:201, ACCEPTED:202, NON_AUTHORITATIVE_INFORMATION:203, NO_CONTENT:204, RESET_CONTENT:205, PARTIAL_CONTENT:206, MULTIPLE_CHOICES:300, MOVED_PERMANENTLY:301, FOUND:302, SEE_OTHER:303, NOT_MODIFIED:304, USE_PROXY:305, TEMPORARY_REDIRECT:307, BAD_REQUEST:400, UNAUTHORIZED:401, PAYMENT_REQUIRED:402, FORBIDDEN:403, NOT_FOUND:404, METHOD_NOT_ALLOWED:405, NOT_ACCEPTABLE:406, PROXY_AUTHENTICATION_REQUIRED:407, REQUEST_TIMEOUT:408, 
CONFLICT:409, GONE:410, LENGTH_REQUIRED:411, PRECONDITION_FAILED:412, REQUEST_ENTITY_TOO_LARGE:413, REQUEST_URI_TOO_LONG:414, UNSUPPORTED_MEDIA_TYPE:415, REQUEST_RANGE_NOT_SATISFIABLE:416, EXPECTATION_FAILED:417, INTERNAL_SERVER_ERROR:500, NOT_IMPLEMENTED:501, BAD_GATEWAY:502, SERVICE_UNAVAILABLE:503, GATEWAY_TIMEOUT:504, HTTP_VERSION_NOT_SUPPORTED:505, QUIRK_IE_NO_CONTENT:1223};
goog.net.HttpStatus.isSuccess = function(a) {
  switch(a) {
    case goog.net.HttpStatus.OK:
    ;
    case goog.net.HttpStatus.CREATED:
    ;
    case goog.net.HttpStatus.ACCEPTED:
    ;
    case goog.net.HttpStatus.NO_CONTENT:
    ;
    case goog.net.HttpStatus.PARTIAL_CONTENT:
    ;
    case goog.net.HttpStatus.NOT_MODIFIED:
    ;
    case goog.net.HttpStatus.QUIRK_IE_NO_CONTENT:
      return!0;
    default:
      return!1;
  }
};
goog.net.XhrLike = function() {
};
goog.net.XhrLike.prototype.open = function(a, b, c, d, e) {
};
goog.net.XhrLike.prototype.send = function(a) {
};
goog.net.XhrLike.prototype.abort = function() {
};
goog.net.XhrLike.prototype.setRequestHeader = function(a, b) {
};
goog.net.XhrLike.prototype.getResponseHeader = function(a) {
};
goog.net.XhrLike.prototype.getAllResponseHeaders = function() {
};
goog.net.XmlHttpFactory = function() {
};
goog.net.XmlHttpFactory.prototype.cachedOptions_ = null;
goog.net.XmlHttpFactory.prototype.getOptions = function() {
  return this.cachedOptions_ || (this.cachedOptions_ = this.internalGetOptions());
};
goog.net.WrapperXmlHttpFactory = function(a, b) {
  goog.net.XmlHttpFactory.call(this);
  this.xhrFactory_ = a;
  this.optionsFactory_ = b;
};
goog.inherits(goog.net.WrapperXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.WrapperXmlHttpFactory.prototype.createInstance = function() {
  return this.xhrFactory_();
};
goog.net.WrapperXmlHttpFactory.prototype.getOptions = function() {
  return this.optionsFactory_();
};
goog.net.XmlHttp = function() {
  return goog.net.XmlHttp.factory_.createInstance();
};
goog.net.XmlHttp.ASSUME_NATIVE_XHR = !1;
goog.net.XmlHttpDefines = {};
goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR = !1;
goog.net.XmlHttp.getOptions = function() {
  return goog.net.XmlHttp.factory_.getOptions();
};
goog.net.XmlHttp.OptionType = {USE_NULL_FUNCTION:0, LOCAL_REQUEST_ERROR:1};
goog.net.XmlHttp.ReadyState = {UNINITIALIZED:0, LOADING:1, LOADED:2, INTERACTIVE:3, COMPLETE:4};
goog.net.XmlHttp.setFactory = function(a, b) {
  goog.net.XmlHttp.setGlobalFactory(new goog.net.WrapperXmlHttpFactory(goog.asserts.assert(a), goog.asserts.assert(b)));
};
goog.net.XmlHttp.setGlobalFactory = function(a) {
  goog.net.XmlHttp.factory_ = a;
};
goog.net.DefaultXmlHttpFactory = function() {
  goog.net.XmlHttpFactory.call(this);
};
goog.inherits(goog.net.DefaultXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.DefaultXmlHttpFactory.prototype.createInstance = function() {
  var a = this.getProgId_();
  return a ? new ActiveXObject(a) : new XMLHttpRequest;
};
goog.net.DefaultXmlHttpFactory.prototype.internalGetOptions = function() {
  var a = {};
  this.getProgId_() && (a[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] = !0, a[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] = !0);
  return a;
};
goog.net.DefaultXmlHttpFactory.prototype.getProgId_ = function() {
  if (goog.net.XmlHttp.ASSUME_NATIVE_XHR || goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR) {
    return "";
  }
  if (!this.ieProgId_ && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for (var a = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], b = 0;b < a.length;b++) {
      var c = a[b];
      try {
        return new ActiveXObject(c), this.ieProgId_ = c;
      } catch (d) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
  }
  return this.ieProgId_;
};
goog.net.XmlHttp.setGlobalFactory(new goog.net.DefaultXmlHttpFactory);
goog.uri = {};
goog.uri.utils = {};
goog.uri.utils.CharCode_ = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
goog.uri.utils.buildFromEncodedParts = function(a, b, c, d, e, f, g) {
  var h = "";
  a && (h += a + ":");
  c && (h += "//", b && (h += b + "@"), h += c, d && (h += ":" + d));
  e && (h += e);
  f && (h += "?" + f);
  g && (h += "#" + g);
  return h;
};
goog.uri.utils.splitRe_ = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;
goog.uri.utils.ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
goog.uri.utils.split = function(a) {
  goog.uri.utils.phishingProtection_();
  return a.match(goog.uri.utils.splitRe_);
};
goog.uri.utils.needsPhishingProtection_ = goog.userAgent.WEBKIT;
goog.uri.utils.phishingProtection_ = function() {
  if (goog.uri.utils.needsPhishingProtection_) {
    goog.uri.utils.needsPhishingProtection_ = !1;
    var a = goog.global.location;
    if (a) {
      var b = a.href;
      if (b && (b = goog.uri.utils.getDomain(b)) && b != a.hostname) {
        throw goog.uri.utils.needsPhishingProtection_ = !0, Error();
      }
    }
  }
};
goog.uri.utils.decodeIfPossible_ = function(a) {
  return a && decodeURIComponent(a);
};
goog.uri.utils.getComponentByIndex_ = function(a, b) {
  return goog.uri.utils.split(b)[a] || null;
};
goog.uri.utils.getScheme = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, a);
};
goog.uri.utils.getEffectiveScheme = function(a) {
  a = goog.uri.utils.getScheme(a);
  !a && self.location && (a = self.location.protocol, a = a.substr(0, a.length - 1));
  return a ? a.toLowerCase() : "";
};
goog.uri.utils.getUserInfoEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, a);
};
goog.uri.utils.getUserInfo = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(a));
};
goog.uri.utils.getDomainEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, a);
};
goog.uri.utils.getDomain = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(a));
};
goog.uri.utils.getPort = function(a) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, a)) || null;
};
goog.uri.utils.getPathEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, a);
};
goog.uri.utils.getPath = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(a));
};
goog.uri.utils.getQueryData = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, a);
};
goog.uri.utils.getFragmentEncoded = function(a) {
  var b = a.indexOf("#");
  return 0 > b ? null : a.substr(b + 1);
};
goog.uri.utils.setFragmentEncoded = function(a, b) {
  return goog.uri.utils.removeFragment(a) + (b ? "#" + b : "");
};
goog.uri.utils.getFragment = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(a));
};
goog.uri.utils.getHost = function(a) {
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(a[goog.uri.utils.ComponentIndex.SCHEME], a[goog.uri.utils.ComponentIndex.USER_INFO], a[goog.uri.utils.ComponentIndex.DOMAIN], a[goog.uri.utils.ComponentIndex.PORT]);
};
goog.uri.utils.getPathAndAfter = function(a) {
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, a[goog.uri.utils.ComponentIndex.PATH], a[goog.uri.utils.ComponentIndex.QUERY_DATA], a[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.removeFragment = function(a) {
  var b = a.indexOf("#");
  return 0 > b ? a : a.substr(0, b);
};
goog.uri.utils.haveSameDomain = function(a, b) {
  var c = goog.uri.utils.split(a), d = goog.uri.utils.split(b);
  return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.SCHEME] == d[goog.uri.utils.ComponentIndex.SCHEME] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT];
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(a) {
  if (goog.DEBUG && (0 <= a.indexOf("#") || 0 <= a.indexOf("?"))) {
    throw Error("goog.uri.utils: Fragment or query identifiers are not supported: [" + a + "]");
  }
};
goog.uri.utils.appendQueryData_ = function(a) {
  if (a[1]) {
    var b = a[0], c = b.indexOf("#");
    0 <= c && (a.push(b.substr(c)), a[0] = b = b.substr(0, c));
    c = b.indexOf("?");
    0 > c ? a[1] = "?" : c == b.length - 1 && (a[1] = void 0);
  }
  return a.join("");
};
goog.uri.utils.appendKeyValuePairs_ = function(a, b, c) {
  if (goog.isArray(b)) {
    goog.asserts.assertArray(b);
    for (var d = 0;d < b.length;d++) {
      goog.uri.utils.appendKeyValuePairs_(a, String(b[d]), c);
    }
  } else {
    null != b && c.push("\x26", a, "" === b ? "" : "\x3d", goog.string.urlEncode(b));
  }
};
goog.uri.utils.buildQueryDataBuffer_ = function(a, b, c) {
  goog.asserts.assert(0 == Math.max(b.length - (c || 0), 0) % 2, "goog.uri.utils: Key/value lists must be even in length.");
  for (c = c || 0;c < b.length;c += 2) {
    goog.uri.utils.appendKeyValuePairs_(b[c], b[c + 1], a);
  }
  return a;
};
goog.uri.utils.buildQueryData = function(a, b) {
  var c = goog.uri.utils.buildQueryDataBuffer_([], a, b);
  c[0] = "";
  return c.join("");
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(a, b) {
  for (var c in b) {
    goog.uri.utils.appendKeyValuePairs_(c, b[c], a);
  }
  return a;
};
goog.uri.utils.buildQueryDataFromMap = function(a) {
  a = goog.uri.utils.buildQueryDataBufferFromMap_([], a);
  a[0] = "";
  return a.join("");
};
goog.uri.utils.appendParams = function(a, b) {
  return goog.uri.utils.appendQueryData_(2 == arguments.length ? goog.uri.utils.buildQueryDataBuffer_([a], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([a], arguments, 1));
};
goog.uri.utils.appendParamsFromMap = function(a, b) {
  return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([a], b));
};
goog.uri.utils.appendParam = function(a, b, c) {
  a = [a, "\x26", b];
  goog.isDefAndNotNull(c) && a.push("\x3d", goog.string.urlEncode(c));
  return goog.uri.utils.appendQueryData_(a);
};
goog.uri.utils.findParam_ = function(a, b, c, d) {
  for (var e = c.length;0 <= (b = a.indexOf(c, b)) && b < d;) {
    var f = a.charCodeAt(b - 1);
    if (f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.QUESTION) {
      if (f = a.charCodeAt(b + e), !f || f == goog.uri.utils.CharCode_.EQUAL || f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.HASH) {
        return b;
      }
    }
    b += e + 1;
  }
  return-1;
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(a, b) {
  return 0 <= goog.uri.utils.findParam_(a, 0, b, a.search(goog.uri.utils.hashOrEndRe_));
};
goog.uri.utils.getParamValue = function(a, b) {
  var c = a.search(goog.uri.utils.hashOrEndRe_), d = goog.uri.utils.findParam_(a, 0, b, c);
  if (0 > d) {
    return null;
  }
  var e = a.indexOf("\x26", d);
  if (0 > e || e > c) {
    e = c;
  }
  d += b.length + 1;
  return goog.string.urlDecode(a.substr(d, e - d));
};
goog.uri.utils.getParamValues = function(a, b) {
  for (var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = [];0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) {
    d = a.indexOf("\x26", e);
    if (0 > d || d > c) {
      d = c;
    }
    e += b.length + 1;
    f.push(goog.string.urlDecode(a.substr(e, d - e)));
  }
  return f;
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(a, b) {
  for (var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = [];0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) {
    f.push(a.substring(d, e)), d = Math.min(a.indexOf("\x26", e) + 1 || c, c);
  }
  f.push(a.substr(d));
  return f.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1");
};
goog.uri.utils.setParam = function(a, b, c) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(a, b), b, c);
};
goog.uri.utils.appendPath = function(a, b) {
  goog.uri.utils.assertNoFragmentsOrQueries_(a);
  goog.string.endsWith(a, "/") && (a = a.substr(0, a.length - 1));
  goog.string.startsWith(b, "/") && (b = b.substr(1));
  return goog.string.buildString(a, "/", b);
};
goog.uri.utils.setPath = function(a, b) {
  goog.string.startsWith(b, "/") || (b = "/" + b);
  var c = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(c[goog.uri.utils.ComponentIndex.SCHEME], c[goog.uri.utils.ComponentIndex.USER_INFO], c[goog.uri.utils.ComponentIndex.DOMAIN], c[goog.uri.utils.ComponentIndex.PORT], b, c[goog.uri.utils.ComponentIndex.QUERY_DATA], c[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.StandardQueryParam = {RANDOM:"zx"};
goog.uri.utils.makeUnique = function(a) {
  return goog.uri.utils.setParam(a, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString());
};
goog.net.XhrIo = function(a) {
  goog.events.EventTarget.call(this);
  this.headers = new goog.structs.Map;
  this.xmlHttpFactory_ = a || null;
  this.active_ = !1;
  this.xhrOptions_ = this.xhr_ = null;
  this.lastMethod_ = this.lastUri_ = "";
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.lastError_ = "";
  this.inAbort_ = this.inOpen_ = this.inSend_ = this.errorDispatched_ = !1;
  this.timeoutInterval_ = 0;
  this.timeoutId_ = null;
  this.responseType_ = goog.net.XhrIo.ResponseType.DEFAULT;
  this.useXhr2Timeout_ = this.withCredentials_ = !1;
};
goog.inherits(goog.net.XhrIo, goog.events.EventTarget);
goog.net.XhrIo.ResponseType = {DEFAULT:"", TEXT:"text", DOCUMENT:"document", BLOB:"blob", ARRAY_BUFFER:"arraybuffer"};
goog.net.XhrIo.prototype.logger_ = goog.log.getLogger("goog.net.XhrIo");
goog.net.XhrIo.CONTENT_TYPE_HEADER = "Content-Type";
goog.net.XhrIo.HTTP_SCHEME_PATTERN = /^https?$/i;
goog.net.XhrIo.METHODS_WITH_FORM_DATA = ["POST", "PUT"];
goog.net.XhrIo.FORM_CONTENT_TYPE = "application/x-www-form-urlencoded;charset\x3dutf-8";
goog.net.XhrIo.XHR2_TIMEOUT_ = "timeout";
goog.net.XhrIo.XHR2_ON_TIMEOUT_ = "ontimeout";
goog.net.XhrIo.sendInstances_ = [];
goog.net.XhrIo.send = function(a, b, c, d, e, f, g) {
  var h = new goog.net.XhrIo;
  goog.net.XhrIo.sendInstances_.push(h);
  b && h.listen(goog.net.EventType.COMPLETE, b);
  h.listenOnce(goog.net.EventType.READY, h.cleanupSend_);
  f && h.setTimeoutInterval(f);
  g && h.setWithCredentials(g);
  h.send(a, c, d, e);
  return h;
};
goog.net.XhrIo.cleanup = function() {
  for (var a = goog.net.XhrIo.sendInstances_;a.length;) {
    a.pop().dispose();
  }
};
goog.net.XhrIo.protectEntryPoints = function(a) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = a.protectEntryPoint(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
};
goog.net.XhrIo.prototype.cleanupSend_ = function() {
  this.dispose();
  goog.array.remove(goog.net.XhrIo.sendInstances_, this);
};
goog.net.XhrIo.prototype.getTimeoutInterval = function() {
  return this.timeoutInterval_;
};
goog.net.XhrIo.prototype.setTimeoutInterval = function(a) {
  this.timeoutInterval_ = Math.max(0, a);
};
goog.net.XhrIo.prototype.setResponseType = function(a) {
  this.responseType_ = a;
};
goog.net.XhrIo.prototype.getResponseType = function() {
  return this.responseType_;
};
goog.net.XhrIo.prototype.setWithCredentials = function(a) {
  this.withCredentials_ = a;
};
goog.net.XhrIo.prototype.getWithCredentials = function() {
  return this.withCredentials_;
};
goog.net.XhrIo.prototype.send = function(a, b, c, d) {
  if (this.xhr_) {
    throw Error("[goog.net.XhrIo] Object is active with another request\x3d" + this.lastUri_ + "; newUri\x3d" + a);
  }
  b = b ? b.toUpperCase() : "GET";
  this.lastUri_ = a;
  this.lastError_ = "";
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.lastMethod_ = b;
  this.errorDispatched_ = !1;
  this.active_ = !0;
  this.xhr_ = this.createXhr();
  this.xhrOptions_ = this.xmlHttpFactory_ ? this.xmlHttpFactory_.getOptions() : goog.net.XmlHttp.getOptions();
  this.xhr_.onreadystatechange = goog.bind(this.onReadyStateChange_, this);
  try {
    goog.log.fine(this.logger_, this.formatMsg_("Opening Xhr")), this.inOpen_ = !0, this.xhr_.open(b, String(a), !0), this.inOpen_ = !1;
  } catch (e) {
    goog.log.fine(this.logger_, this.formatMsg_("Error opening Xhr: " + e.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, e);
    return;
  }
  a = c || "";
  var f = this.headers.clone();
  d && goog.structs.forEach(d, function(a, b) {
    f.set(b, a);
  });
  d = goog.array.find(f.getKeys(), goog.net.XhrIo.isContentTypeHeader_);
  c = goog.global.FormData && a instanceof goog.global.FormData;
  !goog.array.contains(goog.net.XhrIo.METHODS_WITH_FORM_DATA, b) || d || c || f.set(goog.net.XhrIo.CONTENT_TYPE_HEADER, goog.net.XhrIo.FORM_CONTENT_TYPE);
  f.forEach(function(a, b) {
    this.xhr_.setRequestHeader(b, a);
  }, this);
  this.responseType_ && (this.xhr_.responseType = this.responseType_);
  goog.object.containsKey(this.xhr_, "withCredentials") && (this.xhr_.withCredentials = this.withCredentials_);
  try {
    this.cleanUpTimeoutTimer_(), 0 < this.timeoutInterval_ && (this.useXhr2Timeout_ = goog.net.XhrIo.shouldUseXhr2Timeout_(this.xhr_), goog.log.fine(this.logger_, this.formatMsg_("Will abort after " + this.timeoutInterval_ + "ms if incomplete, xhr2 " + this.useXhr2Timeout_)), this.useXhr2Timeout_ ? (this.xhr_[goog.net.XhrIo.XHR2_TIMEOUT_] = this.timeoutInterval_, this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] = goog.bind(this.timeout_, this)) : this.timeoutId_ = goog.Timer.callOnce(this.timeout_, this.timeoutInterval_, 
    this)), goog.log.fine(this.logger_, this.formatMsg_("Sending request")), this.inSend_ = !0, this.xhr_.send(a), this.inSend_ = !1;
  } catch (g) {
    goog.log.fine(this.logger_, this.formatMsg_("Send error: " + g.message)), this.error_(goog.net.ErrorCode.EXCEPTION, g);
  }
};
goog.net.XhrIo.shouldUseXhr2Timeout_ = function(a) {
  return goog.userAgent.IE && goog.userAgent.isVersionOrHigher(9) && goog.isNumber(a[goog.net.XhrIo.XHR2_TIMEOUT_]) && goog.isDef(a[goog.net.XhrIo.XHR2_ON_TIMEOUT_]);
};
goog.net.XhrIo.isContentTypeHeader_ = function(a) {
  return goog.string.caseInsensitiveEquals(goog.net.XhrIo.CONTENT_TYPE_HEADER, a);
};
goog.net.XhrIo.prototype.createXhr = function() {
  return this.xmlHttpFactory_ ? this.xmlHttpFactory_.createInstance() : goog.net.XmlHttp();
};
goog.net.XhrIo.prototype.timeout_ = function() {
  "undefined" != typeof goog && this.xhr_ && (this.lastError_ = "Timed out after " + this.timeoutInterval_ + "ms, aborting", this.lastErrorCode_ = goog.net.ErrorCode.TIMEOUT, goog.log.fine(this.logger_, this.formatMsg_(this.lastError_)), this.dispatchEvent(goog.net.EventType.TIMEOUT), this.abort(goog.net.ErrorCode.TIMEOUT));
};
goog.net.XhrIo.prototype.error_ = function(a, b) {
  this.active_ = !1;
  this.xhr_ && (this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1);
  this.lastError_ = b;
  this.lastErrorCode_ = a;
  this.dispatchErrors_();
  this.cleanUpXhr_();
};
goog.net.XhrIo.prototype.dispatchErrors_ = function() {
  this.errorDispatched_ || (this.errorDispatched_ = !0, this.dispatchEvent(goog.net.EventType.COMPLETE), this.dispatchEvent(goog.net.EventType.ERROR));
};
goog.net.XhrIo.prototype.abort = function(a) {
  this.xhr_ && this.active_ && (goog.log.fine(this.logger_, this.formatMsg_("Aborting")), this.active_ = !1, this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1, this.lastErrorCode_ = a || goog.net.ErrorCode.ABORT, this.dispatchEvent(goog.net.EventType.COMPLETE), this.dispatchEvent(goog.net.EventType.ABORT), this.cleanUpXhr_());
};
goog.net.XhrIo.prototype.disposeInternal = function() {
  this.xhr_ && (this.active_ && (this.active_ = !1, this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1), this.cleanUpXhr_(!0));
  goog.net.XhrIo.superClass_.disposeInternal.call(this);
};
goog.net.XhrIo.prototype.onReadyStateChange_ = function() {
  if (!this.isDisposed()) {
    if (this.inOpen_ || this.inSend_ || this.inAbort_) {
      this.onReadyStateChangeHelper_();
    } else {
      this.onReadyStateChangeEntryPoint_();
    }
  }
};
goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = function() {
  this.onReadyStateChangeHelper_();
};
goog.net.XhrIo.prototype.onReadyStateChangeHelper_ = function() {
  if (this.active_ && "undefined" != typeof goog) {
    if (this.xhrOptions_[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE && 2 == this.getStatus()) {
      goog.log.fine(this.logger_, this.formatMsg_("Local request error detected and ignored"));
    } else {
      if (this.inSend_ && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE) {
        goog.Timer.callOnce(this.onReadyStateChange_, 0, this);
      } else {
        if (this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE), this.isComplete()) {
          goog.log.fine(this.logger_, this.formatMsg_("Request complete"));
          this.active_ = !1;
          try {
            this.isSuccess() ? (this.dispatchEvent(goog.net.EventType.COMPLETE), this.dispatchEvent(goog.net.EventType.SUCCESS)) : (this.lastErrorCode_ = goog.net.ErrorCode.HTTP_ERROR, this.lastError_ = this.getStatusText() + " [" + this.getStatus() + "]", this.dispatchErrors_());
          } finally {
            this.cleanUpXhr_();
          }
        }
      }
    }
  }
};
goog.net.XhrIo.prototype.cleanUpXhr_ = function(a) {
  if (this.xhr_) {
    this.cleanUpTimeoutTimer_();
    var b = this.xhr_, c = this.xhrOptions_[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] ? goog.nullFunction : null;
    this.xhrOptions_ = this.xhr_ = null;
    a || this.dispatchEvent(goog.net.EventType.READY);
    try {
      b.onreadystatechange = c;
    } catch (d) {
      goog.log.error(this.logger_, "Problem encountered resetting onreadystatechange: " + d.message);
    }
  }
};
goog.net.XhrIo.prototype.cleanUpTimeoutTimer_ = function() {
  this.xhr_ && this.useXhr2Timeout_ && (this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] = null);
  goog.isNumber(this.timeoutId_) && (goog.Timer.clear(this.timeoutId_), this.timeoutId_ = null);
};
goog.net.XhrIo.prototype.isActive = function() {
  return!!this.xhr_;
};
goog.net.XhrIo.prototype.isComplete = function() {
  return this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE;
};
goog.net.XhrIo.prototype.isSuccess = function() {
  var a = this.getStatus();
  return goog.net.HttpStatus.isSuccess(a) || 0 === a && !this.isLastUriEffectiveSchemeHttp_();
};
goog.net.XhrIo.prototype.isLastUriEffectiveSchemeHttp_ = function() {
  var a = goog.uri.utils.getEffectiveScheme(String(this.lastUri_));
  return goog.net.XhrIo.HTTP_SCHEME_PATTERN.test(a);
};
goog.net.XhrIo.prototype.getReadyState = function() {
  return this.xhr_ ? this.xhr_.readyState : goog.net.XmlHttp.ReadyState.UNINITIALIZED;
};
goog.net.XhrIo.prototype.getStatus = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.status : -1;
  } catch (a) {
    return-1;
  }
};
goog.net.XhrIo.prototype.getStatusText = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.statusText : "";
  } catch (a) {
    return goog.log.fine(this.logger_, "Can not get status: " + a.message), "";
  }
};
goog.net.XhrIo.prototype.getLastUri = function() {
  return String(this.lastUri_);
};
goog.net.XhrIo.prototype.getResponseText = function() {
  try {
    return this.xhr_ ? this.xhr_.responseText : "";
  } catch (a) {
    return goog.log.fine(this.logger_, "Can not get responseText: " + a.message), "";
  }
};
goog.net.XhrIo.prototype.getResponseBody = function() {
  try {
    if (this.xhr_ && "responseBody" in this.xhr_) {
      return this.xhr_.responseBody;
    }
  } catch (a) {
    goog.log.fine(this.logger_, "Can not get responseBody: " + a.message);
  }
  return null;
};
goog.net.XhrIo.prototype.getResponseXml = function() {
  try {
    return this.xhr_ ? this.xhr_.responseXML : null;
  } catch (a) {
    return goog.log.fine(this.logger_, "Can not get responseXML: " + a.message), null;
  }
};
goog.net.XhrIo.prototype.getResponseJson = function(a) {
  if (this.xhr_) {
    var b = this.xhr_.responseText;
    a && 0 == b.indexOf(a) && (b = b.substring(a.length));
    return goog.json.parse(b);
  }
};
goog.net.XhrIo.prototype.getResponse = function() {
  try {
    if (!this.xhr_) {
      return null;
    }
    if ("response" in this.xhr_) {
      return this.xhr_.response;
    }
    switch(this.responseType_) {
      case goog.net.XhrIo.ResponseType.DEFAULT:
      ;
      case goog.net.XhrIo.ResponseType.TEXT:
        return this.xhr_.responseText;
      case goog.net.XhrIo.ResponseType.ARRAY_BUFFER:
        if ("mozResponseArrayBuffer" in this.xhr_) {
          return this.xhr_.mozResponseArrayBuffer;
        }
      ;
    }
    goog.log.error(this.logger_, "Response type " + this.responseType_ + " is not supported on this browser");
    return null;
  } catch (a) {
    return goog.log.fine(this.logger_, "Can not get response: " + a.message), null;
  }
};
goog.net.XhrIo.prototype.getResponseHeader = function(a) {
  return this.xhr_ && this.isComplete() ? this.xhr_.getResponseHeader(a) : void 0;
};
goog.net.XhrIo.prototype.getAllResponseHeaders = function() {
  return this.xhr_ && this.isComplete() ? this.xhr_.getAllResponseHeaders() : "";
};
goog.net.XhrIo.prototype.getResponseHeaders = function() {
  for (var a = {}, b = this.getAllResponseHeaders().split("\r\n"), c = 0;c < b.length;c++) {
    if (!goog.string.isEmpty(b[c])) {
      var d = goog.string.splitLimit(b[c], ": ", 2);
      a[d[0]] = a[d[0]] ? a[d[0]] + (", " + d[1]) : d[1];
    }
  }
  return a;
};
goog.net.XhrIo.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_;
};
goog.net.XhrIo.prototype.getLastError = function() {
  return goog.isString(this.lastError_) ? this.lastError_ : String(this.lastError_);
};
goog.net.XhrIo.prototype.formatMsg_ = function(a) {
  return a + " [" + this.lastMethod_ + " " + this.lastUri_ + " " + this.getStatus() + "]";
};
goog.debug.entryPointRegistry.register(function(a) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = a(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
});
goog.string.StringBuffer = function(a, b) {
  null != a && this.append.apply(this, arguments);
};
goog.string.StringBuffer.prototype.buffer_ = "";
goog.string.StringBuffer.prototype.set = function(a) {
  this.buffer_ = "" + a;
};
goog.string.StringBuffer.prototype.append = function(a, b, c) {
  this.buffer_ += a;
  if (null != b) {
    for (var d = 1;d < arguments.length;d++) {
      this.buffer_ += arguments[d];
    }
  }
  return this;
};
goog.string.StringBuffer.prototype.clear = function() {
  this.buffer_ = "";
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.buffer_.length;
};
goog.string.StringBuffer.prototype.toString = function() {
  return this.buffer_;
};
var cljs = {core:{}};
cljs.core._STAR_clojurescript_version_STAR_ = "0.0-2371";
cljs.core._STAR_unchecked_if_STAR_ = !1;
cljs.core._STAR_print_fn_STAR_ = function(a) {
  throw Error("No *print-fn* fn set for evaluation environment");
};
cljs.core.set_print_fn_BANG_ = function(a) {
  return cljs.core._STAR_print_fn_STAR_ = a;
};
cljs.core._STAR_flush_on_newline_STAR_ = !0;
cljs.core._STAR_print_newline_STAR_ = !0;
cljs.core._STAR_print_readably_STAR_ = !0;
cljs.core._STAR_print_meta_STAR_ = !1;
cljs.core._STAR_print_dup_STAR_ = !1;
cljs.core._STAR_print_length_STAR_ = null;
cljs.core._STAR_print_level_STAR_ = null;
cljs.core.pr_opts = function() {
  return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null, "flush-on-newline", "flush-on-newline", -151457939), cljs.core._STAR_flush_on_newline_STAR_, new cljs.core.Keyword(null, "readably", "readably", 1129599760), cljs.core._STAR_print_readably_STAR_, new cljs.core.Keyword(null, "meta", "meta", 1499536964), cljs.core._STAR_print_meta_STAR_, new cljs.core.Keyword(null, "dup", "dup", 556298533), cljs.core._STAR_print_dup_STAR_, new cljs.core.Keyword(null, "print-length", "print-length", 
  1931866356), cljs.core._STAR_print_length_STAR_], null);
};
cljs.core.enable_console_print_BANG_ = function() {
  cljs.core._STAR_print_newline_STAR_ = !1;
  return cljs.core._STAR_print_fn_STAR_ = function() {
    var a = function(a) {
      return console.log.apply(console, cljs.core.into_array.call(null, a));
    }, b = function(b) {
      var d = null;
      0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return a.call(this, d);
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      b = cljs.core.seq(b);
      return a(b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }();
};
cljs.core.truth_ = function(a) {
  return null != a && !1 !== a;
};
cljs.core.not_native = null;
cljs.core.identical_QMARK_ = function(a, b) {
  return a === b;
};
cljs.core.nil_QMARK_ = function(a) {
  return null == a;
};
cljs.core.array_QMARK_ = function(a) {
  return a instanceof Array;
};
cljs.core.number_QMARK_ = function(a) {
  return "number" === typeof a;
};
cljs.core.not = function(a) {
  return cljs.core.truth_(a) ? !1 : !0;
};
cljs.core.some_QMARK_ = function(a) {
  return null != a;
};
cljs.core.object_QMARK_ = function(a) {
  return null != a ? a.constructor === Object : !1;
};
cljs.core.string_QMARK_ = function(a) {
  return goog.isString(a);
};
cljs.core.native_satisfies_QMARK_ = function(a, b) {
  return a[goog.typeOf(null == b ? null : b)] ? !0 : a._ ? !0 : !1;
};
cljs.core.is_proto_ = function(a) {
  return a.constructor.prototype === a;
};
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.type = function(a) {
  return null == a ? null : a.constructor;
};
cljs.core.missing_protocol = function(a, b) {
  var c = cljs.core.type.call(null, b), c = cljs.core.truth_(cljs.core.truth_(c) ? c.cljs$lang$type : c) ? c.cljs$lang$ctorStr : goog.typeOf(b);
  return Error(["No protocol method ", a, " defined for type ", c, ": ", b].join(""));
};
cljs.core.type__GT_str = function(a) {
  var b = a.cljs$lang$ctorStr;
  return cljs.core.truth_(b) ? b : "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a);
};
cljs.core.make_array = function() {
  var a = null, b = function(b, d) {
    return a.call(null, d);
  }, a = function(a, d) {
    switch(arguments.length) {
      case 1:
        return Array(a);
      case 2:
        return b.call(this, a, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return Array(a);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  return a;
}();
cljs.core.aclone = function(a) {
  for (var b = a.length, c = Array(b), d = 0;;) {
    if (d < b) {
      c[d] = a[d], d += 1;
    } else {
      break;
    }
  }
  return c;
};
cljs.core.array = function(a) {
  return Array.prototype.slice.call(arguments);
};
cljs.core.aget = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.apply.call(null, a, a.call(null, b, c), d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 2:
        return a[d];
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a[b];
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.aset = function() {
  var a = null, b = function() {
    var b = function(b, c, d, h) {
      return cljs.core.apply.call(null, a, b[c], d, h);
    }, d = function(a, d, g, h) {
      var k = null;
      3 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, d, g, k);
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.next(a);
      var h = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, h, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e, f) {
    switch(arguments.length) {
      case 3:
        return a[d] = e;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, e, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = function(a, b, e) {
    return a[b] = e;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.alength = function(a) {
  return a.length;
};
cljs.core.into_array = function() {
  var a = null, b = function(b) {
    return a.call(null, null, b);
  }, c = function(a, b) {
    return cljs.core.reduce.call(null, function(a, b) {
      a.push(b);
      return a;
    }, [], b);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.Fn = function() {
  return{};
}();
cljs.core.IFn = function() {
  return{};
}();
cljs.core._invoke = function() {
  var a = null, b = function(a) {
    if (a ? a.cljs$core$IFn$_invoke$arity$1 : a) {
      return a.cljs$core$IFn$_invoke$arity$1(a);
    }
    var b;
    b = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!b && (b = cljs.core._invoke._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return b.call(null, a);
  }, c = function(a, b) {
    if (a ? a.cljs$core$IFn$_invoke$arity$2 : a) {
      return a.cljs$core$IFn$_invoke$arity$2(a, b);
    }
    var c;
    c = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!c && (c = cljs.core._invoke._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return c.call(null, a, b);
  }, d = function(a, b, c) {
    if (a ? a.cljs$core$IFn$_invoke$arity$3 : a) {
      return a.cljs$core$IFn$_invoke$arity$3(a, b, c);
    }
    var d;
    d = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!d && (d = cljs.core._invoke._, !d)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return d.call(null, a, b, c);
  }, e = function(a, b, c, d) {
    if (a ? a.cljs$core$IFn$_invoke$arity$4 : a) {
      return a.cljs$core$IFn$_invoke$arity$4(a, b, c, d);
    }
    var e;
    e = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!e && (e = cljs.core._invoke._, !e)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return e.call(null, a, b, c, d);
  }, f = function(a, b, c, d, e) {
    if (a ? a.cljs$core$IFn$_invoke$arity$5 : a) {
      return a.cljs$core$IFn$_invoke$arity$5(a, b, c, d, e);
    }
    var f;
    f = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!f && (f = cljs.core._invoke._, !f)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return f.call(null, a, b, c, d, e);
  }, g = function(a, b, c, d, e, f) {
    if (a ? a.cljs$core$IFn$_invoke$arity$6 : a) {
      return a.cljs$core$IFn$_invoke$arity$6(a, b, c, d, e, f);
    }
    var g;
    g = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!g && (g = cljs.core._invoke._, !g)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return g.call(null, a, b, c, d, e, f);
  }, h = function(a, b, c, d, e, f, g) {
    if (a ? a.cljs$core$IFn$_invoke$arity$7 : a) {
      return a.cljs$core$IFn$_invoke$arity$7(a, b, c, d, e, f, g);
    }
    var h;
    h = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!h && (h = cljs.core._invoke._, !h)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return h.call(null, a, b, c, d, e, f, g);
  }, k = function(a, b, c, d, e, f, g, h) {
    if (a ? a.cljs$core$IFn$_invoke$arity$8 : a) {
      return a.cljs$core$IFn$_invoke$arity$8(a, b, c, d, e, f, g, h);
    }
    var k;
    k = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!k && (k = cljs.core._invoke._, !k)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return k.call(null, a, b, c, d, e, f, g, h);
  }, l = function(a, b, c, d, e, f, g, h, k) {
    if (a ? a.cljs$core$IFn$_invoke$arity$9 : a) {
      return a.cljs$core$IFn$_invoke$arity$9(a, b, c, d, e, f, g, h, k);
    }
    var l;
    l = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!l && (l = cljs.core._invoke._, !l)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return l.call(null, a, b, c, d, e, f, g, h, k);
  }, m = function(a, b, c, d, e, f, g, h, k, l) {
    if (a ? a.cljs$core$IFn$_invoke$arity$10 : a) {
      return a.cljs$core$IFn$_invoke$arity$10(a, b, c, d, e, f, g, h, k, l);
    }
    var m;
    m = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!m && (m = cljs.core._invoke._, !m)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return m.call(null, a, b, c, d, e, f, g, h, k, l);
  }, n = function(a, b, c, d, e, f, g, h, k, l, m) {
    if (a ? a.cljs$core$IFn$_invoke$arity$11 : a) {
      return a.cljs$core$IFn$_invoke$arity$11(a, b, c, d, e, f, g, h, k, l, m);
    }
    var q;
    q = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!q && (q = cljs.core._invoke._, !q)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return q.call(null, a, b, c, d, e, f, g, h, k, l, m);
  }, p = function(a, b, c, d, e, f, g, h, k, l, m, q) {
    if (a ? a.cljs$core$IFn$_invoke$arity$12 : a) {
      return a.cljs$core$IFn$_invoke$arity$12(a, b, c, d, e, f, g, h, k, l, m, q);
    }
    var r;
    r = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!r && (r = cljs.core._invoke._, !r)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return r.call(null, a, b, c, d, e, f, g, h, k, l, m, q);
  }, q = function(a, b, c, d, e, f, g, h, k, l, m, q, r) {
    if (a ? a.cljs$core$IFn$_invoke$arity$13 : a) {
      return a.cljs$core$IFn$_invoke$arity$13(a, b, c, d, e, f, g, h, k, l, m, q, r);
    }
    var n;
    n = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!n && (n = cljs.core._invoke._, !n)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return n.call(null, a, b, c, d, e, f, g, h, k, l, m, q, r);
  }, r = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n) {
    if (a ? a.cljs$core$IFn$_invoke$arity$14 : a) {
      return a.cljs$core$IFn$_invoke$arity$14(a, b, c, d, e, f, g, h, k, l, m, q, r, n);
    }
    var p;
    p = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!p && (p = cljs.core._invoke._, !p)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return p.call(null, a, b, c, d, e, f, g, h, k, l, m, q, r, n);
  }, s = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p) {
    if (a ? a.cljs$core$IFn$_invoke$arity$15 : a) {
      return a.cljs$core$IFn$_invoke$arity$15(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p);
    }
    var s;
    s = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!s && (s = cljs.core._invoke._, !s)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return s.call(null, a, b, c, d, e, f, g, h, k, l, m, q, r, n, p);
  }, t = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s) {
    if (a ? a.cljs$core$IFn$_invoke$arity$16 : a) {
      return a.cljs$core$IFn$_invoke$arity$16(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s);
    }
    var t;
    t = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!t && (t = cljs.core._invoke._, !t)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return t.call(null, a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s);
  }, u = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t) {
    if (a ? a.cljs$core$IFn$_invoke$arity$17 : a) {
      return a.cljs$core$IFn$_invoke$arity$17(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t);
    }
    var u;
    u = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!u && (u = cljs.core._invoke._, !u)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return u.call(null, a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t);
  }, v = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u) {
    if (a ? a.cljs$core$IFn$_invoke$arity$18 : a) {
      return a.cljs$core$IFn$_invoke$arity$18(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u);
    }
    var v;
    v = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!v && (v = cljs.core._invoke._, !v)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return v.call(null, a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u);
  }, x = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v) {
    if (a ? a.cljs$core$IFn$_invoke$arity$19 : a) {
      return a.cljs$core$IFn$_invoke$arity$19(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v);
    }
    var J;
    J = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!J && (J = cljs.core._invoke._, !J)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return J.call(null, a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v);
  }, C = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J) {
    if (a ? a.cljs$core$IFn$_invoke$arity$20 : a) {
      return a.cljs$core$IFn$_invoke$arity$20(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J);
    }
    var x;
    x = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!x && (x = cljs.core._invoke._, !x)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return x.call(null, a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J);
  }, I = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J, x) {
    if (a ? a.cljs$core$IFn$_invoke$arity$21 : a) {
      return a.cljs$core$IFn$_invoke$arity$21(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J, x);
    }
    var C;
    C = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!C && (C = cljs.core._invoke._, !C)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return C.call(null, a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J, x);
  }, J = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J, x, C) {
    if (a ? a.cljs$core$IFn$_invoke$arity$22 : a) {
      return a.cljs$core$IFn$_invoke$arity$22(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J, x, C);
    }
    var I;
    I = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!I && (I = cljs.core._invoke._, !I)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return I.call(null, a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J, x, C);
  }, a = function(a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S, T, V, U) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, w);
      case 3:
        return d.call(this, a, w, y);
      case 4:
        return e.call(this, a, w, y, z);
      case 5:
        return f.call(this, a, w, y, z, A);
      case 6:
        return g.call(this, a, w, y, z, A, B);
      case 7:
        return h.call(this, a, w, y, z, A, B, D);
      case 8:
        return k.call(this, a, w, y, z, A, B, D, E);
      case 9:
        return l.call(this, a, w, y, z, A, B, D, E, F);
      case 10:
        return m.call(this, a, w, y, z, A, B, D, E, F, G);
      case 11:
        return n.call(this, a, w, y, z, A, B, D, E, F, G, H);
      case 12:
        return p.call(this, a, w, y, z, A, B, D, E, F, G, H, K);
      case 13:
        return q.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L);
      case 14:
        return r.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M);
      case 15:
        return s.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N);
      case 16:
        return t.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O);
      case 17:
        return u.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q);
      case 18:
        return v.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R);
      case 19:
        return x.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S);
      case 20:
        return C.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S, T);
      case 21:
        return I.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S, T, V);
      case 22:
        return J.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S, T, V, U);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$4 = e;
  a.cljs$core$IFn$_invoke$arity$5 = f;
  a.cljs$core$IFn$_invoke$arity$6 = g;
  a.cljs$core$IFn$_invoke$arity$7 = h;
  a.cljs$core$IFn$_invoke$arity$8 = k;
  a.cljs$core$IFn$_invoke$arity$9 = l;
  a.cljs$core$IFn$_invoke$arity$10 = m;
  a.cljs$core$IFn$_invoke$arity$11 = n;
  a.cljs$core$IFn$_invoke$arity$12 = p;
  a.cljs$core$IFn$_invoke$arity$13 = q;
  a.cljs$core$IFn$_invoke$arity$14 = r;
  a.cljs$core$IFn$_invoke$arity$15 = s;
  a.cljs$core$IFn$_invoke$arity$16 = t;
  a.cljs$core$IFn$_invoke$arity$17 = u;
  a.cljs$core$IFn$_invoke$arity$18 = v;
  a.cljs$core$IFn$_invoke$arity$19 = x;
  a.cljs$core$IFn$_invoke$arity$20 = C;
  a.cljs$core$IFn$_invoke$arity$21 = I;
  a.cljs$core$IFn$_invoke$arity$22 = J;
  return a;
}();
cljs.core.ICloneable = function() {
  return{};
}();
cljs.core._clone = function(a) {
  if (a ? a.cljs$core$ICloneable$_clone$arity$1 : a) {
    return a.cljs$core$ICloneable$_clone$arity$1(a);
  }
  var b;
  b = cljs.core._clone[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._clone._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ICloneable.-clone", a);
  }
  return b.call(null, a);
};
cljs.core.ICounted = function() {
  return{};
}();
cljs.core._count = function(a) {
  if (a ? a.cljs$core$ICounted$_count$arity$1 : a) {
    return a.cljs$core$ICounted$_count$arity$1(a);
  }
  var b;
  b = cljs.core._count[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._count._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ICounted.-count", a);
  }
  return b.call(null, a);
};
cljs.core.IEmptyableCollection = function() {
  return{};
}();
cljs.core._empty = function(a) {
  if (a ? a.cljs$core$IEmptyableCollection$_empty$arity$1 : a) {
    return a.cljs$core$IEmptyableCollection$_empty$arity$1(a);
  }
  var b;
  b = cljs.core._empty[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._empty._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEmptyableCollection.-empty", a);
  }
  return b.call(null, a);
};
cljs.core.ICollection = function() {
  return{};
}();
cljs.core._conj = function(a, b) {
  if (a ? a.cljs$core$ICollection$_conj$arity$2 : a) {
    return a.cljs$core$ICollection$_conj$arity$2(a, b);
  }
  var c;
  c = cljs.core._conj[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._conj._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ICollection.-conj", a);
  }
  return c.call(null, a, b);
};
cljs.core.IIndexed = function() {
  return{};
}();
cljs.core._nth = function() {
  var a = null, b = function(a, b) {
    if (a ? a.cljs$core$IIndexed$_nth$arity$2 : a) {
      return a.cljs$core$IIndexed$_nth$arity$2(a, b);
    }
    var c;
    c = cljs.core._nth[goog.typeOf(null == a ? null : a)];
    if (!c && (c = cljs.core._nth._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", a);
    }
    return c.call(null, a, b);
  }, c = function(a, b, c) {
    if (a ? a.cljs$core$IIndexed$_nth$arity$3 : a) {
      return a.cljs$core$IIndexed$_nth$arity$3(a, b, c);
    }
    var g;
    g = cljs.core._nth[goog.typeOf(null == a ? null : a)];
    if (!g && (g = cljs.core._nth._, !g)) {
      throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", a);
    }
    return g.call(null, a, b, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.ASeq = function() {
  return{};
}();
cljs.core.ISeq = function() {
  return{};
}();
cljs.core._first = function(a) {
  if (a ? a.cljs$core$ISeq$_first$arity$1 : a) {
    return a.cljs$core$ISeq$_first$arity$1(a);
  }
  var b;
  b = cljs.core._first[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._first._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISeq.-first", a);
  }
  return b.call(null, a);
};
cljs.core._rest = function(a) {
  if (a ? a.cljs$core$ISeq$_rest$arity$1 : a) {
    return a.cljs$core$ISeq$_rest$arity$1(a);
  }
  var b;
  b = cljs.core._rest[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._rest._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISeq.-rest", a);
  }
  return b.call(null, a);
};
cljs.core.INext = function() {
  return{};
}();
cljs.core._next = function(a) {
  if (a ? a.cljs$core$INext$_next$arity$1 : a) {
    return a.cljs$core$INext$_next$arity$1(a);
  }
  var b;
  b = cljs.core._next[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._next._, !b)) {
    throw cljs.core.missing_protocol.call(null, "INext.-next", a);
  }
  return b.call(null, a);
};
cljs.core.ILookup = function() {
  return{};
}();
cljs.core._lookup = function() {
  var a = null, b = function(a, b) {
    if (a ? a.cljs$core$ILookup$_lookup$arity$2 : a) {
      return a.cljs$core$ILookup$_lookup$arity$2(a, b);
    }
    var c;
    c = cljs.core._lookup[goog.typeOf(null == a ? null : a)];
    if (!c && (c = cljs.core._lookup._, !c)) {
      throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", a);
    }
    return c.call(null, a, b);
  }, c = function(a, b, c) {
    if (a ? a.cljs$core$ILookup$_lookup$arity$3 : a) {
      return a.cljs$core$ILookup$_lookup$arity$3(a, b, c);
    }
    var g;
    g = cljs.core._lookup[goog.typeOf(null == a ? null : a)];
    if (!g && (g = cljs.core._lookup._, !g)) {
      throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", a);
    }
    return g.call(null, a, b, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.IAssociative = function() {
  return{};
}();
cljs.core._contains_key_QMARK_ = function(a, b) {
  if (a ? a.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 : a) {
    return a.cljs$core$IAssociative$_contains_key_QMARK_$arity$2(a, b);
  }
  var c;
  c = cljs.core._contains_key_QMARK_[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._contains_key_QMARK_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", a);
  }
  return c.call(null, a, b);
};
cljs.core._assoc = function(a, b, c) {
  if (a ? a.cljs$core$IAssociative$_assoc$arity$3 : a) {
    return a.cljs$core$IAssociative$_assoc$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._assoc[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._assoc._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IAssociative.-assoc", a);
  }
  return d.call(null, a, b, c);
};
cljs.core.IMap = function() {
  return{};
}();
cljs.core._dissoc = function(a, b) {
  if (a ? a.cljs$core$IMap$_dissoc$arity$2 : a) {
    return a.cljs$core$IMap$_dissoc$arity$2(a, b);
  }
  var c;
  c = cljs.core._dissoc[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._dissoc._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMap.-dissoc", a);
  }
  return c.call(null, a, b);
};
cljs.core.IMapEntry = function() {
  return{};
}();
cljs.core._key = function(a) {
  if (a ? a.cljs$core$IMapEntry$_key$arity$1 : a) {
    return a.cljs$core$IMapEntry$_key$arity$1(a);
  }
  var b;
  b = cljs.core._key[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._key._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMapEntry.-key", a);
  }
  return b.call(null, a);
};
cljs.core._val = function(a) {
  if (a ? a.cljs$core$IMapEntry$_val$arity$1 : a) {
    return a.cljs$core$IMapEntry$_val$arity$1(a);
  }
  var b;
  b = cljs.core._val[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._val._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMapEntry.-val", a);
  }
  return b.call(null, a);
};
cljs.core.ISet = function() {
  return{};
}();
cljs.core._disjoin = function(a, b) {
  if (a ? a.cljs$core$ISet$_disjoin$arity$2 : a) {
    return a.cljs$core$ISet$_disjoin$arity$2(a, b);
  }
  var c;
  c = cljs.core._disjoin[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._disjoin._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ISet.-disjoin", a);
  }
  return c.call(null, a, b);
};
cljs.core.IStack = function() {
  return{};
}();
cljs.core._peek = function(a) {
  if (a ? a.cljs$core$IStack$_peek$arity$1 : a) {
    return a.cljs$core$IStack$_peek$arity$1(a);
  }
  var b;
  b = cljs.core._peek[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._peek._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IStack.-peek", a);
  }
  return b.call(null, a);
};
cljs.core._pop = function(a) {
  if (a ? a.cljs$core$IStack$_pop$arity$1 : a) {
    return a.cljs$core$IStack$_pop$arity$1(a);
  }
  var b;
  b = cljs.core._pop[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._pop._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IStack.-pop", a);
  }
  return b.call(null, a);
};
cljs.core.IVector = function() {
  return{};
}();
cljs.core._assoc_n = function(a, b, c) {
  if (a ? a.cljs$core$IVector$_assoc_n$arity$3 : a) {
    return a.cljs$core$IVector$_assoc_n$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._assoc_n[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._assoc_n._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IVector.-assoc-n", a);
  }
  return d.call(null, a, b, c);
};
cljs.core.IDeref = function() {
  return{};
}();
cljs.core._deref = function(a) {
  if (a ? a.cljs$core$IDeref$_deref$arity$1 : a) {
    return a.cljs$core$IDeref$_deref$arity$1(a);
  }
  var b;
  b = cljs.core._deref[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._deref._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IDeref.-deref", a);
  }
  return b.call(null, a);
};
cljs.core.IDerefWithTimeout = function() {
  return{};
}();
cljs.core._deref_with_timeout = function(a, b, c) {
  if (a ? a.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3 : a) {
    return a.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._deref_with_timeout[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._deref_with_timeout._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IDerefWithTimeout.-deref-with-timeout", a);
  }
  return d.call(null, a, b, c);
};
cljs.core.IMeta = function() {
  return{};
}();
cljs.core._meta = function(a) {
  if (a ? a.cljs$core$IMeta$_meta$arity$1 : a) {
    return a.cljs$core$IMeta$_meta$arity$1(a);
  }
  var b;
  b = cljs.core._meta[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._meta._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMeta.-meta", a);
  }
  return b.call(null, a);
};
cljs.core.IWithMeta = function() {
  return{};
}();
cljs.core._with_meta = function(a, b) {
  if (a ? a.cljs$core$IWithMeta$_with_meta$arity$2 : a) {
    return a.cljs$core$IWithMeta$_with_meta$arity$2(a, b);
  }
  var c;
  c = cljs.core._with_meta[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._with_meta._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IWithMeta.-with-meta", a);
  }
  return c.call(null, a, b);
};
cljs.core.IReduce = function() {
  return{};
}();
cljs.core._reduce = function() {
  var a = null, b = function(a, b) {
    if (a ? a.cljs$core$IReduce$_reduce$arity$2 : a) {
      return a.cljs$core$IReduce$_reduce$arity$2(a, b);
    }
    var c;
    c = cljs.core._reduce[goog.typeOf(null == a ? null : a)];
    if (!c && (c = cljs.core._reduce._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", a);
    }
    return c.call(null, a, b);
  }, c = function(a, b, c) {
    if (a ? a.cljs$core$IReduce$_reduce$arity$3 : a) {
      return a.cljs$core$IReduce$_reduce$arity$3(a, b, c);
    }
    var g;
    g = cljs.core._reduce[goog.typeOf(null == a ? null : a)];
    if (!g && (g = cljs.core._reduce._, !g)) {
      throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", a);
    }
    return g.call(null, a, b, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.IKVReduce = function() {
  return{};
}();
cljs.core._kv_reduce = function(a, b, c) {
  if (a ? a.cljs$core$IKVReduce$_kv_reduce$arity$3 : a) {
    return a.cljs$core$IKVReduce$_kv_reduce$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._kv_reduce[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._kv_reduce._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IKVReduce.-kv-reduce", a);
  }
  return d.call(null, a, b, c);
};
cljs.core.IEquiv = function() {
  return{};
}();
cljs.core._equiv = function(a, b) {
  if (a ? a.cljs$core$IEquiv$_equiv$arity$2 : a) {
    return a.cljs$core$IEquiv$_equiv$arity$2(a, b);
  }
  var c;
  c = cljs.core._equiv[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._equiv._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IEquiv.-equiv", a);
  }
  return c.call(null, a, b);
};
cljs.core.IHash = function() {
  return{};
}();
cljs.core._hash = function(a) {
  if (a ? a.cljs$core$IHash$_hash$arity$1 : a) {
    return a.cljs$core$IHash$_hash$arity$1(a);
  }
  var b;
  b = cljs.core._hash[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._hash._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IHash.-hash", a);
  }
  return b.call(null, a);
};
cljs.core.ISeqable = function() {
  return{};
}();
cljs.core._seq = function(a) {
  if (a ? a.cljs$core$ISeqable$_seq$arity$1 : a) {
    return a.cljs$core$ISeqable$_seq$arity$1(a);
  }
  var b;
  b = cljs.core._seq[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._seq._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISeqable.-seq", a);
  }
  return b.call(null, a);
};
cljs.core.ISequential = function() {
  return{};
}();
cljs.core.IList = function() {
  return{};
}();
cljs.core.IRecord = function() {
  return{};
}();
cljs.core.IReversible = function() {
  return{};
}();
cljs.core._rseq = function(a) {
  if (a ? a.cljs$core$IReversible$_rseq$arity$1 : a) {
    return a.cljs$core$IReversible$_rseq$arity$1(a);
  }
  var b;
  b = cljs.core._rseq[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._rseq._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IReversible.-rseq", a);
  }
  return b.call(null, a);
};
cljs.core.ISorted = function() {
  return{};
}();
cljs.core._sorted_seq = function(a, b) {
  if (a ? a.cljs$core$ISorted$_sorted_seq$arity$2 : a) {
    return a.cljs$core$ISorted$_sorted_seq$arity$2(a, b);
  }
  var c;
  c = cljs.core._sorted_seq[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._sorted_seq._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq", a);
  }
  return c.call(null, a, b);
};
cljs.core._sorted_seq_from = function(a, b, c) {
  if (a ? a.cljs$core$ISorted$_sorted_seq_from$arity$3 : a) {
    return a.cljs$core$ISorted$_sorted_seq_from$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._sorted_seq_from[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._sorted_seq_from._, !d)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq-from", a);
  }
  return d.call(null, a, b, c);
};
cljs.core._entry_key = function(a, b) {
  if (a ? a.cljs$core$ISorted$_entry_key$arity$2 : a) {
    return a.cljs$core$ISorted$_entry_key$arity$2(a, b);
  }
  var c;
  c = cljs.core._entry_key[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._entry_key._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-entry-key", a);
  }
  return c.call(null, a, b);
};
cljs.core._comparator = function(a) {
  if (a ? a.cljs$core$ISorted$_comparator$arity$1 : a) {
    return a.cljs$core$ISorted$_comparator$arity$1(a);
  }
  var b;
  b = cljs.core._comparator[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._comparator._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-comparator", a);
  }
  return b.call(null, a);
};
cljs.core.IWriter = function() {
  return{};
}();
cljs.core._write = function(a, b) {
  if (a ? a.cljs$core$IWriter$_write$arity$2 : a) {
    return a.cljs$core$IWriter$_write$arity$2(a, b);
  }
  var c;
  c = cljs.core._write[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._write._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IWriter.-write", a);
  }
  return c.call(null, a, b);
};
cljs.core._flush = function(a) {
  if (a ? a.cljs$core$IWriter$_flush$arity$1 : a) {
    return a.cljs$core$IWriter$_flush$arity$1(a);
  }
  var b;
  b = cljs.core._flush[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._flush._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IWriter.-flush", a);
  }
  return b.call(null, a);
};
cljs.core.IPrintWithWriter = function() {
  return{};
}();
cljs.core._pr_writer = function(a, b, c) {
  if (a ? a.cljs$core$IPrintWithWriter$_pr_writer$arity$3 : a) {
    return a.cljs$core$IPrintWithWriter$_pr_writer$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._pr_writer[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._pr_writer._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IPrintWithWriter.-pr-writer", a);
  }
  return d.call(null, a, b, c);
};
cljs.core.IPending = function() {
  return{};
}();
cljs.core._realized_QMARK_ = function(a) {
  if (a ? a.cljs$core$IPending$_realized_QMARK_$arity$1 : a) {
    return a.cljs$core$IPending$_realized_QMARK_$arity$1(a);
  }
  var b;
  b = cljs.core._realized_QMARK_[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._realized_QMARK_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IPending.-realized?", a);
  }
  return b.call(null, a);
};
cljs.core.IWatchable = function() {
  return{};
}();
cljs.core._notify_watches = function(a, b, c) {
  if (a ? a.cljs$core$IWatchable$_notify_watches$arity$3 : a) {
    return a.cljs$core$IWatchable$_notify_watches$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._notify_watches[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._notify_watches._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", a);
  }
  return d.call(null, a, b, c);
};
cljs.core._add_watch = function(a, b, c) {
  if (a ? a.cljs$core$IWatchable$_add_watch$arity$3 : a) {
    return a.cljs$core$IWatchable$_add_watch$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._add_watch[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._add_watch._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", a);
  }
  return d.call(null, a, b, c);
};
cljs.core._remove_watch = function(a, b) {
  if (a ? a.cljs$core$IWatchable$_remove_watch$arity$2 : a) {
    return a.cljs$core$IWatchable$_remove_watch$arity$2(a, b);
  }
  var c;
  c = cljs.core._remove_watch[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._remove_watch._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IWatchable.-remove-watch", a);
  }
  return c.call(null, a, b);
};
cljs.core.IEditableCollection = function() {
  return{};
}();
cljs.core._as_transient = function(a) {
  if (a ? a.cljs$core$IEditableCollection$_as_transient$arity$1 : a) {
    return a.cljs$core$IEditableCollection$_as_transient$arity$1(a);
  }
  var b;
  b = cljs.core._as_transient[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._as_transient._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEditableCollection.-as-transient", a);
  }
  return b.call(null, a);
};
cljs.core.ITransientCollection = function() {
  return{};
}();
cljs.core._conj_BANG_ = function(a, b) {
  if (a ? a.cljs$core$ITransientCollection$_conj_BANG_$arity$2 : a) {
    return a.cljs$core$ITransientCollection$_conj_BANG_$arity$2(a, b);
  }
  var c;
  c = cljs.core._conj_BANG_[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._conj_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ITransientCollection.-conj!", a);
  }
  return c.call(null, a, b);
};
cljs.core._persistent_BANG_ = function(a) {
  if (a ? a.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 : a) {
    return a.cljs$core$ITransientCollection$_persistent_BANG_$arity$1(a);
  }
  var b;
  b = cljs.core._persistent_BANG_[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._persistent_BANG_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ITransientCollection.-persistent!", a);
  }
  return b.call(null, a);
};
cljs.core.ITransientAssociative = function() {
  return{};
}();
cljs.core._assoc_BANG_ = function(a, b, c) {
  if (a ? a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 : a) {
    return a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._assoc_BANG_[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._assoc_BANG_._, !d)) {
    throw cljs.core.missing_protocol.call(null, "ITransientAssociative.-assoc!", a);
  }
  return d.call(null, a, b, c);
};
cljs.core.ITransientMap = function() {
  return{};
}();
cljs.core._dissoc_BANG_ = function(a, b) {
  if (a ? a.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 : a) {
    return a.cljs$core$ITransientMap$_dissoc_BANG_$arity$2(a, b);
  }
  var c;
  c = cljs.core._dissoc_BANG_[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._dissoc_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ITransientMap.-dissoc!", a);
  }
  return c.call(null, a, b);
};
cljs.core.ITransientVector = function() {
  return{};
}();
cljs.core._assoc_n_BANG_ = function(a, b, c) {
  if (a ? a.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 : a) {
    return a.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._assoc_n_BANG_[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._assoc_n_BANG_._, !d)) {
    throw cljs.core.missing_protocol.call(null, "ITransientVector.-assoc-n!", a);
  }
  return d.call(null, a, b, c);
};
cljs.core._pop_BANG_ = function(a) {
  if (a ? a.cljs$core$ITransientVector$_pop_BANG_$arity$1 : a) {
    return a.cljs$core$ITransientVector$_pop_BANG_$arity$1(a);
  }
  var b;
  b = cljs.core._pop_BANG_[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._pop_BANG_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ITransientVector.-pop!", a);
  }
  return b.call(null, a);
};
cljs.core.ITransientSet = function() {
  return{};
}();
cljs.core._disjoin_BANG_ = function(a, b) {
  if (a ? a.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 : a) {
    return a.cljs$core$ITransientSet$_disjoin_BANG_$arity$2(a, b);
  }
  var c;
  c = cljs.core._disjoin_BANG_[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._disjoin_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ITransientSet.-disjoin!", a);
  }
  return c.call(null, a, b);
};
cljs.core.IComparable = function() {
  return{};
}();
cljs.core._compare = function(a, b) {
  if (a ? a.cljs$core$IComparable$_compare$arity$2 : a) {
    return a.cljs$core$IComparable$_compare$arity$2(a, b);
  }
  var c;
  c = cljs.core._compare[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._compare._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IComparable.-compare", a);
  }
  return c.call(null, a, b);
};
cljs.core.IChunk = function() {
  return{};
}();
cljs.core._drop_first = function(a) {
  if (a ? a.cljs$core$IChunk$_drop_first$arity$1 : a) {
    return a.cljs$core$IChunk$_drop_first$arity$1(a);
  }
  var b;
  b = cljs.core._drop_first[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._drop_first._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunk.-drop-first", a);
  }
  return b.call(null, a);
};
cljs.core.IChunkedSeq = function() {
  return{};
}();
cljs.core._chunked_first = function(a) {
  if (a ? a.cljs$core$IChunkedSeq$_chunked_first$arity$1 : a) {
    return a.cljs$core$IChunkedSeq$_chunked_first$arity$1(a);
  }
  var b;
  b = cljs.core._chunked_first[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._chunked_first._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunkedSeq.-chunked-first", a);
  }
  return b.call(null, a);
};
cljs.core._chunked_rest = function(a) {
  if (a ? a.cljs$core$IChunkedSeq$_chunked_rest$arity$1 : a) {
    return a.cljs$core$IChunkedSeq$_chunked_rest$arity$1(a);
  }
  var b;
  b = cljs.core._chunked_rest[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._chunked_rest._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunkedSeq.-chunked-rest", a);
  }
  return b.call(null, a);
};
cljs.core.IChunkedNext = function() {
  return{};
}();
cljs.core._chunked_next = function(a) {
  if (a ? a.cljs$core$IChunkedNext$_chunked_next$arity$1 : a) {
    return a.cljs$core$IChunkedNext$_chunked_next$arity$1(a);
  }
  var b;
  b = cljs.core._chunked_next[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._chunked_next._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunkedNext.-chunked-next", a);
  }
  return b.call(null, a);
};
cljs.core.INamed = function() {
  return{};
}();
cljs.core._name = function(a) {
  if (a ? a.cljs$core$INamed$_name$arity$1 : a) {
    return a.cljs$core$INamed$_name$arity$1(a);
  }
  var b;
  b = cljs.core._name[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._name._, !b)) {
    throw cljs.core.missing_protocol.call(null, "INamed.-name", a);
  }
  return b.call(null, a);
};
cljs.core._namespace = function(a) {
  if (a ? a.cljs$core$INamed$_namespace$arity$1 : a) {
    return a.cljs$core$INamed$_namespace$arity$1(a);
  }
  var b;
  b = cljs.core._namespace[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._namespace._, !b)) {
    throw cljs.core.missing_protocol.call(null, "INamed.-namespace", a);
  }
  return b.call(null, a);
};
cljs.core.IAtom = function() {
  return{};
}();
cljs.core.IReset = function() {
  return{};
}();
cljs.core._reset_BANG_ = function(a, b) {
  if (a ? a.cljs$core$IReset$_reset_BANG_$arity$2 : a) {
    return a.cljs$core$IReset$_reset_BANG_$arity$2(a, b);
  }
  var c;
  c = cljs.core._reset_BANG_[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._reset_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IReset.-reset!", a);
  }
  return c.call(null, a, b);
};
cljs.core.ISwap = function() {
  return{};
}();
cljs.core._swap_BANG_ = function() {
  var a = null, b = function(a, b) {
    if (a ? a.cljs$core$ISwap$_swap_BANG_$arity$2 : a) {
      return a.cljs$core$ISwap$_swap_BANG_$arity$2(a, b);
    }
    var c;
    c = cljs.core._swap_BANG_[goog.typeOf(null == a ? null : a)];
    if (!c && (c = cljs.core._swap_BANG_._, !c)) {
      throw cljs.core.missing_protocol.call(null, "ISwap.-swap!", a);
    }
    return c.call(null, a, b);
  }, c = function(a, b, c) {
    if (a ? a.cljs$core$ISwap$_swap_BANG_$arity$3 : a) {
      return a.cljs$core$ISwap$_swap_BANG_$arity$3(a, b, c);
    }
    var d;
    d = cljs.core._swap_BANG_[goog.typeOf(null == a ? null : a)];
    if (!d && (d = cljs.core._swap_BANG_._, !d)) {
      throw cljs.core.missing_protocol.call(null, "ISwap.-swap!", a);
    }
    return d.call(null, a, b, c);
  }, d = function(a, b, c, d) {
    if (a ? a.cljs$core$ISwap$_swap_BANG_$arity$4 : a) {
      return a.cljs$core$ISwap$_swap_BANG_$arity$4(a, b, c, d);
    }
    var e;
    e = cljs.core._swap_BANG_[goog.typeOf(null == a ? null : a)];
    if (!e && (e = cljs.core._swap_BANG_._, !e)) {
      throw cljs.core.missing_protocol.call(null, "ISwap.-swap!", a);
    }
    return e.call(null, a, b, c, d);
  }, e = function(a, b, c, d, e) {
    if (a ? a.cljs$core$ISwap$_swap_BANG_$arity$5 : a) {
      return a.cljs$core$ISwap$_swap_BANG_$arity$5(a, b, c, d, e);
    }
    var m;
    m = cljs.core._swap_BANG_[goog.typeOf(null == a ? null : a)];
    if (!m && (m = cljs.core._swap_BANG_._, !m)) {
      throw cljs.core.missing_protocol.call(null, "ISwap.-swap!", a);
    }
    return m.call(null, a, b, c, d, e);
  }, a = function(a, g, h, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, k);
      case 5:
        return e.call(this, a, g, h, k, l);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$5 = e;
  return a;
}();
cljs.core.IIterable = function() {
  return{};
}();
cljs.core._iterator = function(a) {
  if (a ? a.cljs$core$IIterable$_iterator$arity$1 : a) {
    return a.cljs$core$IIterable$_iterator$arity$1(a);
  }
  var b;
  b = cljs.core._iterator[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._iterator._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IIterable.-iterator", a);
  }
  return b.call(null, a);
};
cljs.core.StringBufferWriter = function(a) {
  this.sb = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 1073741824;
};
cljs.core.StringBufferWriter.cljs$lang$type = !0;
cljs.core.StringBufferWriter.cljs$lang$ctorStr = "cljs.core/StringBufferWriter";
cljs.core.StringBufferWriter.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/StringBufferWriter");
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_write$arity$2 = function(a, b) {
  return this.sb.append(b);
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_flush$arity$1 = function(a) {
  return null;
};
cljs.core.__GT_StringBufferWriter = function(a) {
  return new cljs.core.StringBufferWriter(a);
};
cljs.core.pr_str_STAR_ = function(a) {
  var b = new goog.string.StringBuffer, c = new cljs.core.StringBufferWriter(b);
  cljs.core._pr_writer.call(null, a, c, cljs.core.pr_opts.call(null));
  cljs.core._flush.call(null, c);
  return "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b);
};
cljs.core.int_rotate_left = function(a, b) {
  return a << b | a >>> -b;
};
"undefined" !== typeof Math.imul && 0 !== Math.imul.call(null, 4294967295, 5) ? cljs.core.imul = function(a, b) {
  return Math.imul.call(null, a, b);
} : cljs.core.imul = function(a, b) {
  var c = a & 65535, d = b & 65535;
  return c * d + ((a >>> 16 & 65535) * d + c * (b >>> 16 & 65535) << 16 >>> 0) | 0;
};
cljs.core.m3_seed = 0;
cljs.core.m3_C1 = 3432918353;
cljs.core.m3_C2 = 461845907;
cljs.core.m3_mix_K1 = function(a) {
  return cljs.core.imul.call(null, cljs.core.int_rotate_left.call(null, cljs.core.imul.call(null, a, cljs.core.m3_C1), 15), cljs.core.m3_C2);
};
cljs.core.m3_mix_H1 = function(a, b) {
  return cljs.core.imul.call(null, cljs.core.int_rotate_left.call(null, a ^ b, 13), 5) + 3864292196;
};
cljs.core.m3_fmix = function(a, b) {
  var c = a ^ b, c = cljs.core.imul.call(null, c ^ c >>> 16, 2246822507), c = cljs.core.imul.call(null, c ^ c >>> 13, 3266489909);
  return c ^ c >>> 16;
};
cljs.core.m3_hash_int = function(a) {
  if (0 === a) {
    return a;
  }
  a = cljs.core.m3_mix_K1.call(null, a);
  a = cljs.core.m3_mix_H1.call(null, cljs.core.m3_seed, a);
  return cljs.core.m3_fmix.call(null, a, 4);
};
cljs.core.m3_hash_unencoded_chars = function(a) {
  var b;
  a: {
    b = 1;
    for (var c = cljs.core.m3_seed;;) {
      if (b < a.length) {
        var d = b + 2, c = cljs.core.m3_mix_H1.call(null, c, cljs.core.m3_mix_K1.call(null, a.charCodeAt(b - 1) | a.charCodeAt(b) << 16));
        b = d;
      } else {
        b = c;
        break a;
      }
    }
    b = void 0;
  }
  b = 1 === (a.length & 1) ? b ^ cljs.core.m3_mix_K1.call(null, a.charCodeAt(a.length - 1)) : b;
  return cljs.core.m3_fmix.call(null, b, cljs.core.imul.call(null, 2, a.length));
};
cljs.core.string_hash_cache = function() {
  return{};
}();
cljs.core.string_hash_cache_count = 0;
cljs.core.hash_string_STAR_ = function(a) {
  if (null != a) {
    var b = a.length;
    if (0 < b) {
      for (var c = 0, d = 0;;) {
        if (c < b) {
          var e = c + 1, d = cljs.core.imul.call(null, 31, d) + a.charCodeAt(c), c = e
        } else {
          return d;
        }
      }
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};
cljs.core.add_to_string_hash_cache = function(a) {
  var b = cljs.core.hash_string_STAR_.call(null, a);
  cljs.core.string_hash_cache[a] = b;
  cljs.core.string_hash_cache_count += 1;
  return b;
};
cljs.core.hash_string = function(a) {
  255 < cljs.core.string_hash_cache_count && (cljs.core.string_hash_cache = {}, cljs.core.string_hash_cache_count = 0);
  var b = cljs.core.string_hash_cache[a];
  return "number" === typeof b ? b : cljs.core.add_to_string_hash_cache.call(null, a);
};
cljs.core.hash = function(a) {
  return a && (a.cljs$lang$protocol_mask$partition0$ & 4194304 || a.cljs$core$IHash$) ? cljs.core._hash.call(null, a) : "number" === typeof a ? Math.floor.call(null, a) % 2147483647 : !0 === a ? 1 : !1 === a ? 0 : "string" === typeof a ? cljs.core.m3_hash_int.call(null, cljs.core.hash_string.call(null, a)) : null == a ? 0 : cljs.core._hash.call(null, a);
};
cljs.core.hash_combine = function(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2);
};
cljs.core.instance_QMARK_ = function(a, b) {
  return b instanceof a;
};
cljs.core.symbol_QMARK_ = function(a) {
  return a instanceof cljs.core.Symbol;
};
cljs.core.hash_symbol = function(a) {
  return cljs.core.hash_combine.call(null, cljs.core.m3_hash_unencoded_chars.call(null, a.name), cljs.core.hash_string.call(null, a.ns));
};
cljs.core.compare_symbols = function(a, b) {
  if (cljs.core.truth_(cljs.core._EQ_.call(null, a, b))) {
    return 0;
  }
  if (cljs.core.truth_(function() {
    var c = cljs.core.not.call(null, a.ns);
    return c ? b.ns : c;
  }())) {
    return-1;
  }
  if (cljs.core.truth_(a.ns)) {
    if (cljs.core.not.call(null, b.ns)) {
      return 1;
    }
    var c = cljs.core.compare.call(null, a.ns, b.ns);
    return 0 === c ? cljs.core.compare.call(null, a.name, b.name) : c;
  }
  return cljs.core.compare.call(null, a.name, b.name);
};
cljs.core.Symbol = function(a, b, c, d, e) {
  this.ns = a;
  this.name = b;
  this.str = c;
  this._hash = d;
  this._meta = e;
  this.cljs$lang$protocol_mask$partition0$ = 2154168321;
  this.cljs$lang$protocol_mask$partition1$ = 4096;
};
cljs.core.Symbol.cljs$lang$type = !0;
cljs.core.Symbol.cljs$lang$ctorStr = "cljs.core/Symbol";
cljs.core.Symbol.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Symbol");
};
cljs.core.Symbol.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write.call(null, b, this.str);
};
cljs.core.Symbol.prototype.cljs$core$INamed$_name$arity$1 = function(a) {
  return this.name;
};
cljs.core.Symbol.prototype.cljs$core$INamed$_namespace$arity$1 = function(a) {
  return this.ns;
};
cljs.core.Symbol.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this._hash;
  return null != a ? a : this._hash = a = cljs.core.hash_symbol.call(null, this);
};
cljs.core.Symbol.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Symbol(this.ns, this.name, this.str, this._hash, b);
};
cljs.core.Symbol.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta;
};
cljs.core.Symbol.prototype.call = function() {
  var a = null, b = function(a, b) {
    return cljs.core._lookup.call(null, b, this, null);
  }, c = function(a, b, c) {
    return cljs.core._lookup.call(null, b, this, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.Symbol.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.Symbol.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return cljs.core._lookup.call(null, a, this, null);
};
cljs.core.Symbol.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, a, this, b);
};
cljs.core.Symbol.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return b instanceof cljs.core.Symbol ? this.str === b.str : !1;
};
cljs.core.Symbol.prototype.toString = function() {
  return this.str;
};
cljs.core.Symbol.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.__GT_Symbol = function(a, b, c, d, e) {
  return new cljs.core.Symbol(a, b, c, d, e);
};
cljs.core.symbol = function() {
  var a = null, b = function(b) {
    return b instanceof cljs.core.Symbol ? b : a.call(null, null, b);
  }, c = function(a, b) {
    var c = null != a ? "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a) + "/" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b) : b;
    return new cljs.core.Symbol(a, b, c, null, null);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.iterable_QMARK_ = function(a) {
  return a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$IIterable$) ? !0 : a.cljs$lang$protocol_mask$partition$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIterable, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIterable, a);
};
cljs.core.clone = function(a) {
  return cljs.core._clone.call(null, a);
};
cljs.core.cloneable_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition1$ & 8192 || a.cljs$core$ICloneable$ ? !0 : a.cljs$lang$protocol_mask$partition1$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICloneable, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICloneable, a);
};
cljs.core.seq = function(a) {
  if (null == a) {
    return null;
  }
  if (a && (a.cljs$lang$protocol_mask$partition0$ & 8388608 || a.cljs$core$ISeqable$)) {
    return cljs.core._seq.call(null, a);
  }
  if (a instanceof Array || "string" === typeof a) {
    return 0 === a.length ? null : new cljs.core.IndexedSeq(a, 0);
  }
  if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeqable, a)) {
    return cljs.core._seq.call(null, a);
  }
  throw Error("" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a) + " is not ISeqable");
};
cljs.core.first = function(a) {
  if (null == a) {
    return null;
  }
  if (a && (a.cljs$lang$protocol_mask$partition0$ & 64 || a.cljs$core$ISeq$)) {
    return cljs.core._first.call(null, a);
  }
  a = cljs.core.seq.call(null, a);
  return null == a ? null : cljs.core._first.call(null, a);
};
cljs.core.rest = function(a) {
  return null != a ? a && (a.cljs$lang$protocol_mask$partition0$ & 64 || a.cljs$core$ISeq$) ? cljs.core._rest.call(null, a) : (a = cljs.core.seq.call(null, a)) ? cljs.core._rest.call(null, a) : cljs.core.List.EMPTY : cljs.core.List.EMPTY;
};
cljs.core.next = function(a) {
  return null == a ? null : a && (a.cljs$lang$protocol_mask$partition0$ & 128 || a.cljs$core$INext$) ? cljs.core._next.call(null, a) : cljs.core.seq.call(null, cljs.core.rest.call(null, a));
};
cljs.core._EQ_ = function() {
  var a = null, b = function(a, b) {
    return null == a ? null == b : a === b || cljs.core._equiv.call(null, a, b);
  }, c = function() {
    var b = function(b, c, d) {
      for (;;) {
        if (a.call(null, b, c)) {
          if (cljs.core.next.call(null, d)) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d);
          } else {
            return a.call(null, c, cljs.core.first.call(null, d));
          }
        } else {
          return!1;
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.mix_collection_hash = function(a, b) {
  var c = cljs.core.m3_seed, d = cljs.core.m3_mix_K1.call(null, a), c = cljs.core.m3_mix_H1.call(null, c, d);
  return cljs.core.m3_fmix.call(null, c, b);
};
cljs.core.hash_ordered_coll = function(a) {
  var b = 0, c = 1;
  for (a = cljs.core.seq.call(null, a);;) {
    if (null != a) {
      b += 1, c = cljs.core.imul.call(null, 31, c) + cljs.core.hash.call(null, cljs.core.first.call(null, a)) | 0, a = cljs.core.next.call(null, a);
    } else {
      return cljs.core.mix_collection_hash.call(null, c, b);
    }
  }
};
cljs.core.hash_unordered_coll = function(a) {
  var b = 0, c = 0;
  for (a = cljs.core.seq.call(null, a);;) {
    if (null != a) {
      b += 1, c = c + cljs.core.hash.call(null, cljs.core.first.call(null, a)) | 0, a = cljs.core.next.call(null, a);
    } else {
      return cljs.core.mix_collection_hash.call(null, c, b);
    }
  }
};
cljs.core.ICounted["null"] = !0;
cljs.core._count["null"] = function(a) {
  return 0;
};
Date.prototype.cljs$core$IEquiv$ = !0;
Date.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return b instanceof Date && this.toString() === b.toString();
};
cljs.core.IEquiv.number = !0;
cljs.core._equiv.number = function(a, b) {
  return a === b;
};
cljs.core.IMeta["function"] = !0;
cljs.core._meta["function"] = function(a) {
  return null;
};
cljs.core.Fn["function"] = !0;
cljs.core.IHash._ = !0;
cljs.core._hash._ = function(a) {
  return goog.getUid(a);
};
cljs.core.inc = function(a) {
  return a + 1;
};
cljs.core.Reduced = function(a) {
  this.val = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32768;
};
cljs.core.Reduced.cljs$lang$type = !0;
cljs.core.Reduced.cljs$lang$ctorStr = "cljs.core/Reduced";
cljs.core.Reduced.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Reduced");
};
cljs.core.Reduced.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  return this.val;
};
cljs.core.__GT_Reduced = function(a) {
  return new cljs.core.Reduced(a);
};
cljs.core.reduced = function(a) {
  return new cljs.core.Reduced(a);
};
cljs.core.reduced_QMARK_ = function(a) {
  return a instanceof cljs.core.Reduced;
};
cljs.core.deref = function(a) {
  return cljs.core._deref.call(null, a);
};
cljs.core.ci_reduce = function() {
  var a = null, b = function(a, b) {
    var c = cljs.core._count.call(null, a);
    if (0 === c) {
      return b.call(null);
    }
    for (var d = cljs.core._nth.call(null, a, 0), k = 1;;) {
      if (k < c) {
        d = b.call(null, d, cljs.core._nth.call(null, a, k));
        if (cljs.core.reduced_QMARK_.call(null, d)) {
          return cljs.core.deref.call(null, d);
        }
        k += 1;
      } else {
        return d;
      }
    }
  }, c = function(a, b, c) {
    for (var d = cljs.core._count.call(null, a), k = 0;;) {
      if (k < d) {
        c = b.call(null, c, cljs.core._nth.call(null, a, k));
        if (cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c);
        }
        k += 1;
      } else {
        return c;
      }
    }
  }, d = function(a, b, c, d) {
    for (var k = cljs.core._count.call(null, a);;) {
      if (d < k) {
        c = b.call(null, c, cljs.core._nth.call(null, a, d));
        if (cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c);
        }
        d += 1;
      } else {
        return c;
      }
    }
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a;
}();
cljs.core.array_reduce = function() {
  var a = null, b = function(a, b) {
    var c = a.length;
    if (0 === a.length) {
      return b.call(null);
    }
    for (var d = a[0], k = 1;;) {
      if (k < c) {
        d = b.call(null, d, a[k]);
        if (cljs.core.reduced_QMARK_.call(null, d)) {
          return cljs.core.deref.call(null, d);
        }
        k += 1;
      } else {
        return d;
      }
    }
  }, c = function(a, b, c) {
    for (var d = a.length, k = 0;;) {
      if (k < d) {
        c = b.call(null, c, a[k]);
        if (cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c);
        }
        k += 1;
      } else {
        return c;
      }
    }
  }, d = function(a, b, c, d) {
    for (var k = a.length;;) {
      if (d < k) {
        c = b.call(null, c, a[d]);
        if (cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c);
        }
        d += 1;
      } else {
        return c;
      }
    }
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a;
}();
cljs.core.counted_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 2 || a.cljs$core$ICounted$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICounted, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICounted, a);
};
cljs.core.indexed_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 16 || a.cljs$core$IIndexed$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIndexed, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIndexed, a);
};
cljs.core.IndexedSeqIterator = function(a, b) {
  this.arr = a;
  this.i = b;
};
cljs.core.IndexedSeqIterator.cljs$lang$type = !0;
cljs.core.IndexedSeqIterator.cljs$lang$ctorStr = "cljs.core/IndexedSeqIterator";
cljs.core.IndexedSeqIterator.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/IndexedSeqIterator");
};
cljs.core.IndexedSeqIterator.prototype.hasNext = function() {
  return this.i < this.arr.length;
};
cljs.core.IndexedSeqIterator.prototype.next = function() {
  var a = this.arr[this.i];
  this.i += 1;
  return a;
};
cljs.core.__GT_IndexedSeqIterator = function(a, b) {
  return new cljs.core.IndexedSeqIterator(a, b);
};
cljs.core.IndexedSeq = function(a, b) {
  this.arr = a;
  this.i = b;
  this.cljs$lang$protocol_mask$partition0$ = 166199550;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.IndexedSeq.cljs$lang$type = !0;
cljs.core.IndexedSeq.cljs$lang$ctorStr = "cljs.core/IndexedSeq";
cljs.core.IndexedSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/IndexedSeq");
};
cljs.core.IndexedSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.IndexedSeq.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  var c = b + this.i;
  return c < this.arr.length ? this.arr[c] : null;
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  a = b + this.i;
  return a < this.arr.length ? this.arr[a] : c;
};
cljs.core.IndexedSeq.prototype.cljs$core$IIterable$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IIterable$_iterator$arity$1 = function(a) {
  return new cljs.core.IndexedSeqIterator(this.arr, this.i);
};
cljs.core.IndexedSeq.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.IndexedSeq(this.arr, this.i);
};
cljs.core.IndexedSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return this.i + 1 < this.arr.length ? new cljs.core.IndexedSeq(this.arr, this.i + 1) : null;
};
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.arr.length - this.i;
};
cljs.core.IndexedSeq.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  a = cljs.core._count.call(null, this);
  return 0 < a ? new cljs.core.RSeq(this, a - 1, null) : null;
};
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.IndexedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.List.EMPTY;
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.array_reduce.call(null, this.arr, b, this.arr[this.i], this.i + 1);
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.array_reduce.call(null, this.arr, b, c, this.i);
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.arr[this.i];
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return this.i + 1 < this.arr.length ? new cljs.core.IndexedSeq(this.arr, this.i + 1) : cljs.core.List.EMPTY;
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.__GT_IndexedSeq = function(a, b) {
  return new cljs.core.IndexedSeq(a, b);
};
cljs.core.prim_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 0);
  }, c = function(a, b) {
    return b < a.length ? new cljs.core.IndexedSeq(a, b) : null;
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.array_seq = function() {
  var a = null, b = function(a) {
    return cljs.core.prim_seq.call(null, a, 0);
  }, c = function(a, b) {
    return cljs.core.prim_seq.call(null, a, b);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.RSeq = function(a, b, c) {
  this.ci = a;
  this.i = b;
  this.meta = c;
  this.cljs$lang$protocol_mask$partition0$ = 32374990;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.RSeq.cljs$lang$type = !0;
cljs.core.RSeq.cljs$lang$ctorStr = "cljs.core/RSeq";
cljs.core.RSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/RSeq");
};
cljs.core.RSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.RSeq.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.RSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.RSeq.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.RSeq(this.ci, this.i, this.meta);
};
cljs.core.RSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return 0 < this.i ? new cljs.core.RSeq(this.ci, this.i - 1, null) : null;
};
cljs.core.RSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.i + 1;
};
cljs.core.RSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.RSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.RSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.RSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.RSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core._nth.call(null, this.ci, this.i);
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return 0 < this.i ? new cljs.core.RSeq(this.ci, this.i - 1, null) : cljs.core.List.EMPTY;
};
cljs.core.RSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.RSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.RSeq(this.ci, this.i, b);
};
cljs.core.RSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.__GT_RSeq = function(a, b, c) {
  return new cljs.core.RSeq(a, b, c);
};
cljs.core.second = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a));
};
cljs.core.ffirst = function(a) {
  return cljs.core.first.call(null, cljs.core.first.call(null, a));
};
cljs.core.nfirst = function(a) {
  return cljs.core.next.call(null, cljs.core.first.call(null, a));
};
cljs.core.fnext = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a));
};
cljs.core.nnext = function(a) {
  return cljs.core.next.call(null, cljs.core.next.call(null, a));
};
cljs.core.last = function(a) {
  for (;;) {
    var b = cljs.core.next.call(null, a);
    if (null != b) {
      a = b;
    } else {
      return cljs.core.first.call(null, a);
    }
  }
};
cljs.core.IEquiv._ = !0;
cljs.core._equiv._ = function(a, b) {
  return a === b;
};
cljs.core.conj = function() {
  var a = null, b = function() {
    return cljs.core.PersistentVector.EMPTY;
  }, c = function(a, b) {
    return null != a ? cljs.core._conj.call(null, a, b) : cljs.core._conj.call(null, cljs.core.List.EMPTY, b);
  }, d = function() {
    var b = function(b, c, d) {
      for (;;) {
        if (cljs.core.truth_(d)) {
          b = a.call(null, b, c), c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d);
        } else {
          return a.call(null, b, c);
        }
      }
    }, c = function(a, c, d) {
      var f = null;
      2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, f);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, f, g) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a;
      case 2:
        return c.call(this, a, f);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, f, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.empty = function(a) {
  return null == a ? null : cljs.core._empty.call(null, a);
};
cljs.core.accumulating_seq_count = function(a) {
  a = cljs.core.seq.call(null, a);
  for (var b = 0;;) {
    if (cljs.core.counted_QMARK_.call(null, a)) {
      return b + cljs.core._count.call(null, a);
    }
    a = cljs.core.next.call(null, a);
    b += 1;
  }
};
cljs.core.count = function(a) {
  return null != a ? a && (a.cljs$lang$protocol_mask$partition0$ & 2 || a.cljs$core$ICounted$) ? cljs.core._count.call(null, a) : a instanceof Array ? a.length : "string" === typeof a ? a.length : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICounted, a) ? cljs.core._count.call(null, a) : cljs.core.accumulating_seq_count.call(null, a) : 0;
};
cljs.core.linear_traversal_nth = function() {
  var a = null, b = function(a, b) {
    for (;;) {
      if (null == a) {
        throw Error("Index out of bounds");
      }
      if (0 === b) {
        if (cljs.core.seq.call(null, a)) {
          return cljs.core.first.call(null, a);
        }
        throw Error("Index out of bounds");
      }
      if (cljs.core.indexed_QMARK_.call(null, a)) {
        return cljs.core._nth.call(null, a, b);
      }
      if (cljs.core.seq.call(null, a)) {
        var c = cljs.core.next.call(null, a), g = b - 1;
        a = c;
        b = g;
      } else {
        throw Error("Index out of bounds");
      }
    }
  }, c = function(a, b, c) {
    for (;;) {
      if (null == a) {
        return c;
      }
      if (0 === b) {
        return cljs.core.seq.call(null, a) ? cljs.core.first.call(null, a) : c;
      }
      if (cljs.core.indexed_QMARK_.call(null, a)) {
        return cljs.core._nth.call(null, a, b, c);
      }
      if (cljs.core.seq.call(null, a)) {
        a = cljs.core.next.call(null, a), b -= 1;
      } else {
        return c;
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.nth = function() {
  var a = null, b = function(a, b) {
    if ("number" !== typeof b) {
      throw Error("index argument to nth must be a number");
    }
    if (null == a) {
      return a;
    }
    if (a && (a.cljs$lang$protocol_mask$partition0$ & 16 || a.cljs$core$IIndexed$)) {
      return cljs.core._nth.call(null, a, b);
    }
    if (a instanceof Array || "string" === typeof a) {
      return b < a.length ? a[b] : null;
    }
    if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIndexed, a)) {
      return cljs.core._nth.call(null, a, b);
    }
    if (a ? a.cljs$lang$protocol_mask$partition0$ & 64 || a.cljs$core$ISeq$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, a)) {
      return cljs.core.linear_traversal_nth.call(null, a, b);
    }
    throw Error("nth not supported on this type " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.type__GT_str.call(null, cljs.core.type.call(null, a))));
  }, c = function(a, b, c) {
    if ("number" !== typeof b) {
      throw Error("index argument to nth must be a number.");
    }
    if (null == a) {
      return c;
    }
    if (a && (a.cljs$lang$protocol_mask$partition0$ & 16 || a.cljs$core$IIndexed$)) {
      return cljs.core._nth.call(null, a, b, c);
    }
    if (a instanceof Array || "string" === typeof a) {
      return b < a.length ? a[b] : c;
    }
    if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIndexed, a)) {
      return cljs.core._nth.call(null, a, b);
    }
    if (a ? a.cljs$lang$protocol_mask$partition0$ & 64 || a.cljs$core$ISeq$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, a)) {
      return cljs.core.linear_traversal_nth.call(null, a, b, c);
    }
    throw Error("nth not supported on this type " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.type__GT_str.call(null, cljs.core.type.call(null, a))));
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.get = function() {
  var a = null, b = function(a, b) {
    return null == a ? null : a && (a.cljs$lang$protocol_mask$partition0$ & 256 || a.cljs$core$ILookup$) ? cljs.core._lookup.call(null, a, b) : a instanceof Array ? b < a.length ? a[b] : null : "string" === typeof a ? b < a.length ? a[b] : null : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ILookup, a) ? cljs.core._lookup.call(null, a, b) : null;
  }, c = function(a, b, c) {
    return null != a ? a && (a.cljs$lang$protocol_mask$partition0$ & 256 || a.cljs$core$ILookup$) ? cljs.core._lookup.call(null, a, b, c) : a instanceof Array ? b < a.length ? a[b] : c : "string" === typeof a ? b < a.length ? a[b] : c : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ILookup, a) ? cljs.core._lookup.call(null, a, b, c) : c : c;
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.assoc = function() {
  var a = null, b = function(a, b, c) {
    return null != a ? cljs.core._assoc.call(null, a, b, c) : cljs.core.PersistentHashMap.fromArrays([b], [c]);
  }, c = function() {
    var b = function(b, c, d, e) {
      for (;;) {
        if (b = a.call(null, b, c, d), cljs.core.truth_(e)) {
          c = cljs.core.first.call(null, e), d = cljs.core.second.call(null, e), e = cljs.core.nnext.call(null, e);
        } else {
          return b;
        }
      }
    }, c = function(a, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, l);
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var k = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, k, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.dissoc = function() {
  var a = null, b = function(a, b) {
    return null == a ? null : cljs.core._dissoc.call(null, a, b);
  }, c = function() {
    var b = function(b, c, d) {
      for (;;) {
        if (null == b) {
          return null;
        }
        b = a.call(null, b, c);
        if (cljs.core.truth_(d)) {
          c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d);
        } else {
          return b;
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.fn_QMARK_ = function(a) {
  var b = goog.isFunction(a);
  return b ? b : a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$Fn$) ? !0 : a.cljs$lang$protocol_mask$partition$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.Fn, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.Fn, a);
};
cljs.core.MetaFn = function(a, b) {
  this.afn = a;
  this.meta = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 393217;
};
cljs.core.MetaFn.cljs$lang$type = !0;
cljs.core.MetaFn.cljs$lang$ctorStr = "cljs.core/MetaFn";
cljs.core.MetaFn.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/MetaFn");
};
cljs.core.MetaFn.prototype.call = function() {
  var a = null, b = function(a) {
    return this.afn.call(null);
  }, c = function(a, b) {
    return this.afn.call(null, b);
  }, d = function(a, b, c) {
    return this.afn.call(null, b, c);
  }, e = function(a, b, c, d) {
    return this.afn.call(null, b, c, d);
  }, f = function(a, b, c, d, e) {
    return this.afn.call(null, b, c, d, e);
  }, g = function(a, b, c, d, e, f) {
    return this.afn.call(null, b, c, d, e, f);
  }, h = function(a, b, c, d, e, f, g) {
    return this.afn.call(null, b, c, d, e, f, g);
  }, k = function(a, b, c, d, e, f, g, h) {
    return this.afn.call(null, b, c, d, e, f, g, h);
  }, l = function(a, b, c, d, e, f, g, h, k) {
    return this.afn.call(null, b, c, d, e, f, g, h, k);
  }, m = function(a, b, c, d, e, f, g, h, k, l) {
    return this.afn.call(null, b, c, d, e, f, g, h, k, l);
  }, n = function(a, b, c, d, e, f, g, h, k, l, m) {
    return this.afn.call(null, b, c, d, e, f, g, h, k, l, m);
  }, p = function(a, b, c, d, e, f, g, h, k, l, m, q) {
    return this.afn.call(null, b, c, d, e, f, g, h, k, l, m, q);
  }, q = function(a, b, c, d, e, f, g, h, k, l, m, q, r) {
    return this.afn.call(null, b, c, d, e, f, g, h, k, l, m, q, r);
  }, r = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n) {
    return this.afn.call(null, b, c, d, e, f, g, h, k, l, m, q, r, n);
  }, s = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p) {
    return this.afn.call(null, b, c, d, e, f, g, h, k, l, m, q, r, n, p);
  }, t = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s) {
    return this.afn.call(null, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s);
  }, u = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t) {
    return this.afn.call(null, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t);
  }, v = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u) {
    return this.afn.call(null, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u);
  }, x = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v) {
    return this.afn.call(null, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v);
  }, C = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J) {
    return this.afn.call(null, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J);
  }, I = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J, x) {
    return this.afn.call(null, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J, x);
  }, J = function(a, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J, x, C) {
    return cljs.core.apply.call(null, this.afn, b, c, d, e, f, g, h, k, l, m, q, r, n, p, s, t, u, v, J, x, C);
  }, a = function(a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S, T, V, U) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, w);
      case 3:
        return d.call(this, a, w, y);
      case 4:
        return e.call(this, a, w, y, z);
      case 5:
        return f.call(this, a, w, y, z, A);
      case 6:
        return g.call(this, a, w, y, z, A, B);
      case 7:
        return h.call(this, a, w, y, z, A, B, D);
      case 8:
        return k.call(this, a, w, y, z, A, B, D, E);
      case 9:
        return l.call(this, a, w, y, z, A, B, D, E, F);
      case 10:
        return m.call(this, a, w, y, z, A, B, D, E, F, G);
      case 11:
        return n.call(this, a, w, y, z, A, B, D, E, F, G, H);
      case 12:
        return p.call(this, a, w, y, z, A, B, D, E, F, G, H, K);
      case 13:
        return q.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L);
      case 14:
        return r.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M);
      case 15:
        return s.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N);
      case 16:
        return t.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O);
      case 17:
        return u.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q);
      case 18:
        return v.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R);
      case 19:
        return x.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S);
      case 20:
        return C.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S, T);
      case 21:
        return I.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S, T, V);
      case 22:
        return J.call(this, a, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S, T, V, U);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$4 = e;
  a.cljs$core$IFn$_invoke$arity$5 = f;
  a.cljs$core$IFn$_invoke$arity$6 = g;
  a.cljs$core$IFn$_invoke$arity$7 = h;
  a.cljs$core$IFn$_invoke$arity$8 = k;
  a.cljs$core$IFn$_invoke$arity$9 = l;
  a.cljs$core$IFn$_invoke$arity$10 = m;
  a.cljs$core$IFn$_invoke$arity$11 = n;
  a.cljs$core$IFn$_invoke$arity$12 = p;
  a.cljs$core$IFn$_invoke$arity$13 = q;
  a.cljs$core$IFn$_invoke$arity$14 = r;
  a.cljs$core$IFn$_invoke$arity$15 = s;
  a.cljs$core$IFn$_invoke$arity$16 = t;
  a.cljs$core$IFn$_invoke$arity$17 = u;
  a.cljs$core$IFn$_invoke$arity$18 = v;
  a.cljs$core$IFn$_invoke$arity$19 = x;
  a.cljs$core$IFn$_invoke$arity$20 = C;
  a.cljs$core$IFn$_invoke$arity$21 = I;
  a.cljs$core$IFn$_invoke$arity$22 = J;
  return a;
}();
cljs.core.MetaFn.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$0 = function() {
  return this.afn.call(null);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.afn.call(null, a);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.afn.call(null, a, b);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$3 = function(a, b, c) {
  return this.afn.call(null, a, b, c);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$4 = function(a, b, c, d) {
  return this.afn.call(null, a, b, c, d);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$5 = function(a, b, c, d, e) {
  return this.afn.call(null, a, b, c, d, e);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$6 = function(a, b, c, d, e, f) {
  return this.afn.call(null, a, b, c, d, e, f);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$7 = function(a, b, c, d, e, f, g) {
  return this.afn.call(null, a, b, c, d, e, f, g);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$8 = function(a, b, c, d, e, f, g, h) {
  return this.afn.call(null, a, b, c, d, e, f, g, h);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$9 = function(a, b, c, d, e, f, g, h, k) {
  return this.afn.call(null, a, b, c, d, e, f, g, h, k);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$10 = function(a, b, c, d, e, f, g, h, k, l) {
  return this.afn.call(null, a, b, c, d, e, f, g, h, k, l);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$11 = function(a, b, c, d, e, f, g, h, k, l, m) {
  return this.afn.call(null, a, b, c, d, e, f, g, h, k, l, m);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$12 = function(a, b, c, d, e, f, g, h, k, l, m, n) {
  return this.afn.call(null, a, b, c, d, e, f, g, h, k, l, m, n);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$13 = function(a, b, c, d, e, f, g, h, k, l, m, n, p) {
  return this.afn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$14 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q) {
  return this.afn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$15 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r) {
  return this.afn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$16 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s) {
  return this.afn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$17 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t) {
  return this.afn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$18 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u) {
  return this.afn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$19 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v) {
  return this.afn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$20 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x) {
  return this.afn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$21 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x, C) {
  return cljs.core.apply.call(null, this.afn, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x, C);
};
cljs.core.MetaFn.prototype.cljs$core$Fn$ = !0;
cljs.core.MetaFn.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.MetaFn(this.afn, b);
};
cljs.core.MetaFn.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.__GT_MetaFn = function(a, b) {
  return new cljs.core.MetaFn(a, b);
};
cljs.core.with_meta = function(a, b) {
  var c;
  if (c = cljs.core.fn_QMARK_.call(null, a)) {
    c = !(a ? a.cljs$lang$protocol_mask$partition0$ & 262144 || a.cljs$core$IWithMeta$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IWithMeta, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IWithMeta, a));
  }
  return c ? new cljs.core.MetaFn(a, b) : null == a ? null : cljs.core._with_meta.call(null, a, b);
};
cljs.core.meta = function(a) {
  var b;
  b = (b = null != a) ? a ? a.cljs$lang$protocol_mask$partition0$ & 131072 || a.cljs$core$IMeta$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMeta, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMeta, a) : b;
  return b ? cljs.core._meta.call(null, a) : null;
};
cljs.core.peek = function(a) {
  return null == a ? null : cljs.core._peek.call(null, a);
};
cljs.core.pop = function(a) {
  return null == a ? null : cljs.core._pop.call(null, a);
};
cljs.core.disj = function() {
  var a = null, b = function(a, b) {
    return null == a ? null : cljs.core._disjoin.call(null, a, b);
  }, c = function() {
    var b = function(b, c, d) {
      for (;;) {
        if (null == b) {
          return null;
        }
        b = a.call(null, b, c);
        if (cljs.core.truth_(d)) {
          c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d);
        } else {
          return b;
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.empty_QMARK_ = function(a) {
  return null == a || cljs.core.not.call(null, cljs.core.seq.call(null, a));
};
cljs.core.coll_QMARK_ = function(a) {
  return null == a ? !1 : a ? a.cljs$lang$protocol_mask$partition0$ & 8 || a.cljs$core$ICollection$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICollection, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICollection, a);
};
cljs.core.set_QMARK_ = function(a) {
  return null == a ? !1 : a ? a.cljs$lang$protocol_mask$partition0$ & 4096 || a.cljs$core$ISet$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISet, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISet, a);
};
cljs.core.associative_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 512 || a.cljs$core$IAssociative$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IAssociative, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IAssociative, a);
};
cljs.core.sequential_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 16777216 || a.cljs$core$ISequential$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISequential, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISequential, a);
};
cljs.core.sorted_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 268435456 || a.cljs$core$ISorted$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISorted, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISorted, a);
};
cljs.core.reduceable_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 524288 || a.cljs$core$IReduce$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReduce, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReduce, a);
};
cljs.core.map_QMARK_ = function(a) {
  return null == a ? !1 : a ? a.cljs$lang$protocol_mask$partition0$ & 1024 || a.cljs$core$IMap$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMap, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMap, a);
};
cljs.core.vector_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 16384 || a.cljs$core$IVector$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IVector, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IVector, a);
};
cljs.core.chunked_seq_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition1$ & 512 || a.cljs$core$IChunkedSeq$ ? !0 : !1 : !1;
};
cljs.core.js_obj = function() {
  var a = null, b = function() {
    var a = function(a) {
      return cljs.core.apply.call(null, goog.object.create, a);
    }, b = function(b) {
      var d = null;
      0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return a.call(this, d);
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      b = cljs.core.seq(b);
      return a(b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a) {
    switch(arguments.length) {
      case 0:
        return{};
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(arguments, 0));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 0;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return{};
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.js_keys = function(a) {
  var b = [];
  goog.object.forEach(a, function(a) {
    return function(b, e, f) {
      return a.push(e);
    };
  }(b));
  return b;
};
cljs.core.js_delete = function(a, b) {
  return delete a[b];
};
cljs.core.array_copy = function(a, b, c, d, e) {
  for (;;) {
    if (0 === e) {
      return c;
    }
    c[d] = a[b];
    d += 1;
    e -= 1;
    b += 1;
  }
};
cljs.core.array_copy_downward = function(a, b, c, d, e) {
  b += e - 1;
  for (d += e - 1;;) {
    if (0 === e) {
      return c;
    }
    c[d] = a[b];
    d -= 1;
    e -= 1;
    b -= 1;
  }
};
cljs.core.lookup_sentinel = function() {
  return{};
}();
cljs.core.false_QMARK_ = function(a) {
  return!1 === a;
};
cljs.core.true_QMARK_ = function(a) {
  return!0 === a;
};
cljs.core.undefined_QMARK_ = function(a) {
  return void 0 === a;
};
cljs.core.seq_QMARK_ = function(a) {
  return null == a ? !1 : a ? a.cljs$lang$protocol_mask$partition0$ & 64 || a.cljs$core$ISeq$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, a);
};
cljs.core.seqable_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 8388608 || a.cljs$core$ISeqable$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeqable, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeqable, a);
};
cljs.core.boolean$ = function(a) {
  return cljs.core.truth_(a) ? !0 : !1;
};
cljs.core.ifn_QMARK_ = function(a) {
  var b = cljs.core.fn_QMARK_.call(null, a);
  return b ? b : a ? a.cljs$lang$protocol_mask$partition0$ & 1 || a.cljs$core$IFn$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IFn, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IFn, a);
};
cljs.core.integer_QMARK_ = function(a) {
  return "number" === typeof a && !isNaN(a) && Infinity !== a && parseFloat(a) === parseInt(a, 10);
};
cljs.core.contains_QMARK_ = function(a, b) {
  return cljs.core.get.call(null, a, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? !1 : !0;
};
cljs.core.find = function(a, b) {
  return null != a && cljs.core.associative_QMARK_.call(null, a) && cljs.core.contains_QMARK_.call(null, a, b) ? new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [b, cljs.core.get.call(null, a, b)], null) : null;
};
cljs.core.distinct_QMARK_ = function() {
  var a = null, b = function(a, b) {
    return!cljs.core._EQ_.call(null, a, b);
  }, c = function() {
    var a = function(a, b, c) {
      if (cljs.core._EQ_.call(null, a, b)) {
        return!1;
      }
      a = cljs.core.PersistentHashSet.fromArray([a, b], !0);
      for (b = c;;) {
        var d = cljs.core.first.call(null, b);
        c = cljs.core.next.call(null, b);
        if (cljs.core.truth_(b)) {
          if (cljs.core.contains_QMARK_.call(null, a, d)) {
            return!1;
          }
          a = cljs.core.conj.call(null, a, d);
          b = c;
        } else {
          return!0;
        }
      }
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.sequence = function(a) {
  return cljs.core.seq_QMARK_.call(null, a) ? a : (a = cljs.core.seq.call(null, a)) ? a : cljs.core.List.EMPTY;
};
cljs.core.compare = function(a, b) {
  if (a === b) {
    return 0;
  }
  if (null == a) {
    return-1;
  }
  if (null == b) {
    return 1;
  }
  if (cljs.core.type.call(null, a) === cljs.core.type.call(null, b)) {
    return a && (a.cljs$lang$protocol_mask$partition1$ & 2048 || a.cljs$core$IComparable$) ? cljs.core._compare.call(null, a, b) : goog.array.defaultCompare(a, b);
  }
  throw Error("compare on non-nil objects of different types");
};
cljs.core.compare_indexed = function() {
  var a = null, b = function(b, c) {
    var f = cljs.core.count.call(null, b), g = cljs.core.count.call(null, c);
    return f < g ? -1 : f > g ? 1 : a.call(null, b, c, f, 0);
  }, c = function(a, b, c, g) {
    for (;;) {
      var h = cljs.core.compare.call(null, cljs.core.nth.call(null, a, g), cljs.core.nth.call(null, b, g));
      if (0 === h && g + 1 < c) {
        g += 1;
      } else {
        return h;
      }
    }
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 4:
        return c.call(this, a, e, f, g);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a;
}();
cljs.core.fn__GT_comparator = function(a) {
  return cljs.core._EQ_.call(null, a, cljs.core.compare) ? cljs.core.compare : function(b, c) {
    var d = a.call(null, b, c);
    return "number" === typeof d ? d : cljs.core.truth_(d) ? -1 : cljs.core.truth_(a.call(null, c, b)) ? 1 : 0;
  };
};
cljs.core.sort = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.compare, b);
  }, c = function(a, b) {
    if (cljs.core.seq.call(null, b)) {
      var c = cljs.core.to_array.call(null, b);
      goog.array.stableSort(c, cljs.core.fn__GT_comparator.call(null, a));
      return cljs.core.seq.call(null, c);
    }
    return cljs.core.List.EMPTY;
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.sort_by = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, cljs.core.compare, c);
  }, c = function(a, b, c) {
    return cljs.core.sort.call(null, function(c, f) {
      return cljs.core.fn__GT_comparator.call(null, b).call(null, a.call(null, c), a.call(null, f));
    }, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.seq_reduce = function() {
  var a = null, b = function(a, b) {
    var c = cljs.core.seq.call(null, b);
    return c ? cljs.core.reduce.call(null, a, cljs.core.first.call(null, c), cljs.core.next.call(null, c)) : a.call(null);
  }, c = function(a, b, c) {
    for (c = cljs.core.seq.call(null, c);;) {
      if (c) {
        b = a.call(null, b, cljs.core.first.call(null, c));
        if (cljs.core.reduced_QMARK_.call(null, b)) {
          return cljs.core.deref.call(null, b);
        }
        c = cljs.core.next.call(null, c);
      } else {
        return b;
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.shuffle = function(a) {
  a = cljs.core.to_array.call(null, a);
  goog.array.shuffle(a);
  return cljs.core.vec.call(null, a);
};
cljs.core.reduce = function() {
  var a = null, b = function(a, b) {
    return b && (b.cljs$lang$protocol_mask$partition0$ & 524288 || b.cljs$core$IReduce$) ? cljs.core._reduce.call(null, b, a) : b instanceof Array ? cljs.core.array_reduce.call(null, b, a) : "string" === typeof b ? cljs.core.array_reduce.call(null, b, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReduce, b) ? cljs.core._reduce.call(null, b, a) : cljs.core.seq_reduce.call(null, a, b);
  }, c = function(a, b, c) {
    return c && (c.cljs$lang$protocol_mask$partition0$ & 524288 || c.cljs$core$IReduce$) ? cljs.core._reduce.call(null, c, a, b) : c instanceof Array ? cljs.core.array_reduce.call(null, c, a, b) : "string" === typeof c ? cljs.core.array_reduce.call(null, c, a, b) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReduce, c) ? cljs.core._reduce.call(null, c, a, b) : cljs.core.seq_reduce.call(null, a, b, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.reduce_kv = function(a, b, c) {
  return null != c ? cljs.core._kv_reduce.call(null, c, a, b) : b;
};
cljs.core.identity = function(a) {
  return a;
};
cljs.core.completing = function() {
  var a = null, b = function(b) {
    return a.call(null, b, cljs.core.identity);
  }, c = function(a, b) {
    return function() {
      var c = null, g = function() {
        return a.call(null);
      }, h = function(a) {
        return b.call(null, a);
      }, k = function(b, c) {
        return a.call(null, b, c);
      }, c = function(a, b) {
        switch(arguments.length) {
          case 0:
            return g.call(this);
          case 1:
            return h.call(this, a);
          case 2:
            return k.call(this, a, b);
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$core$IFn$_invoke$arity$0 = g;
      c.cljs$core$IFn$_invoke$arity$1 = h;
      c.cljs$core$IFn$_invoke$arity$2 = k;
      return c;
    }();
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.transduce = function() {
  var a = null, b = function(b, c, f) {
    return a.call(null, b, c, c.call(null), f);
  }, c = function(a, b, c, g) {
    a = a.call(null, b);
    c = cljs.core.reduce.call(null, a, c, g);
    return a.call(null, c);
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 4:
        return c.call(this, a, e, f, g);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a;
}();
cljs.core._PLUS_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b + c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0;
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b - c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._STAR_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b * c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1;
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._SLASH_ = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b);
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, a.call(null, b, c), d);
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return a / e;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a / b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._LT_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a < b) {
          if (cljs.core.next.call(null, c)) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
          } else {
            return b < cljs.core.first.call(null, c);
          }
        } else {
          return!1;
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a < d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a < b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._LT__EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a <= b) {
          if (cljs.core.next.call(null, c)) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
          } else {
            return b <= cljs.core.first.call(null, c);
          }
        } else {
          return!1;
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a <= d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a <= b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._GT_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a > b) {
          if (cljs.core.next.call(null, c)) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
          } else {
            return b > cljs.core.first.call(null, c);
          }
        } else {
          return!1;
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a > d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a > b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._GT__EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a >= b) {
          if (cljs.core.next.call(null, c)) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
          } else {
            return b >= cljs.core.first.call(null, c);
          }
        } else {
          return!1;
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a >= d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a >= b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.dec = function(a) {
  return a - 1;
};
cljs.core.max = function() {
  var a = null, b = function(a, b) {
    return a > b ? a : b;
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b > c ? b : c, d);
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.min = function() {
  var a = null, b = function(a, b) {
    return a < b ? a : b;
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b < c ? b : c, d);
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.byte$ = function(a) {
  return a;
};
cljs.core.char$ = function(a) {
  if ("number" === typeof a) {
    return String.fromCharCode(a);
  }
  if ("string" === typeof a && 1 === a.length) {
    return a;
  }
  throw Error("Argument to char must be a character or number");
};
cljs.core.short$ = function(a) {
  return a;
};
cljs.core.float$ = function(a) {
  return a;
};
cljs.core.double$ = function(a) {
  return a;
};
cljs.core.unchecked_byte = function(a) {
  return a;
};
cljs.core.unchecked_char = function(a) {
  return a;
};
cljs.core.unchecked_short = function(a) {
  return a;
};
cljs.core.unchecked_float = function(a) {
  return a;
};
cljs.core.unchecked_double = function(a) {
  return a;
};
cljs.core.unchecked_add = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b + c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0;
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.unchecked_add_int = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b + c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0;
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.unchecked_dec = function(a) {
  return a - 1;
};
cljs.core.unchecked_dec_int = function(a) {
  return a - 1;
};
cljs.core.unchecked_divide_int = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b);
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, a.call(null, b, c), d);
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return a / e;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a / b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.unchecked_inc = function(a) {
  return a + 1;
};
cljs.core.unchecked_inc_int = function(a) {
  return a + 1;
};
cljs.core.unchecked_multiply = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b * c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1;
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.unchecked_multiply_int = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b * c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1;
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.unchecked_negate = function(a) {
  return-a;
};
cljs.core.unchecked_negate_int = function(a) {
  return-a;
};
cljs.core.unchecked_remainder_int = function(a, b) {
  return cljs.core.mod.call(null, a, b);
};
cljs.core.unchecked_subtract = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b - c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.unchecked_subtract_int = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b - c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.fix = function(a) {
  return 0 <= a ? Math.floor.call(null, a) : Math.ceil.call(null, a);
};
cljs.core.int$ = function(a) {
  return a | 0;
};
cljs.core.unchecked_int = function(a) {
  return cljs.core.fix.call(null, a);
};
cljs.core.long$ = function(a) {
  return cljs.core.fix.call(null, a);
};
cljs.core.unchecked_long = function(a) {
  return cljs.core.fix.call(null, a);
};
cljs.core.booleans = function(a) {
  return a;
};
cljs.core.bytes = function(a) {
  return a;
};
cljs.core.chars = function(a) {
  return a;
};
cljs.core.shorts = function(a) {
  return a;
};
cljs.core.ints = function(a) {
  return a;
};
cljs.core.floats = function(a) {
  return a;
};
cljs.core.doubles = function(a) {
  return a;
};
cljs.core.longs = function(a) {
  return a;
};
cljs.core.js_mod = function(a, b) {
  return a % b;
};
cljs.core.mod = function(a, b) {
  return(a % b + b) % b;
};
cljs.core.quot = function(a, b) {
  return cljs.core.fix.call(null, (a - a % b) / b);
};
cljs.core.rem = function(a, b) {
  var c = cljs.core.quot.call(null, a, b);
  return a - b * c;
};
cljs.core.rand = function() {
  var a = null, b = function() {
    return Math.random.call(null);
  }, c = function(b) {
    return b * a.call(null);
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a;
}();
cljs.core.rand_int = function(a) {
  return cljs.core.fix.call(null, cljs.core.rand.call(null, a));
};
cljs.core.bit_xor = function(a, b) {
  return a ^ b;
};
cljs.core.bit_and = function(a, b) {
  return a & b;
};
cljs.core.bit_or = function(a, b) {
  return a | b;
};
cljs.core.bit_and_not = function(a, b) {
  return a & ~b;
};
cljs.core.bit_clear = function(a, b) {
  return a & ~(1 << b);
};
cljs.core.bit_flip = function(a, b) {
  return a ^ 1 << b;
};
cljs.core.bit_not = function(a) {
  return~a;
};
cljs.core.bit_set = function(a, b) {
  return a | 1 << b;
};
cljs.core.bit_test = function(a, b) {
  return 0 != (a & 1 << b);
};
cljs.core.bit_shift_left = function(a, b) {
  return a << b;
};
cljs.core.bit_shift_right = function(a, b) {
  return a >> b;
};
cljs.core.bit_shift_right_zero_fill = function(a, b) {
  return a >>> b;
};
cljs.core.unsigned_bit_shift_right = function(a, b) {
  return a >>> b;
};
cljs.core.bit_count = function(a) {
  a -= a >> 1 & 1431655765;
  a = (a & 858993459) + (a >> 2 & 858993459);
  return 16843009 * (a + (a >> 4) & 252645135) >> 24;
};
cljs.core._EQ__EQ_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core._equiv.call(null, a, b);
  }, c = function() {
    var b = function(b, c, d) {
      for (;;) {
        if (a.call(null, b, c)) {
          if (cljs.core.next.call(null, d)) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d);
          } else {
            return a.call(null, c, cljs.core.first.call(null, d));
          }
        } else {
          return!1;
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.pos_QMARK_ = function(a) {
  return 0 < a;
};
cljs.core.zero_QMARK_ = function(a) {
  return 0 === a;
};
cljs.core.neg_QMARK_ = function(a) {
  return 0 > a;
};
cljs.core.nthnext = function(a, b) {
  for (var c = b, d = cljs.core.seq.call(null, a);;) {
    if (d && 0 < c) {
      c -= 1, d = cljs.core.next.call(null, d);
    } else {
      return d;
    }
  }
};
cljs.core.str = function() {
  var a = null, b = function(a) {
    return null == a ? "" : "" + a;
  }, c = function() {
    var b = function(b, c) {
      for (var d = new goog.string.StringBuffer(a.call(null, b)), e = c;;) {
        if (cljs.core.truth_(e)) {
          d = d.append(a.call(null, cljs.core.first.call(null, e))), e = cljs.core.next.call(null, e);
        } else {
          return d.toString();
        }
      }
    }, c = function(a, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, e);
    };
    c.cljs$lang$maxFixedArity = 1;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 0:
        return "";
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return "";
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.subs = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return a.substring(c);
      case 3:
        return a.substring(c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return a.substring(c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return a.substring(c, d);
  };
  return a;
}();
cljs.core.equiv_sequential = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.sequential_QMARK_.call(null, b) ? cljs.core.counted_QMARK_.call(null, a) && cljs.core.counted_QMARK_.call(null, b) && cljs.core.count.call(null, a) !== cljs.core.count.call(null, b) ? !1 : function() {
    for (var c = cljs.core.seq.call(null, a), d = cljs.core.seq.call(null, b);;) {
      if (null == c) {
        return null == d;
      }
      if (null != d && cljs.core._EQ_.call(null, cljs.core.first.call(null, c), cljs.core.first.call(null, d))) {
        c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d);
      } else {
        return!1;
      }
    }
  }() : null);
};
cljs.core.hash_coll = function(a) {
  if (cljs.core.seq.call(null, a)) {
    var b = cljs.core.hash.call(null, cljs.core.first.call(null, a));
    for (a = cljs.core.next.call(null, a);;) {
      if (null == a) {
        return b;
      }
      b = cljs.core.hash_combine.call(null, b, cljs.core.hash.call(null, cljs.core.first.call(null, a)));
      a = cljs.core.next.call(null, a);
    }
  } else {
    return 0;
  }
};
cljs.core.hash_imap = function(a) {
  var b = 0;
  for (a = cljs.core.seq.call(null, a);;) {
    if (a) {
      var c = cljs.core.first.call(null, a), b = (b + (cljs.core.hash.call(null, cljs.core.key.call(null, c)) ^ cljs.core.hash.call(null, cljs.core.val.call(null, c)))) % 4503599627370496;
      a = cljs.core.next.call(null, a);
    } else {
      return b;
    }
  }
};
cljs.core.hash_iset = function(a) {
  var b = 0;
  for (a = cljs.core.seq.call(null, a);;) {
    if (a) {
      var c = cljs.core.first.call(null, a), b = (b + cljs.core.hash.call(null, c)) % 4503599627370496;
      a = cljs.core.next.call(null, a);
    } else {
      return b;
    }
  }
};
cljs.core.extend_object_BANG_ = function(a, b) {
  for (var c = cljs.core.seq.call(null, b), d = null, e = 0, f = 0;;) {
    if (f < e) {
      var g = cljs.core._nth.call(null, d, f), h = cljs.core.nth.call(null, g, 0, null), g = cljs.core.nth.call(null, g, 1, null), h = cljs.core.name.call(null, h);
      a[h] = g;
      f += 1;
    } else {
      if (c = cljs.core.seq.call(null, c)) {
        cljs.core.chunked_seq_QMARK_.call(null, c) ? (e = cljs.core.chunk_first.call(null, c), c = cljs.core.chunk_rest.call(null, c), d = e, e = cljs.core.count.call(null, e)) : (e = cljs.core.first.call(null, c), d = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null), d = cljs.core.name.call(null, d), a[d] = e, c = cljs.core.next.call(null, c), d = null, e = 0), f = 0;
      } else {
        break;
      }
    }
  }
  return a;
};
cljs.core.List = function(a, b, c, d, e) {
  this.meta = a;
  this.first = b;
  this.rest = c;
  this.count = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition0$ = 65937646;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.List.cljs$lang$type = !0;
cljs.core.List.cljs$lang$ctorStr = "cljs.core/List";
cljs.core.List.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/List");
};
cljs.core.List.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.List.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.List.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.List.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.List(this.meta, this.first, this.rest, this.count, this.__hash);
};
cljs.core.List.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return 1 === this.count ? null : this.rest;
};
cljs.core.List.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.count;
};
cljs.core.List.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return this.first;
};
cljs.core.List.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return cljs.core._rest.call(null, this);
};
cljs.core.List.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.List.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.List.EMPTY;
};
cljs.core.List.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.List.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.List.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.first;
};
cljs.core.List.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return 1 === this.count ? cljs.core.List.EMPTY : this.rest;
};
cljs.core.List.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.List(b, this.first, this.rest, this.count, this.__hash);
};
cljs.core.List.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.List(this.meta, b, this, this.count + 1, null);
};
cljs.core.__GT_List = function(a, b, c, d, e) {
  return new cljs.core.List(a, b, c, d, e);
};
cljs.core.EmptyList = function(a) {
  this.meta = a;
  this.cljs$lang$protocol_mask$partition0$ = 65937614;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.EmptyList.cljs$lang$type = !0;
cljs.core.EmptyList.cljs$lang$ctorStr = "cljs.core/EmptyList";
cljs.core.EmptyList.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/EmptyList");
};
cljs.core.EmptyList.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.EmptyList.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.EmptyList.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.EmptyList(this.meta);
};
cljs.core.EmptyList.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return null;
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 0;
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return null;
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  throw Error("Can't pop empty list");
};
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return 0;
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return this;
};
cljs.core.EmptyList.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.EmptyList.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return null;
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.List.EMPTY;
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return null;
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.EmptyList(b);
};
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.List(this.meta, b, null, 1, null);
};
cljs.core.__GT_EmptyList = function(a) {
  return new cljs.core.EmptyList(a);
};
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reversible_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 134217728 || a.cljs$core$IReversible$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReversible, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReversible, a);
};
cljs.core.rseq = function(a) {
  return cljs.core._rseq.call(null, a);
};
cljs.core.reverse = function(a) {
  return cljs.core.reversible_QMARK_.call(null, a) ? cljs.core.rseq.call(null, a) : cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, a);
};
cljs.core.list = function() {
  var a = function(a) {
    var b;
    if (a instanceof cljs.core.IndexedSeq && 0 === a.i) {
      b = a.arr;
    } else {
      a: {
        for (b = [];;) {
          if (null != a) {
            b.push(cljs.core._first.call(null, a)), a = cljs.core._next.call(null, a);
          } else {
            break a;
          }
        }
        b = void 0;
      }
    }
    a = b.length;
    for (var e = cljs.core.List.EMPTY;;) {
      if (0 < a) {
        var f = a - 1, e = cljs.core._conj.call(null, e, b[a - 1]);
        a = f;
      } else {
        return e;
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.Cons = function(a, b, c, d) {
  this.meta = a;
  this.first = b;
  this.rest = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition0$ = 65929452;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.Cons.cljs$lang$type = !0;
cljs.core.Cons.cljs$lang$ctorStr = "cljs.core/Cons";
cljs.core.Cons.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Cons");
};
cljs.core.Cons.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.Cons.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.Cons.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.Cons.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.Cons(this.meta, this.first, this.rest, this.__hash);
};
cljs.core.Cons.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return null == this.rest ? null : cljs.core.seq.call(null, this.rest);
};
cljs.core.Cons.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.Cons.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.Cons.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.Cons.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.first;
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return null == this.rest ? cljs.core.List.EMPTY : this.rest;
};
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Cons(b, this.first, this.rest, this.__hash);
};
cljs.core.Cons.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.Cons(null, b, this, this.__hash);
};
cljs.core.__GT_Cons = function(a, b, c, d) {
  return new cljs.core.Cons(a, b, c, d);
};
cljs.core.cons = function(a, b) {
  var c;
  c = (c = null == b) ? c : b ? b.cljs$lang$protocol_mask$partition0$ & 64 || b.cljs$core$ISeq$ ? !0 : !1 : !1;
  return c ? new cljs.core.Cons(null, a, b, null) : new cljs.core.Cons(null, a, cljs.core.seq.call(null, b), null);
};
cljs.core.list_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 33554432 || a.cljs$core$IList$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IList, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IList, a);
};
cljs.core.hash_keyword = function(a) {
  return cljs.core.hash_symbol.call(null, a) + 2654435769 | 0;
};
cljs.core.Keyword = function(a, b, c, d) {
  this.ns = a;
  this.name = b;
  this.fqn = c;
  this._hash = d;
  this.cljs$lang$protocol_mask$partition0$ = 2153775105;
  this.cljs$lang$protocol_mask$partition1$ = 4096;
};
cljs.core.Keyword.cljs$lang$type = !0;
cljs.core.Keyword.cljs$lang$ctorStr = "cljs.core/Keyword";
cljs.core.Keyword.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Keyword");
};
cljs.core.Keyword.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write.call(null, b, ":" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(this.fqn));
};
cljs.core.Keyword.prototype.cljs$core$INamed$_name$arity$1 = function(a) {
  return this.name;
};
cljs.core.Keyword.prototype.cljs$core$INamed$_namespace$arity$1 = function(a) {
  return this.ns;
};
cljs.core.Keyword.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this._hash;
  return null != a ? a : this._hash = a = cljs.core.hash_keyword.call(null, this);
};
cljs.core.Keyword.prototype.call = function() {
  var a = null, b = function(a, b) {
    return cljs.core.get.call(null, b, this);
  }, c = function(a, b, c) {
    return cljs.core.get.call(null, b, this, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.Keyword.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.Keyword.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return cljs.core.get.call(null, a, this);
};
cljs.core.Keyword.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return cljs.core.get.call(null, a, this, b);
};
cljs.core.Keyword.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return b instanceof cljs.core.Keyword ? this.fqn === b.fqn : !1;
};
cljs.core.Keyword.prototype.toString = function() {
  return ":" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(this.fqn);
};
cljs.core.Keyword.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.__GT_Keyword = function(a, b, c, d) {
  return new cljs.core.Keyword(a, b, c, d);
};
cljs.core.keyword_QMARK_ = function(a) {
  return a instanceof cljs.core.Keyword;
};
cljs.core.keyword_identical_QMARK_ = function(a, b) {
  return a === b ? !0 : a instanceof cljs.core.Keyword && b instanceof cljs.core.Keyword ? a.fqn === b.fqn : !1;
};
cljs.core.namespace = function(a) {
  if (a && (a.cljs$lang$protocol_mask$partition1$ & 4096 || a.cljs$core$INamed$)) {
    return cljs.core._namespace.call(null, a);
  }
  throw Error("Doesn't support namespace: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a));
};
cljs.core.keyword = function() {
  var a = null, b = function(a) {
    if (a instanceof cljs.core.Keyword) {
      return a;
    }
    if (a instanceof cljs.core.Symbol) {
      return new cljs.core.Keyword(cljs.core.namespace.call(null, a), cljs.core.name.call(null, a), a.str, null);
    }
    if ("string" === typeof a) {
      var b = a.split("/");
      return 2 === b.length ? new cljs.core.Keyword(b[0], b[1], a, null) : new cljs.core.Keyword(null, b[0], a, null);
    }
    return null;
  }, c = function(a, b) {
    return new cljs.core.Keyword(a, b, "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.truth_(a) ? "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a) + "/" : null) + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b), null);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.LazySeq = function(a, b, c, d) {
  this.meta = a;
  this.fn = b;
  this.s = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374988;
};
cljs.core.LazySeq.cljs$lang$type = !0;
cljs.core.LazySeq.cljs$lang$ctorStr = "cljs.core/LazySeq";
cljs.core.LazySeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/LazySeq");
};
cljs.core.LazySeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.LazySeq.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.LazySeq.prototype.sval = function() {
  null != this.fn && (this.s = this.fn.call(null), this.fn = null);
  return this.s;
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.LazySeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  cljs.core._seq.call(null, this);
  return null == this.s ? null : cljs.core.next.call(null, this.s);
};
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.LazySeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.LazySeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  cljs.core._seq.call(null, this);
  return null == this.s ? null : cljs.core.first.call(null, this.s);
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  cljs.core._seq.call(null, this);
  return null != this.s ? cljs.core.rest.call(null, this.s) : cljs.core.List.EMPTY;
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  this.sval();
  if (null == this.s) {
    return null;
  }
  for (a = this.s;;) {
    if (a instanceof cljs.core.LazySeq) {
      a = a.sval();
    } else {
      return this.s = a, cljs.core.seq.call(null, this.s);
    }
  }
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.LazySeq(b, this.fn, this.s, this.__hash);
};
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.__GT_LazySeq = function(a, b, c, d) {
  return new cljs.core.LazySeq(a, b, c, d);
};
cljs.core.ChunkBuffer = function(a, b) {
  this.buf = a;
  this.end = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2;
};
cljs.core.ChunkBuffer.cljs$lang$type = !0;
cljs.core.ChunkBuffer.cljs$lang$ctorStr = "cljs.core/ChunkBuffer";
cljs.core.ChunkBuffer.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ChunkBuffer");
};
cljs.core.ChunkBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.end;
};
cljs.core.ChunkBuffer.prototype.add = function(a) {
  this.buf[this.end] = a;
  return this.end += 1;
};
cljs.core.ChunkBuffer.prototype.chunk = function(a) {
  a = new cljs.core.ArrayChunk(this.buf, 0, this.end);
  this.buf = null;
  return a;
};
cljs.core.__GT_ChunkBuffer = function(a, b) {
  return new cljs.core.ChunkBuffer(a, b);
};
cljs.core.chunk_buffer = function(a) {
  return new cljs.core.ChunkBuffer(Array(a), 0);
};
cljs.core.ArrayChunk = function(a, b, c) {
  this.arr = a;
  this.off = b;
  this.end = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 524306;
};
cljs.core.ArrayChunk.cljs$lang$type = !0;
cljs.core.ArrayChunk.cljs$lang$ctorStr = "cljs.core/ArrayChunk";
cljs.core.ArrayChunk.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayChunk");
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.array_reduce.call(null, this.arr, b, this.arr[this.off], this.off + 1);
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.array_reduce.call(null, this.arr, b, c, this.off);
};
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$ = !0;
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$_drop_first$arity$1 = function(a) {
  if (this.off === this.end) {
    throw Error("-drop-first of empty chunk");
  }
  return new cljs.core.ArrayChunk(this.arr, this.off + 1, this.end);
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return this.arr[this.off + b];
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 <= b && b < this.end - this.off ? this.arr[this.off + b] : c;
};
cljs.core.ArrayChunk.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.end - this.off;
};
cljs.core.__GT_ArrayChunk = function(a, b, c) {
  return new cljs.core.ArrayChunk(a, b, c);
};
cljs.core.array_chunk = function() {
  var a = null, b = function(a) {
    return new cljs.core.ArrayChunk(a, 0, a.length);
  }, c = function(a, b) {
    return new cljs.core.ArrayChunk(a, b, a.length);
  }, d = function(a, b, c) {
    return new cljs.core.ArrayChunk(a, b, c);
  }, a = function(a, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, f);
      case 3:
        return d.call(this, a, f, g);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  return a;
}();
cljs.core.ChunkedCons = function(a, b, c, d) {
  this.chunk = a;
  this.more = b;
  this.meta = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition0$ = 31850732;
  this.cljs$lang$protocol_mask$partition1$ = 1536;
};
cljs.core.ChunkedCons.cljs$lang$type = !0;
cljs.core.ChunkedCons.cljs$lang$ctorStr = "cljs.core/ChunkedCons";
cljs.core.ChunkedCons.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ChunkedCons");
};
cljs.core.ChunkedCons.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.ChunkedCons.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.ChunkedCons.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.ChunkedCons.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  if (1 < cljs.core._count.call(null, this.chunk)) {
    return new cljs.core.ChunkedCons(cljs.core._drop_first.call(null, this.chunk), this.more, this.meta, null);
  }
  a = cljs.core._seq.call(null, this.more);
  return null == a ? null : a;
};
cljs.core.ChunkedCons.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.ChunkedCons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.ChunkedCons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core._nth.call(null, this.chunk, 0);
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return 1 < cljs.core._count.call(null, this.chunk) ? new cljs.core.ChunkedCons(cljs.core._drop_first.call(null, this.chunk), this.more, this.meta, null) : null == this.more ? cljs.core.List.EMPTY : this.more;
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(a) {
  return this.chunk;
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(a) {
  return null == this.more ? cljs.core.List.EMPTY : this.more;
};
cljs.core.ChunkedCons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ChunkedCons(this.chunk, this.more, b, this.__hash);
};
cljs.core.ChunkedCons.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(a) {
  return null == this.more ? null : this.more;
};
cljs.core.__GT_ChunkedCons = function(a, b, c, d) {
  return new cljs.core.ChunkedCons(a, b, c, d);
};
cljs.core.chunk_cons = function(a, b) {
  return 0 === cljs.core._count.call(null, a) ? b : new cljs.core.ChunkedCons(a, b, null, null);
};
cljs.core.chunk_append = function(a, b) {
  return a.add(b);
};
cljs.core.chunk = function(a) {
  return a.chunk();
};
cljs.core.chunk_first = function(a) {
  return cljs.core._chunked_first.call(null, a);
};
cljs.core.chunk_rest = function(a) {
  return cljs.core._chunked_rest.call(null, a);
};
cljs.core.chunk_next = function(a) {
  return a && (a.cljs$lang$protocol_mask$partition1$ & 1024 || a.cljs$core$IChunkedNext$) ? cljs.core._chunked_next.call(null, a) : cljs.core.seq.call(null, cljs.core._chunked_rest.call(null, a));
};
cljs.core.to_array = function(a) {
  for (var b = [];;) {
    if (cljs.core.seq.call(null, a)) {
      b.push(cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a);
    } else {
      return b;
    }
  }
};
cljs.core.to_array_2d = function(a) {
  var b = Array(cljs.core.count.call(null, a)), c = 0;
  for (a = cljs.core.seq.call(null, a);;) {
    if (a) {
      b[c] = cljs.core.to_array.call(null, cljs.core.first.call(null, a)), c += 1, a = cljs.core.next.call(null, a);
    } else {
      break;
    }
  }
  return b;
};
cljs.core.int_array = function() {
  var a = null, b = function(b) {
    return "number" === typeof b ? a.call(null, b, null) : cljs.core.into_array.call(null, b);
  }, c = function(a, b) {
    var c = Array(a);
    if (cljs.core.seq_QMARK_.call(null, b)) {
      for (var g = 0, h = cljs.core.seq.call(null, b);;) {
        if (h && g < a) {
          c[g] = cljs.core.first.call(null, h), g += 1, h = cljs.core.next.call(null, h);
        } else {
          return c;
        }
      }
    } else {
      for (g = 0;;) {
        if (g < a) {
          c[g] = b, g += 1;
        } else {
          break;
        }
      }
      return c;
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.long_array = function() {
  var a = null, b = function(b) {
    return "number" === typeof b ? a.call(null, b, null) : cljs.core.into_array.call(null, b);
  }, c = function(a, b) {
    var c = Array(a);
    if (cljs.core.seq_QMARK_.call(null, b)) {
      for (var g = 0, h = cljs.core.seq.call(null, b);;) {
        if (h && g < a) {
          c[g] = cljs.core.first.call(null, h), g += 1, h = cljs.core.next.call(null, h);
        } else {
          return c;
        }
      }
    } else {
      for (g = 0;;) {
        if (g < a) {
          c[g] = b, g += 1;
        } else {
          break;
        }
      }
      return c;
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.double_array = function() {
  var a = null, b = function(b) {
    return "number" === typeof b ? a.call(null, b, null) : cljs.core.into_array.call(null, b);
  }, c = function(a, b) {
    var c = Array(a);
    if (cljs.core.seq_QMARK_.call(null, b)) {
      for (var g = 0, h = cljs.core.seq.call(null, b);;) {
        if (h && g < a) {
          c[g] = cljs.core.first.call(null, h), g += 1, h = cljs.core.next.call(null, h);
        } else {
          return c;
        }
      }
    } else {
      for (g = 0;;) {
        if (g < a) {
          c[g] = b, g += 1;
        } else {
          break;
        }
      }
      return c;
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.object_array = function() {
  var a = null, b = function(b) {
    return "number" === typeof b ? a.call(null, b, null) : cljs.core.into_array.call(null, b);
  }, c = function(a, b) {
    var c = Array(a);
    if (cljs.core.seq_QMARK_.call(null, b)) {
      for (var g = 0, h = cljs.core.seq.call(null, b);;) {
        if (h && g < a) {
          c[g] = cljs.core.first.call(null, h), g += 1, h = cljs.core.next.call(null, h);
        } else {
          return c;
        }
      }
    } else {
      for (g = 0;;) {
        if (g < a) {
          c[g] = b, g += 1;
        } else {
          break;
        }
      }
      return c;
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.bounded_count = function(a, b) {
  if (cljs.core.counted_QMARK_.call(null, a)) {
    return cljs.core.count.call(null, a);
  }
  for (var c = a, d = b, e = 0;;) {
    if (0 < d && cljs.core.seq.call(null, c)) {
      c = cljs.core.next.call(null, c), d -= 1, e += 1;
    } else {
      return e;
    }
  }
};
cljs.core.spread = function spread(b) {
  return null == b ? null : null == cljs.core.next.call(null, b) ? cljs.core.seq.call(null, cljs.core.first.call(null, b)) : cljs.core.cons.call(null, cljs.core.first.call(null, b), spread.call(null, cljs.core.next.call(null, b)));
};
cljs.core.concat = function() {
  var a = null, b = function() {
    return new cljs.core.LazySeq(null, function() {
      return null;
    }, null, null);
  }, c = function(a) {
    return new cljs.core.LazySeq(null, function() {
      return a;
    }, null, null);
  }, d = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var d = cljs.core.seq.call(null, b);
      return d ? cljs.core.chunked_seq_QMARK_.call(null, d) ? cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, d), a.call(null, cljs.core.chunk_rest.call(null, d), c)) : cljs.core.cons.call(null, cljs.core.first.call(null, d), a.call(null, cljs.core.rest.call(null, d), c)) : c;
    }, null, null);
  }, e = function() {
    var b = function(b, c, d) {
      return function n(a, b) {
        return new cljs.core.LazySeq(null, function() {
          var c = cljs.core.seq.call(null, a);
          return c ? cljs.core.chunked_seq_QMARK_.call(null, c) ? cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, c), n.call(null, cljs.core.chunk_rest.call(null, c), b)) : cljs.core.cons.call(null, cljs.core.first.call(null, c), n.call(null, cljs.core.rest.call(null, c), b)) : cljs.core.truth_(b) ? n.call(null, cljs.core.first.call(null, b), cljs.core.next.call(null, b)) : null;
        }, null, null);
      }.call(null, a.call(null, b, c), d);
    }, c = function(a, c, d) {
      var e = null;
      2 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, e);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, g, h) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, g);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  a.cljs$core$IFn$_invoke$arity$2 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.list_STAR_ = function() {
  var a = null, b = function(a) {
    return cljs.core.seq.call(null, a);
  }, c = function(a, b) {
    return cljs.core.cons.call(null, a, b);
  }, d = function(a, b, c) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, c));
  }, e = function(a, b, c, d) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, d)));
  }, f = function() {
    var a = function(a, b, c, d, e) {
      return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, e)))));
    }, b = function(b, c, d, e, f) {
      var h = null;
      4 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, h);
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var f = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, f, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, h, k, l, m) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, h);
      case 3:
        return d.call(this, a, h, k);
      case 4:
        return e.call(this, a, h, k, l);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, cljs.core.array_seq(arguments, 4));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$4 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.transient$ = function(a) {
  return cljs.core._as_transient.call(null, a);
};
cljs.core.persistent_BANG_ = function(a) {
  return cljs.core._persistent_BANG_.call(null, a);
};
cljs.core.conj_BANG_ = function() {
  var a = null, b = function() {
    return cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY);
  }, c = function(a, b) {
    return cljs.core._conj_BANG_.call(null, a, b);
  }, d = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a = cljs.core._conj_BANG_.call(null, a, b), cljs.core.truth_(c)) {
          b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
        } else {
          return a;
        }
      }
    }, b = function(b, c, d) {
      var f = null;
      2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, f);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, f, g) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a;
      case 2:
        return c.call(this, a, f);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, f, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.assoc_BANG_ = function() {
  var a = null, b = function(a, b, c) {
    return cljs.core._assoc_BANG_.call(null, a, b, c);
  }, c = function() {
    var a = function(a, b, c, d) {
      for (;;) {
        if (a = cljs.core._assoc_BANG_.call(null, a, b, c), cljs.core.truth_(d)) {
          b = cljs.core.first.call(null, d), c = cljs.core.second.call(null, d), d = cljs.core.nnext.call(null, d);
        } else {
          return a;
        }
      }
    }, b = function(b, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, e, l);
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var k = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, k, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.dissoc_BANG_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core._dissoc_BANG_.call(null, a, b);
  }, c = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a = cljs.core._dissoc_BANG_.call(null, a, b), cljs.core.truth_(c)) {
          b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
        } else {
          return a;
        }
      }
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.pop_BANG_ = function(a) {
  return cljs.core._pop_BANG_.call(null, a);
};
cljs.core.disj_BANG_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core._disjoin_BANG_.call(null, a, b);
  }, c = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a = cljs.core._disjoin_BANG_.call(null, a, b), cljs.core.truth_(c)) {
          b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
        } else {
          return a;
        }
      }
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.apply_to = function(a, b, c) {
  var d = cljs.core.seq.call(null, c);
  if (0 === b) {
    return a.call(null);
  }
  c = cljs.core._first.call(null, d);
  var e = cljs.core._rest.call(null, d);
  if (1 === b) {
    return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c);
  }
  var d = cljs.core._first.call(null, e), f = cljs.core._rest.call(null, e);
  if (2 === b) {
    return a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(c, d) : a.call(null, c, d);
  }
  var e = cljs.core._first.call(null, f), g = cljs.core._rest.call(null, f);
  if (3 === b) {
    return a.cljs$core$IFn$_invoke$arity$3 ? a.cljs$core$IFn$_invoke$arity$3(c, d, e) : a.call(null, c, d, e);
  }
  var f = cljs.core._first.call(null, g), h = cljs.core._rest.call(null, g);
  if (4 === b) {
    return a.cljs$core$IFn$_invoke$arity$4 ? a.cljs$core$IFn$_invoke$arity$4(c, d, e, f) : a.call(null, c, d, e, f);
  }
  var g = cljs.core._first.call(null, h), k = cljs.core._rest.call(null, h);
  if (5 === b) {
    return a.cljs$core$IFn$_invoke$arity$5 ? a.cljs$core$IFn$_invoke$arity$5(c, d, e, f, g) : a.call(null, c, d, e, f, g);
  }
  var h = cljs.core._first.call(null, k), l = cljs.core._rest.call(null, k);
  if (6 === b) {
    return a.cljs$core$IFn$_invoke$arity$6 ? a.cljs$core$IFn$_invoke$arity$6(c, d, e, f, g, h) : a.call(null, c, d, e, f, g, h);
  }
  var k = cljs.core._first.call(null, l), m = cljs.core._rest.call(null, l);
  if (7 === b) {
    return a.cljs$core$IFn$_invoke$arity$7 ? a.cljs$core$IFn$_invoke$arity$7(c, d, e, f, g, h, k) : a.call(null, c, d, e, f, g, h, k);
  }
  var l = cljs.core._first.call(null, m), n = cljs.core._rest.call(null, m);
  if (8 === b) {
    return a.cljs$core$IFn$_invoke$arity$8 ? a.cljs$core$IFn$_invoke$arity$8(c, d, e, f, g, h, k, l) : a.call(null, c, d, e, f, g, h, k, l);
  }
  var m = cljs.core._first.call(null, n), p = cljs.core._rest.call(null, n);
  if (9 === b) {
    return a.cljs$core$IFn$_invoke$arity$9 ? a.cljs$core$IFn$_invoke$arity$9(c, d, e, f, g, h, k, l, m) : a.call(null, c, d, e, f, g, h, k, l, m);
  }
  var n = cljs.core._first.call(null, p), q = cljs.core._rest.call(null, p);
  if (10 === b) {
    return a.cljs$core$IFn$_invoke$arity$10 ? a.cljs$core$IFn$_invoke$arity$10(c, d, e, f, g, h, k, l, m, n) : a.call(null, c, d, e, f, g, h, k, l, m, n);
  }
  var p = cljs.core._first.call(null, q), r = cljs.core._rest.call(null, q);
  if (11 === b) {
    return a.cljs$core$IFn$_invoke$arity$11 ? a.cljs$core$IFn$_invoke$arity$11(c, d, e, f, g, h, k, l, m, n, p) : a.call(null, c, d, e, f, g, h, k, l, m, n, p);
  }
  var q = cljs.core._first.call(null, r), s = cljs.core._rest.call(null, r);
  if (12 === b) {
    return a.cljs$core$IFn$_invoke$arity$12 ? a.cljs$core$IFn$_invoke$arity$12(c, d, e, f, g, h, k, l, m, n, p, q) : a.call(null, c, d, e, f, g, h, k, l, m, n, p, q);
  }
  var r = cljs.core._first.call(null, s), t = cljs.core._rest.call(null, s);
  if (13 === b) {
    return a.cljs$core$IFn$_invoke$arity$13 ? a.cljs$core$IFn$_invoke$arity$13(c, d, e, f, g, h, k, l, m, n, p, q, r) : a.call(null, c, d, e, f, g, h, k, l, m, n, p, q, r);
  }
  var s = cljs.core._first.call(null, t), u = cljs.core._rest.call(null, t);
  if (14 === b) {
    return a.cljs$core$IFn$_invoke$arity$14 ? a.cljs$core$IFn$_invoke$arity$14(c, d, e, f, g, h, k, l, m, n, p, q, r, s) : a.call(null, c, d, e, f, g, h, k, l, m, n, p, q, r, s);
  }
  var t = cljs.core._first.call(null, u), v = cljs.core._rest.call(null, u);
  if (15 === b) {
    return a.cljs$core$IFn$_invoke$arity$15 ? a.cljs$core$IFn$_invoke$arity$15(c, d, e, f, g, h, k, l, m, n, p, q, r, s, t) : a.call(null, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t);
  }
  var u = cljs.core._first.call(null, v), x = cljs.core._rest.call(null, v);
  if (16 === b) {
    return a.cljs$core$IFn$_invoke$arity$16 ? a.cljs$core$IFn$_invoke$arity$16(c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u) : a.call(null, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u);
  }
  var v = cljs.core._first.call(null, x), C = cljs.core._rest.call(null, x);
  if (17 === b) {
    return a.cljs$core$IFn$_invoke$arity$17 ? a.cljs$core$IFn$_invoke$arity$17(c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v) : a.call(null, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v);
  }
  var x = cljs.core._first.call(null, C), I = cljs.core._rest.call(null, C);
  if (18 === b) {
    return a.cljs$core$IFn$_invoke$arity$18 ? a.cljs$core$IFn$_invoke$arity$18(c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x) : a.call(null, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x);
  }
  C = cljs.core._first.call(null, I);
  I = cljs.core._rest.call(null, I);
  if (19 === b) {
    return a.cljs$core$IFn$_invoke$arity$19 ? a.cljs$core$IFn$_invoke$arity$19(c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x, C) : a.call(null, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x, C);
  }
  var J = cljs.core._first.call(null, I);
  cljs.core._rest.call(null, I);
  if (20 === b) {
    return a.cljs$core$IFn$_invoke$arity$20 ? a.cljs$core$IFn$_invoke$arity$20(c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x, C, J) : a.call(null, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x, C, J);
  }
  throw Error("Only up to 20 arguments supported on functions");
};
cljs.core.apply = function() {
  var a = null, b = function(a, b) {
    var c = a.cljs$lang$maxFixedArity;
    if (a.cljs$lang$applyTo) {
      var d = cljs.core.bounded_count.call(null, b, c + 1);
      return d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b);
    }
    return a.apply(a, cljs.core.to_array.call(null, b));
  }, c = function(a, b, c) {
    b = cljs.core.list_STAR_.call(null, b, c);
    c = a.cljs$lang$maxFixedArity;
    if (a.cljs$lang$applyTo) {
      var d = cljs.core.bounded_count.call(null, b, c + 1);
      return d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b);
    }
    return a.apply(a, cljs.core.to_array.call(null, b));
  }, d = function(a, b, c, d) {
    b = cljs.core.list_STAR_.call(null, b, c, d);
    c = a.cljs$lang$maxFixedArity;
    return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count.call(null, b, c + 1), d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array.call(null, b));
  }, e = function(a, b, c, d, e) {
    b = cljs.core.list_STAR_.call(null, b, c, d, e);
    c = a.cljs$lang$maxFixedArity;
    return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count.call(null, b, c + 1), d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array.call(null, b));
  }, f = function() {
    var a = function(a, b, c, d, e, f) {
      b = cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.cons.call(null, e, cljs.core.spread.call(null, f)))));
      c = a.cljs$lang$maxFixedArity;
      return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count.call(null, b, c + 1), d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array.call(null, b));
    }, b = function(b, c, d, e, f, h) {
      var r = null;
      5 < arguments.length && (r = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
      return a.call(this, b, c, d, e, f, r);
    };
    b.cljs$lang$maxFixedArity = 5;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var f = cljs.core.first(b);
      b = cljs.core.next(b);
      var h = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, f, h, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, h, k, l, m, n) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, h);
      case 3:
        return c.call(this, a, h, k);
      case 4:
        return d.call(this, a, h, k, l);
      case 5:
        return e.call(this, a, h, k, l, m);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, m, cljs.core.array_seq(arguments, 5));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$5 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.vary_meta = function() {
  var a = null, b = function(a, b) {
    return cljs.core.with_meta.call(null, a, b.call(null, cljs.core.meta.call(null, a)));
  }, c = function(a, b, c) {
    return cljs.core.with_meta.call(null, a, b.call(null, cljs.core.meta.call(null, a), c));
  }, d = function(a, b, c, d) {
    return cljs.core.with_meta.call(null, a, b.call(null, cljs.core.meta.call(null, a), c, d));
  }, e = function(a, b, c, d, e) {
    return cljs.core.with_meta.call(null, a, b.call(null, cljs.core.meta.call(null, a), c, d, e));
  }, f = function(a, b, c, d, e, f) {
    return cljs.core.with_meta.call(null, a, b.call(null, cljs.core.meta.call(null, a), c, d, e, f));
  }, g = function() {
    var a = function(a, b, c, d, e, f, g) {
      return cljs.core.with_meta.call(null, a, cljs.core.apply.call(null, b, cljs.core.meta.call(null, a), c, d, e, f, g));
    }, b = function(b, c, d, e, f, g, k) {
      var t = null;
      6 < arguments.length && (t = cljs.core.array_seq(Array.prototype.slice.call(arguments, 6), 0));
      return a.call(this, b, c, d, e, f, g, t);
    };
    b.cljs$lang$maxFixedArity = 6;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var f = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.next(b);
      var k = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, f, g, k, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, k, l, m, n, p, q) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, k);
      case 3:
        return c.call(this, a, k, l);
      case 4:
        return d.call(this, a, k, l, m);
      case 5:
        return e.call(this, a, k, l, m, n);
      case 6:
        return f.call(this, a, k, l, m, n, p);
      default:
        return g.cljs$core$IFn$_invoke$arity$variadic(a, k, l, m, n, p, cljs.core.array_seq(arguments, 6));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 6;
  a.cljs$lang$applyTo = g.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$5 = e;
  a.cljs$core$IFn$_invoke$arity$6 = f;
  a.cljs$core$IFn$_invoke$arity$variadic = g.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.not_EQ_ = function() {
  var a = null, b = function(a, b) {
    return!cljs.core._EQ_.call(null, a, b);
  }, c = function() {
    var a = function(a, b, c) {
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, a, b, c));
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!1;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!1;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.not_empty = function(a) {
  return cljs.core.seq.call(null, a) ? a : null;
};
cljs.core.nil_iter = function nil_iter() {
  "undefined" === typeof cljs.core.t6422 && (cljs.core.t6422 = function(b, c) {
    this.nil_iter = b;
    this.meta6423 = c;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216;
  }, cljs.core.t6422.cljs$lang$type = !0, cljs.core.t6422.cljs$lang$ctorStr = "cljs.core/t6422", cljs.core.t6422.cljs$lang$ctorPrWriter = function(b, c, d) {
    return cljs.core._write.call(null, c, "cljs.core/t6422");
  }, cljs.core.t6422.prototype.hasNext = function() {
    return!1;
  }, cljs.core.t6422.prototype.next = function() {
    return Error("No such element");
  }, cljs.core.t6422.prototype.remove = function() {
    return Error("Unsupported operation");
  }, cljs.core.t6422.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta6423;
  }, cljs.core.t6422.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
    return new cljs.core.t6422(this.nil_iter, c);
  }, cljs.core.__GT_t6422 = function(b, c) {
    return new cljs.core.t6422(b, c);
  });
  return new cljs.core.t6422(nil_iter, null);
};
cljs.core.StringIter = function(a, b) {
  this.s = a;
  this.i = b;
};
cljs.core.StringIter.cljs$lang$type = !0;
cljs.core.StringIter.cljs$lang$ctorStr = "cljs.core/StringIter";
cljs.core.StringIter.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/StringIter");
};
cljs.core.StringIter.prototype.hasNext = function() {
  return this.i < this.s.length;
};
cljs.core.StringIter.prototype.next = function() {
  var a = this.s.charAt(this.i);
  this.i += 1;
  return a;
};
cljs.core.StringIter.prototype.remove = function() {
  return Error("Unsupported operation");
};
cljs.core.__GT_StringIter = function(a, b) {
  return new cljs.core.StringIter(a, b);
};
cljs.core.string_iter = function(a) {
  return new cljs.core.StringIter(a, 0);
};
cljs.core.ArrayIter = function(a, b) {
  this.arr = a;
  this.i = b;
};
cljs.core.ArrayIter.cljs$lang$type = !0;
cljs.core.ArrayIter.cljs$lang$ctorStr = "cljs.core/ArrayIter";
cljs.core.ArrayIter.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayIter");
};
cljs.core.ArrayIter.prototype.hasNext = function() {
  return this.i < this.arr.length;
};
cljs.core.ArrayIter.prototype.next = function() {
  var a = this.arr[this.i];
  this.i += 1;
  return a;
};
cljs.core.ArrayIter.prototype.remove = function() {
  return Error("Unsupported operation");
};
cljs.core.__GT_ArrayIter = function(a, b) {
  return new cljs.core.ArrayIter(a, b);
};
cljs.core.array_iter = function(a) {
  return new cljs.core.ArrayIter(a, 0);
};
cljs.core.INIT = {};
cljs.core.START = {};
cljs.core.SeqIter = function(a, b) {
  this._seq = a;
  this._next = b;
};
cljs.core.SeqIter.cljs$lang$type = !0;
cljs.core.SeqIter.cljs$lang$ctorStr = "cljs.core/SeqIter";
cljs.core.SeqIter.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/SeqIter");
};
cljs.core.SeqIter.prototype.hasNext = function() {
  this._seq === cljs.core.INIT ? (this._seq = cljs.core.START, this._next = cljs.core.seq.call(null, this._next)) : this._seq === this._next && (this._next = cljs.core.next.call(null, this._seq));
  return null != this._next;
};
cljs.core.SeqIter.prototype.next = function() {
  if (cljs.core.not.call(null, this.hasNext())) {
    throw Error("No such element");
  }
  this._seq = this._next;
  return cljs.core.first.call(null, this._next);
};
cljs.core.SeqIter.prototype.remove = function() {
  return Error("Unsupported operation");
};
cljs.core.__GT_SeqIter = function(a, b) {
  return new cljs.core.SeqIter(a, b);
};
cljs.core.seq_iter = function(a) {
  return new cljs.core.SeqIter(cljs.core.INIT, a);
};
cljs.core.iter = function(a) {
  if (null == a) {
    return cljs.core.nil_iter.call(null);
  }
  if ("string" === typeof a) {
    return cljs.core.string_iter.call(null, a);
  }
  if (a instanceof Array) {
    return cljs.core.array_iter.call(null, a);
  }
  if (cljs.core.iterable_QMARK_.call(null, a)) {
    return cljs.core._iterator.call(null, a);
  }
  if (cljs.core.seqable_QMARK_.call(null, a)) {
    return cljs.core.seq_iter.call(null, a);
  }
  throw Error("Cannot create iterator from " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a));
};
cljs.core.lazy_transformer = function(a) {
  return new cljs.core.LazyTransformer(a, null, null, null);
};
cljs.core.Stepper = function(a, b) {
  this.xform = a;
  this.iter = b;
};
cljs.core.Stepper.cljs$lang$type = !0;
cljs.core.Stepper.cljs$lang$ctorStr = "cljs.core/Stepper";
cljs.core.Stepper.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Stepper");
};
cljs.core.Stepper.prototype.step = function(a) {
  for (var b = this;;) {
    if (cljs.core.truth_(function() {
      var c = null != a.stepper;
      return c ? b.iter.hasNext() : c;
    }())) {
      if (cljs.core.reduced_QMARK_.call(null, b.xform.call(null, a, b.iter.next()))) {
        null != a.rest && (a.rest.stepper = null);
      } else {
        continue;
      }
    }
    break;
  }
  return null == a.stepper ? null : b.xform.call(null, a);
};
cljs.core.__GT_Stepper = function(a, b) {
  return new cljs.core.Stepper(a, b);
};
cljs.core.stepper = function(a, b) {
  var c = function() {
    var a = null, b = function(a) {
      (cljs.core.reduced_QMARK_.call(null, a) ? cljs.core.deref.call(null, a) : a).stepper = null;
      return a;
    }, c = function(a, b) {
      a.first = b;
      a.rest = cljs.core.lazy_transformer.call(null, a.stepper);
      a.stepper = null;
      return a.rest;
    }, a = function(a, d) {
      switch(arguments.length) {
        case 1:
          return b.call(this, a);
        case 2:
          return c.call(this, a, d);
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    a.cljs$core$IFn$_invoke$arity$1 = b;
    a.cljs$core$IFn$_invoke$arity$2 = c;
    return a;
  }();
  return new cljs.core.Stepper(a.call(null, c), b);
};
cljs.core.MultiStepper = function(a, b, c) {
  this.xform = a;
  this.iters = b;
  this.nexts = c;
};
cljs.core.MultiStepper.cljs$lang$type = !0;
cljs.core.MultiStepper.cljs$lang$ctorStr = "cljs.core/MultiStepper";
cljs.core.MultiStepper.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/MultiStepper");
};
cljs.core.MultiStepper.prototype.hasNext = function() {
  for (var a = cljs.core.seq.call(null, this.iters);;) {
    if (null != a) {
      var b = cljs.core.first.call(null, a);
      if (cljs.core.not.call(null, b.hasNext())) {
        return!1;
      }
      a = cljs.core.next.call(null, a);
    } else {
      return!0;
    }
  }
};
cljs.core.MultiStepper.prototype.next = function() {
  for (var a = this.iters.length, b = 0;;) {
    if (b < a) {
      this.nexts[b] = this.iters[b].next(), b += 1;
    } else {
      break;
    }
  }
  return cljs.core.prim_seq.call(null, this.nexts, 0);
};
cljs.core.MultiStepper.prototype.step = function(a) {
  for (var b = this;;) {
    if (cljs.core.truth_(function() {
      var c = null != a.stepper;
      return c ? b.hasNext() : c;
    }())) {
      if (cljs.core.reduced_QMARK_.call(null, cljs.core.apply.call(null, this.xform, cljs.core.cons.call(null, a, b.next())))) {
        null != a.rest && (a.rest.stepper = null);
      } else {
        continue;
      }
    }
    break;
  }
  return null == a.stepper ? null : this.xform.call(null, a);
};
cljs.core.__GT_MultiStepper = function(a, b, c) {
  return new cljs.core.MultiStepper(a, b, c);
};
cljs.core.multi_stepper = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, Array(c.length));
  }, c = function(a, b, c) {
    var g = function() {
      var a = null, b = function(a) {
        a = cljs.core.reduced_QMARK_.call(null, a) ? cljs.core.deref.call(null, a) : a;
        a.stepper = null;
        return a;
      }, c = function(a, b) {
        a.first = b;
        a.rest = cljs.core.lazy_transformer.call(null, a.stepper);
        a.stepper = null;
        return a.rest;
      }, a = function(a, d) {
        switch(arguments.length) {
          case 1:
            return b.call(this, a);
          case 2:
            return c.call(this, a, d);
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      a.cljs$core$IFn$_invoke$arity$1 = b;
      a.cljs$core$IFn$_invoke$arity$2 = c;
      return a;
    }();
    return new cljs.core.MultiStepper(a.call(null, g), b, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.LazyTransformer = function(a, b, c, d) {
  this.stepper = a;
  this.first = b;
  this.rest = c;
  this.meta = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31719628;
};
cljs.core.LazyTransformer.cljs$lang$type = !0;
cljs.core.LazyTransformer.cljs$lang$ctorStr = "cljs.core/LazyTransformer";
cljs.core.LazyTransformer.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/LazyTransformer");
};
cljs.core.LazyTransformer.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  null != this.stepper && cljs.core._seq.call(null, this);
  return null == this.rest ? null : cljs.core._seq.call(null, this.rest);
};
cljs.core.LazyTransformer.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  null != this.stepper && cljs.core._seq.call(null, this);
  return null == this.rest ? null : this.first;
};
cljs.core.LazyTransformer.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  null != this.stepper && cljs.core._seq.call(null, this);
  return null == this.rest ? cljs.core.List.EMPTY : this.rest;
};
cljs.core.LazyTransformer.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  null != this.stepper && this.stepper.step(this);
  return null == this.rest ? null : this;
};
cljs.core.LazyTransformer.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.LazyTransformer.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return null != cljs.core._seq.call(null, this) ? cljs.core.equiv_sequential.call(null, this, b) : cljs.core.sequential_QMARK_.call(null, b) && null == cljs.core.seq.call(null, b);
};
cljs.core.LazyTransformer.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.List.EMPTY;
};
cljs.core.LazyTransformer.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, cljs.core._seq.call(null, this));
};
cljs.core.LazyTransformer.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.LazyTransformer(this.stepper, this.first, this.rest, b);
};
cljs.core.__GT_LazyTransformer = function(a, b, c, d) {
  return new cljs.core.LazyTransformer(a, b, c, d);
};
cljs.core.LazyTransformer.create = function(a, b) {
  return new cljs.core.LazyTransformer(cljs.core.stepper.call(null, a, cljs.core.iter.call(null, b)), null, null, null);
};
cljs.core.LazyTransformer.createMulti = function(a, b) {
  for (var c = [], d = cljs.core.seq.call(null, b), e = null, f = 0, g = 0;;) {
    if (g < f) {
      var h = cljs.core._nth.call(null, e, g);
      c.push(cljs.core.iter.call(null, h));
      g += 1;
    } else {
      if (d = cljs.core.seq.call(null, d)) {
        e = d, cljs.core.chunked_seq_QMARK_.call(null, e) ? (d = cljs.core.chunk_first.call(null, e), g = cljs.core.chunk_rest.call(null, e), e = d, f = cljs.core.count.call(null, d), d = g) : (d = cljs.core.first.call(null, e), c.push(cljs.core.iter.call(null, d)), d = cljs.core.next.call(null, e), e = null, f = 0), g = 0;
      } else {
        break;
      }
    }
  }
  return new cljs.core.LazyTransformer(cljs.core.multi_stepper.call(null, a, c, Array(c.length)), null, null, null);
};
cljs.core.sequence = function() {
  var a = null, b = function(a) {
    return cljs.core.seq_QMARK_.call(null, a) ? a : (a = cljs.core.seq.call(null, a)) ? a : cljs.core.List.EMPTY;
  }, c = function(a, b) {
    return cljs.core.LazyTransformer.create(a, b);
  }, d = function() {
    var a = function(a, b, c) {
      return cljs.core.LazyTransformer.createMulti(a, cljs.core.to_array.call(null, cljs.core.cons.call(null, b, c)));
    }, b = function(b, c, d) {
      var f = null;
      2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, f);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, f);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, f, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.every_QMARK_ = function(a, b) {
  for (;;) {
    if (null == cljs.core.seq.call(null, b)) {
      return!0;
    }
    if (cljs.core.truth_(a.call(null, cljs.core.first.call(null, b)))) {
      var c = a, d = cljs.core.next.call(null, b);
      a = c;
      b = d;
    } else {
      return!1;
    }
  }
};
cljs.core.not_every_QMARK_ = function(a, b) {
  return!cljs.core.every_QMARK_.call(null, a, b);
};
cljs.core.some = function(a, b) {
  for (;;) {
    if (cljs.core.seq.call(null, b)) {
      var c = a.call(null, cljs.core.first.call(null, b));
      if (cljs.core.truth_(c)) {
        return c;
      }
      var c = a, d = cljs.core.next.call(null, b);
      a = c;
      b = d;
    } else {
      return null;
    }
  }
};
cljs.core.not_any_QMARK_ = function(a, b) {
  return cljs.core.not.call(null, cljs.core.some.call(null, a, b));
};
cljs.core.even_QMARK_ = function(a) {
  if (cljs.core.integer_QMARK_.call(null, a)) {
    return 0 === (a & 1);
  }
  throw Error("Argument must be an integer: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a));
};
cljs.core.odd_QMARK_ = function(a) {
  return!cljs.core.even_QMARK_.call(null, a);
};
cljs.core.complement = function(a) {
  return function() {
    var b = null, c = function() {
      return cljs.core.not.call(null, a.call(null));
    }, d = function(b) {
      return cljs.core.not.call(null, a.call(null, b));
    }, e = function(b, c) {
      return cljs.core.not.call(null, a.call(null, b, c));
    }, f = function() {
      var b = function(b, c, d) {
        return cljs.core.not.call(null, cljs.core.apply.call(null, a, b, c, d));
      }, c = function(a, c, d) {
        var e = null;
        2 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
        return b.call(this, a, c, e);
      };
      c.cljs$lang$maxFixedArity = 2;
      c.cljs$lang$applyTo = function(a) {
        var c = cljs.core.first(a);
        a = cljs.core.next(a);
        var d = cljs.core.first(a);
        a = cljs.core.rest(a);
        return b(c, d, a);
      };
      c.cljs$core$IFn$_invoke$arity$variadic = b;
      return c;
    }(), b = function(a, b, k) {
      switch(arguments.length) {
        case 0:
          return c.call(this);
        case 1:
          return d.call(this, a);
        case 2:
          return e.call(this, a, b);
        default:
          return f.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2));
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = f.cljs$lang$applyTo;
    b.cljs$core$IFn$_invoke$arity$0 = c;
    b.cljs$core$IFn$_invoke$arity$1 = d;
    b.cljs$core$IFn$_invoke$arity$2 = e;
    b.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
    return b;
  }();
};
cljs.core.constantly = function(a) {
  return function() {
    var b = function(b) {
      0 < arguments.length && cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
      return a;
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      cljs.core.seq(b);
      return a;
    };
    b.cljs$core$IFn$_invoke$arity$variadic = function(b) {
      return a;
    };
    return b;
  }();
};
cljs.core.comp = function() {
  var a = null, b = function() {
    return cljs.core.identity;
  }, c = function(a, b) {
    return function() {
      var c = null, d = function() {
        return a.call(null, b.call(null));
      }, e = function(c) {
        return a.call(null, b.call(null, c));
      }, m = function(c, d) {
        return a.call(null, b.call(null, c, d));
      }, n = function(c, d, e) {
        return a.call(null, b.call(null, c, d, e));
      }, p = function() {
        var c = function(c, d, e, h) {
          return a.call(null, cljs.core.apply.call(null, b, c, d, e, h));
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f);
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a);
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d;
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return d.call(this);
          case 1:
            return e.call(this, a);
          case 2:
            return m.call(this, a, b);
          case 3:
            return n.call(this, a, b, c);
          default:
            return p.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = p.cljs$lang$applyTo;
      c.cljs$core$IFn$_invoke$arity$0 = d;
      c.cljs$core$IFn$_invoke$arity$1 = e;
      c.cljs$core$IFn$_invoke$arity$2 = m;
      c.cljs$core$IFn$_invoke$arity$3 = n;
      c.cljs$core$IFn$_invoke$arity$variadic = p.cljs$core$IFn$_invoke$arity$variadic;
      return c;
    }();
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function() {
        return a.call(null, b.call(null, c.call(null)));
      }, m = function(d) {
        return a.call(null, b.call(null, c.call(null, d)));
      }, n = function(d, e) {
        return a.call(null, b.call(null, c.call(null, d, e)));
      }, p = function(d, e, k) {
        return a.call(null, b.call(null, c.call(null, d, e, k)));
      }, q = function() {
        var d = function(d, e, k, l) {
          return a.call(null, b.call(null, cljs.core.apply.call(null, c, d, e, k, l)));
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f);
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a);
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e;
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return e.call(this);
          case 1:
            return m.call(this, a);
          case 2:
            return n.call(this, a, b);
          case 3:
            return p.call(this, a, b, c);
          default:
            return q.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = q.cljs$lang$applyTo;
      d.cljs$core$IFn$_invoke$arity$0 = e;
      d.cljs$core$IFn$_invoke$arity$1 = m;
      d.cljs$core$IFn$_invoke$arity$2 = n;
      d.cljs$core$IFn$_invoke$arity$3 = p;
      d.cljs$core$IFn$_invoke$arity$variadic = q.cljs$core$IFn$_invoke$arity$variadic;
      return d;
    }();
  }, e = function() {
    var a = function(a, b, c, d) {
      return function(a) {
        return function() {
          var b = function(b) {
            b = cljs.core.apply.call(null, cljs.core.first.call(null, a), b);
            for (var c = cljs.core.next.call(null, a);;) {
              if (c) {
                b = cljs.core.first.call(null, c).call(null, b), c = cljs.core.next.call(null, c);
              } else {
                return b;
              }
            }
          }, c = function(a) {
            var c = null;
            0 < arguments.length && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
            return b.call(this, c);
          };
          c.cljs$lang$maxFixedArity = 0;
          c.cljs$lang$applyTo = function(a) {
            a = cljs.core.seq(a);
            return b(a);
          };
          c.cljs$core$IFn$_invoke$arity$variadic = b;
          return c;
        }();
      }(cljs.core.reverse.call(null, cljs.core.list_STAR_.call(null, a, b, c, d)));
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g);
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a;
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.partial = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = function(c) {
        return cljs.core.apply.call(null, a, b, c);
      }, d = function(a) {
        var b = null;
        0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return c.call(this, b);
      };
      d.cljs$lang$maxFixedArity = 0;
      d.cljs$lang$applyTo = function(a) {
        a = cljs.core.seq(a);
        return c(a);
      };
      d.cljs$core$IFn$_invoke$arity$variadic = c;
      return d;
    }();
  }, c = function(a, b, c) {
    return function() {
      var d = function(d) {
        return cljs.core.apply.call(null, a, b, c, d);
      }, e = function(a) {
        var b = null;
        0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return d.call(this, b);
      };
      e.cljs$lang$maxFixedArity = 0;
      e.cljs$lang$applyTo = function(a) {
        a = cljs.core.seq(a);
        return d(a);
      };
      e.cljs$core$IFn$_invoke$arity$variadic = d;
      return e;
    }();
  }, d = function(a, b, c, d) {
    return function() {
      var e = function(e) {
        return cljs.core.apply.call(null, a, b, c, d, e);
      }, m = function(a) {
        var b = null;
        0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return e.call(this, b);
      };
      m.cljs$lang$maxFixedArity = 0;
      m.cljs$lang$applyTo = function(a) {
        a = cljs.core.seq(a);
        return e(a);
      };
      m.cljs$core$IFn$_invoke$arity$variadic = e;
      return m;
    }();
  }, e = function() {
    var a = function(a, b, c, d, e) {
      return function() {
        var f = function(f) {
          return cljs.core.apply.call(null, a, b, c, d, cljs.core.concat.call(null, e, f));
        }, g = function(a) {
          var b = null;
          0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
          return f.call(this, b);
        };
        g.cljs$lang$maxFixedArity = 0;
        g.cljs$lang$applyTo = function(a) {
          a = cljs.core.seq(a);
          return f(a);
        };
        g.cljs$core$IFn$_invoke$arity$variadic = f;
        return g;
      }();
    }, b = function(b, c, d, e, g) {
      var p = null;
      4 < arguments.length && (p = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, p);
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, g, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, g, h, k, l) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, k);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, k, cljs.core.array_seq(arguments, 4));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.fnil = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = null, d = function(c) {
        return a.call(null, null == c ? b : c);
      }, k = function(c, d) {
        return a.call(null, null == c ? b : c, d);
      }, l = function(c, d, g) {
        return a.call(null, null == c ? b : c, d, g);
      }, m = function() {
        var c = function(c, d, g, h) {
          return cljs.core.apply.call(null, a, null == c ? b : c, d, g, h);
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f);
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a);
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d;
      }(), c = function(a, b, c, e) {
        switch(arguments.length) {
          case 1:
            return d.call(this, a);
          case 2:
            return k.call(this, a, b);
          case 3:
            return l.call(this, a, b, c);
          default:
            return m.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = m.cljs$lang$applyTo;
      c.cljs$core$IFn$_invoke$arity$1 = d;
      c.cljs$core$IFn$_invoke$arity$2 = k;
      c.cljs$core$IFn$_invoke$arity$3 = l;
      c.cljs$core$IFn$_invoke$arity$variadic = m.cljs$core$IFn$_invoke$arity$variadic;
      return c;
    }();
  }, c = function(a, b, c) {
    return function() {
      var d = null, k = function(d, h) {
        return a.call(null, null == d ? b : d, null == h ? c : h);
      }, l = function(d, h, k) {
        return a.call(null, null == d ? b : d, null == h ? c : h, k);
      }, m = function() {
        var d = function(d, h, k, l) {
          return cljs.core.apply.call(null, a, null == d ? b : d, null == h ? c : h, k, l);
        }, h = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f);
        };
        h.cljs$lang$maxFixedArity = 3;
        h.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a);
        };
        h.cljs$core$IFn$_invoke$arity$variadic = d;
        return h;
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 2:
            return k.call(this, a, b);
          case 3:
            return l.call(this, a, b, c);
          default:
            return m.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = m.cljs$lang$applyTo;
      d.cljs$core$IFn$_invoke$arity$2 = k;
      d.cljs$core$IFn$_invoke$arity$3 = l;
      d.cljs$core$IFn$_invoke$arity$variadic = m.cljs$core$IFn$_invoke$arity$variadic;
      return d;
    }();
  }, d = function(a, b, c, d) {
    return function() {
      var k = null, l = function(d, h) {
        return a.call(null, null == d ? b : d, null == h ? c : h);
      }, m = function(k, l, m) {
        return a.call(null, null == k ? b : k, null == l ? c : l, null == m ? d : m);
      }, n = function() {
        var k = function(k, l, m, q) {
          return cljs.core.apply.call(null, a, null == k ? b : k, null == l ? c : l, null == m ? d : m, q);
        }, l = function(a, b, c, d) {
          var e = null;
          3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return k.call(this, a, b, c, e);
        };
        l.cljs$lang$maxFixedArity = 3;
        l.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.rest(a);
          return k(b, c, d, a);
        };
        l.cljs$core$IFn$_invoke$arity$variadic = k;
        return l;
      }(), k = function(a, b, c, d) {
        switch(arguments.length) {
          case 2:
            return l.call(this, a, b);
          case 3:
            return m.call(this, a, b, c);
          default:
            return n.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      k.cljs$lang$maxFixedArity = 3;
      k.cljs$lang$applyTo = n.cljs$lang$applyTo;
      k.cljs$core$IFn$_invoke$arity$2 = l;
      k.cljs$core$IFn$_invoke$arity$3 = m;
      k.cljs$core$IFn$_invoke$arity$variadic = n.cljs$core$IFn$_invoke$arity$variadic;
      return k;
    }();
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a;
}();
cljs.core.map_indexed = function(a, b) {
  return function d(b, f) {
    return new cljs.core.LazySeq(null, function() {
      var g = cljs.core.seq.call(null, f);
      if (g) {
        if (cljs.core.chunked_seq_QMARK_.call(null, g)) {
          for (var h = cljs.core.chunk_first.call(null, g), k = cljs.core.count.call(null, h), l = cljs.core.chunk_buffer.call(null, k), m = 0;;) {
            if (m < k) {
              cljs.core.chunk_append.call(null, l, a.call(null, b + m, cljs.core._nth.call(null, h, m))), m += 1;
            } else {
              break;
            }
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, l), d.call(null, b + k, cljs.core.chunk_rest.call(null, g)));
        }
        return cljs.core.cons.call(null, a.call(null, b, cljs.core.first.call(null, g)), d.call(null, b + 1, cljs.core.rest.call(null, g)));
      }
      return null;
    }, null, null);
  }.call(null, 0, b);
};
cljs.core.keep = function() {
  var a = null, b = function(a) {
    return function(b) {
      return function() {
        var c = null, g = function() {
          return b.call(null);
        }, h = function(a) {
          return b.call(null, a);
        }, k = function(c, f) {
          var g = a.call(null, f);
          return null == g ? c : b.call(null, c, g);
        }, c = function(a, b) {
          switch(arguments.length) {
            case 0:
              return g.call(this);
            case 1:
              return h.call(this, a);
            case 2:
              return k.call(this, a, b);
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        c.cljs$core$IFn$_invoke$arity$0 = g;
        c.cljs$core$IFn$_invoke$arity$1 = h;
        c.cljs$core$IFn$_invoke$arity$2 = k;
        return c;
      }();
    };
  }, c = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, c);
      if (f) {
        if (cljs.core.chunked_seq_QMARK_.call(null, f)) {
          for (var g = cljs.core.chunk_first.call(null, f), h = cljs.core.count.call(null, g), k = cljs.core.chunk_buffer.call(null, h), l = 0;;) {
            if (l < h) {
              var m = b.call(null, cljs.core._nth.call(null, g, l));
              null != m && cljs.core.chunk_append.call(null, k, m);
              l += 1;
            } else {
              break;
            }
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, k), a.call(null, b, cljs.core.chunk_rest.call(null, f)));
        }
        g = b.call(null, cljs.core.first.call(null, f));
        return null == g ? a.call(null, b, cljs.core.rest.call(null, f)) : cljs.core.cons.call(null, g, a.call(null, b, cljs.core.rest.call(null, f)));
      }
      return null;
    }, null, null);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.Atom = function(a, b, c, d) {
  this.state = a;
  this.meta = b;
  this.validator = c;
  this.watches = d;
  this.cljs$lang$protocol_mask$partition0$ = 6455296;
  this.cljs$lang$protocol_mask$partition1$ = 16386;
};
cljs.core.Atom.cljs$lang$type = !0;
cljs.core.Atom.cljs$lang$ctorStr = "cljs.core/Atom";
cljs.core.Atom.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Atom");
};
cljs.core.Atom.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.getUid(this);
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = function(a, b, c) {
  a = cljs.core.seq.call(null, this.watches);
  for (var d = null, e = 0, f = 0;;) {
    if (f < e) {
      var g = cljs.core._nth.call(null, d, f), h = cljs.core.nth.call(null, g, 0, null), g = cljs.core.nth.call(null, g, 1, null);
      g.call(null, h, this, b, c);
      f += 1;
    } else {
      if (a = cljs.core.seq.call(null, a)) {
        cljs.core.chunked_seq_QMARK_.call(null, a) ? (d = cljs.core.chunk_first.call(null, a), a = cljs.core.chunk_rest.call(null, a), h = d, e = cljs.core.count.call(null, d), d = h) : (d = cljs.core.first.call(null, a), h = cljs.core.nth.call(null, d, 0, null), g = cljs.core.nth.call(null, d, 1, null), g.call(null, h, this, b, c), a = cljs.core.next.call(null, a), d = null, e = 0), f = 0;
      } else {
        return null;
      }
    }
  }
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch$arity$3 = function(a, b, c) {
  this.watches = cljs.core.assoc.call(null, this.watches, b, c);
  return this;
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = function(a, b) {
  return this.watches = cljs.core.dissoc.call(null, this.watches, b);
};
cljs.core.Atom.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.Atom.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  return this.state;
};
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return this === b;
};
cljs.core.Atom.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.__GT_Atom = function(a, b, c, d) {
  return new cljs.core.Atom(a, b, c, d);
};
cljs.core.atom = function() {
  var a = null, b = function(a) {
    return new cljs.core.Atom(a, null, null, null);
  }, c = function() {
    var a = function(a, b) {
      var c = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, d = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "validator", "validator", -1966190681)), c = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "meta", "meta", 1499536964));
      return new cljs.core.Atom(a, c, d, null);
    }, b = function(b, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return a.call(this, b, e);
    };
    b.cljs$lang$maxFixedArity = 1;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.reset_BANG_ = function(a, b) {
  if (a instanceof cljs.core.Atom) {
    var c = a.validator;
    if (null != c && !cljs.core.truth_(c.call(null, b))) {
      throw Error("Assert failed: Validator rejected reference state\n" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "validate", "validate", 1439230700, null), new cljs.core.Symbol(null, "new-value", "new-value", -1567397401, null)))));
    }
    c = a.state;
    a.state = b;
    null != a.watches && cljs.core._notify_watches.call(null, a, c, b);
    return b;
  }
  return cljs.core._reset_BANG_.call(null, a, b);
};
cljs.core.swap_BANG_ = function() {
  var a = null, b = function(a, b) {
    return a instanceof cljs.core.Atom ? cljs.core.reset_BANG_.call(null, a, b.call(null, a.state)) : cljs.core._swap_BANG_.call(null, a, b);
  }, c = function(a, b, c) {
    return a instanceof cljs.core.Atom ? cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c)) : cljs.core._swap_BANG_.call(null, a, b, c);
  }, d = function(a, b, c, d) {
    return a instanceof cljs.core.Atom ? cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c, d)) : cljs.core._swap_BANG_.call(null, a, b, c, d);
  }, e = function() {
    var a = function(a, b, c, d, e) {
      return a instanceof cljs.core.Atom ? cljs.core.reset_BANG_.call(null, a, cljs.core.apply.call(null, b, a.state, c, d, e)) : cljs.core._swap_BANG_.call(null, a, b, c, d, e);
    }, b = function(b, c, d, e, g) {
      var p = null;
      4 < arguments.length && (p = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, p);
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, g, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, g, h, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, k);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, k, cljs.core.array_seq(arguments, 4));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.compare_and_set_BANG_ = function(a, b, c) {
  return cljs.core._EQ_.call(null, a.state, b) ? (cljs.core.reset_BANG_.call(null, a, c), !0) : !1;
};
cljs.core.set_validator_BANG_ = function(a, b) {
  return a.validator = b;
};
cljs.core.get_validator = function(a) {
  return a.validator;
};
cljs.core.keep_indexed = function() {
  var a = null, b = function(a) {
    return function(b) {
      return function(c) {
        return function() {
          var g = null, h = function() {
            return b.call(null);
          }, k = function(a) {
            return b.call(null, a);
          }, l = function(g, h) {
            var k = cljs.core.swap_BANG_.call(null, c, cljs.core.inc), k = a.call(null, k, h);
            return null == k ? g : b.call(null, g, k);
          }, g = function(a, b) {
            switch(arguments.length) {
              case 0:
                return h.call(this);
              case 1:
                return k.call(this, a);
              case 2:
                return l.call(this, a, b);
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          g.cljs$core$IFn$_invoke$arity$0 = h;
          g.cljs$core$IFn$_invoke$arity$1 = k;
          g.cljs$core$IFn$_invoke$arity$2 = l;
          return g;
        }();
      }(cljs.core.atom.call(null, -1));
    };
  }, c = function(a, b) {
    return function g(b, c) {
      return new cljs.core.LazySeq(null, function() {
        var e = cljs.core.seq.call(null, c);
        if (e) {
          if (cljs.core.chunked_seq_QMARK_.call(null, e)) {
            for (var m = cljs.core.chunk_first.call(null, e), n = cljs.core.count.call(null, m), p = cljs.core.chunk_buffer.call(null, n), q = 0;;) {
              if (q < n) {
                var r = a.call(null, b + q, cljs.core._nth.call(null, m, q));
                null != r && cljs.core.chunk_append.call(null, p, r);
                q += 1;
              } else {
                break;
              }
            }
            return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, p), g.call(null, b + n, cljs.core.chunk_rest.call(null, e)));
          }
          m = a.call(null, b, cljs.core.first.call(null, e));
          return null == m ? g.call(null, b + 1, cljs.core.rest.call(null, e)) : cljs.core.cons.call(null, m, g.call(null, b + 1, cljs.core.rest.call(null, e)));
        }
        return null;
      }, null, null);
    }.call(null, 0, b);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.every_pred = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function(b) {
        return cljs.core.boolean$.call(null, a.call(null, b));
      }, d = function(b, c) {
        return cljs.core.boolean$.call(null, function() {
          var d = a.call(null, b);
          return cljs.core.truth_(d) ? a.call(null, c) : d;
        }());
      }, e = function(b, c, d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, b);
          return cljs.core.truth_(e) ? (e = a.call(null, c), cljs.core.truth_(e) ? a.call(null, d) : e) : e;
        }());
      }, m = function() {
        var c = function(c, d, e, h) {
          return cljs.core.boolean$.call(null, b.call(null, c, d, e) && cljs.core.every_QMARK_.call(null, a, h));
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f);
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a);
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d;
      }(), b = function(a, b, f, g) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return c.call(this, a);
          case 2:
            return d.call(this, a, b);
          case 3:
            return e.call(this, a, b, f);
          default:
            return m.cljs$core$IFn$_invoke$arity$variadic(a, b, f, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = m.cljs$lang$applyTo;
      b.cljs$core$IFn$_invoke$arity$0 = function() {
        return!0;
      };
      b.cljs$core$IFn$_invoke$arity$1 = c;
      b.cljs$core$IFn$_invoke$arity$2 = d;
      b.cljs$core$IFn$_invoke$arity$3 = e;
      b.cljs$core$IFn$_invoke$arity$variadic = m.cljs$core$IFn$_invoke$arity$variadic;
      return b;
    }();
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c) {
        return cljs.core.boolean$.call(null, function() {
          var d = a.call(null, c);
          return cljs.core.truth_(d) ? b.call(null, c) : d;
        }());
      }, e = function(c, d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, c);
          return cljs.core.truth_(e) && (e = a.call(null, d), cljs.core.truth_(e)) ? (e = b.call(null, c), cljs.core.truth_(e) ? b.call(null, d) : e) : e;
        }());
      }, m = function(c, d, e) {
        return cljs.core.boolean$.call(null, function() {
          var h = a.call(null, c);
          return cljs.core.truth_(h) && (h = a.call(null, d), cljs.core.truth_(h) && (h = a.call(null, e), cljs.core.truth_(h) && (h = b.call(null, c), cljs.core.truth_(h)))) ? (h = b.call(null, d), cljs.core.truth_(h) ? b.call(null, e) : h) : h;
        }());
      }, n = function() {
        var d = function(d, e, k, l) {
          return cljs.core.boolean$.call(null, c.call(null, d, e, k) && cljs.core.every_QMARK_.call(null, function(c) {
            var d = a.call(null, c);
            return cljs.core.truth_(d) ? b.call(null, c) : d;
          }, l));
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f);
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a);
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e;
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return d.call(this, a);
          case 2:
            return e.call(this, a, b);
          case 3:
            return m.call(this, a, b, c);
          default:
            return n.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = n.cljs$lang$applyTo;
      c.cljs$core$IFn$_invoke$arity$0 = function() {
        return!0;
      };
      c.cljs$core$IFn$_invoke$arity$1 = d;
      c.cljs$core$IFn$_invoke$arity$2 = e;
      c.cljs$core$IFn$_invoke$arity$3 = m;
      c.cljs$core$IFn$_invoke$arity$variadic = n.cljs$core$IFn$_invoke$arity$variadic;
      return c;
    }();
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, d);
          return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e;
        }());
      }, m = function(d, e) {
        return cljs.core.boolean$.call(null, function() {
          var k = a.call(null, d);
          return cljs.core.truth_(k) && (k = b.call(null, d), cljs.core.truth_(k) && (k = c.call(null, d), cljs.core.truth_(k) && (k = a.call(null, e), cljs.core.truth_(k)))) ? (k = b.call(null, e), cljs.core.truth_(k) ? c.call(null, e) : k) : k;
        }());
      }, n = function(d, e, k) {
        return cljs.core.boolean$.call(null, function() {
          var l = a.call(null, d);
          return cljs.core.truth_(l) && (l = b.call(null, d), cljs.core.truth_(l) && (l = c.call(null, d), cljs.core.truth_(l) && (l = a.call(null, e), cljs.core.truth_(l) && (l = b.call(null, e), cljs.core.truth_(l) && (l = c.call(null, e), cljs.core.truth_(l) && (l = a.call(null, k), cljs.core.truth_(l))))))) ? (l = b.call(null, k), cljs.core.truth_(l) ? c.call(null, k) : l) : l;
        }());
      }, p = function() {
        var e = function(e, l, m, n) {
          return cljs.core.boolean$.call(null, d.call(null, e, l, m) && cljs.core.every_QMARK_.call(null, function(d) {
            var e = a.call(null, d);
            return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e;
          }, n));
        }, l = function(a, b, c, d) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f);
        };
        l.cljs$lang$maxFixedArity = 3;
        l.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.rest(a);
          return e(b, c, d, a);
        };
        l.cljs$core$IFn$_invoke$arity$variadic = e;
        return l;
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return e.call(this, a);
          case 2:
            return m.call(this, a, b);
          case 3:
            return n.call(this, a, b, c);
          default:
            return p.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = p.cljs$lang$applyTo;
      d.cljs$core$IFn$_invoke$arity$0 = function() {
        return!0;
      };
      d.cljs$core$IFn$_invoke$arity$1 = e;
      d.cljs$core$IFn$_invoke$arity$2 = m;
      d.cljs$core$IFn$_invoke$arity$3 = n;
      d.cljs$core$IFn$_invoke$arity$variadic = p.cljs$core$IFn$_invoke$arity$variadic;
      return d;
    }();
  }, e = function() {
    var a = function(a, b, c, d) {
      return function(a) {
        return function() {
          var b = null, c = function(b) {
            return cljs.core.every_QMARK_.call(null, function(a) {
              return function(a) {
                return a.call(null, b);
              };
            }(a), a);
          }, d = function(b, c) {
            return cljs.core.every_QMARK_.call(null, function(a) {
              return function(a) {
                var d = a.call(null, b);
                return cljs.core.truth_(d) ? a.call(null, c) : d;
              };
            }(a), a);
          }, e = function(b, c, d) {
            return cljs.core.every_QMARK_.call(null, function(a) {
              return function(a) {
                var e = a.call(null, b);
                return cljs.core.truth_(e) ? (e = a.call(null, c), cljs.core.truth_(e) ? a.call(null, d) : e) : e;
              };
            }(a), a);
          }, f = function() {
            var c = function(c, d, e, f) {
              return cljs.core.boolean$.call(null, b.call(null, c, d, e) && cljs.core.every_QMARK_.call(null, function(a) {
                return function(a) {
                  return cljs.core.every_QMARK_.call(null, a, f);
                };
              }(a), a));
            }, d = function(a, b, d, e) {
              var f = null;
              3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
              return c.call(this, a, b, d, f);
            };
            d.cljs$lang$maxFixedArity = 3;
            d.cljs$lang$applyTo = function(a) {
              var b = cljs.core.first(a);
              a = cljs.core.next(a);
              var d = cljs.core.first(a);
              a = cljs.core.next(a);
              var e = cljs.core.first(a);
              a = cljs.core.rest(a);
              return c(b, d, e, a);
            };
            d.cljs$core$IFn$_invoke$arity$variadic = c;
            return d;
          }(), b = function(a, b, g, h) {
            switch(arguments.length) {
              case 0:
                return!0;
              case 1:
                return c.call(this, a);
              case 2:
                return d.call(this, a, b);
              case 3:
                return e.call(this, a, b, g);
              default:
                return f.cljs$core$IFn$_invoke$arity$variadic(a, b, g, cljs.core.array_seq(arguments, 3));
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          b.cljs$lang$maxFixedArity = 3;
          b.cljs$lang$applyTo = f.cljs$lang$applyTo;
          b.cljs$core$IFn$_invoke$arity$0 = function() {
            return!0;
          };
          b.cljs$core$IFn$_invoke$arity$1 = c;
          b.cljs$core$IFn$_invoke$arity$2 = d;
          b.cljs$core$IFn$_invoke$arity$3 = e;
          b.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
          return b;
        }();
      }(cljs.core.list_STAR_.call(null, a, b, c, d));
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g);
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.some_fn = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function(b) {
        return a.call(null, b);
      }, d = function(b, c) {
        var d = a.call(null, b);
        return cljs.core.truth_(d) ? d : a.call(null, c);
      }, e = function(b, c, d) {
        b = a.call(null, b);
        if (cljs.core.truth_(b)) {
          return b;
        }
        c = a.call(null, c);
        return cljs.core.truth_(c) ? c : a.call(null, d);
      }, m = function() {
        var c = function(c, d, e, h) {
          c = b.call(null, c, d, e);
          return cljs.core.truth_(c) ? c : cljs.core.some.call(null, a, h);
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f);
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a);
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d;
      }(), b = function(a, b, f, g) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return c.call(this, a);
          case 2:
            return d.call(this, a, b);
          case 3:
            return e.call(this, a, b, f);
          default:
            return m.cljs$core$IFn$_invoke$arity$variadic(a, b, f, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = m.cljs$lang$applyTo;
      b.cljs$core$IFn$_invoke$arity$0 = function() {
        return null;
      };
      b.cljs$core$IFn$_invoke$arity$1 = c;
      b.cljs$core$IFn$_invoke$arity$2 = d;
      b.cljs$core$IFn$_invoke$arity$3 = e;
      b.cljs$core$IFn$_invoke$arity$variadic = m.cljs$core$IFn$_invoke$arity$variadic;
      return b;
    }();
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c) {
        var d = a.call(null, c);
        return cljs.core.truth_(d) ? d : b.call(null, c);
      }, e = function(c, d) {
        var e = a.call(null, c);
        if (cljs.core.truth_(e)) {
          return e;
        }
        e = a.call(null, d);
        if (cljs.core.truth_(e)) {
          return e;
        }
        e = b.call(null, c);
        return cljs.core.truth_(e) ? e : b.call(null, d);
      }, m = function(c, d, e) {
        var h = a.call(null, c);
        if (cljs.core.truth_(h)) {
          return h;
        }
        h = a.call(null, d);
        if (cljs.core.truth_(h)) {
          return h;
        }
        h = a.call(null, e);
        if (cljs.core.truth_(h)) {
          return h;
        }
        c = b.call(null, c);
        if (cljs.core.truth_(c)) {
          return c;
        }
        d = b.call(null, d);
        return cljs.core.truth_(d) ? d : b.call(null, e);
      }, n = function() {
        var d = function(d, e, k, l) {
          d = c.call(null, d, e, k);
          return cljs.core.truth_(d) ? d : cljs.core.some.call(null, function(c) {
            return function(c) {
              var d = a.call(null, c);
              return cljs.core.truth_(d) ? d : b.call(null, c);
            };
          }(d), l);
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f);
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a);
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e;
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return d.call(this, a);
          case 2:
            return e.call(this, a, b);
          case 3:
            return m.call(this, a, b, c);
          default:
            return n.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = n.cljs$lang$applyTo;
      c.cljs$core$IFn$_invoke$arity$0 = function() {
        return null;
      };
      c.cljs$core$IFn$_invoke$arity$1 = d;
      c.cljs$core$IFn$_invoke$arity$2 = e;
      c.cljs$core$IFn$_invoke$arity$3 = m;
      c.cljs$core$IFn$_invoke$arity$variadic = n.cljs$core$IFn$_invoke$arity$variadic;
      return c;
    }();
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d) {
        var e = a.call(null, d);
        if (cljs.core.truth_(e)) {
          return e;
        }
        e = b.call(null, d);
        return cljs.core.truth_(e) ? e : c.call(null, d);
      }, m = function(d, e) {
        var k = a.call(null, d);
        if (cljs.core.truth_(k)) {
          return k;
        }
        k = b.call(null, d);
        if (cljs.core.truth_(k)) {
          return k;
        }
        k = c.call(null, d);
        if (cljs.core.truth_(k)) {
          return k;
        }
        k = a.call(null, e);
        if (cljs.core.truth_(k)) {
          return k;
        }
        k = b.call(null, e);
        return cljs.core.truth_(k) ? k : c.call(null, e);
      }, n = function(d, e, k) {
        var l = a.call(null, d);
        if (cljs.core.truth_(l)) {
          return l;
        }
        l = b.call(null, d);
        if (cljs.core.truth_(l)) {
          return l;
        }
        d = c.call(null, d);
        if (cljs.core.truth_(d)) {
          return d;
        }
        d = a.call(null, e);
        if (cljs.core.truth_(d)) {
          return d;
        }
        d = b.call(null, e);
        if (cljs.core.truth_(d)) {
          return d;
        }
        e = c.call(null, e);
        if (cljs.core.truth_(e)) {
          return e;
        }
        e = a.call(null, k);
        if (cljs.core.truth_(e)) {
          return e;
        }
        e = b.call(null, k);
        return cljs.core.truth_(e) ? e : c.call(null, k);
      }, p = function() {
        var e = function(e, l, m, n) {
          e = d.call(null, e, l, m);
          return cljs.core.truth_(e) ? e : cljs.core.some.call(null, function(d) {
            return function(d) {
              var e = a.call(null, d);
              if (cljs.core.truth_(e)) {
                return e;
              }
              e = b.call(null, d);
              return cljs.core.truth_(e) ? e : c.call(null, d);
            };
          }(e), n);
        }, l = function(a, b, c, d) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f);
        };
        l.cljs$lang$maxFixedArity = 3;
        l.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.rest(a);
          return e(b, c, d, a);
        };
        l.cljs$core$IFn$_invoke$arity$variadic = e;
        return l;
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return e.call(this, a);
          case 2:
            return m.call(this, a, b);
          case 3:
            return n.call(this, a, b, c);
          default:
            return p.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = p.cljs$lang$applyTo;
      d.cljs$core$IFn$_invoke$arity$0 = function() {
        return null;
      };
      d.cljs$core$IFn$_invoke$arity$1 = e;
      d.cljs$core$IFn$_invoke$arity$2 = m;
      d.cljs$core$IFn$_invoke$arity$3 = n;
      d.cljs$core$IFn$_invoke$arity$variadic = p.cljs$core$IFn$_invoke$arity$variadic;
      return d;
    }();
  }, e = function() {
    var a = function(a, b, c, d) {
      return function(a) {
        return function() {
          var b = null, c = function(b) {
            return cljs.core.some.call(null, function(a) {
              return function(a) {
                return a.call(null, b);
              };
            }(a), a);
          }, d = function(b, c) {
            return cljs.core.some.call(null, function(a) {
              return function(a) {
                var d = a.call(null, b);
                return cljs.core.truth_(d) ? d : a.call(null, c);
              };
            }(a), a);
          }, e = function(b, c, d) {
            return cljs.core.some.call(null, function(a) {
              return function(a) {
                var e = a.call(null, b);
                if (cljs.core.truth_(e)) {
                  return e;
                }
                e = a.call(null, c);
                return cljs.core.truth_(e) ? e : a.call(null, d);
              };
            }(a), a);
          }, f = function() {
            var c = function(c, d, e, f) {
              c = b.call(null, c, d, e);
              return cljs.core.truth_(c) ? c : cljs.core.some.call(null, function(a, b) {
                return function(a) {
                  return cljs.core.some.call(null, a, f);
                };
              }(c, a), a);
            }, d = function(a, b, d, e) {
              var f = null;
              3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
              return c.call(this, a, b, d, f);
            };
            d.cljs$lang$maxFixedArity = 3;
            d.cljs$lang$applyTo = function(a) {
              var b = cljs.core.first(a);
              a = cljs.core.next(a);
              var d = cljs.core.first(a);
              a = cljs.core.next(a);
              var e = cljs.core.first(a);
              a = cljs.core.rest(a);
              return c(b, d, e, a);
            };
            d.cljs$core$IFn$_invoke$arity$variadic = c;
            return d;
          }(), b = function(a, b, g, h) {
            switch(arguments.length) {
              case 0:
                return null;
              case 1:
                return c.call(this, a);
              case 2:
                return d.call(this, a, b);
              case 3:
                return e.call(this, a, b, g);
              default:
                return f.cljs$core$IFn$_invoke$arity$variadic(a, b, g, cljs.core.array_seq(arguments, 3));
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          b.cljs$lang$maxFixedArity = 3;
          b.cljs$lang$applyTo = f.cljs$lang$applyTo;
          b.cljs$core$IFn$_invoke$arity$0 = function() {
            return null;
          };
          b.cljs$core$IFn$_invoke$arity$1 = c;
          b.cljs$core$IFn$_invoke$arity$2 = d;
          b.cljs$core$IFn$_invoke$arity$3 = e;
          b.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
          return b;
        }();
      }(cljs.core.list_STAR_.call(null, a, b, c, d));
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g);
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.map = function() {
  var a = null, b = function(a) {
    return function(b) {
      return function() {
        var c = null, d = function() {
          return b.call(null);
        }, e = function(a) {
          return b.call(null, a);
        }, f = function(c, d) {
          return b.call(null, c, a.call(null, d));
        }, p = function() {
          var c = function(c, d, e) {
            return b.call(null, c, cljs.core.apply.call(null, a, d, e));
          }, d = function(a, b, d) {
            var e = null;
            2 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
            return c.call(this, a, b, e);
          };
          d.cljs$lang$maxFixedArity = 2;
          d.cljs$lang$applyTo = function(a) {
            var b = cljs.core.first(a);
            a = cljs.core.next(a);
            var d = cljs.core.first(a);
            a = cljs.core.rest(a);
            return c(b, d, a);
          };
          d.cljs$core$IFn$_invoke$arity$variadic = c;
          return d;
        }(), c = function(a, b, c) {
          switch(arguments.length) {
            case 0:
              return d.call(this);
            case 1:
              return e.call(this, a);
            case 2:
              return f.call(this, a, b);
            default:
              return p.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2));
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        c.cljs$lang$maxFixedArity = 2;
        c.cljs$lang$applyTo = p.cljs$lang$applyTo;
        c.cljs$core$IFn$_invoke$arity$0 = d;
        c.cljs$core$IFn$_invoke$arity$1 = e;
        c.cljs$core$IFn$_invoke$arity$2 = f;
        c.cljs$core$IFn$_invoke$arity$variadic = p.cljs$core$IFn$_invoke$arity$variadic;
        return c;
      }();
    };
  }, c = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var d = cljs.core.seq.call(null, c);
      if (d) {
        if (cljs.core.chunked_seq_QMARK_.call(null, d)) {
          for (var e = cljs.core.chunk_first.call(null, d), f = cljs.core.count.call(null, e), n = cljs.core.chunk_buffer.call(null, f), p = 0;;) {
            if (p < f) {
              cljs.core.chunk_append.call(null, n, b.call(null, cljs.core._nth.call(null, e, p))), p += 1;
            } else {
              break;
            }
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, n), a.call(null, b, cljs.core.chunk_rest.call(null, d)));
        }
        return cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, d)), a.call(null, b, cljs.core.rest.call(null, d)));
      }
      return null;
    }, null, null);
  }, d = function(b, c, d) {
    return new cljs.core.LazySeq(null, function() {
      var e = cljs.core.seq.call(null, c), f = cljs.core.seq.call(null, d);
      return e && f ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, e), cljs.core.first.call(null, f)), a.call(null, b, cljs.core.rest.call(null, e), cljs.core.rest.call(null, f))) : null;
    }, null, null);
  }, e = function(b, c, d, e) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, c), n = cljs.core.seq.call(null, d), p = cljs.core.seq.call(null, e);
      return f && n && p ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, f), cljs.core.first.call(null, n), cljs.core.first.call(null, p)), a.call(null, b, cljs.core.rest.call(null, f), cljs.core.rest.call(null, n), cljs.core.rest.call(null, p))) : null;
    }, null, null);
  }, f = function() {
    var b = function(b, c, d, e, f) {
      var g = function s(b) {
        return new cljs.core.LazySeq(null, function() {
          var c = a.call(null, cljs.core.seq, b);
          return cljs.core.every_QMARK_.call(null, cljs.core.identity, c) ? cljs.core.cons.call(null, a.call(null, cljs.core.first, c), s.call(null, a.call(null, cljs.core.rest, c))) : null;
        }, null, null);
      };
      return a.call(null, function(a) {
        return function(a) {
          return cljs.core.apply.call(null, b, a);
        };
      }(g), g.call(null, cljs.core.conj.call(null, f, e, d, c)));
    }, c = function(a, c, d, e, f) {
      var h = null;
      4 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return b.call(this, a, c, d, e, h);
    };
    c.cljs$lang$maxFixedArity = 4;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var f = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, e, f, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, h, k, l, m) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, h);
      case 3:
        return d.call(this, a, h, k);
      case 4:
        return e.call(this, a, h, k, l);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, cljs.core.array_seq(arguments, 4));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$4 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.take = function() {
  var a = null, b = function(a) {
    return function(b) {
      return function(a) {
        return function() {
          var c = null, d = function() {
            return b.call(null);
          }, k = function(a) {
            return b.call(null, a);
          }, l = function(c, d) {
            var g = cljs.core.deref.call(null, a), h = cljs.core.swap_BANG_.call(null, a, cljs.core.dec), g = 0 < g ? b.call(null, c, d) : c;
            return 0 < h ? g : cljs.core.reduced.call(null, g);
          }, c = function(a, b) {
            switch(arguments.length) {
              case 0:
                return d.call(this);
              case 1:
                return k.call(this, a);
              case 2:
                return l.call(this, a, b);
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          c.cljs$core$IFn$_invoke$arity$0 = d;
          c.cljs$core$IFn$_invoke$arity$1 = k;
          c.cljs$core$IFn$_invoke$arity$2 = l;
          return c;
        }();
      }(cljs.core.atom.call(null, a));
    };
  }, c = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      if (0 < b) {
        var f = cljs.core.seq.call(null, c);
        return f ? cljs.core.cons.call(null, cljs.core.first.call(null, f), a.call(null, b - 1, cljs.core.rest.call(null, f))) : null;
      }
      return null;
    }, null, null);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.drop = function() {
  var a = null, b = function(a) {
    return function(b) {
      return function(a) {
        return function() {
          var c = null, d = function() {
            return b.call(null);
          }, k = function(a) {
            return b.call(null, a);
          }, l = function(c, d) {
            var g = cljs.core.deref.call(null, a);
            cljs.core.swap_BANG_.call(null, a, cljs.core.dec);
            return 0 < g ? c : b.call(null, c, d);
          }, c = function(a, b) {
            switch(arguments.length) {
              case 0:
                return d.call(this);
              case 1:
                return k.call(this, a);
              case 2:
                return l.call(this, a, b);
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          c.cljs$core$IFn$_invoke$arity$0 = d;
          c.cljs$core$IFn$_invoke$arity$1 = k;
          c.cljs$core$IFn$_invoke$arity$2 = l;
          return c;
        }();
      }(cljs.core.atom.call(null, a));
    };
  }, c = function(a, b) {
    return new cljs.core.LazySeq(null, function(c) {
      return function() {
        return c.call(null, a, b);
      };
    }(function(a, b) {
      for (;;) {
        var c = cljs.core.seq.call(null, b);
        if (0 < a && c) {
          var d = a - 1, c = cljs.core.rest.call(null, c);
          a = d;
          b = c;
        } else {
          return c;
        }
      }
    }), null, null);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.drop_last = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b);
  }, c = function(a, b) {
    return cljs.core.map.call(null, function(a, b) {
      return a;
    }, b, cljs.core.drop.call(null, a, b));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.take_last = function(a, b) {
  for (var c = cljs.core.seq.call(null, b), d = cljs.core.seq.call(null, cljs.core.drop.call(null, a, b));;) {
    if (d) {
      c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d);
    } else {
      return c;
    }
  }
};
cljs.core.drop_while = function() {
  var a = null, b = function(a) {
    return function(b) {
      return function(c) {
        return function() {
          var g = null, h = function() {
            return b.call(null);
          }, k = function(a) {
            return b.call(null, a);
          }, l = function(g, h) {
            var k = cljs.core.deref.call(null, c);
            if (cljs.core.truth_(cljs.core.truth_(k) ? a.call(null, h) : k)) {
              return g;
            }
            cljs.core.reset_BANG_.call(null, c, null);
            return b.call(null, g, h);
          }, g = function(a, b) {
            switch(arguments.length) {
              case 0:
                return h.call(this);
              case 1:
                return k.call(this, a);
              case 2:
                return l.call(this, a, b);
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          g.cljs$core$IFn$_invoke$arity$0 = h;
          g.cljs$core$IFn$_invoke$arity$1 = k;
          g.cljs$core$IFn$_invoke$arity$2 = l;
          return g;
        }();
      }(cljs.core.atom.call(null, !0));
    };
  }, c = function(a, b) {
    return new cljs.core.LazySeq(null, function(c) {
      return function() {
        return c.call(null, a, b);
      };
    }(function(a, b) {
      for (;;) {
        var c = cljs.core.seq.call(null, b);
        if (cljs.core.truth_(function() {
          var b = c;
          return b ? a.call(null, cljs.core.first.call(null, c)) : b;
        }())) {
          var d = a, e = cljs.core.rest.call(null, c);
          a = d;
          b = e;
        } else {
          return c;
        }
      }
    }), null, null);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.cycle = function cycle(b) {
  return new cljs.core.LazySeq(null, function() {
    var c = cljs.core.seq.call(null, b);
    return c ? cljs.core.concat.call(null, c, cycle.call(null, c)) : null;
  }, null, null);
};
cljs.core.split_at = function(a, b) {
  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.take.call(null, a, b), cljs.core.drop.call(null, a, b)], null);
};
cljs.core.repeat = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, function() {
      return cljs.core.cons.call(null, b, a.call(null, b));
    }, null, null);
  }, c = function(b, c) {
    return cljs.core.take.call(null, b, a.call(null, c));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.replicate = function(a, b) {
  return cljs.core.take.call(null, a, cljs.core.repeat.call(null, b));
};
cljs.core.repeatedly = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, function() {
      return cljs.core.cons.call(null, b.call(null), a.call(null, b));
    }, null, null);
  }, c = function(b, c) {
    return cljs.core.take.call(null, b, a.call(null, c));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.iterate = function iterate(b, c) {
  return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, function() {
    return iterate.call(null, b, b.call(null, c));
  }, null, null));
};
cljs.core.interleave = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, b), g = cljs.core.seq.call(null, c);
      return f && g ? cljs.core.cons.call(null, cljs.core.first.call(null, f), cljs.core.cons.call(null, cljs.core.first.call(null, g), a.call(null, cljs.core.rest.call(null, f), cljs.core.rest.call(null, g)))) : null;
    }, null, null);
  }, c = function() {
    var b = function(b, c, d) {
      return new cljs.core.LazySeq(null, function() {
        var e = cljs.core.map.call(null, cljs.core.seq, cljs.core.conj.call(null, d, c, b));
        return cljs.core.every_QMARK_.call(null, cljs.core.identity, e) ? cljs.core.concat.call(null, cljs.core.map.call(null, cljs.core.first, e), cljs.core.apply.call(null, a, cljs.core.map.call(null, cljs.core.rest, e))) : null;
      }, null, null);
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.interpose = function(a, b) {
  return cljs.core.drop.call(null, 1, cljs.core.interleave.call(null, cljs.core.repeat.call(null, a), b));
};
cljs.core.flatten1 = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, a);
      return f ? cljs.core.cons.call(null, cljs.core.first.call(null, f), c.call(null, cljs.core.rest.call(null, f), e)) : cljs.core.seq.call(null, e) ? c.call(null, cljs.core.first.call(null, e), cljs.core.rest.call(null, e)) : null;
    }, null, null);
  }.call(null, null, a);
};
cljs.core.mapcat = function() {
  var a = null, b = function(a) {
    return cljs.core.comp.call(null, cljs.core.map.call(null, a), cljs.core.cat);
  }, c = function() {
    var a = function(a, b) {
      return cljs.core.apply.call(null, cljs.core.concat, cljs.core.apply.call(null, cljs.core.map, a, b));
    }, b = function(b, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return a.call(this, b, e);
    };
    b.cljs$lang$maxFixedArity = 1;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.filter = function() {
  var a = null, b = function(a) {
    return function(b) {
      return function() {
        var c = null, g = function() {
          return b.call(null);
        }, h = function(a) {
          return b.call(null, a);
        }, k = function(c, f) {
          return cljs.core.truth_(a.call(null, f)) ? b.call(null, c, f) : c;
        }, c = function(a, b) {
          switch(arguments.length) {
            case 0:
              return g.call(this);
            case 1:
              return h.call(this, a);
            case 2:
              return k.call(this, a, b);
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        c.cljs$core$IFn$_invoke$arity$0 = g;
        c.cljs$core$IFn$_invoke$arity$1 = h;
        c.cljs$core$IFn$_invoke$arity$2 = k;
        return c;
      }();
    };
  }, c = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, c);
      if (f) {
        if (cljs.core.chunked_seq_QMARK_.call(null, f)) {
          for (var g = cljs.core.chunk_first.call(null, f), h = cljs.core.count.call(null, g), k = cljs.core.chunk_buffer.call(null, h), l = 0;;) {
            if (l < h) {
              cljs.core.truth_(b.call(null, cljs.core._nth.call(null, g, l))) && cljs.core.chunk_append.call(null, k, cljs.core._nth.call(null, g, l)), l += 1;
            } else {
              break;
            }
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, k), a.call(null, b, cljs.core.chunk_rest.call(null, f)));
        }
        g = cljs.core.first.call(null, f);
        f = cljs.core.rest.call(null, f);
        return cljs.core.truth_(b.call(null, g)) ? cljs.core.cons.call(null, g, a.call(null, b, f)) : a.call(null, b, f);
      }
      return null;
    }, null, null);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.remove = function() {
  var a = null, b = function(a) {
    return cljs.core.filter.call(null, cljs.core.complement.call(null, a));
  }, c = function(a, b) {
    return cljs.core.filter.call(null, cljs.core.complement.call(null, a), b);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.tree_seq = function(a, b, c) {
  return function e(c) {
    return new cljs.core.LazySeq(null, function() {
      return cljs.core.cons.call(null, c, cljs.core.truth_(a.call(null, c)) ? cljs.core.mapcat.call(null, e, b.call(null, c)) : null);
    }, null, null);
  }.call(null, c);
};
cljs.core.flatten = function(a) {
  return cljs.core.filter.call(null, function(a) {
    return!cljs.core.sequential_QMARK_.call(null, a);
  }, cljs.core.rest.call(null, cljs.core.tree_seq.call(null, cljs.core.sequential_QMARK_, cljs.core.seq, a)));
};
cljs.core.into = function() {
  var a = null, b = function(a, b) {
    return null != a ? a && (a.cljs$lang$protocol_mask$partition1$ & 4 || a.cljs$core$IEditableCollection$) ? cljs.core.with_meta.call(null, cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, cljs.core._conj_BANG_, cljs.core.transient$.call(null, a), b)), cljs.core.meta.call(null, a)) : cljs.core.reduce.call(null, cljs.core._conj, a, b) : cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, b);
  }, c = function(a, b, c) {
    return a && (a.cljs$lang$protocol_mask$partition1$ & 4 || a.cljs$core$IEditableCollection$) ? cljs.core.with_meta.call(null, cljs.core.persistent_BANG_.call(null, cljs.core.transduce.call(null, b, cljs.core.conj_BANG_, cljs.core.transient$.call(null, a), c)), cljs.core.meta.call(null, a)) : cljs.core.transduce.call(null, b, cljs.core.conj, a, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.mapv = function() {
  var a = null, b = function(a, b) {
    return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(b, c) {
      return cljs.core.conj_BANG_.call(null, b, a.call(null, c));
    }, cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY), b));
  }, c = function(a, b, c) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.map.call(null, a, b, c));
  }, d = function(a, b, c, d) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.map.call(null, a, b, c, d));
  }, e = function() {
    var a = function(a, b, c, d, e) {
      return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.apply.call(null, cljs.core.map, a, b, c, d, e));
    }, b = function(b, c, d, e, g) {
      var p = null;
      4 < arguments.length && (p = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, p);
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, g, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, g, h, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, k);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, k, cljs.core.array_seq(arguments, 4));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.filterv = function(a, b) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(b, d) {
    return cljs.core.truth_(a.call(null, d)) ? cljs.core.conj_BANG_.call(null, b, d) : b;
  }, cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY), b));
};
cljs.core.partition = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, b, c);
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, function() {
      var h = cljs.core.seq.call(null, d);
      if (h) {
        var k = cljs.core.take.call(null, b, h);
        return b === cljs.core.count.call(null, k) ? cljs.core.cons.call(null, k, a.call(null, b, c, cljs.core.drop.call(null, c, h))) : null;
      }
      return null;
    }, null, null);
  }, d = function(b, c, d, h) {
    return new cljs.core.LazySeq(null, function() {
      var k = cljs.core.seq.call(null, h);
      if (k) {
        var l = cljs.core.take.call(null, b, k);
        return b === cljs.core.count.call(null, l) ? cljs.core.cons.call(null, l, a.call(null, b, c, d, cljs.core.drop.call(null, c, k))) : cljs.core._conj.call(null, cljs.core.List.EMPTY, cljs.core.take.call(null, b, cljs.core.concat.call(null, l, d)));
      }
      return null;
    }, null, null);
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a;
}();
cljs.core.get_in = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, null);
  }, c = function(a, b, c) {
    var g = cljs.core.lookup_sentinel;
    for (b = cljs.core.seq.call(null, b);;) {
      if (b) {
        var h = a;
        if (h ? h.cljs$lang$protocol_mask$partition0$ & 256 || h.cljs$core$ILookup$ || (h.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ILookup, h)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ILookup, h)) {
          a = cljs.core.get.call(null, a, cljs.core.first.call(null, b), g);
          if (g === a) {
            return c;
          }
          b = cljs.core.next.call(null, b);
        } else {
          return c;
        }
      } else {
        return a;
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.assoc_in = function assoc_in(b, c, d) {
  var e = cljs.core.nth.call(null, c, 0, null);
  return(c = cljs.core.nthnext.call(null, c, 1)) ? cljs.core.assoc.call(null, b, e, assoc_in.call(null, cljs.core.get.call(null, b, e), c, d)) : cljs.core.assoc.call(null, b, e, d);
};
cljs.core.update_in = function() {
  var a = null, b = function(b, c, d) {
    var e = cljs.core.nth.call(null, c, 0, null);
    return(c = cljs.core.nthnext.call(null, c, 1)) ? cljs.core.assoc.call(null, b, e, a.call(null, cljs.core.get.call(null, b, e), c, d)) : cljs.core.assoc.call(null, b, e, d.call(null, cljs.core.get.call(null, b, e)));
  }, c = function(b, c, d, e) {
    var f = cljs.core.nth.call(null, c, 0, null);
    return(c = cljs.core.nthnext.call(null, c, 1)) ? cljs.core.assoc.call(null, b, f, a.call(null, cljs.core.get.call(null, b, f), c, d, e)) : cljs.core.assoc.call(null, b, f, d.call(null, cljs.core.get.call(null, b, f), e));
  }, d = function(b, c, d, e, f) {
    var n = cljs.core.nth.call(null, c, 0, null);
    return(c = cljs.core.nthnext.call(null, c, 1)) ? cljs.core.assoc.call(null, b, n, a.call(null, cljs.core.get.call(null, b, n), c, d, e, f)) : cljs.core.assoc.call(null, b, n, d.call(null, cljs.core.get.call(null, b, n), e, f));
  }, e = function(b, c, d, e, f, n) {
    var p = cljs.core.nth.call(null, c, 0, null);
    return(c = cljs.core.nthnext.call(null, c, 1)) ? cljs.core.assoc.call(null, b, p, a.call(null, cljs.core.get.call(null, b, p), c, d, e, f, n)) : cljs.core.assoc.call(null, b, p, d.call(null, cljs.core.get.call(null, b, p), e, f, n));
  }, f = function() {
    var b = function(b, c, d, e, f, g, h) {
      var s = cljs.core.nth.call(null, c, 0, null);
      return(c = cljs.core.nthnext.call(null, c, 1)) ? cljs.core.assoc.call(null, b, s, cljs.core.apply.call(null, a, cljs.core.get.call(null, b, s), c, d, e, f, g, h)) : cljs.core.assoc.call(null, b, s, cljs.core.apply.call(null, d, cljs.core.get.call(null, b, s), e, f, g, h));
    }, c = function(a, c, d, e, f, h, r) {
      var s = null;
      6 < arguments.length && (s = cljs.core.array_seq(Array.prototype.slice.call(arguments, 6), 0));
      return b.call(this, a, c, d, e, f, h, s);
    };
    c.cljs$lang$maxFixedArity = 6;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var f = cljs.core.first(a);
      a = cljs.core.next(a);
      var h = cljs.core.first(a);
      a = cljs.core.next(a);
      var r = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, e, f, h, r, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, h, k, l, m, n, p) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, h, k);
      case 4:
        return c.call(this, a, h, k, l);
      case 5:
        return d.call(this, a, h, k, l, m);
      case 6:
        return e.call(this, a, h, k, l, m, n);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, m, n, cljs.core.array_seq(arguments, 6));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 6;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  a.cljs$core$IFn$_invoke$arity$5 = d;
  a.cljs$core$IFn$_invoke$arity$6 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.VectorNode = function(a, b) {
  this.edit = a;
  this.arr = b;
};
cljs.core.VectorNode.cljs$lang$type = !0;
cljs.core.VectorNode.cljs$lang$ctorStr = "cljs.core/VectorNode";
cljs.core.VectorNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/VectorNode");
};
cljs.core.__GT_VectorNode = function(a, b) {
  return new cljs.core.VectorNode(a, b);
};
cljs.core.pv_fresh_node = function(a) {
  return new cljs.core.VectorNode(a, [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
};
cljs.core.pv_aget = function(a, b) {
  return a.arr[b];
};
cljs.core.pv_aset = function(a, b, c) {
  return a.arr[b] = c;
};
cljs.core.pv_clone_node = function(a) {
  return new cljs.core.VectorNode(a.edit, cljs.core.aclone.call(null, a.arr));
};
cljs.core.tail_off = function(a) {
  a = a.cnt;
  return 32 > a ? 0 : a - 1 >>> 5 << 5;
};
cljs.core.new_path = function(a, b, c) {
  for (;;) {
    if (0 === b) {
      return c;
    }
    var d = cljs.core.pv_fresh_node.call(null, a);
    cljs.core.pv_aset.call(null, d, 0, c);
    c = d;
    b -= 5;
  }
};
cljs.core.push_tail = function push_tail(b, c, d, e) {
  var f = cljs.core.pv_clone_node.call(null, d), g = b.cnt - 1 >>> c & 31;
  5 === c ? cljs.core.pv_aset.call(null, f, g, e) : (d = cljs.core.pv_aget.call(null, d, g), b = null != d ? push_tail.call(null, b, c - 5, d, e) : cljs.core.new_path.call(null, null, c - 5, e), cljs.core.pv_aset.call(null, f, g, b));
  return f;
};
cljs.core.vector_index_out_of_bounds = function(a, b) {
  throw Error("No item " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a) + " in vector of length " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b));
};
cljs.core.first_array_for_longvec = function(a) {
  var b = a.root;
  for (a = a.shift;;) {
    if (0 < a) {
      b = cljs.core.pv_aget.call(null, b, 0), a -= 5;
    } else {
      return b.arr;
    }
  }
};
cljs.core.unchecked_array_for = function(a, b) {
  if (b >= cljs.core.tail_off.call(null, a)) {
    return a.tail;
  }
  for (var c = a.root, d = a.shift;;) {
    if (0 < d) {
      c = cljs.core.pv_aget.call(null, c, b >>> d & 31), d -= 5;
    } else {
      return c.arr;
    }
  }
};
cljs.core.array_for = function(a, b) {
  return 0 <= b && b < a.cnt ? cljs.core.unchecked_array_for.call(null, a, b) : cljs.core.vector_index_out_of_bounds.call(null, b, a.cnt);
};
cljs.core.do_assoc = function do_assoc(b, c, d, e, f) {
  var g = cljs.core.pv_clone_node.call(null, d);
  if (0 === c) {
    cljs.core.pv_aset.call(null, g, e & 31, f);
  } else {
    var h = e >>> c & 31;
    cljs.core.pv_aset.call(null, g, h, do_assoc.call(null, b, c - 5, cljs.core.pv_aget.call(null, d, h), e, f));
  }
  return g;
};
cljs.core.pop_tail = function pop_tail(b, c, d) {
  var e = b.cnt - 2 >>> c & 31;
  if (5 < c) {
    b = pop_tail.call(null, b, c - 5, cljs.core.pv_aget.call(null, d, e));
    if (null == b && 0 === e) {
      return null;
    }
    d = cljs.core.pv_clone_node.call(null, d);
    cljs.core.pv_aset.call(null, d, e, b);
    return d;
  }
  if (0 === e) {
    return null;
  }
  d = cljs.core.pv_clone_node.call(null, d);
  cljs.core.pv_aset.call(null, d, e, null);
  return d;
};
cljs.core.RangedIterator = function(a, b, c, d, e, f) {
  this.i = a;
  this.base = b;
  this.arr = c;
  this.v = d;
  this.start = e;
  this.end = f;
};
cljs.core.RangedIterator.cljs$lang$type = !0;
cljs.core.RangedIterator.cljs$lang$ctorStr = "cljs.core/RangedIterator";
cljs.core.RangedIterator.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/RangedIterator");
};
cljs.core.RangedIterator.prototype.hasNext = function() {
  return this.i < this.end;
};
cljs.core.RangedIterator.prototype.next = function() {
  32 === this.i - this.base && (this.arr = cljs.core.unchecked_array_for.call(null, this.v, this.i), this.base += 32);
  var a = this.arr[this.i & 31];
  this.i += 1;
  return a;
};
cljs.core.__GT_RangedIterator = function(a, b, c, d, e, f) {
  return new cljs.core.RangedIterator(a, b, c, d, e, f);
};
cljs.core.ranged_iterator = function(a, b, c) {
  return new cljs.core.RangedIterator(b, b - b % 32, b < cljs.core.count.call(null, a) ? cljs.core.unchecked_array_for.call(null, a, b) : null, a, b, c);
};
cljs.core.PersistentVector = function(a, b, c, d, e, f) {
  this.meta = a;
  this.cnt = b;
  this.shift = c;
  this.root = d;
  this.tail = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition0$ = 167668511;
  this.cljs$lang$protocol_mask$partition1$ = 8196;
};
cljs.core.PersistentVector.cljs$lang$type = !0;
cljs.core.PersistentVector.cljs$lang$ctorStr = "cljs.core/PersistentVector";
cljs.core.PersistentVector.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentVector");
};
cljs.core.PersistentVector.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentVector.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return "number" === typeof b ? cljs.core._nth.call(null, this, b, c) : c;
};
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  a = 0;
  for (var d = c;;) {
    if (a < this.cnt) {
      var e = cljs.core.unchecked_array_for.call(null, this, a);
      c = e.length;
      a: {
        for (var f = 0;;) {
          if (f < c) {
            if (d = b.call(null, d, f + a, e[f]), cljs.core.reduced_QMARK_.call(null, d)) {
              e = d;
              break a;
            } else {
              f += 1;
            }
          } else {
            e = d;
            break a;
          }
        }
        e = void 0;
      }
      if (cljs.core.reduced_QMARK_.call(null, e)) {
        return cljs.core.deref.call(null, e);
      }
      a += c;
      d = e;
    } else {
      return d;
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return cljs.core.array_for.call(null, this, b)[b & 31];
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 <= b && b < this.cnt ? cljs.core.unchecked_array_for.call(null, this, b)[b & 31] : c;
};
cljs.core.PersistentVector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  if (0 <= b && b < this.cnt) {
    return cljs.core.tail_off.call(null, this) <= b ? (a = cljs.core.aclone.call(null, this.tail), a[b & 31] = c, new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, this.root, a, null)) : new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, cljs.core.do_assoc.call(null, this, this.shift, this.root, b, c), this.tail, null);
  }
  if (b === this.cnt) {
    return cljs.core._conj.call(null, this, c);
  }
  throw Error("Index " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b) + " out of bounds  [0," + cljs.core.str.cljs$core$IFn$_invoke$arity$1(this.cnt) + "]");
};
cljs.core.PersistentVector.prototype.cljs$core$IIterable$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IIterable$_iterator$arity$1 = function(a) {
  return cljs.core.ranged_iterator.call(null, this, 0, this.cnt);
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentVector.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, this.root, this.tail, this.__hash);
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt;
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return cljs.core._nth.call(null, this, 0);
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return cljs.core._nth.call(null, this, 1);
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return 0 < this.cnt ? cljs.core._nth.call(null, this, this.cnt - 1) : null;
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  if (0 === this.cnt) {
    throw Error("Can't pop empty vector");
  }
  if (1 === this.cnt) {
    return cljs.core._with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta);
  }
  if (1 < this.cnt - cljs.core.tail_off.call(null, this)) {
    return new cljs.core.PersistentVector(this.meta, this.cnt - 1, this.shift, this.root, this.tail.slice(0, -1), null);
  }
  a = cljs.core.unchecked_array_for.call(null, this, this.cnt - 2);
  var b = cljs.core.pop_tail.call(null, this, this.shift, this.root), b = null == b ? cljs.core.PersistentVector.EMPTY_NODE : b, c = this.cnt - 1;
  return 5 < this.shift && null == cljs.core.pv_aget.call(null, b, 1) ? new cljs.core.PersistentVector(this.meta, c, this.shift - 5, cljs.core.pv_aget.call(null, b, 0), a, null) : new cljs.core.PersistentVector(this.meta, c, this.shift, b, a, null);
};
cljs.core.PersistentVector.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return 0 < this.cnt ? new cljs.core.RSeq(this, this.cnt - 1, null) : null;
};
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  if (b instanceof cljs.core.PersistentVector) {
    if (this.cnt === cljs.core.count.call(null, b)) {
      for (var c = cljs.core._iterator.call(null, this), d = cljs.core._iterator.call(null, b);;) {
        if (cljs.core.truth_(c.hasNext())) {
          var e = c.next(), f = d.next();
          if (!cljs.core._EQ_.call(null, e, f)) {
            return!1;
          }
        } else {
          return!0;
        }
      }
    } else {
      return!1;
    }
  } else {
    return cljs.core.equiv_sequential.call(null, this, b);
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientVector(this.cnt, this.shift, cljs.core.tv_editable_root.call(null, this.root), cljs.core.tv_editable_tail.call(null, this.tail));
};
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta);
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, this, b);
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  a = 0;
  for (var d = c;;) {
    if (a < this.cnt) {
      var e = cljs.core.unchecked_array_for.call(null, this, a);
      c = e.length;
      a: {
        for (var f = 0;;) {
          if (f < c) {
            if (d = b.call(null, d, e[f]), cljs.core.reduced_QMARK_.call(null, d)) {
              e = d;
              break a;
            } else {
              f += 1;
            }
          } else {
            e = d;
            break a;
          }
        }
        e = void 0;
      }
      if (cljs.core.reduced_QMARK_.call(null, e)) {
        return cljs.core.deref.call(null, e);
      }
      a += c;
      d = e;
    } else {
      return d;
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if ("number" === typeof b) {
    return cljs.core._assoc_n.call(null, this, b, c);
  }
  throw Error("Vector's key for assoc must be a number.");
};
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 === this.cnt ? null : 32 >= this.cnt ? new cljs.core.IndexedSeq(this.tail, 0) : cljs.core.chunked_seq.call(null, this, cljs.core.first_array_for_longvec.call(null, this), 0, 0);
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentVector(b, this.cnt, this.shift, this.root, this.tail, this.__hash);
};
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  if (32 > this.cnt - cljs.core.tail_off.call(null, this)) {
    for (var c = this.tail.length, d = Array(c + 1), e = 0;;) {
      if (e < c) {
        d[e] = this.tail[e], e += 1;
      } else {
        break;
      }
    }
    d[c] = b;
    return new cljs.core.PersistentVector(this.meta, this.cnt + 1, this.shift, this.root, d, null);
  }
  c = (d = this.cnt >>> 5 > 1 << this.shift) ? this.shift + 5 : this.shift;
  d ? (d = cljs.core.pv_fresh_node.call(null, null), cljs.core.pv_aset.call(null, d, 0, this.root), cljs.core.pv_aset.call(null, d, 1, cljs.core.new_path.call(null, null, this.shift, new cljs.core.VectorNode(null, this.tail)))) : d = cljs.core.push_tail.call(null, this, this.shift, this.root, new cljs.core.VectorNode(null, this.tail));
  return new cljs.core.PersistentVector(this.meta, this.cnt + 1, c, d, [b], null);
};
cljs.core.PersistentVector.prototype.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$IIndexed$_nth$arity$2(null, c);
      case 3:
        return this.cljs$core$IIndexed$_nth$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return this.cljs$core$IIndexed$_nth$arity$2(null, c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return this.cljs$core$IIndexed$_nth$arity$3(null, c, d);
  };
  return a;
}();
cljs.core.PersistentVector.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.PersistentVector.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$IIndexed$_nth$arity$2(null, a);
};
cljs.core.PersistentVector.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$IIndexed$_nth$arity$3(null, a, b);
};
cljs.core.__GT_PersistentVector = function(a, b, c, d, e, f) {
  return new cljs.core.PersistentVector(a, b, c, d, e, f);
};
cljs.core.PersistentVector.EMPTY_NODE = new cljs.core.VectorNode(null, [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
cljs.core.PersistentVector.EMPTY = new cljs.core.PersistentVector(null, 0, 5, cljs.core.PersistentVector.EMPTY_NODE, [], 0);
cljs.core.PersistentVector.fromArray = function(a, b) {
  var c = a.length, d = b ? a : cljs.core.aclone.call(null, a);
  if (32 > c) {
    return new cljs.core.PersistentVector(null, c, 5, cljs.core.PersistentVector.EMPTY_NODE, d, null);
  }
  for (var e = d.slice(0, 32), f = new cljs.core.PersistentVector(null, 32, 5, cljs.core.PersistentVector.EMPTY_NODE, e, null), e = 32, g = cljs.core._as_transient.call(null, f);;) {
    if (e < c) {
      f = e + 1, g = cljs.core.conj_BANG_.call(null, g, d[e]), e = f;
    } else {
      return cljs.core.persistent_BANG_.call(null, g);
    }
  }
};
cljs.core.vec = function(a) {
  return cljs.core._persistent_BANG_.call(null, cljs.core.reduce.call(null, cljs.core._conj_BANG_, cljs.core._as_transient.call(null, cljs.core.PersistentVector.EMPTY), a));
};
cljs.core.vector = function() {
  var a = function(a) {
    return a instanceof cljs.core.IndexedSeq && 0 === a.i ? cljs.core.PersistentVector.fromArray(a.arr, !0) : cljs.core.vec.call(null, a);
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.ChunkedSeq = function(a, b, c, d, e, f) {
  this.vec = a;
  this.node = b;
  this.i = c;
  this.off = d;
  this.meta = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition0$ = 32375020;
  this.cljs$lang$protocol_mask$partition1$ = 1536;
};
cljs.core.ChunkedSeq.cljs$lang$type = !0;
cljs.core.ChunkedSeq.cljs$lang$ctorStr = "cljs.core/ChunkedSeq";
cljs.core.ChunkedSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ChunkedSeq");
};
cljs.core.ChunkedSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.ChunkedSeq.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.ChunkedSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return this.off + 1 < this.node.length ? (a = cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off + 1), null == a ? null : a) : cljs.core._chunked_next.call(null, this);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, cljs.core.subvec.call(null, this.vec, this.i + this.off, cljs.core.count.call(null, this.vec)), b);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, cljs.core.subvec.call(null, this.vec, this.i + this.off, cljs.core.count.call(null, this.vec)), b, c);
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.node[this.off];
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return this.off + 1 < this.node.length ? (a = cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off + 1), null == a ? cljs.core.List.EMPTY : a) : cljs.core._chunked_rest.call(null, this);
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(a) {
  return cljs.core.array_chunk.call(null, this.node, this.off);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(a) {
  a = this.i + this.node.length;
  return a < cljs.core._count.call(null, this.vec) ? cljs.core.chunked_seq.call(null, this.vec, cljs.core.unchecked_array_for.call(null, this.vec, a), a, 0) : cljs.core.List.EMPTY;
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off, b);
};
cljs.core.ChunkedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(a) {
  a = this.i + this.node.length;
  return a < cljs.core._count.call(null, this.vec) ? cljs.core.chunked_seq.call(null, this.vec, cljs.core.unchecked_array_for.call(null, this.vec, a), a, 0) : null;
};
cljs.core.__GT_ChunkedSeq = function(a, b, c, d, e, f) {
  return new cljs.core.ChunkedSeq(a, b, c, d, e, f);
};
cljs.core.chunked_seq = function() {
  var a = null, b = function(a, b, c) {
    return new cljs.core.ChunkedSeq(a, cljs.core.array_for.call(null, a, b), b, c, null, null);
  }, c = function(a, b, c, d) {
    return new cljs.core.ChunkedSeq(a, b, c, d, null, null);
  }, d = function(a, b, c, d, k) {
    return new cljs.core.ChunkedSeq(a, b, c, d, k, null);
  }, a = function(a, f, g, h, k) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, f, g);
      case 4:
        return c.call(this, a, f, g, h);
      case 5:
        return d.call(this, a, f, g, h, k);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  a.cljs$core$IFn$_invoke$arity$5 = d;
  return a;
}();
cljs.core.Subvec = function(a, b, c, d, e) {
  this.meta = a;
  this.v = b;
  this.start = c;
  this.end = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition0$ = 166617887;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.Subvec.cljs$lang$type = !0;
cljs.core.Subvec.cljs$lang$ctorStr = "cljs.core/Subvec";
cljs.core.Subvec.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Subvec");
};
cljs.core.Subvec.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.Subvec.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return "number" === typeof b ? cljs.core._nth.call(null, this, b, c) : c;
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return 0 > b || this.end <= this.start + b ? cljs.core.vector_index_out_of_bounds.call(null, b, this.end - this.start) : cljs.core._nth.call(null, this.v, this.start + b);
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 > b || this.end <= this.start + b ? c : cljs.core._nth.call(null, this.v, this.start + b, c);
};
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  var d = this, e = d.start + b;
  return cljs.core.build_subvec.call(null, d.meta, cljs.core.assoc.call(null, d.v, e, c), d.start, function() {
    var a = d.end, b = e + 1;
    return a > b ? a : b;
  }(), null);
};
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.Subvec.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.Subvec(this.meta, this.v, this.start, this.end, this.__hash);
};
cljs.core.Subvec.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.end - this.start;
};
cljs.core.Subvec.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return cljs.core._nth.call(null, this.v, this.end - 1);
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  if (this.start === this.end) {
    throw Error("Can't pop empty vector");
  }
  return cljs.core.build_subvec.call(null, this.meta, this.v, this.start, this.end - 1, null);
};
cljs.core.Subvec.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return this.start !== this.end ? new cljs.core.RSeq(this, this.end - this.start - 1, null) : null;
};
cljs.core.Subvec.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta);
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, this, b);
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, this, b, c);
};
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if ("number" === typeof b) {
    return cljs.core._assoc_n.call(null, this, b, c);
  }
  throw Error("Subvec's key for assoc must be a number.");
};
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this;
  return function(a) {
    return function e(f) {
      return f === b.end ? null : cljs.core.cons.call(null, cljs.core._nth.call(null, b.v, f), new cljs.core.LazySeq(null, function(a) {
        return function() {
          return e.call(null, f + 1);
        };
      }(a), null, null));
    };
  }(this).call(null, b.start);
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.build_subvec.call(null, b, this.v, this.start, this.end, this.__hash);
};
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.build_subvec.call(null, this.meta, cljs.core._assoc_n.call(null, this.v, this.end, b), this.start, this.end + 1, null);
};
cljs.core.Subvec.prototype.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$IIndexed$_nth$arity$2(null, c);
      case 3:
        return this.cljs$core$IIndexed$_nth$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return this.cljs$core$IIndexed$_nth$arity$2(null, c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return this.cljs$core$IIndexed$_nth$arity$3(null, c, d);
  };
  return a;
}();
cljs.core.Subvec.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.Subvec.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$IIndexed$_nth$arity$2(null, a);
};
cljs.core.Subvec.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$IIndexed$_nth$arity$3(null, a, b);
};
cljs.core.__GT_Subvec = function(a, b, c, d, e) {
  return new cljs.core.Subvec(a, b, c, d, e);
};
cljs.core.build_subvec = function(a, b, c, d, e) {
  for (;;) {
    if (b instanceof cljs.core.Subvec) {
      c = b.start + c, d = b.start + d, b = b.v;
    } else {
      var f = cljs.core.count.call(null, b);
      if (0 > c || 0 > d || c > f || d > f) {
        throw Error("Index out of bounds");
      }
      return new cljs.core.Subvec(a, b, c, d, e);
    }
  }
};
cljs.core.subvec = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, cljs.core.count.call(null, b));
  }, c = function(a, b, c) {
    return cljs.core.build_subvec.call(null, null, a, b, c, null);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.tv_ensure_editable = function(a, b) {
  return a === b.edit ? b : new cljs.core.VectorNode(a, cljs.core.aclone.call(null, b.arr));
};
cljs.core.tv_editable_root = function(a) {
  return new cljs.core.VectorNode({}, cljs.core.aclone.call(null, a.arr));
};
cljs.core.tv_editable_tail = function(a) {
  var b = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
  cljs.core.array_copy.call(null, a, 0, b, 0, a.length);
  return b;
};
cljs.core.tv_push_tail = function tv_push_tail(b, c, d, e) {
  var f = cljs.core.tv_ensure_editable.call(null, b.root.edit, d), g = b.cnt - 1 >>> c & 31;
  cljs.core.pv_aset.call(null, f, g, 5 === c ? e : function() {
    var d = cljs.core.pv_aget.call(null, f, g);
    return null != d ? tv_push_tail.call(null, b, c - 5, d, e) : cljs.core.new_path.call(null, b.root.edit, c - 5, e);
  }());
  return f;
};
cljs.core.tv_pop_tail = function tv_pop_tail(b, c, d) {
  d = cljs.core.tv_ensure_editable.call(null, b.root.edit, d);
  var e = b.cnt - 2 >>> c & 31;
  if (5 < c) {
    b = tv_pop_tail.call(null, b, c - 5, cljs.core.pv_aget.call(null, d, e));
    if (null == b && 0 === e) {
      return null;
    }
    cljs.core.pv_aset.call(null, d, e, b);
    return d;
  }
  if (0 === e) {
    return null;
  }
  cljs.core.pv_aset.call(null, d, e, null);
  return d;
};
cljs.core.unchecked_editable_array_for = function(a, b) {
  if (b >= cljs.core.tail_off.call(null, a)) {
    return a.tail;
  }
  for (var c = a.root, d = c, e = a.shift;;) {
    if (0 < e) {
      d = cljs.core.tv_ensure_editable.call(null, c.edit, cljs.core.pv_aget.call(null, d, b >>> e & 31)), e -= 5;
    } else {
      return d.arr;
    }
  }
};
cljs.core.TransientVector = function(a, b, c, d) {
  this.cnt = a;
  this.shift = b;
  this.root = c;
  this.tail = d;
  this.cljs$lang$protocol_mask$partition0$ = 275;
  this.cljs$lang$protocol_mask$partition1$ = 88;
};
cljs.core.TransientVector.cljs$lang$type = !0;
cljs.core.TransientVector.cljs$lang$ctorStr = "cljs.core/TransientVector";
cljs.core.TransientVector.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/TransientVector");
};
cljs.core.TransientVector.prototype.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return this.cljs$core$ILookup$_lookup$arity$2(null, c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
  };
  return a;
}();
cljs.core.TransientVector.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.TransientVector.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.TransientVector.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return "number" === typeof b ? cljs.core._nth.call(null, this, b, c) : c;
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if (this.root.edit) {
    return cljs.core.array_for.call(null, this, b)[b & 31];
  }
  throw Error("nth after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 <= b && b < this.cnt ? cljs.core._nth.call(null, this, b) : c;
};
cljs.core.TransientVector.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if (this.root.edit) {
    return this.cnt;
  }
  throw Error("count after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 = function(a, b, c) {
  var d = this;
  if (d.root.edit) {
    if (0 <= b && b < d.cnt) {
      return cljs.core.tail_off.call(null, this) <= b ? d.tail[b & 31] = c : (a = function(a) {
        return function g(a, e) {
          var l = cljs.core.tv_ensure_editable.call(null, d.root.edit, e);
          if (0 === a) {
            cljs.core.pv_aset.call(null, l, b & 31, c);
          } else {
            var m = b >>> a & 31;
            cljs.core.pv_aset.call(null, l, m, g.call(null, a - 5, cljs.core.pv_aget.call(null, l, m)));
          }
          return l;
        };
      }(this).call(null, d.shift, d.root), d.root = a), this;
    }
    if (b === d.cnt) {
      return cljs.core._conj_BANG_.call(null, this, c);
    }
    throw Error("Index " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b) + " out of bounds for TransientVector of length" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(d.cnt));
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_pop_BANG_$arity$1 = function(a) {
  if (this.root.edit) {
    if (0 === this.cnt) {
      throw Error("Can't pop empty vector");
    }
    if (1 === this.cnt) {
      this.cnt = 0;
    } else {
      if (0 < (this.cnt - 1 & 31)) {
        this.cnt -= 1;
      } else {
        a = cljs.core.unchecked_editable_array_for.call(null, this, this.cnt - 2);
        var b;
        b = cljs.core.tv_pop_tail.call(null, this, this.shift, this.root);
        b = null != b ? b : new cljs.core.VectorNode(this.root.edit, [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
        5 < this.shift && null == cljs.core.pv_aget.call(null, b, 1) ? (this.root = cljs.core.tv_ensure_editable.call(null, this.root.edit, cljs.core.pv_aget.call(null, b, 0)), this.shift -= 5) : this.root = b;
        this.cnt -= 1;
        this.tail = a;
      }
    }
    return this;
  }
  throw Error("pop! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  if ("number" === typeof b) {
    return cljs.core._assoc_n_BANG_.call(null, this, b, c);
  }
  throw Error("TransientVector's key for assoc! must be a number.");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  if (this.root.edit) {
    if (32 > this.cnt - cljs.core.tail_off.call(null, this)) {
      this.tail[this.cnt & 31] = b;
    } else {
      var c = new cljs.core.VectorNode(this.root.edit, this.tail), d = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      d[0] = b;
      this.tail = d;
      if (this.cnt >>> 5 > 1 << this.shift) {
        var d = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], e = this.shift + 5;
        d[0] = this.root;
        d[1] = cljs.core.new_path.call(null, this.root.edit, this.shift, c);
        this.root = new cljs.core.VectorNode(this.root.edit, d);
        this.shift = e;
      } else {
        this.root = cljs.core.tv_push_tail.call(null, this, this.shift, this.root, c);
      }
    }
    this.cnt += 1;
    return this;
  }
  throw Error("conj! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  if (this.root.edit) {
    this.root.edit = null;
    a = this.cnt - cljs.core.tail_off.call(null, this);
    var b = Array(a);
    cljs.core.array_copy.call(null, this.tail, 0, b, 0, a);
    return new cljs.core.PersistentVector(null, this.cnt, this.shift, this.root, b, null);
  }
  throw Error("persistent! called twice");
};
cljs.core.__GT_TransientVector = function(a, b, c, d) {
  return new cljs.core.TransientVector(a, b, c, d);
};
cljs.core.PersistentQueueSeq = function(a, b, c, d) {
  this.meta = a;
  this.front = b;
  this.rear = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850572;
};
cljs.core.PersistentQueueSeq.cljs$lang$type = !0;
cljs.core.PersistentQueueSeq.cljs$lang$ctorStr = "cljs.core/PersistentQueueSeq";
cljs.core.PersistentQueueSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentQueueSeq");
};
cljs.core.PersistentQueueSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentQueueSeq.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first.call(null, this.front);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return(a = cljs.core.next.call(null, this.front)) ? new cljs.core.PersistentQueueSeq(this.meta, a, this.rear, null) : null == this.rear ? cljs.core._empty.call(null, this) : new cljs.core.PersistentQueueSeq(this.meta, this.rear, null, null);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentQueueSeq(b, this.front, this.rear, this.__hash);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.__GT_PersistentQueueSeq = function(a, b, c, d) {
  return new cljs.core.PersistentQueueSeq(a, b, c, d);
};
cljs.core.PersistentQueue = function(a, b, c, d, e) {
  this.meta = a;
  this.count = b;
  this.front = c;
  this.rear = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition0$ = 31858766;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.PersistentQueue.cljs$lang$type = !0;
cljs.core.PersistentQueue.cljs$lang$ctorStr = "cljs.core/PersistentQueue";
cljs.core.PersistentQueue.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentQueue");
};
cljs.core.PersistentQueue.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentQueue.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentQueue.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentQueue(this.meta, this.count, this.front, this.rear, this.__hash);
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.count;
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return cljs.core.first.call(null, this.front);
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return cljs.core.truth_(this.front) ? (a = cljs.core.next.call(null, this.front)) ? new cljs.core.PersistentQueue(this.meta, this.count - 1, a, this.rear, null) : new cljs.core.PersistentQueue(this.meta, this.count - 1, cljs.core.seq.call(null, this.rear), cljs.core.PersistentVector.EMPTY, null) : this;
};
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.PersistentQueue.EMPTY;
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first.call(null, this.front);
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.rest.call(null, cljs.core.seq.call(null, this));
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this, c = cljs.core.seq.call(null, b.rear);
  return cljs.core.truth_(function() {
    var a = b.front;
    return cljs.core.truth_(a) ? a : c;
  }()) ? new cljs.core.PersistentQueueSeq(null, b.front, cljs.core.seq.call(null, c), null) : null;
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentQueue(b, this.count, this.front, this.rear, this.__hash);
};
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  var c = this;
  return cljs.core.truth_(c.front) ? new cljs.core.PersistentQueue(c.meta, c.count + 1, c.front, cljs.core.conj.call(null, function() {
    var a = c.rear;
    return cljs.core.truth_(a) ? a : cljs.core.PersistentVector.EMPTY;
  }(), b), null) : new cljs.core.PersistentQueue(c.meta, c.count + 1, cljs.core.conj.call(null, c.front, b), cljs.core.PersistentVector.EMPTY, null);
};
cljs.core.__GT_PersistentQueue = function(a, b, c, d, e) {
  return new cljs.core.PersistentQueue(a, b, c, d, e);
};
cljs.core.PersistentQueue.EMPTY = new cljs.core.PersistentQueue(null, 0, null, cljs.core.PersistentVector.EMPTY, 0);
cljs.core.NeverEquiv = function() {
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2097152;
};
cljs.core.NeverEquiv.cljs$lang$type = !0;
cljs.core.NeverEquiv.cljs$lang$ctorStr = "cljs.core/NeverEquiv";
cljs.core.NeverEquiv.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/NeverEquiv");
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return!1;
};
cljs.core.NeverEquiv.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.__GT_NeverEquiv = function() {
  return new cljs.core.NeverEquiv;
};
cljs.core.never_equiv = new cljs.core.NeverEquiv;
cljs.core.equiv_map = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.map_QMARK_.call(null, b) ? cljs.core.count.call(null, a) === cljs.core.count.call(null, b) ? cljs.core.every_QMARK_.call(null, cljs.core.identity, cljs.core.map.call(null, function(a) {
    return cljs.core._EQ_.call(null, cljs.core.get.call(null, b, cljs.core.first.call(null, a), cljs.core.never_equiv), cljs.core.second.call(null, a));
  }, a)) : null : null);
};
cljs.core.scan_array = function(a, b, c) {
  for (var d = c.length, e = 0;;) {
    if (e < d) {
      if (b === c[e]) {
        return e;
      }
      e += a;
    } else {
      return null;
    }
  }
};
cljs.core.obj_map_compare_keys = function(a, b) {
  var c = cljs.core.hash.call(null, a), d = cljs.core.hash.call(null, b);
  return c < d ? -1 : c > d ? 1 : 0;
};
cljs.core.obj_map__GT_hash_map = function(a, b, c) {
  var d = a.keys, e = d.length, f = a.strobj;
  a = cljs.core.meta.call(null, a);
  for (var g = 0, h = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);;) {
    if (g < e) {
      var k = d[g], g = g + 1, h = cljs.core.assoc_BANG_.call(null, h, k, f[k])
    } else {
      return cljs.core.with_meta.call(null, cljs.core.persistent_BANG_.call(null, cljs.core.assoc_BANG_.call(null, h, b, c)), a);
    }
  }
};
cljs.core.obj_clone = function(a, b) {
  var c;
  c = {};
  for (var d = b.length, e = 0;;) {
    if (e < d) {
      var f = b[e];
      c[f] = a[f];
      e += 1;
    } else {
      break;
    }
  }
  return c;
};
cljs.core.ObjMap = function(a, b, c, d, e) {
  this.meta = a;
  this.keys = b;
  this.strobj = c;
  this.update_count = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition0$ = 16123663;
  this.cljs$lang$protocol_mask$partition1$ = 4;
};
cljs.core.ObjMap.cljs$lang$type = !0;
cljs.core.ObjMap.cljs$lang$ctorStr = "cljs.core/ObjMap";
cljs.core.ObjMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ObjMap");
};
cljs.core.ObjMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.ObjMap.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return goog.isString(b) && null != cljs.core.scan_array.call(null, 1, b, this.keys) ? this.strobj[b] : c;
};
cljs.core.ObjMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  for (a = this.keys.sort(cljs.core.obj_map_compare_keys);;) {
    if (cljs.core.seq.call(null, a)) {
      var d = cljs.core.first.call(null, a);
      c = b.call(null, c, d, this.strobj[d]);
      if (cljs.core.reduced_QMARK_.call(null, c)) {
        return cljs.core.deref.call(null, c);
      }
      a = cljs.core.rest.call(null, a);
    } else {
      return c;
    }
  }
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.keys.length;
};
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_unordered_coll.call(null, this);
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, this, b);
};
cljs.core.ObjMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return cljs.core.transient$.call(null, cljs.core.into.call(null, cljs.core.PersistentHashMap.EMPTY, this));
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.ObjMap.EMPTY, this.meta);
};
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if (goog.isString(b) && null != cljs.core.scan_array.call(null, 1, b, this.keys)) {
    var c = cljs.core.aclone.call(null, this.keys), d = cljs.core.obj_clone.call(null, this.strobj, this.keys);
    c.splice(cljs.core.scan_array.call(null, 1, b, c), 1);
    delete d[b];
    return new cljs.core.ObjMap(this.meta, c, d, this.update_count + 1, null);
  }
  return this;
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if (goog.isString(b)) {
    if (this.update_count > cljs.core.ObjMap.HASHMAP_THRESHOLD || this.keys.length >= cljs.core.ObjMap.HASHMAP_THRESHOLD) {
      return cljs.core.obj_map__GT_hash_map.call(null, this, b, c);
    }
    if (null != cljs.core.scan_array.call(null, 1, b, this.keys)) {
      return a = cljs.core.obj_clone.call(null, this.strobj, this.keys), a[b] = c, new cljs.core.ObjMap(this.meta, this.keys, a, this.update_count + 1, null);
    }
    a = cljs.core.obj_clone.call(null, this.strobj, this.keys);
    var d = cljs.core.aclone.call(null, this.keys);
    a[b] = c;
    d.push(b);
    return new cljs.core.ObjMap(this.meta, d, a, this.update_count + 1, null);
  }
  return cljs.core.obj_map__GT_hash_map.call(null, this, b, c);
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return goog.isString(b) && null != cljs.core.scan_array.call(null, 1, b, this.keys) ? !0 : !1;
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this;
  return 0 < b.keys.length ? cljs.core.map.call(null, function(a) {
    return function(a) {
      return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a, b.strobj[a]], null);
    };
  }(this), b.keys.sort(cljs.core.obj_map_compare_keys)) : null;
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ObjMap(b, this.keys, this.strobj, this.update_count, this.__hash);
};
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? cljs.core._assoc.call(null, this, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, this, b);
};
cljs.core.ObjMap.prototype.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return this.cljs$core$ILookup$_lookup$arity$2(null, c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
  };
  return a;
}();
cljs.core.ObjMap.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.ObjMap.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.ObjMap.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.__GT_ObjMap = function(a, b, c, d, e) {
  return new cljs.core.ObjMap(a, b, c, d, e);
};
cljs.core.ObjMap.EMPTY = new cljs.core.ObjMap(null, [], function() {
  return{};
}(), 0, 0);
cljs.core.ObjMap.HASHMAP_THRESHOLD = 8;
cljs.core.ObjMap.fromObject = function(a, b) {
  return new cljs.core.ObjMap(null, a, b, 0, null);
};
cljs.core.ES6Iterator = function(a) {
  this.s = a;
};
cljs.core.ES6Iterator.cljs$lang$type = !0;
cljs.core.ES6Iterator.cljs$lang$ctorStr = "cljs.core/ES6Iterator";
cljs.core.ES6Iterator.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ES6Iterator");
};
cljs.core.ES6Iterator.prototype.next = function() {
  if (null != this.s) {
    var a = cljs.core.first.call(null, this.s);
    this.s = cljs.core.next.call(null, this.s);
    return{done:!1, value:a};
  }
  return{done:!0, value:null};
};
cljs.core.__GT_ES6Iterator = function(a) {
  return new cljs.core.ES6Iterator(a);
};
cljs.core.es6_iterator = function(a) {
  return new cljs.core.ES6Iterator(cljs.core.seq.call(null, a));
};
cljs.core.ES6EntriesIterator = function(a) {
  this.s = a;
};
cljs.core.ES6EntriesIterator.cljs$lang$type = !0;
cljs.core.ES6EntriesIterator.cljs$lang$ctorStr = "cljs.core/ES6EntriesIterator";
cljs.core.ES6EntriesIterator.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ES6EntriesIterator");
};
cljs.core.ES6EntriesIterator.prototype.next = function() {
  if (null != this.s) {
    var a = cljs.core.first.call(null, this.s), b = cljs.core.nth.call(null, a, 0, null), a = cljs.core.nth.call(null, a, 1, null);
    this.s = cljs.core.next.call(null, this.s);
    return{done:!1, value:[b, a]};
  }
  return{done:!0, value:null};
};
cljs.core.__GT_ES6EntriesIterator = function(a) {
  return new cljs.core.ES6EntriesIterator(a);
};
cljs.core.es6_entries_iterator = function(a) {
  return new cljs.core.ES6EntriesIterator(cljs.core.seq.call(null, a));
};
cljs.core.ES6SetEntriesIterator = function(a) {
  this.s = a;
};
cljs.core.ES6SetEntriesIterator.cljs$lang$type = !0;
cljs.core.ES6SetEntriesIterator.cljs$lang$ctorStr = "cljs.core/ES6SetEntriesIterator";
cljs.core.ES6SetEntriesIterator.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ES6SetEntriesIterator");
};
cljs.core.ES6SetEntriesIterator.prototype.next = function() {
  if (null != this.s) {
    var a = cljs.core.first.call(null, this.s);
    this.s = cljs.core.next.call(null, this.s);
    return{done:!1, value:[a, a]};
  }
  return{done:!0, value:null};
};
cljs.core.__GT_ES6SetEntriesIterator = function(a) {
  return new cljs.core.ES6SetEntriesIterator(a);
};
cljs.core.es6_set_entries_iterator = function(a) {
  return new cljs.core.ES6SetEntriesIterator(cljs.core.seq.call(null, a));
};
cljs.core.array_map_index_of_nil_QMARK_ = function(a, b, c) {
  b = a.length;
  for (c = 0;;) {
    if (b <= c) {
      return-1;
    }
    if (null == a[c]) {
      return c;
    }
    c += 2;
  }
};
cljs.core.array_map_index_of_keyword_QMARK_ = function(a, b, c) {
  b = a.length;
  c = c.fqn;
  for (var d = 0;;) {
    if (b <= d) {
      return-1;
    }
    var e = a[d];
    if (e instanceof cljs.core.Keyword && c === e.fqn) {
      return d;
    }
    d += 2;
  }
};
cljs.core.array_map_index_of_symbol_QMARK_ = function(a, b, c) {
  b = a.length;
  c = c.str;
  for (var d = 0;;) {
    if (b <= d) {
      return-1;
    }
    var e = a[d];
    if (e instanceof cljs.core.Symbol && c === e.str) {
      return d;
    }
    d += 2;
  }
};
cljs.core.array_map_index_of_identical_QMARK_ = function(a, b, c) {
  b = a.length;
  for (var d = 0;;) {
    if (b <= d) {
      return-1;
    }
    if (c === a[d]) {
      return d;
    }
    d += 2;
  }
};
cljs.core.array_map_index_of_equiv_QMARK_ = function(a, b, c) {
  b = a.length;
  for (var d = 0;;) {
    if (b <= d) {
      return-1;
    }
    if (cljs.core._EQ_.call(null, c, a[d])) {
      return d;
    }
    d += 2;
  }
};
cljs.core.array_map_index_of = function(a, b) {
  var c = a.arr;
  return b instanceof cljs.core.Keyword ? cljs.core.array_map_index_of_keyword_QMARK_.call(null, c, a, b) : goog.isString(b) || "number" === typeof b ? cljs.core.array_map_index_of_identical_QMARK_.call(null, c, a, b) : b instanceof cljs.core.Symbol ? cljs.core.array_map_index_of_symbol_QMARK_.call(null, c, a, b) : null == b ? cljs.core.array_map_index_of_nil_QMARK_.call(null, c, a, b) : cljs.core.array_map_index_of_equiv_QMARK_.call(null, c, a, b);
};
cljs.core.array_map_extend_kv = function(a, b, c) {
  a = a.arr;
  for (var d = a.length, e = Array(d + 2), f = 0;;) {
    if (f < d) {
      e[f] = a[f], f += 1;
    } else {
      break;
    }
  }
  e[d] = b;
  e[d + 1] = c;
  return e;
};
cljs.core.PersistentArrayMapSeq = function(a, b, c) {
  this.arr = a;
  this.i = b;
  this._meta = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374990;
};
cljs.core.PersistentArrayMapSeq.cljs$lang$type = !0;
cljs.core.PersistentArrayMapSeq.cljs$lang$ctorStr = "cljs.core/PersistentArrayMapSeq";
cljs.core.PersistentArrayMapSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentArrayMapSeq");
};
cljs.core.PersistentArrayMapSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentArrayMapSeq.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta;
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return this.i < this.arr.length - 2 ? new cljs.core.PersistentArrayMapSeq(this.arr, this.i + 2, this._meta) : null;
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return(this.arr.length - this.i) / 2;
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this._meta);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.arr[this.i], this.arr[this.i + 1]], null);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return this.i < this.arr.length - 2 ? new cljs.core.PersistentArrayMapSeq(this.arr, this.i + 2, this._meta) : cljs.core.List.EMPTY;
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentArrayMapSeq(this.arr, this.i, b);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.__GT_PersistentArrayMapSeq = function(a, b, c) {
  return new cljs.core.PersistentArrayMapSeq(a, b, c);
};
cljs.core.persistent_array_map_seq = function(a, b, c) {
  return b <= a.length - 2 ? new cljs.core.PersistentArrayMapSeq(a, b, c) : null;
};
cljs.core.PersistentArrayMapIterator = function(a, b, c) {
  this.arr = a;
  this.i = b;
  this.cnt = c;
};
cljs.core.PersistentArrayMapIterator.cljs$lang$type = !0;
cljs.core.PersistentArrayMapIterator.cljs$lang$ctorStr = "cljs.core/PersistentArrayMapIterator";
cljs.core.PersistentArrayMapIterator.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentArrayMapIterator");
};
cljs.core.PersistentArrayMapIterator.prototype.hasNext = function() {
  return this.i < this.cnt;
};
cljs.core.PersistentArrayMapIterator.prototype.next = function() {
  var a = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.arr[this.i], this.arr[this.i + 1]], null);
  this.i += 2;
  return a;
};
cljs.core.__GT_PersistentArrayMapIterator = function(a, b, c) {
  return new cljs.core.PersistentArrayMapIterator(a, b, c);
};
cljs.core.PersistentArrayMap = function(a, b, c, d) {
  this.meta = a;
  this.cnt = b;
  this.arr = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition0$ = 16647951;
  this.cljs$lang$protocol_mask$partition1$ = 8196;
};
cljs.core.PersistentArrayMap.cljs$lang$type = !0;
cljs.core.PersistentArrayMap.cljs$lang$ctorStr = "cljs.core/PersistentArrayMap";
cljs.core.PersistentArrayMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentArrayMap");
};
cljs.core.PersistentArrayMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentArrayMap.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.PersistentArrayMap.prototype.keys = function() {
  return cljs.core.es6_iterator.call(null, cljs.core.keys.call(null, this));
};
cljs.core.PersistentArrayMap.prototype.entries = function() {
  return cljs.core.es6_entries_iterator.call(null, cljs.core.seq.call(null, this));
};
cljs.core.PersistentArrayMap.prototype.values = function() {
  return cljs.core.es6_iterator.call(null, cljs.core.vals.call(null, this));
};
cljs.core.PersistentArrayMap.prototype.has = function(a) {
  return cljs.core.contains_QMARK_.call(null, this, a);
};
cljs.core.PersistentArrayMap.prototype.get = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.PersistentArrayMap.prototype.forEach = function(a) {
  for (var b = cljs.core.seq.call(null, this), c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = cljs.core._nth.call(null, c, e), g = cljs.core.nth.call(null, f, 0, null), f = cljs.core.nth.call(null, f, 1, null);
      a.call(null, f, g);
      e += 1;
    } else {
      if (b = cljs.core.seq.call(null, b)) {
        cljs.core.chunked_seq_QMARK_.call(null, b) ? (c = cljs.core.chunk_first.call(null, b), b = cljs.core.chunk_rest.call(null, b), g = c, d = cljs.core.count.call(null, c), c = g) : (c = cljs.core.first.call(null, b), g = cljs.core.nth.call(null, c, 0, null), f = cljs.core.nth.call(null, c, 1, null), a.call(null, f, g), b = cljs.core.next.call(null, b), c = null, d = 0), e = 0;
      } else {
        return null;
      }
    }
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = cljs.core.array_map_index_of.call(null, this, b);
  return-1 === a ? c : this.arr[a + 1];
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  a = this.arr.length;
  for (var d = 0;;) {
    if (d < a) {
      c = b.call(null, c, this.arr[d], this.arr[d + 1]);
      if (cljs.core.reduced_QMARK_.call(null, c)) {
        return cljs.core.deref.call(null, c);
      }
      d += 2;
    } else {
      return c;
    }
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IIterable$ = !0;
cljs.core.PersistentArrayMap.prototype.cljs$core$IIterable$_iterator$arity$1 = function(a) {
  return new cljs.core.PersistentArrayMapIterator(this.arr, 0, 2 * this.cnt);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentArrayMap(this.meta, this.cnt, this.arr, this.__hash);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt;
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_unordered_coll.call(null, this);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  if (b && (b.cljs$lang$protocol_mask$partition0$ & 1024 || b.cljs$core$IMap$)) {
    var c = this.arr.length;
    if (this.cnt === cljs.core._count.call(null, b)) {
      for (var d = 0;;) {
        if (d < c) {
          var e = cljs.core._lookup.call(null, b, this.arr[d], cljs.core.lookup_sentinel);
          if (e !== cljs.core.lookup_sentinel) {
            if (cljs.core._EQ_.call(null, this.arr[d + 1], e)) {
              d += 2;
            } else {
              return!1;
            }
          } else {
            return!1;
          }
        } else {
          return!0;
        }
      }
    } else {
      return!1;
    }
  } else {
    return cljs.core.equiv_map.call(null, this, b);
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientArrayMap({}, this.arr.length, cljs.core.aclone.call(null, this.arr));
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core._with_meta.call(null, cljs.core.PersistentArrayMap.EMPTY, this.meta);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if (0 <= cljs.core.array_map_index_of.call(null, this, b)) {
    var c = this.arr.length, d = c - 2;
    if (0 === d) {
      return cljs.core._empty.call(null, this);
    }
    for (var d = Array(d), e = 0, f = 0;;) {
      if (e >= c) {
        return new cljs.core.PersistentArrayMap(this.meta, this.cnt - 1, d, null);
      }
      cljs.core._EQ_.call(null, b, this.arr[e]) || (d[f] = this.arr[e], d[f + 1] = this.arr[e + 1], f += 2);
      e += 2;
    }
  } else {
    return this;
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  a = cljs.core.array_map_index_of.call(null, this, b);
  if (-1 === a) {
    return this.cnt < cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD ? (c = cljs.core.array_map_extend_kv.call(null, this, b, c), new cljs.core.PersistentArrayMap(this.meta, this.cnt + 1, c, null)) : cljs.core._with_meta.call(null, cljs.core._assoc.call(null, cljs.core.into.call(null, cljs.core.PersistentHashMap.EMPTY, this), b, c), this.meta);
  }
  if (c === this.arr[a + 1]) {
    return this;
  }
  b = cljs.core.aclone.call(null, this.arr);
  b[a + 1] = c;
  return new cljs.core.PersistentArrayMap(this.meta, this.cnt, b, null);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return-1 !== cljs.core.array_map_index_of.call(null, this, b);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.persistent_array_map_seq.call(null, this.arr, 0, null);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentArrayMap(b, this.cnt, this.arr, this.__hash);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  if (cljs.core.vector_QMARK_.call(null, b)) {
    return cljs.core._assoc.call(null, this, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1));
  }
  for (var c = this, d = cljs.core.seq.call(null, b);;) {
    if (null == d) {
      return c;
    }
    var e = cljs.core.first.call(null, d);
    if (cljs.core.vector_QMARK_.call(null, e)) {
      c = cljs.core._assoc.call(null, c, cljs.core._nth.call(null, e, 0), cljs.core._nth.call(null, e, 1)), d = cljs.core.next.call(null, d);
    } else {
      throw Error("conj on a map takes map entries or seqables of map entries");
    }
  }
};
cljs.core.PersistentArrayMap.prototype.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return this.cljs$core$ILookup$_lookup$arity$2(null, c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
  };
  return a;
}();
cljs.core.PersistentArrayMap.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.__GT_PersistentArrayMap = function(a, b, c, d) {
  return new cljs.core.PersistentArrayMap(a, b, c, d);
};
cljs.core.PersistentArrayMap.EMPTY = new cljs.core.PersistentArrayMap(null, 0, [], null);
cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD = 8;
cljs.core.PersistentArrayMap.fromArray = function(a, b, c) {
  a = b ? a : cljs.core.aclone.call(null, a);
  if (c) {
    return new cljs.core.PersistentArrayMap(null, a.length / 2, a, null);
  }
  c = a.length;
  b = 0;
  for (var d = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY);;) {
    if (b < c) {
      var e = b + 2, d = cljs.core._assoc_BANG_.call(null, d, a[b], a[b + 1]);
      b = e;
    } else {
      return cljs.core._persistent_BANG_.call(null, d);
    }
  }
};
cljs.core.TransientArrayMap = function(a, b, c) {
  this.editable_QMARK_ = a;
  this.len = b;
  this.arr = c;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258;
};
cljs.core.TransientArrayMap.cljs$lang$type = !0;
cljs.core.TransientArrayMap.cljs$lang$ctorStr = "cljs.core/TransientArrayMap";
cljs.core.TransientArrayMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/TransientArrayMap");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(a, b) {
  if (cljs.core.truth_(this.editable_QMARK_)) {
    var c = cljs.core.array_map_index_of.call(null, this, b);
    0 <= c && (this.arr[c] = this.arr[this.len - 2], this.arr[c + 1] = this.arr[this.len - 1], c = this.arr, c.pop(), c.pop(), this.len -= 2);
    return this;
  }
  throw Error("dissoc! after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  if (cljs.core.truth_(this.editable_QMARK_)) {
    a = cljs.core.array_map_index_of.call(null, this, b);
    if (-1 === a) {
      return this.len + 2 <= 2 * cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD ? (this.len += 2, this.arr.push(b), this.arr.push(c), this) : cljs.core.assoc_BANG_.call(null, cljs.core.array__GT_transient_hash_map.call(null, this.len, this.arr), b, c);
    }
    c !== this.arr[a + 1] && (this.arr[a + 1] = c);
    return this;
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  if (cljs.core.truth_(this.editable_QMARK_)) {
    if (b ? b.cljs$lang$protocol_mask$partition0$ & 2048 || b.cljs$core$IMapEntry$ || (b.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMapEntry, b)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMapEntry, b)) {
      return cljs.core._assoc_BANG_.call(null, this, cljs.core.key.call(null, b), cljs.core.val.call(null, b));
    }
    for (var c = cljs.core.seq.call(null, b), d = this;;) {
      var e = cljs.core.first.call(null, c);
      if (cljs.core.truth_(e)) {
        c = cljs.core.next.call(null, c), d = cljs.core._assoc_BANG_.call(null, d, cljs.core.key.call(null, e), cljs.core.val.call(null, e));
      } else {
        return d;
      }
    }
  } else {
    throw Error("conj! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  if (cljs.core.truth_(this.editable_QMARK_)) {
    return this.editable_QMARK_ = !1, new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, this.len, 2), this.arr, null);
  }
  throw Error("persistent! called twice");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  if (cljs.core.truth_(this.editable_QMARK_)) {
    return a = cljs.core.array_map_index_of.call(null, this, b), -1 === a ? c : this.arr[a + 1];
  }
  throw Error("lookup after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if (cljs.core.truth_(this.editable_QMARK_)) {
    return cljs.core.quot.call(null, this.len, 2);
  }
  throw Error("count after persistent!");
};
cljs.core.__GT_TransientArrayMap = function(a, b, c) {
  return new cljs.core.TransientArrayMap(a, b, c);
};
cljs.core.array__GT_transient_hash_map = function(a, b) {
  for (var c = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY), d = 0;;) {
    if (d < a) {
      c = cljs.core.assoc_BANG_.call(null, c, b[d], b[d + 1]), d += 2;
    } else {
      return c;
    }
  }
};
cljs.core.Box = function(a) {
  this.val = a;
};
cljs.core.Box.cljs$lang$type = !0;
cljs.core.Box.cljs$lang$ctorStr = "cljs.core/Box";
cljs.core.Box.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Box");
};
cljs.core.__GT_Box = function(a) {
  return new cljs.core.Box(a);
};
cljs.core.key_test = function(a, b) {
  return a === b ? !0 : cljs.core.keyword_identical_QMARK_.call(null, a, b) ? !0 : cljs.core._EQ_.call(null, a, b);
};
cljs.core.mask = function(a, b) {
  return a >>> b & 31;
};
cljs.core.clone_and_set = function() {
  var a = null, b = function(a, b, c) {
    a = cljs.core.aclone.call(null, a);
    a[b] = c;
    return a;
  }, c = function(a, b, c, g, h) {
    a = cljs.core.aclone.call(null, a);
    a[b] = c;
    a[g] = h;
    return a;
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a;
}();
cljs.core.remove_pair = function(a, b) {
  var c = Array(a.length - 2);
  cljs.core.array_copy.call(null, a, 0, c, 0, 2 * b);
  cljs.core.array_copy.call(null, a, 2 * (b + 1), c, 2 * b, c.length - 2 * b);
  return c;
};
cljs.core.bitmap_indexed_node_index = function(a, b) {
  return cljs.core.bit_count.call(null, a & b - 1);
};
cljs.core.bitpos = function(a, b) {
  return 1 << (a >>> b & 31);
};
cljs.core.edit_and_set = function() {
  var a = null, b = function(a, b, c, g) {
    a = a.ensure_editable(b);
    a.arr[c] = g;
    return a;
  }, c = function(a, b, c, g, h, k) {
    a = a.ensure_editable(b);
    a.arr[c] = g;
    a.arr[h] = k;
    return a;
  }, a = function(a, e, f, g, h, k) {
    switch(arguments.length) {
      case 4:
        return b.call(this, a, e, f, g);
      case 6:
        return c.call(this, a, e, f, g, h, k);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$4 = b;
  a.cljs$core$IFn$_invoke$arity$6 = c;
  return a;
}();
cljs.core.inode_kv_reduce = function(a, b, c) {
  for (var d = a.length, e = 0;;) {
    if (e < d) {
      var f = a[e];
      null != f ? c = b.call(null, c, f, a[e + 1]) : (f = a[e + 1], c = null != f ? f.kv_reduce(b, c) : c);
      if (cljs.core.reduced_QMARK_.call(null, c)) {
        return cljs.core.deref.call(null, c);
      }
      e += 2;
    } else {
      return c;
    }
  }
};
cljs.core.BitmapIndexedNode = function(a, b, c) {
  this.edit = a;
  this.bitmap = b;
  this.arr = c;
};
cljs.core.BitmapIndexedNode.cljs$lang$type = !0;
cljs.core.BitmapIndexedNode.cljs$lang$ctorStr = "cljs.core/BitmapIndexedNode";
cljs.core.BitmapIndexedNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/BitmapIndexedNode");
};
cljs.core.BitmapIndexedNode.prototype.ensure_editable = function(a) {
  if (a === this.edit) {
    return this;
  }
  var b = cljs.core.bit_count.call(null, this.bitmap), c = Array(0 > b ? 4 : 2 * (b + 1));
  cljs.core.array_copy.call(null, this.arr, 0, c, 0, 2 * b);
  return new cljs.core.BitmapIndexedNode(a, this.bitmap, c);
};
cljs.core.BitmapIndexedNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  var f = 1 << (c >>> b & 31);
  if (0 === (this.bitmap & f)) {
    return this;
  }
  var g = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, f), h = this.arr[2 * g], k = this.arr[2 * g + 1];
  return null == h ? (b = k.inode_without_BANG_(a, b + 5, c, d, e), b === k ? this : null != b ? cljs.core.edit_and_set.call(null, this, a, 2 * g + 1, b) : this.bitmap === f ? null : this.edit_and_remove_pair(a, f, g)) : cljs.core.key_test.call(null, d, h) ? (e[0] = !0, this.edit_and_remove_pair(a, f, g)) : this;
};
cljs.core.BitmapIndexedNode.prototype.edit_and_remove_pair = function(a, b, c) {
  if (this.bitmap === b) {
    return null;
  }
  a = this.ensure_editable(a);
  var d = a.arr, e = d.length;
  a.bitmap ^= b;
  cljs.core.array_copy.call(null, d, 2 * (c + 1), d, 2 * c, e - 2 * (c + 1));
  d[e - 2] = null;
  d[e - 1] = null;
  return a;
};
cljs.core.BitmapIndexedNode.prototype.inode_seq = function() {
  return cljs.core.create_inode_seq.call(null, this.arr);
};
cljs.core.BitmapIndexedNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.inode_kv_reduce.call(null, this.arr, a, b);
};
cljs.core.BitmapIndexedNode.prototype.inode_lookup = function(a, b, c, d) {
  var e = 1 << (b >>> a & 31);
  if (0 === (this.bitmap & e)) {
    return d;
  }
  var f = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, e), e = this.arr[2 * f], f = this.arr[2 * f + 1];
  return null == e ? f.inode_lookup(a + 5, b, c, d) : cljs.core.key_test.call(null, c, e) ? f : d;
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  var g = 1 << (c >>> b & 31), h = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, g);
  if (0 === (this.bitmap & g)) {
    var k = cljs.core.bit_count.call(null, this.bitmap);
    if (2 * k < this.arr.length) {
      return a = this.ensure_editable(a), b = a.arr, f.val = !0, cljs.core.array_copy_downward.call(null, b, 2 * h, b, 2 * (h + 1), 2 * (k - h)), b[2 * h] = d, b[2 * h + 1] = e, a.bitmap |= g, a;
    }
    if (16 <= k) {
      h = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      h[c >>> b & 31] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, c, d, e, f);
      for (e = d = 0;;) {
        if (32 > d) {
          0 !== (this.bitmap >>> d & 1) && (h[d] = null != this.arr[e] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, cljs.core.hash.call(null, this.arr[e]), this.arr[e], this.arr[e + 1], f) : this.arr[e + 1], e += 2), d += 1;
        } else {
          break;
        }
      }
      return new cljs.core.ArrayNode(a, k + 1, h);
    }
    b = Array(2 * (k + 4));
    cljs.core.array_copy.call(null, this.arr, 0, b, 0, 2 * h);
    b[2 * h] = d;
    b[2 * h + 1] = e;
    cljs.core.array_copy.call(null, this.arr, 2 * h, b, 2 * (h + 1), 2 * (k - h));
    f.val = !0;
    a = this.ensure_editable(a);
    a.arr = b;
    a.bitmap |= g;
    return a;
  }
  k = this.arr[2 * h];
  g = this.arr[2 * h + 1];
  if (null == k) {
    return k = g.inode_assoc_BANG_(a, b + 5, c, d, e, f), k === g ? this : cljs.core.edit_and_set.call(null, this, a, 2 * h + 1, k);
  }
  if (cljs.core.key_test.call(null, d, k)) {
    return e === g ? this : cljs.core.edit_and_set.call(null, this, a, 2 * h + 1, e);
  }
  f.val = !0;
  return cljs.core.edit_and_set.call(null, this, a, 2 * h, null, 2 * h + 1, cljs.core.create_node.call(null, a, b + 5, k, g, c, d, e));
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc = function(a, b, c, d, e) {
  var f = 1 << (b >>> a & 31), g = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, f);
  if (0 === (this.bitmap & f)) {
    var h = cljs.core.bit_count.call(null, this.bitmap);
    if (16 <= h) {
      g = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      g[b >>> a & 31] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, b, c, d, e);
      for (d = c = 0;;) {
        if (32 > c) {
          0 !== (this.bitmap >>> c & 1) && (g[c] = null != this.arr[d] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, cljs.core.hash.call(null, this.arr[d]), this.arr[d], this.arr[d + 1], e) : this.arr[d + 1], d += 2), c += 1;
        } else {
          break;
        }
      }
      return new cljs.core.ArrayNode(null, h + 1, g);
    }
    a = Array(2 * (h + 1));
    cljs.core.array_copy.call(null, this.arr, 0, a, 0, 2 * g);
    a[2 * g] = c;
    a[2 * g + 1] = d;
    cljs.core.array_copy.call(null, this.arr, 2 * g, a, 2 * (g + 1), 2 * (h - g));
    e.val = !0;
    return new cljs.core.BitmapIndexedNode(null, this.bitmap | f, a);
  }
  h = this.arr[2 * g];
  f = this.arr[2 * g + 1];
  if (null == h) {
    return h = f.inode_assoc(a + 5, b, c, d, e), h === f ? this : new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * g + 1, h));
  }
  if (cljs.core.key_test.call(null, c, h)) {
    return d === f ? this : new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * g + 1, d));
  }
  e.val = !0;
  return new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * g, null, 2 * g + 1, cljs.core.create_node.call(null, a + 5, h, f, b, c, d)));
};
cljs.core.BitmapIndexedNode.prototype.inode_find = function(a, b, c, d) {
  var e = 1 << (b >>> a & 31);
  if (0 === (this.bitmap & e)) {
    return d;
  }
  var f = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, e), e = this.arr[2 * f], f = this.arr[2 * f + 1];
  return null == e ? f.inode_find(a + 5, b, c, d) : cljs.core.key_test.call(null, c, e) ? new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [e, f], null) : d;
};
cljs.core.BitmapIndexedNode.prototype.inode_without = function(a, b, c) {
  var d = 1 << (b >>> a & 31);
  if (0 === (this.bitmap & d)) {
    return this;
  }
  var e = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, d), f = this.arr[2 * e], g = this.arr[2 * e + 1];
  return null == f ? (a = g.inode_without(a + 5, b, c), a === g ? this : null != a ? new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * e + 1, a)) : this.bitmap === d ? null : new cljs.core.BitmapIndexedNode(null, this.bitmap ^ d, cljs.core.remove_pair.call(null, this.arr, e))) : cljs.core.key_test.call(null, c, f) ? new cljs.core.BitmapIndexedNode(null, this.bitmap ^ d, cljs.core.remove_pair.call(null, this.arr, e)) : this;
};
cljs.core.__GT_BitmapIndexedNode = function(a, b, c) {
  return new cljs.core.BitmapIndexedNode(a, b, c);
};
cljs.core.BitmapIndexedNode.EMPTY = new cljs.core.BitmapIndexedNode(null, 0, []);
cljs.core.pack_array_node = function(a, b, c) {
  var d = a.arr, e = d.length;
  a = Array(2 * (a.cnt - 1));
  for (var f = 0, g = 1, h = 0;;) {
    if (f < e) {
      f !== c && null != d[f] && (a[g] = d[f], g += 2, h |= 1 << f), f += 1;
    } else {
      return new cljs.core.BitmapIndexedNode(b, h, a);
    }
  }
};
cljs.core.ArrayNode = function(a, b, c) {
  this.edit = a;
  this.cnt = b;
  this.arr = c;
};
cljs.core.ArrayNode.cljs$lang$type = !0;
cljs.core.ArrayNode.cljs$lang$ctorStr = "cljs.core/ArrayNode";
cljs.core.ArrayNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayNode");
};
cljs.core.ArrayNode.prototype.ensure_editable = function(a) {
  return a === this.edit ? this : new cljs.core.ArrayNode(a, this.cnt, cljs.core.aclone.call(null, this.arr));
};
cljs.core.ArrayNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  var f = c >>> b & 31, g = this.arr[f];
  if (null == g) {
    return this;
  }
  b = g.inode_without_BANG_(a, b + 5, c, d, e);
  if (b === g) {
    return this;
  }
  if (null == b) {
    if (8 >= this.cnt) {
      return cljs.core.pack_array_node.call(null, this, a, f);
    }
    a = cljs.core.edit_and_set.call(null, this, a, f, b);
    a.cnt -= 1;
    return a;
  }
  return cljs.core.edit_and_set.call(null, this, a, f, b);
};
cljs.core.ArrayNode.prototype.inode_seq = function() {
  return cljs.core.create_array_node_seq.call(null, this.arr);
};
cljs.core.ArrayNode.prototype.kv_reduce = function(a, b) {
  for (var c = this.arr.length, d = 0, e = b;;) {
    if (d < c) {
      var f = this.arr[d];
      if (null != f && (e = f.kv_reduce(a, e), cljs.core.reduced_QMARK_.call(null, e))) {
        return cljs.core.deref.call(null, e);
      }
      d += 1;
    } else {
      return e;
    }
  }
};
cljs.core.ArrayNode.prototype.inode_lookup = function(a, b, c, d) {
  var e = this.arr[b >>> a & 31];
  return null != e ? e.inode_lookup(a + 5, b, c, d) : d;
};
cljs.core.ArrayNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  var g = c >>> b & 31, h = this.arr[g];
  if (null == h) {
    return a = cljs.core.edit_and_set.call(null, this, a, g, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, c, d, e, f)), a.cnt += 1, a;
  }
  b = h.inode_assoc_BANG_(a, b + 5, c, d, e, f);
  return b === h ? this : cljs.core.edit_and_set.call(null, this, a, g, b);
};
cljs.core.ArrayNode.prototype.inode_assoc = function(a, b, c, d, e) {
  var f = b >>> a & 31, g = this.arr[f];
  if (null == g) {
    return new cljs.core.ArrayNode(null, this.cnt + 1, cljs.core.clone_and_set.call(null, this.arr, f, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, b, c, d, e)));
  }
  a = g.inode_assoc(a + 5, b, c, d, e);
  return a === g ? this : new cljs.core.ArrayNode(null, this.cnt, cljs.core.clone_and_set.call(null, this.arr, f, a));
};
cljs.core.ArrayNode.prototype.inode_find = function(a, b, c, d) {
  var e = this.arr[b >>> a & 31];
  return null != e ? e.inode_find(a + 5, b, c, d) : d;
};
cljs.core.ArrayNode.prototype.inode_without = function(a, b, c) {
  var d = b >>> a & 31, e = this.arr[d];
  return null != e ? (a = e.inode_without(a + 5, b, c), a === e ? this : null == a ? 8 >= this.cnt ? cljs.core.pack_array_node.call(null, this, null, d) : new cljs.core.ArrayNode(null, this.cnt - 1, cljs.core.clone_and_set.call(null, this.arr, d, a)) : new cljs.core.ArrayNode(null, this.cnt, cljs.core.clone_and_set.call(null, this.arr, d, a))) : this;
};
cljs.core.__GT_ArrayNode = function(a, b, c) {
  return new cljs.core.ArrayNode(a, b, c);
};
cljs.core.hash_collision_node_find_index = function(a, b, c) {
  b *= 2;
  for (var d = 0;;) {
    if (d < b) {
      if (cljs.core.key_test.call(null, c, a[d])) {
        return d;
      }
      d += 2;
    } else {
      return-1;
    }
  }
};
cljs.core.HashCollisionNode = function(a, b, c, d) {
  this.edit = a;
  this.collision_hash = b;
  this.cnt = c;
  this.arr = d;
};
cljs.core.HashCollisionNode.cljs$lang$type = !0;
cljs.core.HashCollisionNode.cljs$lang$ctorStr = "cljs.core/HashCollisionNode";
cljs.core.HashCollisionNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/HashCollisionNode");
};
cljs.core.HashCollisionNode.prototype.ensure_editable = function(a) {
  if (a === this.edit) {
    return this;
  }
  var b = Array(2 * (this.cnt + 1));
  cljs.core.array_copy.call(null, this.arr, 0, b, 0, 2 * this.cnt);
  return new cljs.core.HashCollisionNode(a, this.collision_hash, this.cnt, b);
};
cljs.core.HashCollisionNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  b = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, d);
  if (-1 === b) {
    return this;
  }
  e[0] = !0;
  if (1 === this.cnt) {
    return null;
  }
  a = this.ensure_editable(a);
  e = a.arr;
  e[b] = e[2 * this.cnt - 2];
  e[b + 1] = e[2 * this.cnt - 1];
  e[2 * this.cnt - 1] = null;
  e[2 * this.cnt - 2] = null;
  a.cnt -= 1;
  return a;
};
cljs.core.HashCollisionNode.prototype.inode_seq = function() {
  return cljs.core.create_inode_seq.call(null, this.arr);
};
cljs.core.HashCollisionNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.inode_kv_reduce.call(null, this.arr, a, b);
};
cljs.core.HashCollisionNode.prototype.inode_lookup = function(a, b, c, d) {
  a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
  return 0 > a ? d : cljs.core.key_test.call(null, c, this.arr[a]) ? this.arr[a + 1] : d;
};
cljs.core.HashCollisionNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  if (c === this.collision_hash) {
    b = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, d);
    if (-1 === b) {
      if (this.arr.length > 2 * this.cnt) {
        return a = cljs.core.edit_and_set.call(null, this, a, 2 * this.cnt, d, 2 * this.cnt + 1, e), f.val = !0, a.cnt += 1, a;
      }
      b = this.arr.length;
      c = Array(b + 2);
      cljs.core.array_copy.call(null, this.arr, 0, c, 0, b);
      c[b] = d;
      c[b + 1] = e;
      f.val = !0;
      return this.ensure_editable_array(a, this.cnt + 1, c);
    }
    return this.arr[b + 1] === e ? this : cljs.core.edit_and_set.call(null, this, a, b + 1, e);
  }
  return(new cljs.core.BitmapIndexedNode(a, 1 << (this.collision_hash >>> b & 31), [null, this, null, null])).inode_assoc_BANG_(a, b, c, d, e, f);
};
cljs.core.HashCollisionNode.prototype.inode_assoc = function(a, b, c, d, e) {
  return b === this.collision_hash ? (a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c), -1 === a ? (a = 2 * this.cnt, b = Array(a + 2), cljs.core.array_copy.call(null, this.arr, 0, b, 0, a), b[a] = c, b[a + 1] = d, e.val = !0, new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt + 1, b)) : cljs.core._EQ_.call(null, this.arr[a], d) ? this : new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt, cljs.core.clone_and_set.call(null, this.arr, 
  a + 1, d))) : (new cljs.core.BitmapIndexedNode(null, 1 << (this.collision_hash >>> a & 31), [null, this])).inode_assoc(a, b, c, d, e);
};
cljs.core.HashCollisionNode.prototype.ensure_editable_array = function(a, b, c) {
  return a === this.edit ? (this.arr = c, this.cnt = b, this) : new cljs.core.HashCollisionNode(this.edit, this.collision_hash, b, c);
};
cljs.core.HashCollisionNode.prototype.inode_find = function(a, b, c, d) {
  a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
  return 0 > a ? d : cljs.core.key_test.call(null, c, this.arr[a]) ? new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.arr[a], this.arr[a + 1]], null) : d;
};
cljs.core.HashCollisionNode.prototype.inode_without = function(a, b, c) {
  a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
  return-1 === a ? this : 1 === this.cnt ? null : new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt - 1, cljs.core.remove_pair.call(null, this.arr, cljs.core.quot.call(null, a, 2)));
};
cljs.core.__GT_HashCollisionNode = function(a, b, c, d) {
  return new cljs.core.HashCollisionNode(a, b, c, d);
};
cljs.core.create_node = function() {
  var a = null, b = function(a, b, c, g, h, k) {
    var l = cljs.core.hash.call(null, b);
    if (l === g) {
      return new cljs.core.HashCollisionNode(null, l, 2, [b, c, h, k]);
    }
    var m = new cljs.core.Box(!1);
    return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a, l, b, c, m).inode_assoc(a, g, h, k, m);
  }, c = function(a, b, c, g, h, k, l) {
    var m = cljs.core.hash.call(null, c);
    if (m === h) {
      return new cljs.core.HashCollisionNode(null, m, 2, [c, g, k, l]);
    }
    var n = new cljs.core.Box(!1);
    return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b, m, c, g, n).inode_assoc_BANG_(a, b, h, k, l, n);
  }, a = function(a, e, f, g, h, k, l) {
    switch(arguments.length) {
      case 6:
        return b.call(this, a, e, f, g, h, k);
      case 7:
        return c.call(this, a, e, f, g, h, k, l);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$6 = b;
  a.cljs$core$IFn$_invoke$arity$7 = c;
  return a;
}();
cljs.core.NodeSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.nodes = b;
  this.i = c;
  this.s = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374860;
};
cljs.core.NodeSeq.cljs$lang$type = !0;
cljs.core.NodeSeq.cljs$lang$ctorStr = "cljs.core/NodeSeq";
cljs.core.NodeSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/NodeSeq");
};
cljs.core.NodeSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.NodeSeq.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.NodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.NodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.NodeSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.NodeSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return null == this.s ? new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.nodes[this.i], this.nodes[this.i + 1]], null) : cljs.core.first.call(null, this.s);
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return null == this.s ? cljs.core.create_inode_seq.call(null, this.nodes, this.i + 2, null) : cljs.core.create_inode_seq.call(null, this.nodes, this.i, cljs.core.next.call(null, this.s));
};
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.NodeSeq(b, this.nodes, this.i, this.s, this.__hash);
};
cljs.core.NodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.__GT_NodeSeq = function(a, b, c, d, e) {
  return new cljs.core.NodeSeq(a, b, c, d, e);
};
cljs.core.create_inode_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 0, null);
  }, c = function(a, b, c) {
    if (null == c) {
      for (c = a.length;;) {
        if (b < c) {
          if (null != a[b]) {
            return new cljs.core.NodeSeq(null, a, b, null, null);
          }
          var g = a[b + 1];
          if (cljs.core.truth_(g) && (g = g.inode_seq(), cljs.core.truth_(g))) {
            return new cljs.core.NodeSeq(null, a, b + 2, g, null);
          }
          b += 2;
        } else {
          return null;
        }
      }
    } else {
      return new cljs.core.NodeSeq(null, a, b, c, null);
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.ArrayNodeSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.nodes = b;
  this.i = c;
  this.s = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374860;
};
cljs.core.ArrayNodeSeq.cljs$lang$type = !0;
cljs.core.ArrayNodeSeq.cljs$lang$ctorStr = "cljs.core/ArrayNodeSeq";
cljs.core.ArrayNodeSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayNodeSeq");
};
cljs.core.ArrayNodeSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.ArrayNodeSeq.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first.call(null, this.s);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.create_array_node_seq.call(null, null, this.nodes, this.i, cljs.core.next.call(null, this.s));
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ArrayNodeSeq(b, this.nodes, this.i, this.s, this.__hash);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.__GT_ArrayNodeSeq = function(a, b, c, d, e) {
  return new cljs.core.ArrayNodeSeq(a, b, c, d, e);
};
cljs.core.create_array_node_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, null, b, 0, null);
  }, c = function(a, b, c, g) {
    if (null == g) {
      for (g = b.length;;) {
        if (c < g) {
          var h = b[c];
          if (cljs.core.truth_(h) && (h = h.inode_seq(), cljs.core.truth_(h))) {
            return new cljs.core.ArrayNodeSeq(a, b, c + 1, h, null);
          }
          c += 1;
        } else {
          return null;
        }
      }
    } else {
      return new cljs.core.ArrayNodeSeq(a, b, c, g, null);
    }
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 4:
        return c.call(this, a, e, f, g);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a;
}();
cljs.core.PersistentHashMap = function(a, b, c, d, e, f) {
  this.meta = a;
  this.cnt = b;
  this.root = c;
  this.has_nil_QMARK_ = d;
  this.nil_val = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition0$ = 16123663;
  this.cljs$lang$protocol_mask$partition1$ = 8196;
};
cljs.core.PersistentHashMap.cljs$lang$type = !0;
cljs.core.PersistentHashMap.cljs$lang$ctorStr = "cljs.core/PersistentHashMap";
cljs.core.PersistentHashMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentHashMap");
};
cljs.core.PersistentHashMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentHashMap.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.PersistentHashMap.prototype.keys = function() {
  return cljs.core.es6_iterator.call(null, cljs.core.keys.call(null, this));
};
cljs.core.PersistentHashMap.prototype.entries = function() {
  return cljs.core.es6_entries_iterator.call(null, cljs.core.seq.call(null, this));
};
cljs.core.PersistentHashMap.prototype.values = function() {
  return cljs.core.es6_iterator.call(null, cljs.core.vals.call(null, this));
};
cljs.core.PersistentHashMap.prototype.has = function(a) {
  return cljs.core.contains_QMARK_.call(null, this, a);
};
cljs.core.PersistentHashMap.prototype.get = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.PersistentHashMap.prototype.forEach = function(a) {
  for (var b = cljs.core.seq.call(null, this), c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = cljs.core._nth.call(null, c, e), g = cljs.core.nth.call(null, f, 0, null), f = cljs.core.nth.call(null, f, 1, null);
      a.call(null, f, g);
      e += 1;
    } else {
      if (b = cljs.core.seq.call(null, b)) {
        cljs.core.chunked_seq_QMARK_.call(null, b) ? (c = cljs.core.chunk_first.call(null, b), b = cljs.core.chunk_rest.call(null, b), g = c, d = cljs.core.count.call(null, c), c = g) : (c = cljs.core.first.call(null, b), g = cljs.core.nth.call(null, c, 0, null), f = cljs.core.nth.call(null, c, 1, null), a.call(null, f, g), b = cljs.core.next.call(null, b), c = null, d = 0), e = 0;
      } else {
        return null;
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : c : null == this.root ? c : this.root.inode_lookup(0, cljs.core.hash.call(null, b), b, c);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  a = this.has_nil_QMARK_ ? b.call(null, c, null, this.nil_val) : c;
  return cljs.core.reduced_QMARK_.call(null, a) ? cljs.core.deref.call(null, a) : null != this.root ? this.root.kv_reduce(b, a) : a;
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentHashMap(this.meta, this.cnt, this.root, this.has_nil_QMARK_, this.nil_val, this.__hash);
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt;
};
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_unordered_coll.call(null, this);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, this, b);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientHashMap({}, this.root, this.cnt, this.has_nil_QMARK_, this.nil_val);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core._with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, this.meta);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if (null == b) {
    return this.has_nil_QMARK_ ? new cljs.core.PersistentHashMap(this.meta, this.cnt - 1, this.root, !1, null, null) : this;
  }
  if (null == this.root) {
    return this;
  }
  var c = this.root.inode_without(0, cljs.core.hash.call(null, b), b);
  return c === this.root ? this : new cljs.core.PersistentHashMap(this.meta, this.cnt - 1, c, this.has_nil_QMARK_, this.nil_val, null);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if (null == b) {
    return this.has_nil_QMARK_ && c === this.nil_val ? this : new cljs.core.PersistentHashMap(this.meta, this.has_nil_QMARK_ ? this.cnt : this.cnt + 1, this.root, !0, c, null);
  }
  a = new cljs.core.Box(!1);
  b = (null == this.root ? cljs.core.BitmapIndexedNode.EMPTY : this.root).inode_assoc(0, cljs.core.hash.call(null, b), b, c, a);
  return b === this.root ? this : new cljs.core.PersistentHashMap(this.meta, a.val ? this.cnt + 1 : this.cnt, b, this.has_nil_QMARK_, this.nil_val, null);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return null == b ? this.has_nil_QMARK_ : null == this.root ? !1 : this.root.inode_lookup(0, cljs.core.hash.call(null, b), b, cljs.core.lookup_sentinel) !== cljs.core.lookup_sentinel;
};
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 < this.cnt ? (a = null != this.root ? this.root.inode_seq() : null, this.has_nil_QMARK_ ? cljs.core.cons.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [null, this.nil_val], null), a) : a) : null;
};
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashMap(b, this.cnt, this.root, this.has_nil_QMARK_, this.nil_val, this.__hash);
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  if (cljs.core.vector_QMARK_.call(null, b)) {
    return cljs.core._assoc.call(null, this, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1));
  }
  for (var c = this, d = cljs.core.seq.call(null, b);;) {
    if (null == d) {
      return c;
    }
    var e = cljs.core.first.call(null, d);
    if (cljs.core.vector_QMARK_.call(null, e)) {
      c = cljs.core._assoc.call(null, c, cljs.core._nth.call(null, e, 0), cljs.core._nth.call(null, e, 1)), d = cljs.core.next.call(null, d);
    } else {
      throw Error("conj on a map takes map entries or seqables of map entries");
    }
  }
};
cljs.core.PersistentHashMap.prototype.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return this.cljs$core$ILookup$_lookup$arity$2(null, c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
  };
  return a;
}();
cljs.core.PersistentHashMap.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.PersistentHashMap.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.__GT_PersistentHashMap = function(a, b, c, d, e, f) {
  return new cljs.core.PersistentHashMap(a, b, c, d, e, f);
};
cljs.core.PersistentHashMap.EMPTY = new cljs.core.PersistentHashMap(null, 0, null, !1, null, 0);
cljs.core.PersistentHashMap.fromArrays = function(a, b) {
  for (var c = a.length, d = 0, e = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);;) {
    if (d < c) {
      var f = d + 1, e = cljs.core._assoc_BANG_.call(null, e, a[d], b[d]), d = f
    } else {
      return cljs.core.persistent_BANG_.call(null, e);
    }
  }
};
cljs.core.TransientHashMap = function(a, b, c, d, e) {
  this.edit = a;
  this.root = b;
  this.count = c;
  this.has_nil_QMARK_ = d;
  this.nil_val = e;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258;
};
cljs.core.TransientHashMap.cljs$lang$type = !0;
cljs.core.TransientHashMap.cljs$lang$ctorStr = "cljs.core/TransientHashMap";
cljs.core.TransientHashMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/TransientHashMap");
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(a, b) {
  return this.without_BANG_(b);
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  return this.assoc_BANG_(b, c);
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  return this.conj_BANG_(b);
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  return this.persistent_BANG_();
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : null : null == this.root ? null : this.root.inode_lookup(0, cljs.core.hash.call(null, b), b);
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : c : null == this.root ? c : this.root.inode_lookup(0, cljs.core.hash.call(null, b), b, c);
};
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if (this.edit) {
    return this.count;
  }
  throw Error("count after persistent!");
};
cljs.core.TransientHashMap.prototype.conj_BANG_ = function(a) {
  if (this.edit) {
    if (a ? a.cljs$lang$protocol_mask$partition0$ & 2048 || a.cljs$core$IMapEntry$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMapEntry, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMapEntry, a)) {
      return this.assoc_BANG_(cljs.core.key.call(null, a), cljs.core.val.call(null, a));
    }
    a = cljs.core.seq.call(null, a);
    for (var b = this;;) {
      var c = cljs.core.first.call(null, a);
      if (cljs.core.truth_(c)) {
        a = cljs.core.next.call(null, a), b = b.assoc_BANG_(cljs.core.key.call(null, c), cljs.core.val.call(null, c));
      } else {
        return b;
      }
    }
  } else {
    throw Error("conj! after persistent");
  }
};
cljs.core.TransientHashMap.prototype.assoc_BANG_ = function(a, b) {
  if (this.edit) {
    if (null == a) {
      this.nil_val !== b && (this.nil_val = b), this.has_nil_QMARK_ || (this.count += 1, this.has_nil_QMARK_ = !0);
    } else {
      var c = new cljs.core.Box(!1), d = (null == this.root ? cljs.core.BitmapIndexedNode.EMPTY : this.root).inode_assoc_BANG_(this.edit, 0, cljs.core.hash.call(null, a), a, b, c);
      d !== this.root && (this.root = d);
      c.val && (this.count += 1);
    }
    return this;
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientHashMap.prototype.without_BANG_ = function(a) {
  if (this.edit) {
    if (null == a) {
      this.has_nil_QMARK_ && (this.has_nil_QMARK_ = !1, this.nil_val = null, this.count -= 1);
    } else {
      if (null != this.root) {
        var b = new cljs.core.Box(!1);
        a = this.root.inode_without_BANG_(this.edit, 0, cljs.core.hash.call(null, a), a, b);
        a !== this.root && (this.root = a);
        cljs.core.truth_(b[0]) && (this.count -= 1);
      }
    }
    return this;
  }
  throw Error("dissoc! after persistent!");
};
cljs.core.TransientHashMap.prototype.persistent_BANG_ = function() {
  if (this.edit) {
    return this.edit = null, new cljs.core.PersistentHashMap(null, this.count, this.root, this.has_nil_QMARK_, this.nil_val, null);
  }
  throw Error("persistent! called twice");
};
cljs.core.__GT_TransientHashMap = function(a, b, c, d, e) {
  return new cljs.core.TransientHashMap(a, b, c, d, e);
};
cljs.core.tree_map_seq_push = function(a, b, c) {
  for (var d = b;;) {
    if (null != a) {
      b = c ? a.left : a.right, d = cljs.core.conj.call(null, d, a), a = b;
    } else {
      return d;
    }
  }
};
cljs.core.PersistentTreeMapSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.stack = b;
  this.ascending_QMARK_ = c;
  this.cnt = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374862;
};
cljs.core.PersistentTreeMapSeq.cljs$lang$type = !0;
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorStr = "cljs.core/PersistentTreeMapSeq";
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentTreeMapSeq");
};
cljs.core.PersistentTreeMapSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentTreeMapSeq.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 0 > this.cnt ? cljs.core.count.call(null, cljs.core.next.call(null, this)) + 1 : this.cnt;
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.peek.call(null, this.stack);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  a = cljs.core.first.call(null, this.stack);
  a = cljs.core.tree_map_seq_push.call(null, this.ascending_QMARK_ ? a.right : a.left, cljs.core.next.call(null, this.stack), this.ascending_QMARK_);
  return null != a ? new cljs.core.PersistentTreeMapSeq(null, a, this.ascending_QMARK_, this.cnt - 1, null) : cljs.core.List.EMPTY;
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeMapSeq(b, this.stack, this.ascending_QMARK_, this.cnt, this.__hash);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.__GT_PersistentTreeMapSeq = function(a, b, c, d, e) {
  return new cljs.core.PersistentTreeMapSeq(a, b, c, d, e);
};
cljs.core.create_tree_map_seq = function(a, b, c) {
  return new cljs.core.PersistentTreeMapSeq(null, cljs.core.tree_map_seq_push.call(null, a, null, b), b, c, null);
};
cljs.core.balance_left = function(a, b, c, d) {
  return c instanceof cljs.core.RedNode ? c.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(c.key, c.val, c.left.blacken(), new cljs.core.BlackNode(a, b, c.right, d, null), null) : c.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(c.right.key, c.right.val, new cljs.core.BlackNode(c.key, c.val, c.left, c.right.left, null), new cljs.core.BlackNode(a, b, c.right.right, d, null), null) : new cljs.core.BlackNode(a, b, c, d, null) : new cljs.core.BlackNode(a, b, c, d, null);
};
cljs.core.balance_right = function(a, b, c, d) {
  return d instanceof cljs.core.RedNode ? d.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.key, d.val, new cljs.core.BlackNode(a, b, c, d.left, null), d.right.blacken(), null) : d.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.left.key, d.left.val, new cljs.core.BlackNode(a, b, c, d.left.left, null), new cljs.core.BlackNode(d.key, d.val, d.left.right, d.right, null), null) : new cljs.core.BlackNode(a, b, c, d, null) : new cljs.core.BlackNode(a, b, c, d, null);
};
cljs.core.balance_left_del = function(a, b, c, d) {
  if (c instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(a, b, c.blacken(), d, null);
  }
  if (d instanceof cljs.core.BlackNode) {
    return cljs.core.balance_right.call(null, a, b, c, d.redden());
  }
  if (d instanceof cljs.core.RedNode && d.left instanceof cljs.core.BlackNode) {
    return new cljs.core.RedNode(d.left.key, d.left.val, new cljs.core.BlackNode(a, b, c, d.left.left, null), cljs.core.balance_right.call(null, d.key, d.val, d.left.right, d.right.redden()), null);
  }
  throw Error("red-black tree invariant violation");
};
cljs.core.balance_right_del = function(a, b, c, d) {
  if (d instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(a, b, c, d.blacken(), null);
  }
  if (c instanceof cljs.core.BlackNode) {
    return cljs.core.balance_left.call(null, a, b, c.redden(), d);
  }
  if (c instanceof cljs.core.RedNode && c.right instanceof cljs.core.BlackNode) {
    return new cljs.core.RedNode(c.right.key, c.right.val, cljs.core.balance_left.call(null, c.key, c.val, c.left.redden(), c.right.left), new cljs.core.BlackNode(a, b, c.right.right, d, null), null);
  }
  throw Error("red-black tree invariant violation");
};
cljs.core.tree_map_kv_reduce = function tree_map_kv_reduce(b, c, d) {
  d = null != b.left ? tree_map_kv_reduce.call(null, b.left, c, d) : d;
  if (cljs.core.reduced_QMARK_.call(null, d)) {
    return cljs.core.deref.call(null, d);
  }
  d = c.call(null, d, b.key, b.val);
  if (cljs.core.reduced_QMARK_.call(null, d)) {
    return cljs.core.deref.call(null, d);
  }
  b = null != b.right ? tree_map_kv_reduce.call(null, b.right, c, d) : d;
  return cljs.core.reduced_QMARK_.call(null, b) ? cljs.core.deref.call(null, b) : b;
};
cljs.core.BlackNode = function(a, b, c, d, e) {
  this.key = a;
  this.val = b;
  this.left = c;
  this.right = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207;
};
cljs.core.BlackNode.cljs$lang$type = !0;
cljs.core.BlackNode.cljs$lang$ctorStr = "cljs.core/BlackNode";
cljs.core.BlackNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/BlackNode");
};
cljs.core.BlackNode.prototype.add_right = function(a) {
  return a.balance_right(this);
};
cljs.core.BlackNode.prototype.redden = function() {
  return new cljs.core.RedNode(this.key, this.val, this.left, this.right, null);
};
cljs.core.BlackNode.prototype.blacken = function() {
  return this;
};
cljs.core.BlackNode.prototype.add_left = function(a) {
  return a.balance_left(this);
};
cljs.core.BlackNode.prototype.replace = function(a, b, c, d) {
  return new cljs.core.BlackNode(a, b, c, d, null);
};
cljs.core.BlackNode.prototype.balance_left = function(a) {
  return new cljs.core.BlackNode(a.key, a.val, this, a.right, null);
};
cljs.core.BlackNode.prototype.balance_right = function(a) {
  return new cljs.core.BlackNode(a.key, a.val, a.left, this, null);
};
cljs.core.BlackNode.prototype.remove_left = function(a) {
  return cljs.core.balance_left_del.call(null, this.key, this.val, a, this.right);
};
cljs.core.BlackNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.tree_map_kv_reduce.call(null, this, a, b);
};
cljs.core.BlackNode.prototype.remove_right = function(a) {
  return cljs.core.balance_right_del.call(null, this.key, this.val, this.left, a);
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, this, b, null);
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, this, b, c);
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return 0 === b ? this.key : 1 === b ? this.val : null;
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.val : c;
};
cljs.core.BlackNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val], null)).cljs$core$IVector$_assoc_n$arity$3(null, b, c);
};
cljs.core.BlackNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return null;
};
cljs.core.BlackNode.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 2;
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return this.key;
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return this.val;
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return this.val;
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key], null);
};
cljs.core.BlackNode.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.BlackNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.BlackNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.PersistentVector.EMPTY;
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, this, b);
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, this, b, c);
};
cljs.core.BlackNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  return cljs.core.assoc.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val], null), b, c);
};
cljs.core.BlackNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core._conj.call(null, cljs.core._conj.call(null, cljs.core.List.EMPTY, this.val), this.key);
};
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.with_meta.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val], null), b);
};
cljs.core.BlackNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val, b], null);
};
cljs.core.BlackNode.prototype.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return this.cljs$core$ILookup$_lookup$arity$2(null, c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
  };
  return a;
}();
cljs.core.BlackNode.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.BlackNode.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.BlackNode.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.__GT_BlackNode = function(a, b, c, d, e) {
  return new cljs.core.BlackNode(a, b, c, d, e);
};
cljs.core.RedNode = function(a, b, c, d, e) {
  this.key = a;
  this.val = b;
  this.left = c;
  this.right = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207;
};
cljs.core.RedNode.cljs$lang$type = !0;
cljs.core.RedNode.cljs$lang$ctorStr = "cljs.core/RedNode";
cljs.core.RedNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/RedNode");
};
cljs.core.RedNode.prototype.add_right = function(a) {
  return new cljs.core.RedNode(this.key, this.val, this.left, a, null);
};
cljs.core.RedNode.prototype.redden = function() {
  throw Error("red-black tree invariant violation");
};
cljs.core.RedNode.prototype.blacken = function() {
  return new cljs.core.BlackNode(this.key, this.val, this.left, this.right, null);
};
cljs.core.RedNode.prototype.add_left = function(a) {
  return new cljs.core.RedNode(this.key, this.val, a, this.right, null);
};
cljs.core.RedNode.prototype.replace = function(a, b, c, d) {
  return new cljs.core.RedNode(a, b, c, d, null);
};
cljs.core.RedNode.prototype.balance_left = function(a) {
  return this.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.key, this.val, this.left.blacken(), new cljs.core.BlackNode(a.key, a.val, this.right, a.right, null), null) : this.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.right.key, this.right.val, new cljs.core.BlackNode(this.key, this.val, this.left, this.right.left, null), new cljs.core.BlackNode(a.key, a.val, this.right.right, a.right, null), null) : new cljs.core.BlackNode(a.key, a.val, this, a.right, null);
};
cljs.core.RedNode.prototype.balance_right = function(a) {
  return this.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.key, this.val, new cljs.core.BlackNode(a.key, a.val, a.left, this.left, null), this.right.blacken(), null) : this.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.left.key, this.left.val, new cljs.core.BlackNode(a.key, a.val, a.left, this.left.left, null), new cljs.core.BlackNode(this.key, this.val, this.left.right, this.right, null), null) : new cljs.core.BlackNode(a.key, a.val, a.left, this, null);
};
cljs.core.RedNode.prototype.remove_left = function(a) {
  return new cljs.core.RedNode(this.key, this.val, a, this.right, null);
};
cljs.core.RedNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.tree_map_kv_reduce.call(null, this, a, b);
};
cljs.core.RedNode.prototype.remove_right = function(a) {
  return new cljs.core.RedNode(this.key, this.val, this.left, a, null);
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, this, b, null);
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, this, b, c);
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return 0 === b ? this.key : 1 === b ? this.val : null;
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.val : c;
};
cljs.core.RedNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val], null)).cljs$core$IVector$_assoc_n$arity$3(null, b, c);
};
cljs.core.RedNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return null;
};
cljs.core.RedNode.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 2;
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return this.key;
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return this.val;
};
cljs.core.RedNode.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return this.val;
};
cljs.core.RedNode.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key], null);
};
cljs.core.RedNode.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.RedNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.RedNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.PersistentVector.EMPTY;
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, this, b);
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, this, b, c);
};
cljs.core.RedNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  return cljs.core.assoc.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val], null), b, c);
};
cljs.core.RedNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core._conj.call(null, cljs.core._conj.call(null, cljs.core.List.EMPTY, this.val), this.key);
};
cljs.core.RedNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.with_meta.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val], null), b);
};
cljs.core.RedNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val, b], null);
};
cljs.core.RedNode.prototype.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return this.cljs$core$ILookup$_lookup$arity$2(null, c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
  };
  return a;
}();
cljs.core.RedNode.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.RedNode.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.RedNode.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.__GT_RedNode = function(a, b, c, d, e) {
  return new cljs.core.RedNode(a, b, c, d, e);
};
cljs.core.tree_map_add = function tree_map_add(b, c, d, e, f) {
  if (null == c) {
    return new cljs.core.RedNode(d, e, null, null, null);
  }
  var g = b.call(null, d, c.key);
  if (0 === g) {
    return f[0] = c, null;
  }
  if (0 > g) {
    return b = tree_map_add.call(null, b, c.left, d, e, f), null != b ? c.add_left(b) : null;
  }
  b = tree_map_add.call(null, b, c.right, d, e, f);
  return null != b ? c.add_right(b) : null;
};
cljs.core.tree_map_append = function tree_map_append(b, c) {
  if (null == b) {
    return c;
  }
  if (null == c) {
    return b;
  }
  if (b instanceof cljs.core.RedNode) {
    if (c instanceof cljs.core.RedNode) {
      var d = tree_map_append.call(null, b.right, c.left);
      return d instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.key, d.val, new cljs.core.RedNode(b.key, b.val, b.left, d.left, null), new cljs.core.RedNode(c.key, c.val, d.right, c.right, null), null) : new cljs.core.RedNode(b.key, b.val, b.left, new cljs.core.RedNode(c.key, c.val, d, c.right, null), null);
    }
    return new cljs.core.RedNode(b.key, b.val, b.left, tree_map_append.call(null, b.right, c), null);
  }
  if (c instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(c.key, c.val, tree_map_append.call(null, b, c.left), c.right, null);
  }
  d = tree_map_append.call(null, b.right, c.left);
  return d instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.key, d.val, new cljs.core.BlackNode(b.key, b.val, b.left, d.left, null), new cljs.core.BlackNode(c.key, c.val, d.right, c.right, null), null) : cljs.core.balance_left_del.call(null, b.key, b.val, b.left, new cljs.core.BlackNode(c.key, c.val, d, c.right, null));
};
cljs.core.tree_map_remove = function tree_map_remove(b, c, d, e) {
  if (null != c) {
    var f = b.call(null, d, c.key);
    if (0 === f) {
      return e[0] = c, cljs.core.tree_map_append.call(null, c.left, c.right);
    }
    if (0 > f) {
      return b = tree_map_remove.call(null, b, c.left, d, e), null != b || null != e[0] ? c.left instanceof cljs.core.BlackNode ? cljs.core.balance_left_del.call(null, c.key, c.val, b, c.right) : new cljs.core.RedNode(c.key, c.val, b, c.right, null) : null;
    }
    b = tree_map_remove.call(null, b, c.right, d, e);
    return null != b || null != e[0] ? c.right instanceof cljs.core.BlackNode ? cljs.core.balance_right_del.call(null, c.key, c.val, c.left, b) : new cljs.core.RedNode(c.key, c.val, c.left, b, null) : null;
  }
  return null;
};
cljs.core.tree_map_replace = function tree_map_replace(b, c, d, e) {
  var f = c.key, g = b.call(null, d, f);
  return 0 === g ? c.replace(f, e, c.left, c.right) : 0 > g ? c.replace(f, c.val, tree_map_replace.call(null, b, c.left, d, e), c.right) : c.replace(f, c.val, c.left, tree_map_replace.call(null, b, c.right, d, e));
};
cljs.core.PersistentTreeMap = function(a, b, c, d, e) {
  this.comp = a;
  this.tree = b;
  this.cnt = c;
  this.meta = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition0$ = 418776847;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.PersistentTreeMap.cljs$lang$type = !0;
cljs.core.PersistentTreeMap.cljs$lang$ctorStr = "cljs.core/PersistentTreeMap";
cljs.core.PersistentTreeMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentTreeMap");
};
cljs.core.PersistentTreeMap.prototype.forEach = function(a) {
  for (var b = cljs.core.seq.call(null, this), c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = cljs.core._nth.call(null, c, e), g = cljs.core.nth.call(null, f, 0, null), f = cljs.core.nth.call(null, f, 1, null);
      a.call(null, f, g);
      e += 1;
    } else {
      if (b = cljs.core.seq.call(null, b)) {
        cljs.core.chunked_seq_QMARK_.call(null, b) ? (c = cljs.core.chunk_first.call(null, b), b = cljs.core.chunk_rest.call(null, b), g = c, d = cljs.core.count.call(null, c), c = g) : (c = cljs.core.first.call(null, b), g = cljs.core.nth.call(null, c, 0, null), f = cljs.core.nth.call(null, c, 1, null), a.call(null, f, g), b = cljs.core.next.call(null, b), c = null, d = 0), e = 0;
      } else {
        return null;
      }
    }
  }
};
cljs.core.PersistentTreeMap.prototype.get = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.PersistentTreeMap.prototype.entries = function() {
  return cljs.core.es6_entries_iterator.call(null, cljs.core.seq.call(null, this));
};
cljs.core.PersistentTreeMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentTreeMap.prototype.keys = function() {
  return cljs.core.es6_iterator.call(null, cljs.core.keys.call(null, this));
};
cljs.core.PersistentTreeMap.prototype.values = function() {
  return cljs.core.es6_iterator.call(null, cljs.core.vals.call(null, this));
};
cljs.core.PersistentTreeMap.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.PersistentTreeMap.prototype.entry_at = function(a) {
  for (var b = this.tree;;) {
    if (null != b) {
      var c = this.comp.call(null, a, b.key);
      if (0 === c) {
        return b;
      }
      b = 0 > c ? b.left : b.right;
    } else {
      return null;
    }
  }
};
cljs.core.PersistentTreeMap.prototype.has = function(a) {
  return cljs.core.contains_QMARK_.call(null, this, a);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = this.entry_at(b);
  return null != a ? a.val : c;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  return null != this.tree ? cljs.core.tree_map_kv_reduce.call(null, this.tree, b, c) : c;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentTreeMap(this.comp, this.tree, this.cnt, this.meta, this.__hash);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, !1, this.cnt) : null;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_unordered_coll.call(null, this);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, this, b);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeMap.EMPTY, this.meta);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  var c = [null], d = cljs.core.tree_map_remove.call(null, this.comp, this.tree, b, c);
  return null == d ? null == cljs.core.nth.call(null, c, 0) ? this : new cljs.core.PersistentTreeMap(this.comp, null, 0, this.meta, null) : new cljs.core.PersistentTreeMap(this.comp, d.blacken(), this.cnt - 1, this.meta, null);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  a = [null];
  var d = cljs.core.tree_map_add.call(null, this.comp, this.tree, b, c, a);
  return null == d ? (a = cljs.core.nth.call(null, a, 0), cljs.core._EQ_.call(null, c, a.val) ? this : new cljs.core.PersistentTreeMap(this.comp, cljs.core.tree_map_replace.call(null, this.comp, this.tree, b, c), this.cnt, this.meta, null)) : new cljs.core.PersistentTreeMap(this.comp, d.blacken(), this.cnt + 1, this.meta, null);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return null != this.entry_at(b);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, !0, this.cnt) : null;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeMap(this.comp, this.tree, this.cnt, b, this.__hash);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  if (cljs.core.vector_QMARK_.call(null, b)) {
    return cljs.core._assoc.call(null, this, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1));
  }
  for (var c = this, d = cljs.core.seq.call(null, b);;) {
    if (null == d) {
      return c;
    }
    var e = cljs.core.first.call(null, d);
    if (cljs.core.vector_QMARK_.call(null, e)) {
      c = cljs.core._assoc.call(null, c, cljs.core._nth.call(null, e, 0), cljs.core._nth.call(null, e, 1)), d = cljs.core.next.call(null, d);
    } else {
      throw Error("conj on a map takes map entries or seqables of map entries");
    }
  }
};
cljs.core.PersistentTreeMap.prototype.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return this.cljs$core$ILookup$_lookup$arity$2(null, c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
  };
  return a;
}();
cljs.core.PersistentTreeMap.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(a, b) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, b, this.cnt) : null;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(a, b, c) {
  if (0 < this.cnt) {
    a = null;
    for (var d = this.tree;;) {
      if (null != d) {
        var e = this.comp.call(null, b, d.key);
        if (0 === e) {
          return new cljs.core.PersistentTreeMapSeq(null, cljs.core.conj.call(null, a, d), c, -1, null);
        }
        cljs.core.truth_(c) ? 0 > e ? (a = cljs.core.conj.call(null, a, d), d = d.left) : d = d.right : 0 < e ? (a = cljs.core.conj.call(null, a, d), d = d.right) : d = d.left;
      } else {
        return null == a ? null : new cljs.core.PersistentTreeMapSeq(null, a, c, -1, null);
      }
    }
  } else {
    return null;
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(a, b) {
  return cljs.core.key.call(null, b);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_comparator$arity$1 = function(a) {
  return this.comp;
};
cljs.core.__GT_PersistentTreeMap = function(a, b, c, d, e) {
  return new cljs.core.PersistentTreeMap(a, b, c, d, e);
};
cljs.core.PersistentTreeMap.EMPTY = new cljs.core.PersistentTreeMap(cljs.core.compare, null, 0, null, 0);
cljs.core.hash_map = function() {
  var a = function(a) {
    a = cljs.core.seq.call(null, a);
    for (var b = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);;) {
      if (a) {
        var e = cljs.core.nnext.call(null, a), b = cljs.core.assoc_BANG_.call(null, b, cljs.core.first.call(null, a), cljs.core.second.call(null, a));
        a = e;
      } else {
        return cljs.core.persistent_BANG_.call(null, b);
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.array_map = function() {
  var a = function(a) {
    return new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, cljs.core.count.call(null, a), 2), cljs.core.apply.call(null, cljs.core.array, a), null);
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.obj_map = function() {
  var a = function(a) {
    var b = [], e;
    e = {};
    for (a = cljs.core.seq.call(null, a);;) {
      if (a) {
        b.push(cljs.core.first.call(null, a)), e[cljs.core.first.call(null, a)] = cljs.core.second.call(null, a), a = cljs.core.nnext.call(null, a);
      } else {
        return cljs.core.ObjMap.fromObject(b, e);
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.sorted_map = function() {
  var a = function(a) {
    a = cljs.core.seq.call(null, a);
    for (var b = cljs.core.PersistentTreeMap.EMPTY;;) {
      if (a) {
        var e = cljs.core.nnext.call(null, a), b = cljs.core.assoc.call(null, b, cljs.core.first.call(null, a), cljs.core.second.call(null, a));
        a = e;
      } else {
        return b;
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.sorted_map_by = function() {
  var a = function(a, b) {
    for (var e = cljs.core.seq.call(null, b), f = new cljs.core.PersistentTreeMap(cljs.core.fn__GT_comparator.call(null, a), null, 0, null, 0);;) {
      if (e) {
        var g = cljs.core.nnext.call(null, e), f = cljs.core.assoc.call(null, f, cljs.core.first.call(null, e), cljs.core.second.call(null, e)), e = g
      } else {
        return f;
      }
    }
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.KeySeq = function(a, b) {
  this.mseq = a;
  this._meta = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374988;
};
cljs.core.KeySeq.cljs$lang$type = !0;
cljs.core.KeySeq.cljs$lang$ctorStr = "cljs.core/KeySeq";
cljs.core.KeySeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/KeySeq");
};
cljs.core.KeySeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.KeySeq.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.KeySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta;
};
cljs.core.KeySeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  a = ((a = this.mseq) ? a.cljs$lang$protocol_mask$partition0$ & 128 || a.cljs$core$INext$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) ? cljs.core._next.call(null, this.mseq) : cljs.core.next.call(null, this.mseq);
  return null == a ? null : new cljs.core.KeySeq(a, this._meta);
};
cljs.core.KeySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.KeySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.KeySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this._meta);
};
cljs.core.KeySeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.KeySeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.KeySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  a = cljs.core._first.call(null, this.mseq);
  return cljs.core._key.call(null, a);
};
cljs.core.KeySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  a = ((a = this.mseq) ? a.cljs$lang$protocol_mask$partition0$ & 128 || a.cljs$core$INext$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) ? cljs.core._next.call(null, this.mseq) : cljs.core.next.call(null, this.mseq);
  return null != a ? new cljs.core.KeySeq(a, this._meta) : cljs.core.List.EMPTY;
};
cljs.core.KeySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.KeySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.KeySeq(this.mseq, b);
};
cljs.core.KeySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.__GT_KeySeq = function(a, b) {
  return new cljs.core.KeySeq(a, b);
};
cljs.core.keys = function(a) {
  return(a = cljs.core.seq.call(null, a)) ? new cljs.core.KeySeq(a, null) : null;
};
cljs.core.key = function(a) {
  return cljs.core._key.call(null, a);
};
cljs.core.ValSeq = function(a, b) {
  this.mseq = a;
  this._meta = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374988;
};
cljs.core.ValSeq.cljs$lang$type = !0;
cljs.core.ValSeq.cljs$lang$ctorStr = "cljs.core/ValSeq";
cljs.core.ValSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ValSeq");
};
cljs.core.ValSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.ValSeq.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.ValSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta;
};
cljs.core.ValSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  a = ((a = this.mseq) ? a.cljs$lang$protocol_mask$partition0$ & 128 || a.cljs$core$INext$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) ? cljs.core._next.call(null, this.mseq) : cljs.core.next.call(null, this.mseq);
  return null == a ? null : new cljs.core.ValSeq(a, this._meta);
};
cljs.core.ValSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.ValSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.ValSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this._meta);
};
cljs.core.ValSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.ValSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.ValSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  a = cljs.core._first.call(null, this.mseq);
  return cljs.core._val.call(null, a);
};
cljs.core.ValSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  a = ((a = this.mseq) ? a.cljs$lang$protocol_mask$partition0$ & 128 || a.cljs$core$INext$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) ? cljs.core._next.call(null, this.mseq) : cljs.core.next.call(null, this.mseq);
  return null != a ? new cljs.core.ValSeq(a, this._meta) : cljs.core.List.EMPTY;
};
cljs.core.ValSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.ValSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ValSeq(this.mseq, b);
};
cljs.core.ValSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.__GT_ValSeq = function(a, b) {
  return new cljs.core.ValSeq(a, b);
};
cljs.core.vals = function(a) {
  return(a = cljs.core.seq.call(null, a)) ? new cljs.core.ValSeq(a, null) : null;
};
cljs.core.val = function(a) {
  return cljs.core._val.call(null, a);
};
cljs.core.merge = function() {
  var a = function(a) {
    return cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, a)) ? cljs.core.reduce.call(null, function(a, b) {
      return cljs.core.conj.call(null, cljs.core.truth_(a) ? a : cljs.core.PersistentArrayMap.EMPTY, b);
    }, a) : null;
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.merge_with = function() {
  var a = function(a, b) {
    if (cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, b))) {
      var e = function(a) {
        return function(b, c) {
          return cljs.core.reduce.call(null, a, cljs.core.truth_(b) ? b : cljs.core.PersistentArrayMap.EMPTY, cljs.core.seq.call(null, c));
        };
      }(function(b, d) {
        var e = cljs.core.first.call(null, d), k = cljs.core.second.call(null, d);
        return cljs.core.contains_QMARK_.call(null, b, e) ? cljs.core.assoc.call(null, b, e, a.call(null, cljs.core.get.call(null, b, e), k)) : cljs.core.assoc.call(null, b, e, k);
      });
      return cljs.core.reduce.call(null, e, b);
    }
    return null;
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.select_keys = function(a, b) {
  for (var c = cljs.core.PersistentArrayMap.EMPTY, d = cljs.core.seq.call(null, b);;) {
    if (d) {
      var e = cljs.core.first.call(null, d), f = cljs.core.get.call(null, a, e, new cljs.core.Keyword("cljs.core", "not-found", "cljs.core/not-found", -1572889185)), c = cljs.core.not_EQ_.call(null, f, new cljs.core.Keyword("cljs.core", "not-found", "cljs.core/not-found", -1572889185)) ? cljs.core.assoc.call(null, c, e, f) : c, d = cljs.core.next.call(null, d)
    } else {
      return c;
    }
  }
};
cljs.core.PersistentHashSet = function(a, b, c) {
  this.meta = a;
  this.hash_map = b;
  this.__hash = c;
  this.cljs$lang$protocol_mask$partition0$ = 15077647;
  this.cljs$lang$protocol_mask$partition1$ = 8196;
};
cljs.core.PersistentHashSet.cljs$lang$type = !0;
cljs.core.PersistentHashSet.cljs$lang$ctorStr = "cljs.core/PersistentHashSet";
cljs.core.PersistentHashSet.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentHashSet");
};
cljs.core.PersistentHashSet.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentHashSet.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.PersistentHashSet.prototype.keys = function() {
  return cljs.core.es6_iterator.call(null, cljs.core.seq.call(null, this));
};
cljs.core.PersistentHashSet.prototype.entries = function() {
  return cljs.core.es6_set_entries_iterator.call(null, cljs.core.seq.call(null, this));
};
cljs.core.PersistentHashSet.prototype.values = function() {
  return cljs.core.es6_iterator.call(null, cljs.core.seq.call(null, this));
};
cljs.core.PersistentHashSet.prototype.has = function(a) {
  return cljs.core.contains_QMARK_.call(null, this, a);
};
cljs.core.PersistentHashSet.prototype.forEach = function(a) {
  for (var b = cljs.core.seq.call(null, this), c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = cljs.core._nth.call(null, c, e), g = cljs.core.nth.call(null, f, 0, null), f = cljs.core.nth.call(null, f, 1, null);
      a.call(null, f, g);
      e += 1;
    } else {
      if (b = cljs.core.seq.call(null, b)) {
        cljs.core.chunked_seq_QMARK_.call(null, b) ? (c = cljs.core.chunk_first.call(null, b), b = cljs.core.chunk_rest.call(null, b), g = c, d = cljs.core.count.call(null, c), c = g) : (c = cljs.core.first.call(null, b), g = cljs.core.nth.call(null, c, 0, null), f = cljs.core.nth.call(null, c, 1, null), a.call(null, f, g), b = cljs.core.next.call(null, b), c = null, d = 0), e = 0;
      } else {
        return null;
      }
    }
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._contains_key_QMARK_.call(null, this.hash_map, b) ? b : c;
};
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentHashSet(this.meta, this.hash_map, this.__hash);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core._count.call(null, this.hash_map);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_unordered_coll.call(null, this);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.set_QMARK_.call(null, b) && cljs.core.count.call(null, this) === cljs.core.count.call(null, b) && cljs.core.every_QMARK_.call(null, function(a) {
    return function(b) {
      return cljs.core.contains_QMARK_.call(null, a, b);
    };
  }(this), b);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientHashSet(cljs.core._as_transient.call(null, this.hash_map));
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentHashSet.EMPTY, this.meta);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(this.meta, cljs.core._dissoc.call(null, this.hash_map, b), null);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.keys.call(null, this.hash_map);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(b, this.hash_map, this.__hash);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(this.meta, cljs.core.assoc.call(null, this.hash_map, b, null), null);
};
cljs.core.PersistentHashSet.prototype.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return this.cljs$core$ILookup$_lookup$arity$2(null, c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
  };
  return a;
}();
cljs.core.PersistentHashSet.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.PersistentHashSet.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.__GT_PersistentHashSet = function(a, b, c) {
  return new cljs.core.PersistentHashSet(a, b, c);
};
cljs.core.PersistentHashSet.EMPTY = new cljs.core.PersistentHashSet(null, cljs.core.PersistentArrayMap.EMPTY, 0);
cljs.core.PersistentHashSet.fromArray = function(a, b) {
  var c = a.length;
  if (c <= cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
    b || cljs.core.aclone.call(null, a);
    for (var d = 0, e = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY);;) {
      if (d < c) {
        var f = d + 1, e = cljs.core._assoc_BANG_.call(null, e, a[d], null), d = f
      } else {
        return new cljs.core.PersistentHashSet(null, cljs.core._persistent_BANG_.call(null, e), null);
      }
    }
  } else {
    for (d = 0, e = cljs.core.transient$.call(null, cljs.core.PersistentHashSet.EMPTY);;) {
      if (d < c) {
        f = d + 1, e = cljs.core._conj_BANG_.call(null, e, a[d]), d = f;
      } else {
        return cljs.core._persistent_BANG_.call(null, e);
      }
    }
  }
};
cljs.core.TransientHashSet = function(a) {
  this.transient_map = a;
  this.cljs$lang$protocol_mask$partition0$ = 259;
  this.cljs$lang$protocol_mask$partition1$ = 136;
};
cljs.core.TransientHashSet.cljs$lang$type = !0;
cljs.core.TransientHashSet.cljs$lang$ctorStr = "cljs.core/TransientHashSet";
cljs.core.TransientHashSet.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/TransientHashSet");
};
cljs.core.TransientHashSet.prototype.call = function() {
  var a = null, b = function(a, b) {
    return cljs.core._lookup.call(null, this.transient_map, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? null : b;
  }, c = function(a, b, c) {
    return cljs.core._lookup.call(null, this.transient_map, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? c : b;
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.TransientHashSet.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.TransientHashSet.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return cljs.core._lookup.call(null, this.transient_map, a, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? null : a;
};
cljs.core.TransientHashSet.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this.transient_map, a, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? b : a;
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._lookup.call(null, this.transient_map, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? c : b;
};
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.count.call(null, this.transient_map);
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 = function(a, b) {
  this.transient_map = cljs.core.dissoc_BANG_.call(null, this.transient_map, b);
  return this;
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  this.transient_map = cljs.core.assoc_BANG_.call(null, this.transient_map, b, null);
  return this;
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  return new cljs.core.PersistentHashSet(null, cljs.core.persistent_BANG_.call(null, this.transient_map), null);
};
cljs.core.__GT_TransientHashSet = function(a) {
  return new cljs.core.TransientHashSet(a);
};
cljs.core.PersistentTreeSet = function(a, b, c) {
  this.meta = a;
  this.tree_map = b;
  this.__hash = c;
  this.cljs$lang$protocol_mask$partition0$ = 417730831;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.PersistentTreeSet.cljs$lang$type = !0;
cljs.core.PersistentTreeSet.cljs$lang$ctorStr = "cljs.core/PersistentTreeSet";
cljs.core.PersistentTreeSet.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentTreeSet");
};
cljs.core.PersistentTreeSet.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentTreeSet.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.PersistentTreeSet.prototype.keys = function() {
  return cljs.core.es6_iterator.call(null, cljs.core.seq.call(null, this));
};
cljs.core.PersistentTreeSet.prototype.entries = function() {
  return cljs.core.es6_set_entries_iterator.call(null, cljs.core.seq.call(null, this));
};
cljs.core.PersistentTreeSet.prototype.values = function() {
  return cljs.core.es6_iterator.call(null, cljs.core.seq.call(null, this));
};
cljs.core.PersistentTreeSet.prototype.has = function(a) {
  return cljs.core.contains_QMARK_.call(null, this, a);
};
cljs.core.PersistentTreeSet.prototype.forEach = function(a) {
  for (var b = cljs.core.seq.call(null, this), c = null, d = 0, e = 0;;) {
    if (e < d) {
      var f = cljs.core._nth.call(null, c, e), g = cljs.core.nth.call(null, f, 0, null), f = cljs.core.nth.call(null, f, 1, null);
      a.call(null, f, g);
      e += 1;
    } else {
      if (b = cljs.core.seq.call(null, b)) {
        cljs.core.chunked_seq_QMARK_.call(null, b) ? (c = cljs.core.chunk_first.call(null, b), b = cljs.core.chunk_rest.call(null, b), g = c, d = cljs.core.count.call(null, c), c = g) : (c = cljs.core.first.call(null, b), g = cljs.core.nth.call(null, c, 0, null), f = cljs.core.nth.call(null, c, 1, null), a.call(null, f, g), b = cljs.core.next.call(null, b), c = null, d = 0), e = 0;
      } else {
        return null;
      }
    }
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = this.tree_map.entry_at(b);
  return null != a ? a.key : c;
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentTreeSet(this.meta, this.tree_map, this.__hash);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.count.call(null, this.tree_map);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return 0 < cljs.core.count.call(null, this.tree_map) ? cljs.core.map.call(null, cljs.core.key, cljs.core.rseq.call(null, this.tree_map)) : null;
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_unordered_coll.call(null, this);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.set_QMARK_.call(null, b) && cljs.core.count.call(null, this) === cljs.core.count.call(null, b) && cljs.core.every_QMARK_.call(null, function(a) {
    return function(b) {
      return cljs.core.contains_QMARK_.call(null, a, b);
    };
  }(this), b);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeSet.EMPTY, this.meta);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(this.meta, cljs.core.dissoc.call(null, this.tree_map, b), null);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.keys.call(null, this.tree_map);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(b, this.tree_map, this.__hash);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(this.meta, cljs.core.assoc.call(null, this.tree_map, b, null), null);
};
cljs.core.PersistentTreeSet.prototype.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return this.cljs$core$ILookup$_lookup$arity$2(null, c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
  };
  return a;
}();
cljs.core.PersistentTreeSet.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(a, b) {
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq.call(null, this.tree_map, b));
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(a, b, c) {
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq_from.call(null, this.tree_map, b, c));
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(a, b) {
  return b;
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_comparator$arity$1 = function(a) {
  return cljs.core._comparator.call(null, this.tree_map);
};
cljs.core.__GT_PersistentTreeSet = function(a, b, c) {
  return new cljs.core.PersistentTreeSet(a, b, c);
};
cljs.core.PersistentTreeSet.EMPTY = new cljs.core.PersistentTreeSet(null, cljs.core.PersistentTreeMap.EMPTY, 0);
cljs.core.set_from_indexed_seq = function(a) {
  a = a.arr;
  a: {
    for (var b = 0, c = cljs.core._as_transient.call(null, cljs.core.PersistentHashSet.EMPTY);;) {
      if (b < a.length) {
        var d = b + 1, c = cljs.core._conj_BANG_.call(null, c, a[b]), b = d
      } else {
        a = c;
        break a;
      }
    }
    a = void 0;
  }
  return cljs.core._persistent_BANG_.call(null, a);
};
cljs.core.set = function(a) {
  a = cljs.core.seq.call(null, a);
  if (null == a) {
    return cljs.core.PersistentHashSet.EMPTY;
  }
  if (a instanceof cljs.core.IndexedSeq && 0 === a.i) {
    return cljs.core.set_from_indexed_seq.call(null, a);
  }
  for (var b = cljs.core._as_transient.call(null, cljs.core.PersistentHashSet.EMPTY);;) {
    if (null != a) {
      var c = cljs.core._next.call(null, a), b = cljs.core._conj_BANG_.call(null, b, cljs.core._first.call(null, a));
      a = c;
    } else {
      return cljs.core._persistent_BANG_.call(null, b);
    }
  }
};
cljs.core.hash_set = function() {
  var a = null, b = function() {
    return cljs.core.PersistentHashSet.EMPTY;
  }, c = function() {
    var a = function(a) {
      return cljs.core.set.call(null, a);
    }, b = function(b) {
      var c = null;
      0 < arguments.length && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return a.call(this, c);
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      b = cljs.core.seq(b);
      return a(b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(arguments, 0));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 0;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.sorted_set = function() {
  var a = function(a) {
    return cljs.core.reduce.call(null, cljs.core._conj, cljs.core.PersistentTreeSet.EMPTY, a);
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.sorted_set_by = function() {
  var a = function(a, b) {
    return cljs.core.reduce.call(null, cljs.core._conj, new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map_by.call(null, a), 0), b);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.replace = function() {
  var a = null, b = function(a) {
    return cljs.core.map.call(null, function(b) {
      var c = cljs.core.find.call(null, a, b);
      return cljs.core.truth_(c) ? cljs.core.val.call(null, c) : b;
    });
  }, c = function(a, b) {
    if (cljs.core.vector_QMARK_.call(null, b)) {
      var c = cljs.core.count.call(null, b);
      return cljs.core.reduce.call(null, function(b) {
        return function(b, c) {
          var e = cljs.core.find.call(null, a, cljs.core.nth.call(null, b, c));
          return cljs.core.truth_(e) ? cljs.core.assoc.call(null, b, c, cljs.core.second.call(null, e)) : b;
        };
      }(c), b, cljs.core.take.call(null, c, cljs.core.iterate.call(null, cljs.core.inc, 0)));
    }
    return cljs.core.map.call(null, function(b) {
      var c = cljs.core.find.call(null, a, b);
      return cljs.core.truth_(c) ? cljs.core.second.call(null, c) : b;
    }, b);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.distinct = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, function() {
      return function(a, d) {
        for (;;) {
          var e = a, k = cljs.core.nth.call(null, e, 0, null);
          if (e = cljs.core.seq.call(null, e)) {
            if (cljs.core.contains_QMARK_.call(null, d, k)) {
              k = cljs.core.rest.call(null, e), e = d, a = k, d = e;
            } else {
              return cljs.core.cons.call(null, k, c.call(null, cljs.core.rest.call(null, e), cljs.core.conj.call(null, d, k)));
            }
          } else {
            return null;
          }
        }
      }.call(null, a, e);
    }, null, null);
  }.call(null, a, cljs.core.PersistentHashSet.EMPTY);
};
cljs.core.butlast = function(a) {
  for (var b = cljs.core.PersistentVector.EMPTY;;) {
    if (cljs.core.next.call(null, a)) {
      b = cljs.core.conj.call(null, b, cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a);
    } else {
      return cljs.core.seq.call(null, b);
    }
  }
};
cljs.core.name = function(a) {
  if (a && (a.cljs$lang$protocol_mask$partition1$ & 4096 || a.cljs$core$INamed$)) {
    return cljs.core._name.call(null, a);
  }
  if ("string" === typeof a) {
    return a;
  }
  throw Error("Doesn't support name: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a));
};
cljs.core.zipmap = function(a, b) {
  for (var c = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY), d = cljs.core.seq.call(null, a), e = cljs.core.seq.call(null, b);;) {
    if (d && e) {
      c = cljs.core.assoc_BANG_.call(null, c, cljs.core.first.call(null, d), cljs.core.first.call(null, e)), d = cljs.core.next.call(null, d), e = cljs.core.next.call(null, e);
    } else {
      return cljs.core.persistent_BANG_.call(null, c);
    }
  }
};
cljs.core.max_key = function() {
  var a = null, b = function(a, b, c) {
    return a.call(null, b) > a.call(null, c) ? b : c;
  }, c = function() {
    var b = function(b, c, d, e) {
      return cljs.core.reduce.call(null, function(c, d) {
        return a.call(null, b, c, d);
      }, a.call(null, b, c, d), e);
    }, c = function(a, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, l);
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var k = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, k, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return e;
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return b;
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.min_key = function() {
  var a = null, b = function(a, b, c) {
    return a.call(null, b) < a.call(null, c) ? b : c;
  }, c = function() {
    var b = function(b, c, d, e) {
      return cljs.core.reduce.call(null, function(c, d) {
        return a.call(null, b, c, d);
      }, a.call(null, b, c, d), e);
    }, c = function(a, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, l);
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var k = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, k, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return e;
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return b;
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.ArrayList = function(a) {
  this.arr = a;
};
cljs.core.ArrayList.cljs$lang$type = !0;
cljs.core.ArrayList.cljs$lang$ctorStr = "cljs.core/ArrayList";
cljs.core.ArrayList.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayList");
};
cljs.core.ArrayList.prototype.add = function(a) {
  return this.arr.push(a);
};
cljs.core.ArrayList.prototype.size = function() {
  return this.arr.length;
};
cljs.core.ArrayList.prototype.clear = function() {
  return this.arr = [];
};
cljs.core.ArrayList.prototype.isEmpty = function() {
  return 0 === this.arr.length;
};
cljs.core.ArrayList.prototype.toArray = function() {
  return this.arr;
};
cljs.core.__GT_ArrayList = function(a) {
  return new cljs.core.ArrayList(a);
};
cljs.core.array_list = function() {
  return new cljs.core.ArrayList([]);
};
cljs.core.partition_all = function() {
  var a = null, b = function(a) {
    return function(b) {
      return function(c) {
        return function() {
          var d = null, k = function() {
            return b.call(null);
          }, l = function(a) {
            if (!cljs.core.truth_(c.isEmpty())) {
              var d = cljs.core.vec.call(null, c.toArray());
              c.clear();
              a = b.call(null, a, d);
            }
            return b.call(null, a);
          }, m = function(d, h) {
            c.add(h);
            if (a === c.size()) {
              var k = cljs.core.vec.call(null, c.toArray());
              c.clear();
              return b.call(null, d, k);
            }
            return d;
          }, d = function(a, b) {
            switch(arguments.length) {
              case 0:
                return k.call(this);
              case 1:
                return l.call(this, a);
              case 2:
                return m.call(this, a, b);
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          d.cljs$core$IFn$_invoke$arity$0 = k;
          d.cljs$core$IFn$_invoke$arity$1 = l;
          d.cljs$core$IFn$_invoke$arity$2 = m;
          return d;
        }();
      }(cljs.core.array_list.call(null));
    };
  }, c = function(b, c) {
    return a.call(null, b, b, c);
  }, d = function(b, c, d) {
    return new cljs.core.LazySeq(null, function() {
      var h = cljs.core.seq.call(null, d);
      return h ? cljs.core.cons.call(null, cljs.core.take.call(null, b, h), a.call(null, b, c, cljs.core.drop.call(null, c, h))) : null;
    }, null, null);
  }, a = function(a, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, f);
      case 3:
        return d.call(this, a, f, g);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  return a;
}();
cljs.core.take_while = function() {
  var a = null, b = function(a) {
    return function(b) {
      return function() {
        var c = null, g = function() {
          return b.call(null);
        }, h = function(a) {
          return b.call(null, a);
        }, k = function(c, f) {
          return cljs.core.truth_(a.call(null, f)) ? b.call(null, c, f) : cljs.core.reduced.call(null, c);
        }, c = function(a, b) {
          switch(arguments.length) {
            case 0:
              return g.call(this);
            case 1:
              return h.call(this, a);
            case 2:
              return k.call(this, a, b);
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        c.cljs$core$IFn$_invoke$arity$0 = g;
        c.cljs$core$IFn$_invoke$arity$1 = h;
        c.cljs$core$IFn$_invoke$arity$2 = k;
        return c;
      }();
    };
  }, c = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, c);
      return f ? cljs.core.truth_(b.call(null, cljs.core.first.call(null, f))) ? cljs.core.cons.call(null, cljs.core.first.call(null, f), a.call(null, b, cljs.core.rest.call(null, f))) : null : null;
    }, null, null);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.mk_bound_fn = function(a, b, c) {
  return function(d) {
    var e = cljs.core._comparator.call(null, a);
    return b.call(null, e.call(null, cljs.core._entry_key.call(null, a, d), c), 0);
  };
};
cljs.core.subseq = function() {
  var a = null, b = function(a, b, c) {
    var g = cljs.core.mk_bound_fn.call(null, a, b, c);
    return cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._GT_, cljs.core._GT__EQ_], !0).call(null, b)) ? (a = cljs.core._sorted_seq_from.call(null, a, c, !0), cljs.core.truth_(a) ? (b = cljs.core.nth.call(null, a, 0, null), cljs.core.truth_(g.call(null, b)) ? a : cljs.core.next.call(null, a)) : null) : cljs.core.take_while.call(null, g, cljs.core._sorted_seq.call(null, a, !0));
  }, c = function(a, b, c, g, h) {
    var k = cljs.core._sorted_seq_from.call(null, a, c, !0);
    if (cljs.core.truth_(k)) {
      var l = cljs.core.nth.call(null, k, 0, null);
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, a, g, h), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, a, b, c).call(null, l)) ? k : cljs.core.next.call(null, k));
    }
    return null;
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a;
}();
cljs.core.rsubseq = function() {
  var a = null, b = function(a, b, c) {
    var g = cljs.core.mk_bound_fn.call(null, a, b, c);
    return cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._LT_, cljs.core._LT__EQ_], !0).call(null, b)) ? (a = cljs.core._sorted_seq_from.call(null, a, c, !1), cljs.core.truth_(a) ? (b = cljs.core.nth.call(null, a, 0, null), cljs.core.truth_(g.call(null, b)) ? a : cljs.core.next.call(null, a)) : null) : cljs.core.take_while.call(null, g, cljs.core._sorted_seq.call(null, a, !1));
  }, c = function(a, b, c, g, h) {
    var k = cljs.core._sorted_seq_from.call(null, a, h, !1);
    if (cljs.core.truth_(k)) {
      var l = cljs.core.nth.call(null, k, 0, null);
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, a, b, c), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, a, g, h).call(null, l)) ? k : cljs.core.next.call(null, k));
    }
    return null;
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a;
}();
cljs.core.RangeIterator = function(a, b, c) {
  this.i = a;
  this.end = b;
  this.step = c;
};
cljs.core.RangeIterator.cljs$lang$type = !0;
cljs.core.RangeIterator.cljs$lang$ctorStr = "cljs.core/RangeIterator";
cljs.core.RangeIterator.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/RangeIterator");
};
cljs.core.RangeIterator.prototype.hasNext = function() {
  return 0 < this.step ? this.i < this.end : this.i > this.end;
};
cljs.core.RangeIterator.prototype.next = function() {
  var a = this.i;
  this.i += this.step;
  return a;
};
cljs.core.__GT_RangeIterator = function(a, b, c) {
  return new cljs.core.RangeIterator(a, b, c);
};
cljs.core.Range = function(a, b, c, d, e) {
  this.meta = a;
  this.start = b;
  this.end = c;
  this.step = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition0$ = 32375006;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.Range.cljs$lang$type = !0;
cljs.core.Range.cljs$lang$ctorStr = "cljs.core/Range";
cljs.core.Range.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Range");
};
cljs.core.Range.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.Range.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if (b < cljs.core._count.call(null, this)) {
    return this.start + b * this.step;
  }
  if (this.start > this.end && 0 === this.step) {
    return this.start;
  }
  throw Error("Index out of bounds");
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return b < cljs.core._count.call(null, this) ? this.start + b * this.step : this.start > this.end && 0 === this.step ? this.start : c;
};
cljs.core.Range.prototype.cljs$core$IIterable$ = !0;
cljs.core.Range.prototype.cljs$core$IIterable$_iterator$arity$1 = function(a) {
  return new cljs.core.RangeIterator(this.start, this.end, this.step);
};
cljs.core.Range.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.Range.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.Range(this.meta, this.start, this.end, this.step, this.__hash);
};
cljs.core.Range.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return 0 < this.step ? this.start + this.step < this.end ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : null : this.start + this.step > this.end ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : null;
};
cljs.core.Range.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.not.call(null, cljs.core._seq.call(null, this)) ? 0 : Math.ceil.call(null, (this.end - this.start) / this.step);
};
cljs.core.Range.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_ordered_coll.call(null, this);
};
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, this, b);
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  for (a = this.start;;) {
    if (0 < this.step ? a < this.end : a > this.end) {
      c = b.call(null, c, a);
      if (cljs.core.reduced_QMARK_.call(null, c)) {
        return cljs.core.deref.call(null, c);
      }
      a += this.step;
    } else {
      return c;
    }
  }
};
cljs.core.Range.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return null == cljs.core._seq.call(null, this) ? null : this.start;
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return null != cljs.core._seq.call(null, this) ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : cljs.core.List.EMPTY;
};
cljs.core.Range.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 < this.step ? this.start < this.end ? this : null : this.start > this.end ? this : null;
};
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Range(b, this.start, this.end, this.step, this.__hash);
};
cljs.core.Range.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.__GT_Range = function(a, b, c, d, e) {
  return new cljs.core.Range(a, b, c, d, e);
};
cljs.core.range = function() {
  var a = null, b = function() {
    return a.call(null, 0, Number.MAX_VALUE, 1);
  }, c = function(b) {
    return a.call(null, 0, b, 1);
  }, d = function(b, c) {
    return a.call(null, b, c, 1);
  }, e = function(a, b, c) {
    return new cljs.core.Range(null, a, b, c, null);
  }, a = function(a, g, h) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, g);
      case 3:
        return e.call(this, a, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  a.cljs$core$IFn$_invoke$arity$2 = d;
  a.cljs$core$IFn$_invoke$arity$3 = e;
  return a;
}();
cljs.core.take_nth = function() {
  var a = null, b = function(a) {
    return function(b) {
      return function(c) {
        return function() {
          var g = null, h = function() {
            return b.call(null);
          }, k = function(a) {
            return b.call(null, a);
          }, l = function(g, h) {
            var k = cljs.core.swap_BANG_.call(null, c, cljs.core.inc);
            return 0 === cljs.core.rem.call(null, k, a) ? b.call(null, g, h) : g;
          }, g = function(a, b) {
            switch(arguments.length) {
              case 0:
                return h.call(this);
              case 1:
                return k.call(this, a);
              case 2:
                return l.call(this, a, b);
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          g.cljs$core$IFn$_invoke$arity$0 = h;
          g.cljs$core$IFn$_invoke$arity$1 = k;
          g.cljs$core$IFn$_invoke$arity$2 = l;
          return g;
        }();
      }(cljs.core.atom.call(null, -1));
    };
  }, c = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, c);
      return f ? cljs.core.cons.call(null, cljs.core.first.call(null, f), a.call(null, b, cljs.core.drop.call(null, b, f))) : null;
    }, null, null);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.split_with = function(a, b) {
  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.take_while.call(null, a, b), cljs.core.drop_while.call(null, a, b)], null);
};
cljs.core.partition_by = function() {
  var a = null, b = function(a) {
    return function(b) {
      var c = cljs.core.array_list.call(null), g = cljs.core.atom.call(null, new cljs.core.Keyword("cljs.core", "none", "cljs.core/none", 926646439));
      return function(c, f) {
        return function() {
          var g = null, m = function() {
            return b.call(null);
          }, n = function(a) {
            if (!cljs.core.truth_(c.isEmpty())) {
              var d = cljs.core.vec.call(null, c.toArray());
              c.clear();
              a = b.call(null, a, d);
            }
            return b.call(null, a);
          }, p = function(g, l) {
            var m = cljs.core.deref.call(null, f), n = a.call(null, l);
            cljs.core.reset_BANG_.call(null, f, n);
            if (cljs.core.keyword_identical_QMARK_.call(null, m, new cljs.core.Keyword("cljs.core", "none", "cljs.core/none", 926646439)) || cljs.core._EQ_.call(null, n, m)) {
              return c.add(l), g;
            }
            m = cljs.core.vec.call(null, c.toArray());
            c.clear();
            m = b.call(null, g, m);
            cljs.core.reduced_QMARK_.call(null, m) || c.add(l);
            return m;
          }, g = function(a, b) {
            switch(arguments.length) {
              case 0:
                return m.call(this);
              case 1:
                return n.call(this, a);
              case 2:
                return p.call(this, a, b);
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          g.cljs$core$IFn$_invoke$arity$0 = m;
          g.cljs$core$IFn$_invoke$arity$1 = n;
          g.cljs$core$IFn$_invoke$arity$2 = p;
          return g;
        }();
      }(c, g);
    };
  }, c = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, c);
      if (f) {
        var g = cljs.core.first.call(null, f), h = b.call(null, g), g = cljs.core.cons.call(null, g, cljs.core.take_while.call(null, function(a, c, e, f) {
          return function(a) {
            return cljs.core._EQ_.call(null, c, b.call(null, a));
          };
        }(g, h, f, f), cljs.core.next.call(null, f)));
        return cljs.core.cons.call(null, g, a.call(null, b, cljs.core.seq.call(null, cljs.core.drop.call(null, cljs.core.count.call(null, g), f))));
      }
      return null;
    }, null, null);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.frequencies = function(a) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(a, c) {
    return cljs.core.assoc_BANG_.call(null, a, c, cljs.core.get.call(null, a, c, 0) + 1);
  }, cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY), a));
};
cljs.core.reductions = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, c);
      return f ? a.call(null, b, cljs.core.first.call(null, f), cljs.core.rest.call(null, f)) : cljs.core._conj.call(null, cljs.core.List.EMPTY, b.call(null));
    }, null, null);
  }, c = function(b, c, f) {
    return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, function() {
      var g = cljs.core.seq.call(null, f);
      return g ? a.call(null, b, b.call(null, c, cljs.core.first.call(null, g)), cljs.core.rest.call(null, g)) : null;
    }, null, null));
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.juxt = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function() {
        return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null)], null);
      }, d = function(b) {
        return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, b)], null);
      }, e = function(b, c) {
        return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, b, c)], null);
      }, m = function(b, c, d) {
        return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, b, c, d)], null);
      }, n = function() {
        var b = function(b, c, d, e) {
          return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.apply.call(null, a, b, c, d, e)], null);
        }, c = function(a, c, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return b.call(this, a, c, d, f);
        };
        c.cljs$lang$maxFixedArity = 3;
        c.cljs$lang$applyTo = function(a) {
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return b(c, d, e, a);
        };
        c.cljs$core$IFn$_invoke$arity$variadic = b;
        return c;
      }(), b = function(a, b, f, g) {
        switch(arguments.length) {
          case 0:
            return c.call(this);
          case 1:
            return d.call(this, a);
          case 2:
            return e.call(this, a, b);
          case 3:
            return m.call(this, a, b, f);
          default:
            return n.cljs$core$IFn$_invoke$arity$variadic(a, b, f, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = n.cljs$lang$applyTo;
      b.cljs$core$IFn$_invoke$arity$0 = c;
      b.cljs$core$IFn$_invoke$arity$1 = d;
      b.cljs$core$IFn$_invoke$arity$2 = e;
      b.cljs$core$IFn$_invoke$arity$3 = m;
      b.cljs$core$IFn$_invoke$arity$variadic = n.cljs$core$IFn$_invoke$arity$variadic;
      return b;
    }();
  }, c = function(a, b) {
    return function() {
      var c = null, d = function() {
        return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null), b.call(null)], null);
      }, e = function(c) {
        return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, c), b.call(null, c)], null);
      }, m = function(c, d) {
        return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, c, d), b.call(null, c, d)], null);
      }, n = function(c, d, e) {
        return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, c, d, e), b.call(null, c, d, e)], null);
      }, p = function() {
        var c = function(c, d, e, h) {
          return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.apply.call(null, a, c, d, e, h), cljs.core.apply.call(null, b, c, d, e, h)], null);
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f);
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a);
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d;
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return d.call(this);
          case 1:
            return e.call(this, a);
          case 2:
            return m.call(this, a, b);
          case 3:
            return n.call(this, a, b, c);
          default:
            return p.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = p.cljs$lang$applyTo;
      c.cljs$core$IFn$_invoke$arity$0 = d;
      c.cljs$core$IFn$_invoke$arity$1 = e;
      c.cljs$core$IFn$_invoke$arity$2 = m;
      c.cljs$core$IFn$_invoke$arity$3 = n;
      c.cljs$core$IFn$_invoke$arity$variadic = p.cljs$core$IFn$_invoke$arity$variadic;
      return c;
    }();
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function() {
        return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null), b.call(null), c.call(null)], null);
      }, m = function(d) {
        return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, d), b.call(null, d), c.call(null, d)], null);
      }, n = function(d, e) {
        return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, d, e), b.call(null, d, e), c.call(null, d, e)], null);
      }, p = function(d, e, k) {
        return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, d, e, k), b.call(null, d, e, k), c.call(null, d, e, k)], null);
      }, q = function() {
        var d = function(d, e, k, l) {
          return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.apply.call(null, a, d, e, k, l), cljs.core.apply.call(null, b, d, e, k, l), cljs.core.apply.call(null, c, d, e, k, l)], null);
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f);
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a);
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e;
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return e.call(this);
          case 1:
            return m.call(this, a);
          case 2:
            return n.call(this, a, b);
          case 3:
            return p.call(this, a, b, c);
          default:
            return q.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = q.cljs$lang$applyTo;
      d.cljs$core$IFn$_invoke$arity$0 = e;
      d.cljs$core$IFn$_invoke$arity$1 = m;
      d.cljs$core$IFn$_invoke$arity$2 = n;
      d.cljs$core$IFn$_invoke$arity$3 = p;
      d.cljs$core$IFn$_invoke$arity$variadic = q.cljs$core$IFn$_invoke$arity$variadic;
      return d;
    }();
  }, e = function() {
    var a = function(a, b, c, d) {
      return function(a) {
        return function() {
          var b = null, c = function() {
            return cljs.core.reduce.call(null, function(a) {
              return function(a, b) {
                return cljs.core.conj.call(null, a, b.call(null));
              };
            }(a), cljs.core.PersistentVector.EMPTY, a);
          }, d = function(b) {
            return cljs.core.reduce.call(null, function(a) {
              return function(a, c) {
                return cljs.core.conj.call(null, a, c.call(null, b));
              };
            }(a), cljs.core.PersistentVector.EMPTY, a);
          }, e = function(b, c) {
            return cljs.core.reduce.call(null, function(a) {
              return function(a, d) {
                return cljs.core.conj.call(null, a, d.call(null, b, c));
              };
            }(a), cljs.core.PersistentVector.EMPTY, a);
          }, f = function(b, c, d) {
            return cljs.core.reduce.call(null, function(a) {
              return function(a, e) {
                return cljs.core.conj.call(null, a, e.call(null, b, c, d));
              };
            }(a), cljs.core.PersistentVector.EMPTY, a);
          }, g = function() {
            var b = function(b, c, d, e) {
              return cljs.core.reduce.call(null, function(a) {
                return function(a, f) {
                  return cljs.core.conj.call(null, a, cljs.core.apply.call(null, f, b, c, d, e));
                };
              }(a), cljs.core.PersistentVector.EMPTY, a);
            }, c = function(a, c, d, e) {
              var f = null;
              3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
              return b.call(this, a, c, d, f);
            };
            c.cljs$lang$maxFixedArity = 3;
            c.cljs$lang$applyTo = function(a) {
              var c = cljs.core.first(a);
              a = cljs.core.next(a);
              var d = cljs.core.first(a);
              a = cljs.core.next(a);
              var e = cljs.core.first(a);
              a = cljs.core.rest(a);
              return b(c, d, e, a);
            };
            c.cljs$core$IFn$_invoke$arity$variadic = b;
            return c;
          }(), b = function(a, b, h, k) {
            switch(arguments.length) {
              case 0:
                return c.call(this);
              case 1:
                return d.call(this, a);
              case 2:
                return e.call(this, a, b);
              case 3:
                return f.call(this, a, b, h);
              default:
                return g.cljs$core$IFn$_invoke$arity$variadic(a, b, h, cljs.core.array_seq(arguments, 3));
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          b.cljs$lang$maxFixedArity = 3;
          b.cljs$lang$applyTo = g.cljs$lang$applyTo;
          b.cljs$core$IFn$_invoke$arity$0 = c;
          b.cljs$core$IFn$_invoke$arity$1 = d;
          b.cljs$core$IFn$_invoke$arity$2 = e;
          b.cljs$core$IFn$_invoke$arity$3 = f;
          b.cljs$core$IFn$_invoke$arity$variadic = g.cljs$core$IFn$_invoke$arity$variadic;
          return b;
        }();
      }(cljs.core.list_STAR_.call(null, a, b, c, d));
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g);
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.dorun = function() {
  var a = null, b = function(a) {
    for (;;) {
      if (cljs.core.seq.call(null, a)) {
        a = cljs.core.next.call(null, a);
      } else {
        return null;
      }
    }
  }, c = function(a, b) {
    for (;;) {
      if (cljs.core.seq.call(null, b) && 0 < a) {
        var c = a - 1, g = cljs.core.next.call(null, b);
        a = c;
        b = g;
      } else {
        return null;
      }
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.doall = function() {
  var a = null, b = function(a) {
    cljs.core.dorun.call(null, a);
    return a;
  }, c = function(a, b) {
    cljs.core.dorun.call(null, a, b);
    return b;
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.regexp_QMARK_ = function(a) {
  return a instanceof RegExp;
};
cljs.core.re_matches = function(a, b) {
  if ("string" === typeof b) {
    var c = a.exec(b);
    return cljs.core._EQ_.call(null, cljs.core.first.call(null, c), b) ? 1 === cljs.core.count.call(null, c) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c) : null;
  }
  throw new TypeError("re-matches must match against a string.");
};
cljs.core.re_find = function(a, b) {
  if ("string" === typeof b) {
    var c = a.exec(b);
    return null == c ? null : 1 === cljs.core.count.call(null, c) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c);
  }
  throw new TypeError("re-find must match against a string.");
};
cljs.core.re_seq = function re_seq(b, c) {
  var d = cljs.core.re_find.call(null, b, c), e = c.search(b), f = cljs.core.coll_QMARK_.call(null, d) ? cljs.core.first.call(null, d) : d, g = cljs.core.subs.call(null, c, e + cljs.core.count.call(null, f));
  return cljs.core.truth_(d) ? new cljs.core.LazySeq(null, function(c, d, e, f) {
    return function() {
      return cljs.core.cons.call(null, c, cljs.core.seq.call(null, f) ? re_seq.call(null, b, f) : null);
    };
  }(d, e, f, g), null, null) : null;
};
cljs.core.re_pattern = function(a) {
  if (a instanceof RegExp) {
    return a;
  }
  var b = cljs.core.re_find.call(null, /^(?:\(\?([idmsux]*)\))?(.*)/, a);
  cljs.core.nth.call(null, b, 0, null);
  a = cljs.core.nth.call(null, b, 1, null);
  b = cljs.core.nth.call(null, b, 2, null);
  return new RegExp(b, a);
};
cljs.core.pr_sequential_writer = function(a, b, c, d, e, f, g) {
  var h = cljs.core._STAR_print_level_STAR_;
  try {
    cljs.core._STAR_print_level_STAR_ = null == cljs.core._STAR_print_level_STAR_ ? null : cljs.core._STAR_print_level_STAR_ - 1;
    if (null != cljs.core._STAR_print_level_STAR_ && 0 > cljs.core._STAR_print_level_STAR_) {
      return cljs.core._write.call(null, a, "#");
    }
    cljs.core._write.call(null, a, c);
    cljs.core.seq.call(null, g) && b.call(null, cljs.core.first.call(null, g), a, f);
    for (var k = cljs.core.next.call(null, g), l = (new cljs.core.Keyword(null, "print-length", "print-length", 1931866356)).cljs$core$IFn$_invoke$arity$1(f) - 1;;) {
      if (!k || null != l && 0 === l) {
        cljs.core.seq.call(null, k) && 0 === l && (cljs.core._write.call(null, a, d), cljs.core._write.call(null, a, "..."));
        break;
      } else {
        cljs.core._write.call(null, a, d);
        b.call(null, cljs.core.first.call(null, k), a, f);
        var m = cljs.core.next.call(null, k);
        c = l - 1;
        k = m;
        l = c;
      }
    }
    return cljs.core._write.call(null, a, e);
  } finally {
    cljs.core._STAR_print_level_STAR_ = h;
  }
};
cljs.core.write_all = function() {
  var a = function(a, b) {
    for (var e = cljs.core.seq.call(null, b), f = null, g = 0, h = 0;;) {
      if (h < g) {
        var k = cljs.core._nth.call(null, f, h);
        cljs.core._write.call(null, a, k);
        h += 1;
      } else {
        if (e = cljs.core.seq.call(null, e)) {
          f = e, cljs.core.chunked_seq_QMARK_.call(null, f) ? (e = cljs.core.chunk_first.call(null, f), g = cljs.core.chunk_rest.call(null, f), f = e, k = cljs.core.count.call(null, e), e = g, g = k) : (k = cljs.core.first.call(null, f), cljs.core._write.call(null, a, k), e = cljs.core.next.call(null, f), f = null, g = 0), h = 0;
        } else {
          return null;
        }
      }
    }
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.string_print = function(a) {
  cljs.core._STAR_print_fn_STAR_.call(null, a);
  return null;
};
cljs.core.flush = function() {
  return null;
};
cljs.core.char_escapes = function() {
  return{'"':'\\"', "\\":"\\\\", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t"};
}();
cljs.core.quote_string = function(a) {
  return'"' + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a.replace(RegExp('[\\\\"\b\f\n\r\t]', "g"), function(a) {
    return cljs.core.char_escapes[a];
  })) + '"';
};
cljs.core.pr_writer = function pr_writer(b, c, d) {
  if (null == b) {
    return cljs.core._write.call(null, c, "nil");
  }
  if (void 0 === b) {
    return cljs.core._write.call(null, c, "#\x3cundefined\x3e");
  }
  cljs.core.truth_(function() {
    var c = cljs.core.get.call(null, d, new cljs.core.Keyword(null, "meta", "meta", 1499536964));
    return cljs.core.truth_(c) ? (c = b ? b.cljs$lang$protocol_mask$partition0$ & 131072 || b.cljs$core$IMeta$ ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMeta, b) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMeta, b)) ? cljs.core.meta.call(null, b) : c : c;
  }()) && (cljs.core._write.call(null, c, "^"), pr_writer.call(null, cljs.core.meta.call(null, b), c, d), cljs.core._write.call(null, c, " "));
  if (null == b) {
    return cljs.core._write.call(null, c, "nil");
  }
  if (b.cljs$lang$type) {
    return b.cljs$lang$ctorPrWriter(b, c, d);
  }
  if (b && (b.cljs$lang$protocol_mask$partition0$ & 2147483648 || b.cljs$core$IPrintWithWriter$)) {
    return cljs.core._pr_writer.call(null, b, c, d);
  }
  if (cljs.core.type.call(null, b) === Boolean || "number" === typeof b) {
    return cljs.core._write.call(null, c, "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b));
  }
  if (cljs.core.object_QMARK_.call(null, b)) {
    return cljs.core._write.call(null, c, "#js "), cljs.core.print_map.call(null, cljs.core.map.call(null, function(c) {
      return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.call(null, c), b[c]], null);
    }, cljs.core.js_keys.call(null, b)), pr_writer, c, d);
  }
  if (b instanceof Array) {
    return cljs.core.pr_sequential_writer.call(null, c, pr_writer, "#js [", " ", "]", d, b);
  }
  if (goog.isString(b)) {
    return cljs.core.truth_((new cljs.core.Keyword(null, "readably", "readably", 1129599760)).cljs$core$IFn$_invoke$arity$1(d)) ? cljs.core._write.call(null, c, cljs.core.quote_string.call(null, b)) : cljs.core._write.call(null, c, b);
  }
  if (cljs.core.fn_QMARK_.call(null, b)) {
    return cljs.core.write_all.call(null, c, "#\x3c", "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b), "\x3e");
  }
  if (b instanceof Date) {
    var e = function(b, c) {
      for (var d = "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b);;) {
        if (cljs.core.count.call(null, d) < c) {
          d = "0" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(d);
        } else {
          return d;
        }
      }
    };
    return cljs.core.write_all.call(null, c, '#inst "', "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b.getUTCFullYear()), "-", e.call(null, b.getUTCMonth() + 1, 2), "-", e.call(null, b.getUTCDate(), 2), "T", e.call(null, b.getUTCHours(), 2), ":", e.call(null, b.getUTCMinutes(), 2), ":", e.call(null, b.getUTCSeconds(), 2), ".", e.call(null, b.getUTCMilliseconds(), 3), "-", '00:00"');
  }
  return cljs.core.regexp_QMARK_.call(null, b) ? cljs.core.write_all.call(null, c, '#"', b.source, '"') : (b ? b.cljs$lang$protocol_mask$partition0$ & 2147483648 || b.cljs$core$IPrintWithWriter$ || (b.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IPrintWithWriter, b)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IPrintWithWriter, b)) ? cljs.core._pr_writer.call(null, b, c, d) : cljs.core.write_all.call(null, c, "#\x3c", "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b), 
  "\x3e");
};
cljs.core.pr_seq_writer = function(a, b, c) {
  cljs.core.pr_writer.call(null, cljs.core.first.call(null, a), b, c);
  a = cljs.core.seq.call(null, cljs.core.next.call(null, a));
  for (var d = null, e = 0, f = 0;;) {
    if (f < e) {
      var g = cljs.core._nth.call(null, d, f);
      cljs.core._write.call(null, b, " ");
      cljs.core.pr_writer.call(null, g, b, c);
      f += 1;
    } else {
      if (a = cljs.core.seq.call(null, a)) {
        d = a, cljs.core.chunked_seq_QMARK_.call(null, d) ? (a = cljs.core.chunk_first.call(null, d), e = cljs.core.chunk_rest.call(null, d), d = a, g = cljs.core.count.call(null, a), a = e, e = g) : (g = cljs.core.first.call(null, d), cljs.core._write.call(null, b, " "), cljs.core.pr_writer.call(null, g, b, c), a = cljs.core.next.call(null, d), d = null, e = 0), f = 0;
      } else {
        return null;
      }
    }
  }
};
cljs.core.pr_sb_with_opts = function(a, b) {
  var c = new goog.string.StringBuffer, d = new cljs.core.StringBufferWriter(c);
  cljs.core.pr_seq_writer.call(null, a, d, b);
  cljs.core._flush.call(null, d);
  return c;
};
cljs.core.pr_str_with_opts = function(a, b) {
  return cljs.core.empty_QMARK_.call(null, a) ? "" : "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_sb_with_opts.call(null, a, b));
};
cljs.core.prn_str_with_opts = function(a, b) {
  if (cljs.core.empty_QMARK_.call(null, a)) {
    return "\n";
  }
  var c = cljs.core.pr_sb_with_opts.call(null, a, b);
  c.append("\n");
  return "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(c);
};
cljs.core.pr_with_opts = function(a, b) {
  return cljs.core.string_print.call(null, cljs.core.pr_str_with_opts.call(null, a, b));
};
cljs.core.newline = function(a) {
  cljs.core.string_print.call(null, "\n");
  return cljs.core.truth_(cljs.core.get.call(null, a, new cljs.core.Keyword(null, "flush-on-newline", "flush-on-newline", -151457939))) ? cljs.core.flush.call(null) : null;
};
cljs.core.pr_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts.call(null, a, cljs.core.pr_opts.call(null));
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.prn_str = function() {
  var a = function(a) {
    return cljs.core.prn_str_with_opts.call(null, a, cljs.core.pr_opts.call(null));
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.pr = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null));
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.print = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 1129599760), !1));
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.print_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 1129599760), !1));
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.println = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 1129599760), !1));
    return cljs.core.truth_(cljs.core._STAR_print_newline_STAR_) ? cljs.core.newline.call(null, cljs.core.pr_opts.call(null)) : null;
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.println_str = function() {
  var a = function(a) {
    return cljs.core.prn_str_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 1129599760), !1));
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.prn = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null));
    return cljs.core.truth_(cljs.core._STAR_print_newline_STAR_) ? cljs.core.newline.call(null, cljs.core.pr_opts.call(null)) : null;
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.print_map = function(a, b, c, d) {
  return cljs.core.pr_sequential_writer.call(null, c, function(a, c, d) {
    b.call(null, cljs.core.key.call(null, a), c, d);
    cljs.core._write.call(null, c, " ");
    return b.call(null, cljs.core.val.call(null, a), c, d);
  }, "{", ", ", "}", d, cljs.core.seq.call(null, a));
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, this);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "#{", " ", "}", c, this);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.print_map.call(null, this, cljs.core.pr_writer, b, c);
};
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.print_map.call(null, this, cljs.core.pr_writer, b, c);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, this);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.print_map.call(null, this, cljs.core.pr_writer, b, c);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "#{", " ", "}", c, this);
};
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.Atom.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Atom.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  cljs.core._write.call(null, b, "#\x3cAtom: ");
  cljs.core.pr_writer.call(null, this.state, b, c);
  return cljs.core._write.call(null, b, "\x3e");
};
cljs.core.ValSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ValSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, this);
};
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, this);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write.call(null, b, "()");
};
cljs.core.LazyTransformer.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.LazyTransformer.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "#queue [", " ", "]", c, cljs.core.seq.call(null, this));
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.print_map.call(null, this, cljs.core.pr_writer, b, c);
};
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.KeySeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.KeySeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.List.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.List.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.PersistentVector.prototype.cljs$core$IComparable$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IComparable$_compare$arity$2 = function(a, b) {
  return cljs.core.compare_indexed.call(null, this, b);
};
cljs.core.Subvec.prototype.cljs$core$IComparable$ = !0;
cljs.core.Subvec.prototype.cljs$core$IComparable$_compare$arity$2 = function(a, b) {
  return cljs.core.compare_indexed.call(null, this, b);
};
cljs.core.Keyword.prototype.cljs$core$IComparable$ = !0;
cljs.core.Keyword.prototype.cljs$core$IComparable$_compare$arity$2 = function(a, b) {
  return cljs.core.compare_symbols.call(null, this, b);
};
cljs.core.Symbol.prototype.cljs$core$IComparable$ = !0;
cljs.core.Symbol.prototype.cljs$core$IComparable$_compare$arity$2 = function(a, b) {
  return cljs.core.compare_symbols.call(null, this, b);
};
cljs.core.alter_meta_BANG_ = function() {
  var a = function(a, b, e) {
    return a.meta = cljs.core.apply.call(null, b, a.meta, e);
  }, b = function(b, d, e) {
    var f = null;
    2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f);
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.next(b);
    var e = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, e, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.reset_meta_BANG_ = function(a, b) {
  return a.meta = b;
};
cljs.core.add_watch = function(a, b, c) {
  return cljs.core._add_watch.call(null, a, b, c);
};
cljs.core.remove_watch = function(a, b) {
  return cljs.core._remove_watch.call(null, a, b);
};
cljs.core.gensym_counter = null;
cljs.core.gensym = function() {
  var a = null, b = function() {
    return a.call(null, "G__");
  }, c = function(a) {
    null == cljs.core.gensym_counter && (cljs.core.gensym_counter = cljs.core.atom.call(null, 0));
    return cljs.core.symbol.call(null, "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a) + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.swap_BANG_.call(null, cljs.core.gensym_counter, cljs.core.inc)));
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a;
}();
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;
cljs.core.Delay = function(a, b) {
  this.f = a;
  this.value = b;
  this.cljs$lang$protocol_mask$partition1$ = 1;
  this.cljs$lang$protocol_mask$partition0$ = 32768;
};
cljs.core.Delay.cljs$lang$type = !0;
cljs.core.Delay.cljs$lang$ctorStr = "cljs.core/Delay";
cljs.core.Delay.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Delay");
};
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_$arity$1 = function(a) {
  return cljs.core.not.call(null, this.f);
};
cljs.core.Delay.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  cljs.core.truth_(this.f) && (this.value = this.f.call(null), this.f = null);
  return this.value;
};
cljs.core.__GT_Delay = function(a, b) {
  return new cljs.core.Delay(a, b);
};
cljs.core.delay_QMARK_ = function(a) {
  return a instanceof cljs.core.Delay;
};
cljs.core.force = function(a) {
  return cljs.core.delay_QMARK_.call(null, a) ? cljs.core.deref.call(null, a) : a;
};
cljs.core.realized_QMARK_ = function(a) {
  return cljs.core._realized_QMARK_.call(null, a);
};
cljs.core.preserving_reduced = function(a) {
  return function(b, c) {
    var d = a.call(null, b, c);
    return cljs.core.reduced_QMARK_.call(null, d) ? cljs.core.reduced.call(null, d) : d;
  };
};
cljs.core.cat = function(a) {
  return function(b) {
    return function() {
      var c = null, d = function() {
        return a.call(null);
      }, e = function(b) {
        return a.call(null, b);
      }, f = function(a, c) {
        return cljs.core.reduce.call(null, b, a, c);
      }, c = function(a, b) {
        switch(arguments.length) {
          case 0:
            return d.call(this);
          case 1:
            return e.call(this, a);
          case 2:
            return f.call(this, a, b);
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$core$IFn$_invoke$arity$0 = d;
      c.cljs$core$IFn$_invoke$arity$1 = e;
      c.cljs$core$IFn$_invoke$arity$2 = f;
      return c;
    }();
  }(cljs.core.preserving_reduced.call(null, a));
};
cljs.core.dedupe = function() {
  var a = null, b = function() {
    return function(a) {
      return function(b) {
        return function() {
          var c = null, g = function() {
            return a.call(null);
          }, h = function(b) {
            return a.call(null, b);
          }, k = function(c, f) {
            var g = cljs.core.deref.call(null, b);
            cljs.core.reset_BANG_.call(null, b, f);
            return cljs.core._EQ_.call(null, g, f) ? c : a.call(null, c, f);
          }, c = function(a, b) {
            switch(arguments.length) {
              case 0:
                return g.call(this);
              case 1:
                return h.call(this, a);
              case 2:
                return k.call(this, a, b);
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          c.cljs$core$IFn$_invoke$arity$0 = g;
          c.cljs$core$IFn$_invoke$arity$1 = h;
          c.cljs$core$IFn$_invoke$arity$2 = k;
          return c;
        }();
      }(cljs.core.atom.call(null, new cljs.core.Keyword("cljs.core", "none", "cljs.core/none", 926646439)));
    };
  }, c = function(b) {
    return cljs.core.sequence.call(null, a.call(null), b);
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a;
}();
cljs.core.random_sample = function() {
  var a = null, b = function(a) {
    return cljs.core.filter.call(null, function(b) {
      return cljs.core.rand.call(null) < a;
    });
  }, c = function(a, b) {
    return cljs.core.filter.call(null, function(b) {
      return cljs.core.rand.call(null) < a;
    }, b);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.Eduction = function(a, b) {
  this.xform = a;
  this.coll = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2173173760;
};
cljs.core.Eduction.cljs$lang$type = !0;
cljs.core.Eduction.cljs$lang$ctorStr = "cljs.core/Eduction";
cljs.core.Eduction.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Eduction");
};
cljs.core.Eduction.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.Eduction.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.transduce.call(null, this.xform, b, c, this.coll);
};
cljs.core.Eduction.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.seq.call(null, cljs.core.sequence.call(null, this.xform, this.coll));
};
cljs.core.__GT_Eduction = function(a, b) {
  return new cljs.core.Eduction(a, b);
};
cljs.core.eduction = function(a, b) {
  return new cljs.core.Eduction(a, b);
};
cljs.core.run_BANG_ = function(a, b) {
  return cljs.core.reduce.call(null, function(b, d) {
    return a.call(null, d);
  }, null, b);
};
cljs.core.IEncodeJS = function() {
  return{};
}();
cljs.core._clj__GT_js = function(a) {
  if (a ? a.cljs$core$IEncodeJS$_clj__GT_js$arity$1 : a) {
    return a.cljs$core$IEncodeJS$_clj__GT_js$arity$1(a);
  }
  var b;
  b = cljs.core._clj__GT_js[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._clj__GT_js._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEncodeJS.-clj-\x3ejs", a);
  }
  return b.call(null, a);
};
cljs.core._key__GT_js = function(a) {
  if (a ? a.cljs$core$IEncodeJS$_key__GT_js$arity$1 : a) {
    return a.cljs$core$IEncodeJS$_key__GT_js$arity$1(a);
  }
  var b;
  b = cljs.core._key__GT_js[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._key__GT_js._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEncodeJS.-key-\x3ejs", a);
  }
  return b.call(null, a);
};
cljs.core.key__GT_js = function(a) {
  return(a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$IEncodeJS$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeJS, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeJS, a)) ? cljs.core._clj__GT_js.call(null, a) : "string" === typeof a || "number" === typeof a || a instanceof cljs.core.Keyword || a instanceof cljs.core.Symbol ? cljs.core.clj__GT_js.call(null, a) : cljs.core.pr_str.call(null, a);
};
cljs.core.clj__GT_js = function clj__GT_js(b) {
  if (null == b) {
    return null;
  }
  if (b ? cljs.core.truth_(cljs.core.truth_(null) ? null : b.cljs$core$IEncodeJS$) || (b.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeJS, b)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeJS, b)) {
    return cljs.core._clj__GT_js.call(null, b);
  }
  if (b instanceof cljs.core.Keyword) {
    return cljs.core.name.call(null, b);
  }
  if (b instanceof cljs.core.Symbol) {
    return "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b);
  }
  if (cljs.core.map_QMARK_.call(null, b)) {
    var c = {};
    b = cljs.core.seq.call(null, b);
    for (var d = null, e = 0, f = 0;;) {
      if (f < e) {
        var g = cljs.core._nth.call(null, d, f), h = cljs.core.nth.call(null, g, 0, null), g = cljs.core.nth.call(null, g, 1, null);
        c[cljs.core.key__GT_js.call(null, h)] = clj__GT_js.call(null, g);
        f += 1;
      } else {
        if (b = cljs.core.seq.call(null, b)) {
          cljs.core.chunked_seq_QMARK_.call(null, b) ? (e = cljs.core.chunk_first.call(null, b), b = cljs.core.chunk_rest.call(null, b), d = e, e = cljs.core.count.call(null, e)) : (e = cljs.core.first.call(null, b), d = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null), c[cljs.core.key__GT_js.call(null, d)] = clj__GT_js.call(null, e), b = cljs.core.next.call(null, b), d = null, e = 0), f = 0;
        } else {
          break;
        }
      }
    }
    return c;
  }
  if (cljs.core.coll_QMARK_.call(null, b)) {
    c = [];
    b = cljs.core.seq.call(null, cljs.core.map.call(null, clj__GT_js, b));
    d = null;
    for (f = e = 0;;) {
      if (f < e) {
        h = cljs.core._nth.call(null, d, f), c.push(h), f += 1;
      } else {
        if (b = cljs.core.seq.call(null, b)) {
          d = b, cljs.core.chunked_seq_QMARK_.call(null, d) ? (b = cljs.core.chunk_first.call(null, d), f = cljs.core.chunk_rest.call(null, d), d = b, e = cljs.core.count.call(null, b), b = f) : (b = cljs.core.first.call(null, d), c.push(b), b = cljs.core.next.call(null, d), d = null, e = 0), f = 0;
        } else {
          break;
        }
      }
    }
    return c;
  }
  return b;
};
cljs.core.IEncodeClojure = function() {
  return{};
}();
cljs.core._js__GT_clj = function(a, b) {
  if (a ? a.cljs$core$IEncodeClojure$_js__GT_clj$arity$2 : a) {
    return a.cljs$core$IEncodeClojure$_js__GT_clj$arity$2(a, b);
  }
  var c;
  c = cljs.core._js__GT_clj[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._js__GT_clj._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IEncodeClojure.-js-\x3eclj", a);
  }
  return c.call(null, a, b);
};
cljs.core.js__GT_clj = function() {
  var a = null, b = function(b) {
    return a.call(null, b, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "keywordize-keys", "keywordize-keys", 1310784252), !1], null));
  }, c = function() {
    var a = function(a, b) {
      if (a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$IEncodeClojure$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeClojure, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeClojure, a)) {
        return cljs.core._js__GT_clj.call(null, a, cljs.core.apply.call(null, cljs.core.array_map, b));
      }
      if (cljs.core.seq.call(null, b)) {
        var c = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, d = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "keywordize-keys", "keywordize-keys", 1310784252)), e = cljs.core.truth_(d) ? cljs.core.keyword : cljs.core.str;
        return function(a, b, c, d) {
          return function s(e) {
            return cljs.core.seq_QMARK_.call(null, e) ? cljs.core.doall.call(null, cljs.core.map.call(null, s, e)) : cljs.core.coll_QMARK_.call(null, e) ? cljs.core.into.call(null, cljs.core.empty.call(null, e), cljs.core.map.call(null, s, e)) : e instanceof Array ? cljs.core.vec.call(null, cljs.core.map.call(null, s, e)) : cljs.core.type.call(null, e) === Object ? cljs.core.into.call(null, cljs.core.PersistentArrayMap.EMPTY, function() {
              return function(a, b, c, d) {
                return function J(f) {
                  return new cljs.core.LazySeq(null, function(a, b, c, d) {
                    return function() {
                      for (;;) {
                        var a = cljs.core.seq.call(null, f);
                        if (a) {
                          if (cljs.core.chunked_seq_QMARK_.call(null, a)) {
                            var b = cljs.core.chunk_first.call(null, a), c = cljs.core.count.call(null, b), g = cljs.core.chunk_buffer.call(null, c);
                            a: {
                              for (var h = 0;;) {
                                if (h < c) {
                                  var k = cljs.core._nth.call(null, b, h);
                                  cljs.core.chunk_append.call(null, g, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [d.call(null, k), s.call(null, e[k])], null));
                                  h += 1;
                                } else {
                                  b = !0;
                                  break a;
                                }
                              }
                              b = void 0;
                            }
                            return b ? cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, g), J.call(null, cljs.core.chunk_rest.call(null, a))) : cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, g), null);
                          }
                          g = cljs.core.first.call(null, a);
                          return cljs.core.cons.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [d.call(null, g), s.call(null, e[g])], null), J.call(null, cljs.core.rest.call(null, a)));
                        }
                        return null;
                      }
                    };
                  }(a, b, c, d), null, null);
                };
              }(a, b, c, d).call(null, cljs.core.js_keys.call(null, e));
            }()) : e;
          };
        }(b, c, d, e).call(null, a);
      }
      return null;
    }, b = function(b, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return a.call(this, b, e);
    };
    b.cljs$lang$maxFixedArity = 1;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.memoize = function(a) {
  return function(b) {
    return function() {
      var c = function(c) {
        var d = cljs.core.get.call(null, cljs.core.deref.call(null, b), c, cljs.core.lookup_sentinel);
        d === cljs.core.lookup_sentinel && (d = cljs.core.apply.call(null, a, c), cljs.core.swap_BANG_.call(null, b, cljs.core.assoc, c, d));
        return d;
      }, d = function(a) {
        var b = null;
        0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return c.call(this, b);
      };
      d.cljs$lang$maxFixedArity = 0;
      d.cljs$lang$applyTo = function(a) {
        a = cljs.core.seq(a);
        return c(a);
      };
      d.cljs$core$IFn$_invoke$arity$variadic = c;
      return d;
    }();
  }(cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY));
};
cljs.core.trampoline = function() {
  var a = null, b = function(a) {
    for (;;) {
      if (a = a.call(null), !cljs.core.fn_QMARK_.call(null, a)) {
        return a;
      }
    }
  }, c = function() {
    var b = function(b, c) {
      return a.call(null, function() {
        return cljs.core.apply.call(null, b, c);
      });
    }, c = function(a, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, e);
    };
    c.cljs$lang$maxFixedArity = 1;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.rand = function() {
  var a = null, b = function() {
    return a.call(null, 1);
  }, c = function(a) {
    return Math.random.call(null) * a;
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a;
}();
cljs.core.rand_int = function(a) {
  return Math.floor.call(null, Math.random.call(null) * a);
};
cljs.core.rand_nth = function(a) {
  return cljs.core.nth.call(null, a, cljs.core.rand_int.call(null, cljs.core.count.call(null, a)));
};
cljs.core.group_by = function(a, b) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(b, d) {
    var e = a.call(null, d);
    return cljs.core.assoc_BANG_.call(null, b, e, cljs.core.conj.call(null, cljs.core.get.call(null, b, e, cljs.core.PersistentVector.EMPTY), d));
  }, cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY), b));
};
cljs.core.make_hierarchy = function() {
  return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null, "parents", "parents", -2027538891), cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "descendants", "descendants", 1824886031), cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "ancestors", "ancestors", -776045424), cljs.core.PersistentArrayMap.EMPTY], null);
};
cljs.core._global_hierarchy = null;
cljs.core.get_global_hierarchy = function() {
  null == cljs.core._global_hierarchy && (cljs.core._global_hierarchy = cljs.core.atom.call(null, cljs.core.make_hierarchy.call(null)));
  return cljs.core._global_hierarchy;
};
cljs.core.swap_global_hierarchy_BANG_ = function() {
  var a = function(a, b) {
    return cljs.core.apply.call(null, cljs.core.swap_BANG_, cljs.core.get_global_hierarchy.call(null), a, b);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.isa_QMARK_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b, c);
  }, c = function(b, c, f) {
    var g = cljs.core._EQ_.call(null, c, f);
    if (!g && !(g = cljs.core.contains_QMARK_.call(null, (new cljs.core.Keyword(null, "ancestors", "ancestors", -776045424)).cljs$core$IFn$_invoke$arity$1(b).call(null, c), f)) && (g = cljs.core.vector_QMARK_.call(null, f)) && (g = cljs.core.vector_QMARK_.call(null, c))) {
      if (g = cljs.core.count.call(null, f) === cljs.core.count.call(null, c)) {
        for (var g = !0, h = 0;;) {
          if (g && h !== cljs.core.count.call(null, f)) {
            g = a.call(null, b, c.call(null, h), f.call(null, h)), h += 1;
          } else {
            return g;
          }
        }
      } else {
        return g;
      }
    } else {
      return g;
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.parents = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b);
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, (new cljs.core.Keyword(null, "parents", "parents", -2027538891)).cljs$core$IFn$_invoke$arity$1(a), b));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.ancestors = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b);
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, (new cljs.core.Keyword(null, "ancestors", "ancestors", -776045424)).cljs$core$IFn$_invoke$arity$1(a), b));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.descendants = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b);
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, (new cljs.core.Keyword(null, "descendants", "descendants", 1824886031)).cljs$core$IFn$_invoke$arity$1(a), b));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.derive = function() {
  var a = null, b = function(b, c) {
    if (!cljs.core.truth_(cljs.core.namespace.call(null, c))) {
      throw Error("Assert failed: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "namespace", "namespace", 1263021155, null), new cljs.core.Symbol(null, "parent", "parent", 761652748, null)))));
    }
    cljs.core.swap_global_hierarchy_BANG_.call(null, a, b, c);
    return null;
  }, c = function(a, b, c) {
    if (!cljs.core.not_EQ_.call(null, b, c)) {
      throw Error("Assert failed: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "not\x3d", "not\x3d", 1466536204, null), new cljs.core.Symbol(null, "tag", "tag", 350170304, null), new cljs.core.Symbol(null, "parent", "parent", 761652748, null)))));
    }
    var g = (new cljs.core.Keyword(null, "parents", "parents", -2027538891)).cljs$core$IFn$_invoke$arity$1(a), h = (new cljs.core.Keyword(null, "descendants", "descendants", 1824886031)).cljs$core$IFn$_invoke$arity$1(a), k = (new cljs.core.Keyword(null, "ancestors", "ancestors", -776045424)).cljs$core$IFn$_invoke$arity$1(a), l = function(a, b, c) {
      return function(d, e, f, g, h) {
        return cljs.core.reduce.call(null, function(a, b, c) {
          return function(a, b) {
            return cljs.core.assoc.call(null, a, b, cljs.core.reduce.call(null, cljs.core.conj, cljs.core.get.call(null, h, b, cljs.core.PersistentHashSet.EMPTY), cljs.core.cons.call(null, g, h.call(null, g))));
          };
        }(a, b, c), d, cljs.core.cons.call(null, e, f.call(null, e)));
      };
    }(g, h, k);
    if (cljs.core.contains_QMARK_.call(null, g.call(null, b), c)) {
      b = null;
    } else {
      if (cljs.core.contains_QMARK_.call(null, k.call(null, b), c)) {
        throw Error("" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b) + "already has" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(c) + "as ancestor");
      }
      if (cljs.core.contains_QMARK_.call(null, k.call(null, c), b)) {
        throw Error("Cyclic derivation:" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(c) + "has" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b) + "as ancestor");
      }
      b = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null, "parents", "parents", -2027538891), cljs.core.assoc.call(null, (new cljs.core.Keyword(null, "parents", "parents", -2027538891)).cljs$core$IFn$_invoke$arity$1(a), b, cljs.core.conj.call(null, cljs.core.get.call(null, g, b, cljs.core.PersistentHashSet.EMPTY), c)), new cljs.core.Keyword(null, "ancestors", "ancestors", -776045424), l.call(null, (new cljs.core.Keyword(null, "ancestors", "ancestors", -776045424)).cljs$core$IFn$_invoke$arity$1(a), 
      b, h, c, k), new cljs.core.Keyword(null, "descendants", "descendants", 1824886031), l.call(null, (new cljs.core.Keyword(null, "descendants", "descendants", 1824886031)).cljs$core$IFn$_invoke$arity$1(a), c, k, b, h)], null);
    }
    return cljs.core.truth_(b) ? b : a;
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.underive = function() {
  var a = null, b = function(b, c) {
    cljs.core.swap_global_hierarchy_BANG_.call(null, a, b, c);
    return null;
  }, c = function(a, b, c) {
    var g = (new cljs.core.Keyword(null, "parents", "parents", -2027538891)).cljs$core$IFn$_invoke$arity$1(a), h = cljs.core.truth_(g.call(null, b)) ? cljs.core.disj.call(null, g.call(null, b), c) : cljs.core.PersistentHashSet.EMPTY, k = cljs.core.truth_(cljs.core.not_empty.call(null, h)) ? cljs.core.assoc.call(null, g, b, h) : cljs.core.dissoc.call(null, g, b), l = cljs.core.flatten.call(null, cljs.core.map.call(null, function(a, b, c) {
      return function(a) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, a), cljs.core.interpose.call(null, cljs.core.first.call(null, a), cljs.core.second.call(null, a)));
      };
    }(g, h, k), cljs.core.seq.call(null, k)));
    return cljs.core.contains_QMARK_.call(null, g.call(null, b), c) ? cljs.core.reduce.call(null, function(a, b, c, d) {
      return function(a, b) {
        return cljs.core.apply.call(null, cljs.core.derive, a, b);
      };
    }(g, h, k, l), cljs.core.make_hierarchy.call(null), cljs.core.partition.call(null, 2, l)) : a;
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.reset_cache = function(a, b, c, d) {
  cljs.core.swap_BANG_.call(null, a, function(a) {
    return cljs.core.deref.call(null, b);
  });
  return cljs.core.swap_BANG_.call(null, c, function(a) {
    return cljs.core.deref.call(null, d);
  });
};
cljs.core.prefers_STAR_ = function prefers_STAR_(b, c, d) {
  var e = cljs.core.deref.call(null, d).call(null, b), e = cljs.core.truth_(cljs.core.truth_(e) ? e.call(null, c) : e) ? !0 : null;
  if (cljs.core.truth_(e)) {
    return e;
  }
  e = function() {
    for (var e = cljs.core.parents.call(null, c);;) {
      if (0 < cljs.core.count.call(null, e)) {
        cljs.core.truth_(prefers_STAR_.call(null, b, cljs.core.first.call(null, e), d)), e = cljs.core.rest.call(null, e);
      } else {
        return null;
      }
    }
  }();
  if (cljs.core.truth_(e)) {
    return e;
  }
  e = function() {
    for (var e = cljs.core.parents.call(null, b);;) {
      if (0 < cljs.core.count.call(null, e)) {
        cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first.call(null, e), c, d)), e = cljs.core.rest.call(null, e);
      } else {
        return null;
      }
    }
  }();
  return cljs.core.truth_(e) ? e : !1;
};
cljs.core.dominates = function(a, b, c) {
  c = cljs.core.prefers_STAR_.call(null, a, b, c);
  return cljs.core.truth_(c) ? c : cljs.core.isa_QMARK_.call(null, a, b);
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(b, c, d, e, f, g, h) {
  var k = cljs.core.reduce.call(null, function(e, g) {
    var h = cljs.core.nth.call(null, g, 0, null);
    cljs.core.nth.call(null, g, 1, null);
    if (cljs.core.isa_QMARK_.call(null, cljs.core.deref.call(null, d), c, h)) {
      var k = cljs.core.truth_(function() {
        var b = null == e;
        return b ? b : cljs.core.dominates.call(null, h, cljs.core.first.call(null, e), f);
      }()) ? g : e;
      if (!cljs.core.truth_(cljs.core.dominates.call(null, cljs.core.first.call(null, k), h, f))) {
        throw Error("Multiple methods in multimethod '" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b) + "' match dispatch value: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(c) + " -\x3e " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(h) + " and " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.first.call(null, k)) + ", and neither is preferred");
      }
      return k;
    }
    return e;
  }, null, cljs.core.deref.call(null, e));
  if (cljs.core.truth_(k)) {
    if (cljs.core._EQ_.call(null, cljs.core.deref.call(null, h), cljs.core.deref.call(null, d))) {
      return cljs.core.swap_BANG_.call(null, g, cljs.core.assoc, c, cljs.core.second.call(null, k)), cljs.core.second.call(null, k);
    }
    cljs.core.reset_cache.call(null, g, e, h, d);
    return find_and_cache_best_method.call(null, b, c, d, e, f, g, h);
  }
  return null;
};
cljs.core.IMultiFn = function() {
  return{};
}();
cljs.core._reset = function(a) {
  if (a ? a.cljs$core$IMultiFn$_reset$arity$1 : a) {
    return a.cljs$core$IMultiFn$_reset$arity$1(a);
  }
  var b;
  b = cljs.core._reset[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._reset._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", a);
  }
  return b.call(null, a);
};
cljs.core._add_method = function(a, b, c) {
  if (a ? a.cljs$core$IMultiFn$_add_method$arity$3 : a) {
    return a.cljs$core$IMultiFn$_add_method$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._add_method[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._add_method._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", a);
  }
  return d.call(null, a, b, c);
};
cljs.core._remove_method = function(a, b) {
  if (a ? a.cljs$core$IMultiFn$_remove_method$arity$2 : a) {
    return a.cljs$core$IMultiFn$_remove_method$arity$2(a, b);
  }
  var c;
  c = cljs.core._remove_method[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._remove_method._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", a);
  }
  return c.call(null, a, b);
};
cljs.core._prefer_method = function(a, b, c) {
  if (a ? a.cljs$core$IMultiFn$_prefer_method$arity$3 : a) {
    return a.cljs$core$IMultiFn$_prefer_method$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._prefer_method[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._prefer_method._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", a);
  }
  return d.call(null, a, b, c);
};
cljs.core._get_method = function(a, b) {
  if (a ? a.cljs$core$IMultiFn$_get_method$arity$2 : a) {
    return a.cljs$core$IMultiFn$_get_method$arity$2(a, b);
  }
  var c;
  c = cljs.core._get_method[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._get_method._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", a);
  }
  return c.call(null, a, b);
};
cljs.core._methods = function(a) {
  if (a ? a.cljs$core$IMultiFn$_methods$arity$1 : a) {
    return a.cljs$core$IMultiFn$_methods$arity$1(a);
  }
  var b;
  b = cljs.core._methods[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._methods._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", a);
  }
  return b.call(null, a);
};
cljs.core._prefers = function(a) {
  if (a ? a.cljs$core$IMultiFn$_prefers$arity$1 : a) {
    return a.cljs$core$IMultiFn$_prefers$arity$1(a);
  }
  var b;
  b = cljs.core._prefers[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._prefers._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", a);
  }
  return b.call(null, a);
};
cljs.core.throw_no_method_error = function(a, b) {
  throw Error("No method in multimethod '" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a) + "' for dispatch value: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b));
};
cljs.core.MultiFn = function(a, b, c, d, e, f, g, h) {
  this.name = a;
  this.dispatch_fn = b;
  this.default_dispatch_val = c;
  this.hierarchy = d;
  this.method_table = e;
  this.prefer_table = f;
  this.method_cache = g;
  this.cached_hierarchy = h;
  this.cljs$lang$protocol_mask$partition0$ = 4194305;
  this.cljs$lang$protocol_mask$partition1$ = 256;
};
cljs.core.MultiFn.cljs$lang$type = !0;
cljs.core.MultiFn.cljs$lang$ctorStr = "cljs.core/MultiFn";
cljs.core.MultiFn.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/MultiFn");
};
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.getUid(this);
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset$arity$1 = function(a) {
  cljs.core.swap_BANG_.call(null, this.method_table, function(a) {
    return function(a) {
      return cljs.core.PersistentArrayMap.EMPTY;
    };
  }(this));
  cljs.core.swap_BANG_.call(null, this.method_cache, function(a) {
    return function(a) {
      return cljs.core.PersistentArrayMap.EMPTY;
    };
  }(this));
  cljs.core.swap_BANG_.call(null, this.prefer_table, function(a) {
    return function(a) {
      return cljs.core.PersistentArrayMap.EMPTY;
    };
  }(this));
  cljs.core.swap_BANG_.call(null, this.cached_hierarchy, function(a) {
    return function(a) {
      return null;
    };
  }(this));
  return this;
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method$arity$3 = function(a, b, c) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.assoc, b, c);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return this;
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method$arity$2 = function(a, b) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.dissoc, b);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return this;
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method$arity$2 = function(a, b) {
  cljs.core._EQ_.call(null, cljs.core.deref.call(null, this.cached_hierarchy), cljs.core.deref.call(null, this.hierarchy)) || cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  var c = cljs.core.deref.call(null, this.method_cache).call(null, b);
  if (cljs.core.truth_(c)) {
    return c;
  }
  c = cljs.core.find_and_cache_best_method.call(null, this.name, b, this.hierarchy, this.method_table, this.prefer_table, this.method_cache, this.cached_hierarchy);
  return cljs.core.truth_(c) ? c : cljs.core.deref.call(null, this.method_table).call(null, this.default_dispatch_val);
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method$arity$3 = function(a, b, c) {
  if (cljs.core.truth_(cljs.core.prefers_STAR_.call(null, b, c, this.prefer_table))) {
    throw Error("Preference conflict in multimethod '" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(this.name) + "': " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(c) + " is already preferred to " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b));
  }
  cljs.core.swap_BANG_.call(null, this.prefer_table, function(a) {
    return function(a) {
      return cljs.core.assoc.call(null, a, b, cljs.core.conj.call(null, cljs.core.get.call(null, a, b, cljs.core.PersistentHashSet.EMPTY), c));
    };
  }(this));
  return cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods$arity$1 = function(a) {
  return cljs.core.deref.call(null, this.method_table);
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers$arity$1 = function(a) {
  return cljs.core.deref.call(null, this.prefer_table);
};
cljs.core.MultiFn.prototype.call = function() {
  var a = null, b = function(a, b) {
    a = this;
    var c = a.dispatch_fn.call(null, b), d = this.cljs$core$IMultiFn$_get_method$arity$2(null, c);
    cljs.core.truth_(d) || cljs.core.throw_no_method_error.call(null, a.name, c);
    return d.call(null, b);
  }, c = function(a, b, c) {
    a = this;
    var d = a.dispatch_fn.call(null, b, c), e = this.cljs$core$IMultiFn$_get_method$arity$2(null, d);
    cljs.core.truth_(e) || cljs.core.throw_no_method_error.call(null, a.name, d);
    return e.call(null, b, c);
  }, d = function(a, b, c, d) {
    a = this;
    var e = a.dispatch_fn.call(null, b, c, d), f = this.cljs$core$IMultiFn$_get_method$arity$2(null, e);
    cljs.core.truth_(f) || cljs.core.throw_no_method_error.call(null, a.name, e);
    return f.call(null, b, c, d);
  }, e = function(a, b, c, d, e) {
    a = this;
    var f = a.dispatch_fn.call(null, b, c, d, e), g = this.cljs$core$IMultiFn$_get_method$arity$2(null, f);
    cljs.core.truth_(g) || cljs.core.throw_no_method_error.call(null, a.name, f);
    return g.call(null, b, c, d, e);
  }, f = function(a, b, c, d, e, f) {
    a = this;
    var g = a.dispatch_fn.call(null, b, c, d, e, f), h = this.cljs$core$IMultiFn$_get_method$arity$2(null, g);
    cljs.core.truth_(h) || cljs.core.throw_no_method_error.call(null, a.name, g);
    return h.call(null, b, c, d, e, f);
  }, g = function(a, b, c, d, e, f, g) {
    a = this;
    var h = a.dispatch_fn.call(null, b, c, d, e, f, g), k = this.cljs$core$IMultiFn$_get_method$arity$2(null, h);
    cljs.core.truth_(k) || cljs.core.throw_no_method_error.call(null, a.name, h);
    return k.call(null, b, c, d, e, f, g);
  }, h = function(a, b, c, d, e, f, g, h) {
    a = this;
    var k = a.dispatch_fn.call(null, b, c, d, e, f, g, h), l = this.cljs$core$IMultiFn$_get_method$arity$2(null, k);
    cljs.core.truth_(l) || cljs.core.throw_no_method_error.call(null, a.name, k);
    return l.call(null, b, c, d, e, f, g, h);
  }, k = function(a, b, c, d, e, f, g, h, k) {
    a = this;
    var l = a.dispatch_fn.call(null, b, c, d, e, f, g, h, k), m = this.cljs$core$IMultiFn$_get_method$arity$2(null, l);
    cljs.core.truth_(m) || cljs.core.throw_no_method_error.call(null, a.name, l);
    return m.call(null, b, c, d, e, f, g, h, k);
  }, l = function(a, b, c, d, e, f, g, h, k, l) {
    a = this;
    var m = a.dispatch_fn.call(null, b, c, d, e, f, g, h, k, l), n = this.cljs$core$IMultiFn$_get_method$arity$2(null, m);
    cljs.core.truth_(n) || cljs.core.throw_no_method_error.call(null, a.name, m);
    return n.call(null, b, c, d, e, f, g, h, k, l);
  }, m = function(a, b, c, d, e, f, g, h, k, l, m) {
    a = this;
    var n = a.dispatch_fn.call(null, b, c, d, e, f, g, h, k, l, m), p = this.cljs$core$IMultiFn$_get_method$arity$2(null, n);
    cljs.core.truth_(p) || cljs.core.throw_no_method_error.call(null, a.name, n);
    return p.call(null, b, c, d, e, f, g, h, k, l, m);
  }, n = function(a, b, c, d, e, f, g, h, k, l, m, n) {
    a = this;
    var p = a.dispatch_fn.call(null, b, c, d, e, f, g, h, k, l, m, n), q = this.cljs$core$IMultiFn$_get_method$arity$2(null, p);
    cljs.core.truth_(q) || cljs.core.throw_no_method_error.call(null, a.name, p);
    return q.call(null, b, c, d, e, f, g, h, k, l, m, n);
  }, p = function(a, b, c, d, e, f, g, h, k, l, m, n, p) {
    a = this;
    var q = a.dispatch_fn.call(null, b, c, d, e, f, g, h, k, l, m, n, p), r = this.cljs$core$IMultiFn$_get_method$arity$2(null, q);
    cljs.core.truth_(r) || cljs.core.throw_no_method_error.call(null, a.name, q);
    return r.call(null, b, c, d, e, f, g, h, k, l, m, n, p);
  }, q = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q) {
    a = this;
    var r = a.dispatch_fn.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q), s = this.cljs$core$IMultiFn$_get_method$arity$2(null, r);
    cljs.core.truth_(s) || cljs.core.throw_no_method_error.call(null, a.name, r);
    return s.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q);
  }, r = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r) {
    a = this;
    var s = a.dispatch_fn.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r), t = this.cljs$core$IMultiFn$_get_method$arity$2(null, s);
    cljs.core.truth_(t) || cljs.core.throw_no_method_error.call(null, a.name, s);
    return t.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r);
  }, s = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s) {
    a = this;
    var t = a.dispatch_fn.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s), v = this.cljs$core$IMultiFn$_get_method$arity$2(null, t);
    cljs.core.truth_(v) || cljs.core.throw_no_method_error.call(null, a.name, t);
    return v.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s);
  }, t = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t) {
    a = this;
    var v = a.dispatch_fn.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t), u = this.cljs$core$IMultiFn$_get_method$arity$2(null, v);
    cljs.core.truth_(u) || cljs.core.throw_no_method_error.call(null, a.name, v);
    return u.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t);
  }, u = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v) {
    a = this;
    var u = a.dispatch_fn.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v), x = this.cljs$core$IMultiFn$_get_method$arity$2(null, u);
    cljs.core.truth_(x) || cljs.core.throw_no_method_error.call(null, a.name, u);
    return x.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v);
  }, v = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v, u) {
    a = this;
    var x = a.dispatch_fn.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v, u), C = this.cljs$core$IMultiFn$_get_method$arity$2(null, x);
    cljs.core.truth_(C) || cljs.core.throw_no_method_error.call(null, a.name, x);
    return C.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v, u);
  }, x = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v, u, x) {
    a = this;
    var C = a.dispatch_fn.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v, u, x), I = this.cljs$core$IMultiFn$_get_method$arity$2(null, C);
    cljs.core.truth_(I) || cljs.core.throw_no_method_error.call(null, a.name, C);
    return I.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v, u, x);
  }, C = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v, u, x, C) {
    a = this;
    var I = a.dispatch_fn.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v, u, x, C), U = this.cljs$core$IMultiFn$_get_method$arity$2(null, I);
    cljs.core.truth_(U) || cljs.core.throw_no_method_error.call(null, a.name, I);
    return U.call(null, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v, u, x, C);
  }, I = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v, u, x, C, I) {
    a = this;
    var U = cljs.core.apply.call(null, a.dispatch_fn, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v, u, x, C, I), W = this.cljs$core$IMultiFn$_get_method$arity$2(null, U);
    cljs.core.truth_(W) || cljs.core.throw_no_method_error.call(null, a.name, U);
    return cljs.core.apply.call(null, W, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, v, u, x, C, I);
  }, a = function(a, P, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S, T, V) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, P);
      case 3:
        return c.call(this, a, P, w);
      case 4:
        return d.call(this, a, P, w, y);
      case 5:
        return e.call(this, a, P, w, y, z);
      case 6:
        return f.call(this, a, P, w, y, z, A);
      case 7:
        return g.call(this, a, P, w, y, z, A, B);
      case 8:
        return h.call(this, a, P, w, y, z, A, B, D);
      case 9:
        return k.call(this, a, P, w, y, z, A, B, D, E);
      case 10:
        return l.call(this, a, P, w, y, z, A, B, D, E, F);
      case 11:
        return m.call(this, a, P, w, y, z, A, B, D, E, F, G);
      case 12:
        return n.call(this, a, P, w, y, z, A, B, D, E, F, G, H);
      case 13:
        return p.call(this, a, P, w, y, z, A, B, D, E, F, G, H, K);
      case 14:
        return q.call(this, a, P, w, y, z, A, B, D, E, F, G, H, K, L);
      case 15:
        return r.call(this, a, P, w, y, z, A, B, D, E, F, G, H, K, L, M);
      case 16:
        return s.call(this, a, P, w, y, z, A, B, D, E, F, G, H, K, L, M, N);
      case 17:
        return t.call(this, a, P, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O);
      case 18:
        return u.call(this, a, P, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q);
      case 19:
        return v.call(this, a, P, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R);
      case 20:
        return x.call(this, a, P, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S);
      case 21:
        return C.call(this, a, P, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S, T);
      case 22:
        return I.call(this, a, P, w, y, z, A, B, D, E, F, G, H, K, L, M, N, O, Q, R, S, T, V);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$5 = e;
  a.cljs$core$IFn$_invoke$arity$6 = f;
  a.cljs$core$IFn$_invoke$arity$7 = g;
  a.cljs$core$IFn$_invoke$arity$8 = h;
  a.cljs$core$IFn$_invoke$arity$9 = k;
  a.cljs$core$IFn$_invoke$arity$10 = l;
  a.cljs$core$IFn$_invoke$arity$11 = m;
  a.cljs$core$IFn$_invoke$arity$12 = n;
  a.cljs$core$IFn$_invoke$arity$13 = p;
  a.cljs$core$IFn$_invoke$arity$14 = q;
  a.cljs$core$IFn$_invoke$arity$15 = r;
  a.cljs$core$IFn$_invoke$arity$16 = s;
  a.cljs$core$IFn$_invoke$arity$17 = t;
  a.cljs$core$IFn$_invoke$arity$18 = u;
  a.cljs$core$IFn$_invoke$arity$19 = v;
  a.cljs$core$IFn$_invoke$arity$20 = x;
  a.cljs$core$IFn$_invoke$arity$21 = C;
  a.cljs$core$IFn$_invoke$arity$22 = I;
  return a;
}();
cljs.core.MultiFn.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  var b = this.dispatch_fn.call(null, a), c = this.cljs$core$IMultiFn$_get_method$arity$2(null, b);
  cljs.core.truth_(c) || cljs.core.throw_no_method_error.call(null, this.name, b);
  return c.call(null, a);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  var c = this.dispatch_fn.call(null, a, b), d = this.cljs$core$IMultiFn$_get_method$arity$2(null, c);
  cljs.core.truth_(d) || cljs.core.throw_no_method_error.call(null, this.name, c);
  return d.call(null, a, b);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$3 = function(a, b, c) {
  var d = this.dispatch_fn.call(null, a, b, c), e = this.cljs$core$IMultiFn$_get_method$arity$2(null, d);
  cljs.core.truth_(e) || cljs.core.throw_no_method_error.call(null, this.name, d);
  return e.call(null, a, b, c);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$4 = function(a, b, c, d) {
  var e = this.dispatch_fn.call(null, a, b, c, d), f = this.cljs$core$IMultiFn$_get_method$arity$2(null, e);
  cljs.core.truth_(f) || cljs.core.throw_no_method_error.call(null, this.name, e);
  return f.call(null, a, b, c, d);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$5 = function(a, b, c, d, e) {
  var f = this.dispatch_fn.call(null, a, b, c, d, e), g = this.cljs$core$IMultiFn$_get_method$arity$2(null, f);
  cljs.core.truth_(g) || cljs.core.throw_no_method_error.call(null, this.name, f);
  return g.call(null, a, b, c, d, e);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$6 = function(a, b, c, d, e, f) {
  var g = this.dispatch_fn.call(null, a, b, c, d, e, f), h = this.cljs$core$IMultiFn$_get_method$arity$2(null, g);
  cljs.core.truth_(h) || cljs.core.throw_no_method_error.call(null, this.name, g);
  return h.call(null, a, b, c, d, e, f);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$7 = function(a, b, c, d, e, f, g) {
  var h = this.dispatch_fn.call(null, a, b, c, d, e, f, g), k = this.cljs$core$IMultiFn$_get_method$arity$2(null, h);
  cljs.core.truth_(k) || cljs.core.throw_no_method_error.call(null, this.name, h);
  return k.call(null, a, b, c, d, e, f, g);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$8 = function(a, b, c, d, e, f, g, h) {
  var k = this.dispatch_fn.call(null, a, b, c, d, e, f, g, h), l = this.cljs$core$IMultiFn$_get_method$arity$2(null, k);
  cljs.core.truth_(l) || cljs.core.throw_no_method_error.call(null, this.name, k);
  return l.call(null, a, b, c, d, e, f, g, h);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$9 = function(a, b, c, d, e, f, g, h, k) {
  var l = this.dispatch_fn.call(null, a, b, c, d, e, f, g, h, k), m = this.cljs$core$IMultiFn$_get_method$arity$2(null, l);
  cljs.core.truth_(m) || cljs.core.throw_no_method_error.call(null, this.name, l);
  return m.call(null, a, b, c, d, e, f, g, h, k);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$10 = function(a, b, c, d, e, f, g, h, k, l) {
  var m = this.dispatch_fn.call(null, a, b, c, d, e, f, g, h, k, l), n = this.cljs$core$IMultiFn$_get_method$arity$2(null, m);
  cljs.core.truth_(n) || cljs.core.throw_no_method_error.call(null, this.name, m);
  return n.call(null, a, b, c, d, e, f, g, h, k, l);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$11 = function(a, b, c, d, e, f, g, h, k, l, m) {
  var n = this.dispatch_fn.call(null, a, b, c, d, e, f, g, h, k, l, m), p = this.cljs$core$IMultiFn$_get_method$arity$2(null, n);
  cljs.core.truth_(p) || cljs.core.throw_no_method_error.call(null, this.name, n);
  return p.call(null, a, b, c, d, e, f, g, h, k, l, m);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$12 = function(a, b, c, d, e, f, g, h, k, l, m, n) {
  var p = this.dispatch_fn.call(null, a, b, c, d, e, f, g, h, k, l, m, n), q = this.cljs$core$IMultiFn$_get_method$arity$2(null, p);
  cljs.core.truth_(q) || cljs.core.throw_no_method_error.call(null, this.name, p);
  return q.call(null, a, b, c, d, e, f, g, h, k, l, m, n);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$13 = function(a, b, c, d, e, f, g, h, k, l, m, n, p) {
  var q = this.dispatch_fn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p), r = this.cljs$core$IMultiFn$_get_method$arity$2(null, q);
  cljs.core.truth_(r) || cljs.core.throw_no_method_error.call(null, this.name, q);
  return r.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$14 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q) {
  var r = this.dispatch_fn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q), s = this.cljs$core$IMultiFn$_get_method$arity$2(null, r);
  cljs.core.truth_(s) || cljs.core.throw_no_method_error.call(null, this.name, r);
  return s.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$15 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r) {
  var s = this.dispatch_fn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r), t = this.cljs$core$IMultiFn$_get_method$arity$2(null, s);
  cljs.core.truth_(t) || cljs.core.throw_no_method_error.call(null, this.name, s);
  return t.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$16 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s) {
  var t = this.dispatch_fn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s), u = this.cljs$core$IMultiFn$_get_method$arity$2(null, t);
  cljs.core.truth_(u) || cljs.core.throw_no_method_error.call(null, this.name, t);
  return u.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$17 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t) {
  var u = this.dispatch_fn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t), v = this.cljs$core$IMultiFn$_get_method$arity$2(null, u);
  cljs.core.truth_(v) || cljs.core.throw_no_method_error.call(null, this.name, u);
  return v.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$18 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u) {
  var v = this.dispatch_fn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u), x = this.cljs$core$IMultiFn$_get_method$arity$2(null, v);
  cljs.core.truth_(x) || cljs.core.throw_no_method_error.call(null, this.name, v);
  return x.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$19 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v) {
  var x = this.dispatch_fn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v), C = this.cljs$core$IMultiFn$_get_method$arity$2(null, x);
  cljs.core.truth_(C) || cljs.core.throw_no_method_error.call(null, this.name, x);
  return C.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$20 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x) {
  var C = this.dispatch_fn.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x), I = this.cljs$core$IMultiFn$_get_method$arity$2(null, C);
  cljs.core.truth_(I) || cljs.core.throw_no_method_error.call(null, this.name, C);
  return I.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$21 = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x, C) {
  var I = cljs.core.apply.call(null, this.dispatch_fn, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x, C), J = this.cljs$core$IMultiFn$_get_method$arity$2(null, I);
  cljs.core.truth_(J) || cljs.core.throw_no_method_error.call(null, this.name, I);
  return cljs.core.apply.call(null, J, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, t, u, v, x, C);
};
cljs.core.__GT_MultiFn = function(a, b, c, d, e, f, g, h) {
  return new cljs.core.MultiFn(a, b, c, d, e, f, g, h);
};
cljs.core.remove_all_methods = function(a) {
  return cljs.core._reset.call(null, a);
};
cljs.core.remove_method = function(a, b) {
  return cljs.core._remove_method.call(null, a, b);
};
cljs.core.prefer_method = function(a, b, c) {
  return cljs.core._prefer_method.call(null, a, b, c);
};
cljs.core.methods$ = function(a) {
  return cljs.core._methods.call(null, a);
};
cljs.core.get_method = function(a, b) {
  return cljs.core._get_method.call(null, a, b);
};
cljs.core.prefers = function(a) {
  return cljs.core._prefers.call(null, a);
};
cljs.core.UUID = function(a) {
  this.uuid = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2153775104;
};
cljs.core.UUID.cljs$lang$type = !0;
cljs.core.UUID.cljs$lang$ctorStr = "cljs.core/UUID";
cljs.core.UUID.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/UUID");
};
cljs.core.UUID.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.string.hashCode(cljs.core.pr_str.call(null, this));
};
cljs.core.UUID.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write.call(null, b, '#uuid "' + cljs.core.str.cljs$core$IFn$_invoke$arity$1(this.uuid) + '"');
};
cljs.core.UUID.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return b instanceof cljs.core.UUID && this.uuid === b.uuid;
};
cljs.core.UUID.prototype.toString = function() {
  return this.uuid;
};
cljs.core.UUID.prototype.equiv = function(a) {
  return this.cljs$core$IEquiv$_equiv$arity$2(null, a);
};
cljs.core.__GT_UUID = function(a) {
  return new cljs.core.UUID(a);
};
cljs.core.ExceptionInfo = function(a, b, c) {
  this.message = a;
  this.data = b;
  this.cause = c;
};
cljs.core.ExceptionInfo.cljs$lang$type = !0;
cljs.core.ExceptionInfo.cljs$lang$ctorStr = "cljs.core/ExceptionInfo";
cljs.core.ExceptionInfo.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ExceptionInfo");
};
cljs.core.__GT_ExceptionInfo = function(a, b, c) {
  return new cljs.core.ExceptionInfo(a, b, c);
};
cljs.core.ExceptionInfo.prototype = Error();
cljs.core.ExceptionInfo.prototype.constructor = cljs.core.ExceptionInfo;
cljs.core.ex_info = function() {
  var a = null, b = function(a, b) {
    return new cljs.core.ExceptionInfo(a, b, null);
  }, c = function(a, b, c) {
    return new cljs.core.ExceptionInfo(a, b, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.ex_data = function(a) {
  return a instanceof cljs.core.ExceptionInfo ? a.data : null;
};
cljs.core.ex_message = function(a) {
  return a instanceof Error ? a.message : null;
};
cljs.core.ex_cause = function(a) {
  return a instanceof cljs.core.ExceptionInfo ? a.cause : null;
};
cljs.core.comparator = function(a) {
  return function(b, c) {
    return cljs.core.truth_(a.call(null, b, c)) ? -1 : cljs.core.truth_(a.call(null, c, b)) ? 1 : 0;
  };
};
cljs.core.special_symbol_QMARK_ = function(a) {
  return cljs.core.contains_QMARK_.call(null, new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 19, [new cljs.core.Symbol(null, "\x26", "\x26", -2144855648, null), null, new cljs.core.Symbol(null, "defrecord*", "defrecord*", -1936366207, null), null, new cljs.core.Symbol(null, "try", "try", -1273693247, null), null, new cljs.core.Symbol(null, "loop*", "loop*", 615029416, null), null, new cljs.core.Symbol(null, "do", "do", 1686842252, null), null, new cljs.core.Symbol(null, 
  "letfn*", "letfn*", -110097810, null), null, new cljs.core.Symbol(null, "if", "if", 1181717262, null), null, new cljs.core.Symbol(null, "new", "new", -444906321, null), null, new cljs.core.Symbol(null, "ns", "ns", 2082130287, null), null, new cljs.core.Symbol(null, "deftype*", "deftype*", 962659890, null), null, new cljs.core.Symbol(null, "let*", "let*", 1920721458, null), null, new cljs.core.Symbol(null, "js*", "js*", -1134233646, null), null, new cljs.core.Symbol(null, "fn*", "fn*", -752876845, 
  null), null, new cljs.core.Symbol(null, "recur", "recur", 1202958259, null), null, new cljs.core.Symbol(null, "set!", "set!", 250714521, null), null, new cljs.core.Symbol(null, ".", ".", 1975675962, null), null, new cljs.core.Symbol(null, "quote", "quote", 1377916282, null), null, new cljs.core.Symbol(null, "throw", "throw", 595905694, null), null, new cljs.core.Symbol(null, "def", "def", 597100991, null), null], null), null), a);
};
var om = {dom:{}};
om.dom.a = function() {
  var a = function(a, b) {
    return React.DOM.a.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.abbr = function() {
  var a = function(a, b) {
    return React.DOM.abbr.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.address = function() {
  var a = function(a, b) {
    return React.DOM.address.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.area = function() {
  var a = function(a, b) {
    return React.DOM.area.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.article = function() {
  var a = function(a, b) {
    return React.DOM.article.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.aside = function() {
  var a = function(a, b) {
    return React.DOM.aside.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.audio = function() {
  var a = function(a, b) {
    return React.DOM.audio.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.b = function() {
  var a = function(a, b) {
    return React.DOM.b.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.base = function() {
  var a = function(a, b) {
    return React.DOM.base.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.bdi = function() {
  var a = function(a, b) {
    return React.DOM.bdi.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.bdo = function() {
  var a = function(a, b) {
    return React.DOM.bdo.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.big = function() {
  var a = function(a, b) {
    return React.DOM.big.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.blockquote = function() {
  var a = function(a, b) {
    return React.DOM.blockquote.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.body = function() {
  var a = function(a, b) {
    return React.DOM.body.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.br = function() {
  var a = function(a, b) {
    return React.DOM.br.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.button = function() {
  var a = function(a, b) {
    return React.DOM.button.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.canvas = function() {
  var a = function(a, b) {
    return React.DOM.canvas.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.caption = function() {
  var a = function(a, b) {
    return React.DOM.caption.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.cite = function() {
  var a = function(a, b) {
    return React.DOM.cite.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.code = function() {
  var a = function(a, b) {
    return React.DOM.code.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.col = function() {
  var a = function(a, b) {
    return React.DOM.col.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.colgroup = function() {
  var a = function(a, b) {
    return React.DOM.colgroup.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.data = function() {
  var a = function(a, b) {
    return React.DOM.data.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.datalist = function() {
  var a = function(a, b) {
    return React.DOM.datalist.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.dd = function() {
  var a = function(a, b) {
    return React.DOM.dd.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.del = function() {
  var a = function(a, b) {
    return React.DOM.del.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.dfn = function() {
  var a = function(a, b) {
    return React.DOM.dfn.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.div = function() {
  var a = function(a, b) {
    return React.DOM.div.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.dl = function() {
  var a = function(a, b) {
    return React.DOM.dl.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.dt = function() {
  var a = function(a, b) {
    return React.DOM.dt.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.em = function() {
  var a = function(a, b) {
    return React.DOM.em.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.embed = function() {
  var a = function(a, b) {
    return React.DOM.embed.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.fieldset = function() {
  var a = function(a, b) {
    return React.DOM.fieldset.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.figcaption = function() {
  var a = function(a, b) {
    return React.DOM.figcaption.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.figure = function() {
  var a = function(a, b) {
    return React.DOM.figure.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.footer = function() {
  var a = function(a, b) {
    return React.DOM.footer.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.form = function() {
  var a = function(a, b) {
    return React.DOM.form.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.h1 = function() {
  var a = function(a, b) {
    return React.DOM.h1.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.h2 = function() {
  var a = function(a, b) {
    return React.DOM.h2.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.h3 = function() {
  var a = function(a, b) {
    return React.DOM.h3.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.h4 = function() {
  var a = function(a, b) {
    return React.DOM.h4.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.h5 = function() {
  var a = function(a, b) {
    return React.DOM.h5.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.h6 = function() {
  var a = function(a, b) {
    return React.DOM.h6.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.head = function() {
  var a = function(a, b) {
    return React.DOM.head.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.header = function() {
  var a = function(a, b) {
    return React.DOM.header.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.hr = function() {
  var a = function(a, b) {
    return React.DOM.hr.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.html = function() {
  var a = function(a, b) {
    return React.DOM.html.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.i = function() {
  var a = function(a, b) {
    return React.DOM.i.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.iframe = function() {
  var a = function(a, b) {
    return React.DOM.iframe.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.img = function() {
  var a = function(a, b) {
    return React.DOM.img.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.ins = function() {
  var a = function(a, b) {
    return React.DOM.ins.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.kbd = function() {
  var a = function(a, b) {
    return React.DOM.kbd.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.keygen = function() {
  var a = function(a, b) {
    return React.DOM.keygen.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.label = function() {
  var a = function(a, b) {
    return React.DOM.label.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.legend = function() {
  var a = function(a, b) {
    return React.DOM.legend.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.li = function() {
  var a = function(a, b) {
    return React.DOM.li.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.link = function() {
  var a = function(a, b) {
    return React.DOM.link.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.main = function() {
  var a = function(a, b) {
    return React.DOM.main.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.map = function() {
  var a = function(a, b) {
    return React.DOM.map.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.mark = function() {
  var a = function(a, b) {
    return React.DOM.mark.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.menu = function() {
  var a = function(a, b) {
    return React.DOM.menu.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.menuitem = function() {
  var a = function(a, b) {
    return React.DOM.menuitem.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.meta = function() {
  var a = function(a, b) {
    return React.DOM.meta.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.meter = function() {
  var a = function(a, b) {
    return React.DOM.meter.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.nav = function() {
  var a = function(a, b) {
    return React.DOM.nav.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.noscript = function() {
  var a = function(a, b) {
    return React.DOM.noscript.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.object = function() {
  var a = function(a, b) {
    return React.DOM.object.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.ol = function() {
  var a = function(a, b) {
    return React.DOM.ol.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.optgroup = function() {
  var a = function(a, b) {
    return React.DOM.optgroup.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.output = function() {
  var a = function(a, b) {
    return React.DOM.output.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.p = function() {
  var a = function(a, b) {
    return React.DOM.p.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.param = function() {
  var a = function(a, b) {
    return React.DOM.param.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.pre = function() {
  var a = function(a, b) {
    return React.DOM.pre.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.progress = function() {
  var a = function(a, b) {
    return React.DOM.progress.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.q = function() {
  var a = function(a, b) {
    return React.DOM.q.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.rp = function() {
  var a = function(a, b) {
    return React.DOM.rp.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.rt = function() {
  var a = function(a, b) {
    return React.DOM.rt.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.ruby = function() {
  var a = function(a, b) {
    return React.DOM.ruby.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.s = function() {
  var a = function(a, b) {
    return React.DOM.s.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.samp = function() {
  var a = function(a, b) {
    return React.DOM.samp.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.script = function() {
  var a = function(a, b) {
    return React.DOM.script.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.section = function() {
  var a = function(a, b) {
    return React.DOM.section.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.select = function() {
  var a = function(a, b) {
    return React.DOM.select.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.small = function() {
  var a = function(a, b) {
    return React.DOM.small.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.source = function() {
  var a = function(a, b) {
    return React.DOM.source.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.span = function() {
  var a = function(a, b) {
    return React.DOM.span.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.strong = function() {
  var a = function(a, b) {
    return React.DOM.strong.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.style = function() {
  var a = function(a, b) {
    return React.DOM.style.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.sub = function() {
  var a = function(a, b) {
    return React.DOM.sub.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.summary = function() {
  var a = function(a, b) {
    return React.DOM.summary.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.sup = function() {
  var a = function(a, b) {
    return React.DOM.sup.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.table = function() {
  var a = function(a, b) {
    return React.DOM.table.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.tbody = function() {
  var a = function(a, b) {
    return React.DOM.tbody.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.td = function() {
  var a = function(a, b) {
    return React.DOM.td.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.tfoot = function() {
  var a = function(a, b) {
    return React.DOM.tfoot.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.th = function() {
  var a = function(a, b) {
    return React.DOM.th.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.thead = function() {
  var a = function(a, b) {
    return React.DOM.thead.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.time = function() {
  var a = function(a, b) {
    return React.DOM.time.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.title = function() {
  var a = function(a, b) {
    return React.DOM.title.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.tr = function() {
  var a = function(a, b) {
    return React.DOM.tr.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.track = function() {
  var a = function(a, b) {
    return React.DOM.track.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.u = function() {
  var a = function(a, b) {
    return React.DOM.u.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.ul = function() {
  var a = function(a, b) {
    return React.DOM.ul.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.var$ = function() {
  var a = function(a, b) {
    return React.DOM.var$.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.video = function() {
  var a = function(a, b) {
    return React.DOM.video.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.wbr = function() {
  var a = function(a, b) {
    return React.DOM.wbr.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.circle = function() {
  var a = function(a, b) {
    return React.DOM.circle.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.ellipse = function() {
  var a = function(a, b) {
    return React.DOM.ellipse.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.g = function() {
  var a = function(a, b) {
    return React.DOM.g.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.line = function() {
  var a = function(a, b) {
    return React.DOM.line.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.path = function() {
  var a = function(a, b) {
    return React.DOM.path.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.polyline = function() {
  var a = function(a, b) {
    return React.DOM.polyline.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.rect = function() {
  var a = function(a, b) {
    return React.DOM.rect.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.svg = function() {
  var a = function(a, b) {
    return React.DOM.svg.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.text = function() {
  var a = function(a, b) {
    return React.DOM.text.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.defs = function() {
  var a = function(a, b) {
    return React.DOM.defs.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.linearGradient = function() {
  var a = function(a, b) {
    return React.DOM.linearGradient.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.polygon = function() {
  var a = function(a, b) {
    return React.DOM.polygon.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.radialGradient = function() {
  var a = function(a, b) {
    return React.DOM.radialGradient.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.stop = function() {
  var a = function(a, b) {
    return React.DOM.stop.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.tspan = function() {
  var a = function(a, b) {
    return React.DOM.tspan.apply(null, cljs.core.into_array.call(null, cljs.core.cons.call(null, a, b)));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
om.dom.wrap_form_element = function(a, b) {
  return React.createClass({render:function() {
    return this.transferPropsTo(a.call(null, {children:this.props.children, onChange:this.onChange, value:this.state.value}));
  }, componentWillReceiveProps:function(a) {
    return this.setState({value:a.value});
  }, onChange:function(a) {
    var b = this.props.onChange;
    if (null == b) {
      return null;
    }
    b.call(null, a);
    return this.setState({value:a.target.value});
  }, getInitialState:function() {
    return{value:this.props.value};
  }, getDisplayName:function() {
    return b;
  }});
};
om.dom.input = om.dom.wrap_form_element.call(null, React.DOM.input, "input");
om.dom.textarea = om.dom.wrap_form_element.call(null, React.DOM.textarea, "textarea");
om.dom.option = om.dom.wrap_form_element.call(null, React.DOM.option, "option");
om.dom.render = function(a, b) {
  return React.renderComponent(a, b);
};
om.dom.render_to_str = function(a) {
  return React.renderComponentToString(a);
};
goog.ui = {};
goog.ui.IdGenerator = function() {
};
goog.addSingletonGetter(goog.ui.IdGenerator);
goog.ui.IdGenerator.prototype.nextId_ = 0;
goog.ui.IdGenerator.prototype.getNextUniqueId = function() {
  return ":" + (this.nextId_++).toString(36);
};
om.core = {};
om.core._STAR_read_enabled_STAR_ = !1;
om.core._STAR_parent_STAR_ = null;
om.core._STAR_instrument_STAR_ = null;
om.core._STAR_state_STAR_ = null;
om.core.IDisplayName = function() {
  return{};
}();
om.core.display_name = function(a) {
  if (a ? a.om$core$IDisplayName$display_name$arity$1 : a) {
    return a.om$core$IDisplayName$display_name$arity$1(a);
  }
  var b;
  b = om.core.display_name[goog.typeOf(null == a ? null : a)];
  if (!b && (b = om.core.display_name._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IDisplayName.display-name", a);
  }
  return b.call(null, a);
};
om.core.IInitState = function() {
  return{};
}();
om.core.init_state = function(a) {
  if (a ? a.om$core$IInitState$init_state$arity$1 : a) {
    return a.om$core$IInitState$init_state$arity$1(a);
  }
  var b;
  b = om.core.init_state[goog.typeOf(null == a ? null : a)];
  if (!b && (b = om.core.init_state._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IInitState.init-state", a);
  }
  return b.call(null, a);
};
om.core.IShouldUpdate = function() {
  return{};
}();
om.core.should_update = function(a, b, c) {
  if (a ? a.om$core$IShouldUpdate$should_update$arity$3 : a) {
    return a.om$core$IShouldUpdate$should_update$arity$3(a, b, c);
  }
  var d;
  d = om.core.should_update[goog.typeOf(null == a ? null : a)];
  if (!d && (d = om.core.should_update._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IShouldUpdate.should-update", a);
  }
  return d.call(null, a, b, c);
};
om.core.IWillMount = function() {
  return{};
}();
om.core.will_mount = function(a) {
  if (a ? a.om$core$IWillMount$will_mount$arity$1 : a) {
    return a.om$core$IWillMount$will_mount$arity$1(a);
  }
  var b;
  b = om.core.will_mount[goog.typeOf(null == a ? null : a)];
  if (!b && (b = om.core.will_mount._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IWillMount.will-mount", a);
  }
  return b.call(null, a);
};
om.core.IDidMount = function() {
  return{};
}();
om.core.did_mount = function(a) {
  if (a ? a.om$core$IDidMount$did_mount$arity$1 : a) {
    return a.om$core$IDidMount$did_mount$arity$1(a);
  }
  var b;
  b = om.core.did_mount[goog.typeOf(null == a ? null : a)];
  if (!b && (b = om.core.did_mount._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IDidMount.did-mount", a);
  }
  return b.call(null, a);
};
om.core.IWillUnmount = function() {
  return{};
}();
om.core.will_unmount = function(a) {
  if (a ? a.om$core$IWillUnmount$will_unmount$arity$1 : a) {
    return a.om$core$IWillUnmount$will_unmount$arity$1(a);
  }
  var b;
  b = om.core.will_unmount[goog.typeOf(null == a ? null : a)];
  if (!b && (b = om.core.will_unmount._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IWillUnmount.will-unmount", a);
  }
  return b.call(null, a);
};
om.core.IWillUpdate = function() {
  return{};
}();
om.core.will_update = function(a, b, c) {
  if (a ? a.om$core$IWillUpdate$will_update$arity$3 : a) {
    return a.om$core$IWillUpdate$will_update$arity$3(a, b, c);
  }
  var d;
  d = om.core.will_update[goog.typeOf(null == a ? null : a)];
  if (!d && (d = om.core.will_update._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IWillUpdate.will-update", a);
  }
  return d.call(null, a, b, c);
};
om.core.IDidUpdate = function() {
  return{};
}();
om.core.did_update = function(a, b, c) {
  if (a ? a.om$core$IDidUpdate$did_update$arity$3 : a) {
    return a.om$core$IDidUpdate$did_update$arity$3(a, b, c);
  }
  var d;
  d = om.core.did_update[goog.typeOf(null == a ? null : a)];
  if (!d && (d = om.core.did_update._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IDidUpdate.did-update", a);
  }
  return d.call(null, a, b, c);
};
om.core.IWillReceiveProps = function() {
  return{};
}();
om.core.will_receive_props = function(a, b) {
  if (a ? a.om$core$IWillReceiveProps$will_receive_props$arity$2 : a) {
    return a.om$core$IWillReceiveProps$will_receive_props$arity$2(a, b);
  }
  var c;
  c = om.core.will_receive_props[goog.typeOf(null == a ? null : a)];
  if (!c && (c = om.core.will_receive_props._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IWillReceiveProps.will-receive-props", a);
  }
  return c.call(null, a, b);
};
om.core.IRender = function() {
  return{};
}();
om.core.render = function(a) {
  if (a ? a.om$core$IRender$render$arity$1 : a) {
    return a.om$core$IRender$render$arity$1(a);
  }
  var b;
  b = om.core.render[goog.typeOf(null == a ? null : a)];
  if (!b && (b = om.core.render._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IRender.render", a);
  }
  return b.call(null, a);
};
om.core.IRenderState = function() {
  return{};
}();
om.core.render_state = function(a, b) {
  if (a ? a.om$core$IRenderState$render_state$arity$2 : a) {
    return a.om$core$IRenderState$render_state$arity$2(a, b);
  }
  var c;
  c = om.core.render_state[goog.typeOf(null == a ? null : a)];
  if (!c && (c = om.core.render_state._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IRenderState.render-state", a);
  }
  return c.call(null, a, b);
};
om.core.IOmSwap = function() {
  return{};
}();
om.core._om_swap_BANG_ = function(a, b, c, d, e) {
  if (a ? a.om$core$IOmSwap$_om_swap_BANG_$arity$5 : a) {
    return a.om$core$IOmSwap$_om_swap_BANG_$arity$5(a, b, c, d, e);
  }
  var f;
  f = om.core._om_swap_BANG_[goog.typeOf(null == a ? null : a)];
  if (!f && (f = om.core._om_swap_BANG_._, !f)) {
    throw cljs.core.missing_protocol.call(null, "IOmSwap.-om-swap!", a);
  }
  return f.call(null, a, b, c, d, e);
};
om.core.IGetState = function() {
  return{};
}();
om.core._get_state = function() {
  var a = null, b = function(a) {
    if (a ? a.om$core$IGetState$_get_state$arity$1 : a) {
      return a.om$core$IGetState$_get_state$arity$1(a);
    }
    var b;
    b = om.core._get_state[goog.typeOf(null == a ? null : a)];
    if (!b && (b = om.core._get_state._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IGetState.-get-state", a);
    }
    return b.call(null, a);
  }, c = function(a, b) {
    if (a ? a.om$core$IGetState$_get_state$arity$2 : a) {
      return a.om$core$IGetState$_get_state$arity$2(a, b);
    }
    var c;
    c = om.core._get_state[goog.typeOf(null == a ? null : a)];
    if (!c && (c = om.core._get_state._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IGetState.-get-state", a);
    }
    return c.call(null, a, b);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
om.core.IGetRenderState = function() {
  return{};
}();
om.core._get_render_state = function() {
  var a = null, b = function(a) {
    if (a ? a.om$core$IGetRenderState$_get_render_state$arity$1 : a) {
      return a.om$core$IGetRenderState$_get_render_state$arity$1(a);
    }
    var b;
    b = om.core._get_render_state[goog.typeOf(null == a ? null : a)];
    if (!b && (b = om.core._get_render_state._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IGetRenderState.-get-render-state", a);
    }
    return b.call(null, a);
  }, c = function(a, b) {
    if (a ? a.om$core$IGetRenderState$_get_render_state$arity$2 : a) {
      return a.om$core$IGetRenderState$_get_render_state$arity$2(a, b);
    }
    var c;
    c = om.core._get_render_state[goog.typeOf(null == a ? null : a)];
    if (!c && (c = om.core._get_render_state._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IGetRenderState.-get-render-state", a);
    }
    return c.call(null, a, b);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
om.core.ISetState = function() {
  return{};
}();
om.core._set_state_BANG_ = function() {
  var a = null, b = function(a, b, c) {
    if (a ? a.om$core$ISetState$_set_state_BANG_$arity$3 : a) {
      return a.om$core$ISetState$_set_state_BANG_$arity$3(a, b, c);
    }
    var g;
    g = om.core._set_state_BANG_[goog.typeOf(null == a ? null : a)];
    if (!g && (g = om.core._set_state_BANG_._, !g)) {
      throw cljs.core.missing_protocol.call(null, "ISetState.-set-state!", a);
    }
    return g.call(null, a, b, c);
  }, c = function(a, b, c, g) {
    if (a ? a.om$core$ISetState$_set_state_BANG_$arity$4 : a) {
      return a.om$core$ISetState$_set_state_BANG_$arity$4(a, b, c, g);
    }
    var h;
    h = om.core._set_state_BANG_[goog.typeOf(null == a ? null : a)];
    if (!h && (h = om.core._set_state_BANG_._, !h)) {
      throw cljs.core.missing_protocol.call(null, "ISetState.-set-state!", a);
    }
    return h.call(null, a, b, c, g);
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 4:
        return c.call(this, a, e, f, g);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a;
}();
om.core.IRenderQueue = function() {
  return{};
}();
om.core._get_queue = function(a) {
  if (a ? a.om$core$IRenderQueue$_get_queue$arity$1 : a) {
    return a.om$core$IRenderQueue$_get_queue$arity$1(a);
  }
  var b;
  b = om.core._get_queue[goog.typeOf(null == a ? null : a)];
  if (!b && (b = om.core._get_queue._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IRenderQueue.-get-queue", a);
  }
  return b.call(null, a);
};
om.core._queue_render_BANG_ = function(a, b) {
  if (a ? a.om$core$IRenderQueue$_queue_render_BANG_$arity$2 : a) {
    return a.om$core$IRenderQueue$_queue_render_BANG_$arity$2(a, b);
  }
  var c;
  c = om.core._queue_render_BANG_[goog.typeOf(null == a ? null : a)];
  if (!c && (c = om.core._queue_render_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IRenderQueue.-queue-render!", a);
  }
  return c.call(null, a, b);
};
om.core._empty_queue_BANG_ = function(a) {
  if (a ? a.om$core$IRenderQueue$_empty_queue_BANG_$arity$1 : a) {
    return a.om$core$IRenderQueue$_empty_queue_BANG_$arity$1(a);
  }
  var b;
  b = om.core._empty_queue_BANG_[goog.typeOf(null == a ? null : a)];
  if (!b && (b = om.core._empty_queue_BANG_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IRenderQueue.-empty-queue!", a);
  }
  return b.call(null, a);
};
om.core.IValue = function() {
  return{};
}();
om.core._value = function(a) {
  if (a ? a.om$core$IValue$_value$arity$1 : a) {
    return a.om$core$IValue$_value$arity$1(a);
  }
  var b;
  b = om.core._value[goog.typeOf(null == a ? null : a)];
  if (!b && (b = om.core._value._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IValue.-value", a);
  }
  return b.call(null, a);
};
om.core.IValue._ = !0;
om.core._value._ = function(a) {
  return a;
};
om.core.ICursor = function() {
  return{};
}();
om.core._path = function(a) {
  if (a ? a.om$core$ICursor$_path$arity$1 : a) {
    return a.om$core$ICursor$_path$arity$1(a);
  }
  var b;
  b = om.core._path[goog.typeOf(null == a ? null : a)];
  if (!b && (b = om.core._path._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ICursor.-path", a);
  }
  return b.call(null, a);
};
om.core._state = function(a) {
  if (a ? a.om$core$ICursor$_state$arity$1 : a) {
    return a.om$core$ICursor$_state$arity$1(a);
  }
  var b;
  b = om.core._state[goog.typeOf(null == a ? null : a)];
  if (!b && (b = om.core._state._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ICursor.-state", a);
  }
  return b.call(null, a);
};
om.core.IToCursor = function() {
  return{};
}();
om.core._to_cursor = function() {
  var a = null, b = function(a, b) {
    if (a ? a.om$core$IToCursor$_to_cursor$arity$2 : a) {
      return a.om$core$IToCursor$_to_cursor$arity$2(a, b);
    }
    var c;
    c = om.core._to_cursor[goog.typeOf(null == a ? null : a)];
    if (!c && (c = om.core._to_cursor._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IToCursor.-to-cursor", a);
    }
    return c.call(null, a, b);
  }, c = function(a, b, c) {
    if (a ? a.om$core$IToCursor$_to_cursor$arity$3 : a) {
      return a.om$core$IToCursor$_to_cursor$arity$3(a, b, c);
    }
    var g;
    g = om.core._to_cursor[goog.typeOf(null == a ? null : a)];
    if (!g && (g = om.core._to_cursor._, !g)) {
      throw cljs.core.missing_protocol.call(null, "IToCursor.-to-cursor", a);
    }
    return g.call(null, a, b, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
om.core.ICursorDerive = function() {
  return{};
}();
om.core._derive = function(a, b, c, d) {
  if (a ? a.om$core$ICursorDerive$_derive$arity$4 : a) {
    return a.om$core$ICursorDerive$_derive$arity$4(a, b, c, d);
  }
  var e;
  e = om.core._derive[goog.typeOf(null == a ? null : a)];
  if (!e && (e = om.core._derive._, !e)) {
    throw cljs.core.missing_protocol.call(null, "ICursorDerive.-derive", a);
  }
  return e.call(null, a, b, c, d);
};
om.core.ICursorDerive._ = !0;
om.core._derive._ = function(a, b, c, d) {
  return om.core.to_cursor.call(null, b, c, d);
};
om.core.path = function(a) {
  return om.core._path.call(null, a);
};
om.core.value = function(a) {
  return om.core._value.call(null, a);
};
om.core.state = function(a) {
  return om.core._state.call(null, a);
};
om.core.ITransact = function() {
  return{};
}();
om.core._transact_BANG_ = function(a, b, c, d) {
  if (a ? a.om$core$ITransact$_transact_BANG_$arity$4 : a) {
    return a.om$core$ITransact$_transact_BANG_$arity$4(a, b, c, d);
  }
  var e;
  e = om.core._transact_BANG_[goog.typeOf(null == a ? null : a)];
  if (!e && (e = om.core._transact_BANG_._, !e)) {
    throw cljs.core.missing_protocol.call(null, "ITransact.-transact!", a);
  }
  return e.call(null, a, b, c, d);
};
om.core.INotify = function() {
  return{};
}();
om.core._listen_BANG_ = function(a, b, c) {
  if (a ? a.om$core$INotify$_listen_BANG_$arity$3 : a) {
    return a.om$core$INotify$_listen_BANG_$arity$3(a, b, c);
  }
  var d;
  d = om.core._listen_BANG_[goog.typeOf(null == a ? null : a)];
  if (!d && (d = om.core._listen_BANG_._, !d)) {
    throw cljs.core.missing_protocol.call(null, "INotify.-listen!", a);
  }
  return d.call(null, a, b, c);
};
om.core._unlisten_BANG_ = function(a, b) {
  if (a ? a.om$core$INotify$_unlisten_BANG_$arity$2 : a) {
    return a.om$core$INotify$_unlisten_BANG_$arity$2(a, b);
  }
  var c;
  c = om.core._unlisten_BANG_[goog.typeOf(null == a ? null : a)];
  if (!c && (c = om.core._unlisten_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "INotify.-unlisten!", a);
  }
  return c.call(null, a, b);
};
om.core._notify_BANG_ = function(a, b, c) {
  if (a ? a.om$core$INotify$_notify_BANG_$arity$3 : a) {
    return a.om$core$INotify$_notify_BANG_$arity$3(a, b, c);
  }
  var d;
  d = om.core._notify_BANG_[goog.typeOf(null == a ? null : a)];
  if (!d && (d = om.core._notify_BANG_._, !d)) {
    throw cljs.core.missing_protocol.call(null, "INotify.-notify!", a);
  }
  return d.call(null, a, b, c);
};
om.core.transact_STAR_ = function(a, b, c, d, e) {
  var f = cljs.core.deref.call(null, a), g = cljs.core.into.call(null, om.core.path.call(null, b), c);
  c = (a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.om$core$IOmSwap$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IOmSwap, a)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IOmSwap, a)) ? om.core._om_swap_BANG_.call(null, a, b, c, d, e) : cljs.core.empty_QMARK_.call(null, g) ? cljs.core.swap_BANG_.call(null, a, d) : cljs.core.swap_BANG_.call(null, a, cljs.core.update_in, g, d);
  if (cljs.core._EQ_.call(null, c, new cljs.core.Keyword("om.core", "defer", "om.core/defer", -1038866178))) {
    return null;
  }
  a = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null, "path", "path", -188191168), g, new cljs.core.Keyword(null, "old-value", "old-value", 862546795), cljs.core.get_in.call(null, f, g), new cljs.core.Keyword(null, "new-value", "new-value", 1087038368), cljs.core.get_in.call(null, cljs.core.deref.call(null, a), g), new cljs.core.Keyword(null, "old-state", "old-state", 1039580704), f, new cljs.core.Keyword(null, "new-state", "new-state", -490349212), cljs.core.deref.call(null, 
  a)], null);
  return null != e ? om.core.notify_STAR_.call(null, b, cljs.core.assoc.call(null, a, new cljs.core.Keyword(null, "tag", "tag", -1290361223), e)) : om.core.notify_STAR_.call(null, b, a);
};
om.core.cursor_QMARK_ = function(a) {
  return a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.om$core$ICursor$) ? !0 : a.cljs$lang$protocol_mask$partition$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, om.core.ICursor, a) : cljs.core.native_satisfies_QMARK_.call(null, om.core.ICursor, a);
};
om.core.children = function(a) {
  var b = a.props.children;
  if (cljs.core.fn_QMARK_.call(null, b)) {
    var c = a.props, d;
    a: {
      var e = om.core._STAR_read_enabled_STAR_;
      try {
        om.core._STAR_read_enabled_STAR_ = !0;
        d = b.call(null, a);
        break a;
      } finally {
        om.core._STAR_read_enabled_STAR_ = e;
      }
      d = void 0;
    }
    return c.children = d;
  }
  return b;
};
om.core.get_props = function(a) {
  return a.props.__om_cursor;
};
om.core.get_state = function() {
  var a = null, b = function(a) {
    return om.core._get_state.call(null, a);
  }, c = function(a, b) {
    var c = cljs.core.sequential_QMARK_.call(null, b) ? b : new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [b], null);
    return om.core._get_state.call(null, a, c);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
om.core.get_shared = function() {
  var a = null, b = function(a) {
    return null == a ? null : a.props.__om_shared;
  }, c = function(b, c) {
    return cljs.core.sequential_QMARK_.call(null, c) ? cljs.core.empty_QMARK_.call(null, c) ? a.call(null, b) : cljs.core.get_in.call(null, a.call(null, b), c) : cljs.core.get.call(null, a.call(null, b), c);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
om.core.merge_pending_state = function(a) {
  a = a.state;
  var b = a.__om_pending_state;
  return cljs.core.truth_(b) ? (a.__om_prev_state = a.__om_state, a.__om_state = b, a.__om_pending_state = null, a) : null;
};
om.core.merge_props_state = function() {
  var a = null, b = function(b) {
    return a.call(null, b, null);
  }, c = function(a, b) {
    var c = cljs.core.truth_(b) ? b : a.props, g = c.__om_state;
    if (cljs.core.truth_(g)) {
      var h = a.state;
      h.__om_pending_state = cljs.core.merge.call(null, function() {
        var a = h.__om_pending_state;
        return cljs.core.truth_(a) ? a : h.__om_state;
      }(), g);
      return c.__om_state = null;
    }
    return null;
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
om.core.pure_methods = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null, "componentDidUpdate", "componentDidUpdate", -1983477981), new cljs.core.Keyword(null, "componentWillUnmount", "componentWillUnmount", 1573788814), new cljs.core.Keyword(null, "componentWillReceiveProps", "componentWillReceiveProps", 559988974), new cljs.core.Keyword(null, "shouldComponentUpdate", "shouldComponentUpdate", 1795750960), new cljs.core.Keyword(null, "render", "render", -1408033454), new cljs.core.Keyword(null, 
"componentWillUpdate", "componentWillUpdate", 657390932), new cljs.core.Keyword(null, "getInitialState", "getInitialState", 1541760916), new cljs.core.Keyword(null, "componentDidMount", "componentDidMount", 955710936), new cljs.core.Keyword(null, "getDisplayName", "getDisplayName", 1324429466), new cljs.core.Keyword(null, "componentWillMount", "componentWillMount", -285327619)], [function(a, b) {
  var c = om.core.children.call(null, this);
  if (c ? cljs.core.truth_(cljs.core.truth_(null) ? null : c.om$core$IDidUpdate$) || (c.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IDidUpdate, c)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IDidUpdate, c)) {
    var d = this.state, e = om.core._STAR_read_enabled_STAR_;
    try {
      om.core._STAR_read_enabled_STAR_ = !0, om.core.did_update.call(null, c, om.core.get_props.call(null, {props:a}), function() {
        var a = d.__om_prev_state;
        return cljs.core.truth_(a) ? a : d.__om_state;
      }());
    } finally {
      om.core._STAR_read_enabled_STAR_ = e;
    }
  }
  return this.state.__om_prev_state = null;
}, function() {
  var a = om.core.children.call(null, this);
  if (a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.om$core$IWillUnmount$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IWillUnmount, a)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IWillUnmount, a)) {
    var b = om.core._STAR_read_enabled_STAR_;
    try {
      return om.core._STAR_read_enabled_STAR_ = !0, om.core.will_unmount.call(null, a);
    } finally {
      om.core._STAR_read_enabled_STAR_ = b;
    }
  } else {
    return null;
  }
}, function(a) {
  var b = om.core.children.call(null, this);
  if (b ? cljs.core.truth_(cljs.core.truth_(null) ? null : b.om$core$IWillReceiveProps$) || (b.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IWillReceiveProps, b)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IWillReceiveProps, b)) {
    var c = om.core._STAR_read_enabled_STAR_;
    try {
      return om.core._STAR_read_enabled_STAR_ = !0, om.core.will_receive_props.call(null, b, om.core.get_props.call(null, {props:a}));
    } finally {
      om.core._STAR_read_enabled_STAR_ = c;
    }
  } else {
    return null;
  }
}, function(a, b) {
  var c = om.core._STAR_read_enabled_STAR_;
  try {
    om.core._STAR_read_enabled_STAR_ = !0;
    var d = this.props, e = this.state, f = om.core.children.call(null, this);
    om.core.merge_props_state.call(null, this, a);
    if (f ? cljs.core.truth_(cljs.core.truth_(null) ? null : f.om$core$IShouldUpdate$) || (f.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IShouldUpdate, f)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IShouldUpdate, f)) {
      return om.core.should_update.call(null, f, om.core.get_props.call(null, {props:a}), om.core._get_state.call(null, this));
    }
    var g = d.__om_cursor, h = a.__om_cursor;
    return cljs.core.not_EQ_.call(null, om.core._value.call(null, g), om.core._value.call(null, h)) ? !0 : om.core.cursor_QMARK_.call(null, g) && om.core.cursor_QMARK_.call(null, h) && cljs.core.not_EQ_.call(null, om.core._path.call(null, g), om.core._path.call(null, h)) ? !0 : null != e.__om_pending_state ? !0 : d.__om_index !== a.__om_index ? !0 : !1;
  } finally {
    om.core._STAR_read_enabled_STAR_ = c;
  }
}, function() {
  var a = om.core.children.call(null, this), b = this.props, c = om.core._STAR_read_enabled_STAR_;
  try {
    if (om.core._STAR_read_enabled_STAR_ = !0, a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.om$core$IRender$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IRender, a)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IRender, a)) {
      var d = om.core._STAR_parent_STAR_, e = om.core._STAR_state_STAR_, f = om.core._STAR_instrument_STAR_;
      try {
        return om.core._STAR_parent_STAR_ = this, om.core._STAR_state_STAR_ = b.__om_app_state, om.core._STAR_instrument_STAR_ = b.__om_instrument, om.core.render.call(null, a);
      } finally {
        om.core._STAR_instrument_STAR_ = f, om.core._STAR_state_STAR_ = e, om.core._STAR_parent_STAR_ = d;
      }
    } else {
      if (a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.om$core$IRenderState$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IRenderState, a)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IRenderState, a)) {
        var g = om.core._STAR_parent_STAR_, h = om.core._STAR_state_STAR_, k = om.core._STAR_instrument_STAR_;
        try {
          return om.core._STAR_parent_STAR_ = this, om.core._STAR_state_STAR_ = b.__om_app_state, om.core._STAR_instrument_STAR_ = b.__om_instrument, om.core.render_state.call(null, a, om.core.get_state.call(null, this));
        } finally {
          om.core._STAR_instrument_STAR_ = k, om.core._STAR_state_STAR_ = h, om.core._STAR_parent_STAR_ = g;
        }
      } else {
        return a;
      }
    }
  } finally {
    om.core._STAR_read_enabled_STAR_ = c;
  }
}, function(a, b) {
  var c = om.core.children.call(null, this);
  if (c ? cljs.core.truth_(cljs.core.truth_(null) ? null : c.om$core$IWillUpdate$) || (c.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IWillUpdate, c)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IWillUpdate, c)) {
    var d = om.core._STAR_read_enabled_STAR_;
    try {
      om.core._STAR_read_enabled_STAR_ = !0, om.core.will_update.call(null, c, om.core.get_props.call(null, {props:a}), om.core._get_state.call(null, this));
    } finally {
      om.core._STAR_read_enabled_STAR_ = d;
    }
  }
  return om.core.merge_pending_state.call(null, this);
}, function() {
  var a = om.core.children.call(null, this), b = this.props, c = function() {
    var a = b.__om_init_state;
    return cljs.core.truth_(a) ? a : cljs.core.PersistentArrayMap.EMPTY;
  }(), d = (new cljs.core.Keyword("om.core", "id", "om.core/id", 299074693)).cljs$core$IFn$_invoke$arity$1(c), c = {__om_state:cljs.core.merge.call(null, (a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.om$core$IInitState$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IInitState, a)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IInitState, a)) ? function() {
    var b = om.core._STAR_read_enabled_STAR_;
    try {
      return om.core._STAR_read_enabled_STAR_ = !0, om.core.init_state.call(null, a);
    } finally {
      om.core._STAR_read_enabled_STAR_ = b;
    }
  }() : null, cljs.core.dissoc.call(null, c, new cljs.core.Keyword("om.core", "id", "om.core/id", 299074693))), __om_id:cljs.core.truth_(d) ? d : goog.ui.IdGenerator.getInstance().getNextUniqueId()};
  b.__om_init_state = null;
  return c;
}, function() {
  var a = om.core.children.call(null, this);
  if (a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.om$core$IDidMount$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IDidMount, a)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IDidMount, a)) {
    var b = om.core._STAR_read_enabled_STAR_;
    try {
      return om.core._STAR_read_enabled_STAR_ = !0, om.core.did_mount.call(null, a);
    } finally {
      om.core._STAR_read_enabled_STAR_ = b;
    }
  } else {
    return null;
  }
}, function() {
  var a = om.core.children.call(null, this);
  if (a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.om$core$IDisplayName$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IDisplayName, a)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IDisplayName, a)) {
    var b = om.core._STAR_read_enabled_STAR_;
    try {
      return om.core._STAR_read_enabled_STAR_ = !0, om.core.display_name.call(null, a);
    } finally {
      om.core._STAR_read_enabled_STAR_ = b;
    }
  } else {
    return null;
  }
}, function() {
  om.core.merge_props_state.call(null, this);
  var a = om.core.children.call(null, this);
  if (a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.om$core$IWillMount$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IWillMount, a)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IWillMount, a)) {
    var b = om.core._STAR_read_enabled_STAR_;
    try {
      om.core._STAR_read_enabled_STAR_ = !0, om.core.will_mount.call(null, a);
    } finally {
      om.core._STAR_read_enabled_STAR_ = b;
    }
  }
  return om.core.merge_pending_state.call(null, this);
}]);
om.core.specify_state_methods_BANG_ = function(a) {
  a.om$core$IGetState$ = !0;
  a.om$core$IGetState$_get_state$arity$1 = function(a) {
    return function(a) {
      a = this.state;
      var b = a.__om_pending_state;
      return cljs.core.truth_(b) ? b : a.__om_state;
    };
  }(a);
  a.om$core$IGetState$_get_state$arity$2 = function(a) {
    return function(a, b) {
      return cljs.core.get_in.call(null, om.core._get_state.call(null, this), b);
    };
  }(a);
  a.om$core$IGetRenderState$ = !0;
  a.om$core$IGetRenderState$_get_render_state$arity$1 = function(a) {
    return function(a) {
      return this.state.__om_state;
    };
  }(a);
  a.om$core$IGetRenderState$_get_render_state$arity$2 = function(a) {
    return function(a, b) {
      return cljs.core.get_in.call(null, om.core._get_render_state.call(null, this), b);
    };
  }(a);
  a.om$core$ISetState$ = !0;
  a.om$core$ISetState$_set_state_BANG_$arity$3 = function(a) {
    return function(a, b, e) {
      a = om.core._STAR_read_enabled_STAR_;
      try {
        om.core._STAR_read_enabled_STAR_ = !0;
        var f = this.props.__om_app_state;
        this.state.__om_pending_state = b;
        return cljs.core.truth_(function() {
          var a = null != f;
          return a ? e : a;
        }()) ? om.core._queue_render_BANG_.call(null, f, this) : null;
      } finally {
        om.core._STAR_read_enabled_STAR_ = a;
      }
    };
  }(a);
  a.om$core$ISetState$_set_state_BANG_$arity$4 = function(a) {
    return function(a, b, e, f) {
      a = om.core._STAR_read_enabled_STAR_;
      try {
        om.core._STAR_read_enabled_STAR_ = !0;
        var g = this.props, h = this.state, k = om.core._get_state.call(null, this), l = g.__om_app_state;
        h.__om_pending_state = cljs.core.assoc_in.call(null, k, b, e);
        return cljs.core.truth_(function() {
          var a = null != l;
          return a ? f : a;
        }()) ? om.core._queue_render_BANG_.call(null, l, this) : null;
      } finally {
        om.core._STAR_read_enabled_STAR_ = a;
      }
    };
  }(a);
  return a;
};
om.core.pure_descriptor = om.core.specify_state_methods_BANG_.call(null, cljs.core.clj__GT_js.call(null, om.core.pure_methods));
om.core.MapCursor = function(a, b, c) {
  this.value = a;
  this.state = b;
  this.path = c;
  this.cljs$lang$protocol_mask$partition0$ = 2162591503;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
om.core.MapCursor.cljs$lang$type = !0;
om.core.MapCursor.cljs$lang$ctorStr = "om.core/MapCursor";
om.core.MapCursor.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "om.core/MapCursor");
};
om.core.MapCursor.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
om.core.MapCursor.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  if (om.core._STAR_read_enabled_STAR_) {
    return a = cljs.core._lookup.call(null, this.value, b, c), cljs.core._EQ_.call(null, a, c) ? c : om.core._derive.call(null, this, a, this.state, cljs.core.conj.call(null, this.path, b));
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.MapCursor.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  if (om.core._STAR_read_enabled_STAR_) {
    return cljs.core._pr_writer.call(null, this.value, b, c);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.MapCursor.prototype.om$core$ICursor$ = !0;
om.core.MapCursor.prototype.om$core$ICursor$_path$arity$1 = function(a) {
  return this.path;
};
om.core.MapCursor.prototype.om$core$ICursor$_state$arity$1 = function(a) {
  return this.state;
};
om.core.MapCursor.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  if (om.core._STAR_read_enabled_STAR_) {
    return cljs.core.meta.call(null, this.value);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.MapCursor.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new om.core.MapCursor(this.value, this.state, this.path);
};
om.core.MapCursor.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if (om.core._STAR_read_enabled_STAR_) {
    return cljs.core._count.call(null, this.value);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.MapCursor.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  if (om.core._STAR_read_enabled_STAR_) {
    return cljs.core.hash.call(null, this.value);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.MapCursor.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  if (om.core._STAR_read_enabled_STAR_) {
    return om.core.cursor_QMARK_.call(null, b) ? cljs.core._EQ_.call(null, this.value, om.core._value.call(null, b)) : cljs.core._EQ_.call(null, this.value, b);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.MapCursor.prototype.om$core$IValue$ = !0;
om.core.MapCursor.prototype.om$core$IValue$_value$arity$1 = function(a) {
  return this.value;
};
om.core.MapCursor.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  if (om.core._STAR_read_enabled_STAR_) {
    return new om.core.MapCursor(cljs.core.empty.call(null, this.value), this.state, this.path);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.MapCursor.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if (om.core._STAR_read_enabled_STAR_) {
    return new om.core.MapCursor(cljs.core._dissoc.call(null, this.value, b), this.state, this.path);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.MapCursor.prototype.om$core$ITransact$ = !0;
om.core.MapCursor.prototype.om$core$ITransact$_transact_BANG_$arity$4 = function(a, b, c, d) {
  return om.core.transact_STAR_.call(null, this.state, this, b, c, d);
};
om.core.MapCursor.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  if (om.core._STAR_read_enabled_STAR_) {
    return cljs.core._contains_key_QMARK_.call(null, this.value, b);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.MapCursor.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if (om.core._STAR_read_enabled_STAR_) {
    return new om.core.MapCursor(cljs.core._assoc.call(null, this.value, b, c), this.state, this.path);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.MapCursor.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this;
  if (om.core._STAR_read_enabled_STAR_) {
    return 0 < cljs.core.count.call(null, b.value) ? cljs.core.map.call(null, function(a) {
      return function(d) {
        var e = cljs.core.nth.call(null, d, 0, null);
        d = cljs.core.nth.call(null, d, 1, null);
        return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [e, om.core._derive.call(null, a, d, b.state, cljs.core.conj.call(null, b.path, e))], null);
      };
    }(this), b.value) : null;
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.MapCursor.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  if (om.core._STAR_read_enabled_STAR_) {
    return new om.core.MapCursor(cljs.core.with_meta.call(null, this.value, b), this.state, this.path);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.MapCursor.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  if (om.core._STAR_read_enabled_STAR_) {
    return new om.core.MapCursor(cljs.core._conj.call(null, this.value, b), this.state, this.path);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.MapCursor.prototype.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return this.cljs$core$ILookup$_lookup$arity$2(null, c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
  };
  return a;
}();
om.core.MapCursor.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
om.core.MapCursor.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
om.core.MapCursor.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
om.core.MapCursor.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  if (om.core._STAR_read_enabled_STAR_) {
    throw Error("Cannot deref cursor during render phase: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(this));
  }
  return cljs.core.get_in.call(null, cljs.core.deref.call(null, this.state), this.path);
};
om.core.__GT_MapCursor = function(a, b, c) {
  return new om.core.MapCursor(a, b, c);
};
om.core.IndexedCursor = function(a, b, c) {
  this.value = a;
  this.state = b;
  this.path = c;
  this.cljs$lang$protocol_mask$partition0$ = 2179375903;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
om.core.IndexedCursor.cljs$lang$type = !0;
om.core.IndexedCursor.cljs$lang$ctorStr = "om.core/IndexedCursor";
om.core.IndexedCursor.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "om.core/IndexedCursor");
};
om.core.IndexedCursor.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  if (om.core._STAR_read_enabled_STAR_) {
    return cljs.core._nth.call(null, this, b, null);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  if (om.core._STAR_read_enabled_STAR_) {
    return cljs.core._nth.call(null, this, b, c);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if (om.core._STAR_read_enabled_STAR_) {
    return om.core._derive.call(null, this, cljs.core._nth.call(null, this.value, b), this.state, cljs.core.conj.call(null, this.path, b));
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  if (om.core._STAR_read_enabled_STAR_) {
    return b < cljs.core._count.call(null, this.value) ? om.core._derive.call(null, this, cljs.core._nth.call(null, this.value, b), this.state, cljs.core.conj.call(null, this.path, b)) : c;
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  if (om.core._STAR_read_enabled_STAR_) {
    return cljs.core._pr_writer.call(null, this.value, b, c);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.om$core$ICursor$ = !0;
om.core.IndexedCursor.prototype.om$core$ICursor$_path$arity$1 = function(a) {
  return this.path;
};
om.core.IndexedCursor.prototype.om$core$ICursor$_state$arity$1 = function(a) {
  return this.state;
};
om.core.IndexedCursor.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  if (om.core._STAR_read_enabled_STAR_) {
    return cljs.core.meta.call(null, this.value);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new om.core.IndexedCursor(this.value, this.state, this.path);
};
om.core.IndexedCursor.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if (om.core._STAR_read_enabled_STAR_) {
    return cljs.core._count.call(null, this.value);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  if (om.core._STAR_read_enabled_STAR_) {
    return om.core._derive.call(null, this, cljs.core._peek.call(null, this.value), this.state, this.path);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  if (om.core._STAR_read_enabled_STAR_) {
    return om.core._derive.call(null, this, cljs.core._pop.call(null, this.value), this.state, this.path);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  if (om.core._STAR_read_enabled_STAR_) {
    return cljs.core.hash.call(null, this.value);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  if (om.core._STAR_read_enabled_STAR_) {
    return om.core.cursor_QMARK_.call(null, b) ? cljs.core._EQ_.call(null, this.value, om.core._value.call(null, b)) : cljs.core._EQ_.call(null, this.value, b);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.om$core$IValue$ = !0;
om.core.IndexedCursor.prototype.om$core$IValue$_value$arity$1 = function(a) {
  return this.value;
};
om.core.IndexedCursor.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  if (om.core._STAR_read_enabled_STAR_) {
    return new om.core.IndexedCursor(cljs.core.empty.call(null, this.value), this.state, this.path);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.om$core$ITransact$ = !0;
om.core.IndexedCursor.prototype.om$core$ITransact$_transact_BANG_$arity$4 = function(a, b, c, d) {
  return om.core.transact_STAR_.call(null, this.state, this, b, c, d);
};
om.core.IndexedCursor.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  if (om.core._STAR_read_enabled_STAR_) {
    return cljs.core._contains_key_QMARK_.call(null, this.value, b);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if (om.core._STAR_read_enabled_STAR_) {
    return om.core._derive.call(null, this, cljs.core._assoc_n.call(null, this.value, b, c), this.state, this.path);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this;
  if (om.core._STAR_read_enabled_STAR_) {
    return 0 < cljs.core.count.call(null, b.value) ? cljs.core.map.call(null, function(a) {
      return function(d, e) {
        return om.core._derive.call(null, a, d, b.state, cljs.core.conj.call(null, b.path, e));
      };
    }(this), b.value, cljs.core.range.call(null)) : null;
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  if (om.core._STAR_read_enabled_STAR_) {
    return new om.core.IndexedCursor(cljs.core.with_meta.call(null, this.value, b), this.state, this.path);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  if (om.core._STAR_read_enabled_STAR_) {
    return new om.core.IndexedCursor(cljs.core._conj.call(null, this.value, b), this.state, this.path);
  }
  throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
};
om.core.IndexedCursor.prototype.call = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return this.cljs$core$ILookup$_lookup$arity$2(null, c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
  };
  return a;
}();
om.core.IndexedCursor.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
om.core.IndexedCursor.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
om.core.IndexedCursor.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
om.core.IndexedCursor.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  if (om.core._STAR_read_enabled_STAR_) {
    throw Error("Cannot deref cursor during render phase: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(this));
  }
  return cljs.core.get_in.call(null, cljs.core.deref.call(null, this.state), this.path);
};
om.core.__GT_IndexedCursor = function(a, b, c) {
  return new om.core.IndexedCursor(a, b, c);
};
om.core.to_cursor_STAR_ = function(a, b, c) {
  var d = cljs.core.clone.call(null, a);
  d.cljs$core$IEquiv$ = !0;
  d.cljs$core$IEquiv$_equiv$arity$2 = function(b) {
    return function(b, c) {
      if (om.core._STAR_read_enabled_STAR_) {
        return om.core.cursor_QMARK_.call(null, c) ? cljs.core._EQ_.call(null, a, om.core._value.call(null, c)) : cljs.core._EQ_.call(null, a, c);
      }
      throw Error("Cannot manipulate cursor outside of render phase, only om.core/transact!, om.core/update!, and cljs.core/deref operations allowed");
    };
  }(d);
  d.om$core$ITransact$ = !0;
  d.om$core$ITransact$_transact_BANG_$arity$4 = function(a) {
    return function(a, c, d, e) {
      return om.core.transact_STAR_.call(null, b, this, c, d, e);
    };
  }(d);
  d.om$core$ICursor$ = !0;
  d.om$core$ICursor$_path$arity$1 = function(a) {
    return function(a) {
      return c;
    };
  }(d);
  d.om$core$ICursor$_state$arity$1 = function(a) {
    return function(a) {
      return b;
    };
  }(d);
  d.cljs$core$IDeref$ = !0;
  d.cljs$core$IDeref$_deref$arity$1 = function(a) {
    return function(a) {
      if (om.core._STAR_read_enabled_STAR_) {
        throw Error("Cannot deref cursor during render phase: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(this));
      }
      return cljs.core.get_in.call(null, cljs.core.deref.call(null, b), c);
    };
  }(d);
  return d;
};
om.core.to_cursor = function() {
  var a = null, b = function(b) {
    return a.call(null, b, null, cljs.core.PersistentVector.EMPTY);
  }, c = function(b, c) {
    return a.call(null, b, c, cljs.core.PersistentVector.EMPTY);
  }, d = function(a, b, c) {
    return om.core.cursor_QMARK_.call(null, a) ? a : (a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.om$core$IToCursor$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IToCursor, a)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IToCursor, a)) ? om.core._to_cursor.call(null, a, b, c) : cljs.core.indexed_QMARK_.call(null, a) ? new om.core.IndexedCursor(a, b, c) : cljs.core.map_QMARK_.call(null, a) ? new om.core.MapCursor(a, b, c) : 
    (a ? a.cljs$lang$protocol_mask$partition1$ & 8192 || a.cljs$core$ICloneable$ || (a.cljs$lang$protocol_mask$partition1$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICloneable, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICloneable, a)) ? om.core.to_cursor_STAR_.call(null, a, b, c) : a;
  }, a = function(a, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, f);
      case 3:
        return d.call(this, a, f, g);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  return a;
}();
om.core.notify_STAR_ = function(a, b) {
  var c = om.core._state.call(null, a);
  return om.core._notify_BANG_.call(null, c, b, om.core.to_cursor.call(null, cljs.core.deref.call(null, c), c));
};
om.core.refresh_queued = !1;
om.core.refresh_set = cljs.core.atom.call(null, cljs.core.PersistentHashSet.EMPTY);
om.core.render_all = function() {
  om.core.refresh_queued = !1;
  for (var a = cljs.core.seq.call(null, cljs.core.deref.call(null, om.core.refresh_set)), b = null, c = 0, d = 0;;) {
    if (d < c) {
      var e = cljs.core._nth.call(null, b, d);
      e.call(null);
      d += 1;
    } else {
      if (a = cljs.core.seq.call(null, a)) {
        b = a, cljs.core.chunked_seq_QMARK_.call(null, b) ? (a = cljs.core.chunk_first.call(null, b), c = cljs.core.chunk_rest.call(null, b), b = a, e = cljs.core.count.call(null, a), a = c, c = e) : (e = cljs.core.first.call(null, b), e.call(null), a = cljs.core.next.call(null, b), b = null, c = 0), d = 0;
      } else {
        return null;
      }
    }
  }
};
om.core.roots = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY);
om.core.valid_component_QMARK_ = function(a, b) {
  var c = a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.om$core$IRender$) ? !0 : a.cljs$lang$protocol_mask$partition$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IRender, a) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IRender, a);
  if (c ? c : a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.om$core$IRenderState$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.IRenderState, a)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.IRenderState, a)) {
    return null;
  }
  throw Error("Assert failed: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1("Invalid Om component fn, " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b.name) + " does not return valid instance") + "\n" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "or", "or", 1876275696, null), cljs.core.list(new cljs.core.Symbol(null, "satisfies?", "satisfies?", -433227199, null), new cljs.core.Symbol(null, "IRender", "IRender", 590822196, null), 
  new cljs.core.Symbol(null, "x", "x", -555367584, null)), cljs.core.list(new cljs.core.Symbol(null, "satisfies?", "satisfies?", -433227199, null), new cljs.core.Symbol(null, "IRenderState", "IRenderState", -897673898, null), new cljs.core.Symbol(null, "x", "x", -555367584, null))))));
};
om.core.valid_QMARK_ = function(a) {
  return cljs.core.every_QMARK_.call(null, new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 10, [new cljs.core.Keyword(null, "descriptor", "descriptor", 76122018), null, new cljs.core.Keyword(null, "fn", "fn", -1175266204), null, new cljs.core.Keyword(null, "instrument", "instrument", -960698844), null, new cljs.core.Keyword(null, "react-key", "react-key", 1337881348), null, new cljs.core.Keyword(null, "key", "key", -1516042587), null, new cljs.core.Keyword(null, "init-state", 
  "init-state", 1450863212), null, new cljs.core.Keyword(null, "state", "state", -1988618099), null, new cljs.core.Keyword(null, "opts", "opts", 155075701), null, new cljs.core.Keyword("om.core", "index", "om.core/index", -1724175434), null, new cljs.core.Keyword(null, "shared", "shared", -384145993), null], null), null), cljs.core.keys.call(null, a));
};
om.core.id = function(a) {
  return a.state.__om_id;
};
om.core.get_descriptor = function() {
  var a = null, b = function(b) {
    return a.call(null, b, null);
  }, c = function(a, b) {
    null == a.om$descriptor && (a.om$descriptor = React.createClass(cljs.core.truth_(b) ? b : om.core.pure_descriptor));
    return a.om$descriptor;
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
om.core.build_STAR_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, null);
  }, c = function(a, b, c) {
    if (!om.core.valid_QMARK_.call(null, c)) {
      throw Error("Assert failed: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.call(null, cljs.core.str, "build options contains invalid keys, only :key, :react-key, ", ":fn, :init-state, :state, and :opts allowed, given ", cljs.core.interpose.call(null, ", ", cljs.core.keys.call(null, c)))) + "\n" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "valid?", "valid?", 1428119148, null), new cljs.core.Symbol(null, 
      "m", "m", -1021758608, null)))));
    }
    if (null == c) {
      var g = om.core.get_shared.call(null, om.core._STAR_parent_STAR_), h = om.core.get_descriptor.call(null, a);
      return h.call(null, {children:function(c, f) {
        return function(c) {
          var f = om.core._STAR_read_enabled_STAR_;
          try {
            om.core._STAR_read_enabled_STAR_ = !0;
            var g = a.call(null, b, c);
            om.core.valid_component_QMARK_.call(null, g, a);
            return g;
          } finally {
            om.core._STAR_read_enabled_STAR_ = f;
          }
        };
      }(g, h), __om_instrument:om.core._STAR_instrument_STAR_, __om_app_state:om.core._STAR_state_STAR_, __om_shared:g, __om_cursor:b});
    }
    var k = cljs.core.seq_QMARK_.call(null, c) ? cljs.core.apply.call(null, cljs.core.hash_map, c) : c, l = cljs.core.get.call(null, k, new cljs.core.Keyword(null, "opts", "opts", 155075701)), m = cljs.core.get.call(null, k, new cljs.core.Keyword(null, "init-state", "init-state", 1450863212)), n = cljs.core.get.call(null, k, new cljs.core.Keyword(null, "state", "state", -1988618099)), p = cljs.core.get.call(null, k, new cljs.core.Keyword(null, "key", "key", -1516042587)), q = cljs.core.get.call(null, 
    c, new cljs.core.Keyword(null, "fn", "fn", -1175266204)), r = null != q ? function() {
      var a = (new cljs.core.Keyword("om.core", "index", "om.core/index", -1724175434)).cljs$core$IFn$_invoke$arity$1(c);
      return cljs.core.truth_(a) ? q.call(null, b, a) : q.call(null, b);
    }() : b, s = null != p ? cljs.core.get.call(null, r, p) : cljs.core.get.call(null, c, new cljs.core.Keyword(null, "react-key", "react-key", 1337881348)), g = function() {
      var a = (new cljs.core.Keyword(null, "shared", "shared", -384145993)).cljs$core$IFn$_invoke$arity$1(c);
      return cljs.core.truth_(a) ? a : om.core.get_shared.call(null, om.core._STAR_parent_STAR_);
    }(), h = om.core.get_descriptor.call(null, a, (new cljs.core.Keyword(null, "descriptor", "descriptor", 76122018)).cljs$core$IFn$_invoke$arity$1(c));
    return h.call(null, {__om_shared:g, __om_index:(new cljs.core.Keyword("om.core", "index", "om.core/index", -1724175434)).cljs$core$IFn$_invoke$arity$1(c), __om_cursor:r, __om_app_state:om.core._STAR_state_STAR_, key:s, __om_init_state:m, children:null == l ? function(b, c, e, f, g, h, k, l, m, n, p) {
      return function(b) {
        var c = om.core._STAR_read_enabled_STAR_;
        try {
          om.core._STAR_read_enabled_STAR_ = !0;
          var e = a.call(null, l, b);
          om.core.valid_component_QMARK_.call(null, e, a);
          return e;
        } finally {
          om.core._STAR_read_enabled_STAR_ = c;
        }
      };
    }(c, k, l, m, n, p, q, r, s, g, h) : function(b, c, e, f, g, h, k, l, m, n, p) {
      return function(b) {
        var c = om.core._STAR_read_enabled_STAR_;
        try {
          om.core._STAR_read_enabled_STAR_ = !0;
          var f = a.call(null, l, b, e);
          om.core.valid_component_QMARK_.call(null, f, a);
          return f;
        } finally {
          om.core._STAR_read_enabled_STAR_ = c;
        }
      };
    }(c, k, l, m, n, p, q, r, s, g, h), __om_instrument:om.core._STAR_instrument_STAR_, __om_state:n});
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
om.core.build = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, null);
  }, c = function(a, b, c) {
    if (null != om.core._STAR_instrument_STAR_) {
      var g;
      a: {
        var h = om.core._STAR_read_enabled_STAR_;
        try {
          om.core._STAR_read_enabled_STAR_ = !0;
          g = om.core._STAR_instrument_STAR_.call(null, a, b, c);
          break a;
        } finally {
          om.core._STAR_read_enabled_STAR_ = h;
        }
        g = void 0;
      }
      return cljs.core._EQ_.call(null, g, new cljs.core.Keyword("om.core", "pass", "om.core/pass", -1453289268)) ? om.core.build_STAR_.call(null, a, b, c) : g;
    }
    return om.core.build_STAR_.call(null, a, b, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
om.core.build_all = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, null);
  }, c = function(a, b, c) {
    return cljs.core.map.call(null, function(b, e) {
      return om.core.build.call(null, a, b, cljs.core.assoc.call(null, c, new cljs.core.Keyword("om.core", "index", "om.core/index", -1724175434), e));
    }, b, cljs.core.range.call(null));
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
om.core.setup = function(a, b, c) {
  if (!(a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.om$core$INotify$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, om.core.INotify, a)) : cljs.core.native_satisfies_QMARK_.call(null, om.core.INotify, a))) {
    var d = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY), e = cljs.core.atom.call(null, cljs.core.PersistentHashSet.EMPTY);
    a.om$core$IRenderQueue$ = !0;
    a.om$core$IRenderQueue$_get_queue$arity$1 = function(a, b, c) {
      return function(a) {
        return cljs.core.deref.call(null, c);
      };
    }(a, d, e);
    a.om$core$IRenderQueue$_queue_render_BANG_$arity$2 = function(a, b, c) {
      return function(a, b) {
        if (cljs.core.contains_QMARK_.call(null, cljs.core.deref.call(null, c), b)) {
          return null;
        }
        cljs.core.swap_BANG_.call(null, c, cljs.core.conj, b);
        return cljs.core.swap_BANG_.call(null, this, cljs.core.identity);
      };
    }(a, d, e);
    a.om$core$IRenderQueue$_empty_queue_BANG_$arity$1 = function(a, b, c) {
      return function(a) {
        return cljs.core.swap_BANG_.call(null, c, cljs.core.empty);
      };
    }(a, d, e);
    a.om$core$INotify$ = !0;
    a.om$core$INotify$_listen_BANG_$arity$3 = function(a, b, c) {
      return function(a, c, d) {
        null != d && cljs.core.swap_BANG_.call(null, b, cljs.core.assoc, c, d);
        return this;
      };
    }(a, d, e);
    a.om$core$INotify$_unlisten_BANG_$arity$2 = function(a, b, c) {
      return function(a, c) {
        cljs.core.swap_BANG_.call(null, b, cljs.core.dissoc, c);
        return this;
      };
    }(a, d, e);
    a.om$core$INotify$_notify_BANG_$arity$3 = function(a, b, c) {
      return function(a, c, d) {
        a = cljs.core.seq.call(null, cljs.core.deref.call(null, b));
        for (var e = null, f = 0, h = 0;;) {
          if (h < f) {
            var r = cljs.core._nth.call(null, e, h);
            cljs.core.nth.call(null, r, 0, null);
            cljs.core.nth.call(null, r, 1, null).call(null, c, d);
            h += 1;
          } else {
            if (a = cljs.core.seq.call(null, a)) {
              e = a, cljs.core.chunked_seq_QMARK_.call(null, e) ? (a = cljs.core.chunk_first.call(null, e), h = cljs.core.chunk_rest.call(null, e), e = a, f = cljs.core.count.call(null, a), a = h) : (a = cljs.core.first.call(null, e), cljs.core.nth.call(null, a, 0, null), cljs.core.nth.call(null, a, 1, null).call(null, c, d), a = cljs.core.next.call(null, e), e = null, f = 0), h = 0;
            } else {
              break;
            }
          }
        }
        return this;
      };
    }(a, d, e);
  }
  return om.core._listen_BANG_.call(null, a, b, c);
};
om.core.tear_down = function(a, b) {
  return om.core._unlisten_BANG_.call(null, a, b);
};
om.core.root = function(a, b, c) {
  var d = cljs.core.seq_QMARK_.call(null, c) ? cljs.core.apply.call(null, cljs.core.hash_map, c) : c, e = cljs.core.get.call(null, d, new cljs.core.Keyword(null, "instrument", "instrument", -960698844)), f = cljs.core.get.call(null, d, new cljs.core.Keyword(null, "path", "path", -188191168)), g = cljs.core.get.call(null, d, new cljs.core.Keyword(null, "tx-listen", "tx-listen", 119130367)), h = cljs.core.get.call(null, d, new cljs.core.Keyword(null, "target", "target", 253001721));
  if (null == h) {
    throw Error("Assert failed: No target specified to om.core/root\n" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "not", "not", 1044554643, null), cljs.core.list(new cljs.core.Symbol(null, "nil?", "nil?", 1612038930, null), new cljs.core.Symbol(null, "target", "target", 1893533248, null))))));
  }
  var k = cljs.core.deref.call(null, om.core.roots);
  cljs.core.contains_QMARK_.call(null, k, h) && cljs.core.get.call(null, k, h).call(null);
  k = cljs.core.gensym.call(null);
  b = (b ? b.cljs$lang$protocol_mask$partition1$ & 16384 || b.cljs$core$IAtom$ || (b.cljs$lang$protocol_mask$partition1$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IAtom, b)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IAtom, b)) ? b : cljs.core.atom.call(null, b);
  var l = om.core.setup.call(null, b, k, g), m = cljs.core.dissoc.call(null, d, new cljs.core.Keyword(null, "target", "target", 253001721), new cljs.core.Keyword(null, "tx-listen", "tx-listen", 119130367), new cljs.core.Keyword(null, "path", "path", -188191168)), n = function(b, c, d, e, f, g, h, k, l, m, n) {
    return function w() {
      cljs.core.swap_BANG_.call(null, om.core.refresh_set, cljs.core.disj, w);
      var b = cljs.core.deref.call(null, d), c = null == l ? om.core.to_cursor.call(null, b, d, cljs.core.PersistentVector.EMPTY) : om.core.to_cursor.call(null, cljs.core.get_in.call(null, b, l), d, l);
      om.dom.render.call(null, function() {
        var b = om.core._STAR_instrument_STAR_, f = om.core._STAR_state_STAR_;
        try {
          return om.core._STAR_instrument_STAR_ = k, om.core._STAR_state_STAR_ = d, om.core.build.call(null, a, c, e);
        } finally {
          om.core._STAR_state_STAR_ = f, om.core._STAR_instrument_STAR_ = b;
        }
      }(), n);
      b = om.core._get_queue.call(null, d);
      if (cljs.core.empty_QMARK_.call(null, b)) {
        return null;
      }
      for (var b = cljs.core.seq.call(null, b), f = null, g = 0, h = 0;;) {
        if (h < g) {
          var m = cljs.core._nth.call(null, f, h);
          cljs.core.truth_(m.isMounted()) && m.forceUpdate();
          h += 1;
        } else {
          if (b = cljs.core.seq.call(null, b)) {
            f = b, cljs.core.chunked_seq_QMARK_.call(null, f) ? (b = cljs.core.chunk_first.call(null, f), h = cljs.core.chunk_rest.call(null, f), f = b, g = cljs.core.count.call(null, b), b = h) : (b = cljs.core.first.call(null, f), cljs.core.truth_(b.isMounted()) && b.forceUpdate(), b = cljs.core.next.call(null, f), f = null, g = 0), h = 0;
          } else {
            break;
          }
        }
      }
      return om.core._empty_queue_BANG_.call(null, d);
    };
  }(k, b, l, m, c, d, d, e, f, g, h);
  cljs.core.add_watch.call(null, l, k, function(a, b, c, d, e, f, g, h, k, l, m, n) {
    return function(a, b, c, d) {
      cljs.core.contains_QMARK_.call(null, cljs.core.deref.call(null, om.core.refresh_set), e) || cljs.core.swap_BANG_.call(null, om.core.refresh_set, cljs.core.conj, e);
      if (cljs.core.truth_(om.core.refresh_queued)) {
        return null;
      }
      om.core.refresh_queued = !0;
      return "undefined" !== typeof requestAnimationFrame ? requestAnimationFrame(om.core.render_all) : setTimeout(om.core.render_all, 16);
    };
  }(k, b, l, m, n, c, d, d, e, f, g, h));
  cljs.core.swap_BANG_.call(null, om.core.roots, cljs.core.assoc, h, function(a, b, c, d, e, f, g, h, k, l, m, n) {
    return function() {
      cljs.core.remove_watch.call(null, c, a);
      om.core.tear_down.call(null, c, a);
      cljs.core.swap_BANG_.call(null, om.core.roots, cljs.core.dissoc, n);
      return React.unmountComponentAtNode(n);
    };
  }(k, b, l, m, n, c, d, d, e, f, g, h));
  return n.call(null);
};
om.core.detach_root = function(a) {
  a = cljs.core.get.call(null, cljs.core.deref.call(null, om.core.roots), a);
  return cljs.core.truth_(a) ? a.call(null) : null;
};
om.core.transact_BANG_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, cljs.core.PersistentVector.EMPTY, c, null);
  }, c = function(b, c, d) {
    return a.call(null, b, c, d, null);
  }, d = function(a, b, c, d) {
    b = null == b ? cljs.core.PersistentVector.EMPTY : cljs.core.sequential_QMARK_.call(null, b) ? b : new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [b], null);
    return om.core._transact_BANG_.call(null, a, b, c, d);
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a;
}();
om.core.update_BANG_ = function() {
  var a = null, b = function(a, b) {
    return om.core.transact_BANG_.call(null, a, cljs.core.PersistentVector.EMPTY, function(a) {
      return b;
    }, null);
  }, c = function(a, b, c) {
    return om.core.transact_BANG_.call(null, a, b, function(a) {
      return c;
    }, null);
  }, d = function(a, b, c, d) {
    return om.core.transact_BANG_.call(null, a, b, function(a) {
      return c;
    }, d);
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a;
}();
om.core.get_node = function() {
  var a = null, b = function(a) {
    return a.getDOMNode();
  }, c = function(a, b) {
    var c = a.refs;
    return cljs.core.truth_(c) ? c[b].getDOMNode() : null;
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
om.core.set_state_BANG_ = function() {
  var a = null, b = function(a, b) {
    return om.core._set_state_BANG_.call(null, a, b, !0);
  }, c = function(a, b, c) {
    b = cljs.core.sequential_QMARK_.call(null, b) ? b : new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [b], null);
    return om.core._set_state_BANG_.call(null, a, b, c, !0);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
om.core.set_state_nr_BANG_ = function() {
  var a = null, b = function(a, b) {
    return om.core._set_state_BANG_.call(null, a, b, !1);
  }, c = function(a, b, c) {
    b = cljs.core.sequential_QMARK_.call(null, b) ? b : new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [b], null);
    return om.core._set_state_BANG_.call(null, a, b, c, !1);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
om.core.update_state_BANG_ = function() {
  var a = null, b = function(a, b) {
    return om.core.set_state_BANG_.call(null, a, b.call(null, om.core.get_state.call(null, a)));
  }, c = function(a, b, c) {
    return om.core.set_state_BANG_.call(null, a, b, c.call(null, om.core.get_state.call(null, a, b)));
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
om.core.update_state_nr_BANG_ = function() {
  var a = null, b = function(a, b) {
    return om.core.set_state_nr_BANG_.call(null, a, b.call(null, om.core.get_state.call(null, a)));
  }, c = function(a, b, c) {
    return om.core.set_state_nr_BANG_.call(null, a, b, c.call(null, om.core.get_state.call(null, a, b)));
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
om.core.refresh_BANG_ = function(a) {
  return om.core.update_state_BANG_.call(null, a, cljs.core.identity);
};
om.core.get_render_state = function() {
  var a = null, b = function(a) {
    return om.core._get_render_state.call(null, a);
  }, c = function(a, b) {
    var c = cljs.core.sequential_QMARK_.call(null, b) ? b : new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [b], null);
    return om.core._get_render_state.call(null, a, c);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
om.core.rendering_QMARK_ = function() {
  return!0 === om.core._STAR_read_enabled_STAR_;
};
var clojure = {string:{}};
clojure.string.seq_reverse = function(a) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, a);
};
clojure.string.reverse = function(a) {
  return a.split("").reverse().join("");
};
clojure.string.replace = function(a, b, c) {
  if ("string" === typeof b) {
    return a.replace(new RegExp(goog.string.regExpEscape(b), "g"), c);
  }
  if (cljs.core.truth_(b.hasOwnProperty("source"))) {
    return a.replace(new RegExp(b.source, "g"), c);
  }
  throw "Invalid match arg: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b);
};
clojure.string.replace_first = function(a, b, c) {
  return a.replace(b, c);
};
clojure.string.join = function() {
  var a = null, b = function(a) {
    return cljs.core.apply.call(null, cljs.core.str, a);
  }, c = function(a, b) {
    return cljs.core.apply.call(null, cljs.core.str, cljs.core.interpose.call(null, a, b));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
clojure.string.upper_case = function(a) {
  return a.toUpperCase();
};
clojure.string.lower_case = function(a) {
  return a.toLowerCase();
};
clojure.string.capitalize = function(a) {
  return 2 > cljs.core.count.call(null, a) ? clojure.string.upper_case.call(null, a) : "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.upper_case.call(null, cljs.core.subs.call(null, a, 0, 1))) + cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.lower_case.call(null, cljs.core.subs.call(null, a, 1)));
};
clojure.string.pop_last_while_empty = function(a) {
  for (;;) {
    if (cljs.core._EQ_.call(null, "", cljs.core.peek.call(null, a))) {
      a = cljs.core.pop.call(null, a);
    } else {
      return a;
    }
  }
};
clojure.string.discard_trailing_if_needed = function(a, b) {
  return cljs.core._EQ_.call(null, 0, a) ? clojure.string.pop_last_while_empty.call(null, b) : b;
};
clojure.string.split_with_empty_regex = function(a, b) {
  if (0 >= b || b >= 2 + cljs.core.count.call(null, a)) {
    return cljs.core.conj.call(null, cljs.core.vec.call(null, cljs.core.cons.call(null, "", cljs.core.map.call(null, cljs.core.str, cljs.core.seq.call(null, a)))), "");
  }
  var c = cljs.core._EQ_;
  if (cljs.core.truth_(c.call(null, 1, b))) {
    return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [a], null);
  }
  if (cljs.core.truth_(c.call(null, 2, b))) {
    return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["", a], null);
  }
  c = b - 2;
  return cljs.core.conj.call(null, cljs.core.vec.call(null, cljs.core.cons.call(null, "", cljs.core.subvec.call(null, cljs.core.vec.call(null, cljs.core.map.call(null, cljs.core.str, cljs.core.seq.call(null, a))), 0, c))), cljs.core.subs.call(null, a, c));
};
clojure.string.split = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, 0);
  }, c = function(a, b, c) {
    return clojure.string.discard_trailing_if_needed.call(null, c, cljs.core._EQ_.call(null, "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b), "/(?:)/") ? clojure.string.split_with_empty_regex.call(null, a, c) : 1 > c ? cljs.core.vec.call(null, ("" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a)).split(b)) : function() {
      for (var g = a, h = c, k = cljs.core.PersistentVector.EMPTY;;) {
        if (cljs.core._EQ_.call(null, h, 1)) {
          return cljs.core.conj.call(null, k, g);
        }
        var l = cljs.core.re_find.call(null, b, g);
        if (cljs.core.truth_(l)) {
          var m = l, l = g.indexOf(m), m = g.substring(l + cljs.core.count.call(null, m)), h = h - 1, k = cljs.core.conj.call(null, k, g.substring(0, l)), g = m
        } else {
          return cljs.core.conj.call(null, k, g);
        }
      }
    }());
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
clojure.string.split_lines = function(a) {
  return clojure.string.split.call(null, a, /\n|\r\n/);
};
clojure.string.trim = function(a) {
  return goog.string.trim(a);
};
clojure.string.triml = function(a) {
  return goog.string.trimLeft(a);
};
clojure.string.trimr = function(a) {
  return goog.string.trimRight(a);
};
clojure.string.trim_newline = function(a) {
  for (var b = a.length;;) {
    if (0 === b) {
      return "";
    }
    var c = cljs.core.get.call(null, a, b - 1);
    if (cljs.core._EQ_.call(null, c, "\n") || cljs.core._EQ_.call(null, c, "\r")) {
      b -= 1;
    } else {
      return a.substring(0, b);
    }
  }
};
clojure.string.blank_QMARK_ = function(a) {
  return goog.string.isEmptySafe(a);
};
clojure.string.escape = function(a, b) {
  for (var c = new goog.string.StringBuffer, d = a.length, e = 0;;) {
    if (cljs.core._EQ_.call(null, d, e)) {
      return c.toString();
    }
    var f = a.charAt(e), g = cljs.core.get.call(null, b, f);
    cljs.core.truth_(g) ? c.append("" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(g)) : c.append(f);
    e += 1;
  }
};
cljs.reader = {};
cljs.reader.PushbackReader = function() {
  return{};
}();
cljs.reader.read_char = function(a) {
  if (a ? a.cljs$reader$PushbackReader$read_char$arity$1 : a) {
    return a.cljs$reader$PushbackReader$read_char$arity$1(a);
  }
  var b;
  b = cljs.reader.read_char[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.reader.read_char._, !b)) {
    throw cljs.core.missing_protocol.call(null, "PushbackReader.read-char", a);
  }
  return b.call(null, a);
};
cljs.reader.unread = function(a, b) {
  if (a ? a.cljs$reader$PushbackReader$unread$arity$2 : a) {
    return a.cljs$reader$PushbackReader$unread$arity$2(a, b);
  }
  var c;
  c = cljs.reader.unread[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.reader.unread._, !c)) {
    throw cljs.core.missing_protocol.call(null, "PushbackReader.unread", a);
  }
  return c.call(null, a, b);
};
cljs.reader.StringPushbackReader = function(a, b, c) {
  this.s = a;
  this.buffer = b;
  this.idx = c;
};
cljs.reader.StringPushbackReader.cljs$lang$type = !0;
cljs.reader.StringPushbackReader.cljs$lang$ctorStr = "cljs.reader/StringPushbackReader";
cljs.reader.StringPushbackReader.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.reader/StringPushbackReader");
};
cljs.reader.StringPushbackReader.prototype.cljs$reader$PushbackReader$ = !0;
cljs.reader.StringPushbackReader.prototype.cljs$reader$PushbackReader$read_char$arity$1 = function(a) {
  return 0 === this.buffer.length ? (this.idx += 1, this.s[this.idx]) : this.buffer.pop();
};
cljs.reader.StringPushbackReader.prototype.cljs$reader$PushbackReader$unread$arity$2 = function(a, b) {
  return this.buffer.push(b);
};
cljs.reader.__GT_StringPushbackReader = function(a, b, c) {
  return new cljs.reader.StringPushbackReader(a, b, c);
};
cljs.reader.push_back_reader = function(a) {
  return new cljs.reader.StringPushbackReader(a, [], -1);
};
cljs.reader.whitespace_QMARK_ = function(a) {
  var b = goog.string.isBreakingWhitespace(a);
  return cljs.core.truth_(b) ? b : "," === a;
};
cljs.reader.numeric_QMARK_ = function(a) {
  return goog.string.isNumeric(a);
};
cljs.reader.comment_prefix_QMARK_ = function(a) {
  return ";" === a;
};
cljs.reader.number_literal_QMARK_ = function(a, b) {
  return cljs.reader.numeric_QMARK_.call(null, b) || ("+" === b || "-" === b) && cljs.reader.numeric_QMARK_.call(null, function() {
    var b = cljs.reader.read_char.call(null, a);
    cljs.reader.unread.call(null, a, b);
    return b;
  }());
};
cljs.reader.reader_error = function() {
  var a = function(a, b) {
    throw Error(cljs.core.apply.call(null, cljs.core.str, b));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.reader.macro_terminating_QMARK_ = function(a) {
  var b = "#" !== a;
  return b && (b = "'" !== a) ? (b = ":" !== a) ? cljs.reader.macros.call(null, a) : b : b;
};
cljs.reader.read_token = function(a, b) {
  for (var c = new goog.string.StringBuffer(b), d = cljs.reader.read_char.call(null, a);;) {
    if (null == d || cljs.reader.whitespace_QMARK_.call(null, d) || cljs.reader.macro_terminating_QMARK_.call(null, d)) {
      return cljs.reader.unread.call(null, a, d), c.toString();
    }
    c.append(d);
    d = cljs.reader.read_char.call(null, a);
  }
};
cljs.reader.skip_line = function(a, b) {
  for (;;) {
    var c = cljs.reader.read_char.call(null, a);
    if ("\n" === c || "\r" === c || null == c) {
      return a;
    }
  }
};
cljs.reader.int_pattern = cljs.core.re_pattern.call(null, "^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+))(N)?$");
cljs.reader.ratio_pattern = cljs.core.re_pattern.call(null, "^([-+]?[0-9]+)/([0-9]+)$");
cljs.reader.float_pattern = cljs.core.re_pattern.call(null, "^([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?$");
cljs.reader.symbol_pattern = cljs.core.re_pattern.call(null, "^[:]?([^0-9/].*/)?([^0-9/][^/]*)$");
cljs.reader.re_matches_STAR_ = function(a, b) {
  var c = a.exec(b);
  return null != c && c[0] === b ? 1 === c.length ? c[0] : c : null;
};
cljs.reader.match_int = function(a) {
  a = cljs.reader.re_matches_STAR_.call(null, cljs.reader.int_pattern, a);
  var b = a[2];
  if (null != (cljs.core._EQ_.call(null, b, "") ? null : b)) {
    return 0;
  }
  var b = cljs.core.truth_(a[3]) ? [a[3], 10] : cljs.core.truth_(a[4]) ? [a[4], 16] : cljs.core.truth_(a[5]) ? [a[5], 8] : cljs.core.truth_(a[6]) ? [a[7], parseInt(a[6], 10)] : [null, null], c = b[0];
  if (null == c) {
    return null;
  }
  b = parseInt(c, b[1]);
  return "-" === a[1] ? -b : b;
};
cljs.reader.match_ratio = function(a) {
  a = cljs.reader.re_matches_STAR_.call(null, cljs.reader.ratio_pattern, a);
  var b = a[2];
  return parseInt(a[1], 10) / parseInt(b, 10);
};
cljs.reader.match_float = function(a) {
  return parseFloat(a);
};
cljs.reader.match_number = function(a) {
  return cljs.core.truth_(cljs.reader.re_matches_STAR_.call(null, cljs.reader.int_pattern, a)) ? cljs.reader.match_int.call(null, a) : cljs.core.truth_(cljs.reader.re_matches_STAR_.call(null, cljs.reader.ratio_pattern, a)) ? cljs.reader.match_ratio.call(null, a) : cljs.core.truth_(cljs.reader.re_matches_STAR_.call(null, cljs.reader.float_pattern, a)) ? cljs.reader.match_float.call(null, a) : null;
};
cljs.reader.escape_char_map = function(a) {
  return "t" === a ? "\t" : "r" === a ? "\r" : "n" === a ? "\n" : "\\" === a ? "\\" : '"' === a ? '"' : "b" === a ? "\b" : "f" === a ? "\f" : null;
};
cljs.reader.read_2_chars = function(a) {
  return(new goog.string.StringBuffer(cljs.reader.read_char.call(null, a), cljs.reader.read_char.call(null, a))).toString();
};
cljs.reader.read_4_chars = function(a) {
  return(new goog.string.StringBuffer(cljs.reader.read_char.call(null, a), cljs.reader.read_char.call(null, a), cljs.reader.read_char.call(null, a), cljs.reader.read_char.call(null, a))).toString();
};
cljs.reader.unicode_2_pattern = cljs.core.re_pattern.call(null, "^[0-9A-Fa-f]{2}$");
cljs.reader.unicode_4_pattern = cljs.core.re_pattern.call(null, "^[0-9A-Fa-f]{4}$");
cljs.reader.validate_unicode_escape = function(a, b, c, d) {
  return cljs.core.truth_(cljs.core.re_matches.call(null, a, d)) ? d : cljs.reader.reader_error.call(null, b, "Unexpected unicode escape \\", c, d);
};
cljs.reader.make_unicode_char = function(a) {
  a = parseInt(a, 16);
  return String.fromCharCode(a);
};
cljs.reader.escape_char = function(a, b) {
  var c = cljs.reader.read_char.call(null, b), d = cljs.reader.escape_char_map.call(null, c);
  return cljs.core.truth_(d) ? d : "x" === c ? cljs.reader.make_unicode_char.call(null, cljs.reader.validate_unicode_escape.call(null, cljs.reader.unicode_2_pattern, b, c, cljs.reader.read_2_chars.call(null, b))) : "u" === c ? cljs.reader.make_unicode_char.call(null, cljs.reader.validate_unicode_escape.call(null, cljs.reader.unicode_4_pattern, b, c, cljs.reader.read_4_chars.call(null, b))) : cljs.reader.numeric_QMARK_.call(null, c) ? String.fromCharCode(c) : cljs.reader.reader_error.call(null, b, 
  "Unexpected unicode escape \\", c);
};
cljs.reader.read_past = function(a, b) {
  for (var c = cljs.reader.read_char.call(null, b);;) {
    if (cljs.core.truth_(a.call(null, c))) {
      c = cljs.reader.read_char.call(null, b);
    } else {
      return c;
    }
  }
};
cljs.reader.read_delimited_list = function(a, b, c) {
  for (var d = cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY);;) {
    var e = cljs.reader.read_past.call(null, cljs.reader.whitespace_QMARK_, b);
    cljs.core.truth_(e) || cljs.reader.reader_error.call(null, b, "EOF while reading");
    if (a === e) {
      return cljs.core.persistent_BANG_.call(null, d);
    }
    var f = cljs.reader.macros.call(null, e);
    cljs.core.truth_(f) ? e = f.call(null, b, e) : (cljs.reader.unread.call(null, b, e), e = cljs.reader.read.call(null, b, !0, null, c));
    d = e === b ? d : cljs.core.conj_BANG_.call(null, d, e);
  }
};
cljs.reader.not_implemented = function(a, b) {
  return cljs.reader.reader_error.call(null, a, "Reader for ", b, " not implemented yet");
};
cljs.reader.read_dispatch = function(a, b) {
  var c = cljs.reader.read_char.call(null, a), d = cljs.reader.dispatch_macros.call(null, c);
  if (cljs.core.truth_(d)) {
    return d.call(null, a, b);
  }
  d = cljs.reader.maybe_read_tagged_type.call(null, a, c);
  return cljs.core.truth_(d) ? d : cljs.reader.reader_error.call(null, a, "No dispatch macro for ", c);
};
cljs.reader.read_unmatched_delimiter = function(a, b) {
  return cljs.reader.reader_error.call(null, a, "Unmached delimiter ", b);
};
cljs.reader.read_list = function(a, b) {
  return cljs.core.apply.call(null, cljs.core.list, cljs.reader.read_delimited_list.call(null, ")", a, !0));
};
cljs.reader.read_comment = cljs.reader.skip_line;
cljs.reader.read_vector = function(a, b) {
  return cljs.reader.read_delimited_list.call(null, "]", a, !0);
};
cljs.reader.read_map = function(a, b) {
  var c = cljs.reader.read_delimited_list.call(null, "}", a, !0);
  cljs.core.odd_QMARK_.call(null, cljs.core.count.call(null, c)) && cljs.reader.reader_error.call(null, a, "Map literal must contain an even number of forms");
  return cljs.core.apply.call(null, cljs.core.hash_map, c);
};
cljs.reader.read_number = function(a, b) {
  for (var c = new goog.string.StringBuffer(b), d = cljs.reader.read_char.call(null, a);;) {
    if (cljs.core.truth_(function() {
      var a = null == d;
      return a ? a : (a = cljs.reader.whitespace_QMARK_.call(null, d)) ? a : cljs.reader.macros.call(null, d);
    }())) {
      cljs.reader.unread.call(null, a, d);
      var e = c.toString(), c = cljs.reader.match_number.call(null, e);
      return cljs.core.truth_(c) ? c : cljs.reader.reader_error.call(null, a, "Invalid number format [", e, "]");
    }
    c.append(d);
    d = e = cljs.reader.read_char.call(null, a);
  }
};
cljs.reader.read_string_STAR_ = function(a, b) {
  for (var c = new goog.string.StringBuffer, d = cljs.reader.read_char.call(null, a);;) {
    if (null == d) {
      return cljs.reader.reader_error.call(null, a, "EOF while reading");
    }
    if ("\\" === d) {
      c.append(cljs.reader.escape_char.call(null, c, a));
    } else {
      if ('"' === d) {
        return c.toString();
      }
      c.append(d);
    }
    d = cljs.reader.read_char.call(null, a);
  }
};
cljs.reader.read_raw_string_STAR_ = function(a, b) {
  for (var c = new goog.string.StringBuffer, d = cljs.reader.read_char.call(null, a);;) {
    if (null == d) {
      return cljs.reader.reader_error.call(null, a, "EOF while reading");
    }
    if ("\\" === d) {
      c.append(d);
      var e = cljs.reader.read_char.call(null, a);
      if (null == e) {
        return cljs.reader.reader_error.call(null, a, "EOF while reading");
      }
      var f = function() {
        var a = c;
        a.append(e);
        return a;
      }(), g = cljs.reader.read_char.call(null, a);
    } else {
      if ('"' === d) {
        return c.toString();
      }
      f = function() {
        var a = c;
        a.append(d);
        return a;
      }();
      g = cljs.reader.read_char.call(null, a);
    }
    c = f;
    d = g;
  }
};
cljs.reader.special_symbols = function(a, b) {
  return "nil" === a ? null : "true" === a ? !0 : "false" === a ? !1 : b;
};
cljs.reader.read_symbol = function(a, b) {
  var c = cljs.reader.read_token.call(null, a, b);
  return cljs.core.truth_(goog.string.contains(c, "/")) ? cljs.core.symbol.call(null, cljs.core.subs.call(null, c, 0, c.indexOf("/")), cljs.core.subs.call(null, c, c.indexOf("/") + 1, c.length)) : cljs.reader.special_symbols.call(null, c, cljs.core.symbol.call(null, c));
};
cljs.reader.read_keyword = function(a, b) {
  var c = cljs.reader.read_token.call(null, a, cljs.reader.read_char.call(null, a)), d = cljs.reader.re_matches_STAR_.call(null, cljs.reader.symbol_pattern, c), c = d[0], e = d[1], d = d[2];
  return void 0 !== e && ":/" === e.substring(e.length - 2, e.length) || ":" === d[d.length - 1] || -1 !== c.indexOf("::", 1) ? cljs.reader.reader_error.call(null, a, "Invalid token: ", c) : null != e && 0 < e.length ? cljs.core.keyword.call(null, e.substring(0, e.indexOf("/")), d) : cljs.core.keyword.call(null, c);
};
cljs.reader.desugar_meta = function(a) {
  return a instanceof cljs.core.Symbol ? new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "tag", "tag", -1290361223), a], null) : "string" === typeof a ? new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "tag", "tag", -1290361223), a], null) : a instanceof cljs.core.Keyword ? new cljs.core.PersistentArrayMap.fromArray([a, !0], !0, !1) : a;
};
cljs.reader.wrapping_reader = function(a) {
  return function(b, c) {
    return cljs.core._conj.call(null, cljs.core._conj.call(null, cljs.core.List.EMPTY, cljs.reader.read.call(null, b, !0, null, !0)), a);
  };
};
cljs.reader.throwing_reader = function(a) {
  return function(b, c) {
    return cljs.reader.reader_error.call(null, b, a);
  };
};
cljs.reader.read_meta = function(a, b) {
  var c = cljs.reader.desugar_meta.call(null, cljs.reader.read.call(null, a, !0, null, !0));
  cljs.core.map_QMARK_.call(null, c) || cljs.reader.reader_error.call(null, a, "Metadata must be Symbol,Keyword,String or Map");
  var d = cljs.reader.read.call(null, a, !0, null, !0);
  return(d ? d.cljs$lang$protocol_mask$partition0$ & 262144 || d.cljs$core$IWithMeta$ || (d.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IWithMeta, d)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IWithMeta, d)) ? cljs.core.with_meta.call(null, d, cljs.core.merge.call(null, cljs.core.meta.call(null, d), c)) : cljs.reader.reader_error.call(null, a, "Metadata can only be applied to IWithMetas");
};
cljs.reader.read_set = function(a, b) {
  return cljs.core.set.call(null, cljs.reader.read_delimited_list.call(null, "}", a, !0));
};
cljs.reader.read_regex = function(a, b) {
  return cljs.core.re_pattern.call(null, cljs.reader.read_raw_string_STAR_.call(null, a, b));
};
cljs.reader.read_discard = function(a, b) {
  cljs.reader.read.call(null, a, !0, null, !0);
  return a;
};
cljs.reader.macros = function(a) {
  return'"' === a ? cljs.reader.read_string_STAR_ : ":" === a ? cljs.reader.read_keyword : ";" === a ? cljs.reader.read_comment : "'" === a ? cljs.reader.wrapping_reader.call(null, new cljs.core.Symbol(null, "quote", "quote", 1377916282, null)) : "@" === a ? cljs.reader.wrapping_reader.call(null, new cljs.core.Symbol(null, "deref", "deref", 1494944732, null)) : "^" === a ? cljs.reader.read_meta : "`" === a ? cljs.reader.not_implemented : "~" === a ? cljs.reader.not_implemented : "(" === a ? cljs.reader.read_list : 
  ")" === a ? cljs.reader.read_unmatched_delimiter : "[" === a ? cljs.reader.read_vector : "]" === a ? cljs.reader.read_unmatched_delimiter : "{" === a ? cljs.reader.read_map : "}" === a ? cljs.reader.read_unmatched_delimiter : "\\" === a ? cljs.reader.read_char : "#" === a ? cljs.reader.read_dispatch : null;
};
cljs.reader.dispatch_macros = function(a) {
  return "{" === a ? cljs.reader.read_set : "\x3c" === a ? cljs.reader.throwing_reader.call(null, "Unreadable form") : '"' === a ? cljs.reader.read_regex : "!" === a ? cljs.reader.read_comment : "_" === a ? cljs.reader.read_discard : null;
};
cljs.reader.read = function(a, b, c, d) {
  for (;;) {
    d = cljs.reader.read_char.call(null, a);
    if (null == d) {
      return cljs.core.truth_(b) ? cljs.reader.reader_error.call(null, a, "EOF while reading") : c;
    }
    if (!cljs.reader.whitespace_QMARK_.call(null, d)) {
      if (cljs.reader.comment_prefix_QMARK_.call(null, d)) {
        a = cljs.reader.read_comment.call(null, a, d);
      } else {
        var e = cljs.reader.macros.call(null, d);
        d = cljs.core.truth_(e) ? e.call(null, a, d) : cljs.reader.number_literal_QMARK_.call(null, a, d) ? cljs.reader.read_number.call(null, a, d) : cljs.reader.read_symbol.call(null, a, d);
        if (d !== a) {
          return d;
        }
      }
    }
  }
};
cljs.reader.read_string = function(a) {
  a = cljs.reader.push_back_reader.call(null, a);
  return cljs.reader.read.call(null, a, !1, null, !1);
};
cljs.reader.zero_fill_right_and_truncate = function(a, b) {
  if (cljs.core._EQ_.call(null, b, cljs.core.count.call(null, a))) {
    return a;
  }
  if (b < cljs.core.count.call(null, a)) {
    return cljs.core.subs.call(null, a, 0, b);
  }
  for (var c = new goog.string.StringBuffer(a);;) {
    if (c.getLength() < b) {
      c = c.append("0");
    } else {
      return c.toString();
    }
  }
};
cljs.reader.divisible_QMARK_ = function(a, b) {
  return 0 === cljs.core.mod.call(null, a, b);
};
cljs.reader.indivisible_QMARK_ = function(a, b) {
  return!cljs.reader.divisible_QMARK_.call(null, a, b);
};
cljs.reader.leap_year_QMARK_ = function(a) {
  return cljs.reader.divisible_QMARK_.call(null, a, 4) && (cljs.reader.indivisible_QMARK_.call(null, a, 100) || cljs.reader.divisible_QMARK_.call(null, a, 400));
};
cljs.reader.days_in_month = function() {
  var a = new cljs.core.PersistentVector(null, 13, 5, cljs.core.PersistentVector.EMPTY_NODE, [null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], null), b = new cljs.core.PersistentVector(null, 13, 5, cljs.core.PersistentVector.EMPTY_NODE, [null, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], null);
  return function(a, b) {
    return function(e, f) {
      return cljs.core.get.call(null, cljs.core.truth_(f) ? b : a, e);
    };
  }(a, b);
}();
cljs.reader.timestamp_regex = /(\d\d\d\d)(?:-(\d\d)(?:-(\d\d)(?:[T](\d\d)(?::(\d\d)(?::(\d\d)(?:[.](\d+))?)?)?)?)?)?(?:[Z]|([-+])(\d\d):(\d\d))?/;
cljs.reader.parse_int = function(a) {
  a = parseInt(a, 10);
  return cljs.core.not.call(null, isNaN(a)) ? a : null;
};
cljs.reader.check = function(a, b, c, d) {
  a <= b && b <= c || cljs.reader.reader_error.call(null, null, "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(d) + " Failed:  " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a) + "\x3c\x3d" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(b) + "\x3c\x3d" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(c));
  return b;
};
cljs.reader.parse_and_validate_timestamp = function(a) {
  var b = cljs.core.re_matches.call(null, cljs.reader.timestamp_regex, a);
  cljs.core.nth.call(null, b, 0, null);
  var c = cljs.core.nth.call(null, b, 1, null), d = cljs.core.nth.call(null, b, 2, null), e = cljs.core.nth.call(null, b, 3, null), f = cljs.core.nth.call(null, b, 4, null), g = cljs.core.nth.call(null, b, 5, null), h = cljs.core.nth.call(null, b, 6, null), k = cljs.core.nth.call(null, b, 7, null), l = cljs.core.nth.call(null, b, 8, null), m = cljs.core.nth.call(null, b, 9, null), n = cljs.core.nth.call(null, b, 10, null);
  if (cljs.core.not.call(null, b)) {
    return cljs.reader.reader_error.call(null, null, "Unrecognized date/time syntax: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a));
  }
  a = cljs.reader.parse_int.call(null, c);
  var b = function() {
    var a = cljs.reader.parse_int.call(null, d);
    return cljs.core.truth_(a) ? a : 1;
  }(), c = function() {
    var a = cljs.reader.parse_int.call(null, e);
    return cljs.core.truth_(a) ? a : 1;
  }(), p = function() {
    var a = cljs.reader.parse_int.call(null, f);
    return cljs.core.truth_(a) ? a : 0;
  }(), q = function() {
    var a = cljs.reader.parse_int.call(null, g);
    return cljs.core.truth_(a) ? a : 0;
  }(), r = function() {
    var a = cljs.reader.parse_int.call(null, h);
    return cljs.core.truth_(a) ? a : 0;
  }(), s = function() {
    var a = cljs.reader.parse_int.call(null, cljs.reader.zero_fill_right_and_truncate.call(null, k, 3));
    return cljs.core.truth_(a) ? a : 0;
  }(), l = cljs.core._EQ_.call(null, l, "-") ? -1 : 1, t = function() {
    var a = cljs.reader.parse_int.call(null, m);
    return cljs.core.truth_(a) ? a : 0;
  }(), u = function() {
    var a = cljs.reader.parse_int.call(null, n);
    return cljs.core.truth_(a) ? a : 0;
  }(), l = l * (60 * t + u);
  return new cljs.core.PersistentVector(null, 8, 5, cljs.core.PersistentVector.EMPTY_NODE, [a, cljs.reader.check.call(null, 1, b, 12, "timestamp month field must be in range 1..12"), cljs.reader.check.call(null, 1, c, cljs.reader.days_in_month.call(null, b, cljs.reader.leap_year_QMARK_.call(null, a)), "timestamp day field must be in range 1..last day in month"), cljs.reader.check.call(null, 0, p, 23, "timestamp hour field must be in range 0..23"), cljs.reader.check.call(null, 0, q, 59, "timestamp minute field must be in range 0..59"), 
  cljs.reader.check.call(null, 0, r, cljs.core._EQ_.call(null, q, 59) ? 60 : 59, "timestamp second field must be in range 0..60"), cljs.reader.check.call(null, 0, s, 999, "timestamp millisecond field must be in range 0..999"), l], null);
};
cljs.reader.parse_timestamp = function(a) {
  var b = cljs.reader.parse_and_validate_timestamp.call(null, a);
  if (cljs.core.truth_(b)) {
    a = cljs.core.nth.call(null, b, 0, null);
    var c = cljs.core.nth.call(null, b, 1, null), d = cljs.core.nth.call(null, b, 2, null), e = cljs.core.nth.call(null, b, 3, null), f = cljs.core.nth.call(null, b, 4, null), g = cljs.core.nth.call(null, b, 5, null), h = cljs.core.nth.call(null, b, 6, null), b = cljs.core.nth.call(null, b, 7, null);
    return new Date(Date.UTC(a, c - 1, d, e, f, g, h) - 6E4 * b);
  }
  return cljs.reader.reader_error.call(null, null, "Unrecognized date/time syntax: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a));
};
cljs.reader.read_date = function(a) {
  return "string" === typeof a ? cljs.reader.parse_timestamp.call(null, a) : cljs.reader.reader_error.call(null, null, "Instance literal expects a string for its timestamp.");
};
cljs.reader.read_queue = function(a) {
  return cljs.core.vector_QMARK_.call(null, a) ? cljs.core.into.call(null, cljs.core.PersistentQueue.EMPTY, a) : cljs.reader.reader_error.call(null, null, "Queue literal expects a vector for its elements.");
};
cljs.reader.read_js = function(a) {
  if (cljs.core.vector_QMARK_.call(null, a)) {
    var b = [];
    a = cljs.core.seq.call(null, a);
    for (var c = null, d = 0, e = 0;;) {
      if (e < d) {
        var f = cljs.core._nth.call(null, c, e);
        b.push(f);
        e += 1;
      } else {
        if (a = cljs.core.seq.call(null, a)) {
          c = a, cljs.core.chunked_seq_QMARK_.call(null, c) ? (a = cljs.core.chunk_first.call(null, c), e = cljs.core.chunk_rest.call(null, c), c = a, d = cljs.core.count.call(null, a), a = e) : (a = cljs.core.first.call(null, c), b.push(a), a = cljs.core.next.call(null, c), c = null, d = 0), e = 0;
        } else {
          break;
        }
      }
    }
    return b;
  }
  if (cljs.core.map_QMARK_.call(null, a)) {
    b = {};
    a = cljs.core.seq.call(null, a);
    c = null;
    for (e = d = 0;;) {
      if (e < d) {
        var g = cljs.core._nth.call(null, c, e), f = cljs.core.nth.call(null, g, 0, null), g = cljs.core.nth.call(null, g, 1, null);
        b[cljs.core.name.call(null, f)] = g;
        e += 1;
      } else {
        if (a = cljs.core.seq.call(null, a)) {
          cljs.core.chunked_seq_QMARK_.call(null, a) ? (d = cljs.core.chunk_first.call(null, a), a = cljs.core.chunk_rest.call(null, a), c = d, d = cljs.core.count.call(null, d)) : (d = cljs.core.first.call(null, a), c = cljs.core.nth.call(null, d, 0, null), d = cljs.core.nth.call(null, d, 1, null), b[cljs.core.name.call(null, c)] = d, a = cljs.core.next.call(null, a), c = null, d = 0), e = 0;
        } else {
          break;
        }
      }
    }
    return b;
  }
  return cljs.reader.reader_error.call(null, null, "JS literal expects a vector or map containing only string or unqualified keyword keys");
};
cljs.reader.read_uuid = function(a) {
  return "string" === typeof a ? new cljs.core.UUID(a) : cljs.reader.reader_error.call(null, null, "UUID literal expects a string as its representation.");
};
cljs.reader._STAR_tag_table_STAR_ = cljs.core.atom.call(null, new cljs.core.PersistentArrayMap(null, 4, ["inst", cljs.reader.read_date, "uuid", cljs.reader.read_uuid, "queue", cljs.reader.read_queue, "js", cljs.reader.read_js], null));
cljs.reader._STAR_default_data_reader_fn_STAR_ = cljs.core.atom.call(null, null);
cljs.reader.maybe_read_tagged_type = function(a, b) {
  var c = cljs.reader.read_symbol.call(null, a, b), d = cljs.core.get.call(null, cljs.core.deref.call(null, cljs.reader._STAR_tag_table_STAR_), "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(c)), e = cljs.core.deref.call(null, cljs.reader._STAR_default_data_reader_fn_STAR_);
  return cljs.core.truth_(d) ? d.call(null, cljs.reader.read.call(null, a, !0, null, !1)) : cljs.core.truth_(e) ? e.call(null, c, cljs.reader.read.call(null, a, !0, null, !1)) : cljs.reader.reader_error.call(null, a, "Could not find tag parser for ", "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(c), " in ", cljs.core.pr_str.call(null, cljs.core.keys.call(null, cljs.core.deref.call(null, cljs.reader._STAR_tag_table_STAR_))));
};
cljs.reader.register_tag_parser_BANG_ = function(a, b) {
  var c = "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a), d = cljs.core.get.call(null, cljs.core.deref.call(null, cljs.reader._STAR_tag_table_STAR_), c);
  cljs.core.swap_BANG_.call(null, cljs.reader._STAR_tag_table_STAR_, cljs.core.assoc, c, b);
  return d;
};
cljs.reader.deregister_tag_parser_BANG_ = function(a) {
  a = "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a);
  var b = cljs.core.get.call(null, cljs.core.deref.call(null, cljs.reader._STAR_tag_table_STAR_), a);
  cljs.core.swap_BANG_.call(null, cljs.reader._STAR_tag_table_STAR_, cljs.core.dissoc, a);
  return b;
};
cljs.reader.register_default_tag_parser_BANG_ = function(a) {
  var b = cljs.core.deref.call(null, cljs.reader._STAR_default_data_reader_fn_STAR_);
  cljs.core.swap_BANG_.call(null, cljs.reader._STAR_default_data_reader_fn_STAR_, function(b) {
    return function(b) {
      return a;
    };
  }(b));
  return b;
};
cljs.reader.deregister_default_tag_parser_BANG_ = function() {
  var a = cljs.core.deref.call(null, cljs.reader._STAR_default_data_reader_fn_STAR_);
  cljs.core.swap_BANG_.call(null, cljs.reader._STAR_default_data_reader_fn_STAR_, function(a) {
    return function(a) {
      return null;
    };
  }(a));
  return a;
};
var dreiser = {core:{}};
cljs.core.enable_console_print_BANG_.call(null);
dreiser.core.plans = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null, "medium", "medium", -1864319384), new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null, "id", "id", -1388402092), "medium", new cljs.core.Keyword(null, "price", "price", 22129180), 10, new cljs.core.Keyword(null, "name", "name", 1843675177), "Micro", new cljs.core.Keyword(null, "features", "features", -1146962336), new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, 
["products"], null)], null), new cljs.core.Keyword(null, "large", "large", -196820544), new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null, "id", "id", -1388402092), "large", new cljs.core.Keyword(null, "price", "price", 22129180), 19, new cljs.core.Keyword(null, "name", "name", 1843675177), "Shop", new cljs.core.Keyword(null, "features", "features", -1146962336), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["products", "pages"], null)], null), 
new cljs.core.Keyword(null, "extra", "extra", 1612569067), new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null, "id", "id", -1388402092), "extra", new cljs.core.Keyword(null, "price", "price", 22129180), 25, new cljs.core.Keyword(null, "name", "name", 1843675177), "Business", new cljs.core.Keyword(null, "features", "features", -1146962336), new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["products", "pages", "blog posts"], null)], null)], null);
dreiser.core.langs = new cljs.core.PersistentArrayMap(null, 6, ["AmericanEnglish", new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "name", "name", 1843675177), "American English"], null), "AustralianEnglish", new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "name", "name", 1843675177), "Australian English"], null), "BritishEnglish", new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "name", "name", 1843675177), "British English"], null), 
"CanadianEnglish", new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "name", "name", 1843675177), "Canadian English"], null), "NewZealandEnglish", new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "name", "name", 1843675177), "New Zealand English"], null), "SouthAfricanEnglish", new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "name", "name", 1843675177), "South African English"], null)], null);
dreiser.core.meths = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null, "get", "get", 1683182755), "GET", new cljs.core.Keyword(null, "put", "put", 1299772570), "PUT", new cljs.core.Keyword(null, "post", "post", 269697687), "POST", new cljs.core.Keyword(null, "delete", "delete", -1768633620), "DELETE"], null);
dreiser.core.edn_xhr = function(a) {
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, c = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "on-error", "on-error", 1728533530)), d = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "on-complete", "on-complete", -1531183971)), e = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "data", "data", -232669377)), f = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "url", "url", 276297046)), g = cljs.core.get.call(null, 
  b, new cljs.core.Keyword(null, "method", "method", 55703592)), h = new goog.net.XhrIo;
  goog.events.listen(h, goog.net.EventType.COMPLETE, function(a, b, c, d, e, f, g, h) {
    return function(b) {
      return e.call(null, cljs.reader.read_string.call(null, a.getResponseText()));
    };
  }(h, a, b, c, d, e, f, g));
  goog.events.listen(h, goog.net.EventType.ERROR, function(a, b, c, d, e, f, g, h) {
    return function(b) {
      return d.call(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "error", "error", -978969032), a.getResponseText()], null));
    };
  }(h, a, b, c, d, e, f, g));
  return h.send(f, dreiser.core.meths.call(null, g), cljs.core.truth_(e) ? cljs.core.pr_str.call(null, e) : null, {"Content-Type":"application/edn"});
};
dreiser.core.build_shopify_link = function(a, b) {
  var c = (new cljs.core.Keyword("shopify.resources", "type", "shopify.resources/type", -405197047)).cljs$core$IFn$_invoke$arity$1(b);
  if (cljs.core._EQ_.call(null, "default", c)) {
    return "";
  }
  if (cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "article", "article", -21685045), c)) {
    return "https://" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a) + "/admin/blogs/" + cljs.core.str.cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, "blog-id", "blog-id", 109948111)).cljs$core$IFn$_invoke$arity$1(b)) + "/articles/" + cljs.core.str.cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, "id", "id", -1388402092)).cljs$core$IFn$_invoke$arity$1(b));
  }
  if (cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "page", "page", 849072397), c)) {
    return "https://" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a) + "/admin/pages/" + cljs.core.str.cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, "id", "id", -1388402092)).cljs$core$IFn$_invoke$arity$1(b));
  }
  if (cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "product", "product", 1363474257), c)) {
    return "https://" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(a) + "/admin/products/" + cljs.core.str.cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, "id", "id", -1388402092)).cljs$core$IFn$_invoke$arity$1(b));
  }
  throw Error("No matching clause: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword("shopify.resources", "type", "shopify.resources/type", -405197047)).cljs$core$IFn$_invoke$arity$1(b)));
};
dreiser.core.app_state = cljs.core.atom.call(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "shop", "shop", -823644406), new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null, "products-num", "products-num", 38406584), 0, new cljs.core.Keyword(null, "pages-num", "pages-num", 1575073779), 0, new cljs.core.Keyword(null, "articles-num", "articles-num", -1898105774), 0], null), new cljs.core.Keyword(null, "reports", "reports", 1629311767), cljs.core.PersistentArrayMap.EMPTY], 
null));
dreiser.core.start_progress = function() {
  return NProgress.start();
};
dreiser.core.stop_progress = function() {
  return NProgress.done();
};
dreiser.core.start_check_button_click = function(a) {
  dreiser.core.start_progress.call(null);
  return dreiser.core.edn_xhr.call(null, new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null, "method", "method", 55703592), new cljs.core.Keyword(null, "post", "post", 269697687), new cljs.core.Keyword(null, "url", "url", 276297046), "/start", new cljs.core.Keyword(null, "on-error", "on-error", 1728533530), function(a) {
    return setTimeout(function() {
      return window.location.reload();
    }, 3E4);
  }, new cljs.core.Keyword(null, "on-complete", "on-complete", -1531183971), function(b) {
    dreiser.core.stop_progress.call(null);
    return om.core.transact_BANG_.call(null, a, new cljs.core.Keyword(null, "reports", "reports", 1629311767), function(a) {
      return b;
    });
  }], null));
};
dreiser.core.start_check_button = function start_check_button(b, c) {
  "undefined" === typeof dreiser.core.t7665 && (dreiser.core.t7665 = function(b, c, f, g) {
    this.owner = b;
    this.app = c;
    this.start_check_button = f;
    this.meta7666 = g;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216;
  }, dreiser.core.t7665.cljs$lang$type = !0, dreiser.core.t7665.cljs$lang$ctorStr = "dreiser.core/t7665", dreiser.core.t7665.cljs$lang$ctorPrWriter = function(b, c, f) {
    return cljs.core._write.call(null, c, "dreiser.core/t7665");
  }, dreiser.core.t7665.prototype.om$core$IRenderState$ = !0, dreiser.core.t7665.prototype.om$core$IRenderState$render_state$arity$2 = function(b, c) {
    var f = this;
    return React.DOM.div({className:"col-xs-8 center-block start-panel"}, React.DOM.div({className:"text-center"}, React.DOM.h3(null, "Thanks for joining!"), React.DOM.h4(null, "We are going to automatically proof-read your Shopify text content."), React.DOM.p(null, "Select language, press Start Check and comeback in few minutes."), cljs.core.apply.call(null, om.dom.select, null, cljs.core.map.call(null, function(b) {
      return function(b, c) {
        return om.dom.option.call(null, null, (new cljs.core.Keyword(null, "name", "name", 1843675177)).cljs$core$IFn$_invoke$arity$1(cljs.core.val.call(null, b)));
      };
    }(this), dreiser.core.langs)), React.DOM.button({onClick:function(b) {
      return function() {
        return dreiser.core.start_check_button_click.call(null, f.app);
      };
    }(this), className:"button success", id:"start-check-button"}, "Start check")));
  }, dreiser.core.t7665.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta7666;
  }, dreiser.core.t7665.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
    return new dreiser.core.t7665(this.owner, this.app, this.start_check_button, c);
  }, dreiser.core.__GT_t7665 = function(b, c, f, g) {
    return new dreiser.core.t7665(b, c, f, g);
  });
  return new dreiser.core.t7665(c, b, start_check_button, null);
};
dreiser.core.render_pricing_block = function(a) {
  return React.DOM.ul({className:"pricing-table col-xs-12 col-md-4 fly-in-animation"}, React.DOM.li({className:"title"}, (new cljs.core.Keyword(null, "name", "name", 1843675177)).cljs$core$IFn$_invoke$arity$1(a)), React.DOM.li({className:"description"}, React.DOM.strong(null, "check"), React.DOM.span(null, clojure.string.join.call(null, ", ", (new cljs.core.Keyword(null, "features", "features", -1146962336)).cljs$core$IFn$_invoke$arity$1(a)))), React.DOM.li({className:"bullet-item"}, "Daily reports"), 
  React.DOM.li({className:"bullet-item"}, "Support via email"), React.DOM.li({className:"price"}, React.DOM.strong(null, (new cljs.core.Keyword(null, "price", "price", 22129180)).cljs$core$IFn$_invoke$arity$1(a)), React.DOM.p(null, "USD/month")), React.DOM.li({className:"cta-button"}, React.DOM.a({href:"/shopify/payment?plan\x3d" + cljs.core.str.cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, "id", "id", -1388402092)).cljs$core$IFn$_invoke$arity$1(a)), className:"button green-button"}, 
  "Subscribe")));
};
dreiser.core.render_all_pricing = function render_all_pricing() {
  new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [dreiser.core.app, dreiser.core.owner], null);
  "undefined" === typeof dreiser.core.t7671 && (dreiser.core.t7671 = function(b, c) {
    this.render_all_pricing = b;
    this.meta7672 = c;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216;
  }, dreiser.core.t7671.cljs$lang$type = !0, dreiser.core.t7671.cljs$lang$ctorStr = "dreiser.core/t7671", dreiser.core.t7671.cljs$lang$ctorPrWriter = function(b, c, d) {
    return cljs.core._write.call(null, c, "dreiser.core/t7671");
  }, dreiser.core.t7671.prototype.om$core$IRenderState$ = !0, dreiser.core.t7671.prototype.om$core$IRenderState$render_state$arity$2 = function(b, c) {
    return React.DOM.div({className:"pricing-block white-block"}, React.DOM.div({className:"row"}, React.DOM.header({className:"text-center col-xs-12"}, React.DOM.h2(null, "Pricing"), React.DOM.p(null, "Please select your plan. We have 30 days money back guarantee.")), cljs.core.apply.call(null, om.dom.div, null, cljs.core.map.call(null, function(b) {
      return function(b) {
        return dreiser.core.render_pricing_block.call(null, cljs.core.val.call(null, b));
      };
    }(this), dreiser.core.plans))));
  }, dreiser.core.t7671.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta7672;
  }, dreiser.core.t7671.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
    return new dreiser.core.t7671(this.render_all_pricing, c);
  }, dreiser.core.__GT_t7671 = function(b, c) {
    return new dreiser.core.t7671(b, c);
  });
  return new dreiser.core.t7671(render_all_pricing, null);
};
dreiser.core.htmlify_str = function(a) {
  return null == a ? "" : clojure.string.replace.call(null, a, /\n/, "\x3cbr\x3e");
};
dreiser.core.resource_report = function resource_report(b, c) {
  "undefined" === typeof dreiser.core.t7677 && (dreiser.core.t7677 = function(b, c, f, g) {
    this.owner = b;
    this.data = c;
    this.resource_report = f;
    this.meta7678 = g;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216;
  }, dreiser.core.t7677.cljs$lang$type = !0, dreiser.core.t7677.cljs$lang$ctorStr = "dreiser.core/t7677", dreiser.core.t7677.cljs$lang$ctorPrWriter = function(b, c, f) {
    return cljs.core._write.call(null, c, "dreiser.core/t7677");
  }, dreiser.core.t7677.prototype.om$core$IRenderState$ = !0, dreiser.core.t7677.prototype.om$core$IRenderState$render_state$arity$2 = function(b, c) {
    var f = cljs.core.first.call(null, this.data), g = cljs.core.second.call(null, this.data), h = cljs.core.nth.call(null, this.data, 2, cljs.core.PersistentVector.EMPTY), k = cljs.core.nth.call(null, this.data, 3, 0), l = cljs.core.first.call(null, cljs.core.filter.call(null, function(b, c, d, e, f) {
      return function(b) {
        return cljs.core._EQ_.call(null, "title", cljs.core.first.call(null, b));
      };
    }(f, g, h, k, this), h)), f = cljs.core.first.call(null, cljs.core.filter.call(null, function(b, c, d, e, f, g) {
      return function(b) {
        return cljs.core._EQ_.call(null, "description", cljs.core.first.call(null, b)) || cljs.core._EQ_.call(null, "content", cljs.core.first.call(null, b));
      };
    }(f, g, h, k, l, this), h)), f = dreiser.core.htmlify_str.call(null, cljs.core.second.call(null, f)), h = (new cljs.core.Keyword(null, "shopname", "shopname", -911713205)).cljs$core$IFn$_invoke$arity$1(om.core.get_state.call(null, this.owner)), h = dreiser.core.build_shopify_link.call(null, h, g);
    return React.DOM.li({className:"resource-report"}, React.DOM.div(null, React.DOM.span({title:"Number of warnings", className:"label label-warning pull-right"}, k), React.DOM.h4(null, React.DOM.a({dangerouslySetInnerHTML:{__html:(new cljs.core.Keyword(null, "title", "title", 636505583)).cljs$core$IFn$_invoke$arity$1(g)}, href:h})), React.DOM.div({dangerouslySetInnerHTML:{__html:f}, className:"report-property-content"})));
  }, dreiser.core.t7677.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta7678;
  }, dreiser.core.t7677.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
    return new dreiser.core.t7677(this.owner, this.data, this.resource_report, c);
  }, dreiser.core.__GT_t7677 = function(b, c, f, g) {
    return new dreiser.core.t7677(b, c, f, g);
  });
  return new dreiser.core.t7677(c, b, resource_report, null);
};
dreiser.core.render_reports_list = function(a, b) {
  return cljs.core.apply.call(null, om.dom.ul, null, cljs.core.map.call(null, function(a) {
    return om.core.build.call(null, dreiser.core.resource_report, a, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "state", "state", -1988618099), new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "shopname", "shopname", -911713205), (new cljs.core.Keyword(null, "shop", "shop", -823644406)).cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, "shop", "shop", -823644406)).cljs$core$IFn$_invoke$arity$1(b))], null)], null));
  }, (new cljs.core.Keyword(null, "reports", "reports", 1629311767)).cljs$core$IFn$_invoke$arity$1(cljs.core.get.call(null, (new cljs.core.Keyword(null, "reports", "reports", 1629311767)).cljs$core$IFn$_invoke$arity$1(b), a))));
};
dreiser.core.render_tab_header = function(a, b, c, d, e) {
  return React.DOM.a({"data-toggle":"tab", href:b}, React.DOM.span(null, c), React.DOM.span({className:"badge"}, (new cljs.core.Keyword(null, "num-of-errors", "num-of-errors", 41388829)).cljs$core$IFn$_invoke$arity$1(cljs.core.get.call(null, (new cljs.core.Keyword(null, "reports", "reports", 1629311767)).cljs$core$IFn$_invoke$arity$1(a), d))));
};
dreiser.core.reports_groups = function reports_groups(b, c) {
  "undefined" === typeof dreiser.core.t7683 && (dreiser.core.t7683 = function(b, c, f, g) {
    this.owner = b;
    this.app = c;
    this.reports_groups = f;
    this.meta7684 = g;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216;
  }, dreiser.core.t7683.cljs$lang$type = !0, dreiser.core.t7683.cljs$lang$ctorStr = "dreiser.core/t7683", dreiser.core.t7683.cljs$lang$ctorPrWriter = function(b, c, f) {
    return cljs.core._write.call(null, c, "dreiser.core/t7683");
  }, dreiser.core.t7683.prototype.om$core$IRenderState$ = !0, dreiser.core.t7683.prototype.om$core$IRenderState$render_state$arity$2 = function(b, c) {
    var f = this;
    return React.DOM.div({className:"col-xs-12"}, React.DOM.ul({className:"nav nav-pills"}, React.DOM.li({className:"active"}, dreiser.core.render_tab_header.call(null, f.app, "#products-report", "Products", new cljs.core.Keyword(null, "product", "product", 1363474257), new cljs.core.Keyword(null, "products-num", "products-num", 38406584))), React.DOM.li(null, dreiser.core.render_tab_header.call(null, f.app, "#pages-report", "Pages", new cljs.core.Keyword(null, "page", "page", 849072397), new cljs.core.Keyword(null, 
    "pages-num", "pages-num", 1575073779))), React.DOM.li(null, dreiser.core.render_tab_header.call(null, f.app, "#articles-report", "Articles", new cljs.core.Keyword(null, "article", "article", -21685045), new cljs.core.Keyword(null, "articles-num", "articles-num", -1898105774)))), React.DOM.div({className:"tab-content"}, React.DOM.div({className:"tab-pane active", id:"products-report"}, React.DOM.div({className:"alert alert-warning"}, React.DOM.p(null, "Below are the list of products' descriptions with possible errors. Please review them")), 
    dreiser.core.render_reports_list.call(null, new cljs.core.Keyword(null, "product", "product", 1363474257), f.app)), React.DOM.div({className:"tab-pane", id:"pages-report"}, cljs.core._EQ_.call(null, (new cljs.core.Keyword(null, "plan", "plan", 1118952668)).cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, "shop", "shop", -823644406)).cljs$core$IFn$_invoke$arity$1(f.app)), "large") || cljs.core._EQ_.call(null, (new cljs.core.Keyword(null, "plan", "plan", 1118952668)).cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, 
    "shop", "shop", -823644406)).cljs$core$IFn$_invoke$arity$1(f.app)), "extra") ? function() {
      React.DOM.div({className:"alert alert-warning"}, React.DOM.p(null, "Below are the list of pages' contents with possible errors. Please review them"));
      return dreiser.core.render_reports_list.call(null, new cljs.core.Keyword(null, "page", "page", 849072397), f.app);
    }() : React.DOM.div({className:"alert alert-warning"}, React.DOM.p(null, "You are on the ", (new cljs.core.Keyword(null, "plan", "plan", 1118952668)).cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, "shop", "shop", -823644406)).cljs$core$IFn$_invoke$arity$1(f.app)), " plan. Please upgrade to get report about your pages content"))), React.DOM.div({className:"tab-pane", id:"articles-report"}, cljs.core._EQ_.call(null, (new cljs.core.Keyword(null, "plan", "plan", 1118952668)).cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, 
    "shop", "shop", -823644406)).cljs$core$IFn$_invoke$arity$1(f.app)), "extra") ? function() {
      React.DOM.div({className:"alert alert-warning"}, React.DOM.p(null, "Below are the list of blog posts' contents with possible errors. Please review them"));
      return dreiser.core.render_reports_list.call(null, new cljs.core.Keyword(null, "article", "article", -21685045), f.app);
    }() : React.DOM.div({className:"alert alert-warning"}, React.DOM.p(null, "You are on the ", (new cljs.core.Keyword(null, "plan", "plan", 1118952668)).cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, "shop", "shop", -823644406)).cljs$core$IFn$_invoke$arity$1(f.app)), " plan. Please upgrade to get report about your blog posts content")))));
  }, dreiser.core.t7683.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta7684;
  }, dreiser.core.t7683.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
    return new dreiser.core.t7683(this.owner, this.app, this.reports_groups, c);
  }, dreiser.core.__GT_t7683 = function(b, c, f, g) {
    return new dreiser.core.t7683(b, c, f, g);
  });
  return new dreiser.core.t7683(c, b, reports_groups, null);
};
dreiser.core.reports_view = function reports_view(b, c) {
  "undefined" === typeof dreiser.core.t7689 && (dreiser.core.t7689 = function(b, c, f, g) {
    this.owner = b;
    this.app = c;
    this.reports_view = f;
    this.meta7690 = g;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216;
  }, dreiser.core.t7689.cljs$lang$type = !0, dreiser.core.t7689.cljs$lang$ctorStr = "dreiser.core/t7689", dreiser.core.t7689.cljs$lang$ctorPrWriter = function(b, c, f) {
    return cljs.core._write.call(null, c, "dreiser.core/t7689");
  }, dreiser.core.t7689.prototype.om$core$IRenderState$ = !0, dreiser.core.t7689.prototype.om$core$IRenderState$render_state$arity$2 = function(b, c) {
    return React.DOM.div({className:"row"}, null != (new cljs.core.Keyword(null, "shopify_id", "shopify_id", 1154983288)).cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, "shop", "shop", -823644406)).cljs$core$IFn$_invoke$arity$1(this.app)) ? null == (new cljs.core.Keyword(null, "charge_id", "charge_id", 473562705)).cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, "shop", "shop", -823644406)).cljs$core$IFn$_invoke$arity$1(this.app)) ? cljs.core.empty_QMARK_.call(null, (new cljs.core.Keyword(null, 
    "reports", "reports", 1629311767)).cljs$core$IFn$_invoke$arity$1(this.app)) || cljs.core.empty_QMARK_.call(null, (new cljs.core.Keyword(null, "reports", "reports", 1629311767)).cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, "product", "product", 1363474257)).cljs$core$IFn$_invoke$arity$1((new cljs.core.Keyword(null, "reports", "reports", 1629311767)).cljs$core$IFn$_invoke$arity$1(this.app)))) ? om.core.build.call(null, dreiser.core.start_check_button, this.app) : om.core.build.call(null, 
    dreiser.core.reports_groups, this.app) : React.DOM.div(null) : null);
  }, dreiser.core.t7689.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta7690;
  }, dreiser.core.t7689.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
    return new dreiser.core.t7689(this.owner, this.app, this.reports_view, c);
  }, dreiser.core.__GT_t7689 = function(b, c, f, g) {
    return new dreiser.core.t7689(b, c, f, g);
  });
  return new dreiser.core.t7689(c, b, reports_view, null);
};
dreiser.core.dreiser_app = function dreiser_app(b, c) {
  "undefined" === typeof dreiser.core.t7698 && (dreiser.core.t7698 = function(b, c, f, g) {
    this.owner = b;
    this.app = c;
    this.dreiser_app = f;
    this.meta7699 = g;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216;
  }, dreiser.core.t7698.cljs$lang$type = !0, dreiser.core.t7698.cljs$lang$ctorStr = "dreiser.core/t7698", dreiser.core.t7698.cljs$lang$ctorPrWriter = function(b, c, f) {
    return cljs.core._write.call(null, c, "dreiser.core/t7698");
  }, dreiser.core.t7698.prototype.om$core$IRenderState$ = !0, dreiser.core.t7698.prototype.om$core$IRenderState$render_state$arity$2 = function(b, c) {
    return React.DOM.div({className:"container"}, om.core.build.call(null, dreiser.core.reports_view, this.app));
  }, dreiser.core.t7698.prototype.om$core$IDidUpdate$ = !0, dreiser.core.t7698.prototype.om$core$IDidUpdate$did_update$arity$3 = function(b, c, f) {
    return jQuery('[data-toggle\x3d"popover"]').popover({html:!0, placement:"bottom"});
  }, dreiser.core.t7698.prototype.om$core$IWillMount$ = !0, dreiser.core.t7698.prototype.om$core$IWillMount$will_mount$arity$1 = function(b) {
    var c = this;
    dreiser.core.start_progress.call(null);
    dreiser.core.edn_xhr.call(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null, "method", "method", 55703592), new cljs.core.Keyword(null, "get", "get", 1683182755), new cljs.core.Keyword(null, "url", "url", 276297046), "/reports", new cljs.core.Keyword(null, "on-complete", "on-complete", -1531183971), function(b) {
      return function(d) {
        return om.core.transact_BANG_.call(null, c.app, new cljs.core.Keyword(null, "reports", "reports", 1629311767), function(b) {
          return function(b) {
            return d;
          };
        }(b));
      };
    }(this)], null));
    return dreiser.core.edn_xhr.call(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null, "method", "method", 55703592), new cljs.core.Keyword(null, "get", "get", 1683182755), new cljs.core.Keyword(null, "url", "url", 276297046), "/stats", new cljs.core.Keyword(null, "on-complete", "on-complete", -1531183971), function(b) {
      return function(d) {
        dreiser.core.stop_progress.call(null);
        return om.core.transact_BANG_.call(null, c.app, new cljs.core.Keyword(null, "shop", "shop", -823644406), function(b) {
          return function(b) {
            return d;
          };
        }(b));
      };
    }(this)], null));
  }, dreiser.core.t7698.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta7699;
  }, dreiser.core.t7698.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
    return new dreiser.core.t7698(this.owner, this.app, this.dreiser_app, c);
  }, dreiser.core.__GT_t7698 = function(b, c, f, g) {
    return new dreiser.core.t7698(b, c, f, g);
  });
  return new dreiser.core.t7698(c, b, dreiser_app, null);
};
om.core.root.call(null, dreiser.core.dreiser_app, dreiser.core.app_state, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "target", "target", 253001721), document.getElementById("app")], null));
