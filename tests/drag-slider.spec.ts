import { test, expect } from '../fixtures/index';

test('Drag Slider Test Scenario', async ({ dragDropRangeSliders }) => {
  const targetValue = 95;

  // 1. Open TestMu AI's Selenium Playground
  await dragDropRangeSliders.open();

  // 2. Click "Drag & Drop Sliders"
  await dragDropRangeSliders.clickDragAndDropSliders();

  // 3. Select the "Default value 15" slider and drag it to 95
  await dragDropRangeSliders.dragSliderTo(targetValue);

  // 4. Validate the range value shows 95
  await expect(dragDropRangeSliders.sliderValueLocator).toHaveText(String(targetValue), { timeout: 15_000 });
});
