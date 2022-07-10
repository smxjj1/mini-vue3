// 组件 provide 和 inject 功能
import { h, provide, inject } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";
const Provider = {
  name: "Provider",
  setup() {
    provide("foo", "foofirst");
    provide("bar", "barfirst");
  },
  render() {
    return h("div", {}, [h("p", {}, "Provider"), h(ProviderTwo), h(Foo)]);
  },
};

const ProviderTwo = {
  name: "ProviderTwo",
  setup() {
    provide("foo", "fooTwo");
    const foo = inject("foo");

    return {
      foo,
    };
  },
  render() {
    return h("div", {}, [
      h("p", {}, `ProviderTwo foo:${this.foo}`),
      h(Consumer),
    ]);
  },
};

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    const baz = inject("baz", () => "bazDefault");
    // const baz = inject("baz", () => "bazDefault");

    return {
      foo,
      bar,
      baz,
    };
  },

  render() {
    return h(
      "div",
      {},
      `Consumer: foo-- ${this.foo} - bar--${this.bar} - baz--${this.baz}`
    );
  },
};

export const App = {
  name: "App",
  setup() {},
  render() {
    return h("div", {}, [h("p", {}, "apiInject"), h(Provider)]);
  },
};
