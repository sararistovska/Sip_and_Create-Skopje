
const animatedElements =
    document.querySelectorAll(
        ".reveal, .zoom"
    );


const observer =
    new IntersectionObserver(

        function(entries) {

            entries.forEach(
                function(entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add("active");


                        observer
                            .unobserve(
                                entry.target
                            );

                    }

                }
            );

        },

        {
            threshold: 0.15
        }

    );


animatedElements.forEach(
    function(element) {

        observer.observe(element);

    }
);

const videos = document.querySelectorAll(".about-video");

if (videos.length > 1) {
    videos[1].playbackRate = 0.6;
}