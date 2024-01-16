import DragSelect from '@/DragSelect.vue';
import DragSelectOption from '@/DragSelectOption.vue';
import { render } from '@testing-library/vue';
import { nextTick, ref } from 'vue';
import { dragSelectBox } from './_setup/style';
import { drag, click, pointerdown, slideMove } from '@test/_utils/simulate';
import userEvent from '@testing-library/user-event';

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

  it('should not select the option which clickOptionToSelect is false', async () => {
    const selectedValue = ref<Set<number>>(new Set());

    render(
      <DragSelect vModel={selectedValue.value} clickOptionToSelect={false}>
        {Array.from({ length: 9 }).map((_, index) => (
          <DragSelectOption value={index}>{index}</DragSelectOption>
        ))}
      </DragSelect>
    );
    await click(...dragSelectBox.getOptionPosition(5));

    expect(selectedValue.value).toEqual(new Set([]));
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

  it('should not start drag from anywhere if disabled is true', async () => {
    const dragSelectRef = ref();
    const disabledRef = ref(false);

    render(() => (
      <DragSelect ref={dragSelectRef} disabled={disabledRef}>
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

    disabledRef.value = true;
    await drag(dragSelectBox.getOptionPosition(5), dragSelectBox.getOptionPosition(6), {
      onBeforeEnd() {
        expect(dragSelectRef.value.isDragging).toBe(false);
      }
    });
  });

  it('should be correct when selecting the same item as last time', async () => {
    const selectedValue = ref<Set<number>>();

    render(() => (
      <DragSelect vModel={selectedValue.value}>
        {Array.from({ length: 9 }).map((_, index) => (
          <DragSelectOption value={index}>{index}</DragSelectOption>
        ))}
      </DragSelect>
    ));

    await click(...dragSelectBox.getOptionPosition(4));

    const from = dragSelectBox.getOptionPosition(4);
    const to1 = dragSelectBox.getOptionPosition(8);
    const to2 = dragSelectBox.getOptionPosition(4);
    const pointerup = await pointerdown(...from, null);
    await slideMove(from, to1, {});

    await slideMove(to1, to2, {});
    await pointerup(...to2);

    expect(selectedValue.value).toEqual(new Set([4]));
  });

  it('should cleanup selection after clicked blank content', async () => {
    const selectedValue = ref<Set<number>>();

    render(() => (
      <DragSelect vModel={selectedValue.value}>
        {Array.from({ length: 9 }).map((_, index) => (
          <DragSelectOption value={index}>{index}</DragSelectOption>
        ))}
      </DragSelect>
    ));

    await drag(dragSelectBox.getOptionPosition(4), dragSelectBox.getOptionPosition(5), {});

    const [x, y] = dragSelectBox.getOptionPosition(0);
    await click(x + dragSelectBox.optionWidth * 0.5 + 2, y);

    expect(selectedValue.value).toEqual(new Set([]));
  });

  it('should not cleanup selection when clickBlankToClear is false', async () => {
    const selectedValue = ref<Set<number>>();

    render(() => (
      <DragSelect vModel={selectedValue.value} clickBlankToClear={false}>
        {Array.from({ length: 9 }).map((_, index) => (
          <DragSelectOption value={index}>{index}</DragSelectOption>
        ))}
      </DragSelect>
    ));

    await drag(dragSelectBox.getOptionPosition(4), dragSelectBox.getOptionPosition(5), {});

    const [x, y] = dragSelectBox.getOptionPosition(0);
    await click(x + dragSelectBox.optionWidth * 0.5 + 2, y);

    expect(selectedValue.value).toEqual(new Set([4, 5]));
  });

  describe('multiple mode', () => {
    it('active by press control key', async () => {
      const selectedValue = ref<Set<number>>();

      render(() => (
        <DragSelect vModel={selectedValue.value}>
          {Array.from({ length: 9 }).map((_, index) => (
            <DragSelectOption value={index}>{index}</DragSelectOption>
          ))}
        </DragSelect>
      ));

      const user = userEvent.setup();
      await user.keyboard('[ControlLeft>]');

      await drag(dragSelectBox.getOptionPosition(4), dragSelectBox.getOptionPosition(5), {
        user,
      });

      expect(selectedValue.value).toEqual(new Set([4, 5]));

      await drag(dragSelectBox.getOptionPosition(7), dragSelectBox.getOptionPosition(8), {
        user,
      });

      expect(selectedValue.value).toEqual(new Set([4, 5, 7, 8]));
    });

    it('active by press meta key', async () => {
      const selectedValue = ref<Set<number>>();

      render(() => (
        <DragSelect vModel={selectedValue.value}>
          {Array.from({ length: 9 }).map((_, index) => (
            <DragSelectOption value={index}>{index}</DragSelectOption>
          ))}
        </DragSelect>
      ));

      const user = userEvent.setup();
      await user.keyboard('[MetaLeft>]');

      await drag(dragSelectBox.getOptionPosition(4), dragSelectBox.getOptionPosition(5), {
        user,
      });

      expect(selectedValue.value).toEqual(new Set([4, 5]));

      await drag(dragSelectBox.getOptionPosition(7), dragSelectBox.getOptionPosition(8), {
        user,
      });

      expect(selectedValue.value).toEqual(new Set([4, 5, 7, 8]));
    });

    it('deselect duplicate selection options by default', async () => {
      const selectedValue = ref<Set<number>>();

      render(() => (
        <DragSelect vModel={selectedValue.value}>
          {Array.from({ length: 9 }).map((_, index) => (
            <DragSelectOption value={index}>{index}</DragSelectOption>
          ))}
        </DragSelect>
      ));

      const user = userEvent.setup();
      await user.keyboard('[MetaLeft>]');

      await drag(dragSelectBox.getOptionPosition(4), dragSelectBox.getOptionPosition(5), {
        user,
      });

      expect(selectedValue.value).toEqual(new Set([4, 5]));

      await drag(dragSelectBox.getOptionPosition(5), dragSelectBox.getOptionPosition(8), {
        user,
      });

      expect(selectedValue.value).toEqual(new Set([4, 8]));
    });

    it('select all selected options', async () => {
      const selectedValue = ref<Set<number>>();

      render(() => (
        <DragSelect vModel={selectedValue.value} deselectRepeated={false}>
          {Array.from({ length: 9 }).map((_, index) => (
            <DragSelectOption value={index}>{index}</DragSelectOption>
          ))}
        </DragSelect>
      ));

      const user = userEvent.setup();
      await user.keyboard('[MetaLeft>]');

      await drag(dragSelectBox.getOptionPosition(4), dragSelectBox.getOptionPosition(5), {
        user,
      });

      expect(selectedValue.value).toEqual(new Set([4, 5]));

      await drag(dragSelectBox.getOptionPosition(5), dragSelectBox.getOptionPosition(8), {
        user,
      });

      expect(selectedValue.value).toEqual(new Set([4, 5, 8]));
    });

    it('should keep select previous items when click empty area', async () => {
      const selectedValue = ref<Set<number>>();
      const multiple = ref(false);

      render(() => (
        <DragSelect v-model={selectedValue.value} v-model:multiple={multiple.value} deselectRepeated={false}>
          {Array.from({ length: 9 }).map((_, index) => (
            <DragSelectOption value={index}>{index}</DragSelectOption>
          ))}
        </DragSelect>
      ));

      const user = userEvent.setup();
      await user.keyboard('[MetaLeft>]');

      await drag(dragSelectBox.getOptionPosition(4), dragSelectBox.getOptionPosition(5), {
        user,
      });

      expect(selectedValue.value).toEqual(new Set([4, 5]));
      const [x, y] = dragSelectBox.getOptionPosition(0);
      await click(x + dragSelectBox.optionWidth * 0.5 + 2, y);
      // await click(x + dragSelectBox.optionWidth * 0.5 + 2, y, user); // 使用user就不会触发点击事件

      await nextTick();

      expect(selectedValue.value).toEqual(new Set([4, 5]));
    });
  });
});
