import { h, inject } from "../../lib/guide-mini-vue.esm.js";
export const Foo = {
  setup(props) {
    const baz = inject("foo", () => "bazDefault");
    console.log(props);
    return {
      baz,
    };
  },
  render() {
    return h(
      "div",
      {},
      "childComponent injectProvider----" + this.baz
    );
  },
};
