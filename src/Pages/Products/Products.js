import React, { useContext, useState } from "react";

import { SettingsContext } from "../../Contexts/SettingsContext";

import {
  grabOldProd,
  checkExistsNewProd,
  updateNewProd,
  createNewProd,
} from "./ProductHelpers";

import { API, graphqlOperation } from "aws-amplify";

import { Button } from "primereact/button";
import { listProducts } from "../../graphql/queries";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';

// Page to perform CRUD on product data

function Products() {
  const { setIsLoading } = useContext(SettingsContext);

  const [productData, setProductData] = useState([{}]);
  const [selectedProduct, setSelectedProduct] = useState();
  
  const remap = () => {
    setIsLoading(true);
    grabOldProd()
      .then((oldProd) => {
        console.log("oldProd",oldProd)
        for (let old of oldProd) {
          checkExistsNewProd(old.prodNick).then((exists) => {
            console.log("exists",exists)
            if (exists) {
              updateNewProd(old);
            } else {
              createNewProd(old);
            }
          });
        }
      })
      .then((e) => {
        setIsLoading(false);
        console.log("Product DB updated");
      });
  };

  const fetchProducts = async () => {
    // manually supplies data to display in table
    // would be nice to limit query by bake location, dough type, product group...
    //    (should be able to do that with graphqlOperation)
    setIsLoading(true)
    const response = await API.graphql(
      graphqlOperation(listProducts,{limit: 1000})
    );
    setIsLoading(false)

    setProductData(response.data.listProducts.items);
    console.log("Product Items:", productData);
  }

  return (
    <React.Fragment>
      <Button label="remap Products" onClick={remap} disabled/>
      <Button label="List Products" onClick={fetchProducts} />

      <pre>Selected Product: {JSON.stringify(selectedProduct, null, 4)}</pre>
   
      <DataTable 
        value={productData} 
        selectionMode="single" metaKeySelection={false} 
        selection={selectedProduct} onSelectionChange={e => setSelectedProduct(e.value)}
        sortField="prodNick" sortOrder={1} responsiveLayout="scroll"
      >
        <Column field="prodNick" header="Nickname (ID)" sortable />
        <Column field="prodName" header="Product Name" sortable />
        <Column 
          field="bakedWhere" 
          header="Bake Location" 
          filter="true" 
          sortable 
        />
        <Column field="readyTime" header="Ready Time" sortable />
        <Column field="doughNick" header="Dough Nickname" sortable />
        <Column field="doughType" header="Dough Type" sortable />
      </DataTable>

    </React.Fragment>
  );
}

export default Products;