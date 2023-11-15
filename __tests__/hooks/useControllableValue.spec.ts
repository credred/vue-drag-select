import { reactive, unref } from 'vue';
import { useControllableValue } from '@/hooks/useControllableValue';

describe('useControllableValue', () => {
  it('not control', () => {
    const props = reactive<{ modelValue?: number }>({});
    const emit = jasmine.createSpy();
    const [value, emitValue] = useControllableValue(props, emit);
    emitValue(2);

    expect(emit).toHaveBeenCalledWith('update:modelValue', 2);
    expect(unref(value)).toBe(2);
    expect(props.modelValue).toBe(undefined);
  });

  it('controlled', () => {
    const props = reactive<{ modelValue?: number }>({ modelValue: 1 });

    const emit = jasmine
      .createSpy('emit', (event: string, v: number) => {
        props.modelValue = v;
      })
      .and.callThrough();
    const [value, emitValue] = useControllableValue(props, emit);

    emitValue(2);

    expect(unref(value)).toBe(2);
    expect(props.modelValue).toBe(2);
  });

  it('defaultValue prop', () => {
    const props = reactive<{ defaultValue?: number }>({ defaultValue: 1 });

    const emit = jasmine.createSpy();
    const [value, emitValue] = useControllableValue(props, emit);

    expect(unref(value)).toBe(1);

    emitValue(2);

    expect(unref(value)).toBe(2);
  });

  it('defaultValue option', () => {
    const props = reactive({});

    const emit = jasmine.createSpy();
    const [value] = useControllableValue(props, emit, { defaultValue: 1 });

    expect(unref(value)).toBe(1);
  });

  it('The priority of defaultValue prop should be higher than that of defaultValue option', () => {
    const props = reactive({ defaultValue: 3 });

    const emit = jasmine.createSpy();
    const [value] = useControllableValue(props, emit, { defaultValue: 4 });

    expect(unref(value)).toBe(3);
  });

  it('custom valuePropName and trigger', () => {
    const props = reactive({ otherValue: 3, trigger: 'update:otherValue' });

    const emit = jasmine
      .createSpy('emit', (event: string, v: number) => {
        expect(event).toBe('update:otherValue');
        props.otherValue = v;
      })
      .and.callThrough();
    const [value, emitValue] = useControllableValue(props, emit, {
      valuePropName: 'otherValue',
      trigger: 'update:otherValue',
    });

    expect(unref(value)).toBe(3);

    emitValue(2);

    expect(unref(value)).toBe(2);
  });

  it('custom defaultValueProps name', () => {
    const props = reactive({ defaultOtherValue: 3 });

    const emit = jasmine.createSpy();
    const [value] = useControllableValue(props, emit, {
      defaultValuePropName: 'defaultOtherValue',
    });

    expect(unref(value)).toBe(3);
  });

  it('should fallback to defaultValue after clearing modelValue', () => {
    const props = reactive<{ modelValue?: number; defaultValue: number }>({ modelValue: 1, defaultValue: 3 });

    const emit = jasmine.createSpy();
    const [value] = useControllableValue(props, emit);

    expect(unref(value)).toBe(1);
    props.modelValue = undefined;

    expect(unref(value)).toBe(3);
  });
});
