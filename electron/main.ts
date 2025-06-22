import { app, BrowserWindow, ipcMain, Notification, screen } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { autoUpdater, } from 'electron-updater'

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

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

const gotTheLock = app.requestSingleInstanceLock()

if(!gotTheLock){
  app.quit()
}else{

  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.whenReady().then(() => {
    createWindow();
  
    win?.webContents.on('did-finish-load', () => {
      sendMessage("Checking For Updates...");
  
      let upt=autoUpdater.checkForUpdates().catch(err => {
        console.error("Update check failed:", err.message);
        sendMessage("Update check failed: " + err.message);
      });
      console.log(upt);
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
  sendMessage("Update available. Downloading...");
  autoUpdater.downloadUpdate().catch(err => {
    console.error("Update download failed:", err.message);
    sendMessage("Update download failed: " + err.message);
  });
});

autoUpdater.on("update-not-available", () => {
  console.log("Update not available");
  sendMessage("No updates available. Current Version : v" + app.getVersion());
});

autoUpdater.on("update-downloaded", () => {
  console.log("Update downloaded");
  sendMessage("Update downloaded. Restart the Application !");
});

autoUpdater.on("error", (err) => {
  console.log("Error: " + err.message);
  sendMessage("Error: " + err.message);
});

function sendMessage(message:string){
  win?.webContents.send('update-message', message);
}


process.on("uncaughtException",function (err){
  console.log(err);
});