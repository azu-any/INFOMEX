export const YEARS = ['2014', '2018', '2022'];
export const WEEKS = ['W1', 'W2', 'W3', 'W4'];
export const DAYS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];

export const REGIONS_HIERARCHY = {
  Mexico: {
    Puebla: ['Cholula', 'Puebla City'],
    'Nuevo León': ['Monterrey', 'San Pedro'],
  },
  USA: {
    Texas: ['Austin', 'Dallas'],
    Arizona: ['Phoenix', 'Tucson'],
  },
} as const;

export const ROUNDS = [
  'Group Stage',
  'Round of 16',
  'Quarter-Final',
  'Semi-Final',
  'Final',
];

export interface RawDataPoint {
  year: string;
  week: string;
  day: string;
  country: string;
  state: string;
  city: string;
  round: string;
  rating: number; // 0.0 to 100.0
}

export interface AggregatedDataPoint {
  timeLabel: string;
  regionLabel: string;
  roundLabel: string;
  rating: number;
}

export async function fetchRawData(): Promise<RawDataPoint[]> {
  // We use import.meta.env.BASE_URL to ensure it works locally and on GitHub Pages
  const response = await fetch(`${import.meta.env.BASE_URL}data.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch database export');
  }
  
  // We add an artificial delay to simulate a real SQL Database query over the network
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const data: RawDataPoint[] = await response.json();
  return data;
}

export function aggregateData(
  rawData: RawDataPoint[],
  timePath: string[], // e.g. [] (Year level), ['2022'] (Week level), ['2022', 'W1'] (Day level)
  regionPath: string[], // e.g. [] (Country level), ['Mexico'] (State level), ['Mexico', 'Puebla'] (City level)
): { points: AggregatedDataPoint[]; timeLabels: string[]; regionLabels: string[] } {
  
  // 1. Filter Data based on drill-down paths
  let filtered = rawData;
  if (timePath.length > 0) filtered = filtered.filter((d) => d.year === timePath[0]);
  if (timePath.length > 1) filtered = filtered.filter((d) => d.week === timePath[1]);
  
  if (regionPath.length > 0) filtered = filtered.filter((d) => d.country === regionPath[0]);
  if (regionPath.length > 1) filtered = filtered.filter((d) => d.state === regionPath[1]);

  // 2. Determine Grouping Keys
  const timeKey = timePath.length === 0 ? 'year' : timePath.length === 1 ? 'week' : 'day';
  const regionKey = regionPath.length === 0 ? 'country' : regionPath.length === 1 ? 'state' : 'city';

  // 3. Aggregate
  const map = new Map<string, { sum: number; count: number }>();

  for (const point of filtered) {
    const tLabel = point[timeKey as keyof RawDataPoint] as string;
    const rLabel = point[regionKey as keyof RawDataPoint] as string;
    const rdLabel = point.round;
    const key = `${tLabel}|${rLabel}|${rdLabel}`;

    const existing = map.get(key) || { sum: 0, count: 0 };
    existing.sum += point.rating;
    existing.count += 1;
    map.set(key, existing);
  }

  const points: AggregatedDataPoint[] = [];
  for (const [key, val] of map.entries()) {
    const [tLabel, rLabel, rdLabel] = key.split('|');
    points.push({
      timeLabel: tLabel,
      regionLabel: rLabel,
      roundLabel: rdLabel,
      rating: parseFloat((val.sum / val.count).toFixed(1)), // average
    });
  }

  // 4. Determine Axis Labels order
  let timeLabels: string[] = [];
  if (timePath.length === 0) timeLabels = YEARS;
  else if (timePath.length === 1) timeLabels = WEEKS;
  else timeLabels = DAYS;

  let regionLabels: string[] = [];
  if (regionPath.length === 0) regionLabels = Object.keys(REGIONS_HIERARCHY);
  else if (regionPath.length === 1) {
    const country = regionPath[0] as keyof typeof REGIONS_HIERARCHY;
    regionLabels = Object.keys(REGIONS_HIERARCHY[country]);
  } else {
    const country = regionPath[0] as keyof typeof REGIONS_HIERARCHY;
    const state = regionPath[1];
    const countryData = REGIONS_HIERARCHY[country];
    regionLabels = (countryData as any)[state] || [];
  }

  return { points, timeLabels, regionLabels };
}
