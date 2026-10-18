const revealElements =
    document.querySelectorAll(".reveal");

const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);
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


/*  horizontalen akordeon*/

const steps =
    document.querySelectorAll(".step");

function setStep(activeStep) {

    steps.forEach(step => {

        const isActive = step === activeStep;

        step.classList.toggle("active", isActive);

        step.setAttribute("aria-expanded", String(isActive));
    });
}

steps.forEach(step => {

    step.addEventListener("pointerenter", event => {

        if (event.pointerType === "mouse") {
            setStep(step);
        }
    });

    step.addEventListener("click", () => {
        setStep(step);
    });

    step.addEventListener("focus", () => {
        setStep(step);
    });
});


/* infinite lenta  */

const atmoStrip =
    document.getElementById("atmoStrip");

const atmoTrack =
    document.getElementById("atmoTrack");

if (atmoStrip && atmoTrack) {

    const STRIP_SPEED = 60; // pikseli vo sekunda

    /* vtora kopija na slikite za da nema prekin vo krugot */
    Array.from(atmoTrack.children).forEach(item => {

        const clone = item.cloneNode(true);

        clone.setAttribute("aria-hidden", "true");

        clone.querySelectorAll("img").forEach(img => img.alt = "");

        atmoTrack.appendChild(clone);
    });

    /* ista brzina na sekoj ekran: traenjeto zavisi od shirinata na lentata */
    function setStripDuration() {

        const loopWidth = atmoTrack.scrollWidth / 2;

        atmoTrack.style.setProperty(
            "--strip-duration",
            (loopWidth / STRIP_SPEED) + "s"
        );
    }

    setStripDuration();

    window.addEventListener("load", setStripDuration);
    window.addEventListener("resize", setStripDuration);

    /* bez animacija koga lentata ne se gleda */
    new IntersectionObserver(entries => {
        atmoTrack.style.animationPlayState =
            entries[0].isIntersecting ? "" : "paused";
    }).observe(atmoStrip);
}


/* otkrivanje na chinijata so boja */

const plateArea   = document.getElementById("plateArea");
const plate       = document.getElementById("plate");
const disc        = document.querySelector(".plate-disc");
const painted     = document.getElementById("platePainted");
const splashField = document.getElementById("splashField");

//se otkriva preku maska
const paintCanvas = document.createElement("canvas");
paintCanvas.className = "paint-canvas";
disc.appendChild(paintCanvas);

const paintCtx = paintCanvas.getContext("2d");
const maskCanvas = document.createElement("canvas");
const maskCtx = maskCanvas.getContext("2d");

const SPLASH_COLORS = [
    "#315B78", "#4d7ba3", "#D47752", "#e8a370", "#8E7CC3"
];

const BRUSH_SIZE = 82;
const MIN_BRUSH_GAP = 7;
const LEAVE_DELAY = 420;
const FADE_DURATION = 650;

let lastPoint = null;
let pendingPoint = null;
let rafQueued = false;
let leaveTimer = null;
let fadeTimer = null;
let paintedVisible = false;

function resizeCanvases(){
    const rect = disc.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    [paintCanvas, maskCanvas].forEach(canvas => {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
    });

    paintCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    maskCtx.clearRect(0, 0, rect.width, rect.height);
    paintCtx.clearRect(0, 0, rect.width, rect.height);

    paintedVisible = false;
    lastPoint = null;
}

function getPoint(e){
    const rect = disc.getBoundingClientRect();
    return {
        x:e.clientX - rect.left,
        y:e.clientY - rect.top
    };
}

function paintStroke(x, y, previous){
    const brush = BRUSH_SIZE + Math.random() * 18 - 9;

    maskCtx.save();
    maskCtx.fillStyle = "white";
    maskCtx.strokeStyle = "white";
    maskCtx.lineCap = "round";
    maskCtx.lineJoin = "round";

    // ja povrzuva prethodnata tochka za da izgleda kako vistinski potez na chetka
    if(previous){
        maskCtx.lineWidth = brush;
        maskCtx.beginPath();
        maskCtx.moveTo(previous.x, previous.y);
        maskCtx.lineTo(x, y);
        maskCtx.stroke();
    }

    // neramni rabovi na chetkata
    for(let i = 0; i < 8; i++){
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * brush * .30;

        const bx = x + Math.cos(angle) * distance;
        const by = y + Math.sin(angle) * distance;

        const radius = brush * (.20 + Math.random() * .24);

        maskCtx.beginPath();
        maskCtx.ellipse(
            bx,
            by,
            radius * (1 + Math.random() * .35),
            radius * (.70 + Math.random() * .45),
            Math.random() * Math.PI,
            0,
            Math.PI * 2
        );
        maskCtx.fill();
    }

    maskCtx.restore();

    // ja stava obojenata slika odgore i go ostava samo delot pod maskata
    const rect = disc.getBoundingClientRect();

    paintCtx.clearRect(0, 0, rect.width, rect.height);
    paintCtx.drawImage(painted, 0, 0, rect.width, rect.height);

    paintCtx.globalCompositeOperation = "destination-in";
    paintCtx.drawImage(maskCanvas, 0, 0, rect.width, rect.height);
    paintCtx.globalCompositeOperation = "source-over";

    paintedVisible = true;
}

