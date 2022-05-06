import { camelize, toHandlerKey } from "../share/index";

export const emit = (instance, event, ...args) => {

  const { props } = instance;
  const toHandlerName = toHandlerKey(camelize(event));
  const handler = props[toHandlerName];
  handler && handler(...args);
};
