import React, { useContext, useEffect, useState, useMemo, useRef } from "react";

import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import TimeAgo from "timeago-react"
import us from "timeago.js/lib/lang/en_US"

import styled from "styled-components";

import swal from "sweetalert";
import { sortBy } from "lodash";
import { useListData } from "../../data/_listData";
import { DateTime } from "luxon";


const BasicContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;

  padding: 5px 10px;
  margin: 4px auto;
  box-sizing: border-box;
`;

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  margin: auto;
  padding: 0 0 100px 0;
`;

// **************************************************************
// Currently configured for Prado ONLY -- input 'loc' is not used
// **************************************************************
const PROD_LOCATION = "Prado"

function EODCounts({ loc }) {
  const [signedIn, setSignedIn] = useState("null");
  const [mode, setMode] = useState('edit')
  const [shelfForm, setShelfForm] = useState()
  const [shelfTableData, setShelfTableData] = useState()
  const [freezerForm, setFreezerForm] = useState()

  const { 
    data:PRD, 
    submitMutations:submitProducts,
    updateLocalData:syncProducts
  } = useListData({ tableName: "Product", shouldFetch: true })

  
    
  const [shelfData, freezerData, pocketItems] = useMemo(() => {
    if (!PRD) return undefined
    const products = sortBy(PRD, 'prodName')

    const eodProds = products.filter(p => 
      p.bakedWhere.includes(PROD_LOCATION) // && p.bakedWhere.length === 1 
        && p.isEOD === true
    )

    const shelfData = eodProds.filter(P => P.freezerThaw !== true)
    const freezerData = eodProds.filter(prod => prod.freezerThaw === true)

    const pocketsToMap = products.filter(P => 
      P.doughNick === "French"
        && P.bakedWhere.includes("Prado") && P.bakedWhere.length === 1
    )

    const pocketItems = sortBy(
      [...new Set(pocketsToMap.map(p => p.weight))].map(weight => 
        products.find(P => 
          P.weight === weight && P.doughNick === "French"
        )
      ),
      'weight'
    )

    return [shelfData, freezerData, pocketItems]
  }, [PRD]) ?? []

  useEffect(() => {
    if (!shelfData || !freezerData) return undefined
    
    if (mode === 'edit') {
      setShelfForm(shelfData)
      setFreezerForm(freezerData)
    } else if (mode === 'edit-shelf') {
      setShelfForm( resetForm(shelfData) ) 
    } else if (mode === 'edit-freezer') {
      setFreezerForm( resetForm(freezerData) )
    }

  }, [shelfData, freezerData, mode])

  const now = DateTime.now().setZone('America/Los_Angeles')

  const shelfNeedsFullCount = shelfData?.some(product => {
    const updatedDT = DateTime.fromISO(product.updatedAt).setZone('America/Los_Angeles')

    return(
      updatedDT.startOf('day').toMillis() !== now.startOf('day').toMillis()
        || now.hour >= 9 && updatedDT.hour < 9
    ) 
  })

  const freezerNeedsFullCount = freezerData?.some(product => {
    const updatedDT = DateTime.fromISO(product.updatedAt).setZone('America/Los_Angeles')

    return(
      updatedDT.startOf('day').toMillis() !== now.startOf('day').toMillis()
        || now.hour >= 9 && updatedDT.hour < 9
    ) 
  })

  const handleSignIn = () => {
    let signIn;

    swal("Please Sign In:", {
      content: "input",
    }).then(async (value) => {
      signIn = value;
      setSignedIn(signIn);
    });
  };


  const inputTemplate = ({ 
    rowData, 
    data,
    setData,
    qtyAttribute, 
    editMode='single' 
  }) => {
    
    return (
      <InputText 
        inputMode="numeric"
        style={{width: "50px", fontWeight: "bold"}}
        // value={inputMode === 'edit-batch' 
        //   ? rowData[qtyAttribute]
        //   : undefined
        // }
        placeholder={editMode === 'single' 
          ? rowData[qtyAttribute]
          : undefined
        }
        keyfilter={/[0-9]/}
        onFocus={e => e.target.select()}
        onKeyUp={e => {if (e.code === "Enter") e.target.blur()}}
        // onBlur={async e => {
        //   if (!e.target.value) return

        //   if (editMode = 'batch') {
        //     const updatedItem = { 
        //       ...rowData,
        //       [qtyAttribute]: e.target.value
        //     }
        //     const updateIndex = fullCountData.findIndex(P => P.prodNick === rowData.prodNick)
        //     let updatedData = structuredClone(fullCountData)
        //     updatedData[updateIndex] = updatedItem
        //     setFullCountData(updatedData)
        //   }

        //   if (editMode === 'single') {
        //     const updateItem = {
        //       prodNick: rowData.prodNick,
        //       [qtyAttribute]: Number(e.target.value),
        //       whoCountedLast: signedIn,
        //     }

        //     syncProducts(
        //       await submitProducts({ updateInputs: [updateItem] })
        //     )
        //   }
        // }}
        disabled={editMode === 'disabled'}
      />
    )

  }

  const prepreshapedInputTemplate = (rowData) => {
    return inputTemplate({ 
      rowData, qtyAttribute: "prepreshaped", inputMode: 'edit-single'
    })
  }


  const currentStockTemplate = ({
    rowData,
    disabled,
    data,
    setData
  }) => TextQtyInput({
    rowData,
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

  if (!PRD || !pocketItems) return <div>Loading...</div>
  return (
    <React.Fragment>
      <WholeBox>
        {PROD_LOCATION === "Prado" ? <h1>BPBS EOD Counts</h1> : <h1>BPBN EOD Counts</h1>}
        {signedIn === "null" ? (
          <BasicContainer>
            <Button
              label="Please Sign in to make EOD Changes"
              icon="pi pi-plus"
              onClick={handleSignIn}
              className={"p-button-raised p-button-rounded"}
            />
          </BasicContainer>
        ) : (
          <div></div>
        )}
        {signedIn !== "null" ? (
          <div style={{mxWidth: "45rem"}}>
            <div><pre>{JSON.stringify(mode)}</pre></div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}> 
            {shelfNeedsFullCount
                ? <h2>On Shelf — Needs Full Count <i className="pi pi-fw pi-arrow-right" /></h2>
                : <h2>On Shelf</h2>
              }
              <div>
                {mode === "edit-shelf" && <>
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
                    onClick={async () => {
                      const updateInputs = shelfForm.map(product => ({
                        prodNick: product.prodNick,
                        currentStock: product.currentStock,
                        whoCountedLast: signedIn,
                      }))
                      console.log("submitting:", updateInputs)

                      syncProducts(
                        await submitProducts({ updateInputs })
                      )

                      setMode('edit')
                    }}
                  />
                </>}
                {mode === 'edit' && 
                  <Button 
                    label="Count All" 
                    onClick={()=> {
                      setMode("edit-shelf")
                      setShelfForm( resetForm(shelfData) )
                    }}
                  />
                }
              </div>
            </div>
            <DataTable
              value={shelfForm.filter(product => product.packSize > 1)}
              className="p-datatable-sm"
            >
              <Column field="prodName" header="By Pack" />
              <Column header="# of bags"
                body={shelfStockTemplate}
                className="p-text-center"
              />
              <Column header="ea"
                body={rowData => `${rowData.currentStock * rowData.packSize}`}
                className="p-text-center"
                bodyClassName="p-text-center"
              />
              <Column header="Who Counted Last"
                body={lastCountTemplate}
                className="p-text-center"
                bodyClassName="p-text-center"
              />
            </DataTable>

            <DataTable
              value={shelfForm.filter(product => product.packSize === 1)}
              className="p-datatable-sm"
            >
              <Column field="prodName" header="Each" />
              <Column />
              <Column
                className="p-text-center"
                header="ea"
                body={shelfStockTemplate}
              />
              <Column
                className="p-text-center"
                header="Who Counted Last"
                body={lastCountTemplate}
              />
            </DataTable>
   
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}> 
              {freezerNeedsFullCount
                ? <h2>In Freezer — Needs Full Count <i className="pi pi-fw pi-arrow-right" /></h2>
                : <h2>In Freezer</h2>
              }
              {/* <h2>In Freezer{freezerNeedsFullCount ? " - Need Full Count " : ""}</h2> */}
              <div>
                {mode === "edit-freezer" && <>
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
                    disabled={freezerForm.some(P => P.currentStock === '')}
                    onClick={async () => {
                      const updateInputs = shelfForm.map(product => ({
                        prodNick: product.prodNick,
                        currentStock: product.currentStock,
                        whoCountedLast: signedIn,
                      }))
                      console.log("submitting:", updateInputs)

                      syncProducts(
                        await submitProducts({ updateInputs })
                      )

                      setMode('edit')
                    }}
                  />
                </>}
                {mode === 'edit' && 
                  <Button 
                    label="Count All" 
                    onClick={()=> {
                      setMode("edit-freezer")
                      setFreezerForm( resetForm(freezerData) )
                    }}
                  />
                }
              </div>
            </div>
            <DataTable
              value={freezerForm.filter(product => product.packSize > 1)}
              className="p-datatable-sm"
            >
              <Column field="prodName" header="By Pack"/>

              <Column
                className="p-text-center"
                header="# of bags"
                body={freezerStockTemplate}
              />
              <Column
                className="p-text-center"
                header="ea"
                body={rowData => `${rowData.currentStock * rowData.packSize}`}
              />
              <Column
                className="p-text-center"
                header="Who Counted Last"
                body={lastCountTemplate}
              />
            </DataTable>

            <DataTable
              value={freezerForm.filter(product => product.packSize === 1)}
              className="p-datatable-sm"
            >
              <Column field="prodName" header="Each" />
              <Column />
              <Column
                className="p-text-center"
                header="ea"
                body={freezerStockTemplate}
              />
              <Column
                className="p-text-center"
                header="Who Counted Last"
                body={lastCountTemplate}
              />
            </DataTable>
     
            <h2>Pocket Count</h2>
            <DataTable value={pocketItems}
              className="p-datatable-sm"
            >
              <Column header="Pocket Weight" body={rowData => `${rowData.weight} lb.`}/>
              {/* <Column></Column> */}
              <Column
                className="p-text-center"
                header="ea"
                body={prepreshapedInputTemplate}
              />
              <Column
                className="p-text-center"
                header="Who Counted Last"
                body={lastCountTemplate}
              />
            </DataTable>
           
          </div>
        ) : (
          <div></div>
        )}
      </WholeBox>
      </React.Fragment>
  );
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
  handleChange,
  handleBlur,
  disabled,
}) => {
  // const [value, setValue] = useState(initialQty)

  // useEffect(()=> setValue(initialQty), [initialQty])

  return (
    <InputText 
      inputMode="numeric"
      style={{width: "50px", fontWeight: "bold"}}
      // placeholder={initialQty}
      value={rowData.currentStock}
      keyfilter={/[0-9]/}
      onFocus={e => e.target.select()}
      onKeyUp={e => {if (e.code === "Enter") e.target.blur()}}
      onChange={e => handleChange(e.target.value)}
      onBlur={e => handleBlur(Number(e.target.value))}
      disabled={disabled}
    />
  )
}

const resetForm = (formData) => {
  return formData.map(item => ({
    ...item,
    currentStock: '',
    whoCountedLast: '',
    updatedAt: '',
  }))
}

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