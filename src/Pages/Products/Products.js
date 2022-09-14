import React, { useState, useEffect } from "react";

import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { FilterMatchMode } from 'primereact/api';

import {
  grabOldProd,
  checkExistsNewProd,
  updateNewProd,
  createNewProd,
} from "./ProductHelpers";

import { Button } from "primereact/button";
import { grabDetailedProductList } from "../../restAPIs";
import ProductList from "./ProductList";

function Products() {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  const [productData, setProductData] = useState([{}]);
  const [selectedProduct, setSelectedProduct] = useState("");
  
  useEffect(() => {
    setIsLoading(true);
    grabDetailedProductList().then((result) => {
      console.log(result);
      setProductData(result);
      setIsLoading(false);
    });
  }, []);

  const remap = () => {
    setIsLoading(true);
    grabOldProd()
      .then((oldProd) => {
        console.log("oldProd", oldProd);
        for (let old of oldProd) {
          checkExistsNewProd(old.prodNick).then((exists) => {
            console.log("exists", exists);
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

  const handleProdClick = () => {
    setSelectedProduct("")
  }

  return (
    <React.Fragment>
      <Button label="remap Products" onClick={remap} disabled/>
      {selectedProduct !== "" ? (
        <React.Fragment>
          <button onClick={handleProdClick}>PRODUCT LIST</button>
          <pre>
            Selected Product: {JSON.stringify(selectedProduct, null, 4)}
          </pre>
        </React.Fragment>
      ) : (
        <div></div>
      )}
      {selectedProduct === "" ? (
        <ProductList />
      ) : (
        <div></div>
      )}
    </React.Fragment>
  );
}

export default Products;
