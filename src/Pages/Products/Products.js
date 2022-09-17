import React, { useState, useEffect } from "react";

import { useSettingsStore } from "../../Contexts/SettingsZustand";

import {
  grabOldProd,
  checkExistsNewProd,
  updateNewProd,
  createNewProd,
} from "./ProductHelpers";

import { Button } from "primereact/button";
import { grabDetailedProductList } from "../../restAPIs";
import ProductList from "./ProductList";
import ProductDetails from "./ProductDetails";
import { motion } from "framer-motion";

function Products() {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  const [productData, setProductData] = useState([{}]);
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    setIsLoading(true);
    grabDetailedProductList().then((result) => {
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
    setSelectedProduct("");
  };

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ width: 0, transition: { duration: 0.1 } }}
    >
      {/*<Button label="remap Products" onClick={remap} disabled />*/}
      {selectedProduct !== "" ? (
        <React.Fragment>
          <button onClick={handleProdClick}>PRODUCT LIST</button>
          <ProductDetails selectedProduct={selectedProduct} />
        </React.Fragment>
      ) : (
        <div></div>
      )}
      {selectedProduct === "" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ProductList
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            productData={productData}
            setProductData={setProductData}
          />
        </motion.div>
      ) : (
        <div></div>
      )}
    </motion.div>
  );
}

export default Products;
