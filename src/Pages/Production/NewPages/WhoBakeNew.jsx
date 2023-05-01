import React from "react"

import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

import { useBPBNbakeList } from "./_hooks/BPBNhooks"

import jsPDF from "jspdf"
import "jspdf-autotable"
import { DateTime } from "luxon"
import { sortBy, sumBy } from "lodash"

const dateDT = DateTime.now().setZone('America/Los_Angeles').startOf('day')
const displayDate = dateDT.toLocaleString({
  month: '2-digit', day: '2-digit', year: 'numeric'
})

export const WhoBake = () => {
  const bakeListByForBake = useBPBNbakeList({ 
    dateDT, format: 'groupedByForBake'
  })

  const groupedBakeList = bakeListByForBake
    ? sortBy(Object.values(bakeListByForBake), grp => grp[0].product.forBake)
    : []

  return (<>
    <h1>{`Who Bake ${displayDate}`}</h1>

    <Button 
      label="Print Who Bake"
      onClick={() => exportWhoBakePDF(displayDate, groupedBakeList)}
    />

    {groupedBakeList.length && groupedBakeList.map((orderGroup, idx) => {
      const forBake = orderGroup[0].product.forBake
      const total = sumBy(orderGroup, order => order.qty)
      return(
        <div key={idx} style={{margin:"2rem"}}>
          <h2>{forBake}</h2>
          <DataTable value={sortBy(orderGroup, ['location.locName'])}
            size="small"
            footer={() => <span>{`Total: ${total}`}</span>}
          >
            <Column header="Customer" field="location.locName" />
            <Column header="Qty" field="qty" />
          </DataTable>

        </div>
      )
    })}
  </>)
}



const exportWhoBakePDF = (displayDate, groupedBakeList) => {
  let finalY;
  let pageMargin = 20;
  let tableToNextTitle = 5;
  let titleToNextTable = tableToNextTitle + 3;
  let tableFont = 11;
  let titleFont = 14;

  const doc = new jsPDF("p", "mm", "a4");
  doc.setFontSize(20);
  doc.text(pageMargin, 20, `Who Bake ${displayDate}`);

  finalY = 20;

  doc.setFontSize(titleFont);
  doc.text(pageMargin, finalY + tableToNextTitle, `Set Out`);

  for (let group of groupedBakeList) {
    const forBake = group[0].product.forBake
    const total = sumBy(group, order => order.qty)

    const tableData = group.map(order => ({
      locName: order.location.locName,
      qty: order.qty
    }))

    doc.autoTable({
      theme: "grid",
      body: tableData,
      margin: pageMargin,
      columns: [
        { header: forBake, dataKey: "locName" },
        { header: "Qty", dataKey: "qty" },
      ],
      startY: finalY + titleToNextTable,
      styles: { fontSize: tableFont },
    });

    finalY = doc.previousAutoTable.finalY;
    doc.text(pageMargin + 100, finalY + 8, `Total: ${total}`)
    finalY = finalY + 10;
  }
  doc.save(`WhoBake${displayDate}.pdf`)
}