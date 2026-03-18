let homeRect;
const iconSize = 68;

let iconsPerCol;

let row = 0;
let col = 0;

function init() {
    homeRect = document.querySelector(".home").getBoundingClientRect();
    iconsPerCol = Math.floor(homeRect.height / iconSize);

    // for arranged so it will arrange in grid fills col first
    document.querySelectorAll('.homeIcons').forEach((element) => {

        const rect = element.getBoundingClientRect();
        element.style.position = 'absolute';
        element.style.left = (col * iconSize) + 'px';
        element.style.top = (row * iconSize) + 'px';

        row++;
        if (row >= iconsPerCol) {
            row = 0;
            col++;
        }

        const beforeElement = document.createElement('div');
        beforeElement.style.width = rect.width + 'px';
        beforeElement.style.height = rect.height + 'px';
        beforeElement.style.visibility = "hidden";

        element.parentNode.insertBefore(beforeElement, element);

        element.addEventListener('click', (event) => {
            event.stopPropagation();
            document.querySelectorAll('.homeIcons').forEach((element) => {
                element.style.filter = '';
            })
            element.style.filter = 'invert(1)';
        })
        dragElement(element)
    });

    // for the feel of clicking the icons so color changes points out that i clciked it
    document.body.addEventListener('click', (e) => {
        if (!e.target.closest('.homeIcons')) {
            document.querySelectorAll('.homeIcons').forEach((element) => {
                element.style.filter = '';
            })
        }
    });

    //when window loads in DOM i set it out to center
    document.querySelectorAll(".window").forEach(win => {

        win.style.visibility = "hidden";
        win.style.display = "block";

        win.style.top = (window.innerHeight / 2) - (win.offsetHeight / 2) + 'px';
        win.style.left = (window.innerWidth / 2) - (win.offsetWidth / 2) + 'px';

        win.style.visibility = "";
        win.style.display = "none";
        dragElementWindows(win);
    });

    // to resize the window to either full or the default one
    document.querySelectorAll(".resize").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const win = e.target.closest(".window");

            if (win.dataset.full === "true") {
                win.style.width = win.dataset.width;
                win.style.height = win.dataset.height;
                win.style.top = win.dataset.top;
                win.style.left = win.dataset.left;

                win.dataset.full = "false";

                win.style.margin = '';
            } else {
                win.dataset.width = win.style.width;
                win.dataset.height = win.style.height;
                win.dataset.top = win.style.top;
                win.dataset.left = win.style.left;

                win.style.width = homeRect.width + 'px';
                win.style.height = homeRect.height + 'px';
                win.style.top = homeRect.top + 'px';
                win.style.left = homeRect.left + 'px';

                win.dataset.full = "true";

                win.style.margin = '0';
            }
        });

        // to make all close buttons works to close the window
        document.querySelectorAll(".close").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const win = e.target.closest(".window");
                win.style.display = "none";
                win.style.top = win.dataset.top;
                win.style.left = win.dataset.left;
                win.style.width = win.dataset.width;
                win.style.height = win.dataset.height;
            })
        });
    });

    // double clicking the window will open the window fixed pos but can drag around
    document.querySelectorAll(".homeIcons").forEach(btn => {
        btn.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            const windowId = btn.id.replace("-icon", "");

            const windowDiv = document.getElementById(windowId)
            if (windowDiv) {
                windowDiv.style.display = "block";
            }
        })
    });
}

