export const reformatProdName = (prodName, packSize) => {
  const trimmedProdName = prodName.replace(/\([0-9]+\)/, '').trim()
  const pkString = packSize > 1 ? ` (${packSize}pk)` : ''
  return `${trimmedProdName}${pkString}`
}