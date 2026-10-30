// Passes requests between the admin page and the background script
window.addEventListener("message", async ({ source, data }) => {
  if (source !== window || data?.from !== "uptab-admin") {
    return;
  }

  const result = await chrome.runtime.sendMessage({ type: data.type, ids: data.ids });

  window.postMessage({ from: "unsplash-tabs", requestId: data.requestId, result }, window.location.origin);
});
