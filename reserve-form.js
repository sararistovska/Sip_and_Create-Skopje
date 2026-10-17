/* =========================================
   ELEMENTS
========================================= */

const workshopSelect =
    document.getElementById("workshop");

const dateInput =
    document.getElementById("date");

const timeSelect =
    document.getElementById("time");

const messageInput =
    document.getElementById("message");

const specialRequestLabel =
    document.getElementById(
        "specialRequestLabel"
    );

const privateMessage =
    document.getElementById(
        "privateMessage"
    );

const workshopImage =
    document.getElementById(
        "workshopImage"
    );

const visualSmallTitle =
    document.getElementById(
        "visualSmallTitle"
    );

const visualTitle =
    document.getElementById(
        "visualTitle"
    );

const visualDescription =
    document.getElementById(
        "visualDescription"
    );

const selectedBooking =
    document.getElementById(
        "selectedBooking"
    );

const selectedBookingValue =
    document.getElementById(
        "selectedBookingValue"
    );

const selectedBookingPrice =
    document.getElementById(
        "selectedBookingPrice"
    );





const workshopData = {

    "Glass Painting": {

        image:
            "images/reservation/glass-painting.jpg",

        smallTitle:
            "Paint. Create. Enjoy.",

        title:
            "Glass Painting",

        description:
            "Explore colour and creativity while transforming glass into something uniquely yours.",

        price:
            1800

    },


    "Pasta Making": {

        image:
            "images/reservation/pasta-making.jpg",

        smallTitle:
            "Create. Cook. Share.",

        title:
            "Pasta Making",

        description:
            "Learn the art of handmade pasta and enjoy a creative evening filled with delicious flavours.",

        price:
            1800

    },


    "Ceramics Decorating": {

        image:
            "images/reservation/ceramics.jpg",

        smallTitle:
            "Shape Your Creativity.",

        title:
            "Ceramics Decorating",

        description:
            "Bring your imagination to life by decorating ceramics and creating a piece that is truly your own.",

        price:
            1800

    },


    "Crocheting": {

        image:
            "images/reservation/crochet.png",

        smallTitle:
            "Slow Down. Create.",

        title:
            "Crocheting",

        description:
            "Discover the calming art of crocheting and create something beautiful with your own hands.",

        price:
            2000

    },


    "Private Event": {

        image:
            "images/reservation/private-event.png",

        smallTitle:
            "Your Occasion. Your Way.",

        title:
            "Private Event",

        description:
            "Celebrate your special occasion in your own private Sip & Create experience.",

        price:
            null

    }

};





const today =
    new Date();

today.setHours(
    0,
    0,
    0,
    0
);


const todayYear =
    today.getFullYear();

const todayMonth =
    String(
        today.getMonth() + 1
    ).padStart(2, "0");

const todayDay =
    String(
        today.getDate()
    ).padStart(2, "0");


dateInput.min =
    `${todayYear}-${todayMonth}-${todayDay}`;





const params =
    new URLSearchParams(
        window.location.search
    );


const urlDate =
    params.get("date");

const urlWorkshop =
    params.get("workshop");

const urlTime =
    params.get("time");



if (urlDate) {

    dateInput.value =
        urlDate;

}




if (urlWorkshop) {

    workshopSelect.value =
        urlWorkshop;

    updateWorkshop(
        urlWorkshop
    );

}



if (urlTime) {

    timeSelect.value =
        urlTime;

}



workshopSelect.addEventListener(
    "change",
    function () {

        updateWorkshop(
            this.value
        );

    }
);



function updateWorkshop(
    workshopName
) {

    const data =
        workshopData[
            workshopName
            ];


    if (!data) {
        return;
    }



    workshopImage.classList.add(
        "changing"
    );


    setTimeout(
        function () {

            workshopImage.src =
                data.image;

            workshopImage.alt =
                data.title;

            visualSmallTitle.textContent =
                data.smallTitle;

            visualTitle.textContent =
                data.title;

            visualDescription.textContent =
                data.description;

            workshopImage.classList.remove(
                "changing"
            );

        },
        250
    );


    /*
     * PRIVATE EVENT
     */

    if (
        workshopName ===
        "Private Event"
    ) {

        privateMessage.classList.add(
            "show"
        );


        specialRequestLabel.classList.add(
            "required-label"
        );


        messageInput.required =
            true;


        selectedBookingPrice.textContent =
            "Contact us";


    } else {

        privateMessage.classList.remove(
            "show"
        );


        specialRequestLabel.classList.remove(
            "required-label"
        );


        messageInput.required =
            false;


        selectedBookingPrice.textContent =
            `${data.price} ден.`;

    }




    selectedBookingValue.textContent =
        data.title;


    selectedBooking.style.display =
        "flex";


    if (
        workshopName ===
        "Private Event"
    ) {

        /*
         * If user manually chooses
         * Private Event, allow time selection.
         */

    }

}




const reservationForm =
    document.getElementById(
        "reservationForm"
    );

const reservationMessage =
    document.getElementById(
        "reservationMessage"
    );


reservationForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const workshop =
            workshopSelect
                .value;


        const date =
            dateInput
                .value;


        const time =
            timeSelect
                .value;


        const guests =
            document
                .getElementById("guests")
                .value;


        const specialRequest =
            messageInput
                .value
                .trim();




        if (
            workshop ===
            "Private Event"
            &&
            specialRequest === ""
        ) {

            messageInput.focus();

            return;

        }



        const formattedDate =
            new Date(
                date + "T00:00:00"
            ).toLocaleDateString(
                "en-US",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );




        const price =
            workshop ===
            "Crocheting"

                ? "2000 ден."

                : workshop ===
                "Private Event"

                    ? "To be confirmed"

                    : "1800 ден.";



        reservationMessage.innerHTML = `

                Thank you,
                <strong>${name}</strong>.

                Your reservation request for
                <strong>${workshop}</strong>
                on
                <strong>${formattedDate}</strong>
                at
                <strong>${time}</strong>
                for
                <strong>${guests}</strong>
                guest(s) has been received.

                <br><br>

                Price:
                <strong>${price}</strong>

                <br><br>

                We will contact you shortly to
                confirm your reservation.

            `;


        reservationMessage.classList.add(
            "show"
        );


        reservationMessage.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }
);