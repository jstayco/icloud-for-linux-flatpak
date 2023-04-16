const {app, BrowserWindow, Menu, shell} = require('electron')
const fs = require('fs')
const path = require('path')

function writeDebugToFile(label, value) {
    const logFilePath = path.join(xdgConfigHome, 'icloud-for-linux-debug.log');
    fs.appendFileSync(logFilePath, label + ': ' + value + '\n');
}

function createWindow() {
    const levelDbDir = 'config/icloud-for-linux/Local Storage/leveldb';
    const levelDbFile = '/000003.log';
    const xdgConfigHome = process.env.XDG_CONFIG_HOME || path.join(process.env.HOME, '.config');
    writeDebugToFile('xdgConfigHome', xdgConfigHome);

    const userDataPath = path.join(xdgConfigHome, 'icloud-for-linux');
    const levelDbPath = userDataPath + '/.' + levelDbDir;
    const levelDbFilePath = userDataPath + '/.' + levelDbDir + levelDbFile;
    writeDebugToFile('LevelDbFilePath', levelDbFilePath);

    if (!fs.existsSync(levelDbPath)) {
        fs.mkdirSync(levelDbPath, {recursive: true});

        const sourceFilePath = path.join(__dirname, levelDbDir + levelDbFile);
        writeDebugToFile('Source file path:', sourceFilePath);
        writeDebugToFile('LevelDbFilePath:', levelDbFilePath);

        if (fs.existsSync(sourceFilePath)) {
            try {
                fs.copyFileSync(sourceFilePath, levelDbFilePath);
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err;
                } else {
                    console.error(`Failed to copy file: ${sourceFilePath} -> ${levelDbFilePath}`);
                }
            }
        } else {
            console.error(`Source file not found: ${sourceFilePath}`);
        }
    }


    const isFlatpak = process.env.FLATPAK_ID !== undefined;
    const commonDataPath = isFlatpak
        ? path.join(process.env.XDG_DATA_HOME, 'icloud-for-linux')
        : process.env.SNAP_USER_COMMON || path.join(process.env.HOME, '.local/share');

    let tld
    try {
        tld = fs.readFileSync(commonDataPath + '/tld', 'utf8').trim()
    } catch {
        tld = '.com'
        fs.writeFileSync(commonDataPath + '/tld', tld)
    }

    const appName = 'iCloud'
    const appUrl = 'https://www.icloud' + tld + '/'

    Menu.setApplicationMenu(null)

    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        title: appName
    })

    mainWindow.loadURL(appUrl + process.argv[2])

    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (!url.startsWith(appUrl)) {
            event.preventDefault()
            shell.openExternal(url)
        }
    })

    mainWindow.on('close', () => {
        app.exit(0)
    })
}
