import { Ref, computed, ref, unref, watch } from 'vue';

export interface Options<T> {
  valuePropName?: string;
  trigger?: string;
  defaultValue?: T;
  defaultValuePropName?: string;
}

export const useControllableValue = <T>(
  props: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit: (event: any, ...args: any[]) => void,
  options: Options<T> = {}
): [Ref<T>, (value: T) => void] => {
  const valuePropName = computed(() => options.valuePropName || 'modelValue');
  const trigger = computed(() => options.trigger || 'update:modelValue');
  const defaultValuePropsName = computed(() => options.defaultValuePropName || 'defaultValue');

  const internalValue = ref(props.modelValue) as Ref<T | undefined>;

  const isControlled = computed(() => Reflect.get(props, unref(valuePropName)) !== undefined);
  const mergedDefaultValue = computed(() => {
    if (Reflect.get(props, unref(defaultValuePropsName)) !== undefined) {
      return props[unref(defaultValuePropsName)] as T;
    }
    return options.defaultValue as T;
  });
  const finalValue = computed<T>(() => {
    if (unref(isControlled)) {
      return props[unref(valuePropName)] as T;
    }
    if (unref(internalValue) !== undefined) {
      return unref(internalValue) as T;
    }
    return unref(mergedDefaultValue);
  });

  // reset internalValue after changing control mode
  watch(
    isControlled,
    () => {
      internalValue.value = undefined;
    },
    { flush: 'sync' }
  );

  const emitUpdateValue = (value: T, ...args: unknown[]) => {
    if (!unref(isControlled)) {
      internalValue.value = value;
    }
    emit(unref(trigger), unref(value), ...args);
  };

  return [finalValue, emitUpdateValue];
};
