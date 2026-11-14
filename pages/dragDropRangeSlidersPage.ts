import { Page, Locator } from '@playwright/test';

const TIMEOUT = 15_000;

export default class DragDropRangeSlidersPage {
  readonly page: Page;
  readonly sliderContainer: Locator; // "Default value 15" block
  readonly sliderHandle: Locator;    // the <input type="range"> inside it
  readonly sliderOutput: Locator;    // the value bubble that shows the number

  constructor(page: Page) {
    this.page = page;
    this.sliderContainer = page.locator('#slider3');
    this.sliderHandle = page.locator('#slider3 input[type="range"]');
    this.sliderOutput = page.locator('#slider3 output');
  }

  /** Opens the Selenium Playground home page. */
  async open() {
    await this.page.goto('');
  }

  async clickDragAndDropSliders() {
    await this.page.getByRole('link', { name: 'Drag & Drop Sliders' }).click();
    await this.sliderContainer.waitFor({ state: 'visible', timeout: TIMEOUT });
  }

  /**
   * Drags the slider thumb with the mouse to the target value, then uses the
   * arrow keys to fine-tune if the mouse position lands one step off.
   * This works across browsers and screen sizes without hard-coded pixel widths.
   */
  async dragSliderTo(targetValue: number) {
    await this.sliderHandle.waitFor({ state: 'visible', timeout: TIMEOUT });

    const box = await this.sliderHandle.boundingBox();
    if (!box) throw new Error('Slider handle has no bounding box');

    const min = Number((await this.sliderHandle.getAttribute('min')) ?? 0);
    const max = Number((await this.sliderHandle.getAttribute('max')) ?? 100);
    const toX = (value: number) => box.x + box.width * ((value - min) / (max - min));
    const centerY = box.y + box.height / 2;

    const currentValue = Number(await this.sliderHandle.inputValue());

    // Mouse drag: grab the thumb at its current position and move to the target
    await this.page.mouse.move(toX(currentValue), centerY);
    await this.page.mouse.down();
    await this.page.mouse.move(toX(targetValue), centerY, { steps: 20 });
    await this.page.mouse.up();

    // Fine-tune by one step at a time with the keyboard if needed
    await this.sliderHandle.focus();
    for (let i = 0; i < 100; i++) {
      const value = Number(await this.sliderHandle.inputValue());
      if (value === targetValue) break;
      await this.page.keyboard.press(value < targetValue ? 'ArrowRight' : 'ArrowLeft');
    }
  }

  get sliderValueLocator(): Locator {
    return this.sliderOutput;
  }
}
