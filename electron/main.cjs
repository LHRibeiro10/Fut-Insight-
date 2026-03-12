const { app, BrowserWindow } = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");

let splash;
let mainWindow;
let apiServerPromise;

function createSplash() {
  splash = new BrowserWindow({
    width: 420,
    height: 260,
    frame: false,
    transparent: false,
    resizable: false,
    alwaysOnTop: true,
    center: true,
    backgroundColor: "#070b12",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  splash.loadURL(`data:text/html;charset=utf-8,
    <html>
      <body style="
        margin:0;
        background:#070b12;
        color:white;
        display:flex;
        align-items:center;
        justify-content:center;
        font-family:Arial,sans-serif;
      ">
        <div style="text-align:center;">
          <div style="
            font-size:34px;
            font-weight:900;
            letter-spacing:1px;
            color:#f4d35e;
            margin-bottom:12px;
          ">
            FUT INSIGHT 26
          </div>
          <div style="
            color:rgba(255,255,255,0.72);
            font-size:14px;
            letter-spacing:2px;
            text-transform:uppercase;
          ">
            Weekend League Analytics
          </div>
        </div>
      </body>
    </html>
  `);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1180,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#070b12",
    title: "FUT Insight 26",
    icon: path.join(__dirname, "../build/icon.ico"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadURL("http://127.0.0.1:3001");
  }

  mainWindow.once("ready-to-show", () => {
    if (splash && !splash.isDestroyed()) {
      splash.close();
    }
    mainWindow.show();
  });
}

async function ensureApiServer() {
  if (apiServerPromise) {
    return apiServerPromise;
  }

  const serverModuleUrl = pathToFileURL(
    path.join(__dirname, "../server/app.mjs")
  ).href;

  apiServerPromise = import(serverModuleUrl)
    .then(({ startServer }) => startServer({ port: 3001 }))
    .catch((error) => {
      console.error("Falha ao iniciar API local:", error);
      throw error;
    });

  return apiServerPromise;
}

app.whenReady().then(async () => {
  await ensureApiServer();
  createSplash();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
