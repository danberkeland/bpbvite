import { DateTime } from "luxon"
import { useBpbsWtmData } from "./data"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Dialog } from "primereact/dialog"
import { InputNumber } from "primereact/inputnumber"
import { Calendar } from "primereact/calendar"
import { useEffect, useState } from "react"
import { useListData } from "../../../../../data/_listData"
import { keyBy, round, set, sumBy } from "lodash"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { exportBpbsWtmPdf } from "./exportPdf"
import { useCheckForUpdates } from "../../../../../core/checkForUpdates"
import { DT } from "../../../../../utils/dateTimeFns"

const SHOW_CALENDAR = false

const flexSplitStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
}

const todayDT = DT.today()
const today = todayDT.toFormat('yyyy-MM-dd')
// const tomorrow = todayDT.plus({ days: 1 }).toFormat('yyyy-MM-dd')
// const todayDisplay = todayDT.toFormat('MM/dd/yyyy')

/**takes a decimal number representation of time and formats as a sring
 * 
 * ex: formatHours(8.25) // "8:15am"
 */
const formatHours = (timeFloat) => {
  const hour = Math.floor(Number(timeFloat)) || 0
  const minute = round((Number(timeFloat) - hour) * 60) || 0
  return DateTime.fromObject({ hour, minute }).toFormat('h:mm')
}

/**
 * 
 * @param {Object} [input] 
 * @param {'today'|'tomorrow'} [input.initialDateOption='today']
 */
