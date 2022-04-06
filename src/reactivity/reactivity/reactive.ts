import { mutableHadlers, readonlyHadlers } from "./baseHaddler";

export function reactive(raw) {
    return createActiveObject(raw, mutableHadlers);
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHadlers)
}
export function isReactive(value) {
   return !!value['is_Reactive']
}
export function isReadonly(value) {
   return !!value['is_Readonly']
}
function createActiveObject(raw: any, baseHaddler) {
    return new Proxy(raw, baseHaddler);
}

