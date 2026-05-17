

# GoPro Telemetry Tool – Windows GUI

A Windows desktop application for extracting GPS and telemetry data from **GoPro MAX2** `.360` files.

This is a Windows GUI wrapper around the CLI tool [gopro-telemetry-tool](https://github.com/zekesixniner/gopro-telemetry-tool), which is based on [Juan Irache's gopro-telemetry](https://github.com/JuanIrache/gopro-telemetry).

---

## Download

Go to [Releases](https://github.com/zekesixniner/gopro-telemetry-tool-win/releases) and download one of:

| File | Description |
|---|---|
| `GoPro Telemetry Tool Setup 1.0.0.exe` | Installer (recommended) |
| `GoPro Telemetry Tool-1.0.0-win.zip` | Portable – unzip and run, no installation needed |

### ⚠️ Windows SmartScreen warning

When running the installer or the app for the first time, Windows may show a SmartScreen warning. This is expected for open source software without a paid code signing certificate.

To proceed safely:
1. Click **"More info"**
2. Click **"Run anyway"**

The full source code is available on GitHub for inspection.

---

## How to use

1. Click **Browse** and select your `.360` file (or `.mp4` / `.mov`)
2. Click **Browse** and select an output folder
3. Select one or more output formats
4. Click **Extract Telemetry**

---

## Output formats

| Format | Description |
|---|---|
| **GPX** | Standard GPS format – works with SkyDemon, Garmin, Google Earth and most mapping tools |
| **KML** | Google Earth format with absolute altitude |
| **GeoJSON** | For GIS applications and web maps |
| **JSON** | All sensor streams in JSON format – contains the most data (see below) |
| **MGJSON** | Adobe After Effects compatible format for motion data overlays |
| **VIRB** | Garmin Virb compatible GPX with acceleration extension |

### What is the JSON format?

The JSON file contains **all telemetry streams** recorded by the GoPro MAX2, not just GPS. This includes:

| Stream | Description | Sample rate |
|---|---|---|
| GPS9 | Position, altitude, speed, accuracy | ~18 Hz |
| ACCL | Accelerometer (x, y, z) | ~200 Hz |
| GYRO | Gyroscope (x, y, z) – camera movement | ~400 Hz |
| MAGN | Magnetometer / compass | ~25 Hz |
| CORI | Camera orientation | per frame |
| IORI | Image orientation | per frame |
| GRAV | Gravity vector | per frame |
| TMPC | Camera temperature | ~1 Hz |
| SHUT | Shutter speed | per frame |
| WBAL | White balance | per frame |
| ISOE | ISO value | per frame |

### What is MGJSON?

MGJSON is a format used by **Adobe After Effects** to import motion and telemetry data. It allows you to link camera movement, GPS, and sensor data directly to your video timeline in After Effects.

---

## Tested with

- GoPro MAX2, firmware H24.02.01.22.00
- Windows 11
