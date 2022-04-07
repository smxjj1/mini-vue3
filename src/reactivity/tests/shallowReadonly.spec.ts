import { isReadonly, shallowReadonly } from "../src/reactive";

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
    test('warn when call set function', () => {
        console.warn = jest.fn();
        let observed = shallowReadonly({
            foo: 1,
            baz: {
                baz: 2
            }
        });
        observed.baz['baz'] = 56;
        expect(console.warn).not.toBeCalled()
        observed.foo = 23;
        expect(console.warn).toBeCalled()


    })
})