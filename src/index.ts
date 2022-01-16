import { App } from 'vue';
import DragSelect from './DragSelect.vue';
import DragSelectOption from './DragSelectOption.vue';

DragSelect.DragSelectOption = DragSelectOption;
DragSelect.install = install;

export default DragSelect as typeof DragSelect & {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DragSelectOption: typeof DragSelectOption;
  install: (app: App) => void;
};
export { DragSelect, DragSelectOption };

export function install(app: App) {
  app.component('DragSelect', DragSelect);
  app.component('DragSelectOption', DragSelectOption);
}
