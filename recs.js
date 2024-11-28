const GEMINI_API_KEY = "AIzaSyAAQGjrpHQJKVWiE1o_QUqdBQmelICBzkg";

/**
 * Summarizes the content of a given URL using Gemini's API
 * @param {string} url - The URL to summarize
 * @returns {Promise<string>} A summary of the URL or the hostname if summarization fails
 */
async function summarizeURLContent(url) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Summarize this URL's content in 3-4 words maximum. If you cannot interpret the URL, return only its title or domain name: ${url}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Gemini API request failed");
    }

    const data = await response.json();
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!summary) {
      throw new Error("Failed to extract valid summary from Gemini API");
    }
    return summary;
  } catch (error) {
    console.error("Error summarizing URL:", error);
    try {
      return new URL(url).hostname; // Return the hostname if URL summary fails
    } catch {
      return url; // Return the URL as is if both fail
    }
  }
}

/**
 * Fetches a meme from the specified subreddit
 * @param {string} subreddit - subreddit name without the "r/" prefix
 * @returns {Promise<Object>} meme data object
 */
async function getMemeFromSubreddit(subreddit) {
  try {
    const response = await fetch(`https://meme-api.com/gimme/${subreddit}`);
    if (!response.ok) {
      throw new Error("Failed to fetch meme");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching meme:", error);
    const response = await fetch("https://meme-api.com/gimme");
    return await response.json();
  }
}

/**
 * Get a personalized subreddit suggestion based on the current tab's URL
 * @returns {Promise<string>} A subreddit name
 */
async function getPersonalizedSubreddit() {
  try {
    // Get the current active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab || !tab.url) {
      throw new Error("No active tab with a URL found");
    }

    const currentURL = tab.url;

    // Summarize the current tab's URL
    const summary = await summarizeURLContent(currentURL);

    // Get personalized subreddit based on the URL summary
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Based on this topic: ${summary}, suggest exactly ONE subreddit name (without "r/") that would have relevant memes. ONLY return the subreddit name, no other text or explanation. The response must be a single word.`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Gemini API request failed");
    }

    const data = await response.json();
    const subreddit = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!subreddit) {
      throw new Error("Failed to extract subreddit from Gemini API");
    }
    return subreddit;
  } catch (error) {
    console.error("Error getting personalized subreddit:", error);
    // Fallback to default meme subreddits if there's an error
    const defaults = ["memes", "dankmemes", "wholesomememes", "me_irl"];
    return defaults[Math.floor(Math.random() * defaults.length)];
  }
}

// Example usage
async function getPersonalizedMeme() {
  try {
    const subreddit = await getPersonalizedSubreddit();
    console.log("Recommended subreddit:", subreddit);
    const memeData = await getMemeFromSubreddit(subreddit);
    console.log("Meme:", memeData);
  } catch (error) {
    console.error("Error getting personalized meme:", error);
  }
}

getPersonalizedMeme();

// Exporting functions
export { getPersonalizedSubreddit, getMemeFromSubreddit };
