export function pointsFromIndexes(points, indexes) {
  return indexes
    .map(index => points[index])
    .flat();
}
