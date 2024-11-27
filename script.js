fetch("https://meme-api.com/gimme")
  .then((response) => response.json()) //take the response from the fetch call and convert it into a json object
  .then((data) => {
    // Get the meme image URL from the response
    const memeUrl = data.url;
    const memeTitle = data.title;

    // Set the image 'src' attribute
    const memeImageElement = document.getElementById("memeImage");
    if (memeImageElement) {
      memeImageElement.src = memeUrl;
    }

    // Set the innerHTML for the title
    const memeTitleElement = document.getElementById("memeTitle");
    if (memeTitleElement) {
      memeTitleElement.innerHTML = `<strong>${memeTitle}</strong>`;
    }
  })
  .catch((error) => {
    console.error("Error fetching meme:", error);
  });
