import { createVNode } from "./vnode";

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        let finalRootContainer = queryContainer(rootContainer);
        const vnode = createVNode(rootComponent);
        render(vnode, finalRootContainer);
      },
    };
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
    return document.querySelector(rootContainer);
  } else {
    // 返回一个dom元素或者canvas元素
    return rootContainer;
  }
}
