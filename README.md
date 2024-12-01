# Lolify Browser Extension

Lolify is a fun and quirky browser extension designed to enhance your browsing experience by delivering memes directly to your screen! With a kawaii-themed interface and easy-to-use features, Lolify makes taking breaks more enjoyable.

## Features

- **Random Meme Display:**
  - Enjoy a random meme from popular Reddit subreddits (e.g., r/memes, r/funny, r/dankmemes). Memes are fetched using the Meme API (https://meme-api.com/gimme) and are displayed non-intrusively to brighten your browsing experience.

- **Timer Functionality:**
  - **Play:** Starts the timer to track how long you’ve been browsing memes.
  - **Pause:** Pauses the timer when you need to take a break from memes.
  - **Stop:** Stops the timer and resets it to zero.

- **Quick Meme Refresh:**
  - Refresh the meme feed at any time by clicking the extension’s button to fetch fresh and funny content whenever you need a break.

- **Kawaii UI:**
  - Lolify comes with an adorable and intuitive user interface designed to make your meme-browsing experience even more delightful.

## How It Works

1. **Meme Generation:** When you press the "Fetch Meme" button, Lolify retrieves a meme from a relevant subreddit based on the data available in the parsed subreddit JSON file. If no specific subreddit is parsed, it defaults to general meme subreddits.
2. **Timer Controls:** The integrated timer helps you manage your browsing time by starting, pausing, or stopping at your command. This feature is especially helpful for maintaining a balance between work and leisure.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/lolify.git
   ```
2. Navigate to the directory:
   ```bash
   cd lolify
   ```
3. Load the extension in your browser:
   - Open your browser’s extension settings.
   - Enable "Developer mode."
   - Load the unpacked extension and select the `lolify` folder.

## Usage

- Launch the Lolify extension from your browser toolbar.
- Use the play, pause, and stop button to manage your timer while browsing memes.
- Click the "Fetch Meme" button to display a new meme directly from the Meme API.

## Upcoming Features

- **Customized Messages:** Add sassy or motivational messages after stopping the timer.
- **Enhanced Personalization:** Improvements to subreddit parsing and recommendations for more relevant memes.

## Contributing

Contributions are welcome! If you’d like to suggest improvements or report bugs, please open an issue or submit a pull request.


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Have fun, and remember: balance memes with productivity!**

