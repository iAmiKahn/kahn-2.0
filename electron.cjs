const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')

const isDev = !app.isPackaged

// ─── Data directory ────────────────────────────────────────────────────────
const DATA_DIR = isDev
  ? path.join(__dirname, 'data')
  : path.join(process.resourcesPath, 'data')

const KNOWLEDGE_DIR = 'C:\\Kahn'

const DATA_DEFAULTS = {
  prospects:    [],
  properties:   [],
  valuations:   [],
  interactions: [],
  learning:     [],
  settings:     { marketDefaults: {}, knowledgePath: KNOWLEDGE_DIR }
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  // Ensure subdirectories exist
  const subdirs = [
    'health',
    'life-narration',
    'life-narration/domains',
    'life-narration/daily',
    'handoff'
  ]
  subdirs.forEach(sub => {
    const dir = path.join(DATA_DIR, sub)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
  Object.entries(DATA_DEFAULTS).forEach(([name, defaultVal]) => {
    const filepath = path.join(DATA_DIR, `${name}.json`)
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, JSON.stringify(defaultVal, null, 2), 'utf8')
    }
  })
}

// ─── Window ────────────────────────────────────────────────────────────────
function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#080810',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#080810',
      symbolColor: '#8888bb',
      height: 38,
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
  })

  win.once('ready-to-show', () => win.show())

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'))
  }

  // Open external links in default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// ─── IPC: Data operations ──────────────────────────────────────────────────
ipcMain.handle('data:read', (_event, filename) => {
  try {
    // Support nested paths like "life-narration/domains/legal"
    const filepath = path.join(DATA_DIR, `${filename}.json`)
    if (!fs.existsSync(filepath)) return DATA_DEFAULTS[filename] ?? null
    return JSON.parse(fs.readFileSync(filepath, 'utf8'))
  } catch (err) {
    console.error(`data:read error (${filename}):`, err)
    return DATA_DEFAULTS[filename] ?? null
  }
})

ipcMain.handle('data:write', (_event, filename, data) => {
  try {
    const filepath = path.join(DATA_DIR, `${filename}.json`)
    // Ensure parent directory exists for nested paths
    const dir = path.dirname(filepath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8')
    return { ok: true }
  } catch (err) {
    console.error(`data:write error (${filename}):`, err)
    return { ok: false, error: err.message }
  }
})

// ─── IPC: Knowledge system ─────────────────────────────────────────────────
ipcMain.handle('knowledge:read', (_event, relativePath) => {
  try {
    const filepath = path.join(KNOWLEDGE_DIR, relativePath)
    if (!fs.existsSync(filepath)) return { ok: false, error: 'File not found' }
    return { ok: true, content: fs.readFileSync(filepath, 'utf8') }
  } catch (err) {
    return { ok: false, error: err.message }
  }
})

ipcMain.handle('knowledge:list', () => {
  try {
    const entries = []
    function walk(dir, base = '') {
      fs.readdirSync(dir).forEach(f => {
        const full = path.join(dir, f)
        const rel = base ? `${base}/${f}` : f
        if (fs.statSync(full).isDirectory()) walk(full, rel)
        else entries.push(rel)
      })
    }
    walk(KNOWLEDGE_DIR)
    return { ok: true, files: entries }
  } catch (err) {
    return { ok: false, error: err.message }
  }
})

// ─── IPC: App info ─────────────────────────────────────────────────────────
ipcMain.handle('app:info', () => ({
  version: app.getVersion(),
  dataDir: DATA_DIR,
  knowledgeDir: KNOWLEDGE_DIR,
  isDev,
}))

// ─── App lifecycle ─────────────────────────────────────────────────────────
app.whenReady().then(() => {
  ensureDataDir()
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
