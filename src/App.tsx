import { useState, useEffect, useRef } from 'react';
import './App.css';

// ✅ CORRECT IMPORTS
import { useCamera, useGyroscope } from './hooks';
import { submitScan, checkHealth, getProfile } from './lib/api';
import type { ScreenState, MeasurementData, ResultData } from './types';

// Screen components
import Welcome from './screens/Welcome';
import CardInfo from './screens/CardInfo';
import GyroAlign from './screens/GyroAlign';
import CameraCapture from './screens/CameraCapture';
import Processing from './screens/Processing';
import Result from './screens/Result';

const App: React.FC = () => {
  // State
  const [phase, setPhase] = useState<ScreenState>('welcome');
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [measurements, setMeasurements] = useState<MeasurementData | null>(null);

  // ✅ CORRECT: Hooks take NO arguments
  const { videoRef, startCamera, stopCamera } = useCamera();
  const { rotation, isAligned, error: gyroError } = useGyroscope();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-start camera when entering scan phase
  useEffect(() => {
    if (phase === 'scan') {
      startCamera().catch(err => {
        setError('Camera permission denied or unavailable');
        console.error(err);
      });
    } else {
      stopCamera();
    }
  }, [phase, startCamera, stopCamera]);

  // Mock measurement generation (MVP - real TensorFlow.js in Phase 2)
  const generateMockMeasurements = (): MeasurementData => {
    const length = 255 + Math.random() * 20;
    const width = 90 + Math.random() * 12;
    const instep = 62 + Math.random() * 8;
    const confidence = 91 + Math.random() * 7;
    return {
      length: Math.round(length),
      width: Math.round(width),
      instep: Math.round(instep),
      confidence: Math.round(confidence),
    };
  };

  const handleStartScan = () => {
    setError(null);
    setPhase('gyro');
  };

  const handleLearnCard = () => {
    setPhase('card');
  };

  const handleCardDone = () => {
    setPhase('gyro');
  };

  const handleGyroLocked = () => {
    setPhase('scan');
  };

  const handleCaptureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Capture video frame
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);

    // Generate mock measurements
    // TODO: Replace with real TensorFlow.js in Phase 2
    const meas = generateMockMeasurements();
    setMeasurements(meas);
    setPhase('process');
    
    // Send to backend
    await sendToBackend(meas);
  };

  const sendToBackend = async (meas: MeasurementData) => {
    setProcessing(true);
    try {
      const response = await submitScan({
        length_mm: meas.length,
        width_mm: meas.width,
        instep_mm: meas.instep,
        confidence: meas.confidence,
      });

      const euSize = Math.round((meas.length / 6.67) + 1);

      const resultData: ResultData = {
        ...meas,
        buruId: response.buru_id,
        euSize,
      };

      setResult(resultData);

      // Wait for processing animation, then show result
      setTimeout(() => {
        setProcessing(false);
        setPhase('result');
      }, 2500);
    } catch (err) {
      setError(`Failed to generate Buru ID: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setProcessing(false);
      setPhase('scan');
    }
  };

  const handleScanAgain = () => {
    setPhase('gyro');
    setResult(null);
    setMeasurements(null);
    setError(null);
  };

  return (
    <div id="app">
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Screen routing */}
      {phase === 'welcome' && (
        <Welcome
          onStart={handleStartScan}
          onLearnCard={handleLearnCard}
        />
      )}

      {phase === 'card' && (
        <CardInfo onGotIt={handleCardDone} />
      )}

      {phase === 'gyro' && (
        <GyroAlign
          locked={isAligned}
          onLock={handleGyroLocked}
        />
      )}

      {phase === 'scan' && (
        <CameraCapture
          videoRef={videoRef}
          onCapture={handleCaptureFrame}
        />
      )}

      {phase === 'process' && (
        <Processing measurements={measurements} />
      )}

      {phase === 'result' && result && (
        <Result
          result={result}
          onScanAgain={handleScanAgain}
        />
      )}

      {/* Error banner */}
      {error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '12px',
          background: '#f54a4a',
          color: '#fff',
          fontSize: '12px',
          zIndex: 999,
        }}>
          {error}
          {gyroError && ` (Gyro: ${gyroError})`}
        </div>
      )}
    </div>
  );
};

export default App;
