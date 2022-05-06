import { createVNode } from "../vnode";

export const renderSlots = (slots, name) => {

  const slot = slots[name];
  if (slot) {
    return createVNode("div", {}, slot);
  }
};
