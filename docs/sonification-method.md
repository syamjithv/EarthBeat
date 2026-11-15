# Sonification methodology

EarthBeat uses a deterministic, intentionally simple mapping so that the
relationship between a NASA observation and a generated note can be explained
and reproduced.

## Input

The input is one validated monthly global Land-Ocean Temperature Index anomaly
from NASA GISTEMP v4. Values are expressed in degrees Celsius relative to the
1951–1980 reference baseline. Missing values marked by NASA with `***` are not
converted into sound or zero.

## Formula

The configured anomaly domain is `[-1.0, +1.5] °C`. Values outside this
creative listening range are clamped, then mapped linearly to `[220, 660] Hz`:

```text
clamped = min(1.5, max(-1.0, anomaly))
frequencyHz = 220 + ((clamped + 1.0) / 2.5) × 440
```

Therefore:

- `-1.0 °C` maps to `220 Hz`.
- `+1.5 °C` maps to `660 Hz`.
- Higher anomalies produce higher pitches.

## Audio behavior

The browser Web Audio API creates a short sine oscillator for each monthly
record. A gain envelope fades each note in and out at a low amplitude to reduce
clicks and clipping. Audio begins only after the user presses Play. The active
record drives the date, anomaly readout, chart marker, and frequency readout.

This is an artistic representation of measurements. It is not a recording of
sound from Earth and should not be interpreted as a literal physical signal.
