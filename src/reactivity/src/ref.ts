import { hasChanged } from "../../share";
import { isTracking, trackEffects, triggerEffects } from "./effect";

class RefImpl {
    private _value: any;
    public dep;
    constructor(value) {
        this._value = value;
        this.dep = new Set();
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }
    set value(newValue) {
        if (hasChanged(this._value, newValue)) {
            this._value = newValue;
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