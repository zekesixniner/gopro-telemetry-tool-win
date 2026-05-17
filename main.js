const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFile } = require('child_process');
const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require('gopro-telemetry');

function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: 'GoPro MAX2 Telemetry Tool',
  });
  win.loadFile('src/index.html');
  win.setMenuBarVisibility(false);
}

app.commandLine.appendSwitch("js-flags", "--max-old-space-size=16384");
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());

ipcMain.handle('select-input', async () => {
  const result = await dialog.showOpenDialog({
    filters: [{ name: 'GoPro 360', extensions: ['360', 'mp4', 'mov'] }],
    properties: ['openFile'],
  });
  return result.filePaths[0] || null;
});

ipcMain.handle('select-output', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
  });
  return result.filePaths[0] || null;
});

function getFFmpegPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'ffmpeg.exe');
  }
  return path.join(__dirname, 'resources', 'ffmpeg.exe');
}

function extractGPMF(inputFile, tmpFile) {
  return new Promise((resolve, reject) => {
    const ffmpeg = getFFmpegPath();
    execFile(ffmpeg, [
      '-i', inputFile,
      '-map', '0:3',
      '-c', 'copy',
      
      '-y',
      tmpFile
    ], (err, stdout, stderr) => {
      if (err) reject(new Error(`ffmpeg failed: ${stderr}`));
      else resolve();
    });
  });
}

ipcMain.handle('extract', async (event, { inputFile, outputDir, formats }) => {
  const send = (msg, progress) =>
    event.sender.send('progress', { msg, progress });

  const tmpFile = path.join(os.tmpdir(), `gpmf_${Date.now()}.mp4`);

  try {
    send('Extracting GPMF track with ffmpeg...', 5);
    await extractGPMF(inputFile, tmpFile);

    send('Parsing GPMF data...', 20);
    const file = fs.readFileSync(tmpFile);
    const extracted = await gpmfExtract(file);

    const baseName = path.basename(inputFile).replace(/\.[^.]+$/, '');
    const baseFile = path.join(outputDir, baseName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const options = {
      GPSFix: 3,
      GPSPrecision: 500,
      WrongSpeed: 120,
      smooth: 3,
      videoFrameRate: 25,
    };

    const formatMap = {
      gpx:     { ext: 'gpx',      fix: s => s },
      kml:     { ext: 'kml',      fix: s => s.replace(/clampToGround/g, 'absolute') },
      geojson: { ext: 'geojson',  fix: s => s },
      csv:     { ext: 'json',     fix: s => s },
      mgjson:  { ext: 'mgjson',   fix: s => s },
      virb:    { ext: 'virb.gpx', fix: s => s },
    };

    const selected = formats.filter(f => formatMap[f]);
    const step = 70 / selected.length;
    let progress = 25;

    for (const fmt of selected) {
      send(`Generating ${fmt.toUpperCase()}...`, progress);
      const { ext, fix } = formatMap[fmt];
      let data;
      try {
        data = await goproTelemetry(extracted, { ...options, preset: fmt });
      } catch (fmtErr) {
        send(`Skipped ${fmt.toUpperCase()}: ${fmtErr.message}`, progress);
        progress += step;
        continue;
      }
      const content = typeof data === 'string' ? fix(data) : fix(JSON.stringify(data, null, 2));
      fs.writeFileSync(`${baseFile}.${ext}`, content);
      progress += step;
      send(`Saved: ${baseName}.${ext}`, progress);
    }

    send('Done!', 100);
    return { success: true };
  } catch (err) {
    send(`Error: ${err.message}`, 0);
    return { success: false, error: err.message };
  } finally {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }
});
