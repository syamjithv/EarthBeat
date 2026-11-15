# EarthBeat architecture

EarthBeat is a small client-side React application. It has no backend,
database, authentication, API key, or AI runtime dependency.

```text
src/
├── App.tsx                    page composition, playback state, controls
├── audio/
│   └── sonification.ts        Web Audio lifecycle and mapping formula
├── data/
│   └── gistemp.ts             NASA fetch, parser, validation, date formatting
├── main.tsx                   React entry point
└── styles.css                 responsive editorial visual system
```

The browser fetches NASA’s official GISTEMP v4 text table, parses valid monthly
records, and limits the experience to 1880–2022 to match NASA’s Climate Spiral
version. The chart and timeline use those observations directly. The audio
module maps the active anomaly to a frequency and manages oscillator and gain
nodes.

The NASA Climate Spiral page is embedded as contextual NASA material. EarthBeat
does not claim exact video-frame/month synchronization because that relationship
has not been independently verified.

See [`docs/architecture.mmd`](docs/architecture.mmd) and
[`docs/data-flow.mmd`](docs/data-flow.mmd) for renderable Mermaid diagrams.
