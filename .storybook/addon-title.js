// refer https://github.com/storybookjs/storybook/issues/6339#issuecomment-610153352
import addons from '@storybook/addons'
import { STORY_RENDERED } from '@storybook/core-events'

addons.register('TitleAddon', api => {
  const cunstomTitle = "vue-drag-select"; // Define your customTitle title
  let interval = null;
  const setTitle = () => {
    clearTimeout(interval);
    let storyData = null;
    try {
        storyData = api.getCurrentStoryData(); // Some time get error
    } catch(e) {}
    let title;
    if (!storyData) {
        title = cunstomTitle;
    } else {
        title = `${cunstomTitle} ⋅ ${storyData.kind} - ${storyData.name}`
    }
    if (document.title !== title) { // As few dom operations as possible
        document.title = title;
    }
    interval = setTimeout(setTitle, 100);
  };
  setTitle();
  api.on(STORY_RENDERED, () => {
    setTitle();
  })
});