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

  // temple-document-server-plugin:/Users/cblanquera/server/projects/ossph/temple/packages/temple-web/src/pages/docs/component-publisher.dtml
  var component_publisher_exports = {};
  __export(component_publisher_exports, {
    default: () => ComponentPublisher_8f2ff6d48aec3c3f0dc4
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

  // temple-document-server-plugin:/Users/cblanquera/server/projects/ossph/temple/packages/temple-web/src/pages/docs/component-publisher.dtml
  var ComponentPublisher_8f2ff6d48aec3c3f0dc4 = class extends import_server.TempleDocument {
    id() {
      return "8f2ff6d48aec3c3f0dc4";
    }
    styles() {
      return ``;
    }
    template() {
      const url = "/docs/component-publisher.html";
      const title = _("Component Publisher - Temple reactive web component template engine.");
      const description = _("How to use Temple to publish web components.");
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
              import_server.TempleRegistry.createElement("link", { "rel": `stylesheet`, "type": `text/css`, "href": `/temple/build/client/${(0, import_server2.env)("BUILD_ID")}.css` }),
              import_server.TempleRegistry.createText(`
  
  `, false),
              import_server.TempleRegistry.createElement("script", { "data-app": (0, import_server2.env)("APP_DATA"), "src": `/temple/build/client/${(0, import_server2.env)("BUILD_ID")}.js` }),
              import_server.TempleRegistry.createText(`
  `, false),
              ...!!((0, import_server2.env)("NODE_ENV") === "development") ? [
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
          import_server.TempleRegistry.createElement("body", { "class": `dark panel with-head with-left` }, [
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
            import_server.TempleRegistry.createElement("panel-main", { "class": `panel-main` }, [
              import_server.TempleRegistry.createText(`
      `, false),
              import_server.TempleRegistry.createElement("div", { "class": `docs container` }, [
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("h1", {}, [
                  ...this._toNodeList(_("Component Publisher"))
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Web components are a set of web platform APIs that allow you 
          to create new custom, reusable, encapsulated HTML tags to use 
          in web pages and web apps. Custom components and widgets build 
          on the Web Component standards, will work across modern 
          browsers, and can be used with any JavaScript library or 
          framework that works with HTML.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          Web components are based on existing web standards. Features 
          to support web components are currently being added to the 
          HTML and DOM specs, letting web developers easily extend HTML 
          with new elements with encapsulated styling and custom behavior.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("tui-alert", { "solid": true, "curved": true, "info": true }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("i", { "class": `fas fa-info-circle` }, []),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("strong", {}, [
                    import_server.TempleRegistry.createText(`Note:`, false)
                  ]),
                  import_server.TempleRegistry.createText(` Web components even work in React 
          projects.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`

        `, false),
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          First, create a project with the following structure and files.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("ide-app", { "panel": 290, "title": `My Project` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("div", { "class": `panel-head` }, [
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("div", { "class": `tabs` }, [
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("tui-tab", { "class": `tab active`, "group": `project`, "selector": `#build-ts` }, [
                        import_server.TempleRegistry.createText(`
                src/build.ts
              `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("tui-tab", { "class": `tab`, "group": `project`, "selector": `#component-tml` }, [
                        import_server.TempleRegistry.createText(`
                src/component.tml
              `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("tui-tab", { "class": `tab`, "group": `project`, "selector": `#package-json` }, [
                        import_server.TempleRegistry.createText(`
                package.json
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
                  import_server.TempleRegistry.createElement("div", { "class": `panel-left` }, [
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("h5", { "class": `folder` }, [
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("i", { "class": `fas fa-fw fa-chevron-down` }, []),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("span", {}, [
                        import_server.TempleRegistry.createText(`src`, false)
                      ]),
                      import_server.TempleRegistry.createText(`
            `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("tui-tab", { "class": `shift-1 block active`, "group": `project`, "selector": `#build-ts` }, [
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("i", { "class": `fas fa-fw fa-file` }, []),
                      import_server.TempleRegistry.createText(`
              build.ts
            `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("tui-tab", { "class": `shift-1 block`, "group": `project`, "selector": `#component-tml` }, [
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("i", { "class": `fas fa-fw fa-file` }, []),
                      import_server.TempleRegistry.createText(`
              component.tml
            `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("tui-tab", { "class": `block`, "group": `project`, "selector": `#package-json` }, [
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("i", { "class": `fas fa-fw fa-file` }, []),
                      import_server.TempleRegistry.createText(`
              package.json
            `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("div", { "class": `panel-main` }, [
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("main", {}, [
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("ide-code", { "id": `build-ts`, "lang": `js`, "numbers": true, "trim": true, "detab": 16 }, [
                        ...this._toNodeList(`
                import http from 'http';
                import temple from '@ossph/temple/compiler';

                //create temple compiler
                const compiler = temple({ cwd: __dirname });
                //load component, and render
                const component = compiler
                  .fromSource('./component.tml')
                  .component();
                
                //save component
                compiler.fs.writeFileSync('/path/to/component.js', component);
              `)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("ide-code", { "id": `component-tml`, "style": `display:none`, "numbers": true, "trim": true, "detab": 16 }, [
                        ...this._toNodeList(`
                <style>
                  .title { text-align: center; }
                </style>
                <script>
                  const title = 'Hello';
                </script>
                <h1 class="title">{title}</h1>
              `)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("ide-code", { "id": `package-json`, "style": `display:none`, "lang": `js`, "numbers": true, "trim": true, "detab": 16 }, [
                        ...this._toNodeList(`
                {
                  "name": "my-project",
                  "version": "1.0.0",
                  "private": true,
                  "scripts": {
                    "build": "ts-node ./src/build.ts"
                  },
                  "dependencies": {
                    "@ossph/temple": "0.1.0"
                  },
                  "devDependencies": {
                    "@ossph/temple-dev": "0.1.0",
                    "@types/node": "22.1.0",
                    "ts-node": "10.9.2",
                    "typescript": "5.5.4"
                  }
                }
              `)
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
                import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true }, [
                  import_server.TempleRegistry.createText(`
          To test the build script and see the results, run the 
          following command in terminal.
        `, false)
                ]),
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("ide-code", { "lang": `bash` }, [
                  import_server.TempleRegistry.createText(`
          npm run build
        `, false)
                ]),
                import_server.TempleRegistry.createText(`
        
        `, false),
                import_server.TempleRegistry.createElement("nav", { "class": `pager` }, [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("a", { "class": `prev`, "href": `/temple/docs/static-site.html` }, [
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("i", { "class": `fas fa-fw fa-chevron-left` }, []),
                    import_server.TempleRegistry.createText(`
            Static Site Generator
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("a", { "class": `next`, "href": `/temple/docs/developer-tools.html` }, [
                    import_server.TempleRegistry.createText(`
            Developer Tools
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
  return __toCommonJS(component_publisher_exports);
})();
