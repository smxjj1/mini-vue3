import { readonly } from "../reactivity/reactive"

describe('readonly', () => {
    it('happy path', () => {
        let original = {
            foo: 1,
            baz: {
                baz: 2
            }
        }
        let wrapped = readonly(original)
        expect(wrapped).not.toBe(original)
        expect(wrapped.foo).toBe(1)

    })
})