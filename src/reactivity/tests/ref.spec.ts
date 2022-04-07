import { effect } from "../src/effect";
import { isReactive } from "../src/reactive";
import { ref } from "../src/ref";

describe("ref", () => {
    it("happy path", () => {
        const a = ref(1);
        expect(a.value).toBe(1);
        expect(isReactive(a)).toBe(true);
    })
    it("should be reactive", () => {
        const a = ref(1);
        let dummy;
        let calls = 0;
        effect(() => {
            calls++;
            dummy = a.value
        });
        expect(calls).toBe(1);
        expect(dummy).toBe(1);
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
        // same value should not trigger
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
    })

    it("should make nestd property reactive", () => {
        const a = ref({
            count: 1
        })
        let dummy;
        effect(() => {
            dummy = a.value.count
        })
        expect(dummy).toBe(1)
        a.value.count = 2;
        expect(dummy).toBe(2)
    })
})