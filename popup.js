import { getPersonalizedSubreddit, getMemeFromSubreddit } from './recs.js';

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Popup DOM fully loaded and parsed");
  const memeContainer = document.getElementById("memeContainer");
  const memeImage = document.getElementById("memeImage");
  const memeTitle = document.getElementById("memeTitle");
  const memeButton = document.querySelector(".cute-button");

  const fetchPersonalizedMeme = async () => {
    memeTitle.textContent = "Loading...";
    try {
      const subreddit = await getPersonalizedSubreddit();
      console.log("Recommended subreddit:", subreddit);
      const memeData = await getMemeFromSubreddit(subreddit);
      console.log("Fetched meme data:", memeData);

      const img = new Image();
      img.onload = () => {
        memeImage.src = img.src;
        memeTitle.textContent = memeData.title;
      };
      img.src = memeData.url;

      img.onerror = async () => {
        console.error("Failed to load meme image, fetching a new one");
        const fallbackMeme = await getMemeFromSubreddit("memes");
        memeImage.src = fallbackMeme.url;
        memeTitle.textContent = fallbackMeme.title;
      };
    } catch (error) {
      console.error("Error in popup:", error);
      memeTitle.textContent = "Error loading meme. Please try again.";
    }
  };

  memeButton.addEventListener("click", fetchPersonalizedMeme);
  fetchPersonalizedMeme();
});
