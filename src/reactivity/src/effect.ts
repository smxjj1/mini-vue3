import { extend } from "../../share"
// 变量统一到顶部
let activeEffect;
let shouldTrack = false;
class ReactiveEffect {
    private _fn: any
    public scheduler: Function | undefined
    deps = []
    onStop?: () => void
    private active = true
    constructor(fn, scheduler?: Function) {
        this._fn = fn;
        this.scheduler = scheduler;
    }
    run() {
        // stop走这个逻辑
        if (!this.active) {
            return this._fn();
        }
        activeEffect = this;
        shouldTrack = true;
        const r = this._fn();
        // 重置shouldTrack
        shouldTrack = false;
        return r;
    }
    stop() {
        if (this.active) {
            cleanUpEffect(this);
            // 当存在onStop 时，执行onStop
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}
// 抽离stop中清空dep的功能函数
function cleanUpEffect(effect) {

    effect.deps.forEach((dep: any) => {
        dep.delete(effect);
    });
    //清空变量释放缓存
    effect.deps.length = 0
}
const targetMap = new Map();
export function track(target, key) {
    // target --->key ---->dep
    // 重构优化这两个判断
    // if (!activeEffect) return
    // if (!shouldTrack) return
    if (!isTracking()) return;
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    // 看看 dep 之前有没有添加过，添加过的话 那么就不添加了
    trackEffects(dep)
}
export function trackEffects(dep){
    if(dep.has(activeEffect)) return
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}
export function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffects(dep)
   
}
export function triggerEffects(dep){
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }

    }
}
type effectOptions = {
    scheduler?: Function
    onStop?: Function
}
export function effect(fn, options: effectOptions = {}) {
    let _effect = new ReactiveEffect(fn, options.scheduler)
    extend(_effect, options)
    _effect.run()
    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect;
    return runner
}

export function stop(runner) {
    runner.effect.stop();
}