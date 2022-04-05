import { effect } from "../reactivity/effect"
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
        // 优化effect函数中的runner，runner执行的时候返回值
        let foo = 0;
        const runner = effect(() => {
            foo++
            return 'foo'
        })
        expect(foo).toBe(1);
        runner();
        expect(foo).toBe(2);
    })
})