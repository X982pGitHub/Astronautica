let pageName, enterTime;
function getEnterTime(){
    pageName = document.location.pathname.split('/').pop().replace('.html', '');
    enterTime = performance.now();
}

async function getLeaveTime(){
    let leaveTime = performance.now(); 
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
                console.log("Enter at:", new Date(enterTime + performance.timeOrigin));
                console.log("Leave at:", new Date(leaveTime + performance.timeOrigin)); 
                console.log("Duration:", duration/1000, "seconds")
            console.groupEnd();
        } else {
            throw new Error(`Server returned status code ${response.status}`);
        }
    }).catch(error =>{
        console.error("Error sending page hit: ", error);
        setTimeout(() => {
            getDuration();
        }, 2000);
    });
};

window.addEventListener('load', () => {
    getEnterTime();
});
window.addEventListener('beforeunload', async (event) => {
    event.preventDefault()
    await getDuration();
});
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible"){
        getEnterTime();
    } else {
        getDuration();
    }
});