
// Autofill URL from local storage
const urlField = document.getElementById("1422154189");
if (localStorage.getItem("selectedBeat") === null) {
    console.log("No selected beat found");
} else {
    urlField.value = localStorage.getItem("selectedBeat");
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".purchaseForm");

    form.addEventListener("submit", async function (event) {
        if (!validateForm()) {
            event.preventDefault(); // Prevent form submission if validation fails
        } else {
            // Validation passed, submit form data
            try {
                await submitFormData();
                // You can add additional logic here if needed
                // For example, showing a success message or redirecting
            } catch (error) {
                console.error("Error submitting form data:", error);

                window.location.href='success';
                // Handle error, show error message, etc.
            }
        }
    });
});

async function submitFormData() {
    const form = document.querySelector(".purchaseForm");
    const formData = new FormData(form);
    const url =
        "https://docs.google.com/forms/d/e/1FAIpQLScAoxkDcYXCMk8HC8sCtOJTouycNxr7e-0oOyua50mnysno9g/formResponse";

    try {
        await fetch(url, {
            method: "POST",
            body: formData,
        });

        window.location.href='success';
    } catch (error) {
        throw new Error("Failed to submit form data: " + error.message);
    }
}

function sanitizeEmail() {
    let userEmail = document.getElementById("emailAddress").value;

    const basicFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const customDomainFormat = /^[^\s@]+@example\.com$/; // Custom domain format: example@example.com

    if (customDomainFormat.test(userEmail)) {
        return true;
    } else if (basicFormat.test(userEmail)) {
        return true;
    } else {
        alert("Invalid email detected. Please enter a valid email address");
        return false;
    }
}

function sanitizeArtistName() {
    let artistName = document.getElementById("703503845").value;

    if (!artistName.match(/^[a-zA-Z]{3,}(?: [a-zA-Z]+){0,2}$/)) {
        alert("Invalid characters detected in artist name");
        return false;
    } else {
        return true;
    }
}

function validateForm() {
    if (sanitizeEmail() && sanitizeArtistName()) {
        return true;
    } else {
        return false;
    }
}
