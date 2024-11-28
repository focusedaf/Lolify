async function updateBrowsingHistory(tab) {
  try {
    const result = await chrome.storage.local.get("browsingHistory");
    const history = result.browsingHistory || [];

    console.log("Current browsing history:", history); // Log current history

    if (tab.url && !history.includes(tab.url)) {
      history.push(tab.url);
      await chrome.storage.local.set({ browsingHistory: history });
      console.log("Updated browsing history:", history); // Log after update
    }
  } catch (error) {
    console.error("Error updating browsing history:", error);
  }
}

// Listener for active tab changes or updates
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    await updateBrowsingHistory(tab);
  } catch (error) {
    console.error("Error getting active tab:", error);
  }
});

// Listener for tab updates (e.g., URL changes)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    await updateBrowsingHistory(tab);
  }
});

// Listener for extension installation or update
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ browsingHistory: [] }, () => {
    console.log("Initialized browsing history.");
  });
});