const BPBSWhatToMake = ({ initialDateOption='today' }={}) => {

  // misleading; report date should be today in all realistic contexts.
  // Changing this value allows us to pretend that 'today' is some other day.
  const [reportDate, setReportDate] = useState(today)
  const [reportRelDate, setReportRelDate] = useState(
    initialDateOption === 'today' ? 0 : 1
  )
  // console.log(reportRelDate)
  const reportDateDT = todayDT.plus({ days: reportRelDate })
  const reportDateISO = reportDateDT.toFormat('yyyy-MM-dd')
  const reportDateUS = reportDateDT.toFormat('MM/dd/yyyy')

  // preshaped qty values are keyed by prodNicks of representative products
  const [surplusState, setSurplusState] = useState()

  const headerStyle = { 
    background: reportRelDate === 0 
      ? '' 
      : "rgb(191, 210, 218)"
  }

  useCheckForUpdates() // overnight flip routine, check square orders

  const { data:WTM } = useBpbsWtmData({ 
    shouldFetch: true, 
    reportRelDate,
    reportDate,
  })
  const { 
    data:PRD,
    submitMutations:submitProducts,
    updateLocalData:updateProductCache,
  } = useListData({ tableName: "Product", shouldFetch: true })

  //if (!!WTM) console.log("pretzel data", WTM.pretzelData)

  const frenchPocketDict = keyBy(WTM?.frenchPocketData, 'prodNick')
  const products = keyBy(PRD, 'prodNick')

  useEffect(() => {if (!!WTM) {
    const preshapedDict = Object.fromEntries(
      WTM.frenchPocketData.map(row => 
        [row.prodNick, row.preshaped - row.needTodayCol.totalEa]
      )
    )

    setSurplusState(preshapedDict)
    
  }}, [WTM])
  //console.log("surplusState", surplusState)


  if (!WTM || !PRD) return <div>Loading...</div>


  const exportPdf = () => exportBpbsWtmPdf({
    WTM,
    reportDateISO,
    reportDateUS,
    reportRelDate,
  })

  const confirmPrint = () => confirmDialog({
      message:
        "This is not the list for TODAY. " 
        + "Are you sure this is the one you want to print?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: exportPdf,
    })

  const handlePrintPDF = () => {
    if (reportRelDate === 0) exportPdf()
    else confirmPrint()
  }


  const calcPreshaped = (prodNick) => 
    frenchPocketDict?.[prodNick].needTodayCol.totalEa
      + surplusState?.[prodNick]

  const pocketInputTemplate = (row) =>
    <InputNumber 
      value={surplusState?.[row.prodNick]}
      onChange={e => setSurplusState({
        ...surplusState, 
        [row.prodNick]: e.value
      })}
      onKeyDown={e => {if (e.key === "Enter") e.target.blur()}}
      onBlur={async e => {
        const newValue = !!surplusState[row.prodNick]
          ? surplusState[row.prodNick]
          : 0

        setSurplusState({ ...surplusState, [row.prodNick]: newValue })
                      
        const submitItem = {
          prodNick: row.prodNick,
          preshaped: calcPreshaped(row.prodNick)
        }
        console.log("submitItem:", submitItem)
        updateProductCache( 
          await submitProducts({ updateInputs: [submitItem] })
        )
      }}
      disabled={reportRelDate !== 0}
      inputStyle={{width: "4rem"}}
    />

  
  return(
    <div style={{
      marginTop: "5rem",
      display: "flex",
      justifyContent: "center",
      // marginLeft: "50%",
      // marginRight: "50%"
    }}>
    <div style={{
      marginBottom: "10rem", 
      flex: "0 0 35rem",
    }}>
      {SHOW_CALENDAR &&
        <DevCalendar 
          reportDate={reportDate} 
          setReportDate={setReportDate} 
        />
      }
      <div style={flexSplitStyle}>
        <h1 style={{marginTop: "0"}}>
          BPBS What to Make <br />
          {reportDateUS} {reportRelDate === 1 ? " (Backup)" : ''}
        </h1> 

        <div>
          <Button label="Today" 
            onClick={() => {
              setReportRelDate(0)
            }}
            className={reportRelDate === 0 ? '' : 'p-button-outlined'}
          />
      
          <Button label="Tomorrow" 
            onClick={() => {
              setReportRelDate(1)
            }}
            className={reportRelDate === 1 ? '' : 'p-button-outlined'}
            style={{marginLeft: "1rem"}}
          />
        </div>        
      </div>

      <Button label="Print What to Make List" 
        onClick={handlePrintPDF}  
        style={{marginBottom: "1rem"}}
      />
      <ConfirmDialog />

      <div>Using v2 <a href="/Production/BPBSWhatToMake/v3">Go to current version</a></div>

      <h2>Pocket Count</h2>
      <DataTable value={WTM.frenchPocketData}>
        <Column header="Pocket Size" 
          field="weight" 
          headerStyle={{...headerStyle}}
        />
        <Column header="Available" 
          body={row => reportRelDate === 0 
            ? calcPreshaped(row.prodNick)
            : frenchPocketDict?.[row.prodNick].prepreshaped
          } 
          headerStyle={{...headerStyle}}
        />
        <Column header="Need Today" 
          field="needTodayCol.totalEa" 
          headerStyle={{...headerStyle}}
        />
        <Column header="Short(-)/Surplus(+)" 
          field="surplus" 
          body={pocketInputTemplate}
          headerStyle={{...headerStyle}}
        />
      </DataTable>

      <h2>Baguette Production</h2>
      <DataTable value={WTM.baguetteData}>
        <Column header="Product" field="product" headerStyle={{...headerStyle}}/>
        <Column header="Bucket" field="bucket" headerStyle={{...headerStyle}}/>
        <Column header="Mix" field="mix" headerStyle={{...headerStyle}}/>
        <Column header="Bake" field="bake" headerStyle={{...headerStyle}}/>
      </DataTable>

      <h2>Send Pockets North</h2>
      <DataTable value={WTM.northPocketData} size="small">
        <Column header="Product" field="rowKey" headerStyle={{...headerStyle}}/>
        <Column header="Total" 
          body={(rowData => ExpandableCellTemplate({
            dialogHeader: 'Orders for Carlton Pickup',
            colKey: 'makeTotalCol',
            rowData,
            products,
          }))}  
          headerStyle={{...headerStyle}}
        />
      </DataTable>

      <h2 onClick={() => console.log(WTM?.freshData)}>Make Fresh</h2>
      <DataTable value={WTM.freshData} size="small">
        <Column header="Product" field="rowKey" headerStyle={{...headerStyle}}/>
        <Column header="Total Deliv" field="makeTotalCol.totalEa"
          body={(rowData => ExpandableCellTemplate({
            dialogHeader: 'Bake & Deliver Today',
            colKey: 'makeTotalCol',
            rowData,
            products,
          }))}  
          headerStyle={{...headerStyle}}
        />
        <Column header="Make Total" field="totalDelivCol.totalEa"
          body={(rowData => ExpandableCellTemplate({
            dialogHeader: 'Total Requirements',
            colKey: 'makeTotalCol',
            rowData,
            products,
          }))}  
          headerStyle={{...headerStyle}}
        />
        <Column header="Bag For Tomorrow" field="bagTomorrowCol.totalEa"
          body={(rowData => ExpandableCellTemplate({
            dialogHeader: 'Bake Ahead for Tomorrow',
            colKey: 'bagTomorrowCol',
            rowData,
            products,
          }))}  
          headerStyle={{...headerStyle}}
        />
      </DataTable>

      <h2 onClick={() => console.log(WTM?.shelfData)}>Make For Shelf</h2>
      <DataTable value={WTM.shelfData} size="small">
        <Column header="Product" field="rowKey"headerStyle={{...headerStyle}} />
        <Column header="Total Deliv" field="totalDelivCol.totalEa" 
          body={(rowData => ExpandableCellTemplate({
            dialogHeader: 'Deliveries',
            colKey: 'totalDelivCol',
            rowData,
            products,
          }))}  
          headerStyle={{...headerStyle}}
        />
        <Column header="Need Early" 
          field="needEarlyCol.totalEa" 
          headerStyle={{...headerStyle}}
        />
        <Column header="Make Total" field="makeTotalCol.totalEa" 
          body={(rowData => ExpandableCellTemplate({
            dialogHeader: 'Today & Tomorrow Orders',
            colKey: 'makeTotalCol',
            rowData,
            products,
          }))}  
          headerStyle={{...headerStyle}}
        />
        {/* <Column header="Need Extra Early" 
          body={(rowData => ExpandableCellTemplate({
            dialogHeader: 'Fresh Items To Be Baked and Sent North',
            colKey: 'needExtraEarlyCol',
            rowData,
            products,
          }))}  
          headerStyle={{...headerStyle}}
        /> */}
      </DataTable>

      <h2 onClick={() => console.log(WTM?.pretzelData)}>Pretzels</h2>
      <DataTable 
        value={WTM.pretzelData.filter(row => 
          ['ptz', 'pzb', 'unpz'].includes(row.productRep.prodNick)
          || row.bakeCol.totalEa > 0
          || row.shapeCol.totalEa > 0
          || row.bagCol.totalEa > 0
          // || true // uncomment to disable filter
        )} 
        size="small"
      >
        <Column header="Product" field="rowKey" headerStyle={{...headerStyle}}/>
        <Column header="Bake Today" field="bakeCol.totalEa" 
          body={(rowData => ExpandableCellTemplate({
            dialogHeader: 'To be Baked Today',
            colKey: 'bakeCol',
            rowData,
            products,
          }))} 
          headerStyle={{...headerStyle}} 
        />
        <Column header="Shape for Tomorrow" field="shapeCol.totalEa" 
          body={(rowData => ExpandableCellTemplate({
            dialogHeader: 'To be Baked Tomorrow',
            colKey: 'shapeCol',
            rowData,
            products,
          }))}  
          headerStyle={{...headerStyle}}
        />
        <Column header="Bag EOD" field="bagCol.totalEa" 
          body={(rowData => ExpandableCellTemplate({
            dialogHeader: 'Bag EOD',
            colKey: 'bagCol',
            rowData,
            products,
          }))}  
          headerStyle={{...headerStyle}}
        />
      </DataTable>

      <h2>Make For Freezer</h2>
      <DataTable value={WTM.freezerData} size="small">
        <Column header="Product" field="rowKey" headerStyle={{...headerStyle}} />
        <Column header="Total Deliv" field="totalDelivCol.totalEa" 
          body={(rowData => ExpandableCellTemplate({
            dialogHeader: 'Deliveries',
            colKey: 'totalDelivCol',
            rowData,
            products,
          }))}  
          headerStyle={{...headerStyle}}
        />
        <Column header="Need Early" 
          field="needEarlyCol.totalEa" 
          headerStyle={{...headerStyle}}
        />
        <Column header="Make Total" field="makeTotalCol.totalEa" 
          body={(rowData => ExpandableCellTemplate({
            dialogHeader: 'Today & Tomorrow Orders',
            colKey: 'makeTotalCol',
            rowData,
            products,
          }))}  
          headerStyle={{...headerStyle}}
        />
      </DataTable>

  
    </div>
    </div>
  )
}



