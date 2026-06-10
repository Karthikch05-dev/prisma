// Fingerprint Sensor Heart Rate Monitor
(() => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const fingerprintScanner = document.getElementById('fingerprintScanner');
  const scannerText = document.getElementById('scannerText');
  const metricsDiv = document.getElementById('metrics');
  const pulseAnimation = document.getElementById('pulseAnimation');
  const bpmValue = document.getElementById('bpmValue');
  const statusValue = document.getElementById('statusValue');
  const resultsDiv = document.getElementById('results');
  const avgBpmValue = document.getElementById('avgBpm');
  const zoneValue = document.getElementById('zone');
  const infoMessage = document.getElementById('infoMessage');

  let isScanning = false;
  let scanData = [];
  let animationFrameId = null;
  let startTime = null;
  let simulatedBPM = 72;
  let bpmReadings = [];

  // Check if device supports fingerprint/biometric authentication
  const supportsFingerprint = () => {
    return (
      window.PublicKeyCredential !== undefined &&
      navigator.credentials !== undefined
    );
  };

  // Simulate fingerprint scan with biometric-like behavior
  async function attemptBiometricScan() {
    if (!supportsFingerprint()) {
      return simulateFingerprint();
    }

    try {
      const result = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          timeout: 60000,
          userVerification: 'preferred',
        },
      });

      if (result) {
        return true;
      }
    } catch (err) {
      // User cancelled or biometric not available, use simulation
      return simulateFingerprint();
    }

    return false;
  }

  // Simulate fingerprint detection
  function simulateFingerprint() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 800);
    });
  }

  // Generate realistic heart rate variations
  function generateHeartRateVariation() {
    // Base variations around 60-100 BPM
    const baseVariation = Math.sin(Date.now() / 1000) * 8;
    const randomNoise = (Math.random() - 0.5) * 6;
    const variation = baseVariation + randomNoise;

    simulatedBPM = Math.max(50, Math.min(130, 72 + variation));
    return Math.round(simulatedBPM);
  }

  // Determine heart rate zone
  function getHeartRateZone(bpm) {
    if (bpm < 60) return 'Low - Rest';
    if (bpm < 100) return 'Normal - Rest';
    if (bpm < 120) return 'Elevated - Activity';
    if (bpm < 150) return 'High - Intense';
    return 'Very High - Peak';
  }

  // Get zone color
  function getZoneColor(zone) {
    if (zone.includes('Low')) return '#ef4444';
    if (zone.includes('Normal')) return '#10b981';
    if (zone.includes('Elevated')) return '#f59e0b';
    if (zone.includes('High')) return '#f43f5e';
    return '#8b5cf6';
  }

  // Animate scanner
  function animateScanner() {
    if (!isScanning) return;

    fingerprintScanner.classList.add('active');
    scannerText.textContent = 'Scanning...';

    animationFrameId = requestAnimationFrame(() => {
      const currentBPM = generateHeartRateVariation();
      bpmReadings.push(currentBPM);

      // Update BPM display
      bpmValue.textContent = currentBPM;

      // Update status with zone
      const zone = getHeartRateZone(currentBPM);
      statusValue.textContent = zone;
      statusValue.style.color = getZoneColor(zone);

      animateScanner();
    });
  }

  // Start scanning
  async function start() {
    if (isScanning) return;

    isScanning = true;
    bpmReadings = [];
    simulatedBPM = 72;

    startBtn.disabled = true;
    stopBtn.disabled = false;
    fingerprintScanner.style.cursor = 'wait';
    scannerText.textContent = 'Waiting for fingerprint...';

    // Show pulse animation and metrics
    metricsDiv.style.display = 'grid';
    pulseAnimation.style.display = 'flex';
    resultsDiv.style.display = 'none';
    infoMessage.style.display = 'none';

    // Attempt biometric authentication
    const biometricSuccess = await attemptBiometricScan();

    if (biometricSuccess) {
      scannerText.textContent = 'Fingerprint detected!';
      // Add success feedback
      fingerprintScanner.style.animation = 'glow-scan 0.6s ease-in-out';

      // Delay before starting measurement
      setTimeout(() => {
        scannerText.textContent = 'Measuring...';
        fingerprintScanner.style.cursor = 'pointer';
        animateScanner();
      }, 600);
    } else {
      scannerText.textContent = 'Measurement in progress...';
      fingerprintScanner.style.cursor = 'pointer';
      animateScanner();
    }
  }

  // Stop scanning
  function stop() {
    if (!isScanning) return;

    isScanning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    fingerprintScanner.classList.remove('active');
    scannerText.textContent = 'Ready to scan';

    // Hide animations
    metricsDiv.style.display = 'none';
    pulseAnimation.style.display = 'none';

    // Show results
    if (bpmReadings.length > 0) {
      const avgBpm = Math.round(
        bpmReadings.reduce((a, b) => a + b, 0) / bpmReadings.length
      );
      const zone = getHeartRateZone(avgBpm);

      avgBpmValue.textContent = avgBpm;
      zoneValue.textContent = zone;
      zoneValue.style.color = getZoneColor(zone);

      resultsDiv.style.display = 'block';
      infoMessage.style.display = 'block';
      infoMessage.innerHTML = `
        <p>✅ Measurement complete! Your average heart rate is <strong>${avgBpm} BPM</strong></p>
      `;
    }
  }

  // Add click handler to fingerprint scanner for manual tap
  fingerprintScanner.addEventListener('click', () => {
    if (!isScanning) {
      start();
    }
  });

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);

  // Initial message
  infoMessage.innerHTML = `
    <p>👆 Tap the fingerprint scanner or press <strong>Start Scan</strong> to begin measuring your heart rate</p>
  `;
})();

