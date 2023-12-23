type Effect = () => void;
export function newState(state: { [key: string | symbol]: any }) {
  const stateEffect = new EffectState();
  return new Proxy(state, {
    get(obj, prop) {
      stateEffect.onGet(prop);
      return obj[prop];
    },
    set(obj, prop, value) {
      obj[prop] = value;
      stateEffect.onSet(prop, value);
      return true;
    },
  });
}

let currentEffect: Effect | undefined;
export function createEffect(effect: Effect) {
  currentEffect = effect;
  effect();
  currentEffect = undefined;
}
class EffectState {
  queued: boolean;
  dirtyEffects: Effect[];
  propsToEffects: { [key: string | symbol]: Effect[] };
  constructor() {
    this.queued = false;
    this.dirtyEffects = [];
    this.propsToEffects = {};
  }
  onGet(prop: string | symbol) {
    const effects =
      this.propsToEffects[prop] ?? (this.propsToEffects[prop] = []);
    effects.push(currentEffect);
  }
  onSet(prop: string | symbol, value: any) {
    if (!this.propsToEffects[prop]) {
      return;
    }
    this.dirtyEffects.push(...this.propsToEffects[prop]);
    if (!this.queued) {
      this.queued = true;
      queueMicrotask(() => {
        this.queued = false;
        this.flush();
      });
    }
  }
  flush() {
    while (this.dirtyEffects.length) {
      const effect = this.dirtyEffects.shift();
      if (!effect) {
        continue;
      }
      effect();
    }
  }
}
