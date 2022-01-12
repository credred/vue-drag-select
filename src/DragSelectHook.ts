import { watch, ref } from 'vue';
import { Option } from './DragSelectCommon';
import { useDragRect } from './hooks/useDragRect';
import { MaybeNullableRef } from './typings/internal';
import { rectIsIntersect } from './utils/rectIsIntersect';

interface UseDragToSelectConfig {
  contentRef: MaybeNullableRef<HTMLElement>;
  options: Set<Option>;
  onChange: (selectedOptions: Set<unknown>) => void;
}

export function useDragToSelect({ contentRef, options, onChange }: UseDragToSelectConfig) {
  const dragged = ref(false);
  const { rect: areaRect, style: areaStyle } = useDragRect(contentRef, {
    onStart() {
      dragged.value = false;
    },
    onMove() {
      dragged.value = true;
    },
  });

  watch(areaRect, () => {
    const newSelectedOptions = new Set();
    if (!areaRect.value) return;
    for (const { dom, value } of options) {
      if (
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

  return { dragged, areaStyle };
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
