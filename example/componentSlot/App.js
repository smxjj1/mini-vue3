import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    const app = h("div", {}, "App");
    // const foo = h(Foo, {}, [h("p", {}, "123"), h("h2", {}, "789")]);
    const foo = h(
      Foo,
      {},
      {
        header: h("p", {}, "header"),
        footer: h("h2", {}, "footer"),
      }
    );
    // const foo = h(Foo, {}, h("p", {}, "123"));
    return h("div", {}, [app, foo]);
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
