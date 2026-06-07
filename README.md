# Smart Heart Monitor — Mobile PPG Demo

This project demonstrates a simple mobile-friendly heart rate (BPM) measurement using the phone camera (PPG — photoplethysmography). The client UI is served from `public/` and measures pulse by analyzing the red channel of the camera frames.

Important: This is a demo, not a medical device. Accuracy varies by device, lighting, and user technique.

Quick run (local)
1. Build TypeScript server (optional — only required if you want to run the local Express server):

```bash
npm run build
node dist/index.js
```

2. Open the site from your mobile browser (same network) or visit `http://localhost:4000/` on the machine itself. For mobile testing from another device, replace `localhost` with your PC's LAN IP.

Usage
- Place your fingertip gently over the rear camera (and flash if available). Keep still and press Start.
- Wait 8-12 seconds for the measurement to stabilize.
- Results appear as BPM in the UI.

Notes, limitations & recommendations
- Fingerprint sensors cannot be used to measure heart rate in the browser. The camera+flash method is the practical in-browser approach.
- Works best on Chrome for Android. iOS Safari support varies.
- For better results:
  - Use the rear camera (not the selfie camera).
  - Keep steady, apply gentle pressure over the lens.
  - Avoid strong external light or completely dark conditions.
- Accuracy is not guaranteed — do not use for medical decisions.

Vercel deployment
- The project includes `vercel.json` to serve the `public/` folder as a static site. To deploy the UI to Vercel:

```bash
git add public vercel.json
git commit -m "Add PPG UI and Vercel static config"
git push
# Vercel will auto-deploy on push (or use the Vercel dashboard to deploy)
```

If you want a server-side API (e.g., to store measurements in a DB via Prisma), we can add Vercel Serverless Functions or host the Express server differently — tell me what you prefer and I'll implement it.
