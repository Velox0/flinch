import { VirtualElement } from "./virtualElement";
import { randomBytes } from "crypto";

export class LiveElement {
  private tag: string;
  private props: Record<string, any>;
  private state: Record<string, any>;
  private requestUrl: string;
  private interval: number;
  private id: string;
  private callback: CallableFunction;
  private resType: string = "text";

  /**
   * @param tag - The tag name of the element
   * @param props - The properties of the element. props.id is used to set the id of the element. otherwise a random id is generated
   * @param state - The state of the element. "state.initial" is used to set the initial content (innerHTML) of the element
   * @param requestUrl - The URL to fetch updates from
   * @param interval - Interval in milliseconds to fetch data. If 0, the data is fetched only once after the element is rendered.
   * @param callback - The callback function to render the updates
   * @param resType - By default result is parsed using .text(). You can override this by setting resType to "json" or "text"
   */
  constructor(
    tag: string,
    propsOrOptions:
      | Record<string, any>
      | {
          props: Record<string, any>;
          state: Record<string, any>;
          requestUrl: string;
          interval: number;
          callback: CallableFunction;
          resType: string;
        },
    state?: Record<string, any>,
    requestUrl?: string,
    interval: number = 1000,
    callback: CallableFunction = () => {},
    resType: string = "text"
  ) {
    this.tag = tag;

    // Check if second parameter is an options object
    if ("props" in propsOrOptions) {
      // First constructor pattern
      this.props = propsOrOptions.props;
      this.state = propsOrOptions.state;
      this.requestUrl = propsOrOptions.requestUrl;
      this.interval = propsOrOptions.interval;
      this.callback = propsOrOptions.callback;
      this.resType = propsOrOptions.resType;
    } else {
      // Second constructor pattern
      this.props = propsOrOptions;
      this.state = state || {};
      this.requestUrl = requestUrl || "";
      this.interval = interval;
      this.callback = callback;
      this.resType = resType;
    }

    this.id = this.props.id || `${randomBytes(16).toString("hex")}`;
    this.props.id = this.id;
  }

  private renderAttributes(): string {
    return Object.entries(this.props)
      .map(
        ([key, value]) => `${key}="${String(value).replace(/"/g, "&quot;")}"`
      )
      .join(" ");
  }

  public async render(): Promise<string> {
    const attributes = this.renderAttributes();

    return await `<${this.tag}
${attributes}>${this.state.initial ?? ""}</${this.tag}>
<script>(function(){
const el = document.getElementById(${JSON.stringify(this.id)});if(!el)return;
${this.interval > 0 ? "setInterval" : "setTimeout"}(async () => {
try{
const res = await fetch(${JSON.stringify(this.requestUrl)});
const renderData = ${this.callback};
if(!res.ok)throw new Error("HTTP " + res.status);
renderData(await res.${this.resType ? this.resType : "text"}());
}catch(e){console.error("LiveElement error", e);}
},${this.interval > 0 ? this.interval : 0});})();</script>`;
  }

  private nextHexId() {
    let num = BigInt("0x" + this.id);
    num += 1n;
    let nextHex = num.toString(16);
    if (nextHex.length < this.id.length) {
      nextHex = nextHex.padStart(this.id.length, "0");
    }
    return nextHex;
  }

  clone() {
    return new LiveElement(this.tag, {
      props: { ...this.props },
      state: this.state,
      requestUrl: this.requestUrl,
      interval: this.interval,
      callback: this.callback,
      resType: this.resType,
    });
  }
}

export let el: VirtualElement = new VirtualElement("", {});
