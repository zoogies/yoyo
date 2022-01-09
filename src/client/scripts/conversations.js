const net = require('net');

function openedmain() {
    let Data = {
        command: "getuser"
    };
    ipcRenderer.send('request-mainprocess-action', Data);
}
var username = ''
ipcRenderer.on('mainprocess-response', (event, arg) => {
    if (arg['information'] == 'username') {
        username = arg['username']
        data = {
            "username": String(username)
        }
        basicxhr('/getconversations', data).then(function (response) {
                renderconversations(JSON.parse(response));
            })
            .catch(function (err) {
                console.error('An error occured!', err);
            });
    }
});

function renderconversations(list) {
    for (var i = 0; i < list.length; i++) {
        document.getElementById('conversations').innerHTML += '<div class="conversationbtn"><a id="' + list[i][0] + '" onclick="openconversation(' + list[i][0] + ')">' + list[i][1] + ' and ' + list[i][2] + '</a></div>';
    }
}
var conversation_id = ''

function openconversation(id) {
    //document.getElementById('message_input').value = '';
    conversation_id = id;
    data = {
        "conversation_id": String(conversation_id)
    }
    basicxhr('/getmessages', data).then(function (response) {
            rendermessages(JSON.parse(response));
        })
        .catch(function (err) {
            console.error('An error occured!', err);
        });
}

function rendermessages(messages) {
    //console.log(messages);
    messagebox = document.getElementById('messages_container');
    messagebox.innerHTML = '';
    document.getElementById('conversation_name').innerText = document.getElementById(messages[0][0]).textContent;
    for (var i = 0; i < messages.length; i++) {
        messagebox.innerHTML += '<div class="message" id="' + messages[i][1] + '"><b>' + messages[i][3] + ':</b><p>' + messages[i][2] + '</p></div>';
    }
}

function sendmessage() {
    message = document.getElementById('message_input').value;
    if (message.length > 250) {
        alert('Your exceeds the 250 character maximum.')
        return;
    } else if (message.length == 0) {
        alert('Your message cannot be 0 characters.')
        return;
    }
    data = {
        "conversationid": String(conversation_id),
        "content": String(message),
        "username": String(username)
    }
    basicxhr('/sendmessage', data).then(function (response) {
            openconversation(conversation_id);
            document.getElementById('message_input').value = '';
        })
        .catch(function (err) {
            console.error('An error occured!', err);
        });
}
setInterval(() => {
    if (conversation_id != '') {
        openconversation(conversation_id)
    }
}, 1000);

/*
//keepalive
setInterval(() => {
    data = {
        "username": String(username),
    }
    basicxhr('/keepalive', data).then(function (response) {
            console.log('sent keepalive')
        })
        .catch(function (err) {
            console.error('An error occured!', err);
        });
}, 5000);

socketClient = net.connect({
    host: '76.181.32.163:5000',
    port: 5000
}, () => {
    // 'connect' listener
    console.log('connected to server!');
});

socketClient.on('data', (data) => {
    console.log(data.toString());
});
socketClient.on('end', () => {
    console.log('disconnected from server');
});
*/