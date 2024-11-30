// import { getPersonalizedSubreddit, getMemeFromSubreddit } from './recs.js';

// document.addEventListener("DOMContentLoaded", async () => {
//   console.log("Popup DOM fully loaded and parsed");

//   try {
//     // personalized subreddit recommendation
//     const subreddit = await getPersonalizedSubreddit();
//     console.log("Recommended subreddit:", subreddit);

//     // fetch meme
//     const memeData = await getMemeFromSubreddit(subreddit);
//     console.log("Fetched meme data:", memeData);

//     // Get the elements
//     const memeImageElement = document.getElementById("memeImage");
//     const memeTitleElement = document.getElementById("memeTitle");

//     if (memeImageElement && memeTitleElement) {
//       // Update the DOM with the fetched meme data
//       memeImageElement.src = memeData.url;
//       memeImageElement.alt = memeData.title;
//       memeTitleElement.textContent = memeData.title;

//       memeImageElement.onerror = async () => {
//         console.error("Failed to load meme image, fetching a new one");
//         const fallbackMeme = await getMemeFromSubreddit("memes");
//         memeImageElement.src = fallbackMeme.url;
//         memeImageElement.alt = fallbackMeme.title;
//         memeTitleElement.textContent = fallbackMeme.title;
//       };
//     }
//   } catch (error) {
//     console.error("Error in popup:", error);
//     const memeImageElement = document.getElementById("memeImage");
//     const memeTitleElement = document.getElementById("memeTitle");
    
//     if (memeImageElement && memeTitleElement) {
//       memeTitleElement.textContent = "Error loading meme. Please try again.";
//     }
//   }
// });


document.addEventListener("DOMContentLoaded", () => {
  const memeContainer = document.getElementById("memeContainer");
  const memeImage = document.getElementById("memeImage");
  const memeTitle = document.getElementById("memeTitle");
  const memeButton = document.querySelector(".cute-button");

 
  const fetchMeme = async () => {
    memeTitle.textContent = "Loading..."; 
    try {
      const response = await fetch("https://meme-api.com/gimme");
      const memeData = await response.json();
      const img = new Image(); 
      img.onload = () => {
        memeImage.src = img.src; 
        memeTitle.textContent = memeData.title; 
      };
      img.src = memeData.url; 
    } catch (error) {
      memeTitle.textContent = "Oops, something went wrong!";
      console.error("Failed to fetch meme:", error);
    }
  };  
  memeButton.addEventListener("click", fetchMeme);
  fetchMeme();
});
