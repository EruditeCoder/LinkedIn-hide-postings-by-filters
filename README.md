# LinkedIn Job Hider
This is a simple Firefox/Chrome extension that hides job postings on LinkedIn made for personal use (for now).

## Installation / Load Extension
1. Clone the repository
2. Open Firefox/Chrome
3. Go to `about:debugging#/runtime/this-firefox` (Firefox) or `chrome://extensions/` (Chrome)
4. Click on `Load Temporary Add-on` (Firefox) or `Load unpacked` (Chrome)
5. Select the `manifest.json` file in the cloned repository

## Usage
1. Go to the LinkedIn job search page
2. Click on the extension icon and add words to filter
3. Refresh the page (will be automatic in a future update)
4. Success

## Permissions
- `storage`: To store the filter words
- `activeTab`: Needed for general filtering functionality
