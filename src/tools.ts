import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { codegenTools } from './tools/codegen';

export function createToolDefinitions() {
  return [
    // Codegen tools
    {
      name: "start_codegen_session",
      description: "Start a new code generation session to record Playwright actions",
      inputSchema: {
        type: "object",
        properties: {
          options: {
            type: "object",
            description: "Code generation options",
            properties: {
              outputPath: { 
                type: "string", 
                description: "Directory path where generated tests will be saved (use absolute path)" 
              },
              testNamePrefix: { 
                type: "string", 
                description: "Prefix to use for generated test names (default: 'GeneratedTest')" 
              },
              includeComments: { 
                type: "boolean", 
                description: "Whether to include descriptive comments in generated tests" 
              }
            },
            required: ["outputPath"]
          }
        },
        required: ["options"]
      }
    },
    {
      name: "end_codegen_session",
      description: "End a code generation session and generate the test file",
      inputSchema: {
        type: "object",
        properties: {
          sessionId: { 
            type: "string", 
            description: "ID of the session to end" 
          }
        },
        required: ["sessionId"]
      }
    },
    {
      name: "get_codegen_session",
      description: "Get information about a code generation session",
      inputSchema: {
        type: "object",
        properties: {
          sessionId: { 
            type: "string", 
            description: "ID of the session to retrieve" 
          }
        },
        required: ["sessionId"]
      }
    },
    {
      name: "clear_codegen_session",
      description: "Clear a code generation session without generating a test",
      inputSchema: {
        type: "object",
        properties: {
          sessionId: { 
            type: "string", 
            description: "ID of the session to clear" 
          }
        },
        required: ["sessionId"]
      }
    },
    {
      name: "playwright_navigate",
      description: "Navigate to a URL",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "URL to navigate to the website specified" },
          browserType: { type: "string", description: "Browser type to use (chromium, firefox, webkit). Defaults to chromium", enum: ["chromium", "firefox", "webkit"] },
          width: { type: "number", description: "Viewport width in pixels (default: 1280)" },
          height: { type: "number", description: "Viewport height in pixels (default: 720)" },
          timeout: { type: "number", description: "Navigation timeout in milliseconds" },
          waitUntil: { type: "string", description: "Navigation wait condition" },
          headless: { type: "boolean", description: "Run browser in headless mode (default: false)" }
        },
        required: ["url"],
      },
    },
    {
      name: "playwright_screenshot",
      description: "Take a screenshot of the current page or a specific element",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name for the screenshot" },
          selector: { type: "string", description: "CSS selector for element to screenshot" },
          width: { type: "number", description: "Width in pixels (default: 800)" },
          height: { type: "number", description: "Height in pixels (default: 600)" },
          storeBase64: { type: "boolean", description: "Store screenshot in base64 format (default: true)" },
          fullPage: { type: "boolean", description: "Store screenshot of the entire page (default: false)" },
          savePng: { type: "boolean", description: "Save screenshot as PNG file (default: false)" },
          downloadsDir: { type: "string", description: "Custom downloads directory path (default: user's Downloads folder)" },
        },
        required: ["name"],
      },
    },
    {
      name: "playwright_click",
      description: "Click an element on the page",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element to click" },
        },
        required: ["selector"],
      },
    },
    {
      name: "playwright_iframe_click",
      description: "Click an element in an iframe on the page",
      inputSchema: {
        type: "object",
        properties: {
          iframeSelector: { type: "string", description: "CSS selector for the iframe containing the element to click" },
          selector: { type: "string", description: "CSS selector for the element to click" },
        },
        required: ["iframeSelector", "selector"],
      },
    },
    {
      name: "playwright_iframe_fill",
      description: "Fill an element in an iframe on the page",
      inputSchema: {
        type: "object",
        properties: {
          iframeSelector: { type: "string", description: "CSS selector for the iframe containing the element to fill" },
          selector: { type: "string", description: "CSS selector for the element to fill" },
          value: { type: "string", description: "Value to fill" },
        },
        required: ["iframeSelector", "selector", "value"],
      },
    },
    {
      name: "playwright_fill",
      description: "fill out an input field",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for input field" },
          value: { type: "string", description: "Value to fill" },
        },
        required: ["selector", "value"],
      },
    },
    {
      name: "playwright_select",
      description: "Select an element on the page with Select tag",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for element to select" },
          value: { type: "string", description: "Value to select" },
        },
        required: ["selector", "value"],
      },
    },
    {
      name: "playwright_hover",
      description: "Hover an element on the page",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for element to hover" },
        },
        required: ["selector"],
      },
    },
    {
      name: "playwright_upload_file",
      description: "Upload a file to an input[type='file'] element on the page",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the file input element" },
          filePath: { type: "string", description: "Absolute path to the file to upload" }
        },
        required: ["selector", "filePath"],
      },
    },
    {
      name: "playwright_evaluate",
      description: "Execute JavaScript in the browser console",
      inputSchema: {
        type: "object",
        properties: {
          script: { type: "string", description: "JavaScript code to execute" },
        },
        required: ["script"],
      },
    },
    {
      name: "playwright_console_logs",
      description: "Retrieve console logs from the browser with filtering options",
      inputSchema: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description: "Type of logs to retrieve (all, error, warning, log, info, debug, exception)",
            enum: ["all", "error", "warning", "log", "info", "debug", "exception"]
          },
          search: {
            type: "string",
            description: "Text to search for in logs (handles text with square brackets)"
          },
          limit: {
            type: "number",
            description: "Maximum number of logs to return"
          },
          clear: {
            type: "boolean",
            description: "Whether to clear logs after retrieval (default: false)"
          }
        },
        required: [],
      },
    },
    {
      name: "playwright_close",
      description: "Close the browser and release all resources",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "playwright_get",
      description: "Perform an HTTP GET request",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "URL to perform GET operation" }
        },
        required: ["url"],
      },
    },
    {
      name: "playwright_post",
      description: "Perform an HTTP POST request",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "URL to perform POST operation" },
          value: { type: "string", description: "Data to post in the body" },
          token: { type: "string", description: "Bearer token for authorization" },
          headers: { 
            type: "object", 
            description: "Additional headers to include in the request",
            additionalProperties: { type: "string" }
          }
        },
        required: ["url", "value"],
      },
    },
    {
      name: "playwright_put",
      description: "Perform an HTTP PUT request",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "URL to perform PUT operation" },
          value: { type: "string", description: "Data to PUT in the body" },
        },
        required: ["url", "value"],
      },
    },
    {
      name: "playwright_patch",
      description: "Perform an HTTP PATCH request",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "URL to perform PUT operation" },
          value: { type: "string", description: "Data to PATCH in the body" },
        },
        required: ["url", "value"],
      },
    },
    {
      name: "playwright_delete",
      description: "Perform an HTTP DELETE request",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "URL to perform DELETE operation" }
        },
        required: ["url"],
      },
    },
    {
      name: "playwright_expect_response",
      description: "Ask Playwright to start waiting for a HTTP response. This tool initiates the wait operation but does not wait for its completion.",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "Unique & arbitrary identifier to be used for retrieving this response later with `Playwright_assert_response`." },
          url: { type: "string", description: "URL pattern to match in the response." }
        },
        required: ["id", "url"],
      },
    },
    {
      name: "playwright_assert_response",
      description: "Wait for and validate a previously initiated HTTP response wait operation.",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "Identifier of the HTTP response initially expected using `Playwright_expect_response`." },
          value: { type: "string", description: "Data to expect in the body of the HTTP response. If provided, the assertion will fail if this value is not found in the response body." }
        },
        required: ["id"],
      },
    },
    {
      name: "playwright_custom_user_agent",
      description: "Set a custom User Agent for the browser",
      inputSchema: {
        type: "object",
        properties: {
          userAgent: { type: "string", description: "Custom User Agent for the Playwright browser instance" }
        },
        required: ["userAgent"],
      },
    },
    {
      name: "playwright_get_visible_text",
      description: "Get the visible text content of the current page",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "playwright_get_visible_html",
      description: "Get the HTML content of the current page. By default, all <script> tags are removed from the output unless removeScripts is explicitly set to false.",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector to limit the HTML to a specific container" },
          removeScripts: { type: "boolean", description: "Remove all script tags from the HTML (default: true)" },
          removeComments: { type: "boolean", description: "Remove all HTML comments (default: false)" },
          removeStyles: { type: "boolean", description: "Remove all style tags from the HTML (default: false)" },
          removeMeta: { type: "boolean", description: "Remove all meta tags from the HTML (default: false)" },
          cleanHtml: { type: "boolean", description: "Perform comprehensive HTML cleaning (default: false)" },
          minify: { type: "boolean", description: "Minify the HTML output (default: false)" },
          maxLength: { type: "number", description: "Maximum number of characters to return (default: 20000)" }
        },
        required: [],
      },
    },
    {
      name: "playwright_go_back",
      description: "Navigate back in browser history",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "playwright_go_forward",
      description: "Navigate forward in browser history",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "playwright_drag",
      description: "Drag an element to a target location",
      inputSchema: {
        type: "object",
        properties: {
          sourceSelector: { type: "string", description: "CSS selector for the element to drag" },
          targetSelector: { type: "string", description: "CSS selector for the target location" }
        },
        required: ["sourceSelector", "targetSelector"],
      },
    },
    {
      name: "playwright_press_key",
      description: "Press a keyboard key",
      inputSchema: {
        type: "object",
        properties: {
          key: { type: "string", description: "Key to press (e.g. 'Enter', 'ArrowDown', 'a')" },
          selector: { type: "string", description: "Optional CSS selector to focus before pressing key" }
        },
        required: ["key"],
      },
    },
    {
      name: "playwright_save_as_pdf",
      description: "Save the current page as a PDF file",
      inputSchema: {
        type: "object",
        properties: {
          outputPath: { type: "string", description: "Directory path where PDF will be saved" },
          filename: { type: "string", description: "Name of the PDF file (default: page.pdf)" },
          format: { type: "string", description: "Page format (e.g. 'A4', 'Letter')" },
          printBackground: { type: "boolean", description: "Whether to print background graphics" },
          margin: {
            type: "object",
            description: "Page margins",
            properties: {
              top: { type: "string" },
              right: { type: "string" },
              bottom: { type: "string" },
              left: { type: "string" }
            }
          }
        },
        required: ["outputPath"],
      },
    },
    {
      name: "playwright_click_and_switch_tab",
      description: "Click a link and switch to the newly opened tab",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the link to click" },
        },
        required: ["selector"],
      },
    },
    // New utility tools
    {
      name: "playwright_click_by_test_id",
      description: "Click on an element using test ID attribute",
      inputSchema: {
        type: "object",
        properties: {
          testId: { type: "string", description: "Test ID attribute value" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["testId"],
      },
    },
    {
      name: "playwright_fill_by_test_id",
      description: "Fill an element using test ID attribute",
      inputSchema: {
        type: "object",
        properties: {
          testId: { type: "string", description: "Test ID attribute value" },
          text: { type: "string", description: "Text to fill" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["testId", "text"],
      },
    },
    {
      name: "playwright_click_by_role",
      description: "Click on an element identified by its role and name",
      inputSchema: {
        type: "object",
        properties: {
          role: { type: "string", description: "ARIA role (e.g., 'button', 'link', 'textbox')" },
          name: { type: "string", description: "Accessible name of the element" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["role", "name"],
      },
    },
    {
      name: "playwright_fill_by_role",
      description: "Fill an element identified by its role and name",
      inputSchema: {
        type: "object",
        properties: {
          role: { type: "string", description: "ARIA role (e.g., 'button', 'link', 'textbox')" },
          name: { type: "string", description: "Accessible name of the element" },
          text: { type: "string", description: "Text to fill" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["role", "name", "text"],
      },
    },
    {
      name: "playwright_click_by_text",
      description: "Click on an element identified by its text content",
      inputSchema: {
        type: "object",
        properties: {
          text: { type: "string", description: "Text content to match" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["text"],
      },
    },
    {
      name: "playwright_fill_by_text",
      description: "Fill an element identified by its text content",
      inputSchema: {
        type: "object",
        properties: {
          text: { type: "string", description: "Text content to match" },
          inputText: { type: "string", description: "Text to fill" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["text", "inputText"],
      },
    },
    {
      name: "playwright_click_by_label",
      description: "Click on an element identified by its label text",
      inputSchema: {
        type: "object",
        properties: {
          label: { type: "string", description: "Label text to match" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["label"],
      },
    },
    {
      name: "playwright_fill_by_label",
      description: "Fill an element identified by its label text",
      inputSchema: {
        type: "object",
        properties: {
          label: { type: "string", description: "Label text to match" },
          text: { type: "string", description: "Text to fill" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["label", "text"],
      },
    },
    {
      name: "playwright_click_by_placeholder",
      description: "Click on an element identified by its placeholder text",
      inputSchema: {
        type: "object",
        properties: {
          placeholder: { type: "string", description: "Placeholder text to match" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["placeholder"],
      },
    },
    {
      name: "playwright_fill_by_placeholder",
      description: "Fill an element identified by its placeholder text",
      inputSchema: {
        type: "object",
        properties: {
          placeholder: { type: "string", description: "Placeholder text to match" },
          text: { type: "string", description: "Text to fill" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["placeholder", "text"],
      },
    },
    {
      name: "playwright_click_by_title",
      description: "Click on an element identified by its title attribute",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title attribute value" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["title"],
      },
    },
    {
      name: "playwright_click_by_alt",
      description: "Click on an element identified by its alt text (for images)",
      inputSchema: {
        type: "object",
        properties: {
          alt: { type: "string", description: "Alt text to match" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["alt"],
      },
    },
    {
      name: "playwright_double_click",
      description: "Double click on an element",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector"],
      },
    },
    {
      name: "playwright_right_click",
      description: "Right click on an element",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector"],
      },
    },
    {
      name: "playwright_select_option_by_value",
      description: "Select an option from a dropdown by value",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the dropdown" },
          value: { type: "string", description: "Value to select" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector", "value"],
      },
    },
    {
      name: "playwright_select_option_by_label",
      description: "Select an option from a dropdown by label",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the dropdown" },
          label: { type: "string", description: "Label to select" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector", "label"],
      },
    },
    {
      name: "playwright_select_multiple_options",
      description: "Select multiple options from a dropdown",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the dropdown" },
          values: { type: "array", items: { type: "string" }, description: "Array of values to select" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector", "values"],
      },
    },
    {
      name: "playwright_check_element",
      description: "Check a checkbox or radio button",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector"],
      },
    },
    {
      name: "playwright_uncheck_element",
      description: "Uncheck a checkbox",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector"],
      },
    },
    {
      name: "playwright_type_text",
      description: "Type text into an element (simulates keyboard input)",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element" },
          text: { type: "string", description: "Text to type" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector", "text"],
      },
    },
    {
      name: "playwright_get_element_text",
      description: "Get the text content of an element",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector"],
      },
    },
    {
      name: "playwright_get_element_attribute",
      description: "Get the value of an element's attribute",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element" },
          attribute: { type: "string", description: "Attribute name to get" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector", "attribute"],
      },
    },
    {
      name: "playwright_check_element_exists",
      description: "Check if an element exists on the page",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector"],
      },
    },
    {
      name: "playwright_is_element_checked",
      description: "Check if a checkbox is checked",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector"],
      },
    },
    {
      name: "playwright_get_input_value",
      description: "Get the value of an input element",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector"],
      },
    },
    {
      name: "playwright_wait_for_element_hidden",
      description: "Wait for an element to be hidden from the DOM",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector"],
      },
    },
    {
      name: "playwright_wait_for_url_change",
      description: "Wait for URL to change or match expected URL",
      inputSchema: {
        type: "object",
        properties: {
          expectedUrl: { type: "string", description: "Expected URL to wait for (optional)" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: [],
      },
    },
    {
      name: "playwright_scroll_to_element",
      description: "Scroll to make an element visible",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector"],
      },
    },
    {
      name: "playwright_take_element_screenshot",
      description: "Take a screenshot of a specific element",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector for the element" },
          path: { type: "string", description: "Path to save the screenshot" },
          timeout: { type: "number", description: "Timeout in milliseconds (default: 30000)" }
        },
        required: ["selector", "path"],
      },
    },
  ] as const satisfies Tool[];
}

// Browser-requiring tools for conditional browser launch
export const BROWSER_TOOLS = [
  "playwright_navigate",
  "playwright_screenshot",
  "playwright_click",
  "playwright_iframe_click",
  "playwright_iframe_fill",
  "playwright_fill",
  "playwright_select",
  "playwright_hover",
  "playwright_upload_file",
  "playwright_evaluate",
  "playwright_close",
  "playwright_expect_response",
  "playwright_assert_response",
  "playwright_custom_user_agent",
  "playwright_get_visible_text",
  "playwright_get_visible_html",
  "playwright_go_back",
  "playwright_go_forward",
  "playwright_drag",
  "playwright_press_key",
  "playwright_save_as_pdf",
  "playwright_click_and_switch_tab",
  "playwright_click_by_test_id",
  "playwright_fill_by_test_id",
  "playwright_click_by_role",
  "playwright_fill_by_role",
  "playwright_click_by_text",
  "playwright_fill_by_text",
  "playwright_click_by_label",
  "playwright_fill_by_label",
  "playwright_click_by_placeholder",
  "playwright_fill_by_placeholder",
  "playwright_click_by_title",
  "playwright_click_by_alt",
  "playwright_double_click",
  "playwright_right_click",
  "playwright_select_option_by_value",
  "playwright_select_option_by_label",
  "playwright_select_multiple_options",
  "playwright_check_element",
  "playwright_uncheck_element",
  "playwright_type_text",
  "playwright_get_element_text",
  "playwright_get_element_attribute",
  "playwright_check_element_exists",
  "playwright_is_element_checked",
  "playwright_get_input_value",
  "playwright_wait_for_element_hidden",
  "playwright_wait_for_url_change",
  "playwright_scroll_to_element",
  "playwright_take_element_screenshot"
];

// API Request tools for conditional launch
export const API_TOOLS = [
  "playwright_get",
  "playwright_post",
  "playwright_put",
  "playwright_delete",
  "playwright_patch"
];

// Codegen tools
export const CODEGEN_TOOLS = [
  'start_codegen_session',
  'end_codegen_session',
  'get_codegen_session',
  'clear_codegen_session'
];

// All available tools
export const tools = [
  ...BROWSER_TOOLS,
  ...API_TOOLS,
  ...CODEGEN_TOOLS
];
