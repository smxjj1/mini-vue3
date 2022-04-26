import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  render() {
    return h(
      "div",
      { id: "root", class: ["red", "hard"] },
      // "hi" + this.msg
      [h("p", { class: 'red' }, "hi"), h("h5", { class: "green" }, "mini-vue")]
    );
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
