// Simple camera PPG implementation (works best on Chrome/Android)
(() => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const bpmEl = document.querySelector('.bpm');
  const statusEl = document.querySelector('.status');

  const ctx = canvas.getContext('2d');
  let stream = null;
  let raf = null;
  let samples = [];
  const SAMPLE_SEC = 10; // seconds of data to analyze
  const FPS = 30;

  function setStatus(s){ statusEl.textContent = s; }

  async function start() {
    setStatus('Starting camera...');
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: { ideal: 'environment' } }, audio: false });
      video.srcObject = stream;
      await video.play();

      // Try enabling torch if available (mobile Chrome)
      try {
        const track = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        const capabilities = await imageCapture.getPhotoCapabilities();
        if (capabilities.fillLightMode && capabilities.fillLightMode.includes('flash')) {
          // Can't directly enable flash here reliably; leaving as best-effort
        }
      } catch (e) {
        // ignore
      }

      samples = [];
      setStatus('Measuring — keep finger over camera');
      startBtn.disabled = true; stopBtn.disabled = false;
      loop();
    } catch (err) {
      console.error(err);
      setStatus('Camera access denied or unavailable');
    }
  }

  function stop(){
    setStatus('Stopped');
    startBtn.disabled = false; stopBtn.disabled = true;
    if (raf) cancelAnimationFrame(raf);
    if (stream) {
      stream.getTracks().forEach(t=>t.stop());
      stream = null;
    }
  }

  function loop(){
    if (!video || video.readyState < 2) {
      raf = requestAnimationFrame(loop);
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // average red channel
    let sum = 0;
    for (let i = 0; i < img.data.length; i += 4) sum += img.data[i];
    const avg = sum / (img.data.length / 4);
    const t = Date.now();
    samples.push({t, v: avg});
    // keep window
    const windowMs = SAMPLE_SEC * 1000;
    const cutoff = t - windowMs;
    samples = samples.filter(s => s.t >= cutoff);

    // compute bpm when we have enough
    if (samples.length > 10) {
      const bpm = computeBPM(samples);
      if (bpm) bpmEl.innerHTML = Math.round(bpm) + ' <span>BPM</span>';
    }

    raf = requestAnimationFrame(loop);
  }

  // naive BPM via peak detection on detrended signal
  function computeBPM(samples){
    // extract values
    const values = samples.map(s => s.v);
    const times = samples.map(s => s.t);
    // detrend by subtracting moving average
    const mean = values.reduce((a,b)=>a+b,0)/values.length;
    const detr = values.map(v=>v-mean);
    // simple smoothing
    const smooth = movingAverage(detr, 3);
    // detect peaks
    const peaks = [];
    for (let i = 1; i < smooth.length-1; i++){
      if (smooth[i] > smooth[i-1] && smooth[i] > smooth[i+1] && smooth[i] > 2) { // threshold empirical
        peaks.push(times[i]);
      }
    }
    if (peaks.length < 2) return null;
    const intervals = [];
    for (let i = 1; i < peaks.length; i++) intervals.push((peaks[i]-peaks[i-1])/1000.0);
    const avgInterval = intervals.reduce((a,b)=>a+b,0)/intervals.length;
    const bpm = 60.0 / avgInterval;
    if (bpm < 35 || bpm > 220) return null;
    return bpm;
  }

  function movingAverage(arr, n){
    const out = [];
    for (let i = 0; i < arr.length; i++){
      let start = Math.max(0, i - Math.floor(n/2));
      let end = Math.min(arr.length, start + n);
      const slice = arr.slice(start, end);
      out.push(slice.reduce((a,b)=>a+b,0)/slice.length);
    }
    return out;
  }

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);
})();
