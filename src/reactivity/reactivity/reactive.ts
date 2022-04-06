import { mutableHadlers, readonlyHadlers } from "./baseHaddler";

export function reactive(raw) {
    return createActiveObject(raw, mutableHadlers);
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHadlers)
}

function createActiveObject(raw: any, baseHaddler) {
    return new Proxy(raw, baseHaddler);
}

