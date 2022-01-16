import { App } from 'vue';
import DragSelect from './DragSelect.vue';
import DragSelectOption from './DragSelectOption.vue';

DragSelect.DragSelectOption = DragSelectOption;

export default DragSelect;
export { DragSelect, DragSelectOption };

export function install(app: App) {
  app.component('DragSelect', DragSelect);
  app.component('DragSelectOption', DragSelectOption);
}
export const version = '2.0.1';
