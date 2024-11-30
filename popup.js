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

  
  let seconds = 0;
  let timerInterval;
  let isTimerRunning = false;

 
  function updateTimer() {
    seconds++; 
    document.getElementById(
      "timerDisplay"
    ).textContent = `Time Spent: ${seconds}s`;
  }


  function startTimer() {
    timerInterval = setInterval(updateTimer, 1000); 
    isTimerRunning = true;
    document.getElementById("playPauseStopButton").textContent =
      "⏸️ Pause Timer";
  }

  // Pause the timer
  function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    document.getElementById("playPauseStopButton").textContent =
      "▶️ Resume Timer"; 
  }

 
  function stopTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    seconds = 0; 
    document.getElementById("timerDisplay").textContent = `Time Spent: 0s`;
    document.getElementById("playPauseStopButton").textContent =
      "▶️ Start Timer"; 
  }

  
  function toggleTimer() {
    if (isTimerRunning) {
      pauseTimer(); 
    } else if (seconds > 0) {
      stopTimer(); 
    } else {
      startTimer(); 
    }
  }

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
  document
    .getElementById("playPauseStopButton")
    .addEventListener("click", toggleTimer);
  fetchMeme();
});
