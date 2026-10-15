# Mera Gallery

A responsive cross-platform photo sharing web app with a Liquid Glass-inspired interface, local photo selection, QR-ready pairing-code workflow, WebRTC peer-to-peer transfers, transfer progress, and optional camera gesture mode.

## Requirements
- Node.js 18 or newer
- Two devices with a modern browser
- Network access to the same deployed app/server for signaling

## Run locally
```bash
npm install
npm start
```
Open `http://localhost:3000` on your computer. To test a second device on the same Wi-Fi, open `http://YOUR_COMPUTER_LAN_IP:3000` on the second device (firewall must allow port 3000). Camera access and some browser APIs require HTTPS outside localhost.

## Pair and transfer
1. Open Mera Gallery on both devices.
2. Enter the same pairing code on both and press **Connect**.
3. Wait for the WebRTC data channel to connect.
4. Choose photos on the sender, select them, press **Send selected**, then confirm.
5. On the receiver, use **Save** on the received file card to download it.

## Deployment / production notes
- Deploy behind HTTPS (for example, a Node-compatible host with TLS).
- For connections across restrictive networks, configure a TURN server. Add your TURN credentials to the `iceServers` list in `public/index.html`.
- The included signaling server relays connection negotiation only. File data is sent over an encrypted WebRTC data channel when a direct connection succeeds; this demo does not implement TURN relay credentials or persistent server-side storage.
- The optional hand-gesture model loads MediaPipe from a CDN and needs camera permission. Gesture recognition is a best-effort prototype; explicit send confirmation is always required.
- Pairing codes are temporary room identifiers, not a complete account or identity system. For public production use, add rate limiting, authenticated short-lived pairing tokens, stronger peer verification, and abuse controls.

## Limitations
- Browser photo access is user-selected; web apps cannot silently scan all local gallery contents.
- Web Bluetooth is intentionally not required because support is inconsistent across browsers and devices.
- This prototype uses a public STUN server. A TURN server is recommended for reliable cross-network connections.

## Public hosting on Render
1. Upload the contents of this project folder to a new GitHub repository.
2. In Render, choose **New → Blueprint** and connect that repository; Render will read `render.yaml`.
3. Deploy and wait for the build to finish. Your public HTTPS address will appear in the Render dashboard, typically `https://mera-gallery.onrender.com` (the exact URL depends on availability/name).
4. Share that actual URL with friends. Both devices must open the deployed site and enter the same pairing code.

The free web service may sleep after inactivity and take time to wake up. WebRTC connections can fail on some networks without a configured TURN server; this project currently uses STUN only. Public deployment is not a substitute for security hardening or two-device testing.
