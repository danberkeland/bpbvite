import React, { useState, useEffect } from "react"

import { InputText } from "primereact/inputtext"

import { useListData } from "../../data/_listData"

import { debounce } from "lodash"

// Note on debounce:
//
// debounce, like other time-delay type functions, can be interrupted by 
// rerenders. In particular, functions that call state settters can interrupt 
// debounce's expected behavior. This happens because the debounce function 
// gets 'rebuilt' on each re-render, before the delay timer allows it to 
// execute. There are probably some finer details about how/why the function 
// misbehaves, but 'fixing' the behavior involves preventing the debounce 
// function from getting 'rebuilt' before the timer expires. Options I've 
// explored include...
//
// 1. For form change handlers specifically, use useRef instead of useState.
//    useRef doesn't cause rerenders. However, we need to be sure that nothing
//    else on the page will trigger a rerender until debounce executes. This
//    solution works only in specific/relatively simple cases.
//
// 2. Wrap debounce in a useCallback or useMemo. In doing so, the debounced
//    function will only get 'rebuilt' when something in the dependency array
//    changes. I have found this to be tricky to set up, partially out of a
//    lack of familiarity with useCallback. Getting the debounce behavior
//    right while keeping the linter happy required a lot of troubleshooting;
//    I still haven't gotten complete success with this method.
//
// 3. Move the debounced function out of the component entirely. Functions
//    defined at top level don't get 'rebuilt' on rerender since they're
//    outside the component's scope. The downside is that any variables used by
//    the function must be explicitly passed to the function wherever it is
//    invoked, and if the function acts on many variables in the component
//    scope can be a pain to make everything explicit. On the other hand,
//    everything seems to 'Just Work™', even when code gets reused in smaller
//    template components.


/** Features: submit only if value change detected */
const debouncedSubmit = debounce(
  async (newDough, baseDough, submitMutations, updateLocalData) => {
    //console.log(baseDough)
    const { oldDough:_o, buffer:_b, bucketSets:_bs } = baseDough
    const { id, oldDough, buffer, bucketSets } = newDough
    if (oldDough === _o && buffer === _b && bucketSets === _bs) {
      console.log("no changes detected")
      return
    }
    const updateItem = {
      id: id,
      oldDough: Number(oldDough || "0"), 
      buffer: Number(buffer || "0"), 
      bucketSets: Number(bucketSets || "0")
    }
    console.log(`Submitting ${JSON.stringify(updateItem, null, 2)}`)
    updateLocalData(
      await submitMutations({ updateInputs: [updateItem]})
    )
  }, 5000

)

/** Features:
 * 
 * Automatic submit after 5 second timeout.
 * 
 * Instant submit on blur by clicking away or on Enter keypress.
 * 
 * Cancel/rollback value on Escape keypress
 * 
 * Customizable regex for onChange validation to coerce more reasonable inputs.
 */
const CustomInputText = ({ 
  doughItem, 
  setDoughItem,
  doughCache,
  attName, 
  validationRegex
}) => {
  const [rollbackQty, setRollbackQty] = useState(doughItem[attName])
  const { data, submitMutations, updateLocalData } = doughCache
  const baseDough = data?.find(D => D.doughName === "Baguette") ?? {}

  return (
    <InputText 
      value={doughItem[attName]}
      inputMode="numeric"
      onFocus={e => {
        e.target.select()
        setRollbackQty(doughItem[attName])
      }}
      onKeyDown={e => {
        if (e.code === "Enter") e.target.blur()
        if (e.code === "Escape") {
          const rollbackItem = {
            ...doughItem,
            [attName]: rollbackQty
          }
          debouncedSubmit.cancel()
          setDoughItem(rollbackItem)
          setRollbackQty('')
          e.target.blur()
        }
      }}
      onChange={e => {
        if (validationRegex.test(e.target.value)) {
          const newItem = {
            ...doughItem,
            [attName]: parseInt(e.target.value || "0")
          }
          setDoughItem(newItem)
          debouncedSubmit(
            newItem, 
            baseDough, 
            submitMutations,
            updateLocalData
          )
        }
      }}
      onBlur={() => debouncedSubmit.flush()}
    />
  )

}

/**Factor out messy formatting jsx */
const InputGroupLabel = ({label, addOnLabel, children}) => {
  return (
    <div style={{
      display:"flex", 
      gap: "1rem", 
      alignItems: "center", 
      padding: ".25rem",
    }}>
      <span style={{minWidth: "9rem"}}>{label}</span>
      <div style={{width: "7.5rem"}} className="p-inputgroup">
        {children}
        <span style={{width: "3rem"}} className="p-inputgroup-addon">
          {addOnLabel}
        </span>
      </div>
    </div>
  )
}

// *****************************************************************************
// Main Component
// *****************************************************************************

/** 
 * Interacts with the rest of the baguette dough info through use listData
 * hook. Updating input values submits to DB and mutates the local cache --
 * these local changes will cascade through any local data the uses the
 * doughBackup list as a source, such as the baguetteSummary.
 * 
 * A different design approach could allow the local input state to act as
 * inputs for the baguette mix calculations, allowing for immediate
 * recalculation on change, prior to submitting.
 */
export const DoughInputs = () => {
  const doughCache = useListData({ 
    tableName: "DoughBackup", 
    shouldFetch: true
  })
  const bagDough = doughCache.data?.find(D => D.doughName === "Baguette")

  const [doughItem, setDoughItem] = useState({ 
    id: '', 
    oldDough: '', 
    buffer: '', 
    bucketSets: ''
  }) 

  useEffect(() => {
    if (bagDough) setDoughItem({
      id: bagDough.id,
      oldDough: bagDough.oldDough,
      buffer: bagDough.buffer,
      bucketSets: bagDough.bucketSets
    })
  }, [bagDough])

  if (!bagDough) return <div>Loading...</div>
  return (<div>
    <InputGroupLabel label="Old Dough: " addOnLabel="lb.">
      <CustomInputText attName="oldDough" 
        doughItem={doughItem} 
        setDoughItem={setDoughItem} 
        doughCache={doughCache}
        validationRegex={/^\d{0,4}$|^\d{0,4}\.\d{0,1}$/}
      />
    </InputGroupLabel>

    <InputGroupLabel label="Buffer Dough: "addOnLabel="lb.">
      <CustomInputText attName="buffer" 
        doughItem={doughItem} 
        setDoughItem={setDoughItem} 
        doughCache={doughCache}
        validationRegex={/^\d{0,4}$|^\d{0,4}\.\d{0,1}$/}
      />
    </InputGroupLabel>
    
    <InputGroupLabel label="Actual Bucket Sets: " addOnLabel="sets">
      <CustomInputText attName="bucketSets" 
        doughItem={doughItem} 
        setDoughItem={setDoughItem} 
        doughCache={doughCache}
        validationRegex={/^\d?$|^0\d?$/}
      />
    </InputGroupLabel>
  </div>)
}