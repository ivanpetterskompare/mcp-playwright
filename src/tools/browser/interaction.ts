import { BrowserToolBase } from './base.js';
import { ToolContext, ToolResponse, createSuccessResponse, createErrorResponse } from '../common/types.js';
import { setGlobalPage } from '../../toolHandler.js';
/**
 * Tool for clicking elements on the page
 */
export class ClickTool extends BrowserToolBase {
  /**
   * Execute the click tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      await page.click(args.selector);      
      return createSuccessResponse(`Clicked element: ${args.selector}`);
    });
  }
}
/**
 * Tool for clicking a link and switching to the new tab
 */
export class ClickAndSwitchTabTool extends BrowserToolBase {
  /**
   * Execute the click and switch tab tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    
    return this.safeExecute(context, async (page) => {
      // Listen for a new tab to open
      const [newPage] = await Promise.all([
        //context.browser.waitForEvent('page'), // Wait for a new page (tab) to open
        page.context().waitForEvent('page'),// Wait for a new page (tab) to open
        page.click(args.selector), // Click the link that opens the new tab
      ]);

      // Wait for the new page to load
      await newPage.waitForLoadState('domcontentloaded');

      // Switch control to the new tab
      setGlobalPage(newPage);
      //page= newPage; // Update the current page to the new tab
      //context.page = newPage;
      //context.page.bringToFront(); // Bring the new tab to the front
      return createSuccessResponse(`Clicked link and switched to new tab: ${newPage.url()}`);
      //return createSuccessResponse(`Clicked link and switched to new tab: ${context.page.url()}`);
    });
  }
}
/**
 * Tool for clicking elements inside iframes
 */
export class IframeClickTool extends BrowserToolBase {
  /**
   * Execute the iframe click tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const frame = page.frameLocator(args.iframeSelector);
      if (!frame) {
        return createErrorResponse(`Iframe not found: ${args.iframeSelector}`);
      }
      
      await frame.locator(args.selector).click();
      return createSuccessResponse(`Clicked element ${args.selector} inside iframe ${args.iframeSelector}`);
    });
  }
}

/**
 * Tool for filling elements inside iframes
 */
export class IframeFillTool extends BrowserToolBase {
  /**
   * Execute the iframe fill tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const frame = page.frameLocator(args.iframeSelector);
      if (!frame) {
        return createErrorResponse(`Iframe not found: ${args.iframeSelector}`);
      }
      
      await frame.locator(args.selector).fill(args.value);
      return createSuccessResponse(`Filled element ${args.selector} inside iframe ${args.iframeSelector} with: ${args.value}`);
    });
  }
}

/**
 * Tool for filling form fields
 */
export class FillTool extends BrowserToolBase {
  /**
   * Execute the fill tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      await page.waitForSelector(args.selector);
      await page.fill(args.selector, args.value);
      return createSuccessResponse(`Filled ${args.selector} with: ${args.value}`);
    });
  }
}

/**
 * Tool for selecting options from dropdown menus
 */
export class SelectTool extends BrowserToolBase {
  /**
   * Execute the select tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      await page.waitForSelector(args.selector);
      await page.selectOption(args.selector, args.value);
      return createSuccessResponse(`Selected ${args.selector} with: ${args.value}`);
    });
  }
}

/**
 * Tool for hovering over elements
 */
export class HoverTool extends BrowserToolBase {
  /**
   * Execute the hover tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      await page.waitForSelector(args.selector);
      await page.hover(args.selector);
      return createSuccessResponse(`Hovered ${args.selector}`);
    });
  }
}

/**
 * Tool for uploading files
 */
export class UploadFileTool extends BrowserToolBase {
  /**
   * Execute the upload file tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
        await page.waitForSelector(args.selector);
        await page.setInputFiles(args.selector, args.filePath);
        return createSuccessResponse(`Uploaded file '${args.filePath}' to '${args.selector}'`);
    });
  }
}

/**
 * Tool for executing JavaScript in the browser
 */
export class EvaluateTool extends BrowserToolBase {
  /**
   * Execute the evaluate tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const result = await page.evaluate(args.script);
      
      // Convert result to string for display
      let resultStr: string;
      try {
        resultStr = JSON.stringify(result, null, 2);
      } catch (error) {
        resultStr = String(result);
      }
      
      return createSuccessResponse([
        `Executed JavaScript:`,
        `${args.script}`,
        `Result:`,
        `${resultStr}`
      ]);
    });
  }
}

/**
 * Tool for dragging elements on the page
 */
export class DragTool extends BrowserToolBase {
  /**
   * Execute the drag tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const sourceElement = await page.waitForSelector(args.sourceSelector);
      const targetElement = await page.waitForSelector(args.targetSelector);
      
      const sourceBound = await sourceElement.boundingBox();
      const targetBound = await targetElement.boundingBox();
      
      if (!sourceBound || !targetBound) {
        return createErrorResponse("Could not get element positions for drag operation");
      }

      await page.mouse.move(
        sourceBound.x + sourceBound.width / 2,
        sourceBound.y + sourceBound.height / 2
      );
      await page.mouse.down();
      await page.mouse.move(
        targetBound.x + targetBound.width / 2,
        targetBound.y + targetBound.height / 2
      );
      await page.mouse.up();
      
      return createSuccessResponse(`Dragged element from ${args.sourceSelector} to ${args.targetSelector}`);
    });
  }
}

/**
 * Tool for pressing keyboard keys
 */
export class PressKeyTool extends BrowserToolBase {
  /**
   * Execute the key press tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      if (args.selector) {
        await page.waitForSelector(args.selector);
        await page.focus(args.selector);
      }
      
      await page.keyboard.press(args.key);
      return createSuccessResponse(`Pressed key: ${args.key}`);
    });
  }
} 


/**
 * Tool for switching browser tabs
 */
// export class SwitchTabTool extends BrowserToolBase {
//   /**
//    * Switch the tab to the specified index
//    */
//   async execute(args: any, context: ToolContext): Promise<ToolResponse> {
//     return this.safeExecute(context, async (page) => {
//       const tabs = await browser.page;      

//       // Validate the tab index
//       const tabIndex = Number(args.index);
//       if (isNaN(tabIndex)) {
//         return createErrorResponse(`Invalid tab index: ${args.index}. It must be a number.`);
//       }

//       if (tabIndex >= 0 && tabIndex < tabs.length) {
//         await tabs[tabIndex].bringToFront();
//         return createSuccessResponse(`Switched to tab with index ${tabIndex}`);
//       } else {
//         return createErrorResponse(
//           `Tab index out of range: ${tabIndex}. Available tabs: 0 to ${tabs.length - 1}.`
//         );
//       }
//     });
//   }
// }

/**
 * Tool for clicking elements by test ID
 */
export class ClickByTestIdTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const element = page.getByTestId(args.testId);
      await element.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await element.click();
      return createSuccessResponse(`Clicked element with test ID: ${args.testId}`);
    });
  }
}

/**
 * Tool for filling elements by test ID
 */
export class FillByTestIdTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const element = page.getByTestId(args.testId);
      await element.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await element.fill(args.text);
      return createSuccessResponse(`Filled element with test ID: ${args.testId} with: ${args.text}`);
    });
  }
}

/**
 * Tool for clicking elements by role and name
 */
export class ClickByRoleTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const element = page.getByRole(args.role, { name: args.name });
      await element.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await element.click();
      return createSuccessResponse(`Clicked element with role: ${args.role} and name: ${args.name}`);
    });
  }
}

