import { min, sortBy } from "lodash";

const levenshteinDistance = (s, t) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
}

// const getBestMatchScore = (queries, item, onFields) => {
//   const distances = onFields.map(f => 
//     Math.min(...queries.map(query => 
//       levenshteinDistance(
//         item[f].replace(/\s/g, '').toLowerCase(), 
//         query
//       )
//     ))
//   )
//   return Math.min(distances)
// }
const getBestMatchScore = (queries, item, onFields) => {
  const distances = onFields.map(f => 
    min(queries.map(query => 
      levenshteinDistance(
        item[f].replace(/\s/g, '').toLowerCase(), 
        query
      )
    ))
  )
  return min(distances)
}
/**
 * 
 * @param {string} query 
 * @param {Object[]} data 
 * @param {string[]} onFields 
 * @returns 
 */
const rankedSearch = (query, data, onFields, maxResults=10) => {
  

  // const q = query.toLowerCase().replace(/\s/g, '')
  const queries = query
    .replace(/\s/g, '')
    .toLowerCase()
    .split(',')
    .filter(q => !!q)

  if (!queries.length) return [...data]

  let substrMatches = data.filter(item => 
    onFields.some(field => 
      queries.some(q => 
        item[field].replace(/\s/g, '').toLowerCase().includes(q)
      )
    )
  )

  return substrMatches.length
    ? sortBy(
        substrMatches,
        item => getBestMatchScore(queries, item, onFields)
      ).slice(0, maxResults)
    : sortBy(
        data,
        item => getBestMatchScore(queries, item, onFields)
    ).slice(0, maxResults)

}

export {
  levenshteinDistance,
  rankedSearch
}