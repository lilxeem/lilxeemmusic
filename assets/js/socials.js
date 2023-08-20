
// Copying the links to clipboard (On click of link icon)

const shareButtons = document.querySelectorAll(".link-icon");

async function copyText(e) {
    e.preventDefault();
    const link = this.getAttribute("link");
    try {
        await navigator.clipboard.writeText(link);
        alert("Link copied to clipboard!");
    } catch (err) {
        console.error(err);
    }
}

shareButtons.forEach((shareButton) =>
    shareButton.addEventListener("click", copyText)
);

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