/**
 * Tool for filling elements by role and name
 */
export class FillByRoleTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const element = page.getByRole(args.role, { name: args.name });
      await element.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await element.fill(args.text);
      return createSuccessResponse(`Filled element with role: ${args.role} and name: ${args.name} with: ${args.text}`);
    });
  }
}

/**
 * Tool for clicking elements by text content
 */
export class ClickByTextTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const element = page.getByText(args.text);
      await element.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await element.click();
      return createSuccessResponse(`Clicked element with text: ${args.text}`);
    });
  }
}

/**
 * Tool for filling elements by text content
 */
export class FillByTextTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const element = page.getByText(args.text);
      await element.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await element.fill(args.inputText);
      return createSuccessResponse(`Filled element with text: ${args.text} with: ${args.inputText}`);
    });
  }
}

/**
 * Tool for clicking elements by label
 */
export class ClickByLabelTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const element = page.getByLabel(args.label);
      await element.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await element.click();
      return createSuccessResponse(`Clicked element with label: ${args.label}`);
    });
  }
}

/**
 * Tool for filling elements by label
 */
export class FillByLabelTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const element = page.getByLabel(args.label);
      await element.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await element.fill(args.text);
      return createSuccessResponse(`Filled element with label: ${args.label} with: ${args.text}`);
    });
  }
}

/**
 * Tool for clicking elements by placeholder
 */
export class ClickByPlaceholderTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const element = page.getByPlaceholder(args.placeholder);
      await element.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await element.click();
      return createSuccessResponse(`Clicked element with placeholder: ${args.placeholder}`);
    });
  }
}

/**
 * Tool for filling elements by placeholder
 */
export class FillByPlaceholderTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const element = page.getByPlaceholder(args.placeholder);
      await element.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await element.fill(args.text);
      return createSuccessResponse(`Filled element with placeholder: ${args.placeholder} with: ${args.text}`);
    });
  }
}

