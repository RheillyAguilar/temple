import type { Hash } from '../types';
//import type { TempleBrowserEvent } from '../types';
import type TempleElement from './TempleElement';

import TempleException from '../Exception';
import TempleRegistry from './TempleRegistry';
import emitter from './TempleEmitter';
import __APP_DATA__ from './data';

/**
 * Temple web component class
 */
export default abstract class TempleComponent extends HTMLElement {
  //name of the component [ tag-name, className ]
  public static component: [ string, string ];

  /**
   * Self registers the component
   */
  public static register() {
    customElements.define(
      this.component[0], 
      this as unknown as CustomElementConstructor
    );
  }

  //whether the component has initiated
  //this is a flag used by signals to check
  //the number of signals that exists
  //in this component
  protected _initiated = false;
  //the callback to render just the children 
  //(wo initializing the variables again)
  protected _template: (() => (Element|false)[])|null = null;
  //the initial children
  protected _children: ChildNode[]|undefined = undefined;
  //prevents rendering loops
  protected _rendering = false;
  //attribute observer
  protected _observer: MutationObserver|null = null;
  //whether if this is a virtual component
  protected _virtual = false;

  /**
   * Returns the component styles
   */
  public abstract styles(): string;

  /**
   * Returns the component template
   */
  public abstract template(): () => (Element|false)[];

  /**
   * Returns the component native attributes in native object form
   */
  public get attr() {
    return Object.fromEntries(
      Array.from(this.attributes).map(
        attr => [attr.name, attr.value]
      )
    );
  }

  /**
   * Returns the component's element registry
   */
  public get element(): TempleElement {
    //check to see if the registry has this component
    if (!TempleRegistry.has(this)) {
      //it should have...
      throw TempleException.for('Component not mapped.');
    }
    return TempleRegistry.get(this) as TempleElement;
  }

  /**
   * Returns the component's metadata
   */
  public get metadata() {
    const [ tagname, classname ] = (
      this.constructor as typeof TempleComponent
    ).component;
    return { tagname, classname };
  }

  /**
   * Returns the original component's children
   * before the component was initiated
   */
  public get originalChildren() {
    return this._children;
  }

  /**
   * Returns whether the component has initiated
   */
  public get initiated() {
    return this._initiated;
  }

  /**
   * Returns the component properties
   */
  public get props() {
    return this.getAttributes();
  }

  /**
   * Returns whether the component is a virtual component
   */
  public get virtual() {
    return this._virtual;
  }

  /**
   * Sets the component properties
   */
  public set props(props: Hash) {
    this.setAttributes(props);
  }

  /**
   * Constructor can only be called by native custom elements.
   * Theoretically, this means that the server should have
   * registered its attributes to TempleRegistry before hand.
   */
  public constructor() {
    super();
    //check to see if the registry has this component
    if (!TempleRegistry.has(this)) {
      //it should have...
      throw TempleException.for('Component not mapped.');
    }
  }

  /**
   * Called when component moved to a new document
   */
  public adoptedCallback() {
    this.render();
    //emit the adopt event
    emitter.emit('adopt', this);
  }

  /**
   * Called when the element is inserted into a document,
   */
  public connectedCallback() {
    //attributes are ready here
    this.wait();
    //emit the connect event
    emitter.emit('connect', this);
  }

  /**
   * Called when the element is removed from a document
   */
  public disconnectedCallback() {
    //emit the disconnect event
    emitter.emit('disconnect', this);
  }

  /**
   * Returns the attribute value
   */
  public getAttribute(name: string) {
    return this.element.getAttribute(name);
  }

  /**
   * Returns the all the attributes
   */
  public getAttributes() {
    return Object.assign({}, this.element.attributes);
  }

