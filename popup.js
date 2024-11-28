import { getPersonalizedSubreddit, getMemeFromSubreddit } from './recs.js';

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Popup DOM fully loaded and parsed");

  try {
    // personalized subreddit recommendation
    const subreddit = await getPersonalizedSubreddit();
    console.log("Recommended subreddit:", subreddit);

    // fetch meme
    const memeData = await getMemeFromSubreddit(subreddit);
    console.log("Fetched meme data:", memeData);

    // Get the elements
    const memeImageElement = document.getElementById("memeImage");
    const memeTitleElement = document.getElementById("memeTitle");

    if (memeImageElement && memeTitleElement) {
      // Update the DOM with the fetched meme data
      memeImageElement.src = memeData.url;
      memeImageElement.alt = memeData.title;
      memeTitleElement.textContent = memeData.title;

      memeImageElement.onerror = async () => {
        console.error("Failed to load meme image, fetching a new one");
        const fallbackMeme = await getMemeFromSubreddit("memes");
        memeImageElement.src = fallbackMeme.url;
        memeImageElement.alt = fallbackMeme.title;
        memeTitleElement.textContent = fallbackMeme.title;
      };
    }
  } catch (error) {
    console.error("Error in popup:", error);
    const memeImageElement = document.getElementById("memeImage");
    const memeTitleElement = document.getElementById("memeTitle");
    
    if (memeImageElement && memeTitleElement) {
      memeTitleElement.textContent = "Error loading meme. Please try again.";
    }
  }
});