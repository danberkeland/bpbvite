import React, { useContext, useState, useEffect } from "react";

import { SettingsContext } from "../../Contexts/SettingsContext";

import {
  grabOldProd,
  checkExistsNewProd,
  updateNewProd,
  createNewProd,
} from "./ProductHelpers";

import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { grabDetailedProductList } from "../../restAPIs";


function Products() {
  const { setIsLoading } = useContext(SettingsContext);

  const [productData, setProductData] = useState([{}]);
  const [selectedProduct, setSelectedProduct] = useState();

  
  useEffect(() => {
    setIsLoading(true);
    grabDetailedProductList().then((result) => {
      console.log(result)
      setProductData(result);
      setIsLoading(false);
    });

  }, []);
  
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


  return (
    <React.Fragment>
      <Button label="remap Products" onClick={remap} disabled/>

      <pre>Selected Product: {JSON.stringify(selectedProduct, null, 4)}</pre>
   
      <DataTable className="dataTable"
        value={productData} 
        selectionMode="single" metaKeySelection={false} 
        selection={selectedProduct} onSelectionChange={e => setSelectedProduct(e.value)}
        sortField="prodNick" sortOrder={1} responsiveLayout="scroll"
      >
        <Column field="prodNick" header="ID" sortable />
        <Column field="prodName" header="Product Name" sortable />
        
      </DataTable>

    </React.Fragment>
  );
}

export default Products;