'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isObject = function (params) {
    return params !== null && typeof (params) === 'object';
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
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
    instance.proxy = new Proxy({}, {
        get(target, key) {
            const { setupState } = instance;
            if (key in setupState) {
                return setupState[key];
            }
            if (key === '$el') {
                return instance.vnode.el;
            }
        },
    });
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
    patch(vnode, container);
}
function patch(vnode, container) {
    // TODO 判断vnode是不是一个element类型
    if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
    else if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance, vnode, container) {
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
function mountElement(vnode, container) {
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
    }
    else if (Array.isArray(children)) {
        children.forEach((v) => {
            patch(v, el);
        });
    }
    //TODO handle object children
    container.append(el);
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            let finalRootContainer = queryContainer(rootContainer);
            const vnode = createVNode(rootComponent);
            render(vnode, finalRootContainer);
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
        return document.querySelector(rootContainer);
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
