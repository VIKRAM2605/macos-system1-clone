let homeRect;
const iconSize = 68;

let iconsPerCol;

const scale = 2;

let row = 0;
let col = 0;

let activeWindows = [];
let files =[];
let activeFolder;
const viewBtns =[
    document.getElementById("by-name"),
    document.getElementById("by-kind")
];
setActiveFolder(null);

let trashedFiles =[];

function init() {
    const homeEl = document.querySelector(".home");
    // Use offset properties to get the logical (unscaled) dimensions
    homeRect = {
        width: homeEl.offsetWidth,
        height: homeEl.offsetHeight,
        top: homeEl.offsetTop,
        left: homeEl.offsetLeft
    };
    
    iconsPerCol = Math.floor(homeRect.height / iconSize);

    // for arranged so it will arrange in grid fills col first
    document.querySelectorAll('.homeIcons').forEach((element) => {

        element.style.position = 'absolute';
        element.style.left = (col * iconSize) + 'px';
        element.style.top = (row * iconSize) + 'px';

        row++;
        if (row >= iconsPerCol) {
            row = 0;
            col++;
        }

        const beforeElement = document.createElement('div');
        beforeElement.style.width = element.offsetWidth + 'px';
        beforeElement.style.height = element.offsetHeight + 'px';
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

        const labelP = element.querySelector("p");
        labelP.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            alertBox("You Can't 'Rename' this Folder/File");
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

        win.style.top = (window.innerHeight / scale / 2) - (win.offsetHeight / 2) + 'px';
        win.style.left = (window.innerWidth / scale / 2) - (win.offsetWidth / 2) + 'px';

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
            updateDeleteBtn();
            updatePrintBtn();
            if (activeFolder === win.id) setActiveFolder(null);
        })
    });

    // to make cancel m=btn close the window
    document.querySelectorAll("#cancel").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let win = e.target.closest(".window");
            if (win) {
                win.style.setProperty('display', 'none', 'important');
                activeWindows = activeWindows.filter(id => id !== win.id);
                updateDeleteBtn();
                updatePrintBtn();
                return;
            }
            win = e.target.closest(".alert-box");
            if (win) {
                win.style.setProperty('display', 'none', 'important');
                activeWindows = activeWindows.filter(id => id !== win.id);
                updateDeleteBtn();
                updatePrintBtn();
                return;
            }
            win = e.target.closest(".modal-dialog");
            if (win) {
                win.style.setProperty("display", "none", "important");
                activeWindows = activeWindows.filter(id => id !== win.id);
                printFile = null;
                updateDeleteBtn();
                updatePrintBtn();
            }
        })
    })

    // to make submit btn works when clicked
    document.querySelector('#create').addEventListener("click", (e) => {
        const input = document.getElementById("file-create");
        let value = input.value.trim();

        if (value === "") {
            alertBox("Sorry, Enter Some 'File Name' To Create a File");
            input.value = "";
            return;
        }

        const fileExistingCheck = files.find(file => file.id === `${value}-file`);
        if (fileExistingCheck) {
            alertBox("File Already Exists.");
            input.value = "";
            return;
        }

        input.value = "";
        createIcons(`${value}-file-icon`, "assets/icons/hypercard.svg", value);
        createWindow(`${value}-file`, value, "true");
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
                const displayMode = windowDiv.id.includes("-file") ? 'flex' : 'block';
                windowDiv.style.setProperty('display', displayMode, 'important');
                windowDiv.style.margin = '0';
                const id = activeWindows.indexOf(windowId);
                if (id === -1) activeWindows.push(windowId);
                updateDeleteBtn();
                updatePrintBtn();
                if (displayMode === "flex") {
                    setActiveFolder(null);
                } else {
                    setActiveFolder(windowId);
                }

                bringWindowToTop(windowId);
            }
            console.log(activeWindows);
        })
    });

    createIcons("demo-file-icon", "assets/icons/hypercard.svg", "demo");
    createWindow("demo-file", "demo", "false");

    const demoPane = document.getElementById("demo-file").querySelector(".window-pane");
    demoPane.innerHTML = `
    <p><strong>Welcome to System 1</strong></p>
    <br>
    <p>◦ Double-click an icon to open it</p>
    <p>◦ Drag icons to move them around</p>
    <p>◦ Drag an icon onto Trash to delete it</p>
    <p>◦ Double-click Trash to restore files</p>
    <p>◦ Double-click an icon label to rename it</p>
    <p>◦ Use File → New File to create a new file</p>
    <p>◦ Use File → Open to open a file by name</p>
    <p>◦ Use View → By Name / By Kind to sort</p>
    <p>◦ Use File → Print to print the active file</p>
    <p>◦ Use File → Delete to trash the active file</p>
    <p>◦ Don't drag the System folder into Trash...</p>
`;

    const demoWin = document.getElementById("demo-file");
    demoWin.style.setProperty("display", "flex", "important");
    const demoIdx = activeWindows.indexOf("demo-file");
    if (demoIdx === -1) activeWindows.push("demo-file");
    bringWindowToTop("demo-file");
}

