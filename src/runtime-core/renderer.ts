import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {

  patch(vnode, container);
}
function patch(vnode: any, container: any) {
  // TODO 判断vnode是不是一个element类型
  if(typeof vnode.type ==='object'){
    processComponent(vnode, container);
  }else if(typeof vnode.type==='string'){
    processElement()
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

function processElement() {
  throw new Error("Function not implemented.");
}
