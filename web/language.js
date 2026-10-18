let language = localStorage.getItem("selectedLanguage") || "en";

const buttons = document.querySelectorAll(".lang-toggle button");
const elements = document.querySelectorAll("[data-en]");

function changeLanguage() {
    elements.forEach(function (element) {
        const translation = element.getAttribute("data-" + language);

        if (translation !== null) {
            element.innerHTML = translation;
        }
    });

    buttons.forEach(function (button) {
        button.classList.toggle(
            "active",
            button.getAttribute("data-lang") === language
        );
    });
}

buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        language = button.getAttribute("data-lang");

        // zacuvaj jazik megju stranici
        localStorage.setItem("selectedLanguage", language);

        changeLanguage();
    });
});

changeLanguage();