const ExpandableCellTemplate = ({ 
  dialogHeader='', 
  colKey, 
  rowData, 
  products,
}) => {
  const [showDialog, setShowDialog] = useState(false)
  const hasContent = !!rowData[colKey].orders.length

  const tableSum = sumBy(
    rowData[colKey].orders, 
    order => order.qty * products[order.prodNick].packSize
  )

  return <>
    <div 
      onClick={() => {if (hasContent) setShowDialog(true)}}
      style={{
        cursor: hasContent ? "pointer" : '',
        //textAlign: "right"
      }}
    >
      <div style={{display: "inline-block", width: "2.75rem"}}>
        {rowData[colKey].totalEa}
      </div>
      <i className={`pi pi-fw ${hasContent ? 'pi-clone' : ''}`}/>
    </div>
    <Dialog
      header={dialogHeader} 
      visible={showDialog} 
      onHide={() => setShowDialog(false)}
    >
      <DataTable value={rowData[colKey].orders} 
        size="small"
        footer={<div style={{textAlign: "right"}}>Total: {tableSum}</div>}
      >
        <Column header="delivDate" body={row => row.delivDate.slice(5)} />
        <Column header="Route" field="routeMeta.routeNick" />
        <Column header="Start"     
          body={row => formatHours(row.routeMeta.route.routeStart)} 
        />
        <Column header="Location" field="locNick" />
        <Column header="Product" field="prodNick" />
        <Column header="Ea."  
          body={rowData => rowData.qty * products[rowData.prodNick].packSize}
        />
      </DataTable>
    </Dialog>
  </>
}



const DevCalendar = ({ reportDate, setReportDate }) => {

  const value = DateTime
    .fromFormat(reportDate, 'yyyy-MM-dd', { zone: 'America/Los_Angeles' })
    .toJSDate()

  const handleChange = e => {
    setReportDate(DateTime.fromJSDate(e.value).toFormat('yyyy-MM-dd'))

  } 

  return (
    <Calendar value={value} onChange={handleChange} />
  )
}

export { BPBSWhatToMake as default }