var username = '';
var password = '';

function signin() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    if (username == null || username == '' || password == null || password == '') {
        alert('You need to fill out both required fields.');
    } else {
        //authenticate with the server
        data = {
            "username": String(username),
            "password": String(password)
        }
        basicxhr('/auth', data).then(function (response) {
                if (response == 'True') {
                    let Data = {
                        command: "setuser",
                        username: username,
                    };
                    ipcRenderer.send('request-mainprocess-action', Data);
                    window.location = 'main.html';

                } else {
                    alert("incorrect username or password")
                }
            })
            .catch(function (err) {
                console.error('An error occured!', err);
            });
    }
}