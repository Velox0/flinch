export interface HtmlResult {
  strings: string[];
  values: any[];
  updateStringAt(index: number, str: string): void;
  updateValueAt(index: number, value: any): void;
  updateMatches(
    pattern: RegExp,
    replacement: string,
    updateValue: boolean,
    flatten: boolean
  ): void;
  toString(): string;
  apply(fn: (val: any) => any, onlyStrings: boolean): void;
  [Symbol.iterator](): Generator<string | unknown, void, unknown>;
}

export function html(
  strings: TemplateStringsArray,
  ...values: any[]
): HtmlResult {
  const result: HtmlResult = {
    strings: Array.from(strings),
    values: Array.from(values),

    updateStringAt(index: number, str: string) {
      this.strings[index] = str;
    },

    updateValueAt(index: number, value: any) {
      this.values[index] = value;
    },

    updateMatches(
      pattern: RegExp,
      replacement: string,
      updateValue: boolean = false,
      flatten: boolean = true
    ) {
      let i = 0;
      for (i = 0; i < this.strings.length; i++) {
        this.strings[i] = this.strings[i].replace(pattern, replacement);
        if (updateValue) {
          if (typeof this.values[i] === "string") {
            this.values[i] = this.values[i].replace(pattern, replacement);
          } else if (
            this.values[i] &&
            typeof this.values[i] === "object" &&
            typeof this.values[i].updateMatches === "function"
          ) {
            if (flatten) {
              this.values[i] = this.values[i].toString();
              this.values[i] = this.values[i].replace(pattern, replacement);
            } else {
              this.values[i] = this.values[i].updateMatches(
                pattern,
                replacement,
                updateValue
              );
            }
          }
        }
      }
    },

    toString() {
      return this.strings.reduce(
        (acc, str, i) => acc + str + (this.values[i] ?? ""),
        ""
      );
    },

    apply(fn: (val: any) => any, onlyStrings: boolean = true) {
      for (let i = 0; i < this.strings.length; i++) {
        this.strings[i] = fn(this.strings[i]);
        if (!onlyStrings && i < this.values.length) {
          this.values[i] = fn(this.values[i]);
        }
      }
    },

    *[Symbol.iterator]() {
      for (let i = 0; i < this.strings.length; i++) {
        yield this.strings[i];
        if (i < this.values.length) yield this.values[i];
      }
    },
  };

  return result;
}
