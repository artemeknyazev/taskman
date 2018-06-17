const randomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)]

const capitalize = (string) =>
  string.length
    ? string[0].toLocaleUpperCase() + string.slice(1)
    : string

module.exports = {
  randomFromArray,
  capitalize,
}