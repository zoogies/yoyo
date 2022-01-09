const {
    ipcMain
} = require('electron');

const {
    app,
    BrowserWindow
} = require('electron')

function createWindow() {
    var win = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        title: "yoyo",
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadFile('index.html')
    win.openDevTools();
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

var username = '';
ipcMain.on('request-mainprocess-action', (event, arg) => {
    if (arg['command'] == 'setuser') {
        username = arg['username'];
    }
    if (arg['command'] == 'getuser') {
        data = {
            'information': 'username',
            'username': username
        }
        event.sender.send('mainprocess-response', data);
    }
});