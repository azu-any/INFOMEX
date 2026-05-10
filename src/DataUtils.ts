export const YEARS = ['2014', '2018', '2022'] as const;
export const REGIONS = ['Puebla', 'Nuevo León', 'Texas', 'Arizona'] as const;
export const ROUNDS = [
  'Group Stage',
  'Round of 16',
  'Quarter-Final',
  'Semi-Final',
  'Final',
] as const;

export type Year = (typeof YEARS)[number];
export type Region = (typeof REGIONS)[number];
export type Round = (typeof ROUNDS)[number];

export interface DataPoint {
  year: Year;
  region: Region;
  round: Round;
  rating: number; // 0.0 to 100.0
}

export function generateCubeData(): DataPoint[] {
  const data: DataPoint[] = [];

  for (const year of YEARS) {
    for (const region of REGIONS) {
      for (const round of ROUNDS) {
        let rating = Math.random() * 100;

        // Strict Constraint: [Year: 2022, Region: Puebla, Round: Final] = 68.5%
        if (year === '2022' && region === 'Puebla' && round === 'Final') {
          rating = 68.5;
        }

        data.push({
          year,
          region,
          round,
          rating: parseFloat(rating.toFixed(1)), // Keep it to 1 decimal place
        });
      }
    }
  }

  return data;
}
