import React, { useState } from "react";

import ProductList from "./ProductList";
import ProductDetails from "./ProductDetails";
import { motion } from "framer-motion";
import { withFadeIn } from "../../utils";

function Products() {
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleProdClick = () => {
    setSelectedProduct("");
  };

  const FadeProductList = withFadeIn(() => {
    return (
      <ProductList
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
    );
  });

  return (
    <React.Fragment>
      {selectedProduct !== "" ? (
        <React.Fragment>
          <button onClick={handleProdClick}>PRODUCT LIST</button>
          <ProductDetails initialState={selectedProduct} create={false} />
        </React.Fragment>
      ) : (
        <div></div>
      )}
      {selectedProduct === "" ? <FadeProductList /> : <div></div>}
    </React.Fragment>
  );
}

export default Products;
