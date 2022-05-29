import DragSelect from '@/DragSelect.vue';
import DragSelectOption from '@/DragSelectOption.vue';
import { render } from '@testing-library/vue';
import { ref } from 'vue';
import { dragSelectBox } from './_setup/style';
import { click } from '@test/_utils/simulate';

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
});
