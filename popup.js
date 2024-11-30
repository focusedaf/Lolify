import { getPersonalizedSubreddit, getMemeFromSubreddit } from './recs.js';

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Popup DOM fully loaded and parsed");
  const memeContainer = document.getElementById("memeContainer");
  const memeImage = document.getElementById("memeImage");
  const memeTitle = document.getElementById("memeTitle");
  const memeButton = document.querySelector(".cute-button");

 
  let seconds = 0;
  let timerInterval;
  let isTimerRunning = false;

  
  function updateTimer() {
    seconds++;
    document.getElementById("timerDisplay").textContent = `Time Spent: ${seconds}s`;
  }

 
  function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
    isTimerRunning = true;
    document.getElementById("playPauseStopButton").textContent = "⏸️ Pause Timer";
  }

  
  function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    document.getElementById("playPauseStopButton").textContent = "▶️ Resume Timer";
  }

  
  function stopTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    seconds = 0;
    document.getElementById("timerDisplay").textContent = `Time Spent: 0s`;
    document.getElementById("playPauseStopButton").textContent = "▶️ Start Timer";
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
  document
    .getElementById("playPauseStopButton")
    .addEventListener("click", toggleTimer);


  fetchPersonalizedMeme();
});
