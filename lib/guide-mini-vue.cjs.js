'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render;
}

function render(vnode, container) {
    patch(vnode);
}
function patch(vnode, container) {
    // TODO 判断vnode是不是一个element类型
    if (typeof vnode.type === 'object') {
        processComponent(vnode);
    }
    else if (typeof vnode.type === 'string') {
        processElement();
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    patch(subTree);
}
function processElement() {
    throw new Error("Function not implemented.");
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            queryContainer(rootContainer);
            const vnode = createVNode(rootComponent);
            render(vnode);
        },
    };
}
function queryContainer(rootContainer) {
    var isDOM = typeof HTMLElement === "object"
        ? function (obj) {
            return obj instanceof HTMLElement;
        }
        : function (obj) {
            return (obj &&
                typeof obj === "object" &&
                obj.nodeType === 1 &&
                typeof obj.nodeName === "string");
        };
    if (typeof rootContainer === "string") {
        document.querySelector("rootContainer");
    }
    else if (isDOM(rootContainer)) {
        return rootContainer;
    }
    else {
        throw new Error("输入的跟组件必须为一个id或者具体的element元素");
    }
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
