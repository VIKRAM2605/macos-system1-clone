let homeRect;
const iconSize = 68;

let iconsPerCol;

let row = 0;
let col = 0;

let activeWindows = [];
let files = [];

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

        const fileId = element.id.replace("-icon", "");
        const label = element.querySelector("#label").textContent;
        const imgSrc = element.querySelector("img").src;

        files.push({ id: fileId, label: label, iconSrc: imgSrc });

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
        win.style.setProperty('display', 'block', 'important');

        win.style.top = (window.innerHeight / 2) - (win.offsetHeight / 2) + 'px';
        win.style.left = (window.innerWidth / 2) - (win.offsetWidth / 2) + 'px';

        win.style.visibility = "";
        win.style.setProperty('display', 'none', 'important');
        dragElementWindows(win);
    });
    //to make click move the window top above all other window
    document.querySelectorAll(".window").forEach(win => {
        win.addEventListener("click", (e) => {
            if (win.style.display !== 'none') {
                bringWindowToTop(win.id);
            }
        })
    })

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

                win.style.margin = '0';
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
    });
    // to make all close buttons works to close the window
    document.querySelectorAll(".close").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const win = e.target.closest(".window");
            win.style.setProperty('display', 'none', 'important');
            if (win.dataset.top) {
                win.style.top = win.dataset.top;
                win.style.left = win.dataset.left;
                win.style.width = win.dataset.width;
                win.style.height = win.dataset.height;
            }
            activeWindows = activeWindows.filter(id => id !== win.id);
        })
    });
    // to make cancel m=btn close the window
    document.querySelectorAll("#cancel").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let win = e.target.closest(".window");
            if (win) {
                win.style.setProperty('display', 'none', 'important');
                activeWindows = activeWindows.filter(id => id !== win.id);
                return;
            }
            win = e.target.closest(".alert-box");
            if (win) {
                win.style.setProperty('display', 'none', 'important');
                activeWindows = activeWindows.filter(id => id !== win.id);
                return;
            }
        })
    })

    // to make submit btn works when clicked
    document.querySelector('#create').addEventListener("click", (e) => {
        const input = document.getElementById("file-create");
        let value = input.value;

        input.value = "";

        if (value.trim() === "") {
            const content = document.getElementById("alert-text");
            content.textContent = "Sorry, enter some NAME to create a file.";

            const alertBox = document.querySelector(".alert-box");
            alertBox.style.visibility = "hidden";
            alertBox.style.setProperty('display', 'block', 'important');
            alertBox.style.left = (window.innerWidth / 2) - (alertBox.offsetWidth / 2) + 'px';
            alertBox.style.top = (window.innerHeight / 2) - (alertBox.offsetHeight / 2) + 'px';
            alertBox.style.zIndex = "2000";

            alertBox.style.visibility = "";

        } else {
            document.querySelector("#create").closest(".window").style.setProperty('display', 'none', 'important');

            console.log(value);

            createIcons("read-file-icon", "assets/icons/hypercard.svg", value)

        }
    });

    //ok button to work for alert box
    document.querySelector("#alert-okay").addEventListener('click', (e) => {
        const alertBox = document.querySelector(".alert-box");
        alertBox.style.setProperty('display', 'none', 'important');
    })

    // double clicking the window will open the window fixed pos but can drag around
    document.querySelectorAll(".homeIcons").forEach(btn => {
        btn.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            const windowId = btn.id.replace("-icon", "");

            const windowDiv = document.getElementById(windowId)
            if (windowDiv) {
                const displayMode = windowDiv.id === 'read-file' ? 'flex' : 'block';
                windowDiv.style.setProperty('display', displayMode, 'important');
                windowDiv.style.margin = '0';
                const id = activeWindows.indexOf(windowId);
                if (id === -1) activeWindows.push(windowId);

                bringWindowToTop(windowId);
            }
            console.log(activeWindows);
        })
    });
}

