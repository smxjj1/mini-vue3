import { isObject } from "../share/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode: any, container: any) {
  // TODO 判断vnode是不是一个element类型
  if (isObject(vnode.type)) {
    processComponent(vnode, container);
  } else if (typeof vnode.type === "string") {
    processElement(vnode, container);
  }
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}
function setupRenderEffect(instance: any, container) {
  const subTree = instance.render();

  patch(subTree, container);
}

function processElement(vnode, container) {
  mountElement(vnode, container);
}
function mountElement(vnode: any, container: any) {
  const el = document.createElement(vnode.type);
  const { children, props } = vnode;
  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      const element = props[key];
      el.setAttribute(key, element);
    }
  }
  //children can be string or object
  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach((v) => {
      patch(v, el);
    });
  }

  //TODO handle object children

  container.append(el);
}
