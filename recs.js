const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = 'AIzaSyCodUmU64wINsUpqstOtom-yVxf_W3TkEk';

/**
 * Summarizes the content of a given URL using Gemini's API
 * @param {string} url - The URL to summarize
 * @returns {Promise<string>} A summary of the URL or the hostname if summarization fails
 */
async function summarizeURLContent(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(
        GEMINI_API_ENDPOINT + "?key=" + GEMINI_API_KEY,
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
        if (i === retries - 1) throw new Error("Gemini API request failed");
        continue;
      }

      const data = await response.json();
      const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!summary) throw new Error("Failed to extract valid summary from Gemini API");
      return summary;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
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
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab || !tab.url) {
      throw new Error("No active tab with a URL found");
    }

    const currentURL = tab.url;
    const summary = await summarizeURLContent(currentURL);
    const subredditData = await loadSubredditData();
    
    // Prepare context for RAG
    const context = subredditData.meme_subreddits.map(
      sr => `${sr.name}: ${sr.description}`
    ).join('\n');
    
    // Use Gemini 1.5 Flash with RAG
    const response = await fetch(
      GEMINI_API_ENDPOINT + "?key=" + GEMINI_API_KEY,
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
                  text: `Given this context about available meme subreddits:\n${context}\n\nBased on this topic: ${summary}, suggest exactly ONE subreddit name from the list above that would be most relevant. Only return the subreddit name, no explanation.`,
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

async function loadSubredditData() {
  try {
    const response = await fetch(chrome.runtime.getURL('subreddit_data.json'));
    return await response.json();
  } catch (error) {
    console.error('Error loading subreddit data:', error);
    return { meme_subreddits: [] };
  }
}


getPersonalizedMeme();


export { getPersonalizedSubreddit, getMemeFromSubreddit };
