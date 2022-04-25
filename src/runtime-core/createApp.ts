import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      let finalRootContainer = queryContainer(rootContainer)
      const vnode = createVNode(rootComponent);
      render(vnode, finalRootContainer);
    },
  };
}

function queryContainer(rootContainer) {
  var isDOM =
    typeof HTMLElement === "object"
      ? function (obj) {
          return obj instanceof HTMLElement;
        }
      : function (obj) {
          return (
            obj &&
            typeof obj === "object" &&
            obj.nodeType === 1 &&
            typeof obj.nodeName === "string"
          );
        };
  if (typeof rootContainer === "string") {
    document.querySelector("rootContainer");
  } else if (isDOM(rootContainer)) {
    return rootContainer;
  } else {
    throw new Error("输入的跟组件必须为一个id或者具体的element元素");
  }
}
