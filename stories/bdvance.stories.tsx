import { ref } from 'vue';
import DragSelect from '../src/DragSelect.vue';
import DragSelectOption from '../src/DragSelectOption.vue';
import './Base.css';

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Advance',
  component: DragSelect,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    modelValue: {}
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { DragSelect, DragSelectOption },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  render() {
    return (
      <>
        <div>selected: {args.modelValue.value.join(",")}</div>
        <DragSelect {...(args)}>
          {Array(10)
            .fill(0)
            .map((v, index) => (
              <div style={{ border: "1px solid #000000", margin: "10px" }}>
                <DragSelectOption value={2 * index}>{2 * index}</DragSelectOption>
                <DragSelectOption value={2 * index + 1}>{2 * index + 1}</DragSelectOption>
              </div>
            ))}
        </DragSelect>
      </>);
  },
});

export const Group = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Group.args = {
  modelValue: ref([1, 2, 3]),
  'onUpdate:modelValue': (v) => {
    Group.args.modelValue.value = v;
  },
};
