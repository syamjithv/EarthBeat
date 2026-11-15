# EarthBeat data sources

## NASA GISTEMP v4

NASA GISS Surface Temperature Analysis (GISTEMP v4) is the source of monthly
global surface temperature anomalies:

- Data landing page: <https://data.giss.nasa.gov/gistemp/>
- Tabular data documentation: <https://data.giss.nasa.gov/gistemp/data_v4.html>
- Global monthly LOTI table: <https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts%2BdSST.txt>

The table contains deviations from the 1951–1980 mean. Values are encoded in
hundredths of a degree Celsius and must be divided by 100 after parsing. NASA
uses `***` for unavailable values; those records are excluded from playback
and chart points rather than converted to zero.

## NASA Climate Spiral

EarthBeat references NASA Scientific Visualization Studio’s official Climate
Spiral page:

- Visualization page: <https://svs.gsfc.nasa.gov/5057/>
- Official metadata API: <https://svs.gsfc.nasa.gov/api/5057>

The page describes monthly global anomalies from 1880–2022 and provides
official downloadable visualization variants, including 30 fps/60 second and
60 fps/30 second versions. The implementation must use an asset URL obtained
from that page or API; it must not guess a media URL.

## Attribution and limitations

NASA data and visualization remain NASA resources. EarthBeat adds its own
interface and generated audio. GISTEMP is an estimate of global surface
temperature change, and the latest values may be revised as NASA updates the
dataset. EarthBeat currently limits the fetched records to 1880–2022 to match
the referenced Climate Spiral experience.

## NASA Earth Information Center

The project responds to NASA’s Earth Information Jukebox challenge, which
encourages experiences that pair Earth Information Center visual material with
dynamic sonification. The Climate Spiral is the NASA Scientific Visualization
Studio resource used by this project; EarthBeat does not claim to reproduce or
replace the EIC interface.

