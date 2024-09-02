var TempleAPI = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // ../temple/dist/Exception.js
  var require_Exception = __commonJS({
    "../temple/dist/Exception.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var TempleException = class extends Error {
        static for(message, ...values) {
          values.forEach(function(value) {
            message = message.replace("%s", value);
          });
          return new this(message);
        }
        static forErrorsFound(errors) {
          const exception = new this("Invalid Parameters");
          exception.errors = errors;
          return exception;
        }
        static require(condition, message, ...values) {
          if (!condition) {
            for (const value of values) {
              message = message.replace("%s", value);
            }
            throw new this(message);
          }
        }
        constructor(message, code = 500) {
          super();
          this.errors = {};
          this.start = 0;
          this.end = 0;
          this.message = message;
          this.name = this.constructor.name;
          this.code = code;
        }
        withCode(code) {
          this.code = code;
          return this;
        }
        withPosition(start, end) {
          this.start = start;
          this.end = end;
          return this;
        }
        toJSON() {
          return {
            error: true,
            code: this.code,
            message: this.message
          };
        }
      };
      exports.default = TempleException;
    }
  });

  // ../temple/dist/server/TempleCollection.js
  var require_TempleCollection = __commonJS({
    "../temple/dist/server/TempleCollection.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var TempleCollection = class {
        constructor(elements = []) {
          this._elements = /* @__PURE__ */ new Set();
          elements.forEach((element) => this._elements.add(element));
        }
        add(element) {
          this._elements.add(element);
        }
        toArray() {
          return Array.from(this._elements);
        }
        toString() {
          return Array.from(this._elements).map((child) => child.toString()).join("");
        }
      };
      exports.default = TempleCollection;
    }
  });

  // ../temple/dist/server/data.js
  var require_data = __commonJS({
    "../temple/dist/server/data.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var data = /* @__PURE__ */ new Map();
      exports.default = data;
    }
  });

  // ../temple/dist/server/TempleElement.js
  var require_TempleElement = __commonJS({
    "../temple/dist/server/TempleElement.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var TempleCollection_1 = __importDefault(require_TempleCollection());
      var selfClosingTags = [
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr"
      ];
      var TempleElement2 = class {
        static render(markup) {
          return markup.map((child) => child.toString()).join("");
        }
        get name() {
          return this._name;
        }
        get attributes() {
          return this._attributes;
        }
        get children() {
          return this._children;
        }
        constructor(name, attributes = {}, children = []) {
          this._attributes = {};
          this._name = name;
          this._attributes = attributes;
          this._children = new TempleCollection_1.default(children);
        }
        toString() {
          const entries = Object.entries(this._attributes);
          const attributes = entries.length > 0 ? " " + entries.map(([key, value]) => {
            if (typeof value === "string") {
              return `${key}="${value}"`;
            } else if (typeof value === "boolean") {
              return value ? key : "";
            }
          }).join(" ") : "";
          if (selfClosingTags.includes(this._name)) {
            return `<${this._name}${attributes} />`;
          }
          const children = this._children.toString();
          return `<${this._name}${attributes}>${children}</${this._name}>`;
        }
      };
      exports.default = TempleElement2;
    }
  });

  // ../temple/dist/server/TempleText.js
  var require_TempleText = __commonJS({
    "../temple/dist/server/TempleText.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var TempleText = class {
        get value() {
          return this._escape ? this._value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : this._value;
        }
        constructor(value, escape = false) {
          this._escape = escape;
          this._value = value;
        }
        toString() {
          return this.value;
        }
      };
      exports.default = TempleText;
    }
  });

  // ../temple/dist/server/TempleRegistry.js
  var require_TempleRegistry = __commonJS({
    "../temple/dist/server/TempleRegistry.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var TempleText_1 = __importDefault(require_TempleText());
      var TempleElement_1 = __importDefault(require_TempleElement());
      var TempleRegistry2 = class {
        static createElement(name, attributes, children = []) {
          return new TempleElement_1.default(name, attributes, children);
        }
        static createText(value, escape = true) {
          return new TempleText_1.default(value, escape);
        }
      };
      exports.default = TempleRegistry2;
    }
  });

  // ../temple/dist/server/TempleDocument.js
  var require_TempleDocument = __commonJS({
    "../temple/dist/server/TempleDocument.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var Exception_1 = __importDefault(require_Exception());
      var data_1 = __importDefault(require_data());
      var TempleElement_1 = __importDefault(require_TempleElement());
      var TempleRegistry_1 = __importDefault(require_TempleRegistry());
      var TempleDocument2 = class {
        render(props = {}) {
          data_1.default.set("props", props || {});
          data_1.default.set("env", Object.assign(Object.assign({}, process.env || {}), { BUILD_ID: this.id(), APP_DATA: btoa(JSON.stringify(Object.assign(Object.assign({}, Object.fromEntries(data_1.default.entries())), { env: Object.assign(Object.assign({}, Object.fromEntries(Object.entries(process.env || {}).filter((entry) => entry[0].startsWith("PUBLIC_")))), { BUILD_ID: this.id() }) }))) }));
          const children = this.template();
          let document2 = TempleElement_1.default.render(children).trim();
          if (!document2.toLowerCase().startsWith("<html")) {
            throw Exception_1.default.for("Document must start with an <html> tag.");
          }
          return `<!DOCTYPE html>
${document2}`;
        }
        _toNodeList(value) {
          if (typeof value === "object" && typeof value.nodeType === "number") {
            return [value];
          }
          if (Array.isArray(value)) {
            if (value.every((item) => typeof item === "object" && typeof item.nodeType === "number")) {
              return value;
            }
          }
          return [TempleRegistry_1.default.createText(String(value))];
        }
      };
      exports.default = TempleDocument2;
    }
  });

  // ../temple/dist/server/TempleEmitter.js
  var require_TempleEmitter = __commonJS({
    "../temple/dist/server/TempleEmitter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TempleEmitter = void 0;
      var TempleEmitter = class {
        emit(event, target) {
          return this;
        }
        on(event, callback) {
          return this;
        }
        once(event, callback) {
          return this;
        }
        unbind(event, callback) {
          return this;
        }
      };
      exports.TempleEmitter = TempleEmitter;
      var emitter = new TempleEmitter();
      exports.default = emitter;
    }
  });

  // ../temple/dist/server/env.js
  var require_env = __commonJS({
    "../temple/dist/server/env.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var data_1 = __importDefault(require_data());
      function env2(name) {
        const env3 = data_1.default.get("env") || {};
        if (name) {
          return env3[name] || null;
        }
        return env3;
      }
      exports.default = env2;
    }
  });

  // ../temple/dist/server/props.js
  var require_props = __commonJS({
    "../temple/dist/server/props.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.default = props;
      var data_1 = __importDefault(require_data());
      function props() {
        return data_1.default.get("props") || {};
      }
    }
  });

  // ../temple/dist/server/classnames.js
  var require_classnames = __commonJS({
    "../temple/dist/server/classnames.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.default = classnames;
      var props_1 = __importDefault(require_props());
      function classnames() {
        return (0, props_1.default)()["class"];
      }
    }
  });

  // ../temple/dist/server/signal.js
  var require_signal = __commonJS({
    "../temple/dist/server/signal.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.default = signal;
      function signal(value) {
        const methods = {
          getter: () => property.raw,
          setter: (value2) => value2
        };
        const property = {
          raw: value,
          getter(callback) {
            methods.getter = callback;
            return property;
          },
          setter(callback) {
            methods.setter = callback;
            return property;
          }
        };
        Object.defineProperty(property, "value", {
          get() {
            return methods.getter();
          },
          set(value2) {
            property.raw = methods.setter(value2);
          }
        });
        return property;
      }
    }
  });

  // ../temple/dist/server.js
  var require_server = __commonJS({
    "../temple/dist/server.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TempleText = exports.TempleException = exports.TempleEmitter = exports.TempleElement = exports.TempleRegistry = exports.TempleDocument = exports.TempleCollection = exports.signal = exports.classnames = exports.props = exports.emitter = exports.env = exports.data = void 0;
      var Exception_1 = __importDefault(require_Exception());
      exports.TempleException = Exception_1.default;
      var TempleCollection_1 = __importDefault(require_TempleCollection());
      exports.TempleCollection = TempleCollection_1.default;
      var TempleDocument_1 = __importDefault(require_TempleDocument());
      exports.TempleDocument = TempleDocument_1.default;
      var TempleRegistry_1 = __importDefault(require_TempleRegistry());
      exports.TempleRegistry = TempleRegistry_1.default;
      var TempleElement_1 = __importDefault(require_TempleElement());
      exports.TempleElement = TempleElement_1.default;
      var TempleEmitter_1 = __importStar(require_TempleEmitter());
      exports.emitter = TempleEmitter_1.default;
      Object.defineProperty(exports, "TempleEmitter", { enumerable: true, get: function() {
        return TempleEmitter_1.TempleEmitter;
      } });
      var TempleText_1 = __importDefault(require_TempleText());
      exports.TempleText = TempleText_1.default;
      var data_1 = __importDefault(require_data());
      exports.data = data_1.default;
      var env_1 = __importDefault(require_env());
      exports.env = env_1.default;
      var props_1 = __importDefault(require_props());
      exports.props = props_1.default;
      var classnames_1 = __importDefault(require_classnames());
      exports.classnames = classnames_1.default;
      var signal_1 = __importDefault(require_signal());
      exports.signal = signal_1.default;
    }
  });

  // ../temple/server.js
  var require_server2 = __commonJS({
    "../temple/server.js"(exports, module) {
      module.exports = { ...require_server() };
    }
  });

  // temple-document-server-plugin:/Users/cblanquera/server/projects/ossph/temple/packages/temple-web/src/pages/docs/markup-syntax.dtml
  var markup_syntax_exports = {};
  __export(markup_syntax_exports, {
    default: () => MarkupSyntax_57e37fa233b38c87fe71
  });
  var import_server = __toESM(require_server2());
  var import_server2 = __toESM(require_server2());

  // src/modules/i18n/index.ts
  var _ = function(phrase, ...variables) {
    let translation = translate(phrase);
    for (let i = 0; i < variables.length; i++) {
      translation = translation.replace("%s", String(variables[i]));
    }
    return translation;
  };
  var translate = function(phrase) {
    return phrase;
  };

  // temple-document-server-plugin:/Users/cblanquera/server/projects/ossph/temple/packages/temple-web/src/pages/docs/markup-syntax.dtml
  var MarkupSyntax_57e37fa233b38c87fe71 = class extends import_server.TempleDocument {
    id() {
      return "57e37fa233b38c87fe71";
    }
    styles() {
      return ``;
    }
    template() {
      const url = "/docs/markup-syntax.html";
      const title = _("Markup Syntax - Temple reactive web component template engine.");
      const description = _("Learn how to write markup in Temple.");
      const toggle = (_2) => {
        document.body.classList.toggle("panel-left-open");
      };
      return [
        import_server.TempleRegistry.createText(`
`, false),
        import_server.TempleRegistry.createElement("html", {}, [
          import_server.TempleRegistry.createText(`
  `, false),
          ...[
            import_server.TempleRegistry.createElement("head", {}, [
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "charset": `utf-8` }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `viewport`, "content": `width=device-width, initial-scale=1` }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("title", {}, [
                ...this._toNodeList(title)
              ]),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `description`, "content": description }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "property": `og:title`, "content": title }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "property": `og:description`, "content": description }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "property": `og:image`, "content": `https://ossphilippines.github.io/temple/temple-logo.png` }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "property": `og:url`, "content": `https://ossphilippines.github.io/temple${url}` }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "property": `og:type`, "content": `website` }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `twitter:card`, "content": `summary` }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `twitter:site`, "content": `@OSSPhilippines` }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `twitter:title`, "content": title }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `twitter:description`, "content": description }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `twitter:image`, "content": `https://ossphilippines.github.io/temple/temple-logo.png` }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("link", { "rel": `favicon`, "href": `/temple/favicon.ico` }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("link", { "rel": `shortcut icon`, "type": `image/png`, "href": `/temple/favicon.png` }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("link", { "rel": `stylesheet`, "type": `text/css`, "href": `/temple/styles/fontawesome/all.css` }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("link", { "rel": `stylesheet`, "type": `text/css`, "href": `/temple/styles/theme.css` }),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("link", { "rel": `stylesheet`, "type": `text/css`, "href": `/temple/build/${(0, import_server2.env)("BUILD_ID")}.css` }),
              import_server.TempleRegistry.createText(`
  
  `, false),
              import_server.TempleRegistry.createElement("script", { "data-app": (0, import_server2.env)("APP_DATA"), "src": `/temple/build/${(0, import_server2.env)("BUILD_ID")}.js` }),
              import_server.TempleRegistry.createText(`
  `, false),
              ...!!((0, import_server2.env)("NODE_ENV") !== "production") ? [
                import_server.TempleRegistry.createText(`
    `, false),
                import_server.TempleRegistry.createElement("script", { "src": `/dev.js` }),
                import_server.TempleRegistry.createText(`
  `, false)
              ] : [],
              import_server.TempleRegistry.createText(`
`, false)
            ])
          ],
          import_server.TempleRegistry.createText(`
  `, false),
          import_server.TempleRegistry.createElement("body", { "class": `dark panel with-head with-left with-right` }, [
            import_server.TempleRegistry.createText(`
    `, false),
            ...[
              import_server.TempleRegistry.createElement("header", { "class": `head panel-head` }, [
                import_server.TempleRegistry.createText(`
  `, false),
                import_server.TempleRegistry.createElement("i", { "class": `menu fas fa-fw fa-bars`, "click": toggle }, []),
                import_server.TempleRegistry.createText(`
  `, false),
                import_server.TempleRegistry.createElement("a", { "href": `/temple` }, [
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("img", { "src": `/temple/temple-icon.png`, "alt": `Temple Logo` }),
                  import_server.TempleRegistry.createText(`
  `, false)
                ]),
                import_server.TempleRegistry.createText(`
  `, false),
                import_server.TempleRegistry.createElement("h3", {}, [
                  import_server.TempleRegistry.createElement("a", { "class": `tx-white`, "href": `/temple` }, [
                    import_server.TempleRegistry.createText(`Temple`, false)
                  ])
                ]),
                import_server.TempleRegistry.createText(`
  `, false),
                import_server.TempleRegistry.createElement("nav", {}, [
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple/docs/index.html` }, [
                    import_server.TempleRegistry.createText(`Docs`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "class": `github`, "href": `https://github.com/ossPhilippines/temple`, "target": `_blank` }, [
                    import_server.TempleRegistry.createText(`
      `, false),
                    import_server.TempleRegistry.createElement("i", { "class": `fab fa-github` }, []),
                    import_server.TempleRegistry.createText(`
    `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "class": `npm`, "href": `https://www.npmjs.com/package/temple`, "target": `_blank` }, [
                    import_server.TempleRegistry.createText(`
      `, false),
                    import_server.TempleRegistry.createElement("i", { "class": `fab fa-npm text-white` }, []),
                    import_server.TempleRegistry.createText(`
    `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "class": `discord`, "href": `https://discord.gg/open-source-software-ph-905496362982981723`, "target": `_blank` }, [
                    import_server.TempleRegistry.createText(`
      `, false),
                    import_server.TempleRegistry.createElement("i", { "class": `fab fa-discord text-white` }, []),
                    import_server.TempleRegistry.createText(`
    `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
  `, false)
                ]),
                import_server.TempleRegistry.createText(`
`, false)
              ])
            ],
            import_server.TempleRegistry.createText(`
    `, false),
            ...[
              import_server.TempleRegistry.createElement("aside", { "class": `left panel-left` }, [
                import_server.TempleRegistry.createText(`
  `, false),
                import_server.TempleRegistry.createElement("header", {}, [
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple` }, [
                    import_server.TempleRegistry.createText(`
      `, false),
                    import_server.TempleRegistry.createElement("img", { "src": `/temple/temple-icon.png`, "alt": `Temple Logo` }),
                    import_server.TempleRegistry.createText(`
    `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("h3", {}, [
                    import_server.TempleRegistry.createElement("a", { "class": `tx-white`, "href": `/temple` }, [
                      import_server.TempleRegistry.createText(`Temple`, false)
                    ])
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("i", { "class": `toggle fas fa-fw fa-chevron-left`, "click": toggle }, []),
                  import_server.TempleRegistry.createText(`
  `, false)
                ]),
                import_server.TempleRegistry.createText(`
  `, false),
                import_server.TempleRegistry.createElement("nav", {}, [
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("h6", {}, [
                    import_server.TempleRegistry.createText(`Introduction`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple/docs/index.html` }, [
                    import_server.TempleRegistry.createText(`Documentation`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple/docs/getting-started.html` }, [
                    import_server.TempleRegistry.createText(`Getting Started`, false)
                  ]),
                  import_server.TempleRegistry.createText(`

    `, false),
                  import_server.TempleRegistry.createElement("h6", {}, [
                    import_server.TempleRegistry.createText(`Features`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple/docs/markup-syntax.html` }, [
                    import_server.TempleRegistry.createText(`Markup Syntax`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple/docs/state-management.html` }, [
                    import_server.TempleRegistry.createText(`State Management`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple/docs/component-strategy.html` }, [
                    import_server.TempleRegistry.createText(`Component Strategy`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple/docs/compiler-api.html` }, [
                    import_server.TempleRegistry.createText(`Compiler API`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple/docs/client-api.html` }, [
                    import_server.TempleRegistry.createText(`Client API`, false)
                  ]),
                  import_server.TempleRegistry.createText(`

    `, false),
                  import_server.TempleRegistry.createElement("h6", {}, [
                    import_server.TempleRegistry.createText(`Usage`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple/docs/template-engine.html` }, [
                    import_server.TempleRegistry.createText(`Template Engine`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple/docs/single-page.html` }, [
                    import_server.TempleRegistry.createText(`Single Page App`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple/docs/static-site.html` }, [
                    import_server.TempleRegistry.createText(`Static Site Generator`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple/docs/component-publisher.html` }, [
                    import_server.TempleRegistry.createText(`Component Publisher`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
    `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `/temple/docs/developer-tools.html` }, [
                    import_server.TempleRegistry.createText(`Developer Tools`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
  `, false)
                ]),
                import_server.TempleRegistry.createText(`
`, false)
              ])
            ],
            import_server.TempleRegistry.createText(`
    `, false),
            import_server.TempleRegistry.createElement("aside", { "class": `panel-right right` }, [
              import_server.TempleRegistry.createText(`
      `, false),
              import_server.TempleRegistry.createElement("h6", {}, [
                ...this._toNodeList(_("On this page"))
              ]),
              import_server.TempleRegistry.createText(`
      `, false),
              import_server.TempleRegistry.createElement("nav", {}, [
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("a", { "href": `#imports` }, [
                  ...this._toNodeList(_("Imports"))
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("a", { "href": `#styles` }, [
                  ...this._toNodeList(_("Styles"))
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("a", { "href": `#scripts` }, [
                  ...this._toNodeList(_("Scripts"))
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("a", { "href": `#markup` }, [
                  ...this._toNodeList(_("Markup"))
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("nav", {}, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `#tagnames` }, [
                    ...this._toNodeList(_("Tag Names"))
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `#attributes` }, [
                    ...this._toNodeList(_("Attributes"))
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `#conditionals` }, [
                    ...this._toNodeList(_("Conditionals"))
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `#iterations` }, [
                    ...this._toNodeList(_("Iterations"))
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("a", { "href": `#trycatch` }, [
                    ...this._toNodeList(_("Try/Catch"))
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`
      `, false)
              ]),
              import_server.TempleRegistry.createText(`
    `, false)
            ]),
            import_server.TempleRegistry.createText(`
    `, false),
            import_server.TempleRegistry.createElement("panel-main", { "class": `panel-main` }, [
              import_server.TempleRegistry.createText(`
      `, false),
              import_server.TempleRegistry.createElement("div", { "class": `docs container` }, [
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("h1", {}, [
                  ...this._toNodeList(_("Markup Syntax"))
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Components are the building blocks of Temple files. Documents 
          and page level markup are written in 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    import_server.TempleRegistry.createText(`.dtml`, false)
                  ]),
                  import_server.TempleRegistry.createText(` files. Components 
          and templates are written in 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    import_server.TempleRegistry.createText(`.tml`, false)
                  ]),
                  import_server.TempleRegistry.createText(` files. In both 
          cases, the code is written in a superset of HTML.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          The four sections that make up a temple file \u2014 imports, 
          script, styles and markup \u2014 are all optional and can be 
          used in any order.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("ide-app", { "title": `Code Structure` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "detab": 12 }, [
                    ...this._toNodeList(`
            <!-- imports go here -->

            <style>
              /* styles go here */
            </style>

            <script>
              // logic goes here
            </script>
            
            <!-- HTML goes here -->
          `)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("a", { "name": `imports` }, []),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("h2", {}, [
                  ...this._toNodeList(_("Imports"))
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Imports are used to include additional components, templates 
          and stylesheets in the current component. Components can 
          be imported as a `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    import_server.TempleRegistry.createText(`template`, false)
                  ]),
                  import_server.TempleRegistry.createText(` or 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    import_server.TempleRegistry.createText(`component`, false)
                  ]),
                  import_server.TempleRegistry.createText(` type.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-app", { "title": `Import Examples` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                    ...this._toNodeList(`
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/prism.min.css" />
            <link rel="stylesheet" type="text/css" href="/styles/layout.css" />
            <link rel="import" type="template" href="@/modules/html-head.tml" />
            <link rel="import" type="component" href="@/modules/i18n/translate.tml" name="i18n-translate" />

            <style>
              /* styles go here */
            </style>

            <script>
              // logic goes here
            </script>
            
            <!-- HTML goes here -->
          `)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`
        
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          The `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    import_server.TempleRegistry.createText(`rel`, false)
                  ]),
                  import_server.TempleRegistry.createText(` attribute 
          specifies the relationship between the current document and 
          the linked resource. 
          
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    import_server.TempleRegistry.createText(`rel="import"`, false)
                  ]),
                  import_server.TempleRegistry.createText(` denotes
          that the imported resource is a component or template.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          The `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    import_server.TempleRegistry.createText(`type`, false)
                  ]),
                  import_server.TempleRegistry.createText(` 
          attribute specifies the type of the linked resource. 
          
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    import_server.TempleRegistry.createText(`type="component"`, false)
                  ]),
                  import_server.TempleRegistry.createText(` 
          imports a web component that can be used as regular markup
          with attributes and children. 
          
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    import_server.TempleRegistry.createText(`type="template"`, false)
                  ]),
                  import_server.TempleRegistry.createText(` 
          imports a template partial that can be included in the current 
          markup. Template partials do not process attributes or children
          if given.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          The 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    import_server.TempleRegistry.createText(`href`, false)
                  ]),
                  import_server.TempleRegistry.createText(` attribute specifies
          the URL of the linked resource. The 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    import_server.TempleRegistry.createText(`name`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          attribute specifies the tag name of the imported component or template.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("a", { "name": `styles` }, []),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("h2", {}, [
                  ...this._toNodeList(_("Styles"))
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          CSS styles inside a `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`<style>`)
                  ]),
                  import_server.TempleRegistry.createText(` 
          block enables the native `, false),
                  import_server.TempleRegistry.createElement("a", { "target": `_blank`, "href": `https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM` }, [
                    import_server.TempleRegistry.createText(`shadow DOM`, false)
                  ]),
                  import_server.TempleRegistry.createText(` and will be scoped only to that component. 
          Additionally styles defined outside of the component such as 
          global styles will not affect the component.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          External stylesheets can be imported using the 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`<link>`)
                  ]),
                  import_server.TempleRegistry.createText(` tag or using 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`@import()`)
                  ]),
                  import_server.TempleRegistry.createText(` CSS directive. 
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          You can use host selectors to style an element from within 
          a component. The `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`:host`)
                  ]),
                  import_server.TempleRegistry.createText(` 
          pseudo-class always applies styles to the root element of the 
          web component.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-app", { "title": `Using :host` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                    ...this._toNodeList(`
            <style>
              :host {
                display: block;
              }
            </style>
          `)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          You can also add conditional styles using the 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`:host`)
                  ]),
                  import_server.TempleRegistry.createText(` selector function. 
          This can be used to style the host so long as it matches the 
          given selector. For example, it can be used to select for 
          hosts that have a given attribute or class.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-app", { "title": `:host Conditionals` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                    ...this._toNodeList(`
            <style>
              :host([active]) {
                background-color: #333;
                color: #FFF;
              }
              :host(.active) {
                background-color: #333;
                color: #FFF;
              }
            </style>
          `)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("a", { "name": `scripts` }, []),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("h2", {}, [
                  ...this._toNodeList(_("Scripts"))
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          The `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`<script>`)
                  ]),
                  import_server.TempleRegistry.createText(` block is used 
          to write TypeScript logic for the component. The script block 
          can be used to define variables, functions, and event listeners.
          Variables declared (or imported) at the top level are 
          'visible' from the component's markup. 
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-app", { "title": `Top-Level Variables` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                    ...this._toNodeList(`
            <script>
              const title = 'Hello World';
            </script>

            <h1>{title}</h1>
          `)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          The `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`<script>`)
                  ]),
                  import_server.TempleRegistry.createText(` block can also 
          be used to import variables from other components to be used
          in the markup.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-app", { "title": `Importing Files` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                    ...this._toNodeList(`
            <script>
              import getTitle from './getTitle';
              const title = getTitle();
            </script>

            <h1 title={title}>{title}</h1>
          `)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          You can use `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`@/`)
                  ]),
                  import_server.TempleRegistry.createText(` to prefix the 
          current working directory. This is useful when importing
          files completely in a separate directory in your project
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-app", { "title": `@ Imports` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                    ...this._toNodeList(`
            <script>
              import getTitle from '@/data/getTitle';
              const title = getTitle();
            </script>

            <h1 title={title}>{title}</h1>
          `)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("a", { "name": `markup` }, []),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("h2", {}, [
                  ...this._toNodeList(_("Markup"))
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          In order to be closer to the native, Temple follows the same 
          standards and conventions as HTML5 web components. Temple 
          components are compiled to native web components that possibly 
          can be used in other projects any modern browser.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("a", { "name": `tagnames` }, []),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("h3", {}, [
                  ...this._toNodeList(_("Tag Names"))
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Tag names must have at least one dash (-) in them. As such 
          you probably want to name your element with two distinct words 
          like `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`i18n-translate`)
                  ]),
                  import_server.TempleRegistry.createText(`. You can 
          use as many dashes as you want, you're not limited to one. 
          Some specific rules to follow in order to make a valid tag 
          name:
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ul", {}, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "li": true, "trim": true }, [
                    import_server.TempleRegistry.createText(`
            It must use all lowercase characters of the alphabet (a-z).
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "li": true, "trim": true }, [
                    import_server.TempleRegistry.createText(`
            t must contain at least one dash (-).
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "li": true, "trim": true }, [
                    import_server.TempleRegistry.createText(`
            It must not be an already reserved tag name including 
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      import_server.TempleRegistry.createText(`annotation-xml`, false)
                    ]),
                    import_server.TempleRegistry.createText(`,
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      import_server.TempleRegistry.createText(`color-profile`, false)
                    ]),
                    import_server.TempleRegistry.createText(`,
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      import_server.TempleRegistry.createText(`font-face`, false)
                    ]),
                    import_server.TempleRegistry.createText(`,
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      import_server.TempleRegistry.createText(`font-face-src`, false)
                    ]),
                    import_server.TempleRegistry.createText(`,
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      import_server.TempleRegistry.createText(`font-face-uri`, false)
                    ]),
                    import_server.TempleRegistry.createText(`,
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      import_server.TempleRegistry.createText(`font-face-format`, false)
                    ]),
                    import_server.TempleRegistry.createText(`,
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      import_server.TempleRegistry.createText(`font-face-name`, false)
                    ]),
                    import_server.TempleRegistry.createText(`, and 
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      import_server.TempleRegistry.createText(`missing-glyph`, false)
                    ]),
                    import_server.TempleRegistry.createText(`.
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "li": true, "trim": true }, [
                    import_server.TempleRegistry.createText(`
            It must not contain symbols, like =, @, $.
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "li": true, "trim": true }, [
                    import_server.TempleRegistry.createText(`
            It can contain underscores, and numbers.
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "li": true, "trim": true }, [
                    import_server.TempleRegistry.createText(`
            It can contain characters from different alphabets, 
            such as \xE9, \xF0, \xF6, \u7231.
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Additionally, Temple works best with correct markup. The 
          following standards should be followed:
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ul", {}, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "li": true, "trim": true }, [
                    import_server.TempleRegistry.createText(`
            Self closing tags like 
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      ...this._toNodeList(`<img />`)
                    ]),
                    import_server.TempleRegistry.createText(`,
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      ...this._toNodeList(`<link />`)
                    ]),
                    import_server.TempleRegistry.createText(`,
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      ...this._toNodeList(`<meta />`)
                    ]),
                    import_server.TempleRegistry.createText(`,
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      ...this._toNodeList(`<input />`)
                    ]),
                    import_server.TempleRegistry.createText(`
            must have a slash before the closing.
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "li": true, "trim": true }, [
                    import_server.TempleRegistry.createText(`
            When using tables, rows should be wrapped in a 
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      ...this._toNodeList(`<tbody>`)
                    ]),
                    import_server.TempleRegistry.createText(` tag and cells
            should be wrapped in a `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      ...this._toNodeList(`<tr>`)
                    ]),
                    import_server.TempleRegistry.createText(` 
            tag. ie. `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      ...this._toNodeList(`<table><tbody><tr><td>`)
                    ]),
                    import_server.TempleRegistry.createText(`
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "li": true, "trim": true }, [
                    import_server.TempleRegistry.createText(`
            When using lists, items should be wrapped in a 
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      ...this._toNodeList(`<ul>`)
                    ]),
                    import_server.TempleRegistry.createText(` or 
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      ...this._toNodeList(`<ol>`)
                    ]),
                    import_server.TempleRegistry.createText(` tags.
            ie. `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                      ...this._toNodeList(`<ul><li>`)
                    ]),
                    import_server.TempleRegistry.createText(`
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("tui-alert", { "solid": true, "curved": true, "secondary": true }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("i", { "class": `fas fa-exclamation-triangle` }, []),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("strong", {}, [
                    import_server.TempleRegistry.createText(`Warning:`, false)
                  ]),
                  import_server.TempleRegistry.createText(` Any markup auto corrected by browser will cause data syncing 
          issues with Temple.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Temple components can loosely be self closing
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`<i18n-translate />`)
                  ]),
                  import_server.TempleRegistry.createText(`
          or expressed as a block
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`<i18n-translate></i18n-translate>`)
                  ]),
                  import_server.TempleRegistry.createText(`.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("a", { "name": `attributes` }, []),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("h3", {}, [
                  ...this._toNodeList(_("Attributes"))
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-app", { "title": `Markup Expressions` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                    ...this._toNodeList(`
            <a title={title} {href} {...attributes}>
              {title}
            </a>
            <i18n-translate title=title>
              {detail}
            </i18n-translate>
          `)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Attributes can be bound to expressions using the 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`{}`)
                  ]),
                  import_server.TempleRegistry.createText(` syntax. 
          Expressions can be variables, functions, or any valid 
          JavaScript expression. By default, attributes work exactly 
          like their HTML counterparts.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-code", { "trim": true, "detab": 10 }, [
                  ...this._toNodeList(`
          <button type="button" disabled>Submit</button>
        `)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Traditional HTML attributes can be assigned string values or 
          no value evaluates as `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`true`)
                  ]),
                  import_server.TempleRegistry.createText(`.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-code", { "trim": true, "detab": 10 }, [
                  ...this._toNodeList(`
          <a title={title}>Click</a>
        `)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Attributes can be assigned variable names.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-code", { "trim": true, "detab": 10 }, [
                  ...this._toNodeList(`
          <a title=title>Click</a>
        `)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Variable names do not need to be wrapped in curly braces
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`{}`)
                  ]),
                  import_server.TempleRegistry.createText(`.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-code", { "trim": true, "detab": 10 }, [
                  ...this._toNodeList(`
          <a {title}>Click</a>
        `)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Attributes with the same name as a variable can be assigned
          by just wrapping curly braces. ie. 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`{title}`)
                  ]),
                  import_server.TempleRegistry.createText(`.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-code", { "trim": true, "detab": 10 }, [
                  ...this._toNodeList(`
          <script>
            const attributes = { target: '_blank' };
          </script>
          <a {...attributes}>Click</a>
        `)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Spread operators can be used to assign multiple attributes.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 10 }, [
                  ...this._toNodeList(`
          <script>
            let count = 10
            const metadata = { foo: 'bar', baz: 1, qux: true };
            const data = () => metadata
          </script>
          <a {count} get={data} data-meta={metadata} disable={count < 10}>
            Click
          </a>
        `)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          You can assign any valid JavaScript expression to an attribute.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("a", { "name": `conditionals` }, []),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("h3", {}, [
                  ...this._toNodeList(_("Conditionals"))
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-app", { "title": `Conditionals` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                    ...this._toNodeList(`
            <if true={count > 10}>
              <p>Count is greater than 10</p>
            <elif true={count < 5} />
              <p>Count is less than 5</p>
            <else />
              <p>Count is between 5 and 10</p>
            </if>
          `)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Conditionals can be used to show or hide elements based on 
          the value of a variable.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                  ...this._toNodeList(`
          <if true={count > 10}>
            <p>Count is greater than 10</p>
          </if>
        `)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          The basic syntax for an if statement looks like this and can be 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`truesy`)
                  ]),
                  import_server.TempleRegistry.createText(` or 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`falsey`)
                  ]),
                  import_server.TempleRegistry.createText(`.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                  ...this._toNodeList(`
          <if false={count > 10}>
            <p>Count is not greater than 10</p>
          </if>
        `)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          You can also use the `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`false`)
                  ]),
                  import_server.TempleRegistry.createText(`
          attribute to negate the condition.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                  ...this._toNodeList(`
          <if true={count > 10}>
            <p>Count is greater than 10</p>
          <else />
            <p>Count is less than or equal to 10</p>
          </if>
        `)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          You can use the `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`else`)
                  ]),
                  import_server.TempleRegistry.createText(` block to 
          show content when the condition is false.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                  ...this._toNodeList(`
          <if true={count > 10}>
            <p>Count is greater than 10</p>
          <elif true={count < 5} />
            <p>Count is less than 5</p>
          </if>
        `)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          You can use the `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`elif`)
                  ]),
                  import_server.TempleRegistry.createText(` block to 
          show content when the previous condition is false.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("a", { "name": `iterations` }, []),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("h3", {}, [
                  ...this._toNodeList(_("Iterations"))
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-app", { "title": `Each` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                    ...this._toNodeList(`
            <each key=index value=article from=articles>
              <h1>#{index + 1} {article.title}</h1>
              <p>{article.body}</p>
            </each>
          `)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          The `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`<each>`)
                  ]),
                  import_server.TempleRegistry.createText(` block can be used 
          to iterate over an array of items or objects.
          The `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`from`)
                  ]),
                  import_server.TempleRegistry.createText(` attribute value is 
          required and can be an array, object or JavaScript expression 
          that evaluates to an array or object. Both the 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`key`)
                  ]),
                  import_server.TempleRegistry.createText(` and 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`value`)
                  ]),
                  import_server.TempleRegistry.createText(` attributes are optional.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                  ...this._toNodeList(`
          <each value={article} from={articles}>
            <h1>{article.title}</h1>
            <p>{article.body}</p>
          </each>
        `)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          The value of `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`value`)
                  ]),
                  import_server.TempleRegistry.createText(`, in this 
          case `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`article`)
                  ]),
                  import_server.TempleRegistry.createText(` can be used 
          only with in the block. This can be any valid JavaScript 
          variable name.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                  ...this._toNodeList(`
          <each key={index} from={[1, 2, 3]}>
            <h1>#{index} ???</h1>
          </each>
        `)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          The value of `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`key`)
                  ]),
                  import_server.TempleRegistry.createText(`, in this 
          case `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`index`)
                  ]),
                  import_server.TempleRegistry.createText(` can be used 
          only with in the block. This can be any valid JavaScript 
          variable name.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("a", { "name": `trycatch` }, []),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("h3", {}, [
                  ...this._toNodeList(_("Try/Catch"))
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("ide-app", { "title": `Try/Catch Example` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "numbers": true, "trim": true, "detab": 12 }, [
                    ...this._toNodeList(`
            <try>
              <p>{mayCauseError()}</p>
            <catch error={e} />
              <p>Error: {e.message}</p>
            </try>
          `)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          The `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`<try><catch>`)
                  ]),
                  import_server.TempleRegistry.createText(` block can 
          be used to catch errors that occur in the block. The 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`<catch>`)
                  ]),
                  import_server.TempleRegistry.createText(` block is required and 
          can be used to handle the error.

          The value of `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`error`)
                  ]),
                  import_server.TempleRegistry.createText(`, in the  
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`<catch>`)
                  ]),
                  import_server.TempleRegistry.createText(` block in this case
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "inline": true }, [
                    ...this._toNodeList(`e`)
                  ]),
                  import_server.TempleRegistry.createText(` is an 
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "lang": `js`, "inline": true }, [
                    ...this._toNodeList(`Error`)
                  ]),
                  import_server.TempleRegistry.createText(` object
          that can only be used with in the block. 
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("nav", { "class": `pager` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("a", { "class": `prev`, "href": `/temple/docs/getting-started.html` }, [
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("i", { "class": `fas fa-fw fa-chevron-left` }, []),
                    import_server.TempleRegistry.createText(`
            `, false),
                    ...this._toNodeList(_("Getting Started")),
                    import_server.TempleRegistry.createText(`
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("a", { "class": `next`, "href": `/temple/docs/state-management.html` }, [
                    import_server.TempleRegistry.createText(`
            `, false),
                    ...this._toNodeList(_("State Management")),
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("i", { "class": `fas fa-fw fa-chevron-right` }, []),
                    import_server.TempleRegistry.createText(`
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
        `, false)
                ]),
                import_server.TempleRegistry.createText(`
      `, false)
              ]),
              import_server.TempleRegistry.createText(`
      `, false),
              import_server.TempleRegistry.createElement("footer", { "class": `foot` }, []),
              import_server.TempleRegistry.createText(`
    `, false)
            ]),
            import_server.TempleRegistry.createText(`
  `, false)
          ]),
          import_server.TempleRegistry.createText(`
`, false)
        ])
      ];
    }
  };
  return __toCommonJS(markup_syntax_exports);
})();
