import { track, trigger } from "./effect";
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
function createGetter(isReadonly = false) {
    return function get(target, key) {
        const res = Reflect.get(target, key)
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