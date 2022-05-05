import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export const App = {
  name: "App",
  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
        onClick() {
          console.log("clickRoot");
        },
      },
      // "hi" + this.msg
      [
        h("p", { class: "red" }, "hi"),
        h(
          "h5",
          {
            class: "green",
            onMousedown() {
              console.log("onMousedown");
            },
          },
          this.msg
        ),
        h(Foo, { count: 1 }),
      ]
    );
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
