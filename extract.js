const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require('gopro-telemetry');
const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
const outputDir = process.argv[3];

if (!inputFile || !outputDir) {
  console.error('Usage: node extract.js <input.360> <output-dir>');
  process.exit(1);
}

// Create output directory if it does not exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const baseName = path.basename(inputFile).replace(/\.[^.]+$/, '');
const baseFile = path.join(outputDir, baseName);

console.log(`[INFO] Reading: ${inputFile}`);
const file = fs.readFileSync(inputFile);

const options = {
  GPSFix: 3,
  GPSPrecision: 500,
  WrongSpeed: 120,
  smooth: 3,
};

gpmfExtract(file)
  .then(extracted => {
    console.log(`[INFO] Extracting telemetry...`);

    const formats = [
      { preset: 'gpx',     ext: 'gpx',      fix: s => s },
      { preset: 'kml',     ext: 'kml',      fix: s => s.replace(/clampToGround/g, 'absolute') },
      { preset: 'geojson', ext: 'geojson',  fix: s => s },
      { preset: 'csv',     ext: 'csv',      fix: s => s },
      { preset: 'mgjson',  ext: 'mgjson',   fix: s => s },
      { preset: 'virb',    ext: 'virb.gpx', fix: s => s },
    ];

    const promises = formats.map(({ preset, ext, fix }) =>
      goproTelemetry(extracted, { ...options, preset })
        .then(data => {
          const content = typeof data === 'string' ? fix(data) : fix(JSON.stringify(data, null, 2));
          const outFile = `${baseFile}.${ext}`;
          fs.writeFileSync(outFile, content);
          console.log(`[INFO] Saved: ${outFile}`);
        })
        .catch(err => console.error(`[ERROR] ${preset}:`, err.message))
    );

    return Promise.all(promises);
  })
  .then(() => console.log('\n✅ Done!'))
  .catch(err => console.error('[ERROR]', err));
