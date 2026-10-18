/* wine button za site stranici */

const wineButton = document.getElementById("wineButton");
const wineOverlay = document.querySelector(".wine-overlay");
const wineMessage = document.getElementById("wineMessage");
const wineMessageText = document.getElementById("wineMessageText");

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
    document.body.classList.add("dark");
}

if(wineButton && wineOverlay){

    wineButton.addEventListener("click", function(e){

        e.preventDefault();


        const dark =
            !document.body.classList.contains("dark");


        if(wineMessage && wineMessageText){

            wineMessageText.textContent =
                dark
                    ? "Oops, you spilled the wine! Dark mode unlocked."
                    : "All cleaned up! Back to daylight.";

        }


        wineButton.classList.add("active");

        wineOverlay.classList.add("active");


        if(wineMessage){

            setTimeout(function(){
                wineMessage.classList.add("show");
            },400);


            setTimeout(function(){
                wineMessage.classList.remove("show");
            },2200);

        }


        setTimeout(function(){

            document.body.classList.toggle("dark");

            /* save theme */
            localStorage.setItem(
                "theme",
                document.body.classList.contains("dark")
                    ? "dark"
                    : "light"
            );

        }, wineMessage ? 1200 : 900);


        setTimeout(function(){

            wineOverlay.classList.remove("active");

            wineButton.classList.remove("active");

        }, wineMessage ? 2800 : 1800);

    });

}




/* home: hero text */

const changingText = document.getElementById("changing-text");

if (changingText) {

    const phrases = {
        en: [
            "Craft.",
            "Connect.",
            "Sip.",
            "Create.",
            "Paint.",
            "Repeat!"
        ],
        mk: [
            "Твори.",
            "Поврзи се.",
            "Наздрави.",
            "Создавај.",
            "Сликај.",
            "Повтори!"
        ]
    };

    let current = 0;

    function getLanguage() {
        const activeButton = document.querySelector(".lang-button.active");

        if (activeButton) {
            return activeButton.dataset.lang === "mk" ? "mk" : "en";
        }

        return document.documentElement.lang === "mk" ? "mk" : "en";
    }

    function showCurrentPhrase() {
        const language = getLanguage();

        changingText.textContent = phrases[language][current];
    }

    document.querySelectorAll(".lang-button").forEach(button => {
        button.addEventListener("click", function () {
            current = 0;
            showCurrentPhrase();
        });
    });

    showCurrentPhrase();

    setInterval(() => {
        changingText.style.opacity = "0";
        changingText.style.transform = "translateY(35px)";

        setTimeout(() => {
            const language = getLanguage();

            current = (current + 1) % phrases[language].length;

            changingText.textContent = phrases[language][current];

            changingText.style.opacity = "1";
            changingText.style.transform = "translateY(0)";
        }, 800);

    }, 3000);
}





/* home: orbit responsive scale */

const orbitScale =
    document.querySelector(".orbit-scale");


if(orbitScale){

    function updateOrbit(){

        const size =
            Math.min(
                window.innerWidth,
                window.innerHeight
            );

        let scale =
            (size * 1.15) / 1600;

        if(scale > 1){
            scale = 1;
        }

        orbitScale.style.transform =
            `scale(${scale})`;

    }

    updateOrbit();

    window.addEventListener("resize", updateOrbit);

}


/* home: story image zoom on scroll */

const storySection =
    document.querySelector(".story-section");


if(storySection){

    const storyImage =
        document.querySelector(".story-image");

    const fadeTexts =
        document.querySelectorAll(".fade-text");

    const cheers =
        document.querySelector(".cheers-text");


    window.addEventListener("scroll",()=>{

        const section =
            storySection.getBoundingClientRect();

        let progress =
            -section.top /
            (storySection.offsetHeight -
                window.innerHeight);

        progress =
            Math.max(0, Math.min(1, progress));

        const width =
            160 + progress * (window.innerWidth - 160);

        const height =
            100 + progress * (window.innerHeight - 100);

        storyImage.style.width = width+"px";
        storyImage.style.height = height+"px";

        storyImage.style.borderRadius =
            (18 - progress*18)+"px";

        storyImage.style.transform =
            `
            translate(-50%,-50%)
            rotate(${-4 + progress*4}deg)
            `;

        fadeTexts.forEach(text=>{
            text.style.opacity = 1-progress;
        });

        if(progress > .75){
            cheers.style.opacity = (progress-.75)/.25;
        }
        else{
            cheers.style.opacity = 0;
        }

    });

}





