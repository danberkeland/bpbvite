import { useEffect, useState } from "react"
// import { Dropdown } from "primereact/dropdown"
import { AutoComplete } from "primereact/autocomplete"

import { orderBy, sortBy } from "lodash"
import { useListData } from "../../../../data/_listData"
import { InputLabel } from "./InputLabel"



// export const LocationDropdown = ({ locNick, setLocNick, authClass }) => {
//   const { data:locations } = useListData({ 
//     tableName:"Location", shouldFetch: authClass === 'bpbfull'
//   })

//   const [highlightedLocNick, setHighlightedLocNick] = useState(locNick)
//   const cancelAction = useRef(false)

//   const locationDisplay = locations ? sortBy(locations, 'locName') : []
//   return (
//     <div className="custDrop p-fluid"
//       style={{maxWidth: "28rem"}}
//     >
//       <Dropdown
//         style={{width: "100%"}}
//         options={locationDisplay}
//         optionLabel="locName"
//         optionValue="locNick"
//         // value={locNick}
//         value={highlightedLocNick}
//         itemTemplate={(option) => <span>
//           {`${option.locName} (${option.locNick})`}
//         </span>}
//         // onChange={e => setLocNick(e.value)}
//         onChange={e => setHighlightedLocNick(e.value)}
//         onHide={() => {
//           if (!cancelAction.current) {
//             setLocNick(highlightedLocNick)
//           } else {
//             setHighlightedLocNick(locNick)
//           }
//           cancelAction.current = false
//         }}
//         onKeyDown={e => {
//           cancelAction.current = (e.key === "Escape")
//         }}
//         filter
//         filterBy="locNick,locName"
//         showFilterClear
//         placeholder={locations ? "LOCATION" : "loading..."}
//       />
//     </div>
//   )
// }



export const LocationDropdown = ({ 
  locNick, 
  setLocNick, 
  authClass,
  setDelivDateJS,
  ORDER_DATE_DT,
}) => {
  const { data:locations } = useListData({ 
    tableName:"Location", shouldFetch: authClass === 'bpbfull'
  })

  const [selectedLocation, setSelectedLocation] = useState()
  const [filteredLocations, setFilteredLocations] = useState()

  useEffect(() => {
    if (!!locations) {
      setSelectedLocation(locations.find(L => L.locNick === locNick))
    }
  }, [locations, locNick])

  const search = (event) => {
    let query = event.query.toLowerCase()
    let rankedLocations

    if (!event.query.trim().length) {
      rankedLocations = sortBy([...locations], 'locName')
    }
    else {
      rankedLocations = locations.filter(L => {
        return L.locName.toLowerCase().includes(query)
          || L.locNick.toLowerCase().includes(query)
      }).map(L => {
        const locNickScore = 
          levenshteinDistance(query, L.locNick) / L.locNick.length
        const locNameScore = 
          levenshteinDistance(query, L.locName) / L.locNick.length

        return {...L, score: Math.min(locNickScore, locNameScore)}
      })

      rankedLocations = sortBy(rankedLocations, 'score').slice(0,10)

    }

    setFilteredLocations(rankedLocations)
  }
  
  return (
    <InputLabel label="Current Location" 
      htmlFor="location-selector"
    >
      <AutoComplete 
        id="location-selector"
        field="locName"
        value={selectedLocation}
        dropdown
        suggestions={filteredLocations}
        itemTemplate={option => 
          <>
            <div>{option.locName}</div>
            <pre style={{fontSize: ".8rem", margin: "0rem"}}>
              {option.locNick}
            </pre>
          </>
        }
        delay={150}
        spellCheck="false"
        autoHighlight
        completeMethod={search}
        onFocus={e => e.target.select()}
        onChange={(e) => {
          setSelectedLocation(e.value)
          if (e?.value?.locNick) {
            setLocNick(e.value.locNick)
            setDelivDateJS(ORDER_DATE_DT.plus({ days: 1 }).toJSDate())
          }
          //console.log(e)
        }}
        onKeyUp={e => {
          if (e.key === "Escape") {
            setSelectedLocation(locations.find(L => L.locNick === locNick))
          }
        }}
        onBlur={e => {
          if (!e.target.value) {
            setSelectedLocation(locations.find(L => L.locNick === locNick))
          }
        }}
        forceSelection
        inputStyle={{
          fontSize: "1.25rem",
          color: "var(--bpb-surface-header)",
          background: locNick === selectedLocation?.locNick 
            ? "var(--bpb-background-1)"
            : "var(--bpb-background-2)",
          border: "none",
          //maxWidth: "21rem",
        }}
        panelStyle={{
          color: "var(--bpb-text-color)",
          background: "var(--bpb-surface-input)",
        }}
      />
    </InputLabel>
  )
}



// *****************************************************************************

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