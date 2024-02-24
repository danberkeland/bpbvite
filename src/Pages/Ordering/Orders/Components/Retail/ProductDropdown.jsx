import { AutoComplete } from "primereact/autocomplete"
import { useListData } from "../../../../../data/_listData"
import { useState } from "react"
import { sortBy } from "lodash"
import { reformatProdName } from "../../functions/reformatProdName"
import { wrapText } from "../../../utils/wrapText"


export const ProductDropdown = ({
  style,
  value,
  onChange,
}) => {
  const { data:PRD } = useListData({ tableName:"Product", shouldFetch: true})
  
  const [suggestions, setSuggestions] = useState([])
  
  const search = (event) => {
    const query = event.query.toLowerCase().replace(/\s/g, '')

    if (!query) setSuggestions(sortBy(PRD, 'prodName'))
    else {
      let results = PRD.filter(P => 
        P.prodNick.includes(query) 
        || P.prodName.replace(/\s/g, '').toLowerCase().includes(query)
      )
      
      if (!results.length) results = PRD

      results = results.map(P => {
        let d1 = levenshteinDistance(P.prodNick, query)
        let d2 = levenshteinDistance(P.prodName.toLowerCase(), query)
        let score = Math.min(d1, d2)

        return { ...P, score }
      })

      setSuggestions(sortBy(results, 'score').slice(0,10))

    }

  }


  return (
    <AutoComplete 
      placeholder="Products"
      value={value}
      suggestions={suggestions}
      field="prodName"
      completeMethod={search}
      dropdown
      autoHighlight
      forceSelection
      delay={50}
      spellCheck="false"

      onFocus={e => e.target.select()}
      onChange={onChange}
      itemTemplate={P => {
        const { prodNick, prodName, packSize } = P
        let textLines = wrapText(
          reformatProdName(prodName, packSize), 30
        ).split('\n')

        return (<>
          {textLines.map(line => <div>{line}</div>)}
          <pre style={{margin: "0", fontSize: "0.8rem"}}>{prodNick}</pre>
        </>)
      }}
      style={style}
    />
  )
}


// ***************************************

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



        // id="location-selector"
        // field="locName"
        // value={selectedLocation}
        // dropdown
        // suggestions={filteredLocations}
        // itemTemplate={option => 
        //   <>
        //     <div>{option.locName}</div>
        //     <pre style={{fontSize: ".8rem", margin: "0rem"}}>
        //       {option.locNick}
        //     </pre>
        //   </>
        // }
        // delay={150}
        // spellCheck="false"
        // autoHighlight
        // completeMethod={search}
        // onFocus={e => e.target.select()}
        // onChange={(e) => {
        //   setSelectedLocation(e.value)
        //   if (e?.value?.locNick) {
        //     setLocNick(e.value.locNick)
        //     setDelivDateJS(todayDT.plus({ days: 1 }).toJSDate())
        //   }
        //   //console.log(e)
        // }}
        // onKeyUp={e => {
        //   if (e.key === "Escape") {
        //     setSelectedLocation(locations.find(L => L.locNick === locNick))
        //   }
        // }}
        // onBlur={e => {
        //   if (!e.target.value) {
        //     setSelectedLocation(locations.find(L => L.locNick === locNick))
        //   }
        // }}
        // forceSelection
        // inputStyle={{
        //   fontSize: "1.25rem",
        //   color: "var(--bpb-surface-header)",
        //   background: locNick === selectedLocation?.locNick 
        //     ? "var(--bpb-background-1)"
        //     : "var(--bpb-background-2)",
        //   border: "none",
        //   //maxWidth: "21rem",
        // }}
        // panelStyle={{
        //   color: "var(--bpb-text-color)",
        //   background: "var(--bpb-surface-input)",
        // }}
