import { isObject } from "../share/index";
import { createComponentInstance, setupComponent } from "./component";
import { createVNode } from "./vnode";

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
  setupRenderEffect(instance,vnode, container);
}
function setupRenderEffect(instance: any,vnode, container) {
  const { proxy } = instance;
  // bind 和call的不同写法
  // let proxyRender = instance.render.bind(proxy);
  // const subTree = proxyRender();
  const subTree = instance.render.call(proxy);

  patch(subTree, container);
  vnode.el = subTree.el;
}

function processElement(vnode, container) {
  mountElement(vnode, container);
}
function mountElement(vnode: any, container: any) {
  //仅仅是type是element的时候赋值，
  const el = (vnode.el = document.createElement(vnode.type));
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
