'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const extend = Object.assign;
const isObject = function (params) {
    return params !== null && typeof params === "object";
};
const isOn = (key) => /^on[A-Z]/.test(key);
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : "";
    });
};
const toHandlerKey = (str) => {
    return str ? "on" + capitalize(str) : "";
};

var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
    ShapeFlags[ShapeFlags["SLOT_COMPONENT"] = 16] = "SLOT_COMPONENT";
})(ShapeFlags || (ShapeFlags = {}));

const targetMap = new Map();
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        }
        if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        // 判断如果res还是个对象的话继续执行reactive 或者readonly
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        //TODO 触发依赖
        trigger(target, key);
        return res;
    };
}
const mutableHadlers = {
    get,
    set
};
const readonlyHadlers = {
    get: readonlyGet,
    set(target, key, value) {
        // can not set 
        console.warn(`key:${key} set 失败 readonly 条件下${target}不能重新赋值`);
        return true;
    }
};
// export const shallowReadonlyHadlers = {
//     get: shallowReadonlyGet,
//     set(target, key, value) {
//         // can not set 
//         console.warn(`key:${key} set 失败 readonly 条件下${target}不能重新赋值`)
//         return true
//     }
// }
const shallowReadonlyHadlers = extend({}, readonlyHadlers, {
    get: shallowReadonlyGet
});

// 抽离出is_Reactive 和 is_Readonly枚举
var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REACTIVE"] = "_v_isReactive";
    ReactiveFlags["IS_READONLY"] = "_v_isReadonly";
})(ReactiveFlags || (ReactiveFlags = {}));
function reactive(raw) {
    return createActiveObject(raw, mutableHadlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHadlers);
}
function createRactiveObject(target, baseHaddler) {
    if (!isObject(target)) {
        console.warn(`target ${target} must be a Object type`);
        return target;
    }
    return new Proxy(target, baseHaddler);
}
function shallowReadonly(raw) {
    return createRactiveObject(raw, shallowReadonlyHadlers);
}

const emit = (instance, event, ...args) => {
    const { props } = instance;
    const toHandlerName = toHandlerKey(camelize(event));
    const handler = props[toHandlerName];
    handler && handler(...args);
};

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        console.log(key);
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function initSlots(instance, children) {
    // instance.slots = Array.isArray(children) ? children : [children];
    const { vnode } = instance;
    if (vnode.shapeFlag & ShapeFlags.SLOT_COMPONENT) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key];
        slots[key] = (props) => normalizeSlotValue(value(props));
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: () => { },
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit,
        });
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
    const { shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
    }
    else if (shapeFlag & ShapeFlags.ELEMENT) {
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
    const { children, props, shapeFlag } = vnode;
    for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            const val = props[key];
            if (isOn(key)) {
                const event = key.slice(2).toLowerCase();
                el.addEventListener(event, val);
            }
            else {
                el.setAttribute(key, val);
            }
        }
    }
    //children can be string or object
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
    }
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
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
        shapeFlag: getShapFlags(type),
        el: null,
    };
    if (typeof children === "string") {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
    }
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        if (typeof children === "object") {
            vnode.shapeFlag |= ShapeFlags.SLOT_COMPONENT;
        }
    }
    return vnode;
}
function getShapFlags(type) {
    return typeof type === "string"
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATEFUL_COMPONENT;
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

const renderSlots = (slots, name, props) => {
    const slot = slots[name];
    if (typeof slot === "function") {
        return createVNode("div", {}, slot(props));
    }
};

exports.createApp = createApp;
exports.h = h;
exports.renderSlots = renderSlots;
