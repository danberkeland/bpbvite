import React, { useState } from "react";

import ProductList from "./ProductList";
import ProductDetails from "./ProductDetails";
import { motion } from "framer-motion";

function Products() {
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleProdClick = () => {
    setSelectedProduct("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y:0 }}
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
          animate={{ opacity: 1, y:0 }}
          exit={{ opacity: 0 }}
        >
          <ProductList
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        </motion.div>
      ) : (
        <div></div>
      )}
    </motion.div>
  );
}

export default Products;
