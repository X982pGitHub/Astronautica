let pageName, enterTime;
function getEnterTime(){
    pageName = document.location.pathname.split('/').pop().replace('.html', '');
    enterTime = Date.now();
    console.log("Enter at: " + new Date(enterTime));
}

async function getLeaveTime(){
    let leaveTime = Date.now(); 
    console.log("Leave at: " + new Date(leaveTime)); 
    return leaveTime;
}

async function getDuration(){
    let duration = ((await getLeaveTime()) - enterTime); 
    console.log("Duration: " + duration/1000 + " seconds");
    // Send the hit data to the server
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/pagehit');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({pageName: pageName, viewTime: duration}));
};

window.addEventListener('load', () => {
    getEnterTime();
});
window.addEventListener('beforeunload', () => {
    getDuration();
});
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible"){
        getEnterTime();
    } else {
        getDuration();
    }
});