function distance(a,b){
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function spawnSplashes(x, y){
    const count = 5 + Math.floor(Math.random() * 4);

    for(let i = 0; i < count; i++){
        const dot = document.createElement("span");
        dot.className = "splash-dot" + (Math.random() > .72 ? " big" : "");

        const angle = Math.random() * Math.PI * 2;
        const dist = 20 + Math.random() * 62;
        const size = 3 + Math.random() * 8;

        dot.style.left = x + "px";
        dot.style.top = y + "px";
        dot.style.width = size + "px";
        dot.style.height = size * (.65 + Math.random() * .7) + "px";
        dot.style.background =
            SPLASH_COLORS[Math.floor(Math.random() * SPLASH_COLORS.length)];

        dot.style.setProperty("--dx", Math.cos(angle) * dist + "px");
        dot.style.setProperty("--dy", Math.sin(angle) * dist + "px");
        dot.style.setProperty("--rot", (Math.random() * 120 - 60) + "deg");

        splashField.appendChild(dot);
        dot.addEventListener("animationend", () => dot.remove());
    }
}

function addPaintFlash(x, y){
    const flash = document.createElement("span");
    flash.className = "paint-flash";
    flash.style.left = x + "px";
    flash.style.top = y + "px";
    splashField.appendChild(flash);
    flash.addEventListener("animationend", () => flash.remove());
}

function handleMove(){
    rafQueued = false;
    if(!pendingPoint) return;

    const p = pendingPoint;

    if(!lastPoint || distance(lastPoint, p) >= MIN_BRUSH_GAP){
        paintStroke(p.x, p.y, lastPoint);

        if(!lastPoint || distance(lastPoint, p) > 16){
            spawnSplashes(p.x, p.y);
        }

        if(!lastPoint){
            addPaintFlash(p.x, p.y);
        }

        lastPoint = p;
    }
}

function onPointerMove(e){
    plateArea.classList.add("is-busy");

    clearTimeout(leaveTimer);
    clearTimeout(fadeTimer);

    paintCanvas.style.transition = "";
    paintCanvas.style.opacity = "1";

    pendingPoint = getPoint(e);

    if(!rafQueued){
        rafQueued = true;
        requestAnimationFrame(handleMove);
    }
}

function fadePaint(){
    paintCanvas.style.transition =
        `opacity ${FADE_DURATION}ms ease`;
    paintCanvas.style.opacity = "0";

    fadeTimer = setTimeout(() => {
        const rect = disc.getBoundingClientRect();

        paintCtx.clearRect(0, 0, rect.width, rect.height);
        maskCtx.clearRect(0, 0, rect.width, rect.height);

        paintCanvas.style.transition = "";
        paintCanvas.style.opacity = "1";

        lastPoint = null;
        pendingPoint = null;
        paintedVisible = false;
        plateArea.classList.remove("is-busy");
    }, FADE_DURATION);
}

function onPointerLeave(){
    clearTimeout(leaveTimer);

    leaveTimer = setTimeout(() => {
        if(paintedVisible){
            fadePaint();
        }else{
            plateArea.classList.remove("is-busy");
        }
    }, LEAVE_DELAY);
}

plate.addEventListener("pointermove", onPointerMove);
plate.addEventListener("pointerleave", onPointerLeave);
plate.addEventListener("pointercancel", onPointerLeave);

// poddrshka za dopir
plate.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if(t){
        onPointerMove({
            clientX:t.clientX,
            clientY:t.clientY
        });
    }
}, {passive:true});

plate.addEventListener("touchend", onPointerLeave);

window.addEventListener("resize", resizeCanvases);
painted.addEventListener("load", resizeCanvases);
resizeCanvases();
