export const convertPosition = (pointsArray) => {
  const array = pointsArray.flat();
  const length = array.length - 3;
  const points = new Float32Array(2 * length);
  for (let i = 0; i < length; i += 3) {
    points[2 * i] = array[i];
    points[2 * i + 1] = array[i + 1];
    points[2 * i + 2] = array[i + 2];

    points[2 * i + 3] = array[i + 3];
    points[2 * i + 4] = array[i + 4];
    points[2 * i + 5] = array[i + 5];
  }
  return points;
};
