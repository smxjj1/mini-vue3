import { isOn } from "../share/index";
import { ShapeFlags } from "../share/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode: any, container: any) {
  // TODO 判断vnode是不是一个element类型
  const { type, shapeFlag } = vnode;
  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      } else if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
      }
      break;
  }
}
function processFragment(vnode: any, container: any) {
  mountChildren(vnode, container);
}
function mountChildren(vnode, container) {
  vnode.children.forEach(function (v) {
    patch(v, container);
  });
}
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance: any, vnode, container) {
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
  const { children, props, shapeFlag } = vnode;
  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      const val = props[key];

      if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, val);
      } else {
        el.setAttribute(key, val);
      }
    }
  }
  //children can be string or object
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    children.forEach((v) => {
      patch(v, el);
    });
  }

  //TODO handle object children

  container.append(el);
}
function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textVnode = (vnode.el = document.createTextNode(children));
  container.append(textVnode);
}
