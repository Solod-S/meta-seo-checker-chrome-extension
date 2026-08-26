# Chrome Web Store Permissions Justification

### `activeTab`
**Justification:**
Used only after the user explicitly triggers the extension by clicking its icon. It grants temporary access to the active browser tab so META SEO Checker can inspect the DOM structure, meta tags, headings, images, and links of the current page.

### `scripting`
**Justification:**
Used to execute the local in-page analyzer function on the active tab and to run the optional DOM element highlight helper (which provides temporary visual feedback by scrolling to and outlining selected headings, images, or links).
