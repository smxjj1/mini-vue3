import { hasChanged, isObject } from "../../share";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
    private _value: any;
    public dep;
    private _rawValue: any;
    constructor(value) {
        this._rawValue = value;
        this._value = isObject(value) ? reactive(value) : value;
        this.dep = new Set();
    }
    get value() {

        trackRefValue(this);
        return this._value;
    }
    set value(newValue) {
        if (hasChanged(this._value, newValue)) {
            this._rawValue = newValue;
            this._value = isObject(newValue) ? reactive(newValue) : newValue;
            triggerEffects(this.dep);
        }
    }
}
export function ref(value: any) {
    return new RefImpl(value);
}
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep);
    };
}