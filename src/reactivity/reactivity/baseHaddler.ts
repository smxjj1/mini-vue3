import { isObject } from "../../share";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {

        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        }
        if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }
        const res = Reflect.get(target, key)
        if (shallow) {
            return res
        }
        // 判断如果res还是个对象的话继续执行reactive 或者readonly
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        // 收集依赖
        if (!isReadonly) {
            track(target, key)
        }
        return res
    }
}

function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value)
        //TODO 触发依赖
        trigger(target, key)
        return res
    }
}

export const mutableHadlers = {
    get,
    set
}

export const readonlyHadlers = {
    get: readonlyGet,
    set(target, key, value) {
        // can not set 
        console.warn(`key:${key} set 失败 readonly 条件下${target}不能重新赋值`)
        return true
    }
}
export const shallowReadonlyHadlers = {
    get: shallowReadonlyGet,
    set(target, key, value) {
        // can not set 
        console.warn(`key:${key} set 失败 readonly 条件下${target}不能重新赋值`)
        return true
    }
}