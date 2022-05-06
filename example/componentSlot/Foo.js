import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js";
export const Foo = {
  setup() {
    return {};
  },
  render() {
    const foo = h("p", {}, "foo");
    console.log(this.$slots, "this.$slots this");
    // return h("div", {}, [foo, h("div", {}, this.$slots)]);
    let age = 18;
    let name = "lilith";
    return h("div", {}, [
      renderSlots(this.$slots, "header", { age }),
      foo,
      renderSlots(this.$slots, "footer", { name }),
    ]);
  },
};
