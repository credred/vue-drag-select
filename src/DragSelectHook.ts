import { watch, ref, unref } from 'vue';
import { Option } from './DragSelectCommon';
import { useDragRect } from './hooks/useDragRect';
import { MaybeNullableRef, MaybeRef } from './typings/internal';
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
  const dragged = ref(false);
  const {
    rect: areaRect,
    style: areaStyle,
    stop,
  } = useDragRect(contentRef, {
    onStart() {
      dragged.value = false;
      if (!unref(draggableOnOption) && consumePointerDownedOnOption()) {
        return false;
      }
    },
    onMove() {
      dragged.value = true;
    },
  });

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

  return { dragged, areaStyle, stop };
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
