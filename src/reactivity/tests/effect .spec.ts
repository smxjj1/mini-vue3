import { effect,stop } from "../reactivity/effect"
import { reactive } from "../reactivity/reactive"

describe('effect', () => {
    it('happy path', () => {
        // 生成一个proxy对象
        let user = reactive({
            age: 10
        })
        // 通过effect去更新对象
        let nextAge
        effect(() => {
            nextAge = user.age + 1
        })
        expect(nextAge).toBe(11)
        // // nextAge自更新
        user.age++
        expect(nextAge).toBe(12)
    });
    // 优化effect函数中的runner，runner执行的时候返回值
    it('should return runner when call effect', () => {
        // 当调用 runner 的时候可以重新执行 effect.run
        // runner 的返回值就是用户给的 fn 的返回值

        let foo = 0;
        const runner = effect(() => {
            foo++
            return foo
        })
        expect(foo).toBe(1);
        runner();
        expect(foo).toBe(2);
        expect(runner()).toBe(3);
    });

    it("scheduler", () => {
        // 1. 通过effect的第二个参数给定一个scheduler 的fn
        // 2. effect 的第一次执行的时候还会执行fn
        // 3. 当响应式执行set update的时候不执行fn二十执行scheduler
        // 4. 如果执行runner的时候，会再次执行fn
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({ foo: 1 });
        const runner = effect(() => {
            dummy = obj.foo;
        },
            { scheduler }
        );
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        // should be called on first trigger
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        // should not run yet
        expect(dummy).toBe(1);
        // manually run 
        run();
        // should have run 
        expect(dummy).toBe(2)

    })
    // 实现stop的单测
    it('stop', () => {
        let dummy;
        let obj = reactive({ prop: 1 });
        let runner = effect(() => {
            dummy = obj.prop;
        });
        obj.prop = 2;
        expect(dummy).toBe(2)
        // 当stop调用的时候,更新的对象不在改变
        stop(runner);
        stop(runner);
        stop(runner);
        stop(runner);
        stop(runner);

        obj.prop = 3;
        expect(dummy).toBe(2)
        //再次调用runner的时候
        runner();
        expect(dummy).toBe(3)

    })
})