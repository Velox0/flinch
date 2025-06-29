/**
 * AI generated bloat
 * These are just to simulate the DOM
 * They wont be executed as code, but provide hints
 * This is temporary for now. Or may be implemented in a different way
 */
export class VirtualNode {
  parentNode: VirtualNode | null = null;
  childNodes: VirtualNode[] = [];

  constructor(children?: VirtualNode[]) {
    if (children) {
      for (const child of children) {
        this.appendChild(child);
      }
    }
  }

  appendChild(node: VirtualNode): void {
    node.parentNode = this;
    this.childNodes.push(node);
  }

  removeChild(node: VirtualNode): void {
    this.childNodes = this.childNodes.filter((c) => c !== node);
    node.parentNode = null;
  }

  insertBefore(newNode: VirtualNode, referenceNode: VirtualNode): void {
    const index = this.childNodes.indexOf(referenceNode);
    if (index !== -1) {
      newNode.parentNode = this;
      this.childNodes.splice(index, 0, newNode);
    } else {
      this.appendChild(newNode);
    }
  }
}

// === Virtual Style ===
export class VirtualStyle {
  [key: string]: string | any; // allows dynamic properties like backgroundColor, color, etc.

  toString(): string {
    return Object.entries(this)
      .filter(([k, v]) => typeof v === "string")
      .map(([k, v]) => `${this._toKebabCase(k)}: ${v};`)
      .join(" ");
  }

  private _toKebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
}

// === Virtual Element ===
export class VirtualElement extends VirtualNode {
  tagName: string;
  id: string = "";
  className: string = "";
  innerText: string = "";
  innerHTML: string = "";
  style: VirtualStyle = new VirtualStyle();
  eventListeners: Record<string, ((event: any) => void)[]> = {};
  attributes: Record<string, string> = {};

  constructor(
    tagName: string,
    options: {
      id?: string;
      className?: string;
      innerText?: string;
      innerHTML?: string;
      style?: Record<string, string>;
      attributes?: Record<string, string>;
      children?: VirtualNode[];
    } = {}
  ) {
    super(options.children);
    this.tagName = tagName.toUpperCase();
    if (options.id) this.id = options.id;
    if (options.className) this.className = options.className;
    if (options.innerText) this.innerText = options.innerText;
    if (options.innerHTML) this.innerHTML = options.innerHTML;

    if (options.style) {
      for (const [k, v] of Object.entries(options.style)) {
        this.style[k] = v;
      }
    }

    if (options.attributes) {
      for (const [k, v] of Object.entries(options.attributes)) {
        this.attributes[k] = v;
      }
    }
  }

  setAttribute(name: string, value: string): void {
    this.attributes[name] = value;
  }

  getAttribute(name: string): string | null {
    return this.attributes[name] ?? null;
  }

  removeAttribute(name: string): void {
    delete this.attributes[name];
  }

  addEventListener(event: string, callback: (event: any) => void): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  dispatchEvent(event: string, eventObj: any = {}): void {
    const listeners = this.eventListeners[event] || [];
    for (const cb of listeners) {
      cb(eventObj);
    }
  }
}

// === Virtual Text Node ===
export class VirtualTextNode extends VirtualNode {
  data: string;

  constructor(data: string) {
    super();
    this.data = data;
  }

  get nodeValue(): string {
    return this.data;
  }

  set nodeValue(value: string) {
    this.data = value;
  }
}
