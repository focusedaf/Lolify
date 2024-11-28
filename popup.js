document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup DOM fully loaded and parsed.");

  // Fetch active tab details
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    console.log("Active tab details:", activeTab);

    // Fetch a meme from the API
    fetch("https://meme-api.com/gimme")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched meme data:", data);

        // Get the elements
        const memeImageElement = document.getElementById("memeImage");
        const memeTitleElement = document.getElementById("memeTitle");

        if (memeImageElement && memeTitleElement) {
          // Update the DOM with the fetched meme data
          memeImageElement.src = data.url;
          memeTitleElement.innerText = data.title;
        } else {
          console.error("Meme display elements not found in DOM.");
        }
      })
      .catch((error) => console.error("Error fetching meme:", error));
  });
});
