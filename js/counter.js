window.addEventListener('load', function() {
    var pageName = document.location.pathname.split('/').pop().replace('.html', '');
    // Send the hit data to the server
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/pagehit');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({pageName: pageName}));
});