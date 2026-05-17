# GoPro MAX2 Telemetry Tool

A Windows desktop app for extracting GPS and telemetry data from GoPro MAX2 `.360` files. Supports files of any size — tested with files up to 6GB.

## Download

👉 [Latest release (v1.0.7)](https://github.com/zekesixniner/gopro-telemetry-tool-win/releases/latest)

Download `GoPro.MAX2.Telemetry.Tool-x.x.x-win.zip`, extract, and run `GoPro MAX2 Telemetry Tool.exe` — no installation required.

## Requirements

- Windows 10 or later (64-bit)
- No additional software needed — ffmpeg is bundled

## Usage

1. Click **Browse** next to *Input file* and select your `.360`, `.mp4` or `.mov` file
2. Click **Browse** next to *Output folder* and select where to save the files
3. Select one or more output formats (GPX is checked by default)
4. Click **Extract Telemetry**
5. When done, the output files appear in the selected folder

## Output formats

| Format | Extension | Use case |
|--------|-----------|----------|
| GPX | `.gpx` | GPS Exchange — Google Maps, Garmin, most GPS apps |
| KML | `.kml` | Google Earth (absolute altitude) |
| GeoJSON | `.geojson` | GIS / web maps |
| JSON | `.json` | All sensor streams — GPS, accelerometer, gyroscope, etc. |
| VIRB | `.virb.gpx` | Garmin Virb Edit |
| MGJSON | — | Not supported for MAX2 — see CLI below |

## Supported cameras

- GoPro MAX2 (tested)
- GoPro MAX, HERO9 and later (should work)

## After Effects / MGJSON

MGJSON export is not supported in the desktop app for GoPro MAX2 files due to missing frame rate data in the GPMF stream. Use the CLI script instead:

👉 [gpmf2gpx.py CLI](https://github.com/zekesixniner/gopro-telemetry-tool-win)

## Building from source

Requires Node.js, WSL2/Ubuntu, and PowerShell on Windows 11.

```bash
# WSL — bump version
npm version patch
git push

# PowerShell — build
npm run build
```

The build requires `resources/ffmpeg.exe` (Windows build of ffmpeg) to be present locally — it is excluded from git due to file size. Download from [ffmpeg.org](https://ffmpeg.org/download.html) or [BtbN/ffmpeg-builds](https://github.com/BtbN/ffmpeg-builds/releases).

## License

MIT
