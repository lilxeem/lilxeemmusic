
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