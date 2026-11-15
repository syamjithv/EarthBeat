import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, ArrowDown, ExternalLink, Info, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { Area, AreaChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { anomalyToFrequency, SonificationEngine } from './audio/sonification';
import { fetchGistemp, formatDate, GISTEMP_URL, type MonthlyObservation } from './data/gistemp';

const NASA_VISUAL_URL = 'https://svs.gsfc.nasa.gov/5057/';

function App() {
  const [observations, setObservations] = useState<MonthlyObservation[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(0.6);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [audioError, setAudioError] = useState('');
  const engine = useRef(new SonificationEngine());

  useEffect(() => {
    const controller = new AbortController();
    fetchGistemp(controller.signal)
      .then((data) => {
        setObservations(data);
        setStatus('ready');
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : 'NASA data could not be loaded.');
          setStatus('error');
        }
      });
    return () => {
      controller.abort();
      engine.current.dispose();
    };
  }, []);

  const current = observations[index];
  const chartData = useMemo(() => observations, [observations]);
  const progress = observations.length ? (index / (observations.length - 1)) * 100 : 0;

  useEffect(() => {
    if (!playing || !current) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (index >= observations.length - 1) {
        setPlaying(false);
        return;
      }
      setIndex((value) => value + 1);
    }, 850 / speed);
    void engine.current.start(current, volume).catch(() => {
      if (!cancelled) {
        setPlaying(false);
        setAudioError('Browser audio could not start. Press Play again after interacting with the page.');
      }
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      engine.current.stop();
    };
  }, [playing, index, observations.length, current, speed]);

  useEffect(() => {
    engine.current.setVolume(volume);
  }, [volume]);

  function togglePlayback() {
    if (!current) return;
    setPlaying((value) => !value);
  }

  function restart() {
    setPlaying(false);
    engine.current.stop();
    setIndex(0);
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="EarthBeat home"><span className="brand-mark">◒</span> EARTHBEAT</a>
        <nav><a href="#studio">Studio</a><a href="#method">Method</a><a href="#sources">Sources</a></nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> NASA GISTEMP v4 · 1880—2022</p>
          <h1>Hear the pulse<br />of our planet.</h1>
          <p className="hero-lede">Every shift in Earth&apos;s temperature tells a story. Discover the patterns behind our changing climate through sound.</p>
          <a className="primary-button" href="#studio">Enter the experience <ArrowDown size={16} /></a>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="planet"><span /></div>
          <p className="orbit-label">GLOBAL<br /><strong>ANOMALY</strong></p>
        </div>
      </section>

      <section className="studio-section" id="studio">
        <div className="section-heading">
          <div><p className="eyebrow">01 / THE STUDIO</p><h2>A living record,<br /><em>made audible.</em></h2></div>
          <p className="section-intro">Move through 143 years of monthly NASA observations. Each note is generated from the anomaly at that moment in the record.</p>
        </div>
        <div className="studio-grid">
          <div className="visual-panel">
            <div className="panel-label"><span>NASA CLIMATE SPIRAL</span><span className="muted">CONTEXTUAL VISUAL</span></div>
            <div className="visual-frame">
              <iframe className="nasa-frame" src={NASA_VISUAL_URL} title="NASA Climate Spiral official visualization page" />
              <div className="visual-caption"><span>{current ? formatDate(current) : 'Loading observation'}</span><a href={NASA_VISUAL_URL} target="_blank" rel="noreferrer">Open official NASA visual <ExternalLink size={13} /></a></div>
            </div>
            <p className="disclaimer"><Info size={14} /> NASA&apos;s visualization and EarthBeat&apos;s data clock are shown as related context. Exact video-frame/month synchronization is not claimed.</p>
          </div>
          <div className="data-panel">
            <div className="panel-label"><span>MONTHLY TEMPERATURE ANOMALY</span><span className="unit">°C · 1951—1980 BASELINE</span></div>
            <div className="readout" aria-live="polite"><span className="date">{current ? formatDate(current) : '—'}</span><strong>{current ? `${current.anomaly >= 0 ? '+' : ''}${current.anomaly.toFixed(2)}` : '—'}</strong><span>°C</span><small>{current ? `${anomalyToFrequency(current.anomaly).toFixed(0)} Hz` : '—'}</small></div>
            <div className="chart-wrap">
              {status === 'loading' && <div className="state">Loading NASA observations…</div>}
              {status === 'error' && <div className="state error-state">Unable to load NASA data. Check your connection and retry the page.<br /><a href={GISTEMP_URL}>Open source file <ExternalLink size={13} /></a></div>}
              {status === 'ready' && <ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#54d8e5" stopOpacity={0.38} /><stop offset="100%" stopColor="#54d8e5" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#718097', fontSize: 11 }} minTickGap={45} tickFormatter={(value) => value.slice(0, 4)} /><YAxis domain={[-1.2, 1.6]} tickLine={false} axisLine={false} tick={{ fill: '#718097', fontSize: 11 }} tickFormatter={(value) => `${value}°`} width={38} /><Tooltip contentStyle={{ background: '#101c2e', border: '1px solid #26415b', borderRadius: 4 }} labelStyle={{ color: '#b7c8db' }} formatter={(value: number) => [`${value.toFixed(2)} °C`, 'Anomaly']} /><Area type="monotone" dataKey="anomaly" stroke="#62d9e3" strokeWidth={1.5} fill="url(#chartFill)" isAnimationActive={false} dot={false} /><ReferenceDot x={current?.date} y={current?.anomaly} r={5} fill="#e7ffff" stroke="#54d8e5" strokeWidth={2} ifOverflow="visible" /></AreaChart></ResponsiveContainer>}
            </div>
            <div className="timeline"><div className="timeline-fill" style={{ width: `${progress}%` }} /><input aria-label="Observation timeline" type="range" min="0" max={Math.max(0, observations.length - 1)} value={index} onChange={(event) => { setPlaying(false); setIndex(Number(event.target.value)); }} disabled={!observations.length} /></div>
            <div className="timeline-labels"><span>1880</span><span>2022</span></div>
          </div>
        </div>
        <div className="controls">
          <button className="play-button" onClick={togglePlayback} disabled={status !== 'ready'} aria-label={playing ? 'Pause playback' : 'Play playback'}>{playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />} {playing ? 'Pause' : 'Play'}</button>
          <button className="icon-button" onClick={restart} aria-label="Restart playback"><RotateCcw size={17} /></button>
          <label className="control-select">SPEED <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))}><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={1.5}>1.5×</option><option value={2}>2×</option></select></label>
          <label className="volume"><Volume2 size={16} /><input aria-label="Volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label>
          <span className="control-status"><Activity size={15} /> {playing ? 'SONIFICATION ACTIVE' : 'READY TO LISTEN'}</span>
        </div>
        {audioError && <p className="audio-error" role="alert">{audioError}</p>}
      </section>

      <section className="method-section" id="method">
        <div className="method-number">02</div><div><p className="eyebrow">WHAT YOU ARE HEARING</p><h2>One measurement.<br /><em>One note.</em></h2></div>
        <div className="method-copy"><p>A temperature anomaly is the difference between a month&apos;s measured global average and a reference average. NASA uses 1951–1980 as that baseline. EarthBeat maps each anomaly to a gentle pitch: cooler values sit lower; warmer values rise higher. The sound is a creative translation of the data—not a sound emitted by Earth.</p><div className="formula"><span>-1.0 °C</span><strong>→</strong><span>220 Hz</span><span>+1.5 °C</span><strong>→</strong><span>660 Hz</span></div></div>
      </section>

      <section className="sources-section" id="sources"><div><p className="eyebrow">03 / DATA & SOURCES</p><h2>Grounded in<br /><em>observation.</em></h2></div><div className="source-list"><a href={GISTEMP_URL} target="_blank" rel="noreferrer"><span>NASA GISTEMP v4</span><ExternalLink size={15} /></a><a href={NASA_VISUAL_URL} target="_blank" rel="noreferrer"><span>NASA Climate Spiral · SVS 5057</span><ExternalLink size={15} /></a><p>NASA data uses a 1951–1980 baseline and may be revised as the source is updated. EarthBeat is an independent NASA Space Apps Challenge project and is not an official NASA product.</p></div></section>
      <footer><span>EARTHBEAT © 2026</span><span>NASA SPACE APPS CHALLENGE</span></footer>
    </main>
  );
}

export default App;
