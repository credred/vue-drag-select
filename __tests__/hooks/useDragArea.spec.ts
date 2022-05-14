import { el, elBox, setupContainer } from '@test/_setup/setupContainer';
import { drag } from '@test/_utils/simulate';
import { subtraction } from '@test/_utils/math';
import { useDragRect } from '@/hooks/useDragRect';
import { toRect } from '@/utils/toRect';

describe('hooks/useDragArea', () => {
  setupContainer();

  it('base usage', async () => {
    const { rect } = useDragRect(el);
    await drag([elBox.validArea.left, elBox.validArea.top], [elBox.validArea.right, elBox.validArea.bottom], {
      onStart() {
        expect(rect.value).toEqual(toRect([0, 0], [0, 0]));
      },
      onMove(pos) {
        expect(rect.value).toEqual(toRect([0, 0], subtraction(pos, [elBox.validArea.left, elBox.validArea.top])));
      },
    });
  });

});
