import { watch, ref, unref } from 'vue';
import { Option } from './DragSelectCommon';
import { useDragRect } from './hooks/useDragRect';
import { usePointAutoScroll } from './hooks/useAutoScroll';
import { MaybeNullableRef, MaybeRef, Position } from './typings/internal';
import { rectIsIntersect } from './utils/rectIsIntersect';

interface UseDragToSelectConfig {
  contentRef: MaybeNullableRef<HTMLElement>;
  options: Set<Option>;
  onChange: (selectedOptions: Set<unknown>) => void;
  draggableOnOption: MaybeRef<boolean>;
  consumePointerDownedOnOption: () => boolean;
}

export function useDragToSelect({
  contentRef,
  options,
  onChange,
  draggableOnOption,
  consumePointerDownedOnOption,
}: UseDragToSelectConfig) {
  const pointPosition = ref<Position>([0, 0]);
  const {
    rect: areaRect,
    style: areaStyle,
    isDragging,
    stop,
  } = useDragRect(contentRef, {
    onStart(e) {
      if (!unref(draggableOnOption) && consumePointerDownedOnOption()) {
        return false;
      }
      pointPosition.value = [e.clientX, e.clientY];
    },
    onMove(e) {
      // cursor may be not moved
      if (e.clientX !== pointPosition.value[0] || e.clientY !== pointPosition.value[1]) {
        pointPosition.value = [e.clientX, e.clientY];
      }
    },
  });

  usePointAutoScroll(contentRef, isDragging, pointPosition);

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

  return { isDragging, areaStyle, stop };
}

interface UseClickToSelectConfig {
  onChange: (selectedOptions: Set<unknown>) => void;
  isDisableClick: () => boolean;
}

export function useClickToSelect({ onChange, isDisableClick }: UseClickToSelectConfig) {
  const onClickToSelect = (option: Option) => {
    if (isDisableClick()) return;

    const newSelectedOptions = new Set([option.value]);
    onChange(newSelectedOptions);
  };

  return onClickToSelect;
}
