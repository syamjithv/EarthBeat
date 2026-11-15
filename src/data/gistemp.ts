export const GISTEMP_URL =
  'https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts%2BdSST.txt';
export const CLIMATE_SPIRAL_START_YEAR = 1880;
export const CLIMATE_SPIRAL_END_YEAR = 2022;

export type MonthlyObservation = {
  year: number;
  month: number;
  anomaly: number;
  date: string;
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export async function fetchGistemp(signal?: AbortSignal): Promise<MonthlyObservation[]> {
  const response = await fetch(GISTEMP_URL, { signal });
  if (!response.ok) {
    throw new Error(`NASA data request failed (${response.status}).`);
  }
  return parseGistemp(await response.text()).filter(
    ({ year }) => year >= CLIMATE_SPIRAL_START_YEAR && year <= CLIMATE_SPIRAL_END_YEAR,
  );
}

export function parseGistemp(raw: string): MonthlyObservation[] {
  const lines = raw.split(/\r?\n/);
  const observations: MonthlyObservation[] = [];

  for (const line of lines) {
    const columns = line.trim().split(/\s+/);
    if (columns.length < 13 || !/^\d{4}$/.test(columns[0])) {
      continue;
    }

    const year = Number(columns[0]);
    for (let month = 1; month <= 12; month += 1) {
      const value = columns[month];
      if (!value || value === '*' || value.includes('*')) continue;
      const encoded = Number(value);
      if (!Number.isFinite(encoded)) continue;
      observations.push({
        year,
        month,
        anomaly: encoded / 100,
        date: `${year}-${String(month).padStart(2, '0')}`,
      });
    }
  }

  validateObservations(observations);
  return observations;
}

function validateObservations(observations: MonthlyObservation[]) {
  if (observations.length === 0) throw new Error('NASA data contained no valid monthly observations.');
  for (let index = 1; index < observations.length; index += 1) {
    const previous = observations[index - 1];
    const current = observations[index];
    if (current.year < previous.year || (current.year === previous.year && current.month <= previous.month)) {
      throw new Error('NASA data is not ordered chronologically.');
    }
  }
}

export function formatDate(observation: MonthlyObservation) {
  return `${MONTH_NAMES[observation.month - 1]} ${observation.year}`;
}

