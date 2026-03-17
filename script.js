const grid = 64;

document.addEventListener("DOmContentLoaded")





function updateTime(){
    const now = new Date();
    const time = now.toLocaleTimeString('en-US',{
        hour: '2-digit',
        minute:'2-digit'
    });
    document.getElementById("clock").textContent = time;
}

updateTime();

setInterval(updateTime,1000)


