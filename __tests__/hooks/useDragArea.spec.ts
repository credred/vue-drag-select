import { el, elBox, setupContainer } from '@test/_setup/setupContainer';
import { drag } from '@test/_utils/simulate';
import { addition, subtraction } from '@test/_utils/math';
import { useDragRect } from '@/hooks/useDragRect';
import { toRect } from '@/utils/toRect';

describe('hooks/useDragArea', () => {
  setupContainer();

  it('base usage', async () => {
    const { rect } = useDragRect(el);
    await drag(elBox.validArea.from, elBox.validArea.to, {
      onStart() {
        expect(rect.value).toEqual(toRect(elBox.validArea.relativeFrom, elBox.validArea.relativeFrom));
      },
      onMove(pos) {
        expect(rect.value).toEqual(toRect(elBox.validArea.relativeFrom, elBox.relative(pos)));
      },
    });
  });
      },
    });
  });

});
