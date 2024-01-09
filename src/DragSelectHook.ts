import { watch, ref, unref, nextTick } from 'vue';
import { Option } from './DragSelectCommon';
import { useDragRect } from './hooks/useDragRect';
import useAutoScrollByPoint from './hooks/useAutoScrollByPoint';
import { MaybeNullableRef, MaybeRef, Position } from './typings/internal';
import { rectIsIntersect } from './utils/rectIsIntersect';

interface UseDragToSelectConfig {
  contentRef: MaybeNullableRef<HTMLElement>;
  containerRef: MaybeNullableRef<HTMLElement>;
  options: Set<Option>;
  onChange: (selectedOptions: Set<unknown>) => void;
  draggableOnOption: MaybeRef<boolean>;
  disabled: MaybeRef<boolean>;
  consumePointerDownedOnOption: () => boolean;
  onStart?: (e: PointerEvent) => false | void;
  onEnd?: (e: PointerEvent) => void;
}

export function useDragToSelect({
  contentRef,
  containerRef,
  options,
  onChange,
  draggableOnOption,
  disabled,
  consumePointerDownedOnOption,
  onStart,
  onEnd,
}: UseDragToSelectConfig) {
  const pointPosition = ref<Position>([0, 0]);
  const dragged = ref(false);
  const {
    rect: areaRect,
    style: areaStyle,
    isDragging,
    stop,
  } = useDragRect(contentRef, {
    disabled,
    onStart(e) {
      dragged.value = false;
      // drag start point and drop end point in same option, where trigger click event for option
      if (!unref(draggableOnOption) && consumePointerDownedOnOption()) {
        return false;
      }
      if (onStart?.(e) === false) {
        return false;
      }
      pointPosition.value = [e.clientX, e.clientY];
    },
    onMove(e) {
      dragged.value = true;
      // cursor may be not moved
      if (e.clientX !== pointPosition.value[0] || e.clientY !== pointPosition.value[1]) {
        pointPosition.value = [e.clientX, e.clientY];
      }
    },
    onEnd(event) {
      onEnd?.(event);
    },
  });

  useAutoScrollByPoint(containerRef, isDragging, pointPosition);

  watch(areaRect, () => {
    const newSelectedOptions = new Set();
    if (!areaRect.value) return;
    for (const { dom, value, disabled } of options) {
      if (
        disabled ||
        rectIsIntersect(areaRect.value, {
          left: dom.offsetLeft,
          top: dom.offsetTop,
          width: dom.clientWidth,
          height: dom.clientHeight,
        })
      ) {
        newSelectedOptions.add(value);
      }
    }
    onChange(newSelectedOptions);
  });

  return { dragged, isDragging, areaStyle, stop };
}

interface UseClickToSelectConfig {
  onChange: (selectedOptions: Set<unknown>) => void;
  isDisableClick: () => boolean;
  onStart: (e: PointerEvent | MouseEvent) => void;
  onEnd: (e: PointerEvent | MouseEvent) => void;
}

export function useClickToSelect({ onChange, isDisableClick, onStart, onEnd }: UseClickToSelectConfig) {
  const onClickToSelect = (option: Option, e: MouseEvent) => {
    if (isDisableClick()) return;

    const newSelectedOptions = new Set([option.value]);
    onStart(e);
    // onStart may emit update:multiple event, so multiple may not be change immediately.
    void nextTick(() => {
      onChange(newSelectedOptions);
      onEnd(e);
    });
  };

  return onClickToSelect;
}
