export function newState(state: { [key: string | symbol]: any }) {
  return new Proxy(state, {
    get(obj, prop) {
      return obj[prop];
    },
    set(obj, prop, value) {
      obj[prop] = value;
      return true;
    },
  });
}
