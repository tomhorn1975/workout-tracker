import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Scanner() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let scanner;

    async function startScanner() {
      setScanning(true);
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (text) => {
            const match = text.match(/^machine:(\d+)$/);
            if (match) {
              scanner.stop().then(() => scanner.clear()).catch(() => {});
              navigate(`/machine/${match[1]}`);
            } else {
              setError('Unrecognized QR code. Please scan a machine label.');
            }
          },
          () => {}
        );
      } catch (err) {
        setError('Camera access denied. Please allow camera permissions and try again.');
        setScanning(false);
      }
    }

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => scannerRef.current.clear()).catch(() => {});
      }
    };
  }, [navigate]);

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1>Scan QR Code</h1>
      </div>

      <p className="text-muted" style={{ marginBottom: 16 }}>
        Point your camera at the QR code on the machine
      </p>

      <div className="scanner-wrap">
        <div id="qr-reader" />
      </div>

      {error && (
        <div style={{ marginTop: 16, padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8 }}>
          <p className="text-danger">{error}</p>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => setError('')}>
            Dismiss
          </button>
        </div>
      )}

      {scanning && !error && (
        <p className="text-muted" style={{ marginTop: 16, textAlign: 'center', fontSize: 14 }}>
          Scanning...
        </p>
      )}
    </div>
  );
}
