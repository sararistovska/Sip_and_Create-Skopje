document.addEventListener('DOMContentLoaded', () => {

    /* Reveal animacii pri skrolanje */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });
        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }

    /* povtorno pustanje na animacijata so cetkata */
    const brush = document.querySelector('.paint-brush');
    const painted = document.querySelector('.glass-painted');
    const phrase = document.querySelector('.hero-phrase');

    function replay() {
        const targets = [
            brush,
            painted,
            phrase,
            ...document.querySelectorAll('.hero-copy > .kicker, .hero-copy > h1, .hero-copy > p, .hero-copy > .hero-actions')
        ].filter(Boolean);

        targets.forEach(el => {
            el.style.animation = 'none';
            void el.offsetWidth;
            el.style.animation = '';
        });
    }

    window.addEventListener('pageshow', () => {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) replay();
    });

    /*  Steps: paneli koi se otvaraat na hover  */
    const panels = document.querySelectorAll('.s10-panel');

    function openPanel(active) {
        panels.forEach(p => p.classList.toggle('on', p === active));
    }

    panels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            if (window.matchMedia('(hover:hover)').matches) openPanel(panel);
        });
        panel.addEventListener('focus', () => openPanel(panel));
        panel.addEventListener('click', () => openPanel(panel));
    });

    /* "Next" kopce za listanje  */
    const track = document.getElementById('d9Track');
    const next = document.getElementById('d9Next');

    if (track && next) {
        next.addEventListener('click', () => {
            const card = track.querySelector('.d9-card');
            if (!card) return;

            const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
            track.scrollTo({
                left: atEnd ? 0 : track.scrollLeft + card.offsetWidth,
                behavior: 'smooth'
            });
        });
    }

});