import { mutableHadlers, readonlyHadlers, shallowReadonlyHadlers } from "./baseHaddler";
// 抽离出is_Reactive 和 is_Readonly枚举
export const enum ReactiveFlags {
    IS_REACTIVE = '_v_isReactive',
    IS_READONLY = '_v_isReadonly'
}
export function reactive(raw) {
    return createActiveObject(raw, mutableHadlers);
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHadlers)
}
export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE]
}
export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}
function createActiveObject(raw: any, baseHaddler) {
    return new Proxy(raw, baseHaddler);
}
export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHadlers)
}

