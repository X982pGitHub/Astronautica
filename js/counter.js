let pageName, enterTime;
function getEnterTime(){
    pageName = document.location.pathname.split('/').pop().replace('.html', '');
    enterTime = Date.now();
}

async function getLeaveTime(){
    let leaveTime = Date.now(); 
    return leaveTime;
}

async function getDuration(){
    let leaveTime = await getLeaveTime();
    let duration = (leaveTime - enterTime); 
    // Send the hit data to the server
    fetch('/pagehit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pageName: pageName, viewTime: duration })
    }).then(response =>{
        if (response.status === 200) {
            console.groupCollapsed("Page hit sent, Server returned 200 OK\n");
                console.log("Enter at:", new Date(enterTime));
                console.log("Leave at:", new Date(leaveTime)); 
                console.log("Duration:", duration/1000, "seconds")
            console.groupEnd();
        }
    }).catch(error =>{
        console.error("Error sending page hit: ", error);
    });
};

window.addEventListener('load', () => {
    getEnterTime();
});
window.addEventListener('beforeunload', async () => {
    await getDuration();
});
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible"){
        getEnterTime();
    } else {
        getDuration();
    }
});