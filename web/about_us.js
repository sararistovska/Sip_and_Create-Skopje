/* hero naslovot se trga*/

const aboutText = document.querySelector(".about-text");
const UNPIN_START = 450;
const SPEED = 0.8;

window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const offset = scrolled > UNPIN_START ? (scrolled - UNPIN_START) * SPEED : 0;
    aboutText.style.transform = `translate3d(0, -${offset}px, 0)`;
}, { passive: true });


/* scroll reveal */

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => {
    revealObserver.observe(element);
});


/* rabotilnici: videoto i tekstot go sledat elementot najblisku do sredinata na ekranot */

const workshopItems = document.querySelectorAll(".workshop-item");
const workshopImgs = document.querySelectorAll(".workshop-img");

function updateWorkshops() {
    const viewportCenter = window.innerHeight / 2;
    let closestIdx = workshopItems[0].dataset.index;
    let closestDist = Infinity;

    workshopItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        if (dist < closestDist) {
            closestDist = dist;
            closestIdx = item.dataset.index;
        }
    });

    workshopItems.forEach(i => i.classList.toggle("active", i.dataset.index === closestIdx));
    workshopImgs.forEach(im => im.classList.toggle("active", im.dataset.index === closestIdx));
}

window.addEventListener("scroll", updateWorkshops, { passive: true });
window.addEventListener("resize", updateWorkshops);
updateWorkshops();


/* timot: klik na kartichka ja vrti */

document.querySelectorAll(".team-card[data-flip]").forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("flipped");
    });
});


/* kako rabotime: patekata so skrolanje */

const pathBox = document.querySelector(".path");
const pathSvg = pathBox.querySelector(".path-svg");
const pathTrack = pathBox.querySelector(".path-track");
const pathFill = pathBox.querySelector(".path-fill");
const pathDot = pathBox.querySelector(".path-dot");
const pathHalo = pathBox.querySelector(".path-dot-halo");
const pathSteps = pathBox.querySelectorAll(".path-step");

let pathLen = 0;
let pathPts = [];

// crta kriva linija niz sredinata na sekoj krug
function buildPath() {
    const w = pathBox.offsetWidth;
    const h = pathBox.offsetHeight;

    pathSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    pathPts = Array.from(pathSteps).map(step => {
        const c = step.querySelector(".path-circle");
        return {
            x: step.offsetLeft + c.offsetLeft + c.offsetWidth / 2,
            y: step.offsetTop + c.offsetTop + c.offsetHeight / 2
        };
    });

    let d = `M ${pathPts[0].x} 0 L ${pathPts[0].x} ${pathPts[0].y}`;

    for (let i = 1; i < pathPts.length; i++) {
        const a = pathPts[i - 1];
        const b = pathPts[i];
        const k = (b.y - a.y) * 0.6;
        d += ` C ${a.x} ${a.y + k}, ${b.x} ${b.y - k}, ${b.x} ${b.y}`;
    }

    const last = pathPts[pathPts.length - 1];
    d += ` L ${last.x} ${h}`;

    pathTrack.setAttribute("d", d);
    pathFill.setAttribute("d", d);

    pathLen = pathFill.getTotalLength();
    pathFill.style.strokeDasharray = pathLen;

    updatePath();
}

// ja crta linijata do sredinata na ekranot i ja pomestuva svetlechkata tochka
function updatePath() {
    if (!pathLen) return;

    const rect = pathBox.getBoundingClientRect();
    const line = window.innerHeight * 0.55 - rect.top;
    const target = Math.max(0, Math.min(pathBox.offsetHeight, line));

    // ja naogja tochkata na patekata na visinata "target"
    let lo = 0;
    let hi = pathLen;
    for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2;
        if (pathFill.getPointAtLength(mid).y < target) lo = mid;
        else hi = mid;
    }

    pathFill.style.strokeDashoffset = pathLen - lo;

    const p = pathFill.getPointAtLength(lo);
    [pathDot, pathHalo].forEach(dot => {
        dot.setAttribute("cx", p.x);
        dot.setAttribute("cy", p.y);
        dot.style.opacity = line > 0 && line < pathBox.offsetHeight ? 1 : 0;
    });

    pathSteps.forEach((step, i) => {
        step.classList.toggle("active", line >= pathPts[i].y);
    });
}

// chekorite se pojavuvaat koga ke vlezat na ekranot
const stepObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in");
            stepObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

pathSteps.forEach(step => stepObserver.observe(step));

window.addEventListener("scroll", updatePath, { passive: true });

if (window.ResizeObserver) {
    new ResizeObserver(buildPath).observe(pathBox);   // promena na goleminata, vchituvanje na slikite, promena na jazik
}
window.addEventListener("load", buildPath);
buildPath();