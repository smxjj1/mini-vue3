import { isTracking, trackEffects, triggerEffects } from "./effect";

class RefImpl {
    private _value: any;
    public dep;
    constructor(value) {
        this._value = value;
        this.dep = new Set();
    }
    get value() {
        if (isTracking()) {
            trackEffects(this.dep);
        };
        return this._value;
    }
    set value(newValue) {
        if(Object.is(this._value,newValue)) return;
        this._value = newValue;
        triggerEffects(this.dep);

    }
}
export function ref(value: any) {
    return new RefImpl(value);
}