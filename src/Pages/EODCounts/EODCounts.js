import React, { useContext, useEffect, useState, useMemo } from "react";

import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { updateProduct } from "../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import TimeAgo from "timeago-react"; // var TimeAgo = require('timeago-react');
import us from "timeago.js/lib/lang/en_US";

import swal from "sweetalert";

import styled from "styled-components";
import { useProductListFull } from "../../data/productData";
import dynamicSort from "../../functions/dynamicSort";

import { DateTime } from "luxon";
import { cloneDeep } from "lodash";
import gqlFetcher from "../../data/fetchers";


const updateProductQuery = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
  ) {
    updateProduct(input: $input) {
      prodNick
      currentStock
      prepreshaped
      updatedAt
      whoCountedLast
    }
  }
`;

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

const IngDetails = styled.div`
  font-size: 0.8em;
`;


// **************************************************************
// Currently configured for Prado ONLY -- input 'loc' is not used
// **************************************************************
const PROD_LOCATION = "Prado"

function EODCounts({ loc }) {
  const [signedIn, setSignedIn] = useState("null");
  const { data:products, mutate:mutateProducts } = useProductListFull(true);
    
  const prepData = () => {
    if (!products) return []
    // console.log("prep products", products)

    const eodProds = products?.filter(p => 
      p.bakedWhere.includes(PROD_LOCATION) && p.isEOD === true
    )

    const pocketsToMap = products.filter(p => 
      p.bakedWhere.includes(PROD_LOCATION) && p.doughNick === "French"
    ).sort(dynamicSort("prodNick")).sort(dynamicSort("weight"))
    const pocketItems = [...new Set(pocketsToMap.map(p => p.weight))].map(weight => 
      pocketsToMap.find(product => product.weight === weight)
    )

    return [eodProds, pocketItems]
  }
  
  const [eodProds, pocketItems] = useMemo(prepData, [products])
  console.log("eodProds", eodProds)
  console.log("pocketItems", pocketItems)



  const handleSignIn = () => {
    let signIn;

    swal("Please Sign In:", {
      content: "input",
    }).then(async (value) => {
      signIn = value;
      setSignedIn(signIn);
    });
  };

  const inputTemplate = ({ rowData, qtyAttribute }) => {
    return(
      <InputText 
        inputMode="numeric"
        style={{width: "50px", fontWeight: "bold"}}
        placeholder={rowData[qtyAttribute]}
        onFocus={e => e.target.select()}
        onKeyUp={e => {if (e.code === "Enter") e.target.blur()}}
        onBlur={async e => {
          if (!e.target.value) return

          const submitItem = {
            prodNick: rowData.prodNick,
            [qtyAttribute]: Number(e.target.value),
            updatedAt: new Date().toISOString(),
            whoCountedLast: signedIn,
          }
          console.log("submitItem", submitItem)
          const responseItem = await gqlFetcher(updateProductQuery, { input: submitItem })

          console.log("RESPONSE", responseItem.data.updateProduct)
          const i = products.findIndex(p => 
            p.prodNick === rowData.prodNick
          )
          const newItem = { 
            ...products[i],
            ...responseItem.data.updateProduct
          }   
          const _products = [...products.slice(0, i), newItem, ...products.slice(i + 1)]

          const newData = { data: { listProducts: { items: _products }}}

          mutateProducts(newData, {
            revalidate: false
          })
        }}
      />
    )

  }

  const currentStockInputTemplate = (rowData) => {
    return inputTemplate({ rowData, qtyAttribute: "currentStock"})
  }
  const prepreshapedInputTemplate = (rowData) => {
    return inputTemplate({ rowData, qtyAttribute: "prepreshaped" })
  }

  const lastCountTemplate = (rowData) => {
    const { updatedAt, whoCountedLast } = rowData
    return (
      <div style={{fontSize: ".8rem"}}>
        Counted {
          <TimeAgo
            datetime={updatedAt} 
            locale={us} 
          />
        } by {whoCountedLast}
      </div>
    )
  }

  if (!products || !pocketItems) return <div>Loading...</div>
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
          <React.Fragment>
            <h2>On Shelf</h2>
            <DataTable
              value={eodProds.filter(prod =>
                prod.freezerThaw !== true && prod.packSize > 1
              )}
              className="p-datatable-sm"
            >
              <Column field="prodName" header="By Bag" />
              <Column header="# of bags"
                body={currentStockInputTemplate}
                //body={(e) => handleInput(e)}
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
              value={eodProds.filter(prod =>
                prod.freezerThaw !== true && prod.packSize === 1
              )}
              className="p-datatable-sm"
            >
              <Column field="prodName" header="Each" />
              <Column />
              <Column
                className="p-text-center"
                header="ea"
                body={currentStockInputTemplate}
              />
              <Column
                className="p-text-center"
                header="Who Counted Last"
                body={lastCountTemplate}
              />
            </DataTable>
   
            <h2>In Freezer</h2>
            <DataTable
              value={eodProds.filter(prod =>
                prod.freezerThaw !== false && prod.packSize > 1
              )}
              className="p-datatable-sm"
            >
              <Column field="prodName" header="In Freezer"/>

              <Column
                className="p-text-center"
                header="# of bags"
                body={currentStockInputTemplate}
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
              value={eodProds.filter(prod =>
                  prod.freezerThaw !== false && prod.packSize === 1
              )}
              className="p-datatable-sm"
            >
              <Column field="prodName" header="Each" />
              <Column />
              <Column
                className="p-text-center"
                header="ea"
                body={currentStockInputTemplate}
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
           
          </React.Fragment>
        ) : (
          <div></div>
        )}
      </WholeBox>
    </React.Fragment>
  );
}

export default EODCounts;