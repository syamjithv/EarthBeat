# EarthBeat implementation plan

> Historical implementation record. The current application is implemented;
> use the README and architecture documents as the source of truth for running
> and extending the project.

## Phase 1 — source-backed data layer

1. Scaffold Vite React TypeScript application.
2. Fetch and parse the official GISTEMP table.
3. Validate headers, units, baseline metadata, date ordering, and missing
   values.
4. Render a real anomaly chart and explicit loading/error states.

## Phase 2 — experience interface

1. Add the editorial landing section and responsive studio layout.
2. Add the NASA visualization using an asset URL verified from the SVS page/API.
3. Add source, attribution, and limitation copy.

## Phase 3 — sonification

1. Implement the documented deterministic anomaly-to-frequency formula.
2. Add user-initiated play, pause, resume, restart, speed, and volume.
3. Synchronize the data clock, chart active point, text readout, and waveform.
4. Test audio node cleanup and duplicate-playback prevention.

## Phase 4 — audit

1. Test keyboard and mobile layouts, reduced motion, and network failures.
2. Check browser console output and production build.
3. Verify that every displayed scientific value comes from the NASA source.
4. Complete README, attribution, methodology, and known limitations.

## Current status

The source-backed React application, runtime NASA data loading, chart,
deterministic Web Audio sonification, responsive interface, attribution, and
documentation are implemented. Exact NASA video-frame/month synchronization
remains intentionally unclaimed until the official media metadata supports
that relationship.
