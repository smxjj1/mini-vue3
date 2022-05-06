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
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : "";
  });
};
export const toHandlerKey = (str: string) => {
  return str ? "on" + capitalize(str) : "";
};
