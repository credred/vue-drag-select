import { useDragPoints } from '@/hooks/useDragPoints';
import { el, elBox, makeContainerScrollable, setupContainer } from '@test/_setup/setupContainer';
import { drag } from '@test/_utils/simulate';
import { addition, subtraction } from '@test/_utils/math';

describe('hooks/useDragPoint', () => {
  setupContainer();

  it('base usage', async () => {
    const { fromPoint, toPoint, isDragging } = useDragPoints(el);
    await drag([elBox.validArea.left, elBox.validArea.top], [elBox.validArea.right, elBox.validArea.bottom], {
      onStart() {
        expect(isDragging.value).toEqual(true);
        expect(fromPoint.value).toEqual([0, 0]);
      },
      onMove(pos) {
        expect(toPoint.value).toEqual(subtraction(pos, [elBox.validArea.left, elBox.validArea.top]));
      },
      onBeforeEnd() {},
      onEnd() {
        expect(isDragging.value).toEqual(false);
      },
    });
  });

  it('point should be correctly even if el has scrolled', async () => {
    makeContainerScrollable();
    const scrollLeft = (el.scrollLeft = 50);
    const scrollTop = (el.scrollTop = 50);
    const { toPoint } = useDragPoints(el);
    await drag([elBox.validArea.left, elBox.validArea.top], [elBox.validArea.right, elBox.validArea.bottom], {
      onMove(pos) {
        expect(toPoint.value).toEqual(
          subtraction(addition(pos, [scrollLeft, scrollTop]), [elBox.validArea.left, elBox.validArea.top])
        );
      },
    });
  });
});
