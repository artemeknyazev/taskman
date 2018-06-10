export const clamp = (cur, min, max) =>
  cur < min ? min :
    cur > max ? max :
      cur

export const arrayMove = ([ ...array ], oldIndex, newIndex) => {
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  return array;
}