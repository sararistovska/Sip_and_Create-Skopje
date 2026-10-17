/* scroll reveal */

const revealElements =
    document.querySelectorAll(".reveal");

const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});



/* pasta tabs */

const pastaTabs =
    document.querySelectorAll(".pasta-tab");

const pastaPanels =
    document.querySelectorAll(".pasta-panel");


pastaTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        const target =
            tab.dataset.pasta;


        pastaTabs.forEach(item => {

            item.classList.remove("active");

        });


        pastaPanels.forEach(panel => {

            panel.classList.remove("active");

        });


        tab.classList.add("active");


        const targetPanel =
            document.getElementById(target);


        if (targetPanel) {

            targetPanel.classList.add("active");

            targetPanel
                .querySelectorAll(".reveal")
                .forEach(element => {

                    element.classList.add("visible");

                });

        }

    });

});



/* video play */

const videoCircles =
    document.querySelectorAll(
        ".recipe-video-circle"
    );


videoCircles.forEach(circle => {

    const video =
        circle.querySelector("video");


    circle.addEventListener("click", () => {

        if (video.paused) {

            video.play();

            circle.classList.add("playing");

        } else {

            video.pause();

            circle.classList.remove("playing");

        }

    });


    video.addEventListener("ended", () => {

        circle.classList.remove("playing");

    });

});
