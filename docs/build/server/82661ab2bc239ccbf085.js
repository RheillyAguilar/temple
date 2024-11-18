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

  // ../../node_modules/@ossph/temple/dist/Exception.js
  var require_Exception = __commonJS({
    "../../node_modules/@ossph/temple/dist/Exception.js"(exports) {
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

  // ../../node_modules/@ossph/temple/dist/server/TempleCollection.js
  var require_TempleCollection = __commonJS({
    "../../node_modules/@ossph/temple/dist/server/TempleCollection.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var TempleCollection = class {
        get length() {
          return this._elements.size;
        }
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
          return Array.from(this._elements).filter(Boolean).map((child) => child.toString()).join("");
        }
      };
      exports.default = TempleCollection;
    }
  });

  // ../../node_modules/@ossph/temple/dist/server/data.js
  var require_data = __commonJS({
    "../../node_modules/@ossph/temple/dist/server/data.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var data = /* @__PURE__ */ new Map();
      exports.default = data;
    }
  });

  // ../../node_modules/@ossph/temple/dist/server/TempleText.js
  var require_TempleText = __commonJS({
    "../../node_modules/@ossph/temple/dist/server/TempleText.js"(exports) {
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

  // ../../node_modules/@ossph/temple/dist/server/TempleElement.js
  var require_TempleElement = __commonJS({
    "../../node_modules/@ossph/temple/dist/server/TempleElement.js"(exports) {
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
        get attributes() {
          return this._attributes;
        }
        get children() {
          return this._children;
        }
        get name() {
          return this._name;
        }
        get props() {
          return this._props;
        }
        constructor(name, attributes = {}, props = "", children = []) {
          this._attributes = {};
          this._name = name;
          this._attributes = attributes;
          this._props = props;
          this._children = new TempleCollection_1.default(children);
        }
        toString() {
          const entries = Object.entries(this._attributes);
          const attributes = entries.length > 0 ? " " + entries.map(([key, value]) => {
            if (typeof value === "string" && !/["<>\n]/.test(value)) {
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

  // ../../node_modules/@ossph/temple/dist/server/TempleRegistry.js
  var require_TempleRegistry = __commonJS({
    "../../node_modules/@ossph/temple/dist/server/TempleRegistry.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var TempleText_1 = __importDefault(require_TempleText());
      var TempleElement_1 = __importDefault(require_TempleElement());
      var TempleRegistry2 = class {
        static render(markup) {
          return markup.filter(Boolean).map((child) => child.toString()).join("");
        }
        static registry(markup, registry = /* @__PURE__ */ new Set()) {
          markup.forEach((node) => {
            if (node instanceof TempleElement_1.default) {
              if (!["html", "head", "body"].includes(node.name)) {
                registry.add(node);
              }
              if (node.name !== "head" && node.children.length > 0) {
                this.registry(node.children.toArray(), registry);
              }
            }
          });
          return registry;
        }
        static createElement(name, attributes, props, children = []) {
          return new TempleElement_1.default(name, attributes, props, children);
        }
        static createText(value, escape = true) {
          return new TempleText_1.default(value, escape);
        }
      };
      exports.default = TempleRegistry2;
    }
  });

  // ../../node_modules/@ossph/temple/dist/server/TempleDocument.js
  var require_TempleDocument = __commonJS({
    "../../node_modules/@ossph/temple/dist/server/TempleDocument.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var Exception_1 = __importDefault(require_Exception());
      var data_1 = __importDefault(require_data());
      var TempleRegistry_1 = __importDefault(require_TempleRegistry());
      var TempleDocument2 = class {
        bindings() {
          const registry = TempleRegistry_1.default.registry(this.template());
          const bindings = Array.from(registry.values()).map((element, id) => {
            return element.props !== "{ }" ? `'${id}': ${element.props}` : "";
          }).filter((binding) => binding !== "").join(", ");
          return `{ ${bindings} }`;
        }
        render(props = {}) {
          data_1.default.set("props", props || {});
          data_1.default.set("env", Object.assign(Object.assign({}, process.env || {}), { BUILD_ID: this.id(), APP_DATA: btoa(JSON.stringify(Object.assign(Object.assign({}, Object.fromEntries(data_1.default.entries())), { env: Object.assign(Object.assign({}, Object.fromEntries(Object.entries(process.env || {}).filter((entry) => entry[0].startsWith("PUBLIC_")))), { BUILD_ID: this.id() }) }))) }));
          const children = this.template();
          let document2 = TempleRegistry_1.default.render(children).trim();
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

  // ../../node_modules/@ossph/temple/dist/server/TempleEmitter.js
  var require_TempleEmitter = __commonJS({
    "../../node_modules/@ossph/temple/dist/server/TempleEmitter.js"(exports) {
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

  // ../../node_modules/@ossph/temple/dist/server/env.js
  var require_env = __commonJS({
    "../../node_modules/@ossph/temple/dist/server/env.js"(exports) {
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

  // ../../node_modules/@ossph/temple/dist/server/props.js
  var require_props = __commonJS({
    "../../node_modules/@ossph/temple/dist/server/props.js"(exports) {
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

  // ../../node_modules/@ossph/temple/dist/server.js
  var require_server = __commonJS({
    "../../node_modules/@ossph/temple/dist/server.js"(exports) {
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
      exports.TempleText = exports.TempleException = exports.TempleEmitter = exports.TempleElement = exports.TempleRegistry = exports.TempleDocument = exports.TempleCollection = exports.props = exports.emitter = exports.env = exports.data = void 0;
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
    }
  });

  // ../../node_modules/@ossph/temple/server.js
  var require_server2 = __commonJS({
    "../../node_modules/@ossph/temple/server.js"(exports, module) {
      module.exports = { ...require_server() };
    }
  });

  // temple-document-server-resolver:C:\Users\rheil\Desktop\Work\Temple\temple\packages\temple-web\src\pages\docs\single-page.dtml
  var single_page_exports = {};
  __export(single_page_exports, {
    default: () => SinglePage_82661ab2bc239ccbf085
  });
  var import_server = __toESM(require_server2());
  var import_server2 = __toESM(require_server2());

  // src/components/i18n/index.ts
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

  // temple-document-server-resolver:C:\Users\rheil\Desktop\Work\Temple\temple\packages\temple-web\src\pages\docs\single-page.dtml
  var SinglePage_82661ab2bc239ccbf085 = class extends import_server.TempleDocument {
    id() {
      return "82661ab2bc239ccbf085";
    }
    styles() {
      return `@temple theme;
  @temple reset;
  @temple fouc-opacity;
  @temple utilities;`;
    }
    template() {
      const url = "/docs/single-page.html";
      const title = _("Single Page App - Temple reactive web component template engine.");
      const description = _("How to use Temple to develop single page apps.");
      const toggle = () => {
        document.getElementsByTagName("panel-layout")[0].toggle("left");
      };
      const themeMap = {
        // Light Theme
        dark: { nextTheme: "light", options: { iconAdd: ["fa-moon", "bg-black", "tx-white"], iconRemove: ["fa-sun", "bg-white", "tx-black"], linkAdd: ["tx-black"], linkRemove: ["tx-white"], tweetBoxAdd: ["tx-white"], tweetBoxRemove: ["tx-black"], terminalAdd: ["tx-white"], terminalRemove: ["tx-black"] } },
        // Light-Violet Theme
        "dark-violet": { nextTheme: "light-violet", options: { iconAdd: ["fa-moon", "bg-h-8d52aa", "tx-white"], iconRemove: ["fa-sun", "bg-white", "tx-black"], linkAdd: ["tx-black"], linkRemove: ["tx-white"], tweetBoxAdd: ["tx-white"], tweetBoxRemove: ["tx-black"], terminalAdd: [], terminalRemove: ["tx-white"] } },
        // Dark-Violet Theme
        "light-violet": { nextTheme: "dark-violet", options: { iconAdd: ["fa-sun", "bg-h-4c0e65", "tx-black"], iconRemove: ["fa-moon", "bg-h-8d52aa"], linkAdd: ["tx-white"], linkRemove: ["tx-black"], tweetBoxAdd: ["tx-white"], tweetBoxRemove: [], terminalAdd: ["tx-white"], terminalRemove: [] } },
        // Light-Pink Theme
        "dark-pink": { nextTheme: "light-pink", options: { iconAdd: ["fa-moon", "bg-h-aa5275", "tx-white"], iconRemove: ["fa-sun", "bg-h-43091d", "tx-black"], linkAdd: ["tx-black"], linkRemove: ["tx-white"], tweetBoxAdd: ["tx-white"], tweetBoxRemove: ["tx-black"], terminalAdd: [], terminalRemove: ["tx-white"] } },
        // Dark-Pink Theme
        "light-pink": { nextTheme: "dark-pink", options: { iconAdd: ["fa-sun", "bg-h-43091d", "tx-black"], iconRemove: ["fa-moon", "bg-h-aa5275"], linkAdd: ["tx-white"], linkRemove: ["tx-black"], tweetBoxAdd: ["tx-white"], tweetBoxRemove: [], terminalAdd: ["tx-white"], terminalRemove: [] } },
        // Light-Blue Theme
        "dark-blue": { nextTheme: "light-blue", options: { iconAdd: ["fa-moon", "bg-h-5290aa", "tx-white"], iconRemove: ["fa-sun", "bg-h-03131d", "tx-black"], linkAdd: ["tx-black"], linkRemove: ["tx-white"], tweetBoxAdd: ["tx-white"], tweetBoxRemove: ["tx-black"], terminalAdd: [], terminalRemove: ["tx-white"] } },
        // Dark-Blue Theme
        "light-blue": { nextTheme: "dark-blue", options: { iconAdd: ["fa-sun", "bg-h-03131d", "tx-black"], iconRemove: ["fa-moon", "bg-h-5290aa"], linkAdd: ["tx-white"], linkRemove: ["tx-black"], tweetBoxAdd: ["tx-white"], tweetBoxRemove: [], terminalAdd: ["tx-white"], terminalRemove: [] } },
        // Light-Green Theme
        "dark-green": { nextTheme: "light-green", options: { iconAdd: ["fa-moon", "bg-h-84aa52", "tx-white"], iconRemove: ["fa-sun", "bg-h-2b650e", "tx-black"], linkAdd: ["tx-black"], linkRemove: ["tx-white"], tweetBoxAdd: ["tx-white"], tweetBoxRemove: ["tx-black"], terminalAdd: [], terminalRemove: ["tx-white"] } },
        // Dark-Green The,e
        "light-green": { nextTheme: "dark-green", options: { iconAdd: ["fa-sun", "bg-h-2b650e", "tx-black"], iconRemove: ["fa-moon", "bg-h-84aa52"], linkAdd: ["tx-white"], linkRemove: ["tx-black"], tweetBoxAdd: ["tx-white"], tweetBoxRemove: [], terminalAdd: ["tx-white"], terminalRemove: [] } },
        // Dark Theme
        light: { nextTheme: "dark", options: { iconAdd: ["fa-sun", "bg-white", "tx-black"], iconRemove: ["fa-moon", "bg-black", "tx-white"], linkAdd: ["tx-white"], linkRemove: ["tx-black"], tweetBoxAdd: ["tx-black"], tweetBoxRemove: ["tx-white"], terminalAdd: ["tx-black"], terminalRemove: ["tx-white"] } }
      };
      const toggleClasses = (element, addClasses, removeClasses) => {
        if (element) {
          element.classList.add(...addClasses);
          element.classList.remove(...removeClasses);
        }
      };
      const savedTheme = () => {
        const savedTheme2 = localStorage.getItem("theme");
        const icon = document.getElementById("modeIcon");
        const tweetBoxes = document.querySelectorAll("tweet-box");
        const textLinks = document.querySelectorAll("a");
        const terminals = document.querySelectorAll("ide-code");
        if (savedTheme2) {
          const themeClasses = [
            "dark",
            "light",
            "dark-violet",
            "light-violet",
            "dark-pink",
            "light-pink",
            "dark-blue",
            "light-blue",
            "dark-green",
            "light-green"
          ];
          themeClasses.forEach((themeClass) => document.body.classList.remove(themeClass));
          document.body.classList.add(savedTheme2);
          if (savedTheme2 === "dark-violet") {
            toggleClasses(icon, ["bg-h-8d52aa", "tx-white"], ["bg-white", "tx-black"]);
          } else if (savedTheme2 === "light-violet") {
            toggleClasses(icon, ["fa-moon", "bg-h-4c0e65", "tx-white"], ["fa-sun", "bg-white", "tx-black"]);
            tweetBoxes.forEach((tweetBox) => toggleClasses(tweetBox, ["tx-white"], ["tx-black"]));
            textLinks.forEach((link) => toggleClasses(link, ["tx-black"], ["tx-white"]));
            terminals.forEach((terminal) => toggleClasses(terminal, ["tx-white"], ["tx-black"]));
          } else if (savedTheme2 === "dark-pink") {
            toggleClasses(icon, ["bg-h-43091d", "tx-white"], ["bg-white", "tx-black"]);
          } else if (savedTheme2 === "light-pink") {
            toggleClasses(icon, ["fa-moon", "bg-h-aa5275", "tx-white"], ["fa-sun", "bg-white", "tx-black"]);
            tweetBoxes.forEach((tweetBox) => toggleClasses(tweetBox, ["tx-white"], ["tx-black"]));
            textLinks.forEach((link) => toggleClasses(link, ["tx-black"], ["tx-white"]));
            terminals.forEach((terminal) => toggleClasses(terminal, ["tx-white"], ["tx-black"]));
          } else if (savedTheme2 === "dark-blue") {
            toggleClasses(icon, ["bg-h-03131d", "tx-white"], ["bg-white", "tx-black"]);
          } else if (savedTheme2 === "light-blue") {
            toggleClasses(icon, ["fa-moon", "bg-h-5290aa", "tx-white"], ["fa-sun", "bg-white", "tx-black"]);
            tweetBoxes.forEach((tweetBox) => toggleClasses(tweetBox, ["tx-white"], ["tx-black"]));
            textLinks.forEach((link) => toggleClasses(link, ["tx-black"], ["tx-white"]));
            terminals.forEach((terminal) => toggleClasses(terminal, ["tx-white"], ["tx-black"]));
          } else if (savedTheme2 === "dark-green") {
            toggleClasses(icon, ["bg-h-2b650e", "tx-white"], ["bg-white", "tx-black"]);
          } else if (savedTheme2 === "light-green") {
            toggleClasses(icon, ["fa-moon", "bg-h-84aa52", "tx-white"], ["fa-sun", "bg-white", "tx-black"]);
            tweetBoxes.forEach((tweetBox) => toggleClasses(tweetBox, ["tx-white"], ["tx-black"]));
            textLinks.forEach((link) => toggleClasses(link, ["tx-black"], ["tx-white"]));
            terminals.forEach((terminal) => toggleClasses(terminal, ["tx-white"], ["tx-black"]));
          } else if (savedTheme2 === "light") {
            toggleClasses(icon, ["fa-moon", "bg-black", "tx-white"], ["fa-sun", "bg-white", "tx-black"]);
            tweetBoxes.forEach((tweetBox) => toggleClasses(tweetBox, ["tx-white"], ["tx-black"]));
            textLinks.forEach((link) => toggleClasses(link, ["tx-black"], ["tx-white"]));
            terminals.forEach((terminal) => toggleClasses(terminal, ["tx-white"], ["tx-black"]));
          }
        }
      };
      const toggleTheme = (fromClass, toClass, iconConfig) => {
        const body = document.body;
        const icon = document.getElementById("modeIcon");
        const textA = document.querySelectorAll("a");
        const tweetBoxes = document.querySelectorAll("tweet-box");
        const terminals = document.querySelectorAll("ide-code");
        body.classList.replace(fromClass, toClass);
        textA.forEach((link) => toggleClasses(link, iconConfig.linkAdd, iconConfig.linkRemove));
        tweetBoxes.forEach((tweetBox) => toggleClasses(tweetBox, iconConfig.tweetBoxAdd, iconConfig.tweetBoxRemove));
        terminals.forEach((terminal) => toggleClasses(terminal, iconConfig.terminalAdd, iconConfig.terminalRemove));
        toggleClasses(icon, iconConfig.iconAdd, iconConfig.iconRemove);
        localStorage.setItem("theme", toClass);
      };
      const toggleMode = () => {
        const body = document.body;
        const currentTheme = Object.keys(themeMap).find((theme) => body.classList.contains(theme));
        if (currentTheme) {
          const { nextTheme, options } = themeMap[currentTheme];
          toggleTheme(currentTheme, nextTheme, options);
        }
      };
      const toggleViolet = () => {
        const body = document.body;
        if (body.classList.contains("dark")) {
          toggleTheme("dark", "dark-violet", {
            iconAdd: ["bg-h-8d52aa", "tx-white"],
            iconRemove: ["bg-white", "tx-black"],
            linkAdd: ["tx-white"],
            linkRemove: ["tx-dark"],
            tweetBoxAdd: ["bg-violet-light"],
            tweetBoxRemove: ["bg-dark"],
            terminalAdd: ["bg-terminal-violet"],
            terminalRemove: ["bg-terminal-dark"]
          });
        } else if (body.classList.contains("light")) {
          toggleTheme("light", "light-violet", {
            iconAdd: ["bg-h-4c0e65"],
            iconRemove: ["bg-black"],
            linkAdd: ["tx-black"],
            linkRemove: ["text-white"],
            tweetBoxAdd: ["tx-white"],
            tweetBoxRemove: ["tx-black"],
            terminalAdd: ["bg-terminal-violet-light"],
            terminalRemove: ["bg-terminal-light"]
          });
        } else if (body.classList.contains("dark-pink")) {
          toggleTheme("dark-pink", "dark-violet", {
            iconAdd: ["bg-h-4c0e65"],
            iconRemove: ["bg-h-43091d"],
            linkAdd: ["text-violet-dark"],
            linkRemove: ["text-pink-dark"],
            tweetBoxAdd: ["bg-violet-dark"],
            tweetBoxRemove: ["bg-pink-dark"],
            terminalAdd: ["bg-terminal-violet-dark"],
            terminalRemove: ["bg-terminal-pink-dark"]
          });
        } else if (body.classList.contains("light-pink")) {
          toggleTheme("light-pink", "light-violet", {
            iconAdd: ["bg-h-4c0e65"],
            iconRemove: ["bg-h-aa5275"],
            linkAdd: ["text-violet-light"],
            linkRemove: ["text-pink-light"],
            tweetBoxAdd: ["bg-violet-light"],
            tweetBoxRemove: ["bg-pink-light"],
            terminalAdd: ["bg-terminal-violet-light"],
            terminalRemove: ["bg-terminal-pink-light"]
          });
        } else if (body.classList.contains("dark-blue")) {
          toggleTheme("dark-blue", "dark-violet", {
            iconAdd: ["bg-h-8d52aa"],
            iconRemove: ["bg-h-03131d"],
            linkAdd: ["text-violet"],
            linkRemove: ["text-dark"],
            tweetBoxAdd: ["bg-violet-light"],
            tweetBoxRemove: ["bg-dark"],
            terminalAdd: ["bg-terminal-violet"],
            terminalRemove: ["bg-terminal-dark"]
          });
        } else if (body.classList.contains("light-blue")) {
          toggleTheme("light-blue", "light-violet", {
            iconAdd: ["bg-h-4c0e65"],
            iconRemove: ["bg-h-5290aa"],
            linkAdd: ["text-violet-light"],
            linkRemove: ["text-dark"],
            tweetBoxAdd: ["bg-violet-light"],
            tweetBoxRemove: ["bg-light"],
            terminalAdd: ["bg-terminal-violet-light"],
            terminalRemove: ["bg-terminal-light"]
          });
        } else if (body.classList.contains("dark-green")) {
          toggleTheme("dark-green", "dark-violet", {
            iconAdd: ["bg-h-8d52aa", "tx-white"],
            iconRemove: ["bg-h-2b650e", "tx-black"],
            linkAdd: ["text-violet-dark"],
            linkRemove: ["text-pink-dark"],
            tweetBoxAdd: ["bg-violet-dark"],
            tweetBoxRemove: ["bg-pink-dark"],
            terminalAdd: ["bg-terminal-violet-dark"],
            terminalRemove: ["bg-terminal-pink-dark"]
          });
        } else if (body.classList.contains("light-green")) {
          toggleTheme("light-green", "light-violet", {
            iconAdd: ["bg-h-4c0e65", "tx-white"],
            iconRemove: ["bg-h-84aa52", "tx-black"],
            linkAdd: ["text-violet-dark"],
            linkRemove: ["text-pink-dark"],
            tweetBoxAdd: ["bg-violet-dark"],
            tweetBoxRemove: ["bg-pink-dark"],
            terminalAdd: ["bg-terminal-violet-dark"],
            terminalRemove: ["bg-terminal-pink-dark"]
          });
        }
      };
      const togglePink = () => {
        const body = document.body;
        if (body.classList.contains("dark")) {
          toggleTheme("dark", "dark-pink", {
            iconAdd: ["bg-h-43091d", "tx-white"],
            iconRemove: ["bg-white", "tx-black"],
            linkAdd: ["text-pink"],
            linkRemove: ["text-dark"],
            tweetBoxAdd: ["bg-pink-dark"],
            tweetBoxRemove: ["bg-dark"],
            terminalAdd: ["bg-terminal-pink-dark"],
            terminalRemove: ["bg-terminal-dark"]
          });
        } else if (body.classList.contains("light")) {
          toggleTheme("light", "light-pink", {
            iconAdd: ["bg-h-aa5275"],
            iconRemove: ["bg-black"],
            linkAdd: ["text-pink-light"],
            linkRemove: ["text-light"],
            tweetBoxAdd: ["bg-pink-light"],
            tweetBoxRemove: ["bg-light"],
            terminalAdd: ["bg-terminal-pink-light"],
            terminalRemove: ["bg-terminal-light"]
          });
        } else if (body.classList.contains("dark-violet")) {
          toggleTheme("dark-violet", "dark-pink", {
            iconAdd: ["bg-h-43091d"],
            iconRemove: ["bg-h-4c0e65"],
            linkAdd: ["text-pink-dark"],
            linkRemove: ["text-violet-dark"],
            tweetBoxAdd: ["bg-pink-dark"],
            tweetBoxRemove: ["bg-violet-dark"],
            terminalAdd: ["bg-terminal-pink-dark"],
            terminalRemove: ["bg-terminal-violet-dark"]
          });
        } else if (body.classList.contains("light-violet")) {
          toggleTheme("light-violet", "light-pink", {
            iconAdd: ["bg-h-aa5275"],
            iconRemove: ["bg-h-4c0e65"],
            linkAdd: ["text-pink-light"],
            linkRemove: ["text-violet-light"],
            tweetBoxAdd: ["bg-pink-light"],
            tweetBoxRemove: ["bg-violet-light"],
            terminalAdd: ["bg-terminal-pink-light"],
            terminalRemove: ["bg-terminal-violet-light"]
          });
        } else if (body.classList.contains("dark-blue")) {
          toggleTheme("dark-blue", "dark-pink", {
            iconAdd: ["bg-h-43091d"],
            iconRemove: ["bg-h-03131d"],
            linkAdd: ["text-pink-dark"],
            linkRemove: ["text-blue-dark"],
            tweetBoxAdd: ["bg-pink-dark"],
            tweetBoxRemove: ["bg-blue-dark"],
            terminalAdd: ["bg-terminal-pink-dark"],
            terminalRemove: ["bg-terminal-blue-dark"]
          });
        } else if (body.classList.contains("light-blue")) {
          toggleTheme("light-blue", "light-pink", {
            iconAdd: ["bg-h-aa5275"],
            iconRemove: ["bg-h-5290aa"],
            linkAdd: ["text-pink-light"],
            linkRemove: ["text-blue-light"],
            tweetBoxAdd: ["bg-pink-light"],
            tweetBoxRemove: ["bg-blue-light"],
            terminalAdd: ["bg-terminal-pink-light"],
            terminalRemove: ["bg-terminal-blue-light"]
          });
        } else if (body.classList.contains("dark-green")) {
          toggleTheme("dark-green", "dark-pink", {
            iconAdd: ["bg-h-43091d"],
            iconRemove: ["bg-h-2b650e"],
            linkAdd: ["text-pink-dark"],
            linkRemove: ["text-green-dark"],
            tweetBoxAdd: ["bg-pink-dark"],
            tweetBoxRemove: ["bg-green-dark"],
            terminalAdd: ["bg-terminal-pink-dark"],
            terminalRemove: ["bg-terminal-green-dark"]
          });
        } else if (body.classList.contains("light-green")) {
          toggleTheme("light-green", "light-pink", {
            iconAdd: ["bg-h-aa5275"],
            iconRemove: ["bg-h-84aa52"],
            linkAdd: ["text-pink-light"],
            linkRemove: ["text-green-light"],
            tweetBoxAdd: ["bg-pink-light"],
            tweetBoxRemove: ["bg-green-light"],
            terminalAdd: ["bg-terminal-pink-light"],
            terminalRemove: ["bg-terminal-green-light"]
          });
        }
      };
      const toggleBlue = () => {
        const body = document.body;
        if (body.classList.contains("dark")) {
          toggleTheme("dark", "dark-blue", {
            iconAdd: ["bg-h-03131d", "tx-white"],
            iconRemove: ["bg-white", "tx-black"],
            linkAdd: ["text-blue-dark"],
            linkRemove: ["text-dark"],
            tweetBoxAdd: ["bg-blue-dark"],
            tweetBoxRemove: ["bg-dark"],
            terminalAdd: ["bg-terminal-blue-dark"],
            terminalRemove: ["bg-terminal-dark"]
          });
        } else if (body.classList.contains("light")) {
          toggleTheme("light", "light-blue", {
            iconAdd: ["bg-h-5290aa", "tx-white"],
            iconRemove: ["bg-black"],
            linkAdd: ["text-blue-light"],
            linkRemove: ["text-light"],
            tweetBoxAdd: ["bg-blue-light"],
            tweetBoxRemove: ["bg-light"],
            terminalAdd: ["bg-terminal-blue-light"],
            terminalRemove: ["bg-terminal-light"]
          });
        } else if (body.classList.contains("dark-pink")) {
          toggleTheme("dark-pink", "dark-blue", {
            iconAdd: ["bg-h-03131d"],
            iconRemove: ["bg-h-43091d"],
            linkAdd: ["text-blue-dark"],
            linkRemove: ["text-pink-dark"],
            tweetBoxAdd: ["bg-blue-dark"],
            tweetBoxRemove: ["bg-pink-dark"],
            terminalAdd: ["bg-terminal-blue-dark"],
            terminalRemove: ["bg-terminal-pink-dark"]
          });
        } else if (body.classList.contains("light-pink")) {
          toggleTheme("light-pink", "light-blue", {
            iconAdd: ["bg-h-5290aa"],
            iconRemove: ["bg-h-aa5275"],
            linkAdd: ["text-blue-light"],
            linkRemove: ["text-pink-light"],
            tweetBoxAdd: ["bg-blue-light"],
            tweetBoxRemove: ["bg-pink-light"],
            terminalAdd: ["bg-terminal-blue-light"],
            terminalRemove: ["bg-terminal-pink-light"]
          });
        } else if (body.classList.contains("dark-violet")) {
          toggleTheme("dark-violet", "dark-blue", {
            iconAdd: ["bg-h-03131d"],
            iconRemove: ["bg-h-8d52aa"],
            linkAdd: ["text-blue-dark"],
            linkRemove: ["text-violet-dark"],
            tweetBoxAdd: ["bg-blue-dark"],
            tweetBoxRemove: ["bg-violet-dark"],
            terminalAdd: ["bg-terminal-blue-dark"],
            terminalRemove: ["bg-terminal-violet-dark"]
          });
        } else if (body.classList.contains("light-violet")) {
          toggleTheme("light-violet", "light-blue", {
            iconAdd: ["bg-h-5290aa"],
            iconRemove: ["bg-h-4c0e65"],
            linkAdd: ["text-blue-light"],
            linkRemove: ["text-violet-light"],
            tweetBoxAdd: ["bg-blue-light"],
            tweetBoxRemove: ["bg-violet-light"],
            terminalAdd: ["bg-terminal-blue-light"],
            terminalRemove: ["bg-terminal-violet-light"]
          });
        } else if (body.classList.contains("dark-green")) {
          toggleTheme("dark-green", "dark-blue", {
            iconAdd: ["bg-h-03131d"],
            iconRemove: ["bg-h-2b650e"],
            linkAdd: ["text-blue-dark"],
            linkRemove: ["text-green-dark"],
            tweetBoxAdd: ["bg-blue-dark"],
            tweetBoxRemove: ["bg-green-dark"],
            terminalAdd: ["bg-terminal-blue-dark"],
            terminalRemove: ["bg-terminal-green-dark"]
          });
        } else if (body.classList.contains("light-green")) {
          toggleTheme("light-green", "light-blue", {
            iconAdd: ["bg-h-5290aa"],
            iconRemove: ["bg-h-84aa52"],
            linkAdd: ["text-blue-light"],
            linkRemove: ["text-green-light"],
            tweetBoxAdd: ["bg-blue-light"],
            tweetBoxRemove: ["bg-green-light"],
            terminalAdd: ["bg-terminal-blue-light"],
            terminalRemove: ["bg-terminal-green-light"]
          });
        }
      };
      const toggleGreen = () => {
        const body = document.body;
        if (body.classList.contains("dark")) {
          toggleTheme("dark", "dark-green", {
            iconAdd: ["bg-h-2b650e", "tx-white"],
            iconRemove: ["bg-white", "tx-black"],
            linkAdd: ["text-green-dark"],
            linkRemove: ["text-dark"],
            tweetBoxAdd: ["bg-green-dark"],
            tweetBoxRemove: ["bg-dark"],
            terminalAdd: ["bg-terminal-green-dark"],
            terminalRemove: ["bg-terminal-dark"]
          });
        } else if (body.classList.contains("light")) {
          toggleTheme("light", "light-green", {
            iconAdd: ["bg-h-84aa52", "tx-white"],
            iconRemove: ["bg-black"],
            linkAdd: ["text-green-light"],
            linkRemove: ["text-light"],
            tweetBoxAdd: ["bg-green-light"],
            tweetBoxRemove: ["bg-light"],
            terminalAdd: ["bg-terminal-green-light"],
            terminalRemove: ["bg-terminal-light"]
          });
        } else if (body.classList.contains("dark-blue")) {
          toggleTheme("dark-blue", "dark-green", {
            iconAdd: ["bg-h-2b650e"],
            iconRemove: ["bg-h-03131d"],
            linkAdd: ["text-green-dark"],
            linkRemove: ["text-blue-dark"],
            tweetBoxAdd: ["bg-green-dark"],
            tweetBoxRemove: ["bg-blue-dark"],
            terminalAdd: ["bg-terminal-green-dark"],
            terminalRemove: ["bg-terminal-blue-dark"]
          });
        } else if (body.classList.contains("light-blue")) {
          toggleTheme("light-blue", "light-green", {
            iconAdd: ["bg-h-84aa52"],
            iconRemove: ["bg-h-5290aa"],
            linkAdd: ["text-green-light"],
            linkRemove: ["text-blue-light"],
            tweetBoxAdd: ["bg-green-light"],
            tweetBoxRemove: ["bg-blue-light"],
            terminalAdd: ["bg-terminal-green-light"],
            terminalRemove: ["bg-terminal-blue-light"]
          });
        } else if (body.classList.contains("dark-pink")) {
          toggleTheme("dark-pink", "dark-green", {
            iconAdd: ["bg-h-2b650e"],
            iconRemove: ["bg-h-43091d"],
            linkAdd: ["text-green-dark"],
            linkRemove: ["text-pink-dark"],
            tweetBoxAdd: ["bg-green-dark"],
            tweetBoxRemove: ["bg-pink-dark"],
            terminalAdd: ["bg-terminal-green-dark"],
            terminalRemove: ["bg-terminal-pink-dark"]
          });
        } else if (body.classList.contains("light-pink")) {
          toggleTheme("light-pink", "light-green", {
            iconAdd: ["bg-h-84aa52"],
            iconRemove: ["bg-h-aa5275"],
            linkAdd: ["text-green-light"],
            linkRemove: ["text-pink-light"],
            tweetBoxAdd: ["bg-green-light"],
            tweetBoxRemove: ["bg-pink-light"],
            terminalAdd: ["bg-terminal-green-light"],
            terminalRemove: ["bg-terminal-pink-light"]
          });
        } else if (body.classList.contains("dark-violet")) {
          toggleTheme("dark-violet", "dark-green", {
            iconAdd: ["bg-h-2b650e"],
            iconRemove: ["bg-h-8d52aa"],
            linkAdd: ["text-green-dark"],
            linkRemove: ["text-violet-dark"],
            tweetBoxAdd: ["bg-green-dark"],
            tweetBoxRemove: ["bg-violet-dark"],
            terminalAdd: ["bg-terminal-green-dark"],
            terminalRemove: ["bg-terminal-violet-dark"]
          });
        } else if (body.classList.contains("light-violet")) {
          toggleTheme("light-violet", "light-green", {
            iconAdd: ["bg-h-84aa52"],
            iconRemove: ["bg-h-4c0e65"],
            linkAdd: ["text-green-light"],
            linkRemove: ["text-violet-light"],
            tweetBoxAdd: ["bg-green-light"],
            tweetBoxRemove: ["bg-violet-light"],
            terminalAdd: ["bg-terminal-green-light"],
            terminalRemove: ["bg-terminal-violet-light"]
          });
        }
      };
      const toggleDark = () => {
        const body = document.body;
        if (body.classList.contains("dark-violet")) {
          toggleTheme("dark-violet", "dark", {
            iconAdd: ["bg-white", "tx-black"],
            iconRemove: ["bg-h-8d52aa", "tx-white"],
            linkAdd: ["text-violet-dark"],
            linkRemove: ["text-dark"],
            tweetBoxAdd: ["bg-violet-dark"],
            tweetBoxRemove: ["bg-dark"],
            terminalAdd: ["bg-terminal-violet-dark"],
            terminalRemove: ["bg-terminal-dark"]
          });
        } else if (body.classList.contains("light-violet")) {
          toggleTheme("light-violet", "light", {
            iconAdd: ["bg-black"],
            iconRemove: ["bg-h-4c0e65"],
            linkAdd: ["text-violet-light"],
            linkRemove: ["text-dark"],
            tweetBoxAdd: ["bg-violet-light"],
            tweetBoxRemove: ["bg-light"],
            terminalAdd: ["bg-terminal-violet-light"],
            terminalRemove: ["bg-terminal-light"]
          });
        } else if (body.classList.contains("dark-pink")) {
          toggleTheme("dark-pink", "dark", {
            iconAdd: ["bg-white", "tx-black"],
            iconRemove: ["bg-h-43091d", "tx-white"],
            linkAdd: ["text-pink-dark"],
            linkRemove: ["text-dark"],
            tweetBoxAdd: ["bg-pink-dark"],
            tweetBoxRemove: ["bg-dark"],
            terminalAdd: ["bg-terminal-pink-dark"],
            terminalRemove: ["bg-terminal-dark"]
          });
        } else if (body.classList.contains("light-pink")) {
          toggleTheme("light-pink", "light", {
            iconAdd: ["bg-black"],
            iconRemove: ["bg-black"]["bg-h-aa5275"],
            linkAdd: ["text-pink-light"],
            linkRemove: ["text-dark"],
            tweetBoxAdd: ["bg-pink-light"],
            tweetBoxRemove: ["bg-light"],
            terminalAdd: ["bg-terminal-pink-light"],
            terminalRemove: ["bg-terminal-light"]
          });
        } else if (body.classList.contains("dark-blue")) {
          toggleTheme("dark-blue", "dark", {
            iconAdd: ["bg-white", "tx-black"],
            iconRemove: ["bg-h-03131d", "tx-white"],
            linkAdd: ["text-blue-dark"],
            linkRemove: ["text-dark"],
            tweetBoxAdd: ["bg-blue-dark"],
            tweetBoxRemove: ["bg-dark"],
            terminalAdd: ["bg-terminal-blue-dark"],
            terminalRemove: ["bg-terminal-dark"]
          });
        } else if (body.classList.contains("light-blue")) {
          toggleTheme("light-blue", "light", {
            iconAdd: ["bg-black", "tx-white"],
            iconRemove: ["bg-h-5290aa", "tx-black"],
            linkAdd: ["text-blue-light"],
            linkRemove: ["text-dark"],
            tweetBoxAdd: ["bg-blue-light"],
            tweetBoxRemove: ["bg-light"],
            terminalAdd: ["bg-terminal-blue-light"],
            terminalRemove: ["bg-terminal-light"]
          });
        } else if (body.classList.contains("dark-green")) {
          toggleTheme("dark-green", "dark", {
            iconAdd: ["bg-white", "tx-black"],
            iconRemove: ["bg-h-2b650e", "tx-white"],
            linkAdd: ["text-green-dark"],
            linkRemove: ["text-dark"],
            tweetBoxAdd: ["bg-green-dark"],
            tweetBoxRemove: ["bg-dark"],
            terminalAdd: ["bg-terminal-green-dark"],
            terminalRemove: ["bg-terminal-dark"]
          });
        } else if (body.classList.contains("light-green")) {
          toggleTheme("light-green", "light", {
            iconAdd: ["bg-black", "tx-white"],
            iconRemove: ["bg-h-4c0e65", "tx-black"],
            linkAdd: ["text-green-light"],
            linkRemove: ["text-dark"],
            tweetBoxAdd: ["bg-green-light"],
            tweetBoxRemove: ["bg-light"],
            terminalAdd: ["bg-terminal-green-light"],
            terminalRemove: ["bg-terminal-light"]
          });
        }
      };
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        document.addEventListener("DOMContentLoaded", () => {
          savedTheme();
        });
      }
      return [
        import_server.TempleRegistry.createText(`
`, false),
        import_server.TempleRegistry.createElement("html", {}, "{ }", [
          import_server.TempleRegistry.createText(`
  `, false),
          ...[
            import_server.TempleRegistry.createElement("head", {}, "{ }", [
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "charset": `utf-8` }, "{ 'charset': `utf-8` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `viewport`, "content": `width=device-width, initial-scale=1` }, "{ 'name': `viewport`, 'content': `width=device-width, initial-scale=1` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("title", {}, "{ }", [
                ...this._toNodeList(title)
              ]),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `description`, "content": description }, "{ 'name': `description`, 'content': description }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "property": `og:title`, "content": title }, "{ 'property': `og:title`, 'content': title }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "property": `og:description`, "content": description }, "{ 'property': `og:description`, 'content': description }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "property": `og:image`, "content": `https://ossphilippines.github.io/temple/temple-logo.png` }, "{ 'property': `og:image`, 'content': `https://ossphilippines.github.io/temple/temple-logo.png` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "property": `og:url`, "content": `https://ossphilippines.github.io/temple${url}` }, "{ 'property': `og:url`, 'content': `https://ossphilippines.github.io/temple${url}` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "property": `og:type`, "content": `website` }, "{ 'property': `og:type`, 'content': `website` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `twitter:card`, "content": `summary` }, "{ 'name': `twitter:card`, 'content': `summary` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `twitter:site`, "content": `@OSSPhilippines` }, "{ 'name': `twitter:site`, 'content': `@OSSPhilippines` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `twitter:title`, "content": title }, "{ 'name': `twitter:title`, 'content': title }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `twitter:description`, "content": description }, "{ 'name': `twitter:description`, 'content': description }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("meta", { "name": `twitter:image`, "content": `https://ossphilippines.github.io/temple/temple-logo.png` }, "{ 'name': `twitter:image`, 'content': `https://ossphilippines.github.io/temple/temple-logo.png` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("link", { "rel": `favicon`, "href": `/temple/favicon.ico` }, "{ 'rel': `favicon`, 'href': `/temple/favicon.ico` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("link", { "rel": `shortcut icon`, "type": `image/png`, "href": `/temple/favicon.png` }, "{ 'rel': `shortcut icon`, 'type': `image/png`, 'href': `/temple/favicon.png` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("link", { "rel": `stylesheet`, "type": `text/css`, "href": `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css` }, "{ 'rel': `stylesheet`, 'type': `text/css`, 'href': `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("link", { "rel": `stylesheet`, "media": `(prefers-color-scheme:light)`, "href": `https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.16.0/cdn/themes/light.css` }, "{ 'rel': `stylesheet`, 'media': `(prefers-color-scheme:light)`, 'href': `https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.16.0/cdn/themes/light.css` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("link", { "rel": `stylesheet`, "media": `(prefers-color-scheme:dark)`, "href": `https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.16.0/cdn/themes/dark.css` }, "{ 'rel': `stylesheet`, 'media': `(prefers-color-scheme:dark)`, 'href': `https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.16.0/cdn/themes/dark.css` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("link", { "rel": `stylesheet`, "type": `text/css`, "href": `/temple/styles/global.css` }, "{ 'rel': `stylesheet`, 'type': `text/css`, 'href': `/temple/styles/global.css` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              import_server.TempleRegistry.createElement("link", { "rel": `stylesheet`, "type": `text/css`, "href": `/temple/build/client/${(0, import_server2.env)("BUILD_ID")}.css` }, "{ 'rel': `stylesheet`, 'type': `text/css`, 'href': `/temple/build/client/${env('BUILD_ID')}.css` }"),
              import_server.TempleRegistry.createText(`
  
  `, false),
              import_server.TempleRegistry.createElement("script", { "data-app": (0, import_server2.env)("APP_DATA"), "src": `/temple/build/client/${(0, import_server2.env)("BUILD_ID")}.js` }, "{ 'data-app': env('APP_DATA'), 'src': `/temple/build/client/${env('BUILD_ID')}.js` }"),
              import_server.TempleRegistry.createText(`
  `, false),
              ...!!((0, import_server2.env)("NODE_ENV") === "development") ? [
                import_server.TempleRegistry.createText(`
    `, false),
                import_server.TempleRegistry.createElement("script", { "src": `/dev.js` }, "{ 'src': `/dev.js` }"),
                import_server.TempleRegistry.createText(`
  `, false)
              ] : [],
              import_server.TempleRegistry.createText(`
`, false)
            ])
          ],
          import_server.TempleRegistry.createText(`
  `, false),
          import_server.TempleRegistry.createElement("body", { "class": `dark bg-t-0 tx-t-1 tx-arial` }, "{ 'class': `dark bg-t-0 tx-t-1 tx-arial` }", [
            import_server.TempleRegistry.createText(`
    `, false),
            import_server.TempleRegistry.createElement("panel-layout", {}, "{ }", [
              import_server.TempleRegistry.createText(`
      `, false),
              import_server.TempleRegistry.createElement("header", {}, "{ }", [
                ...[
                  import_server.TempleRegistry.createElement("menu", { "class": `flex flex-center-y px-20 py-15 m-0 bg-t-1` }, "{ 'class': `flex flex-center-y px-20 py-15 m-0 bg-t-1` }", [
                    import_server.TempleRegistry.createText(`
  `, false),
                    ...!!(url !== "/temple/index.html" && url !== "/temple/500.html") ? [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("i", { "class": `fas fa-fw fa-bars cursor-pointer py-5 pr-10 none md-inline-block tx-t-1`, "click": toggle }, "{ 'class': `fas fa-fw fa-bars cursor-pointer py-5 pr-10 none md-inline-block tx-t-1`, 'click': toggle }", []),
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("div", { "class": `flex-grow` }, "{ 'class': `flex-grow` }", []),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : true ? [
                      ,
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "href": `/temple` }, "{ 'href': `/temple` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        import_server.TempleRegistry.createElement("img", { "alt": `Temple Logo`, "class": `h-26 mr-10`, "src": `/temple/temple-icon.png` }, "{ 'alt': `Temple Logo`, 'class': `h-26 mr-10`, 'src': `/temple/temple-icon.png` }"),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("h3", { "class": `flex-grow tx-upper` }, "{ 'class': `flex-grow tx-upper` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        import_server.TempleRegistry.createElement("a", { "class": `tx-white`, "href": `/temple` }, "{ 'class': `tx-white`, 'href': `/temple` }", [
                          import_server.TempleRegistry.createText(`Temple`, false)
                        ]),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : [],
                    import_server.TempleRegistry.createText(`
  `, false),
                    import_server.TempleRegistry.createElement("nav", { "class": `flex flex-center-y` }, "{ 'class': `flex flex-center-y` }", [
                      import_server.TempleRegistry.createText(`

  `, false),
                      import_server.TempleRegistry.createElement("div", { "class": `flex flex-center gap-5 mr-10` }, "{ 'class': `flex flex-center gap-5 mr-10` }", [
                        import_server.TempleRegistry.createText(`
        <!-- Theme Chooser -->
          `, false),
                        import_server.TempleRegistry.createElement("button", { "class": `bg-h-121212 pill w-16 h-16 outline-none cursor-pointer b-transparent `, "click": toggleDark }, "{ 'class': `bg-h-121212 pill w-16 h-16 outline-none cursor-pointer b-transparent `, 'click': toggleDark }", []),
                        import_server.TempleRegistry.createText(`
          `, false),
                        import_server.TempleRegistry.createElement("button", { "class": `bg-h-528909 pill w-16 h-16 outline-none cursor-pointer b-transparent`, "click": toggleGreen }, "{ 'class': `bg-h-528909 pill w-16 h-16 outline-none cursor-pointer b-transparent`, 'click': toggleGreen }", []),
                        import_server.TempleRegistry.createText(`
          `, false),
                        import_server.TempleRegistry.createElement("button", { "class": `bg-h-0077b6 pill w-16 h-16 outline-none cursor-pointer b-transparent`, "click": toggleBlue }, "{ 'class': `bg-h-0077b6 pill w-16 h-16 outline-none cursor-pointer b-transparent`, 'click': toggleBlue }", []),
                        import_server.TempleRegistry.createText(`
          `, false),
                        import_server.TempleRegistry.createElement("button", { "class": `bg-h-890934 pill w-16 h-16 outline-none cursor-pointer b-transparent`, "click": togglePink }, "{ 'class': `bg-h-890934 pill w-16 h-16 outline-none cursor-pointer b-transparent`, 'click': togglePink }", []),
                        import_server.TempleRegistry.createText(`
          `, false),
                        import_server.TempleRegistry.createElement("button", { "class": `bg-h-710989 pill w-16 h-16 outline-none cursor-pointer b-transparent mr-5`, "click": toggleViolet }, "{ 'class': `bg-h-710989 pill w-16 h-16 outline-none cursor-pointer b-transparent mr-5`, 'click': toggleViolet }", []),
                        import_server.TempleRegistry.createText(`
        <!-- Toggle Light and Dark Mode -->
        `, false),
                        import_server.TempleRegistry.createElement("i", { "class": `fa-solid fa-sun flex flex-center bg-white pill w-28 h-28 cursor-pointer tx-black`, "id": `modeIcon`, "click": toggleMode }, "{ 'class': `fa-solid fa-sun flex flex-center bg-white pill w-28 h-28 cursor-pointer tx-black`, 'id': `modeIcon`, 'click': toggleMode }", []),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`

    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `tx-white`, "href": `/temple/docs/index.html` }, "{ 'class': `tx-white`, 'href': `/temple/docs/index.html` }", [
                        import_server.TempleRegistry.createText(`Docs`, false)
                      ]),
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `tx-t-1 tx-5xl ml-10`, "href": `https://github.com/OSSPhilippines/temple`, "target": `_blank` }, "{ 'class': `tx-t-1 tx-5xl ml-10`, 'href': `https://github.com/OSSPhilippines/temple`, 'target': `_blank` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        import_server.TempleRegistry.createElement("i", { "class": `fab fa-github` }, "{ 'class': `fab fa-github` }", []),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `bg-h-cb3837 pill tx-t-1 tx-lg ml-5 p-5 tx-center`, "href": `https://www.npmjs.com/package/@ossph/temple`, "target": `_blank` }, "{ 'class': `bg-h-cb3837 pill tx-t-1 tx-lg ml-5 p-5 tx-center`, 'href': `https://www.npmjs.com/package/@ossph/temple`, 'target': `_blank` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        import_server.TempleRegistry.createElement("i", { "class": `fab fa-npm text-white` }, "{ 'class': `fab fa-npm text-white` }", []),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `bg-h-7289da pill tx-t-1 tx-lg ml-5 p-5 tx-center`, "href": `https://discord.gg/open-source-software-ph-905496362982981723`, "target": `_blank` }, "{ 'class': `bg-h-7289da pill tx-t-1 tx-lg ml-5 p-5 tx-center`, 'href': `https://discord.gg/open-source-software-ph-905496362982981723`, 'target': `_blank` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        import_server.TempleRegistry.createElement("i", { "class": `fab fa-discord text-white` }, "{ 'class': `fab fa-discord text-white` }", []),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
`, false)
                  ])
                ]
              ]),
              import_server.TempleRegistry.createText(`
      `, false),
              import_server.TempleRegistry.createElement("aside", { "left": true }, "{ 'left': true }", [
                ...[
                  import_server.TempleRegistry.createElement("header", { "class": `flex flex-center-y bg-t-2 py-15 pr-5 pl-10` }, "{ 'class': `flex flex-center-y bg-t-2 py-15 pr-5 pl-10` }", [
                    import_server.TempleRegistry.createText(`
  `, false),
                    import_server.TempleRegistry.createElement("a", { "href": `/temple` }, "{ 'href': `/temple` }", [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("img", { "class": `h-26 mr-10`, "src": `/temple/temple-icon.png`, "alt": `Temple Logo` }, "{ 'class': `h-26 mr-10`, 'src': `/temple/temple-icon.png`, 'alt': `Temple Logo` }"),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
  `, false),
                    import_server.TempleRegistry.createElement("h3", { "class": `flex-grow m-0 tx-upper` }, "{ 'class': `flex-grow m-0 tx-upper` }", [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `tx-white`, "href": `/temple` }, "{ 'class': `tx-white`, 'href': `/temple` }", [
                        import_server.TempleRegistry.createText(`Temple`, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
  `, false),
                    import_server.TempleRegistry.createElement("i", { "class": `fas fa-fw fa-chevron-left cursor-pointer none md-inline-block`, "click": toggle }, "{ 'class': `fas fa-fw fa-chevron-left cursor-pointer none md-inline-block`, 'click': toggle }", []),
                    import_server.TempleRegistry.createText(`
`, false)
                  ]),
                  import_server.TempleRegistry.createText(`
`, false),
                  import_server.TempleRegistry.createElement("nav", { "class": `bg-t-1 scroll-auto h-calc-full-60` }, "{ 'class': `bg-t-1 scroll-auto h-calc-full-60` }", [
                    import_server.TempleRegistry.createText(`
  `, false),
                    import_server.TempleRegistry.createElement("h6", { "class": `bt-1 bt-solid bt-t-1 tx-muted tx-14 mb-0 mt-0 pt-20 pb-10 pl-10 tx-upper` }, "{ 'class': `bt-1 bt-solid bt-t-1 tx-muted tx-14 mb-0 mt-0 pt-20 pb-10 pl-10 tx-upper` }", [
                      import_server.TempleRegistry.createText(`
    `, false),
                      ...this._toNodeList(_("Introduction")),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
  `, false),
                    ...!!(url === "/docs/index.html") ? [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10 tx-bold`, "href": `/temple/docs/index.html` }, "{ 'class': `block tx-t-1 py-10 pl-10 tx-bold`, 'href': `/temple/docs/index.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Documentation")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : true ? [
                      ,
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10`, "href": `/temple/docs/index.html` }, "{ 'class': `block tx-t-1 py-10 pl-10`, 'href': `/temple/docs/index.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Documentation")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : [],
                    import_server.TempleRegistry.createText(`
  `, false),
                    ...!!(url === "/docs/getting-started.html") ? [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10 tx-bold`, "href": `/temple/docs/getting-started.html` }, "{ 'class': `block tx-t-1 py-10 pl-10 tx-bold`, 'href': `/temple/docs/getting-started.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Getting Started")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : true ? [
                      ,
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10`, "href": `/temple/docs/getting-started.html` }, "{ 'class': `block tx-t-1 py-10 pl-10`, 'href': `/temple/docs/getting-started.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Getting Started")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : [],
                    import_server.TempleRegistry.createText(`

  `, false),
                    import_server.TempleRegistry.createElement("h6", { "class": `bt-1 bt-solid bt-t-1 tx-muted tx-14 mb-0 mt-20 pt-20 pb-10 pl-10 tx-upper` }, "{ 'class': `bt-1 bt-solid bt-t-1 tx-muted tx-14 mb-0 mt-20 pt-20 pb-10 pl-10 tx-upper` }", [
                      import_server.TempleRegistry.createText(`
    `, false),
                      ...this._toNodeList(_("Features")),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
  `, false),
                    ...!!(url === "/docs/markup-syntax.html") ? [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10 tx-bold`, "href": `/temple/docs/markup-syntax.html` }, "{ 'class': `block tx-t-1 py-10 pl-10 tx-bold`, 'href': `/temple/docs/markup-syntax.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Markup Syntax")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : true ? [
                      ,
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10`, "href": `/temple/docs/markup-syntax.html` }, "{ 'class': `block tx-t-1 py-10 pl-10`, 'href': `/temple/docs/markup-syntax.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Markup Syntax")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : [],
                    import_server.TempleRegistry.createText(`
  `, false),
                    ...!!(url === "/docs/state-management.html") ? [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10 tx-bold`, "href": `/temple/docs/state-management.html` }, "{ 'class': `block tx-t-1 py-10 pl-10 tx-bold`, 'href': `/temple/docs/state-management.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("State Management")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : true ? [
                      ,
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10`, "href": `/temple/docs/state-management.html` }, "{ 'class': `block tx-t-1 py-10 pl-10`, 'href': `/temple/docs/state-management.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("State Management")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : [],
                    import_server.TempleRegistry.createText(`
  `, false),
                    ...!!(url === "/docs/component-strategy.html") ? [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10 tx-bold`, "href": `/temple/docs/component-strategy.html` }, "{ 'class': `block tx-t-1 py-10 pl-10 tx-bold`, 'href': `/temple/docs/component-strategy.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Component Strategy")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : true ? [
                      ,
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10`, "href": `/temple/docs/component-strategy.html` }, "{ 'class': `block tx-t-1 py-10 pl-10`, 'href': `/temple/docs/component-strategy.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Component Strategy")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : [],
                    import_server.TempleRegistry.createText(`
  `, false),
                    ...!!(url === "/docs/compiler-api.html") ? [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10 tx-bold`, "href": `/temple/docs/compiler-api.html` }, "{ 'class': `block tx-t-1 py-10 pl-10 tx-bold`, 'href': `/temple/docs/compiler-api.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Compiler API")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : true ? [
                      ,
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10`, "href": `/temple/docs/compiler-api.html` }, "{ 'class': `block tx-t-1 py-10 pl-10`, 'href': `/temple/docs/compiler-api.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Compiler API")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : [],
                    import_server.TempleRegistry.createText(`
  `, false),
                    ...!!(url === "/docs/client-api.html") ? [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10 tx-bold`, "href": `/temple/docs/client-api.html` }, "{ 'class': `block tx-t-1 py-10 pl-10 tx-bold`, 'href': `/temple/docs/client-api.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Client API")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : true ? [
                      ,
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10`, "href": `/temple/docs/client-api.html` }, "{ 'class': `block tx-t-1 py-10 pl-10`, 'href': `/temple/docs/client-api.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Client API")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : [],
                    import_server.TempleRegistry.createText(`

  `, false),
                    import_server.TempleRegistry.createElement("h6", { "class": `bt-1 bt-solid bt-t-1 tx-muted tx-14 mb-0 mt-20 pt-20 pb-10 pl-10 tx-upper` }, "{ 'class': `bt-1 bt-solid bt-t-1 tx-muted tx-14 mb-0 mt-20 pt-20 pb-10 pl-10 tx-upper` }", [
                      import_server.TempleRegistry.createText(`
    `, false),
                      ...this._toNodeList(_("Usage")),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
  `, false),
                    ...!!(url === "/docs/template-engine.html") ? [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10 tx-bold`, "href": `/temple/docs/template-engine.html` }, "{ 'class': `block tx-t-1 py-10 pl-10 tx-bold`, 'href': `/temple/docs/template-engine.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Template Engine")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : true ? [
                      ,
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10`, "href": `/temple/docs/template-engine.html` }, "{ 'class': `block tx-t-1 py-10 pl-10`, 'href': `/temple/docs/template-engine.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Template Engine")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : [],
                    import_server.TempleRegistry.createText(`
  `, false),
                    ...!!(url === "/docs/single-page.html") ? [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10 tx-bold`, "href": `/temple/docs/single-page.html` }, "{ 'class': `block tx-t-1 py-10 pl-10 tx-bold`, 'href': `/temple/docs/single-page.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Single Page App")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : true ? [
                      ,
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10`, "href": `/temple/docs/single-page.html` }, "{ 'class': `block tx-t-1 py-10 pl-10`, 'href': `/temple/docs/single-page.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Single Page App")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : [],
                    import_server.TempleRegistry.createText(`
  `, false),
                    ...!!(url === "/docs/static-site.html") ? [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10 tx-bold`, "href": `/temple/docs/static-site.html` }, "{ 'class': `block tx-t-1 py-10 pl-10 tx-bold`, 'href': `/temple/docs/static-site.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Static Site Generator")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : true ? [
                      ,
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10`, "href": `/temple/docs/static-site.html` }, "{ 'class': `block tx-t-1 py-10 pl-10`, 'href': `/temple/docs/static-site.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Static Site Generator")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : [],
                    import_server.TempleRegistry.createText(`
  `, false),
                    ...!!(url === "/docs/component-publisher.html") ? [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10 tx-bold`, "href": `/temple/docs/component-publisher.html` }, "{ 'class': `block tx-t-1 py-10 pl-10 tx-bold`, 'href': `/temple/docs/component-publisher.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Component Publisher")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : true ? [
                      ,
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10`, "href": `/temple/docs/component-publisher.html` }, "{ 'class': `block tx-t-1 py-10 pl-10`, 'href': `/temple/docs/component-publisher.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Component Publisher")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : [],
                    import_server.TempleRegistry.createText(`
  `, false),
                    ...!!(url === "/docs/developer-tools.html") ? [
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10 tx-bold mb-100`, "href": `/temple/docs/developer-tools.html` }, "{ 'class': `block tx-t-1 py-10 pl-10 tx-bold mb-100`, 'href': `/temple/docs/developer-tools.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Developer Tools")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : true ? [
                      ,
                      import_server.TempleRegistry.createText(`
    `, false),
                      import_server.TempleRegistry.createElement("a", { "class": `block tx-t-1 py-10 pl-10 mb-100`, "href": `/temple/docs/developer-tools.html` }, "{ 'class': `block tx-t-1 py-10 pl-10 mb-100`, 'href': `/temple/docs/developer-tools.html` }", [
                        import_server.TempleRegistry.createText(`
      `, false),
                        ...this._toNodeList(_("Developer Tools")),
                        import_server.TempleRegistry.createText(`
    `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
  `, false)
                    ] : [],
                    import_server.TempleRegistry.createText(`
`, false)
                  ])
                ]
              ]),
              import_server.TempleRegistry.createText(`
      `, false),
              import_server.TempleRegistry.createElement("main", {}, "{ }", [
                import_server.TempleRegistry.createText(`
        `, false),
                import_server.TempleRegistry.createElement("api-docs", {}, "{ }", [
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("h1", { "class": `tx-primary tx-upper tx-30 py-20` }, "{ 'class': `tx-primary tx-upper tx-30 py-20` }", [
                    import_server.TempleRegistry.createText(`
            `, false),
                    ...this._toNodeList(_("Single Page App")),
                    import_server.TempleRegistry.createText(`
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`

          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true, "class": `tx-lh-36 py-20` }, "{ 'p': true, 'trim': true, 'class': `tx-lh-36 py-20` }", [
                    import_server.TempleRegistry.createText(`
            A single page application (SPA) is a website or web 
            application that dynamically rewrites a current web page with 
            new data from a web server, instead of the default method of 
            a web browser loading entire new pages. Temple is capable of 
            creating reactive SPAs using Webpack and TypeScript.
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`

          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true, "class": `tx-lh-36 py-20` }, "{ 'p': true, 'trim': true, 'class': `tx-lh-36 py-20` }", [
                    import_server.TempleRegistry.createText(`
            First install the following Temple packages.
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "lang": `bash` }, "{ 'lang': `bash` }", [
                    import_server.TempleRegistry.createText(`
            npm install --save-dev @ossph/temple @ossph/temple-loader
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`

          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true, "class": `tx-lh-36 py-20` }, "{ 'p': true, 'trim': true, 'class': `tx-lh-36 py-20` }", [
                    import_server.TempleRegistry.createText(`
            Then, install the following TypeScript packages.
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "lang": `bash` }, "{ 'lang': `bash` }", [
                    import_server.TempleRegistry.createText(`
            npm install --save-dev @types/node ts-loader ts-node typescript
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`

          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true, "class": `tx-lh-36 py-20` }, "{ 'p': true, 'trim': true, 'class': `tx-lh-36 py-20` }", [
                    import_server.TempleRegistry.createText(`
            Then, install the following Webpack packages.
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-code", { "lang": `bash` }, "{ 'lang': `bash` }", [
                    import_server.TempleRegistry.createText(`
            npm install --save-dev html-webpack-plugin webpack-dev-server webpack webpack-cli
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`

          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true, "class": `tx-lh-36 py-20` }, "{ 'p': true, 'trim': true, 'class': `tx-lh-36 py-20` }", [
                    import_server.TempleRegistry.createText(`
            Next create the following files and directories.
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`

          `, false),
                  import_server.TempleRegistry.createElement("ide-app", { "height": 400, "title": `My Project` }, "{ 'height': 400, 'title': `My Project` }", [
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("app-head", {}, "{ }", [
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("div", { "class": `flex scroll-x-auto pt-5 pl-5` }, "{ 'class': `flex scroll-x-auto pt-5 pl-5` }", [
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("element-tab", { "class": `relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0`, "active": `bg-black tx-white`, "inactive": `bg-t-1 tx-muted`, "group": `project`, "selector": `#client-ts` }, "{ 'class': `relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0`, 'active': `bg-black tx-white`, 'inactive': `bg-t-1 tx-muted`, 'group': `project`, 'selector': `#client-ts` }", [
                          import_server.TempleRegistry.createText(`
                  src/client.ts
                `, false)
                        ]),
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("element-tab", { "class": `relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0`, "active": `bg-black tx-white`, "inactive": `bg-t-1 tx-muted`, "group": `project`, "selector": `#app-tml` }, "{ 'class': `relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0`, 'active': `bg-black tx-white`, 'inactive': `bg-t-1 tx-muted`, 'group': `project`, 'selector': `#app-tml` }", [
                          import_server.TempleRegistry.createText(`
                  src/app.tml
                `, false)
                        ]),
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("element-tab", { "class": `relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0`, "active": `bg-black tx-white`, "inactive": `bg-t-1 tx-muted`, "group": `project`, "selector": `#index-html` }, "{ 'class': `relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0`, 'active': `bg-black tx-white`, 'inactive': `bg-t-1 tx-muted`, 'group': `project`, 'selector': `#index-html` }", [
                          import_server.TempleRegistry.createText(`
                  index.html
                `, false)
                        ]),
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("element-tab", { "on": true, "class": `relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0`, "active": `bg-black tx-white`, "inactive": `bg-t-1 tx-muted`, "group": `project`, "selector": `#webpack-js` }, "{ 'on': true, 'class': `relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0`, 'active': `bg-black tx-white`, 'inactive': `bg-t-1 tx-muted`, 'group': `project`, 'selector': `#webpack-js` }", [
                          import_server.TempleRegistry.createText(`
                  webpack.config.js
                `, false)
                        ]),
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("element-tab", { "class": `relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0`, "active": `bg-black tx-white`, "inactive": `bg-t-1 tx-muted`, "group": `project`, "selector": `#tsconfig-json` }, "{ 'class': `relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0`, 'active': `bg-black tx-white`, 'inactive': `bg-t-1 tx-muted`, 'group': `project`, 'selector': `#tsconfig-json` }", [
                          import_server.TempleRegistry.createText(`
                  tsconfig.json
                `, false)
                        ]),
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("element-tab", { "class": `relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0`, "active": `bg-black tx-white`, "inactive": `bg-t-1 tx-muted`, "group": `project`, "selector": `#package-json` }, "{ 'class': `relative ml-2 p-10 ct-sm b-solid b-t-1 bx-1 bt-1 bb-0`, 'active': `bg-black tx-white`, 'inactive': `bg-t-1 tx-muted`, 'group': `project`, 'selector': `#package-json` }", [
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
                    import_server.TempleRegistry.createElement("app-left", {}, "{ }", [
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("h5", { "class": `folder` }, "{ 'class': `folder` }", [
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("element-icon", { "name": `chevron-down` }, "{ 'name': `chevron-down` }"),
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("span", {}, "{ }", [
                          import_server.TempleRegistry.createText(`src`, false)
                        ]),
                        import_server.TempleRegistry.createText(`
              `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("element-tab", { "class": `pl-15 pt-10 block`, "active": `tx-white`, "inactive": `tx-muted`, "group": `project`, "selector": `#app-tml` }, "{ 'class': `pl-15 pt-10 block`, 'active': `tx-white`, 'inactive': `tx-muted`, 'group': `project`, 'selector': `#app-tml` }", [
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("element-icon", { "name": `file` }, "{ 'name': `file` }"),
                        import_server.TempleRegistry.createText(`
                app.tml
              `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("element-tab", { "class": `pl-15 pt-10 block`, "active": `tx-white`, "inactive": `tx-muted`, "group": `project`, "selector": `#client-ts` }, "{ 'class': `pl-15 pt-10 block`, 'active': `tx-white`, 'inactive': `tx-muted`, 'group': `project`, 'selector': `#client-ts` }", [
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("element-icon", { "name": `file` }, "{ 'name': `file` }"),
                        import_server.TempleRegistry.createText(`
                client.ts
              `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("element-tab", { "class": `pt-10 block`, "active": `tx-white`, "inactive": `tx-muted`, "group": `project`, "selector": `#index-html` }, "{ 'class': `pt-10 block`, 'active': `tx-white`, 'inactive': `tx-muted`, 'group': `project`, 'selector': `#index-html` }", [
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("element-icon", { "name": `file` }, "{ 'name': `file` }"),
                        import_server.TempleRegistry.createText(`
                index.html
              `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("element-tab", { "class": `pt-10 block`, "active": `tx-white`, "inactive": `tx-muted`, "group": `project`, "selector": `#package-json` }, "{ 'class': `pt-10 block`, 'active': `tx-white`, 'inactive': `tx-muted`, 'group': `project`, 'selector': `#package-json` }", [
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("element-icon", { "name": `file` }, "{ 'name': `file` }"),
                        import_server.TempleRegistry.createText(`
                package.json
              `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("element-tab", { "class": `pt-10 block`, "active": `tx-white`, "inactive": `tx-muted`, "group": `project`, "selector": `#tsconfig-json` }, "{ 'class': `pt-10 block`, 'active': `tx-white`, 'inactive': `tx-muted`, 'group': `project`, 'selector': `#tsconfig-json` }", [
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("element-icon", { "name": `file` }, "{ 'name': `file` }"),
                        import_server.TempleRegistry.createText(`
                tsconfig.json
              `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("element-tab", { "on": true, "class": `pt-10 block`, "active": `tx-white`, "inactive": `tx-muted`, "group": `project`, "selector": `#webpack-js` }, "{ 'on': true, 'class': `pt-10 block`, 'active': `tx-white`, 'inactive': `tx-muted`, 'group': `project`, 'selector': `#webpack-js` }", [
                        import_server.TempleRegistry.createText(`
                `, false),
                        import_server.TempleRegistry.createElement("element-icon", { "name": `file` }, "{ 'name': `file` }"),
                        import_server.TempleRegistry.createText(`
                webpack.config.js
              `, false)
                      ]),
                      import_server.TempleRegistry.createText(`
            `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("app-main", {}, "{ }", [
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("ide-code", { "id": `client-ts`, "style": `display:none`, "lang": `js`, "numbers": true, "trim": true, "detab": 16 }, "{ 'id': `client-ts`, 'style': `display:none`, 'lang': `js`, 'numbers': true, 'trim': true, 'detab': 16 }", [
                        ...this._toNodeList(`
                import TempleComponent from './app.tml';

                TempleComponent.register();
              `)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("ide-code", { "id": `app-tml`, "style": `display:none`, "numbers": true, "trim": true, "detab": 16 }, "{ 'id': `app-tml`, 'style': `display:none`, 'numbers': true, 'trim': true, 'detab': 16 }", [
                        ...this._toNodeList(`
                <script>
                  const title = 'Single Page App';
                </script>
                <h1>{title}</h1>
              `)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("ide-code", { "id": `index-html`, "style": `display:none`, "numbers": true, "trim": true, "detab": 16 }, "{ 'id': `index-html`, 'style': `display:none`, 'numbers': true, 'trim': true, 'detab': 16 }", [
                        ...this._toNodeList(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>
                      body {
                        font-family: Arial, Helvetica, sans-serif;
                        margin: 0;
                        padding: 0;
                        width: 100vw;
                        height: 100vh;
                      }
                    </style>
                  </head>
                  <body>
                    <temple-app></temple-app>
                  </body>
                </html>
              `)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("ide-code", { "id": `webpack-js`, "lang": `js`, "numbers": true, "trim": true, "detab": 16 }, "{ 'id': `webpack-js`, 'lang': `js`, 'numbers': true, 'trim': true, 'detab': 16 }", [
                        ...this._toNodeList(`
                const path = require('path');
                const HtmlWebpackPlugin = require('html-webpack-plugin');

                module.exports = {
                  // https://webpack.js.org/concepts/entry-points/#multi-page-application
                  entry: {
                    index: './src/client.ts'
                  },
                  output: {
                    path: path.resolve(__dirname, './dist'),
                    filename: '[name].bundle.js',
                  },
                  module: {
                    rules: [
                      {
                        test: /.tml$/,
                        use: {
                          loader: '@ossph/temple-loader',
                          options: { minify: false }
                        },
                        exclude: /node_modules/,
                      },
                      {
                        test: /.ts$/,
                        use: 'ts-loader',
                        exclude: /node_modules/,
                      },
                    ],
                  },
                  resolve: {
                    extensions: ['.js', '.ts', '.tml'],
                  },
                  // https://webpack.js.org/configuration/dev-server/
                  devServer: {
                    port: 8080
                  },
                  plugins: [
                    new HtmlWebpackPlugin({
                      title: 'Temple',
                      template: "index.html",
                    })
                  ]
                };
              `)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("ide-code", { "id": `tsconfig-json`, "style": `display:none`, "lang": `js`, "numbers": true, "trim": true, "detab": 16 }, "{ 'id': `tsconfig-json`, 'style': `display:none`, 'lang': `js`, 'numbers': true, 'trim': true, 'detab': 16 }", [
                        ...this._toNodeList(`
                {
                  "compilerOptions": {
                    "declaration": true,
                    "esModuleInterop": true,
                    "lib": [ "es2021", "es7", "es6", "dom" ],
                    "module": "commonjs",
                    "noUnusedLocals": true,
                    "outDir": "./dist/",
                    "preserveConstEnums": true,
                    "resolveJsonModule": true,
                    "removeComments": true,
                    "sourceMap": false,
                    "strict": true,
                    "target": "es6",
                    "skipLibCheck": true
                  },
                  "include": [ 
                    "src/**/*.ts", 
                    "@ossph/temple/types"
                  ],
                  "exclude": [ "dist", "node_modules" ]
                }
              `)
                      ]),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("ide-code", { "id": `package-json`, "style": `display:none`, "lang": `js`, "numbers": true, "trim": true, "detab": 16 }, "{ 'id': `package-json`, 'style': `display:none`, 'lang': `js`, 'numbers': true, 'trim': true, 'detab': 16 }", [
                        ...this._toNodeList(`
                {
                  "name": "my-spa",
                  "version": "1.0.0",
                  "private": true,
                  "scripts": {
                    "dev": "webpack-dev-server --mode development",
                    "build": "webpack --mode production"
                  },
                  "devDependencies": {
                    "@ossph/temple": "0.1.7"
                    "@ossph/temple-loader": "0.1.7",
                    "@types/node": "22.1.0",
                    "html-webpack-plugin": "5.6.0",
                    "webpack-dev-server": "5.0.4",
                    "ts-loader": "9.5.1",
                    "ts-node": "10.9.2",
                    "typescript": "5.4.5",
                    "webpack": "5.91.0",
                    "webpack-cli": "5.1.4"
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
          `, false),
                  import_server.TempleRegistry.createElement("i18n-translate", { "p": true, "trim": true, "class": `tx-lh-36 py-20` }, "{ 'p': true, 'trim': true, 'class': `tx-lh-36 py-20` }", [
                    import_server.TempleRegistry.createText(`
            To test the SPA and see the results, run the following command in terminal.
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("ide-app", { "title": `Terminal` }, "{ 'title': `Terminal` }", [
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("ide-code", { "lang": `bash` }, "{ 'lang': `bash` }", [
                      import_server.TempleRegistry.createText(`
              npm run dev
            `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          
          `, false),
                  import_server.TempleRegistry.createElement("nav", { "class": `flex` }, "{ 'class': `flex` }", [
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("a", { "class": `tx-primary py-40`, "href": `/temple/docs/template-engine.html` }, "{ 'class': `tx-primary py-40`, 'href': `/temple/docs/template-engine.html` }", [
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("element-icon", { "name": `chevron-left`, "theme": `tx-1` }, "{ 'name': `chevron-left`, 'theme': `tx-1` }"),
                      import_server.TempleRegistry.createText(`
              `, false),
                      ...this._toNodeList(_("Template Engine")),
                      import_server.TempleRegistry.createText(`
            `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
            `, false),
                    import_server.TempleRegistry.createElement("a", { "class": `flex-grow tx-right tx-primary py-40`, "href": `/temple/docs/static-site.html` }, "{ 'class': `flex-grow tx-right tx-primary py-40`, 'href': `/temple/docs/static-site.html` }", [
                      import_server.TempleRegistry.createText(`
              `, false),
                      ...this._toNodeList(_("Static Site Generator")),
                      import_server.TempleRegistry.createText(`
              `, false),
                      import_server.TempleRegistry.createElement("element-icon", { "name": `chevron-right`, "theme": `tx-1` }, "{ 'name': `chevron-right`, 'theme': `tx-1` }"),
                      import_server.TempleRegistry.createText(`
            `, false)
                    ]),
                    import_server.TempleRegistry.createText(`
          `, false)
                  ]),
                  import_server.TempleRegistry.createText(`
          `, false),
                  import_server.TempleRegistry.createElement("footer", { "class": `foot` }, "{ 'class': `foot` }", []),
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
  `, false)
          ]),
          import_server.TempleRegistry.createText(`
`, false)
        ])
      ];
    }
  };
  return __toCommonJS(single_page_exports);
})();
