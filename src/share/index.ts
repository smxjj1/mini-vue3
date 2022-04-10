export const extend = Object.assign
export const isObject = function (params) {
    return params !== null && typeof (params) === 'object'
}
export const hasChanged = (val, newVal) => {
    return !Object.is(val, newVal);
}