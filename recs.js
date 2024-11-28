const GEMINI_API_KEY = 'AIzaSyAAQGjrpHQJKVWiE1o_QUqdBQmelICBzkg';

/**
 * analyzes browsing history to suggest a relevant subreddit for memes
 * @returns {Promise<string>} A subreddit name without the "r/" prefix
 */
async function summarizeURLContent(url) {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Summarize this URL's content in 3-4 words maximum. If you cannot interpret the URL, return only its title or domain name: ${url}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Gemini API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error("Error summarizing URL:", error);
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    }
}

async function getPersonalizedSubreddit() {
    try {
        const result = await chrome.storage.local.get("browsingHistory");
        const history = result.browsingHistory || [];
        if (history.length === 0) {
            throw new Error("No browsing history available");
        }

        const summaries = await Promise.all(history.map(url => summarizeURLContent(url)));
        
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Based on these website topics: ${summaries.join(", ")},
                            suggest exactly ONE subreddit name (without "r/") that would have relevant memes.
                            ONLY return the subreddit name, no other text or explanation.
                            The response must be a single word.`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Gemini API request failed');
        }

        const data = await response.json();
        const subreddit = data.candidates[0].content.parts[0].text.trim();
        return subreddit;
    } catch (error) {
        console.error("Error getting personalized subreddit:", error);
        // fallback to some default meme subreddits if there's an error
        const defaults = ["memes", "dankmemes", "wholesomememes", "me_irl"];
        return defaults[Math.floor(Math.random() * defaults.length)];
    }
}

/**
 * fetches a meme from the specified subreddit
 * @param {string} subreddit - subreddit name without the "r/" prefix
 * @returns {Promise<Object>} meme data object
 */
async function getMemeFromSubreddit(subreddit) {
    try {
        const response = await fetch(`https://meme-api.com/gimme/${subreddit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch meme');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching meme:", error);
        const response = await fetch('https://meme-api.com/gimme');
        return await response.json();
    }
}

export { getPersonalizedSubreddit, getMemeFromSubreddit };