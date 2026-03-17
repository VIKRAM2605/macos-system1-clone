const grid = 64;

// Make the DIV element draggable:
// dragElement(document.getElementById("mydiv"));

document.querySelectorAll('.homeIcons').forEach((element) => {
    // e.stopPropagation();
    // console.log(element)
    element.addEventListener('click', (event) => {
        event.stopPropagation();
        document.querySelectorAll('.homeIcons').forEach((element) => {
            element.style.filter = '';
        })
        element.style.filter = 'invert(1)';
    })
    dragElement(element)
})

document.body.addEventListener('click', (e) => {
    if (!e.target.closest('.homeIcons')) {
        document.querySelectorAll('.homeIcons').forEach((element) => {
            element.style.filter = '';
        })
    }
})

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
        // Step 10: Calculate the new cursor position.
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;
        // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
        element.style.filter = 'invert(1)';
        element.style.position = 'fixed';
        element.style.top = (element.offsetTop - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
    function stopDragging() {
        element.style.filter = '';
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


function updateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById("clock").textContent = time;
}

// to make all close buttons works to close the window
document.querySelectorAll(".close").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const window = e.target.closest(".window");
        window.style.display = "none";
    })

});


document.querySelectorAll(".homeIcons").forEach(btn => {
    btn.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        const windowId = btn.id.replace("-icon", "");

        const windowDiv = document.getElementById(windowId)
        if (windowDiv) {
            windowDiv.style.display = "block";
        }
    })
})

updateTime();
setInterval(updateTime, 1000);