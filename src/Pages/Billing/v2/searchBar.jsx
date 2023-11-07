import React from "react"
import { get, groupBy, isEqual, round, set, sumBy, min } from "lodash"
import { sortBy } from "lodash/fp"

import { InputText } from "primereact/inputtext"

/** 
 * inputProps allows override of InputText props.  Most shouldn't be
 * touched, but you may want to set a custom style or placeholder.
 * 
 * SearchBar works alongside the rankedSearch function to filter data
 * down to a list of matches for presentation. if your data is being
 * manipulated on the page, form-style, remember not to apply ranked search
 * prior to defining your form state, as this can put your data out of order,
 * making it harder to compare initial/current values.
 */
export const SearchBar = ({ query, setQuery, inputProps={} }) => {
  const defaultInputProps = {
    value: query,
    style: { width: "100%" },
    onChange: e => setQuery(e.target.value),
    onFocus: e => e.target.select(),
    onKeyDown: e => {
      if (e.key === "Escape") {
        setQuery('')
        e.target.blur()
      }
    }
  }

  const _inputProps = { ...defaultInputProps, ...inputProps }

  const iconTemplate = query.length
    ? <i className="pi pi-fw pi-times" 
        onClick={() => setQuery('')}
        style={{cursor: "pointer"}} 
      />
    : <i className="pi pi-fw pi-search" />

  return (
    <span className="p-input-icon-right">
      {iconTemplate}
      <InputText { ..._inputProps } />
    </span>
  )

}

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
};

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

export const rankedSearch = ({ query, data, onFields, nResults=10 }) => {
  if (!query) return data

  const queries = query.replace(/\s/g, '').toLowerCase().split(',').filter(q => !!q)
  if (!queries.length) return data

  let substrMatches = data.filter(item => 
    onFields.some(field => 
      queries.some(q => 
        item[field].replace(/\s/g, '').toLowerCase().includes(q)
      )
    )
  )

  return substrMatches.length
    ? sortBy(item => getBestMatchScore(queries, item, onFields))(substrMatches).slice(0, nResults)
    : sortBy(item => getBestMatchScore(queries, item, onFields))(data).slice(0, nResults)

}
