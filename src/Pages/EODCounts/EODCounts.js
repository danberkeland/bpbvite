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



function EODCounts({ loc }) {
  
  const { data:products, errors:productListErrors, mutate:mutateProducts } = useProductListFull(true);
  console.log("products", products)
    
  const [signedIn, setSignedIn] = useState("null");
  // const [pocketsToMap, setPocketsToMap] = useState();
  
  // const [eodProds, setEODProds] = useState();
  // useEffect(() => {
  //   try {
  //     let prodsToMap = products.filter(
  //       (prod) =>
  //         (prod.bakedWhere.includes("Prado")) &&
  //         prod.isEOD === true
  //     );
  //     console.log('prodsToMap', prodsToMap)
  //     setEODProds(prodsToMap);
  //   } catch {}
  // }, [products]);

  const prepData = () => {
    if (!products) return []

    console.log("prep products", products)

    const eodProds = products?.filter(p => 
      p.bakedWhere.includes("Prado") && p.isEOD === true
    )

    const pocketsToMap = products.filter(p => 
      p.bakedWhere.includes("Prado") && p.doughNick === "French"
    ).sort(dynamicSort("prodNick")).sort(dynamicSort("weight"))

    const pocketItems = [...new Set(pocketsToMap.map(p => p.weight))].map(weight => 
      pocketsToMap.find(product => product.weight === weight)
    )

    return [eodProds, pocketItems]
  }
  
  const [eodProds, pocketItems] = useMemo(prepData, [products])
  console.log("eodProds", eodProds)
  console.log("pocketItems", pocketItems)



  const updateDBattr = async (id, attr, val) => {
    let addDetails = {
      id: id,
      [attr]: val,
      whoCountedLast: signedIn,
    };
    
    try {
      await API.graphql(
        graphqlOperation(updateProduct, { input: { ...addDetails } })
      );
     
    } catch (error) {
      console.log("error on updating product", error);
     
    }
  };

  const updateItem = (value, itemToUpdate) => {
    let ind = itemToUpdate.findIndex((item) => item.id === value.target.id);

    itemToUpdate[ind].currentStock = value.target.value;
    itemToUpdate[ind].updatedAt = DateTime.now().setZone("America/Los_Angeles");
    itemToUpdate[ind].whoCountedLast = signedIn;

    try {
      let id = value.target.id;
      let val = Number(value.target.value);
      updateDBattr(id, "currentStock", val);
    } catch {
      console.log("error updating attribute.");
    }
  };

  const handleChange = (value) => {
    if (value.code === "Enter") {
      let itemToUpdate = cloneDeep(products);
      updateItem(value, itemToUpdate);
      document.getElementById(value.target.id).value = "";

      return itemToUpdate;
    }
  };

  const handleBlur = (value) => {
    let itemToUpdate = cloneDeep(products);
    if (value.target.value !== "") {
      updateItem(value, itemToUpdate);
    }
    document.getElementById(value.target.id).value = "";

    return itemToUpdate;
  };

  const inputTemplate = (rowData) => {
    return(
      <InputText 
        inputMode="numeric"
        style={{width: "50px", fontWeight: "bold"}}
        placeholder={rowData.currentStock}
        onKeyUp={e => {if (e.code === "Enter") e.target.blur()}}
        onBlur={async e => {
          if (!e.target.value) return

          const submitItem = {
            prodNick: rowData.prodNick,
            currentStock: Number(e.target.value),
            updatedAt: new Date().toISOString(),
            whoCountedLast: signedIn,
          }
          console.log("submitItem", submitItem)
          const responseItem = await gqlFetcher(updateProductQuery, { input: submitItem })

          const i = products.findIndex(p => 
            p.prodNick === rowData.prodNick
          )
          const newItem = { 
            ...products[i],
            ...responseItem
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

  const handleInput = (e) => {
    return (
      <InputText
        id={e.id}
        style={{
          width: "50px",
          // backgroundColor: "#E3F2FD",
          fontWeight: "bold",
        }}
        placeholder={e.currentStock}
        // onKeyUp={(e) => e.code === "Enter" && setProducts(handleChange(e))}
        // onBlur={(e) => setProducts(handleBlur(e))}
      />
    );
  };

  const handlePockChange = async (e) => {
    let prodsToMod = cloneDeep(products);
    for (let prod of prodsToMod) {
      let weight = e.target.id.split(" ")[0];
      // Account for doughtype

      if (
        Number(prod.weight) === Number(weight) &&
        prod.doughType === "French"
      ) {
        prod.prepreshaped = e.target.value;
        prod.whoCountedLast = signedIn;
        prod.updatedAt = DateTime.now().setZone("America/Los_Angeles");
        let itemUpdate = {
          id: prod.id,
          prepreshaped: Number(e.target.value),
          whoCountedLast: signedIn,
        }; 
       try {
        await API.graphql(
          graphqlOperation(updateProduct, { input: { ...itemUpdate } })
        );
       
      } catch (error) {
        console.log("error on updating product", error);
       
      }  
      }
    }
    //setProducts(prodsToMod)
  };

  const pocketInputTemplate = (rowData) => {
    return (
      <InputText
        id={rowData.weight}
        style={{ width: "50px", fontWeight: "bold" }}
        placeholder={rowData.currentStock}
        onKeyUp={e => {if (e.code === "Enter") e.target.blur()}}
        onBlur={e => handlePockChange(e)}
      />
    );
  };

  const handleSignIn = () => {
    let signIn;

    swal("Please Sign In:", {
      content: "input",
    }).then(async (value) => {
      signIn = value;
      setSignedIn(signIn);
    });
  };

  // const pocketValues = () => {
  //   let pocks = pocketItems.map((pock) => pock.weight);
  //   pocks = sortAtoZDataByIndex(pocks, "weight");
  //   console.log("pocks", pocks);
  //   let newArray = Array.from(
  //     new Set(
  //       sortAtoZDataByIndex(
  //         pocketItems.map((pock) => pock.weight),
  //         "weight"
  //       )
  //     )
  //   ).map((arr) => ({
  //     weight: arr + " lb.",
  //     currentStock:
  //       products[
  //         products.findIndex(
  //           (prod) => prod.weight === arr && prod.doughType === "French"
  //         )
  //       ].prepreshaped,
  //     updatedAt:
  //       products[
  //         products.findIndex(
  //           (prod) => prod.weight === arr && prod.doughType === "French"
  //         )
  //       ].updatedAt,
  //     whoCountedLast:
  //       products[
  //         products.findIndex(
  //           (prod) => prod.weight === arr && prod.doughType === "French"
  //         )
  //       ].whoCountedLast,
  //   }));
  //   return [];
  // };

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
        {loc === "Prado" ? <h1>BPBS EOD Counts</h1> : <h1>BPBN EOD Counts</h1>}
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
                body={rowData => inputTemplate(rowData)}
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
                body={inputTemplate}
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
                body={inputTemplate}
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
                body={inputTemplate}
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
                body={rowData => pocketInputTemplate(rowData)}
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
