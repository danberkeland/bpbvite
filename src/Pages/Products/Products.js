import React, { useState, useEffect } from "react";

import { useSettingsStore } from "../../Contexts/SettingsZustand";

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


  const handleProdClick = () => {
    setSelectedProduct("");
  };

  return (
    <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
    
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
