import { h } from "../../lib/guide-mini-vue.esm.js";
export const Foo = {
  setup() {
    return {};
  },
  render() {
    const foo = h("p", {}, "foo");
    console.log(this.$slots, "this.$slots this");
    return h("div", {}, [foo,this.$slots]);
  },
};