function dragElementWindows(element) {
    var initialX = 0;
    var initialY = 0;
    var currentX = 0;
    var currentY = 0;

    function startDragging(e) {
        if (e.target.closest('button')) return;
        if (e.target.closest('input')) return;
        if (e.target.closest(".window-pane")) return;

        e.preventDefault();

        // Use unscaled offset properties to prevent jumps
        element.style.top = element.offsetTop + 'px';
        element.style.left = element.offsetLeft + 'px';
        element.style.margin = "0";

        initialX = e.clientX;
        initialY = e.clientY;

        bringWindowToTop(element.id);

        document.onmouseup = stopDragging;
        document.onmousemove = dragging;
    }
    element.onmousedown = startDragging;

    function dragging(e) {
        e = e || window.event;
        e.preventDefault();

        // Divide cursor calculations by 'scale' so dragging feels perfect
        currentX = (initialX - e.clientX) / scale;
        currentY = (initialY - e.clientY) / scale;

        initialX = e.clientX;
        initialY = e.clientY;

        let newX = parseFloat(element.style.left || 0) - currentX;
        let newY = parseFloat(element.style.top || 0) - currentY;

        // Constraint rules inside unscaled viewport bounds
        const navHeight = document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 0;
        newX = Math.max(0, Math.min(newX, (window.innerWidth / scale) - element.offsetWidth));
        newY = Math.max(navHeight, Math.min(newY, (window.innerHeight / scale) - element.offsetHeight));

        element.style.position = 'absolute';
        element.style.top = newY + "px";
        element.style.left = newX + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
};


function dragElement(element) {
    var initialX = 0;
    var initialY = 0;
    var currentX = 0;
    var currentY = 0;
    var originalLeft = 0;
    var originalTop = 0;

    function startDragging(e) {
        e.preventDefault();

        originalLeft = element.style.left;
        originalTop = element.style.top;

        initialX = e.clientX;
        initialY = e.clientY;
        
        document.onmouseup = stopDragging;
        document.onmousemove = dragging;
    }
    element.onmousedown = startDragging;

    function dragging(e) {
        e = e || window.event;
        e.preventDefault();

        const parent = document.querySelector(".home");

        // Scale constraint calculations
        currentX = (initialX - e.clientX) / scale;
        currentY = (initialY - e.clientY) / scale;

        initialX = e.clientX;
        initialY = e.clientY;

        let newX = parseFloat(element.style.left || 0) - currentX;
        let newY = parseFloat(element.style.top || 0) - currentY;

        // Restrict drag inside unscaled viewport boundary
        newX = Math.max(0, Math.min(newX, parent.offsetWidth - element.offsetWidth));
        newY = Math.max(0, Math.min(newY, parent.offsetHeight - element.offsetHeight));

        element.style.filter = 'invert(1)';
        element.style.position = 'absolute';
        element.style.top = newY + "px";
        element.style.left = newX + "px";
    }

    async function stopDragging() {
        element.style.filter = '';
        document.onmouseup = null;
        document.onmousemove = null;

        // getBoundingClientRect is perfectly fine here strictly for collisions!
        const trashRect = document.querySelector("#trash-folder-icon img").getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        let overLap = (
            elementRect.left < trashRect.right &&
            elementRect.right > trashRect.left &&
            elementRect.top < trashRect.bottom &&
            elementRect.bottom > trashRect.top
        );

        if (overLap && element.id !== "trash-folder-icon" && element.id !== "system-folder-icon") {
            trashFile(element.id);
            document.getElementById("trash-folder").style.setProperty("display", "none", "important");
            return
        } else if (overLap && element.id === "system-folder-icon") {
            alertBox("You Can't Delete System Folder. Something is going To happen");
            setTimeout(() => {
                window.close();
            }, 1500)
            element.style.left = originalLeft;
            element.style.top = originalTop;
            return;
        }

        document.querySelectorAll(".homeIcons").forEach(icon => {
            if (icon === element) return;

            const iconRect = icon.getBoundingClientRect();

            overLap = (
                elementRect.left < iconRect.right &&
                elementRect.right > iconRect.left &&
                elementRect.top < iconRect.bottom &&
                elementRect.bottom > iconRect.top
            )

            if (overLap) {
                element.style.left = originalLeft;
                element.style.top = originalTop;
            }
        })
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
            <span class= "text-sm!"> ${file.label}</span>         
        `
        item.addEventListener("dblclick", (e) => {
            const win = document.getElementById(file.id);
            if (win) {
                win.style.setProperty("display", "block", "important");
                const id = activeWindows.indexOf(file.id);
                if (id === -1) activeWindows.push(file.id);
                updateDeleteBtn();
                updatePrintBtn();
                bringWindowToTop(file.id);
                if (file.id.includes("-file")) {
                    setActiveFolder(null);
                } else {
                    setActiveFolder(file.id);
                }
            }
        })
        fileList.appendChild(item);
    })

    document.activeElement.blur();
});

document.getElementById("new-file").addEventListener('click', (e) => {
    const win = document.getElementById("new-folder");
    win.style.setProperty('display', 'block', 'important');

    document.activeElement.blur();

    bringWindowToTop("new-folder");

    win.style.top = (window.innerHeight / scale / 2) - (win.offsetHeight / 2) + 'px';
    win.style.left = (window.innerWidth / scale / 2) - (win.offsetWidth / 2) + 'px';
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

    const labelP = div.querySelector("p");

    labelP.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        editIconNames(labelP, div);
    })

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
        const winId = div.id.replace("-icon", "");
        const win = document.getElementById(winId);
        if (win) {
            const displayMode = win.id.includes('-file') ? 'flex' : 'block';
            console.log(displayMode);
            win.style.setProperty('display', displayMode, 'important');
            win.style.margin = '0';
            const title = win.querySelector(".title");
            if (title) title.textContent = labelP.textContent;

            const panel = win.querySelector(".window-pane");
            if (panel) panel.contentEditable = "true";
            panel.focus();

            const idThere = activeWindows.indexOf(winId);
            if (idThere === -1) activeWindows.push(winId);
            updateDeleteBtn();
            updatePrintBtn();
            bringWindowToTop(winId);

            if (displayMode === "flex") {
                setActiveFolder(null);
            } else {
                setActiveFolder(winId);
            }
        }
        console.log(activeWindows);
    });
}

function editIconNames(label, div) {
    label.contentEditable = "true";
    label.focus();

    document.execCommand("selectAll");

    label.addEventListener("blur", () => {
        label.contentEditable = "false";

        const newName = label.textContent.trim();
        if (!newName) return;

        const oldIconId = div.id;
        const oldFileId = oldIconId.replace("-icon", "");
        const newFileId = newName + "-file";
        const newIconId = newName + "-file-icon";

        div.id = newIconId;

        const file = files.find(file => file.id === oldFileId);
        if (file) {
            file.id = newFileId;
            file.label = newName;
        }

        const win = document.getElementById(oldFileId);
        if (win) {
            win.id = newFileId;
            const title = win.querySelector(".title");
            if (title) title.textContent = newName;
        }

        const index = activeWindows.indexOf(oldFileId);
        if (index !== -1) {
            activeWindows[index] = newFileId;
        }
        updateDeleteBtn();
        updatePrintBtn();
    }, { once: true })
    label.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "enter") {
            e.preventDefault();
            label.blur();
        }
    });
}

//to close current specific window from nav bar
document.getElementById("close-win").addEventListener("click", (e) => {
    e.stopPropagation();
    const lastWinId = activeWindows.pop();
    if (lastWinId) {
        const lastWinDiv = document.getElementById(lastWinId);
        lastWinDiv.style.setProperty('display', 'none', 'important');
        if (activeFolder === lastWinId) setActiveFolder(null);
    }
    updateDeleteBtn();
    updatePrintBtn();
    document.activeElement.blur();
})

//to close all specific windows from nav bar
document.getElementById("close-all-win").addEventListener("click", (e) => {
    e.stopPropagation();
    for (let i = 0; i < activeWindows.length; i++) {
        const win = document.getElementById(activeWindows[i]);
        if (win) win.style.setProperty('display', 'none', 'important');
    }
    activeWindows =[];
    updateDeleteBtn();
    updatePrintBtn();
    setActiveFolder(null);
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

    if (winId.includes("-file")) {
        setActiveFolder(null);
    } else {
        setActiveFolder(winId);
    }
    updateDeleteBtn();
    updatePrintBtn();
}

document.getElementById("open-open").addEventListener("click", (e) => {
    e.stopPropagation();
    const input = document.getElementById("open-input-field");
    const value = input.value.trim();

    if (value === "") {
        alertBox("Enter some File Name.");
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
        updateDeleteBtn();
        updatePrintBtn();
        bringWindowToTop(file.id);
        input.value = "";
    }
});

function alertBox(content) {
    const alertBox = document.querySelector(".alert-box");
    const alertText = alertBox.querySelector(".alert-text");

    alertText.textContent = content;

    alertBox.style.visibility = "hidden";
    alertBox.style.setProperty("display", "block", "important");
    alertBox.style.left = (window.innerWidth / scale / 2) - (alertBox.offsetWidth / 2) + 'px';
    alertBox.style.top = (window.innerHeight / scale / 2) - (alertBox.offsetHeight / 2) + 'px';

    alertBox.style.zIndex = '9998';

    alertBox.style.visibility = '';
}

function createWindow(id, name, editable = 'false') {
    const div = document.createElement("div");
    div.id = id;
    div.className = "window fixed w-64 h-48 z-10 flex! flex-col! overflow-hidden!";
    div.style.setProperty("display", "none", "important");
    const titleDiv = document.createElement("div");
    titleDiv.className = "title-bar";
    const closeBtn = document.createElement("button");
    closeBtn.className = "close";
    closeBtn.setAttribute("aria-label", "Close");
    const resizeBtn = document.createElement("button");
    resizeBtn.className = "resize";
    resizeBtn.setAttribute("aria-label", "Resize");
    const titleH1 = document.createElement("h1");
    titleH1.className = "title"
    titleH1.textContent = name;

    titleDiv.appendChild(closeBtn);
    titleDiv.appendChild(titleH1);
    titleDiv.appendChild(resizeBtn);

    const seperatorDiv = document.createElement("div");
    seperatorDiv.className = "separator";

    const windowPane = document.createElement("div");
    windowPane.className = "window-pane flex-1 overflow-y-auto! min-h-0";
    windowPane.contentEditable = editable;

    div.appendChild(titleDiv);
    div.appendChild(seperatorDiv);
    div.appendChild(windowPane);

    document.querySelector(".after-loading").appendChild(div);

    closeBtn.addEventListener("click", (e) => {
        div.style.setProperty("display", "none", "important");
        activeWindows = activeWindows.filter(winId => winId !== id);
        if (activeFolder === id) setActiveFolder(null);
        updateDeleteBtn();
        updatePrintBtn();
    });

    resizeBtn.addEventListener("click", (e) => {
        const win = e.target.closest(".window");
        if (win.dataset.full === "true") {
            win.style.width = win.dataset.width;
            win.style.height = win.dataset.height;
            win.style.top = win.dataset.top;
            win.style.left = win.dataset.left;

            win.style.margin = "0";

            win.dataset.full = "false";
        } else {
            win.dataset.width = div.style.width;
            win.dataset.height = div.style.height;
            win.dataset.top = div.style.top;
            win.dataset.left = div.style.left;

            win.style.width = homeRect.width + "px";
            win.style.height = homeRect.height + "px";
            win.style.top = homeRect.top + "px";
            win.style.left = homeRect.left + "px";

            win.dataset.full = "true";

            win.style.margin = "0";
        }
    })

    div.addEventListener("click", () => {
        if (div.style.display !== "none") bringWindowToTop(id);
    })

    div.style.visibility = "hidden";
    div.style.setProperty("display", "block", "important");
    div.style.top = (window.innerHeight / scale / 2) - (div.offsetHeight / 2) + "px";
    div.style.left = (window.innerWidth / scale / 2) - (div.offsetWidth / 2) + "px";
    div.style.setProperty("display", "none", "important");
    div.style.visibility = "";

    dragElementWindows(div);
};

function sortIcons(sortFn) {
    if (activeFolder !== "open-folder" && activeFolder !== "system-folder" && activeFolder !== "trash-folder") return;

    let sorted;

    let fileList;
    if (activeFolder === "open-folder") {
        fileList = document.getElementById("file-list");
        sorted = [...files].sort(sortFn);
    } else if (activeFolder === "trash-folder") {
        fileList = document.getElementById("trash-list");
        sorted = [...trashedFiles].sort(sortFn);
        return;
    }
    fileList.innerHTML = "";
    sorted.forEach(file => {
        const item = document.createElement("div");
        item.className = "flex items-center gap-2 cursor-pointer px-1";
        item.innerHTML = `
            <img src="${file.iconSrc}" width="16" height="16"/>
            <span class="text-sm!"> ${file.label}</span>
        `;
        item.addEventListener("dblclick", (e) => {
            const win = document.getElementById(file.id);
            if (win) {
                win.style.setProperty("display", "block", "important");
                const id = activeWindows.indexOf(file.id);
                if (id === -1) activeWindows.push(file.id);
                updateDeleteBtn();
                updatePrintBtn();
                bringWindowToTop(file.id);
            }
        })
        fileList.appendChild(item);
    })
}

document.getElementById("by-name").addEventListener("click", (e) => {
    sortIcons((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
});

document.getElementById("by-kind").addEventListener("click", (e) => {
    sortIcons((a, b) => {
        const isFileA = a.id.includes("-file") ? 1 : 0;
        const isFileB = b.id.includes("-file") ? 1 : 0;

        return isFileA - isFileB;
    })
});

function setActiveFolder(id) {
    activeFolder = id;
    const enabled = id === "open-folder" || id === "system-folder" || id === "trash-folder";
    viewBtns.forEach(btn => {
        btn.classList.toggle("disabled", !enabled);
    })
}

const trashIcon = document.getElementById("trash-folder-icon");

function trashFile(id) {
    const icon = document.getElementById(id);
    if (!icon) return;

    const fileId = id.replace("-icon", "");
    const file = files.find(file => file.id === fileId);
    if (!file) return;

    trashedFiles.push({ ...file, id });
    files = files.filter(file => file.id !== fileId);

    const win = document.getElementById(fileId);

    if (win) {
        win.style.setProperty("display", "none", "important");
        activeWindows = activeWindows.filter(window => window !== fileId);
        updateDeleteBtn();
        updatePrintBtn();
    }
    icon.remove();
    row--;
    if (row < 0) {
        row = iconsPerCol;
        col--;
    }

    const icons = document.querySelectorAll(".homeIcons");
    let isFree = false;

    while (!isFree) {
        isFree = true;
        icons.forEach(icon => {
            const rowI = Math.round(parseFloat(icon.style.top) / iconSize);
            const colI = Math.round(parseFloat(icon.style.left) / iconSize);

            if (rowI === row && colI === col) {
                isFree = false;
                row++;
                if (row >= iconsPerCol) {
                    row = 0;
                    col++;
                }
            }
        })
    }

    if (trashedFiles.length > 0) {
        document.querySelector("#trash-folder-icon img").src = "assets/icons/trash-full.svg";
    }
}

function restoreFile(id) {
    const file = trashedFiles.find(tFile => tFile.id === id);
    if (!file) return;

    trashedFiles = trashedFiles.filter(tFile => tFile.id !== id);
    createIcons(id, file.iconSrc, file.label);
    if (trashedFiles.length === 0) {
        document.querySelector("#trash-folder-icon img").src = "assets/icons/trash.svg";
    }
}

document.getElementById("trash-folder-icon").addEventListener("dblclick", (e) => {
    const trashList = document.getElementById("trash-list");
    trashList.innerHTML = "";

    trashedFiles.forEach(file => {
        const item = document.createElement("div");
        item.className = "flex items-center gap-2 cursor-pointer px-1";
        item.innerHTML = `
            <img src = "${file.iconSrc}" width = "16" height = "16" />
            <span class="text-sm!">${file.label}</span>
        `;
        item.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            restoreFile(file.id);
            document.getElementById("trash-folder").style.setProperty("display", "none", "important");
        })
        trashList.appendChild(item);
    });
    const trashWin = document.getElementById("trash-folder");
    trashWin.style.setProperty("display", "block", "important");
    bringWindowToTop("trash-folder");
});

document.getElementById("delete").addEventListener("click", () => {

    const deletingWinId = activeWindows[activeWindows.length - 1];

    if (!deletingWinId) return;

    if (deletingWinId.includes("-file")) {
        trashFile(deletingWinId + '-icon');
    } else {
        alertBox("You Can't Delete System Folder/Alert.");
    }

    document.activeElement.blur();
});

function updateDeleteBtn() {
    const topWin = activeWindows[activeWindows.length - 1];
    document.getElementById("delete").classList.toggle("disabled", !topWin);
}
updateDeleteBtn();

let printFile = null;

document.getElementById("print").addEventListener("click", (e) => {

    const topWin = activeWindows[activeWindows.length - 1];
    if (!topWin) return;

    if (topWin.includes("-folder")) {
        alertBox("You Can Only Print Files.");
        return;
    }

    printFile = topWin;

    const modal = document.getElementById("print-modal");
    modal.style.setProperty("display", "block", "important");
    modal.style.left = (window.innerWidth / scale / 2) - (modal.offsetWidth / 2) + "px";
    modal.style.top = (window.innerHeight / scale / 2) - (modal.offsetHeight / 2) + "px";
    modal.style.zIndex = "9997";

    document.activeElement.blur();
})

function updatePrintBtn() {
    const topWin = activeWindows[activeWindows.length - 1];
    document.getElementById("print").classList.toggle("disabled", !topWin);
}
updatePrintBtn();

document.getElementById("print-confirm").addEventListener("click", (e) => {
    if (!printFile) return;

    const quality = document.getElementById("quality-high").checked ? "high" : "standard";
    const copies = parseInt(document.getElementById("copies").value) || 1;

    const win = document.getElementById(printFile);

    const content = win?.querySelector(".window-pane")?.innerHTML;
    const title = win?.querySelector(".title")?.textContent;

    for (let i = 0; i < copies; i++) {
        const printWin = window.open("", "_blank");
        if (!printWin) {
            alertBox("Popup Blocked, Please Allow Popups For This Site");
            document.getElementById("print-modal").style.setProperty("display", "none", "important");
            return;
        }
        printWin.document.write(
            `
                <html>
                    <head>
                        <style>
                            body { font-family: Chicago,monospace;}
                            ${quality === "high" ? "*{-webkit-print-color-adjust: exact;}" : ""}
                        </style>
                    </head>
                    <body>
                        <h2>${title}</h2>
                        ${content}
                    </body>
                </html>
            `);
        printWin.document.close();
        printWin.print();
        printWin.close();
    }
    document.getElementById("print-modal").style.setProperty("display", "none", "important");
})

document.getElementById("system-folder-icon").addEventListener("dblclick", (e) => {
    e.stopPropagation();

    const fileList = document.getElementById("system-list");
    fileList.innerHTML = "";

    files.forEach(file => {
        if (file.id === "system-folder") return;
        console.log(file.id)
        const item = document.createElement("div");
        item.className = "flex items-center gap-2 cursor-pointer px-1";
        item.innerHTML = `
            <img src = "${file.iconSrc}" width="16" height="16"/>
            <span class="text-sm!">${file.label}</span>
        `;
        item.addEventListener("dblclick", (e) => {
            e.stopPropagation();

            const win = document.getElementById(file.id);

            if (win) {
                const displayMode = file.id.includes("-file") ? "flex" : "block";
                win.style.setProperty("display", displayMode, "important");
                const index = activeWindows.indexOf(file.id);
                if (index === -1) activeWindows.push(file.id);
                bringWindowToTop(file.id);
                updateDeleteBtn();
                updatePrintBtn();
            }
        })
        fileList.appendChild(item);
    })

})

const tabs = ["about", "projects", "skills", "contact"];

const displayModeForTabs = {
    "about": "flex",
    "projects": "block",
    "skills": "block",
    "contact": "block"
};

let sectionWidth = null;
let sectionHeight = null;

tabs.forEach(tab => {
    document.getElementById(`tab-${tab}`).addEventListener("click", (e) => {
        const aboutMeSec = document.getElementById("about-me-section");
        if (!sectionWidth) {
            sectionWidth = aboutMeSec.offsetWidth;
            sectionHeight = aboutMeSec.offsetHeight;
        }
        tabs.forEach(t => {
            document.getElementById(`content-${t}`).style.display = "none";
        });
        document.getElementById(`content-${tab}`).style.display = displayModeForTabs[tab];
        aboutMeSec.style.width = sectionWidth + 'px';
        aboutMeSec.style.height = sectionHeight + 'px';
    })
})

//about myself section
document.getElementById("about-me").addEventListener("click", (e) => {
    e.stopPropagation();

    const aboutMeSec = document.getElementById("about-me-section");
    aboutMeSec.style.setProperty("display", "block", "important");
    sectionWidth = aboutMeSec.offsetWidth;
    sectionHeight = aboutMeSec.offsetHeight;
    activeWindows.push("about-me-section");
    bringWindowToTop("about-me-section");

    updateDeleteBtn();
    updatePrintBtn();

    document.activeElement.blur();
})