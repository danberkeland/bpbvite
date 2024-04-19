import { groupByObject, sumBy } from "../../utils/collectionFns"

import jsPDF from "jspdf"
import "jspdf-autotable"

import { DBDoughComponentBackup } from "../../data/types.d"

/**
 * @param {Object} doughItem 
 * @param {number} batchWeight 
 * @param {number} oldDough 
 * @param {DBDoughComponentBackup[]} doughComponents 
 * @param {Object} [options]
 * @param {string} [options.dateString]
 * @param {number} [options.splitNumber]
 * @param {string[][]} [options.pocketLines] - contrived custom sticker text we add for just one case (french dough mixes)
 */
export const printBucketStickers = (
  doughItem, 
  batchWeight, 
  oldDough,
  doughComponents,
  {
    dateString,
    splitNumber,
    pocketLines,
  }={}
) => {

  const { doughName, saltInDry, hydration } = doughItem

  // dry & wet amounts should be defensively normalized so that their sums are
  // 100 & the dough's hydration, respectively. 
  // Jank. Requiring special treatment for certain items and not others without 
  // any indication in the table data is error-prone.
  const _dcp = doughComponents.filter(C => C.dough === doughName)
  const totalDryAmount = sumBy(_dcp, C => C.componentType === "dry" ? C.amount : 0)
  const totalWetAmount = sumBy(_dcp, C => C.componentType === "wet" ? C.amount : 0)
  const itemComponents = _dcp.map(C => 
    C.componentType === "dry" ? { ...C, amount: C.amount * 100 / totalDryAmount } : 
    C.componentType === "wet" ? { ...C, amount: C.amount * hydration / totalWetAmount } : 
    C
  ).map(C => { 
    // Apply map to all items for consistent item shape even though it's only meaningful for lev-type items.
    // "A dough component can be just an ingredient, but sometimes it behaves like a dough (it has ingredients of its own)"
    // How many times must we apply extra logic to "special" table items? Straight to jail.
    // At least make a database attribute to classify items according to these behavior differences.

    const _subComponents = doughComponents.filter(dcp => dcp.dough ===  C.componentName)
    
    // Normalize amounts yet again...
    // Remember: the total should be equal to the sum of parts
    const totalSubComponentAmount = sumBy(_subComponents, C => C.amount)
    const subComponents = _subComponents.map(subComponent => (
      { ...subComponent, amount: subComponent.amount * C.amount / totalSubComponentAmount }
    ))

    return { ...C, subComponents }

  })

  const { dry=[], dryplus=[], wet=[], lev=[], post=[], saltyeast=[] } = groupByObject(
    itemComponents, 
    C => {
      // Why not just assign Type values that actually work and avoid this nonsense?
      // Isn't the whole point of componentType to group components for printing on stickers?
      if (saltInDry && C.componentName === "Salt") return "dryplus"
      if (["Salt", "Yeast"].includes(C.componentName)) return "saltyeast"
      return C.componentType
    }
  )
  
  // The math is easy when the amounts are defined properly
  const oldDoughToUse = Math.min(oldDough, batchWeight / 3)
  const batchFreshWeight = batchWeight - oldDoughToUse

  const totalAmount = sumBy(itemComponents, C => C.amount)
  const calcWeight = component => 
    (batchFreshWeight * component.amount / totalAmount).toFixed(2) 

  //  Make Stickers
  // ===============
  const doc = new jsPDF({ orientation: "l", unit: "in", format: [2, 4] })
  
  let isFirstPage = true
  let y = 0.7

  const printBulkLine = (componentName, weight) => {

    if (doughName === 'French' && componentName === "Water") {  
      const _weight = Number(weight)
      doc.text(String(Math.floor(_weight / 30)),  0.3, y)
      doc.text('30 lb. buckets Water',            1.2, y)
      y += 0.24
      return (_weight % 30).toFixed(2)
    }
    if (doughName === 'French' && componentName === "Bread Flour") {
      const _weight = Number(weight)
      doc.text(String(Math.floor(_weight / 50)),  0.3, y)
      doc.text('50 lb. bag Bread Flour',          1.2, y)
      y += 0.24
      return (_weight % 50).toFixed(2)
    }
  
    return weight

  }

  const renderSticker = (componentCategoryText, componentList) => {
    if (!componentList.length) return

    if (!isFirstPage) { 
      doc.addPage([2, 4], "landscape") 
    } else { 
      isFirstPage = false 
    }

    if (dateString) {
      doc.setFontSize(12)
      doc.text(dateString, 3.8, 1.7, { align: "right" })
    }

    doc.setFontSize(14)
    doc.text(`${doughName} - ${componentCategoryText}`,   0.2, 0.36)
    doc.setFontSize(10)
    doc.text(`${splitNumber ? splitNumber + 'x ' : ''}${(batchWeight).toFixed(2)} lb. Batch`, 3.8, 0.36, { align: "right" })
    doc.setFontSize(12)
    y = 0.7

    for (let component of componentList) {
      const { componentName } = component
      const weight = calcWeight(component)
      const remainder = printBulkLine(componentName, weight)

      doc.text(remainder,          0.3, y)
      doc.text(`lb.`,              0.8, y)
      doc.text(`${componentName}`, 1.2, y)
      y += 0.24
    }

  }
  
  renderSticker("Dry", [...dry, ...dryplus])
  renderSticker("Wet", wet)
  for (let component of lev) {
    renderSticker(component.componentName, component.subComponents)
  }
  renderSticker("Add ins", post)
  renderSticker("Salt & Yeast", saltyeast)
  doc.text(oldDoughToUse.toFixed(2), 0.3, y)
  doc.text(`lb.`,                    0.8, y)
  doc.text(`Old Dough`,              1.2, y)

  if (pocketLines) {
    doc.addPage([2, 4], "landscape")
    doc.setFontSize(12)

    y = 0.75
    pocketLines.forEach(line => {
      const [neededEa, weight, pansText] = line
      doc.text(neededEa, 0.7, y, { baseline: 'middle'})
      doc.text('x',      1.2, y, { baseline: 'middle'})
      doc.text(weight,   1.5, y, { baseline: 'middle'})
      doc.text(pansText, 2.0, y, { baseline: 'middle'})
      y += 0.25
    })

  }

  doc.save(`${doughName}_Stickers.pdf`)

}

// *** printBulkLine is a janky hook into the the normal rendering procedure
// to display info for special cases, namely, for "Bread Flour" and "Water" 
// components, only for French dough mixes.
//
// ex. if the mix calls for 175 lb bread flour,
// we want to print a line that indicates 3x 50lb bags of bread flour,
// then print second line for 25 lb bread flour in the usual format.
//
// this function just handles printing the bulk line, then returns
// the remaining weight for printing as usual.