export const parseBoolean = (value, defaultValue = false) => {
  if (typeof value === "string")
    value = value.trim()
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

export const sortItemsByField = ([...items], byId, field) => {
  items.sort((a, b) =>
    byId[a][field] < byId[b][field] ? -1 :
      byId[b][field] < byId[a][field] ? 1 : 0)
  return items
}