import { Dropdown } from "primereact/dropdown"
import { LIST_TABLES } from "../../../../data/_constants"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { MultiSelect } from "primereact/multiselect"
import { useEffect, useRef, useState } from "react"
import { useListData } from "../../../../data/_listData"
import { Button } from "primereact/button"

export const Database = () => {
  const [selectedTable, setSelectedTable] = useState()
  const [visibleColumns, setVisibleColumns] = useState([])
  const dt = useRef(null)
  const { data } = useListData({ 
    tableName: selectedTable, shouldFetch: !!selectedTable
  })
  const columns = data 
    ? Object.keys(data[0])
    : []

  useEffect(() => {setVisibleColumns([])}, [data])

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  }

  const header = (
    <div className="flex align-items-center justify-content-end gap-2">
      <Button className="p-button-rounded"
        type="button" 
        icon="pi pi-file"  
        onClick={() => exportCSV(false)} data-pr-tooltip="CSV" 
      />  
    </div>
  )

  return(
    <div>
      <div style={{marginBlock: "1rem"}}>
        <Dropdown placeholder="Select Table"
          options={LIST_TABLES.sort()}
          value={selectedTable}
          onChange={e => setSelectedTable(e.value)}
          style={{width: "15rem"}}
        />
      </div>      
      
      <div style={{marginBlock: "1rem"}}>
        <MultiSelect placeholder={selectedTable ? "Select Columns" : ""}
          disabled={!columns.length}
          value={visibleColumns} 
          options={columns} 
          onChange={e => setVisibleColumns(e.value)}
          display="chip" 
        />
      </div>


      
      {data && columns.length &&
      <DataTable
        ref={dt}
        value={data || []}
        header={header}
        paginator rows={20}
        size="small"
        responsiveLayout="scroll"
        resizableColumns
      >
        {visibleColumns.map((attributeName, idx) => {
          return(
            <Column 
              key={`table-column-${idx}`}
              header={attributeName}
              field={attributeName}
              body={rowData => JSON.stringify(rowData[attributeName])}
              sortable
            />
          )
        })}
      </DataTable>
      }

      
    </div>
  )


}