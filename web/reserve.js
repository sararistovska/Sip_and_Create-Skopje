const workshops = {

    4: {
        name: "Glass Painting",
        slug: "glass",
        time: "18:00",
        price: 1800
    },

    5: {
        name: "Pasta Making",
        slug: "pasta",
        time: "18:00",
        price: 1800
    },

    6: {
        name: "Ceramics Decorating",
        slug: "ceramics",
        time: "18:00",
        price: 1800
    },

    0: {
        name: "Crocheting",
        slug: "crochet",
        time: "12:00",
        price: 2000
    }

};


const calendarGrid =
    document.getElementById("calendarGrid");

const monthTitle =
    document.getElementById("monthTitle");

const previousMonth =
    document.getElementById("previousMonth");

const nextMonth =
    document.getElementById("nextMonth");


let currentDate = new Date();

currentDate.setHours(0, 0, 0, 0);


const monthNames = {
    en: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],

    mk: [
        "Јануари",
        "Февруари",
        "Март",
        "Април",
        "Мај",
        "Јуни",
        "Јули",
        "Август",
        "Септември",
        "Октомври",
        "Ноември",
        "Декември"
    ]
};



let calendarLanguage = localStorage.getItem("selectedLanguage") === "mk" ? "mk" : "en";

function getCalendarLanguage() {
    return calendarLanguage;
}


/* UPDATE CALENDAR WHEN LANGUAGE CHANGES */

document.querySelectorAll(".lang-button").forEach(button => {
    button.addEventListener("click", function () {
        calendarLanguage = this.dataset.lang === "mk" ? "mk" : "en";
        renderCalendar();
    });
});






function renderCalendar() {

    calendarGrid.innerHTML = "";


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const language = getCalendarLanguage();

    monthTitle.textContent =
        `${monthNames[language][month]} ${year}`;


    const firstDay =
        new Date(year, month, 1);


    const numberOfDays =
        new Date(year, month + 1, 0)
            .getDate();


    let startingDay =
        firstDay.getDay();

    startingDay =
        startingDay === 0
            ? 6
            : startingDay - 1;


    for (
        let i = 0;
        i < startingDay;
        i++
    ) {

        const emptyDay =
            document.createElement("div");

        emptyDay.className =
            "day empty";

        calendarGrid.appendChild(
            emptyDay
        );
    }


    const today =
        new Date();

    today.setHours(
        0, 0, 0, 0
    );


    for (
        let dayNumber = 1;
        dayNumber <= numberOfDays;
        dayNumber++
    ) {

        const date =
            new Date(
                year,
                month,
                dayNumber
            );


        const weekday =
            date.getDay();


        const dayElement =
            document.createElement("div");


        dayElement.classList.add(
            "day"
        );


        if (
            date.getTime() ===
            today.getTime()
        ) {

            dayElement.classList.add(
                "today"
            );
        }


        if (
            date < today
        ) {

            dayElement.classList.add(
                "past"
            );
        }


        const dayNumberElement =
            document.createElement("div");

        dayNumberElement.className =
            "day-number";

        dayNumberElement.textContent =
            dayNumber;


        dayElement.appendChild(
            dayNumberElement
        );


        if (
            workshops[weekday]
        ) {

            const workshop =
                workshops[weekday];


            dayElement.classList.add(
                workshop.slug
            );


            const dot =
                document.createElement("div");

            dot.className =
                "event-dot";


            dayElement.appendChild(
                dot
            );


            const eventName =
                document.createElement("div");

            eventName.className =
                "event-name";

            eventName.textContent =
                workshop.name;


            dayElement.appendChild(
                eventName
            );


        } else {



            dayElement.classList.add(
                "private"
            );

        }


        if (date < today) {



            dayElement.setAttribute("aria-disabled", "true");

            dayElement.style.pointerEvents = "none";

            dayElement.style.cursor = "default";

        } else {

            dayElement.addEventListener(
                "click",
                function () {

                    openReservation(
                        year,
                        month,
                        dayNumber,
                        weekday
                    );

                }
            );

        }


        calendarGrid.appendChild(
            dayElement
        );

    }

}



function openReservation(
    year,
    month,
    day,
    weekday
) {

    const formattedDate =
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


    const workshop =
        workshops[weekday];


    let url =
        "reserve-form.html";


    if (workshop) {

        url +=
            `?date=${encodeURIComponent(formattedDate)}` +
            `&workshop=${encodeURIComponent(workshop.name)}` +
            `&time=${encodeURIComponent(workshop.time)}` +
            `&price=${encodeURIComponent(workshop.price)}`;

    }

    else {

        url +=
            `?date=${encodeURIComponent(formattedDate)}`;
    }


    window.location.href = url;

}



previousMonth.addEventListener(
    "click",
    function () {

        currentDate.setDate(1);

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();

    }
);



nextMonth.addEventListener(
    "click",
    function () {

        currentDate.setDate(1);

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();

    }
);



document.querySelectorAll(".lang-button").forEach(
    button => {
        button.addEventListener("click", function () {
            renderCalendar();
        });
    }
);


renderCalendar();