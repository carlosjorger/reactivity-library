type Effect = () => void;
export function newState(state: { [key: string | symbol]: any }) {
  return new Proxy(state, {
    get(obj, prop) {
      onGet(prop);
      return obj[prop];
    },
    set(obj, prop, value) {
      obj[prop] = value;
      onSet(prop, value);
      return true;
    },
  });
}

const propsToEffects = {} as { [key: string | symbol]: Effect[] };

let currentEffect: Effect | undefined;
export function createEffect(effect: Effect) {
  currentEffect = effect;
  effect();
  currentEffect = undefined;
}
function onGet(prop: string | symbol) {
  const effects = propsToEffects[prop] ?? (propsToEffects[prop] = []);
  effects.push(currentEffect);
}
const dirtyEffects = [] as Effect[];
let queued = false;
function onSet(prop: string | symbol, value: any) {
  if (!propsToEffects[prop]) {
    return;
  }
  dirtyEffects.push(...propsToEffects[prop]);
  if (!queued) {
    queued = true;
    queueMicrotask(() => {
      queued = false;
      flush();
    });
  }
}
function flush() {
  while (dirtyEffects.length) {
    const effect = dirtyEffects.shift();
    if (!effect) {
      continue;
    }
    effect();
  }
}
