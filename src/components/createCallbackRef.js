export function createCallbackRef(onSet, onUnset, onChange, onUpdate) {
  const ref = el => {
    if (el === ref.current) {
      return;
    }

    const previousEl = ref.current;
    const wasSet = ref.current !== null;
    const willSet = el !== null;
    if (wasSet && willSet) {
      if (ref.onChange) {
        ref.onChange(el, previousEl);
      }
      if (ref.onUpdate) {
        ref.onUpdate(el, previousEl);
      }
      ref(null);
      ref(el);
      return;
    }

    ref.current = el;
    if(!wasSet && willSet) {
      if (ref.onSet) {
        ref.onSet(el);
      }
      if (ref.onUpdate) {
        ref.onUpdate(el, previousEl);
      }
    } else if (wasSet && !willSet) {
      if (ref.onUnset) {
        ref.onUnset(previousEl);
      }
      if (ref.onUpdate) {
        ref.onUpdate(el, previousEl);
      }
    }
  };

  ref.current = null;
  ref.onSet = onSet;
  ref.onUnset = onUnset;
  ref.onChange = onChange;
  ref.onUpdate = onUpdate;

  return ref;  
};