function dragElementWindows(element) {
    // Step 2: Set up variables to keep track of the element's position.
    var initialX = 0;
    var initialY = 0;
    var currentX = 0;
    var currentY = 0;
    console.log(element)

    // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
    function startDragging(e) {
        // e = e || window.event;
        if (e.target.closest('button')) return;

        e.preventDefault();
        // Step 7: Get the mouse cursor position at startup.
        initialX = e.clientX;
        initialY = e.clientY;

        element.style.margin = '0';
        // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
        document.onmouseup = stopDragging;
        document.onmousemove = dragging;
    }
    element.onmousedown = startDragging;

    // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
    function dragging(e) {
        e = e || window.event;
        e.preventDefault();

        const childRect = element.getBoundingClientRect();

        // Step 10: Calculate the new cursor position.
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;

        initialX = e.clientX;
        initialY = e.clientY;

        let newX = parseFloat(element.style.left) - currentX;
        let newY = parseFloat(element.style.top) - currentY;

        newX = Math.max(0, Math.min(newX, window.innerWidth - childRect.width));
        newY = Math.max(homeRect.top, Math.min(newY, window.innerHeight - childRect.height));

        // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
        element.style.position = 'absolute';
        element.style.top = (newY) + "px";
        element.style.left = (newX) + "px";

        if (element.dataset.dragging === '') {
            element.style.margin = '0';

            const rect = element.getBoundingClientRect();
            element.style.left = rect.left + 'px';
            element.style.top = rect.top + 'px';
            element.dataset.dragging = 'true';
        }
    }

    // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
    function stopDragging() {
        element.dataset.dragging = '';
        document.onmouseup = null;
        document.onmousemove = null;

    }
};

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
    // Step 2: Set up variables to keep track of the element's position.
    var initialX = 0;
    var initialY = 0;
    var currentX = 0;
    var currentY = 0;
    console.log(element)

    // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
    function startDragging(e) {
        // e = e || window.event;
        e.preventDefault();
        // Step 7: Get the mouse cursor position at startup.
        initialX = e.clientX;
        initialY = e.clientY;
        // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
        document.onmouseup = stopDragging;
        document.onmousemove = dragging;
    }
    element.onmousedown = startDragging;

    // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
    function dragging(e) {
        e = e || window.event;
        e.preventDefault();

        const parentRect = document.querySelector(".home").getBoundingClientRect();
        const childRect = element.getBoundingClientRect();

        console.log('parentRect:', parentRect);
        console.log('childRect:', childRect);
        console.log('Y range:', parentRect.top, '→', parentRect.bottom - childRect.height);

        // Step 10: Calculate the new cursor position.
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;

        initialX = e.clientX;
        initialY = e.clientY;

        let newX = parseFloat(element.style.left) - currentX;
        let newY = parseFloat(element.style.top) - currentY;

        newX = Math.max(0, Math.min(newX, parentRect.width - childRect.width));
        newY = Math.max(0, Math.min(newY, parentRect.height - childRect.height));

        // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
        element.style.filter = 'invert(1)';
        element.style.position = 'absolute';
        element.style.top = (newY) + "px";
        element.style.left = (newX) + "px";
    }

    // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
    function stopDragging() {
        element.style.filter = '';
        document.onmouseup = null;
        document.onmousemove = null;
    }
};


function updateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById("clock").textContent = time;
};

updateTime();
setInterval(updateTime, 1000);


// animation made so when the page loads it plays it 

const happyMac = document.querySelector(".mac-alone");
const welcome = document.querySelector(".welcome-animation");
const parentForAnimation = document.querySelector(".loading-animation");

function fadeIn(element, duration = 500) {
    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = '1';
}

function fadeOut(element, duration = 500, onDone) {
    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = '0';
    element.addEventListener('transitionend', () => {
        if (onDone) {
            onDone();
        }
    }, { once: true });

}

function playLoadingAnimationOnce() {
    happyMac.style.opacity = '0';

    fadeIn(happyMac, 1500);

    setTimeout(() => {
        fadeOut(happyMac, 1500, () => {
            happyMac.style.display = 'none';

            welcome.style.display = 'flex';
            welcome.style.opacity = '0';
            fadeIn(welcome, 1500);

            setTimeout(() => {
                fadeOut(welcome, 1500, () => {
                    welcome.style.display = 'none';
                    parentForAnimation.style.display = "none";
                    document.querySelector(".after-loading").style.display = "flex";
                    init();
                });
            }, 1500);
        });
    }, 1500);
}

playLoadingAnimationOnce();