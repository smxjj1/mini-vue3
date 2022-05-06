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
      },
      // "hi" + this.msg
      [
        h("p", { class: "red" }, "hi"),
        h(
          "h5",
          {
            class: "green",
          },
          this.msg
        ),
        h(Foo, {
          count: 1,
          onAdd(a, b) {
            console.log("emit onAdd");
            console.log(a);
            console.log(b);
          },
          onAddFoo(a, b) {
            console.log("emit onAddFoo");
            console.log(a);
            console.log(b);
          },
        }),
      ]
    );
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
