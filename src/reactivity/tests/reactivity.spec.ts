import { isReactive, reactive } from '../reactivity/reactive'
describe('reactive', () => {
    it("happy path", () => {
        const original = { foo: 1 };
        const observed = reactive(original);
        expect(observed).not.toBe(original);
        expect(observed.foo).toBe(1);
        expect(isReactive(observed)).toBe(true);
        expect(isReactive(original)).toBe(false);
    });
    test('nested reactive', () => {
        const original = {
            nested: {
                foo: 1
            },
            arrayItem: [{ baz: 10 }]
        };
        const observed = reactive(original);
        expect(isReactive(observed)).toBe(true);
        expect(isReactive(observed.nested)).toBe(true)
        expect(isReactive(observed.arrayItem)).toBe(true)
        expect(isReactive(observed.arrayItem[0])).toBe(true)
    })
})