/* home: testimonial carousel */

const testimonialTrack =
    document.getElementById("testimonialTrack");


if(testimonialTrack) {

    const testimonialCards =
        document.querySelectorAll(".testimonial-card");

    const testimonialDots =
        document.getElementById("testimonialDots");

    const testimonialPrev =
        document.getElementById("testimonialPrev");

    const testimonialNext =
        document.getElementById("testimonialNext");


    let testimonialIndex = 0;


    function visibleTestimonials() {

        if (window.innerWidth <= 900) {
            return 1;
        }

        if (window.innerWidth <= 1300) {
            return 2;
        }

        return 3;

    }


    function maxTestimonials() {

        return Math.max(
            0,
            testimonialCards.length -
            visibleTestimonials()
        );

    }


    function createDots() {

        testimonialDots.innerHTML = "";

        for (let i = 0; i <= maxTestimonials(); i++) {

            const dot =
                document.createElement("div");

            dot.className = "testimonial-dot";

            if (i === testimonialIndex) {
                dot.classList.add("active");
            }

            dot.onclick = () => {
                moveTestimonials(i);
            };

            testimonialDots.appendChild(dot);

        }

    }


    function moveTestimonials(position) {

        testimonialIndex =
            Math.max(
                0,
                Math.min(
                    position,
                    maxTestimonials()
                )
            );

        const cardWidth =
            testimonialCards[0].offsetWidth;

        testimonialTrack.style.transform =
            `translateX(-${
                testimonialIndex *
                (cardWidth + 25)
            }px)`;

        document
            .querySelectorAll(".testimonial-dot")
            .forEach((dot, index) => {

                dot.classList.toggle(
                    "active",
                    index === testimonialIndex
                );

            });

    }


    testimonialPrev.onclick = () => {
        moveTestimonials(testimonialIndex - 1);
    };

    testimonialNext.onclick = () => {
        moveTestimonials(testimonialIndex + 1);
    };


    createDots();

    moveTestimonials(0);


    let autoSlide =
        setInterval(() => {

            if (testimonialIndex >= maxTestimonials()) {
                moveTestimonials(0);
            } else {
                moveTestimonials(testimonialIndex + 1);
            }

        }, 5000);


    testimonialTrack.addEventListener("mouseenter", () => {
        clearInterval(autoSlide);
    });


    testimonialTrack.addEventListener("mouseleave", () => {

        autoSlide =
            setInterval(() => {

                if (testimonialIndex >= maxTestimonials()) {
                    moveTestimonials(0);
                } else {
                    moveTestimonials(testimonialIndex + 1);
                }

            }, 5000);

    });


    window.addEventListener("resize", () => {

        createDots();

        moveTestimonials(testimonialIndex);

    });
}




// faq flipping

function flipCard(card) {
    card.classList.toggle("flipped");
}



/* responsive navbar */

(() => {
    const navbar = document.querySelector(".navbar");
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const workshopsItem = document.querySelector(".nav-dropdown");
    const workshopsLink = document.querySelector(".workshops-link");

    if (!navbar || !navToggle || !navLinks) return;

    const mobileNav = window.matchMedia("(max-width: 1050px)");

    // close the mobile menu
    function closeMenu() {
        navLinks.classList.remove("is-open");

        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        if (workshopsItem) {
            workshopsItem.classList.remove("submenu-open");
        }

        if (workshopsLink) {
            workshopsLink.setAttribute("aria-expanded", "false");
        }
    }

    // open and close the hamburger menu
    navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("is-open");

        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    });

    // workshops submenu
    if (workshopsLink && workshopsItem) {
        workshopsLink.setAttribute("aria-expanded", "false");

        workshopsLink.addEventListener("click", (event) => {
            if (!mobileNav.matches) {

                return;
            }

            event.preventDefault();

            const isOpen =
                workshopsItem.classList.toggle("submenu-open");

            workshopsLink.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    }


    navLinks.querySelectorAll("a").forEach((link) => {
        if (link === workshopsLink) return;

        link.addEventListener("click", () => {
            if (mobileNav.matches) {
                closeMenu();
            }
        });
    });


    document.addEventListener("click", (event) => {
        if (
            mobileNav.matches &&
            !navbar.contains(event.target)
        ) {
            closeMenu();
        }
    });


    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && mobileNav.matches) {
            closeMenu();
            navToggle.focus();
        }
    });


    mobileNav.addEventListener("change", () => {
        closeMenu();
        navLinks.style.removeProperty("display");
    });
})();