import { ref } from 'vue';
import { StoryFn } from '@storybook/vue3';
import DragSelect from '../src/DragSelect.vue';
import DragSelectOption from '../src/DragSelectOption.vue';
import './Base.css';

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Base',
  component: DragSelect,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    modelValue: {},
    background: { control: 'color', defaultValue: 'rgba(66, 153, 225, 0.5)' },
    draggableOnOption: { control: 'boolean', defaultValue: true },
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args: any) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { DragSelect, DragSelectOption },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  render() {
    return (
      <>
        <div>selected: {args.modelValue.value.join(',')}</div>
        <DragSelect {...(args)}>
          {Array(20)
            .fill(0)
            .map((v, index) => (
              <DragSelectOption value={index}>{index}</DragSelectOption>
            ))}
        </DragSelect>
      </>);
  },
});

export const Base: StoryFn = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Base.args = {
  modelValue: ref([]),
  'onUpdate:modelValue': (v: any[]) => {
    Base.args!.modelValue.value = v;
  },
};

const DragTemplate = (args: any) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { DragSelect, DragSelectOption },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  render() {
    return (
      <>
        <div>drag to outside select area to scroll</div>
        <div>selected: {args.modelValue.value.join(',')}</div>
        <DragSelect {...(args)}>
          {Array(100)
            .fill(0)
            .map((v, index) => (
              <DragSelectOption value={index}>{index}</DragSelectOption>
            ))}
        </DragSelect>
      </>);
  },
});

export const Drag: StoryFn = DragTemplate.bind({});
Drag.storyName = 'Drag To Scroll';
Drag.args = {
  modelValue: ref([]),
  'onUpdate:modelValue': (v: any[]) => {
    Drag.args!.modelValue.value = v;
  },
  style: { height: '300px', overflow: 'auto', border: '1px solid #d83512' }
};
