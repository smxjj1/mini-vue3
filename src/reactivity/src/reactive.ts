import { isObject } from "../../share/index";
import {
  mutableHadlers,
  readonlyHadlers,
  shallowReadonlyHadlers,
} from "./baseHaddler";
// 抽离出is_Reactive 和 is_Readonly枚举
export const enum ReactiveFlags {
  IS_REACTIVE = "_v_isReactive",
  IS_READONLY = "_v_isReadonly",
}
export function reactive(raw) {
  return createActiveObject(raw, mutableHadlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHadlers);
}
export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}
export function isProxy(params: Object) {
  return isReadonly(params) || isReactive(params);
}
export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}
function createRactiveObject(target: any, baseHaddler) {
  if (!isObject(target)) {
    console.warn(`target ${target} must be a Object type`);
    return target;
  }
  return new Proxy(target, baseHaddler);
}
export function shallowReadonly(raw) {
  return createRactiveObject(raw, shallowReadonlyHadlers);
}
