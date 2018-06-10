export const parseBoolean = (value, defaultValue = false) => {
  if (value === "true" || value === "1" || value === 1 || value === true)
    return true
  if (value === "false" || value === "0" || value === 0 || value === false)
    return false
  return defaultValue
}

export const clamp = (cur, min, max) =>
  cur < min ? min :
    cur > max ? max :
      cur

export const arrayMove = ([...array], oldIndex, newIndex) => {
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  return array;
}