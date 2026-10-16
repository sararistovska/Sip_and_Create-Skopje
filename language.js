let language = "en";

const buttons = document.querySelectorAll(".lang-toggle button");
const elements = document.querySelectorAll("[data-en]");

function changeLanguage() {
    elements.forEach(function(element) {
        element.innerHTML = element.getAttribute("data-" + language);
    });

    buttons.forEach(function(button) {
        if (button.getAttribute("data-lang") === language) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        language = button.getAttribute("data-lang");
        changeLanguage();
    });
});

changeLanguage();