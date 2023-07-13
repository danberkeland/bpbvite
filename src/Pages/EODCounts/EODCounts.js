import React, { useEffect, useState, useMemo } from "react";

import { useListData } from "../../data/_listData";

import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog"

import TimeAgo from "timeago-react"
import us from "timeago.js/lib/lang/en_US"
import { DateTime } from "luxon";
import { sortBy } from "lodash";

import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 45rem;
  margin: auto;
  padding: 0 0 100px 0;
`;

// **************************************************************
// Currently configured for Prado ONLY -- input 'loc' is not used
// **************************************************************
const PROD_LOCATION = "Prado"

function EODCounts({ loc }) {
  const [enteredName, setEnteredName] = useState('')
  const [signedIn, setSignedIn] = useState("null");
  const [mode, setMode] = useState('edit')
  const [shelfForm, setShelfForm] = useState()
  const [freezerForm, setFreezerForm] = useState()
  const [pocketForm, setPocketForm] = useState()
  const [time, setTime] = useState(DateTime.now().setZone('America/Los_Angeles'))
  const [submitting, setSubmitting] = useState(false)

  const { 
    data:PRD, 
    submitMutations:submitProducts,
    updateLocalData:syncProducts
  } = useListData({ tableName: "Product", shouldFetch: true })

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(DateTime.now().setZone('America/Los_Angeles'))
      console.log("checking time...")
    }, 60 * 1000)

    return () => clearInterval(intervalID)

  }, [])
    
  const [shelfData, freezerData, pocketItems] = useMemo(() => {
    if (!PRD) return undefined
    const products = sortBy(PRD, 'prodName')

    const eodProds = products.filter(P => 
      P.bakedWhere.includes(PROD_LOCATION) // && p.bakedWhere.length === 1 
        && P.isEOD === true
    )

    const shelfData = eodProds.filter(P => P.freezerThaw !== true)
    const freezerData = eodProds.filter(P => P.freezerThaw === true)

    const pocketsToMap = products.filter(P => 
      P.doughNick === "French"
        && P.bakedWhere.includes("Prado") && P.bakedWhere.length === 1
    )

    const pocketItems = sortBy(
      [...new Set(pocketsToMap.map(P => P.weight))].map(weight => 
        products.find(P => 
          P.weight === weight && P.doughNick === "French"
        )
      ),
      'weight'
    )

    return [shelfData, freezerData, pocketItems]
  }, [PRD]) ?? []

  useEffect(() => {
    if (!shelfData || !freezerData || !pocketItems) return undefined
    
    if (mode === 'edit') {
      setShelfForm(shelfData)
      setFreezerForm(freezerData)
      setPocketForm(pocketItems)
    } else if (mode === 'edit-shelf') {
      setShelfForm( initializeForm(shelfData) ) 
    } else if (mode === 'edit-freezer') {
      setFreezerForm( initializeForm(freezerData) )
    }

  }, [shelfData, freezerData, pocketItems, mode])

  const shelfNeedsFullCount = shelfData?.some(product => {
    const updatedDT = DateTime
      .fromISO(product.updatedAt)
      .setZone('America/Los_Angeles')

    return(
      updatedDT.startOf('day').toMillis() !== time.startOf('day').toMillis()
        || (time.hour >= 9 && updatedDT.hour < 9)
    ) 
  })

  const freezerNeedsFullCount = freezerData?.some(product => {
    const updatedDT = DateTime
      .fromISO(product.updatedAt)
      .setZone('America/Los_Angeles')

    return(
      updatedDT.startOf('day').toMillis() !== time.startOf('day').toMillis()
        || (time.hour >= 9 && updatedDT.hour < 9)
    ) 
  })


  const submitForm = (formData) => batchSubmit(
    formData, 
    submitProducts, 
    syncProducts, 
    signedIn,
    setMode,
    setSubmitting,
  )

  const currentStockTemplate = ({
    rowData,
    disabled,
    data,
    setData
  }) => TextQtyInput({
    rowData,
    qtyAttribute: 'currentStock',
    disabled,
    handleChange: (newQty) => updateForm({
      newQty,
      qtyAttribute: 'currentStock',
      rowData,
      data,
      setData,
    }),
    handleBlur: mode === 'edit'
      ? (newQty) => submitUpdate({
        newQty,
        qtyAttribute: 'currentStock',
        rowData,
        signedIn,
        submitProducts,
        syncProducts,
      })
      : () => undefined
  })

  const shelfStockTemplate = (rowData) => currentStockTemplate({
    rowData,
    disabled: (mode !== 'edit' && mode !== 'edit-shelf') 
      || (mode === 'edit' && shelfNeedsFullCount),
    data: shelfForm,
    setData: setShelfForm,
  })

  const freezerStockTemplate = (rowData) => currentStockTemplate({
    rowData,
    disabled: (mode !== 'edit' && mode !== 'edit-freezer')
      || (mode === 'edit' && freezerNeedsFullCount),
    data: freezerForm,
    setData: setFreezerForm,
  })

  const eachTemplate = (rowData) => rowData.currentStock * rowData.packSize

  const pocketQtyTemplate = (rowData) => TextQtyInput({
    rowData,
    qtyAttribute: 'prepreshaped',
    handleChange: (newQty) => updateForm({
      newQty,
      qtyAttribute: 'prepreshaped',
      rowData,
      data: pocketForm,
      setData: setPocketForm,
    }),
    handleBlur: (newQty) => submitUpdate({
      newQty,
      qtyAttribute: 'prepreshaped',
      rowData,
      signedIn,
      submitProducts,
      syncProducts,
    }),
    disabled: mode !== 'edit'
  })

  if (!PRD || !pocketItems) return <div>Loading...</div>
  return (
    <PageContainer>
      <h1>BPB{PROD_LOCATION === "Prado"?'S':'N'} EOD Counts</h1> 

      {signedIn === "null" &&
        <Dialog header="Enter a Name:" 
          visible={signedIn !== null} 
          closable={false}
          footer={() => <Button 
            label="Sign In"
            onClick={() => setSignedIn(enteredName)}
          />}
        >
          <InputText 
            value={enteredName}
            onChange={e => setEnteredName(e.target.value)}
            style={{marginTop: ".25rem"}}
          />
        </Dialog>
      }
      {signedIn !== "null" && <>
        <div style={{
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center"
        }}> 
          {mode === 'edit-shelf'
            ? <h2>On Shelf — Enter all values to submit</h2>
            : shelfNeedsFullCount
              ? <h2>On Shelf — Needs Full Count <i className="pi pi-fw pi-arrow-right" /></h2>
              : <h2>On Shelf</h2>
          }
          <div>
            {mode === "edit-shelf" && 
              <>
                <Button label="Cancel" 
                  className="p-button-outlined"
                  style={{marginRight: "2rem"}}
                  onClick={() => {
                    setShelfForm(shelfData)
                    setMode('edit')
                  }}
                />

                <Button 
                  label="Submit"
                  disabled={shelfForm.some(P => P.currentStock === '')}
                  onClick={() => {
                    submitForm(shelfForm)
                  }}
                />
              </>
            }
            {mode === 'edit' && 
              <Button 
                label="Count All" 
                onClick={()=> {
                  setMode("edit-shelf")
                  setShelfForm( initializeForm(shelfData) )
                }}
              />
            }
          </div>
        </div>

        <DataTable
          value={shelfForm.filter(product => product.packSize > 1)}
          className="p-datatable-sm"
        >
          <Column header="By Pack"   field="prodName"                />
          <Column header="# of bags" body={shelfStockTemplate}       />
          <Column header="ea"        body={eachTemplate}             />
          <Column header="Who Counted Last" body={lastCountTemplate} />
        </DataTable>
        <DataTable
          value={shelfForm.filter(product => product.packSize === 1)}
          className="p-datatable-sm"
        >
          <Column header="Each"             field="prodName"          />
          <Column header="ea"               body={shelfStockTemplate} />
          <Column header="Who Counted Last" body={lastCountTemplate}  />
        </DataTable>

        <div style={{
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center"
        }}> 
          {mode === 'edit-freezer'
            ? <h2>In Freezer — Enter all values to submit</h2>
            : freezerNeedsFullCount
              ? <h2>In Freezer — Needs Full Count <i className="pi pi-fw pi-arrow-right" /></h2>
              : <h2>In Freezer</h2>
          }
          <div>
            {mode === "edit-freezer" && 
              <>
                <Button label="Cancel" 
                  className="p-button-outlined"
                  style={{marginRight: "2rem"}}
                  onClick={() => {
                    setFreezerForm(freezerData)
                    setMode('edit')
                  }}
                />

                <Button 
                  label="Submit"
                  disabled={
                    freezerForm.some(P => P.currentStock === '')
                    || submitting
                  }
                  onClick={() => {
                    submitForm(freezerForm)
                  }}
                />
              </>
            }
            {mode === 'edit' && 
              <Button 
                label="Count All" 
                onClick={()=> {
                  setMode("edit-freezer")
                  setFreezerForm( initializeForm(freezerData) )
                }}
              />
            }
          </div>
        </div>

        <DataTable
          value={freezerForm.filter(product => product.packSize > 1)}
          className="p-datatable-sm"
        >
          <Column header="By Pack"          field="prodName"            />
          <Column header="# of bags"        body={freezerStockTemplate} />
          <Column header="ea"               body={eachTemplate}         />
          <Column header="Who Counted Last" body={lastCountTemplate}    />
        </DataTable>
        <DataTable
          value={freezerForm.filter(product => product.packSize === 1)}
          className="p-datatable-sm"
        >
          <Column header="Each"             field="prodName"            />
          <Column header="ea"               body={freezerStockTemplate} />
          <Column header="Who Counted Last" body={lastCountTemplate}    />
        </DataTable>
  
        <h2>Pocket Count</h2>
        <DataTable value={pocketForm}
          className="p-datatable-sm"
        >
          <Column header="Pocket Weight" 
            body={rowData => `${rowData.weight} lb.`}
          />
          <Column header="ea" body={pocketQtyTemplate} />
          <Column header="Who Counted Last" body={lastCountTemplate} />
        </DataTable>

      </>}
    </PageContainer>
  )
}

export default EODCounts;


const lastCountTemplate = (rowData) => {
  const { updatedAt, whoCountedLast } = rowData
  return updatedAt === ''
    ? <div></div>
    : <div style={{fontSize: ".9rem"}}>
      Counted <TimeAgo datetime={updatedAt} locale={us} /> by {whoCountedLast}
    </div>
}



const TextQtyInput = ({
  rowData,
  qtyAttribute,
  handleChange,
  handleBlur,
  disabled,
}) => <InputText 
  inputMode="numeric"
  style={{width: "50px", fontWeight: "bold"}}
  // placeholder={initialQty}
  value={rowData[qtyAttribute]}
  keyfilter={/[0-9]/}
  onFocus={e => e.target.select()}
  onKeyUp={e => {if (e.code === "Enter") e.target.blur()}}
  onChange={e => handleChange(e.target.value)}
  onBlur={e => handleBlur(Number(e.target.value))}
  disabled={disabled}
/>

/**For starting up a full count -- sets values to blank */
const initializeForm = (formData) => formData.map(item => ({
  ...item,
  currentStock: '',
  whoCountedLast: '',
  updatedAt: '',
}))

/**For updating local state */
const updateForm = ({
  newQty,
  qtyAttribute,
  rowData,
  data,
  setData,
}) => {

  const matchIndex = data.findIndex(P => P.prodNick === rowData.prodNick)
  let _data = structuredClone(data)
  _data[matchIndex] = {
    ...rowData,
    [qtyAttribute]: newQty
  }

  setData(_data)

}


/**For submitting a single qty */
const submitUpdate = async ({
  newQty,
  qtyAttribute,
  rowData,
  signedIn,
  submitProducts,
  syncProducts,
}) => {
  const updateItem = {
    prodNick: rowData.prodNick,
    [qtyAttribute]: newQty,
    whoCountedLast: signedIn,
  }

  syncProducts( await submitProducts({ updateInputs: [updateItem] }) )
  
}

/**For submitting a full count */
const batchSubmit = async (
  formData, 
  submitProducts, 
  syncProducts, 
  signedIn, 
  setMode,
  setSubmitting,
) => {
  setSubmitting(true)
  const updateInputs = formData.map(product => ({
    prodNick: product.prodNick,
    currentStock: product.currentStock,
    whoCountedLast: signedIn,
  }))
  console.log("submitting:", updateInputs)
  syncProducts( await submitProducts({ updateInputs }) )
  setSubmitting(false)
  setMode('edit')

}