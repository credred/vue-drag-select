import DragSelect from '@/DragSelect.vue';
import DragSelectOption from '@/DragSelectOption.vue';
import { render } from '@testing-library/vue';
import { ref } from 'vue';
import { dragSelectBox } from './_setup/style';
import { click, drag } from '@test/_utils/simulate';

describe('DragSelect component', () => {
  it('should select the option which clicked by user if user has not dragged', async () => {
    const selectedValue = ref<Set<number>>();

    render(
      <DragSelect vModel={selectedValue.value}>
        {Array.from({ length: 9 }).map((_, index) => (
          <DragSelectOption value={index}>{index}</DragSelectOption>
        ))}
      </DragSelect>
    );
    await click(...dragSelectBox.getOptionPosition(5));

    expect(selectedValue.value).toEqual(new Set([5]));
  });

  it('should not start drag from drag-select-option component if draggableOnOption is false', async () => {
    const dragSelectRef = ref();
    const draggableOnOptionRef = ref(true);

    render(() => (
      <DragSelect ref={dragSelectRef} draggableOnOption={draggableOnOptionRef}>
        {Array.from({ length: 9 }).map((_, index) => (
          <DragSelectOption value={index}>{index}</DragSelectOption>
        ))}
      </DragSelect>
    ));
    await drag(dragSelectBox.getOptionPosition(5), dragSelectBox.getOptionPosition(6), {
      onBeforeEnd() {
        expect(dragSelectRef.value.isDragging).toBe(true);
      }
    });

    draggableOnOptionRef.value = false;
    await drag(dragSelectBox.getOptionPosition(5), dragSelectBox.getOptionPosition(6), {
      onBeforeEnd() {
        expect(dragSelectRef.value.isDragging).toBe(false);
      }
    });
  });
});