/**
 * Tool for clicking elements by title
 */
export class ClickByTitleTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const element = page.getByTitle(args.title);
      await element.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await element.click();
      return createSuccessResponse(`Clicked element with title: ${args.title}`);
    });
  }
}

/**
 * Tool for clicking elements by alt text
 */
export class ClickByAltTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const element = page.getByAltText(args.alt);
      await element.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await element.click();
      return createSuccessResponse(`Clicked element with alt text: ${args.alt}`);
    });
  }
}



/**
 * Tool for double clicking elements
 */
export class DoubleClickTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await locator.dblclick();
      return createSuccessResponse(`Double clicked element: ${args.selector}`);
    });
  }
}

/**
 * Tool for right clicking elements
 */
export class RightClickTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await locator.click({ button: 'right' });
      return createSuccessResponse(`Right clicked element: ${args.selector}`);
    });
  }
}

/**
 * Tool for selecting dropdown options by value
 */
export class SelectOptionByValueTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await locator.selectOption({ value: args.value });
      return createSuccessResponse(`Selected option with value: ${args.value} from: ${args.selector}`);
    });
  }
}

/**
 * Tool for selecting dropdown options by label
 */
export class SelectOptionByLabelTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await locator.selectOption({ label: args.label });
      return createSuccessResponse(`Selected option with label: ${args.label} from: ${args.selector}`);
    });
  }
}

/**
 * Tool for selecting multiple dropdown options
 */
export class SelectMultipleOptionsTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await locator.selectOption({ value: args.values });
      return createSuccessResponse(`Selected multiple options: ${args.values.join(', ')} from: ${args.selector}`);
    });
  }
}

/**
 * Tool for checking checkboxes/radio buttons
 */
export class CheckElementTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await locator.check();
      return createSuccessResponse(`Checked element: ${args.selector}`);
    });
  }
}

/**
 * Tool for unchecking checkboxes
 */
export class UncheckElementTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await locator.uncheck();
      return createSuccessResponse(`Unchecked element: ${args.selector}`);
    });
  }
}

/**
 * Tool for typing text into elements
 */
export class TypeTextTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await locator.type(args.text);
      return createSuccessResponse(`Typed text: ${args.text} into element: ${args.selector}`);
    });
  }
}

/**
 * Tool for getting element text content
 */
export class GetElementTextTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      const text = await locator.textContent();
      return createSuccessResponse(`Element text content: ${text}`);
    });
  }
}

/**
 * Tool for getting element attributes
 */
export class GetElementAttributeTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      const attribute = await locator.getAttribute(args.attribute);
      return createSuccessResponse(`Element attribute ${args.attribute}: ${attribute}`);
    });
  }
}

/**
 * Tool for checking if element exists
 */
export class CheckElementExistsTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      try {
        const locator = page.locator(args.selector);
        await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
        return createSuccessResponse(`Element exists: ${args.selector}`);
      } catch (error) {
        return createSuccessResponse(`Element does not exist: ${args.selector}`);
      }
    });
  }
}

/**
 * Tool for checking if element is checked
 */
export class IsElementCheckedTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      const isChecked = await locator.isChecked();
      return createSuccessResponse(`Element checked state: ${isChecked}`);
    });
  }
}

/**
 * Tool for getting input values
 */
export class GetInputValueTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      const value = await locator.inputValue();
      return createSuccessResponse(`Input value: ${value}`);
    });
  }
}

/**
 * Tool for waiting for element to be hidden
 */
export class WaitForElementHiddenTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'hidden', timeout: args.timeout || 30000 });
      return createSuccessResponse(`Element is now hidden: ${args.selector}`);
    });
  }
}

/**
 * Tool for waiting for URL changes
 */
export class WaitForUrlChangeTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      if (args.expectedUrl) {
        await page.waitForURL(args.expectedUrl, { timeout: args.timeout || 30000 });
        return createSuccessResponse(`URL changed to: ${args.expectedUrl}`);
      } else {
        await page.waitForLoadState('networkidle', { timeout: args.timeout || 30000 });
        return createSuccessResponse(`Page load completed`);
      }
    });
  }
}

/**
 * Tool for scrolling to elements
 */
export class ScrollToElementTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await locator.scrollIntoViewIfNeeded();
      return createSuccessResponse(`Scrolled to element: ${args.selector}`);
    });
  }
}

/**
 * Tool for taking element screenshots
 */
export class TakeElementScreenshotTool extends BrowserToolBase {
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const locator = page.locator(args.selector);
      await locator.waitFor({ state: 'visible', timeout: args.timeout || 30000 });
      await locator.screenshot({ path: args.path });
      return createSuccessResponse(`Screenshot saved to: ${args.path}`);
    });
  }
}