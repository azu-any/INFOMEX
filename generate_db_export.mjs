import * as fs from 'fs';

const YEARS = ['2014', '2018', '2022'];
const WEEKS = ['W1', 'W2', 'W3', 'W4'];
const DAYS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];

const REGIONS_HIERARCHY = {
  Mexico: {
    Puebla: ['Cholula', 'Puebla City'],
    'Nuevo León': ['Monterrey', 'San Pedro'],
  },
  USA: {
    Texas: ['Austin', 'Dallas'],
    Arizona: ['Phoenix', 'Tucson'],
  },
};

const ROUNDS = [
  'Group Stage',
  'Round of 16',
  'Quarter-Final',
  'Semi-Final',
  'Final',
];

const data = [];

for (const year of YEARS) {
  for (const week of WEEKS) {
    for (const day of DAYS) {
      for (const [country, states] of Object.entries(REGIONS_HIERARCHY)) {
        for (const [state, cities] of Object.entries(states)) {
          for (const city of cities) {
            for (const round of ROUNDS) {
              let rating = Math.random() * 100;

              // Strict Constraint: [Year: 2022, Region: Puebla, Round: Final] = 68.5%
              if (year === '2022' && state === 'Puebla' && round === 'Final') {
                rating = 68.5;
              }

              data.push({
                year,
                week,
                day,
                country,
                state,
                city,
                round,
                rating: parseFloat(rating.toFixed(2)),
              });
            }
          }
        }
      }
    }
  }
}

fs.writeFileSync('public/data.json', JSON.stringify(data, null, 2));
console.log('Successfully generated public/data.json');
