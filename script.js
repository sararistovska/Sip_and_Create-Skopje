/* ================= TEXT CHANGE ================= */

const phrases = [
    "Craft.",
    "Connect.",
    "Sip.",
    "Create.",
    "Paint.",
    "Repeat!"
];

let current = 0;

const title = document.getElementById("changing-text");


setInterval(()=>{

    title.style.opacity = "0";
    title.style.transform = "translateY(35px)";


    setTimeout(()=>{

        current++;

        if(current >= phrases.length){
            current = 0;
        }


        title.textContent = phrases[current];


        title.style.opacity = "1";
        title.style.transform = "translateY(0)";


    },800);


},3000);



/* ================= WINE DARK MODE ================= */

const wineButton = document.getElementById("wineButton");
const wineOverlay = document.querySelector(".wine-overlay");
const wineMessage = document.getElementById("wineMessage");
const wineMessageText = document.getElementById("wineMessageText");


wineButton.addEventListener("click",()=>{


    const dark =
        !document.body.classList.contains("dark");


    wineMessageText.textContent =
        dark
            ?
            "Oops, you spilled the wine! Dark mode unlocked."
            :
            "All cleaned up! Back to daylight.";



    wineButton.classList.add("active");

    wineOverlay.classList.add("active");



    setTimeout(()=>{

        wineMessage.classList.add("show");

    },400);



    setTimeout(()=>{

        wineMessage.classList.remove("show");

    },2200);




    setTimeout(()=>{

        document.body.classList.toggle("dark");

    },1200);




    setTimeout(()=>{

        wineOverlay.classList.remove("active");

        wineButton.classList.remove("active");

    },2800);


});



/* ================= ORBIT RESPONSIVE ================= */

const orbitScale =
    document.querySelector(".orbit-scale");


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


window.addEventListener(
    "resize",
    updateOrbit
);





/* ================= STORY IMAGE ZOOM ================= */


const storySection =
    document.querySelector(".story-section");


const storyImage =
    document.querySelector(".story-image");


const fadeTexts =
    document.querySelectorAll(".fade-text");


const cheers =
    document.querySelector(".cheers-text");




window.addEventListener("scroll",()=>{


    if(!storySection) return;



    const section =
        storySection.getBoundingClientRect();



    let progress =
        -section.top /
        (storySection.offsetHeight -
            window.innerHeight);



    progress =
        Math.max(
            0,
            Math.min(
                1,
                progress
            )
        );



    const width =
        160 +
        progress *
        (window.innerWidth - 160);



    const height =
        100 +
        progress *
        (window.innerHeight - 100);



    storyImage.style.width =
        width+"px";


    storyImage.style.height =
        height+"px";



    storyImage.style.borderRadius =
        (18 - progress*18)+"px";



    storyImage.style.transform =
        `
        translate(-50%,-50%)
        rotate(${-4 + progress*4}deg)
        `;




    fadeTexts.forEach(text=>{

        text.style.opacity =
            1-progress;

    });




    if(progress > .75){

        cheers.style.opacity =
            (progress-.75)/.25;

    }
    else{

        cheers.style.opacity = 0;

    }


});


/* ================= TESTIMONIAL CAROUSEL ================= */


const testimonialTrack =
    document.getElementById(
        "testimonialTrack"
    );


const testimonialCards =
    document.querySelectorAll(
        ".testimonial-card"
    );


const testimonialDots =
    document.getElementById(
        "testimonialDots"
    );


const testimonialPrev =
    document.getElementById(
        "testimonialPrev"
    );


const testimonialNext =
    document.getElementById(
        "testimonialNext"
    );



let testimonialIndex = 0;




function visibleTestimonials(){


    if(window.innerWidth <= 900){
        return 1;
    }


    if(window.innerWidth <= 1300){
        return 2;
    }


    return 3;

}




function maxTestimonials(){


    return Math.max(
        0,
        testimonialCards.length -
        visibleTestimonials()
    );

}





function createDots(){


    testimonialDots.innerHTML="";



    for(let i=0;i<=maxTestimonials();i++){


        const dot =
            document.createElement("div");


        dot.className =
            "testimonial-dot";



        if(i === testimonialIndex){

            dot.classList.add("active");

        }



        dot.onclick = ()=>{

            moveTestimonials(i);

        };



        testimonialDots.appendChild(dot);

    }


}




function moveTestimonials(position){


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
        .forEach((dot,index)=>{

            dot.classList.toggle(
                "active",
                index === testimonialIndex
            );

        });


}





testimonialPrev.onclick = ()=>{

    moveTestimonials(
        testimonialIndex - 1
    );

};



testimonialNext.onclick = ()=>{

    moveTestimonials(
        testimonialIndex + 1
    );

};





createDots();

moveTestimonials(0);






/* ================= AUTO PLAY ================= */


let autoSlide =
    setInterval(()=>{


        if(testimonialIndex >= maxTestimonials()){

            moveTestimonials(0);

        }
        else{

            moveTestimonials(
                testimonialIndex + 1
            );

        }


    },5000);





testimonialTrack.addEventListener(
    "mouseenter",
    ()=>{

        clearInterval(autoSlide);

    }
);



testimonialTrack.addEventListener(
    "mouseleave",
    ()=>{


        autoSlide =
            setInterval(()=>{


                if(testimonialIndex >= maxTestimonials()){

                    moveTestimonials(0);

                }
                else{

                    moveTestimonials(
                        testimonialIndex + 1
                    );

                }


            },5000);


    }
);






window.addEventListener(
    "resize",
    ()=>{

        createDots();

        moveTestimonials(
            testimonialIndex
        );

    }
);


// FAQ flipping

function flipCard(card) {
    card.classList.toggle("flipped");
}


//------------FOOTER----------------

    const newsletterForm =
    document.getElementById("newsletterForm");

    const newsletterEmail =
    document.getElementById("newsletterEmail");

    const newsletterMessage =
    document.getElementById("newsletterMessage");

    newsletterForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = newsletterEmail.value.trim();

    const submitButton =
    newsletterForm.querySelector("button");

    newsletterMessage.textContent = "";
    newsletterMessage.className = "newsletter-message";


    // Проверка дали полето е празно
    if (email === "") {

    showNewsletterMessage(
    "Please enter your email address.",
    "error"
    );

    return;
}


    // Проверка дали email адресата е валидна
    if (!newsletterEmail.checkValidity()) {

    showNewsletterMessage(
    "Please enter a valid email address.",
    "error"
    );

    return;
}


    submitButton.disabled = true;
    submitButton.textContent = "Joining...";


    /*
        Ова е привремена симулација.

        Кога ќе ја поврзете страницата со база,
        setTimeout делот ќе го замените со fetch()
        барање до вашиот backend.
    */

    setTimeout(function () {

    showNewsletterMessage(
    "You're on the list! We will keep you updated.",
    "success"
    );

    newsletterForm.reset();

    submitButton.disabled = false;
    submitButton.textContent = "Join";

}, 700);

});


    function showNewsletterMessage(message, type) {

    newsletterMessage.textContent = message;

    newsletterMessage.className =
    "newsletter-message " + type;
}


    const cookieSettingsButton =
    document.getElementById("cookieSettingsButton");

    cookieSettingsButton.addEventListener("click", function () {

    alert("Cookie settings will open here.");

});
