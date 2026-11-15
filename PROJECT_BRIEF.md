# EarthBeat project brief

## Purpose

EarthBeat is an independent NASA Space Apps Challenge 2026 experience for
“The Earth Information Jukebox.” It lets visitors hear a deterministic musical
representation of monthly global temperature anomalies while viewing NASA’s
Climate Spiral context.

## Scientific source of truth

- Dataset: NASA GISS Surface Temperature Analysis (GISTEMP v4), global
  Land-Ocean Temperature Index (LOTI), monthly anomalies.
- Period represented by the NASA Climate Spiral: 1880–2022.
- Unit: degrees Celsius anomaly.
- Baseline: 1951–1980 mean.
- Missing values must remain missing; they are never replaced with generated
  observations.

## Product boundaries

The first release is a static React application with browser-native audio.
It does not require authentication, a database, a backend, or an AI service.
NASA data and visualization links remain visible, and the app is clearly
identified as an independent project rather than a NASA product.

## Main risks

1. NASA source files and visualization media can change or be unavailable at
   runtime; loading and error states are required.
2. The downloadable video duration is not the same thing as a
   frame-accurate month-by-month data stream. Unless a frame mapping is
   verified, the UI must label video playback and data playback separately.
3. Web Audio requires a user gesture and careful cleanup on pause, restart, and
   unmount.
4. The plain-text table is designed for people to read, so parsing must
   validate headers, ordering, missing values, and the expected date range.

