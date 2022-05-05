export const extend = Object.assign;
export const isObject = function (params) {
  return params !== null && typeof params === "object";
};
export const hasChanged = (val, newVal) => {
  return !Object.is(val, newVal);
};
export const isOn = (key: string) => /^on[A-Z]/.test(key);
export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key);
