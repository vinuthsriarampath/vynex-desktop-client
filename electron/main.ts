import {app, BrowserWindow, Tray,Menu, ipcMain, Notification, screen, shell} from 'electron'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {autoUpdater,} from 'electron-updater'
// import { createRequire } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;


let tray: Tray | null = null;
let lastAccessTime= Date.now()
let isQuiting:boolean = false;

function createWindow() {

    // app.applicationMenu = null

    win = new BrowserWindow({
        icon: 'public/icon.ico',
        width: screen.getPrimaryDisplay().workAreaSize.width,
        height: screen.getPrimaryDisplay().workAreaSize.height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
        },
    })

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    win.on('close', (event) => {
        if (isQuiting) {
            event.preventDefault();
            win?.hide();
            lastAccessTime = Date.now();
        }
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }
}

function createTray() {
    tray = new Tray('public/icon.ico');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open',
            click: () => handleOpen()
        },
        {
            label: 'Exit',
            click: () => {
                isQuiting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Vynex');
    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => handleOpen());
}

function handleOpen() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (now - lastAccessTime <= oneHour) {
        if (win) {
            win.show();
            win.focus();
        }
    } else {
        app.relaunch();
        app.exit();
    }
}


const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {

    app.on('second-instance', () => {
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
        }
    })

    app.whenReady().then(() => {
        app.setLoginItemSettings({
            openAtLogin: true,
            path: process.execPath
        })

        createWindow();
        createTray();

        win?.webContents.on('did-finish-load', () => {
            if (process.env.NODE_ENV !== 'development') {
                sendMessage("Checking For Updates...", false);

                autoUpdater.checkForUpdates().catch(err => {
                    console.error("Update check failed:", err.message);
                    sendMessage("Update check failed: " + err.message, false);
                });
            }

        });
    });


    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
            win = null
        }
    })

}

ipcMain.on('notify', (_event, title, body) => {
    new Notification({
        title,
        body,

    }).show()
})

autoUpdater.on("update-available", () => {
    console.log("Update available");
    sendMessage("Update available. Downloading...", false);
    autoUpdater.downloadUpdate().catch(err => {
        console.error("Update download failed:", err.message);
        sendMessage("Update download failed: " + err.message, false);
    });
});

autoUpdater.on("update-not-available", () => {
    console.log("Update not available");
    sendMessage("No updates available. Current Version : v" + app.getVersion(), true);
});

autoUpdater.on("update-downloaded", () => {
    console.log("Update downloaded");
    sendMessage("Update downloaded. Restart the Application !", false);
});

autoUpdater.on("error", (err) => {
    console.log("Error: " + err.message);
    sendMessage("Error: " + err.message, false);
});

function sendMessage(message: string, status: boolean) {
    win?.webContents.send('update-message', message);
    updateStatus(status);
}

function updateStatus(status: boolean) {
    win?.webContents.send('update-status', status);
}

process.on("uncaughtException", function (err) {
    sendMessage("Error: " + err.message, false);
});

ipcMain.on('open-link', (_event, url) => {
    shell.openExternal(url); // Open in default browser
    // Or load in a new BrowserWindow:
    // const newWin = new BrowserWindow({ width: 600, height: 400 });
    // newWin.loadURL(url);
});