# Buru Unit — React Frontend (Prototype 2)

## Setup

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` → proxies API calls to `http://localhost:3000`

## Architecture

**State Management:** Single App.tsx component orchestrates 6 screens via state
- `Welcome` → `CardInfo` → `GyroAlign` → `CameraCapture` → `Processing` → `Result`

**Real Integrations:**
- ✅ Camera stream via `getUserMedia()` (GyroAlign captures frame to canvas)
- ✅ Gyroscope via `DeviceOrientationEvent` (real device orientation handling)
- ✅ API `/api/scan` endpoint (POST measurements, receive Buru ID)

**Mock Placeholder:**
- 🔲 Foot measurements (realistic random ranges; replace with TensorFlow.js in Phase 2)

## Key Files

- `src/App.tsx` — Main state + camera/API orchestration
- `src/screens/*.tsx` — 6 screen components
- `src/App.css` — Adapted from original index.html
- `vite.config.ts` — Proxy config for backend

## Phase 2 (Deferred)

Replace mock measurements in `handleCapture()`:
1. Load TensorFlow.js Lite model
2. Run foot landmark detection on canvas frame
3. Extract length, width, instep from keypoints
4. Send real measurements to `/api/scan`

## Testing

### With Device Gyroscope:
- Run on real iOS/Android device (HTTPS or localhost via ngrok)
- Grant device orientation permission when prompted
- GyroAlign screen responds to actual phone angle

### Desktop Testing:
- Gyro values default to simulated oscillation
- Camera requires webcam or mock (e.g., Chrome DevTools Device Emulation)
- Full flow runs end-to-end

## Notes

- **CORS:** Vite dev server proxies `/api` → `localhost:3000`
- **Mobile Camera:** Requires HTTPS in production; localhost works on Android Chrome
- **iOS 13+:** DeviceOrientationEvent requires user gesture + permission request
- Buru ID auto-copies to clipboard on result screen
