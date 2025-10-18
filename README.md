# Unifi Config Decoder

[![CI/CD Pipeline](https://github.com/markush97/Unifi-Config-Decoder/actions/workflows/release.yml/badge.svg)](https://github.com/markush97/Unifi-Config-Decoder/actions/workflows/release.yml)
[![Latest Release](https://img.shields.io/github/v/release/markush97/Unifi-Config-Decoder?include_prereleases&sort=semver&logo=github)](https://github.com/markush97/Unifi-Config-Decoder/releases/latest)
[![GitHub Release Date](https://img.shields.io/github/release-date/markush97/Unifi-Config-Decoder?logo=github)](https://github.com/markush97/Unifi-Config-Decoder/releases)
[![Download Latest](https://img.shields.io/github/downloads/markush97/Unifi-Config-Decoder/latest/total?logo=github&label=downloads)](https://github.com/markush97/Unifi-Config-Decoder/releases/latest)
[![Docker Image](https://img.shields.io/badge/docker-ghcr.io-2496ED?logo=docker&logoColor=white)](https://github.com/markush97/unifi-config-decoder/pkgs/container/unifi-config-decoder)
[![License](https://img.shields.io/github/license/markush97/Unifi-Config-Decoder?logo=github)](LICENSE)

> **📦 Download the latest build**: Get the ready-to-use application from the [latest release](https://github.com/markush97/Unifi-Config-Decoder/releases/latest) - no build required!

I struggled for some time, to have good desaster recovery-features inplace for Ubiquity Unifi Setups. I wanted a solution that allows me to easily find usefull debugging informations (for example VLANs, Gateway-IPs and configured Switch-Ports) without needing to have a working/reachable unifi-controller with the current config.

I looked around in the web and did not found anything that suited my needs so I just built it myself.

# Features

- 🔍 **Decrypt and analyze** UniFi backup files (.unf)
- 📊 **Visual dashboard** with device overview, VLANs, switches, and WAN configuration
- 🏠 **Runs locally** - all processing happens in your browser, no data leaves your machine
- 📱 **Responsive design** - works on desktop and mobile devices
- 🌙 **Dark/Light theme** support
- 📦 **Multiple export formats** - JSON database dumps and ZIP archives

## Usage

### 🐳 Docker (Recommended)

Run the application using Docker with multi-architecture support:

```bash
# Latest version
docker run -p 3000:80 ghcr.io/markush97/unifi-config-decoder:latest

# Specific version
docker run -p 3000:80 ghcr.io/markush97/unifi-config-decoder:v1.1.0

# With custom port
docker run -p 8080:80 ghcr.io/markush97/unifi-config-decoder:latest
```

Then open your browser and navigate to `http://localhost:3000` (or your chosen port).

**Supported architectures:**

- `linux/amd64` (x86_64)
- `linux/arm64` (ARM64/AArch64)
- `linux/arm/v7` (ARM32v7)

### 📦 Static HTML (Portable)

1. **Download** the latest release ZIP from [GitHub Releases](https://github.com/markush97/Unifi-Config-Decoder/releases/latest)
2. **Extract** the `unifi-decoder-vX.X.X.zip` file to a folder
3. **Open** the `index.html` file in your web browser
4. **Upload** your `.unf` backup file and start analyzing!

**Benefits of static version:**

- ✅ No installation required
- ✅ Works offline
- ✅ Portable - run from USB stick
- ✅ No server needed
- ✅ Cross-platform (Windows, macOS, Linux)

### 🌐 Online Version

Visit the hosted version at [your-domain.com] (if available) - but remember, the local versions are more secure as your data never leaves your device.

## How to Use

1. **Get your UniFi backup file** (`.unf`):
   - Export from UniFi Controller: Settings → System → Backup/Restore → Download Backup
2. **Open the application** (Docker or static HTML)

3. **Upload your `.unf` file**:
   - Click "📂 Choose .unf file" or drag and drop
   - The file will be automatically decrypted and analyzed
4. **Explore your configuration**:
   - **Overview**: General information and statistics
   - **Devices**: All UniFi devices in your network
   - **Switches**: Port configurations and VLANs
   - **VLANs**: Network segmentation details
   - **WAN**: Internet connection settings
5. **Export results**:
   - **📦 Download ZIP**: Get processed files as archive
   - **📄 Download JSON**: Get readable config database

## Deployment

### 🐳 Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  unifi-decoder:
    image: ghcr.io/markush97/unifi-config-decoder:latest
    ports:
      - '3000:80'
    restart: unless-stopped
```

Run with: `docker-compose up -d`

### ☸️ Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: unifi-decoder
spec:
  replicas: 1
  selector:
    matchLabels:
      app: unifi-decoder
  template:
    metadata:
      labels:
        app: unifi-decoder
    spec:
      containers:
        - name: unifi-decoder
          image: ghcr.io/markush97/unifi-config-decoder:latest
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: unifi-decoder-service
spec:
  selector:
    app: unifi-decoder
  ports:
    - port: 80
      targetPort: 80
  type: LoadBalancer
```

### 🖥️ Self-hosted (Static Files)

1. Download and extract the latest release ZIP
2. Serve the files with any web server:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# nginx
# Point document root to extracted folder
```

# Contribution

Feel free to open issues or contribute to the project. I cannot promise any quick changes but I am open to criticism and feedback.
