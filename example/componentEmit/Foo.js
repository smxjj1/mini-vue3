import { h } from "../../lib/guide-mini-vue.esm.js";
export const Foo = {
  setup(props, { emit }) {
    const emitAdd = function () {
      emit("add", "a", "b");
      emit("add-Foo", "add-Foo a", "add-Foo b");
    };
    return {
      emitAdd,
    };
  },
  render() {
    const btn = h(
      "button",
      {
        onClick: this.emitAdd,
      },
      "emitAdd"
    );
    const foo = h("p", {}, "foo");
    return h("div", {}, [foo, btn]);
  },
};
