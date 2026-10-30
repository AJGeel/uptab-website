const PHOTO_PAGES = ["*://unsplash.com/photos/*", "*://www.unsplash.com/photos/*"];

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "list") {
    return chrome.tabs
      .query({ url: PHOTO_PAGES })
      .then((tabs) => tabs.map(({ id, url }) => ({ id, url })));
  }

  if (message.type === "close") {
    return chrome.tabs.remove(message.ids);
  }
});
