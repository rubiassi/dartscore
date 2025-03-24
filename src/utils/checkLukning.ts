import doubleOutData from '../data/Double-UD.json';

interface LukkeMulighed {
  rest: number;
  points: number;
  darts: number;
  checkdarts: number[];
}

export function findClosingOptions(rest: number, points: number): LukkeMulighed[] {
  if (rest === points) {
    points = 0;
  }

  console.log(`Tjekker lukningsmuligheder for rest: ${rest}, points: ${points}`);

  const matchingOptions = doubleOutData.filter(
    (lukning: LukkeMulighed) => lukning.rest === rest && lukning.points === points
  );

  if (matchingOptions.length > 0) {
    console.log("Fundet matchende lukningsmuligheder:", matchingOptions);
    return matchingOptions;
  }

  console.log("Ingen match fundet for:", { rest, points });
  return [];
} 