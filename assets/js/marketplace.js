
// Utility funtion might be useful for extracting beat names from youtube titles
function extractTextBetweenQuotes(inputString) {
    const regex = /"(.*?)"/; // Regular expression to match text between quotes
    const matches = inputString.match(regex);
    if (matches && matches.length >= 2) {
        return matches[1]; // Return the text between the quotes
    } else {
        return ""; // Return an empty string if no text between quotes is found
    }
}


// Lazy loading background
const bg = document.querySelector(".background");
const bgimg = bg.querySelector(".background-img");
function loaded() {
    bg.classList.add("loaded");
}

if (bgimg.complete) {
    loaded();
} else {
    bgimg.addEventListener("load", loaded);
}


// Load cards initially (on page load)
async function loadCards() {
    let data = await loadClient();
    console.log(data);
    const itemCount = document.getElementById("item-count");
    itemCount.innerHTML = data.length;

    const cardContainer = document.querySelector(".cards-container");
    cardContainer.innerHTML = ""; // Clear previous cards before rendering

    for (let i = 0; i < data.length; i++) {
        const beatName = data[i].snippet.title;
        const thumbnail = data[i].snippet.thumbnails.medium.url;
        const linkURL =
            "https://www.youtube.com/watch?v=" +
            data[i].snippet.resourceId.videoId;

        // Create the card container div
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("id", extractTextBetweenQuotes(beatName));
        card.href = linkURL;
        card.target = "_blank";

        // Create the thumbnail container div and image element
        const thumbnailContainer = document.createElement("div");
        thumbnailContainer.classList.add("thumbnail-container");
        const thumbnailImage = document.createElement("img");
        thumbnailImage.classList.add("thumbnail");
        thumbnailImage.setAttribute("loading", "lazy");
        thumbnailImage.src = thumbnail;
        thumbnailImage.alt = "";
        thumbnailImage.href = linkURL;
        thumbnailImage.target = "_blank";

        // Create the BeatName (h2) element
        const beatNameElement = document.createElement("h2");
        beatNameElement.classList.add("beat-name");
        beatNameElement.textContent = beatName;

        // Create the Listen Now (a) element
        const listenNowLink = document.createElement("a");
        listenNowLink.classList.add("button", "listen-now");
        listenNowLink.href = linkURL;
        listenNowLink.target = "_blank";
        listenNowLink.textContent = "Listen Now";

        // Create the Purchase (a) element
        const purchaseLink = document.createElement("a");
        purchaseLink.classList.add("button", "purchase");
        purchaseLink.textContent = "Purchase";
        // data-url attribute used to autofill url field in purchase form through local storage
        purchaseLink.setAttribute("data-url", linkURL);

        // Append elements to the card
        thumbnailContainer.appendChild(thumbnailImage);
        card.appendChild(thumbnailContainer);
        card.appendChild(beatNameElement);
        card.appendChild(listenNowLink);
        card.appendChild(purchaseLink);

        // Append the card to the container
        cardContainer.appendChild(card);
    }
    const purchaseLinks = document.querySelectorAll(".purchase");
    purchaseLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.setItem("selectedBeat", link.getAttribute("data-url"));
            window.location.href = "purchase";
        });
    });
}


// Calls to GAPI only return up to 50 items

// Responses from calls will concatenate into this singular array
let fullData = [];

// Page Token for next and previous page is returned in current call
// Page token allows for the next call to be made so the response contains 50 subsequent videos
let pageToken = null;

async function loadClient() {
    gapi.client.setApiKey("AIzaSyCB2qxUm9Di2ol4NsHxyGHcTIazBABdWgc");
    try {
        await gapi.client.load(
            "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"
        );
        console.log("GAPI client loaded for API");
        while (pageToken !== undefined) {
            const items = await getData(pageToken);
            fullData.push(...items);
        }
        return fullData;
    } catch (err) {
        console.error("Error loading GAPI client for API", err);
    }
}


// Getting videos
async function getData(token) {
    try {
        const response = await gapi.client.youtube.playlistItems.list({
            part: ["snippet"],
            maxResults: 50,
            pageToken: token,
            playlistId: "UUOFK5lO9WpLXbRmBIjzvm5w",
        });
        var newPageToken = response.result.nextPageToken;
        pageToken = newPageToken; // Update the global pageToken
        return response.result.items; // Return the fetched data
    } catch (err) {
        console.error("Execute error", err);
        return null; // Return null in case of an error
    }
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({
        client_id:
            "539245917081-odophh739qn1kp7q3af4usr8kjpjkj5l.apps.googleusercontent.com",
    });
});


//Re-rendering cards after search query has been entered
async function renderCards(query) {
    let data = await loadClient();

    const cardContainer = document.querySelector(".cards-container");
    cardContainer.innerHTML = ""; // Clear previous cards before rendering

    const filtereddata = data.filter((item) =>
        item.snippet.title.toLowerCase().includes(query.toLowerCase())
    );

    const itemCount = document.getElementById("item-count");
    itemCount.innerHTML = filtereddata.length;

    for (let i = 0; i < filtereddata.length; i++) {
        const beatName = filtereddata[i].snippet.title;
        const thumbnail = filtereddata[i].snippet.thumbnails.medium.url;
        const linkURL =
            "https://www.youtube.com/watch?v=" +
            filtereddata[i].snippet.resourceId.videoId;

        // Create the card container div
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("id", extractTextBetweenQuotes(beatName));

        // Create the thumbnail container div and image element
        const thumbnailContainer = document.createElement("div");
        thumbnailContainer.classList.add("thumbnail-container");
        const thumbnailImage = document.createElement("img");
        thumbnailImage.classList.add("thumbnail");
        thumbnailImage.setAttribute("loading", "lazy");
        thumbnailImage.src = thumbnail;
        thumbnailImage.alt = "";

        // Create the BeatName (h2) element
        const beatNameElement = document.createElement("h2");
        beatNameElement.classList.add("beat-name");
        beatNameElement.textContent = beatName;

        // Create the Listen Now (a) element
        const listenNowLink = document.createElement("a");
        listenNowLink.classList.add("button", "listen-now");
        listenNowLink.href = linkURL;
        listenNowLink.target = "_blank";
        listenNowLink.textContent = "Listen Now";

        // Create the Purchase (a) element
        const purchaseLink = document.createElement("a");
        purchaseLink.classList.add("button", "purchase");
        purchaseLink.href = "";
        purchaseLink.textContent = "Purchase";
        // data-url attribute used to autofill url field in purchase form through local storage
        purchaseLink.setAttribute("data-url", linkURL);

        // Append elements to the card
        thumbnailContainer.appendChild(thumbnailImage);
        card.appendChild(thumbnailContainer);
        card.appendChild(beatNameElement);
        card.appendChild(listenNowLink);
        card.appendChild(purchaseLink);

        // Append the card to the container
        cardContainer.appendChild(card);

        const purchaseLinks = document.querySelectorAll(".purchase");
        purchaseLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.setItem(
                    "selectedBeat",
                    link.getAttribute("data-url")
                );
                window.location.href = "purchase";
            });
        });
    }
}


// Filter video results based on search query
function searchByBeatName(query) {
    const filteredData = glblData.filter((item) =>
        item.snippet.title.toLowerCase().includes(query.toLowerCase())
    );
    renderCards(filteredData);
}

// Functional search bar
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const searchBar = document.getElementById("searchBar");
        searchBar.addEventListener("input", function () {
            const query = searchBar.value.trim();
            renderCards(query);
        });
    } catch (err) {
        console.error("Error loading data", err);
    }
});
