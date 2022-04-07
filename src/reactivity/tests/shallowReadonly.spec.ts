import { isReadonly, shallowReadonly } from "../reactivity/reactive";

describe('shallowReadonly', () => {
    test('should not make nested object item to be reactive', () => {
        let original = {
            foo: 1,
            baz: {
                baz: 2
            }
        }
        const observed = shallowReadonly(original);
        expect(isReadonly(observed)).toBe(true);
        expect(isReadonly(observed.baz)).toBe(false)
    })
})