  /**
   * Returns the parent component (if any)
   */
  public getParentComponent() {
    let parent = this.parentElement;
    while (parent) {
      if (parent instanceof TempleComponent) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  /**
   * Returns whether the attribute exists
   */
  public hasAttribute(name: string) {
    return this.element.hasAttribute(name);
  }

  /**
   * This is used in TempleRegistry.createComponent() to
   * create a virtual instance of the component. This is
   * used components that are used by other components,
   * but not registered in custom elements.
   */
  public register(attributes: Hash = {}, children: Element[] = []) {
    //check to see if the registry already has this component
    if (TempleRegistry.has(this)) {
      //NOTE: this technically should not be possible...
      const element = TempleRegistry.get(this) as TempleElement;
      element.setAttributes(attributes);
    } else {
      //it is not registered, so register it
      TempleRegistry.register(this, attributes) 
    }
    //set attributes natively so it shows 
    //up in the markup when it's rendered
    for (const [ key, value ] of Object.entries(attributes)) {
      if (typeof value === 'string') {
        super.setAttribute(key, value);
      } else if (value === true) {
        super.setAttribute(key, key);
      }
    }
    //set the original children
    this._children = children;
    //this is a virtual component
    //virtual components suffer from :not(:defined) selectors
    //because they are not registered in custom elements
    //NOTE: this doesnt have a particular purpose right now
    // but will be used to troubleshooting in the future
    this._virtual = true;
    //also virtual components do not auto render so
    //we need to manually connect in order to do that
    this.connectedCallback();
  }

  /**
   * Removes the attribute
   */
  public removeAttribute(name: string) {
    if (this.hasAttribute(name)) {
      this.element.removeAttribute(name);
    }
    if (super.hasAttribute(name)) {
      super.removeAttribute(name);
    }
  }

  /**
   * Renders the component
   */
  public render() {
    //get the parent component
    const parent = this.getParentComponent();
    //if parent is not initiated, wait for it
    //(this is the hydration logic)
    if (parent && !parent.initiated) {
      return;
    //if it's already rendering
    } else if (this._rendering) {
      return;
    }
    //set the rendering flag
    this._rendering = true;
    //get the previous current component
    const prev = __APP_DATA__.get('current');
    //set the current component
    __APP_DATA__.set('current', this);
    //get the styles
    const styles = this.styles();
    //get the template
    if (!this._template) {
      //this will only initialize the variables once
      this._template = this.template();
    //there's a template, so it means it was mounted
    } else {
      //emit the unmounted event
      emitter.emit('unmounted', this);
    }
    //get the children build w/o re-initializing the variables
    const children = this._template().filter(Boolean) as Element[];
    //if no styles, just set the innerHTML
    if (styles.length === 0) {
      //empty the current text content
      this.textContent = '';
      //now append the children
      children.forEach(child => this.appendChild(child));
    //there are styles, use shadow dom
    } else {
      //if shadow root is not set, create it
      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }

      const shadowRoot = this.shadowRoot as ShadowRoot;
      //empty the current text content
      //the old data is captured in props
      this.textContent = '';
      shadowRoot.textContent = '';
      //append the styles
      const style = document.createElement('style');
      style.innerText = styles;
      shadowRoot.appendChild(style);
      //now append the children
      children.forEach(child => this.shadowRoot?.appendChild(child));
    }
    //reset the current component
    //maybe we should do a queue later?
    if (prev) {
      __APP_DATA__.set('current', prev);
    } else {
      __APP_DATA__.delete('current');
    }

    //set the initiated flag
    this._initiated = true;
    //reset the rendering flag
    this._rendering = false;
    //emit the mounted event
    emitter.emit('mounted', this);
    return this.shadowRoot ? this.shadowRoot.innerHTML :this.innerHTML;
  }

  /**
   * Sets the attribute
   */
  public setAttribute(name: string, value: any) {
    this.element.setAttribute(name, value);
    if (typeof value === 'string' || value === true) {
      super.setAttribute(name, value);
    }
  }

  /**
   * Sets all the attributes
   */
  public setAttributes(attributes: Hash) {
    this.element.setAttributes(attributes);
  }

  /**
   * Waits for the document to be first ready
   */
  public wait() {
    if (document.readyState !== 'loading') {
      this._update();
    } else {
      const next = () => {
        this._update();
        emitter.unbind('ready', next);
      };
      emitter.on('ready', next);
    }
  }

  /**
   * Converts a value to a node list
   * used to be inserted into the component
   * child list in template()
   */
  protected _toNodeList(value: any) {
    if (value instanceof Node) {
      return [ value ];
    }

    if (Array.isArray(value)) {
      if (value.every(item => item instanceof Node)) {
        return value;
      }
    }

    return [ TempleRegistry.createText(String(value)) ];
  }

  /**
   * Sets the initial properties and children
   */
  protected _update() { 
    //if children are not set
    if (typeof this._children === 'undefined') {
      this._children = Array.from(this.childNodes || []);
    }
    //only render if not initiated
    if (!this._initiated) {
      this.render();
    }
  }
}