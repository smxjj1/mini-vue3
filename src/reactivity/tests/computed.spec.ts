import { computed } from "../src/computed";
import { reactive } from "../src/reactive";

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });
    const age = computed(() => {
      return user.age;
    });
    expect(age.value).toBe(10);
  });
  it("should compute lazily", () => {
    const value = reactive({
      foo: 10,
    });
    const getter = jest.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);
    // lazy
    expect(getter).not.toHaveBeenCalled();
    expect(cValue.value).toBe(10);
    expect(getter).toHaveBeenCalledTimes(1);
    //should be called untill needed
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);
    //
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
