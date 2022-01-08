function basicxhr(route, data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://76.181.32.163:5000" + route);
        xhr.setRequestHeader("Accept", "apllication/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            //this is where its rejecting on mobile TODO HTTPS
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(JSON.stringify(data));
    });
}

function signin() {
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;
    if (username == null || username == '' || password == null || password == '') {
        alert('You need to fill out both required fields.');
    } else {
        //authenticate with the server
        data = {
            "username": String(username),
            "password": String(password)
        }
        basicxhr('/auth', data).then(function (response) {
                alert(response);
            })
            .catch(function (err) {
                console.error('An error occured!', err.statusText);
            });
    }
}