const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (
        name === "" ||
        email === "" ||
        subject === "" ||
        message === ""
    ) {
        formMessage.textContent = "Please fill in all fields.";
        formMessage.style.color = "#a33a3a";
        return;
    }

    if (!email.includes("@")) {
        formMessage.textContent =
            "Please enter a valid email address.";
        formMessage.style.color = "#a33a3a";
        return;
    }

    formMessage.textContent =
        "Thank you! Your message has been sent.";
    formMessage.style.color = "#4d684d";

    contactForm.reset();
});