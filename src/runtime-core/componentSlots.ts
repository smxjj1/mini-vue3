export function initSlots(instance, children) {
  // instance.slots = Array.isArray(children) ? children : [children];
  normalizeObjectSlots(children, instance.slots);
}
function normalizeObjectSlots(children: any, slots: any) {
  for (const key in children) {
    const value = children[key];
    slots[key] = normalizeSlotValue(value);
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}
