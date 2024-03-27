import { groupByObject, sumBy } from "../../../utils/collectionFns"

import jsPDF from "jspdf"
import "jspdf-autotable"

import { DBDoughComponentBackup } from "../../../data/types.d"


/**
 * @param {Object} doughItem 
 * @param {number} batchWeight 
 * @param {number} oldDough 
 * @param {DBDoughComponentBackup[]} doughComponents 
 */
export const printBucketStickers = (
  doughItem, 
  batchWeight, 
  oldDough,
  doughComponents,
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
  const renderSticker = (doc, componentCategoryText, componentList) => {
    if (!componentList.length) return

    if (!isFirstPage) { 
      doc.addPage([2, 4], "landscape") 
    } 
    else { 
      isFirstPage = false 
    }

    doc.setFontSize(14)
    doc.text(`${doughName} - ${componentCategoryText}`,   0.2, 0.36)
    doc.setFontSize(10)
    doc.text(`${(batchWeight).toFixed(2)} lb. Batch`, 2.9, 0.36)
    doc.setFontSize(12)
    y = 0.7

    for (let component of componentList) {
      doc.text(calcWeight(component),        0.3, y)
      doc.text(`lb.`,                        0.8, y)
      doc.text(`${component.componentName}`, 1.2, y)
      y += 0.24
    }

  }
  
  renderSticker(doc, "Dry", [...dry, ...dryplus])
  renderSticker(doc, "Wet", wet)
  for (let component of lev) {
    renderSticker(doc, component.componentName, component.subComponents)
  }
  renderSticker(doc, "Add ins", post)
  renderSticker(doc, "Salt & Yeast", saltyeast)
  doc.text(oldDoughToUse.toFixed(2), 0.3, y)
  doc.text(`lb.`,                    0.8, y)
  doc.text(`Old Dough`,              1.2, y)

  doc.save(`${doughName}_Stickers.pdf`)

}