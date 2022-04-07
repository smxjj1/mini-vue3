import { isProxy, isReadonly, readonly } from "../src/reactive"

describe('readonly', () => {
    it('happy path', () => {
        let original = {
            foo: 1,
            baz: {
                baz: 2
            }
        };
        let wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(wrapped.foo).toBe(1);
        expect(isReadonly(wrapped)).toBe(true);
        expect(isReadonly(original)).toBe(false);
        expect(isProxy(wrapped)).toBe(true);
        // expect(isReadonly(wrapped.baz)).toBe(false);
        expect(isReadonly(wrapped.baz)).toBe(true);

    })
    it('warn when call set function', () => {
        console.warn = jest.fn()
        let original = readonly({
            age: 10
        })
        original.foo = 112
        expect(console.warn).toBeCalled()
    })
})