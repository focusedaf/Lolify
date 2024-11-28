chrome.history.onVisited.addListener((historyItem) => {
  console.log("Visited URL:", historyItem.url);

  chrome.storage.local.get("browsingHistory", (result) => {
    let history = result.browsingHistory || [];
    history.push(historyItem.url);
    if (history.length > 20) {
      history.shift();
    }

    // Save the updated history back to local storage
    chrome.storage.local.set({ browsingHistory: history }, () => {
      console.log("Browsing history updated:", history);
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    console.log("Tab URL updated:", changeInfo.url);
  }
});
