export function openOuterBrowser(url) {
  chrome.tabs.create({
    "url": url
  });
}
