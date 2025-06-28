import { randomBytes } from "crypto";

export class LiveElement {
  private tag: string;
  private props: Record<string, any>;
  private state: Record<string, any>;
  private requestUrl: string;
  private interval: number;
  private id: string;
  private renderData: (data: any) => any;
  private innerHTML: boolean;
  private makeInitialRequest: boolean = true;
  private resType: string = "text";

  constructor(
    tag: string,
    props: Record<string, any>,
    state: Record<string, any>,
    requestUrl: string,
    interval: number = 1000,
    renderData: (data: any) => any = (data) => data,
    innerHTML: boolean = false,
    makeInitialRequest: boolean = true,
    resType: string = "text"
  ) {
    this.tag = tag;
    this.props = props;
    this.state = state;
    this.requestUrl = requestUrl;
    this.interval = interval;
    this.id = props.id || `${randomBytes(16).toString("hex")}`;
    this.props.id = this.id;
    this.renderData = renderData;
    this.innerHTML = innerHTML;
    this.makeInitialRequest = makeInitialRequest;
    this.resType = resType;
  }

  private renderAttributes(): string {
    return Object.entries(this.props)
      .map(
        ([key, value]) => `${key}="${String(value).replace(/"/g, "&quot;")}"`
      )
      .join(" ");
  }

  private async renderInitialContent(): Promise<string> {
    if (this.makeInitialRequest) {
      try {
        const res = await fetch(JSON.stringify(this.requestUrl));
        if (!res.ok) return this.state.initial;
        const data = await res.text();
        return this.renderData(data);
      } catch (e) {
        console.error("LiveElement error", e);
        return this.state.initial;
      }
    }
    return this.state.initial ?? "";
  }

  public async render(): Promise<string> {
    const attributes = this.renderAttributes();
    const content = await this.renderInitialContent();

    return await `
<${this.tag} ${attributes}>${content}</${this.tag}>
<script>
(function(){
  const el = document.getElementById(${JSON.stringify(this.id)});
  if (!el) return;
  ${this.interval > 0 ? "setInterval(" : "setTimeout("}
  async function(){
    try {
      const res = await fetch(${JSON.stringify(this.requestUrl)});
      const renderData = ${this.renderData};
      // if innerHTML is true, we need to parse the HTML
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await renderData(await res.${this.resType ? this.resType : "text"}());
      el.${this.innerHTML ? "innerHTML" : "innerText"} = data;
    } catch (e) {
      console.error("LiveElement error", e);
    }
  }, ${this.interval > 0 ? this.interval : 0});
})();
</script>
`;
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
    return new LiveElement(
      this.tag,
      { ...this.props, id: this.nextHexId() },
      this.state,
      this.requestUrl,
      this.interval,
      this.renderData,
      this.innerHTML,
      this.makeInitialRequest,
      this.resType
    );
  }
}