function dragElementWindows(element) {
    // Step 2: Set up variables to keep track of the element's position.
    var initialX = 0;
    var initialY = 0;
    var currentX = 0;
    var currentY = 0;
    //console.log(element)

    // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
    function startDragging(e) {
        // e = e || window.event;
        if (e.target.closest('button')) return;
        if (e.target.closest('input')) return;
        if (e.target.closest(".window-pane")) return;

        e.preventDefault();
        // Step 7: Get the mouse cursor position at startup.

        const rect = element.getBoundingClientRect();
        element.style.top = rect.top + 'px';
        element.style.left = rect.left + 'px';
        element.style.margin = "0";

        initialX = e.clientX;
        initialY = e.clientY;

        element.style.margin = '0';
        // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
        bringWindowToTop(element.id);

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
    //console.log(element)

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

    fadeIn(happyMac, 100);

    setTimeout(() => {
        fadeOut(happyMac, 100, () => {
            happyMac.style.setProperty('display', 'none', 'important');

            welcome.style.setProperty('display', 'flex', 'important');
            welcome.style.opacity = '0';
            fadeIn(welcome, 100);

            setTimeout(() => {
                fadeOut(welcome, 100, () => {
                    welcome.style.setProperty('display', 'none', 'important');
                    parentForAnimation.style.setProperty('display', 'none', 'important');
                    document.querySelector(".after-loading").style.setProperty('display', 'flex', 'important');
                    init();
                });
            }, 100);
        });
    }, 100);
}

playLoadingAnimationOnce();

document.getElementById("open").addEventListener('click', (e) => {
    const win = document.getElementById("open-folder");
    win.style.setProperty('display', 'block', 'important');

    const fileList = document.getElementById("file-list");
    fileList.innerHTML = "";

    bringWindowToTop("open-folder");

    files.forEach(file => {
        const item = document.createElement("div");
        item.className = "flex items-center gap-2 cursor-pointer px-1";
        item.innerHTML = `
            <img src = "${file.iconSrc}" width = "16" height="16"/>
            <sapn class= "text-sm!"> ${file.label}</span>         
        `
        item.addEventListener("dblclick", (e) => {
            const win = document.getElementById(file.id);
            if (win) {
                win.style.setProperty("display", "block", "important");
                const id = activeWindows.indexOf(file.id);
                if (id === -1) activeWindows.push(file.id);
                bringWindowToTop(file.id);
            }
        })
        fileList.appendChild(item);
    })

    document.activeElement.blur();
});

document.getElementById("new").addEventListener('click', (e) => {
    const win = document.getElementById("new-folder");
    win.style.setProperty('display', 'block', 'important');

    document.activeElement.blur();

    bringWindowToTop("new-folder");

    win.style.top = (window.innerHeight / 2) - (win.offsetHeight / 2) + 'px';
    win.style.left = (window.innerWidth / 2) - (win.offsetWidth / 2) + 'px';

});

function createIcons(id, iconSrc, label) {
    const div = document.createElement("div");
    div.id = id;
    div.className = "homeIcons";

    div.innerHTML = `
    <div>
        <img src="${iconSrc}" alt ="${label}" width="24" height="24" draggable="false"/>
    </div>
    <div>
        <p class="text-sm! w-fit font-normal bg-white text-black">${label}</p>
    </div>  
    `;
    document.querySelector(".home").appendChild(div);

    const idFile = id.replace("-icon", "");

    files.push({ id: idFile, label: label, iconSrc: iconSrc });

    div.style.position = "absolute";
    div.style.left = (col * iconSize) + "px";
    div.style.top = (row * iconSize) + "px";

    row++;

    if (row >= iconsPerCol) {
        row = 0;
        col++;
    }

    div.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll(".homeIcons").forEach(icon => icon.style.filter = '');

        div.style.filter = "invert(1)";
    })

    dragElement(div);

    div.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const winId = id.replace("-icon", "");
        const win = document.getElementById(winId);
        if (win) {
            const displayMode = win.id === 'read-file' ? 'flex' : 'block';
            win.style.setProperty('display', displayMode, 'important');
            win.style.margin = '0';
            const title = win.querySelector(".title");
            if (title) title.textContent = label;

            const panel = win.querySelector(".window-pane");
            if (panel) panel.contentEditable = "true";
            panel.focus();

            const idThere = activeWindows.indexOf(winId);
            if (idThere === -1) activeWindows.push(winId);
            bringWindowToTop(winId);
        }
        console.log(activeWindows);
    });
}

//to close current specific window from nav bar
document.getElementById("close-win").addEventListener("click", (e) => {
    e.stopPropagation();
    const lastWinId = activeWindows.pop();
    if (lastWinId) {
        const lastWinDiv = document.getElementById(lastWinId);
        lastWinDiv.style.setProperty('display', 'none', 'important');
    }
    document.activeElement.blur();
})

//to close all specific windows from nav bar
document.getElementById("close-all-win").addEventListener("click", (e) => {
    e.stopPropagation();
    for (let i = 0; i < activeWindows.length; i++) {
        const win = document.getElementById(activeWindows[i]);
        if (win) win.style.setProperty('display', 'none', 'important');
    }
    activeWindows = [];
    document.activeElement.blur();
});

function bringWindowToTop(winId) {
    if (!winId) return;
    activeWindows = activeWindows.filter(id => id !== winId);
    activeWindows.push(winId);
    activeWindows.forEach((id, index) => {
        const win = document.getElementById(id);
        if (win) win.style.zIndex = (100 + index).toString();
    });
}

document.getElementById("open-open").addEventListener("click", (e) => {
    e.stopPropagation();
    const input = document.getElementById("open-input-field");
    const value = input.value.trim();

    if (value === "") {
        alertBox("Enter some File/Folder Name.");
        return;
    };

    const file = files.find(f => f.label === value);
    if (!file) {
        console.log("No file found with label:", value);
        alertBox("File not found. Check the name and try again.");
        return;
    }

    const win = document.getElementById(file.id);
    if (win) {
        win.style.setProperty("display", "block", "important");
        const index = activeWindows.indexOf(file.id);
        if (index === -1) activeWindows.push(file.id);
        bringWindowToTop(file.id);
        input.value = "";
    }
});

function alertBox(content) {

    const alertBox = document.querySelector(".alert-box");
    const alertText = alertBox.querySelector(".alert-text");

    alertText.textContent = content;

    alertBox.style.visibility = "hidden";
    alertBox.style.setProperty("display","block","important");
    alertBox.style.left = (window.innerWidth / 2) - (alertBox.offsetWidth / 2) + 'px';
    alertBox.style.top = (window.innerHeight / 2) - (alertBox.offsetHeight / 2) + 'px';

    alertBox.style.zIndex = '2000';

    alertBox.style.visibility = '';
}