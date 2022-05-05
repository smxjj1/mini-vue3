import { h } from "../../lib/guide-mini-vue.esm.js";
window.self = null;
export const App = {
  render() {
    window.self = this;
    return h(
      "div",
      { id: "root", class: ["red", "hard"], onClick() {
        console.log('clickRoot');
      } },
      // "hi" + this.msg
      [h("p", { class: "red" }, "hi"), h("h5", { class: "green" ,onMousedown(){
        console.log('onMousedown');
      }}, this.msg)]
    );
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
