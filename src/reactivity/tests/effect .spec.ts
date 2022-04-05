import { effect } from "../reactivity/effect"
import { reactive } from "../reactivity/reactive"

describe('effect',()=>{
    it('happy path',()=>{
        // 生成一个proxy对象
        let user = reactive({
            age:10
        })
        // 通过effect去更新对象
        let nextAge 
       effect(()=>{
            nextAge =  user.age +1
        })
        expect(nextAge).toBe(11)
        // // nextAge自更新
        user.age++
        expect(nextAge).toBe(12)
    })
})