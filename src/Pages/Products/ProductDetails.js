import React, { useState } from "react";

import { Button } from "primereact/button";

function ProductDetails({ selectedProduct }) {
  const [edit, setEdit] = useState(false);

  const buttonStyle = { width: "80px", margin: "20px", fontSize: "1.2em" };

  return (
    <React.Fragment>
      {/*<pre>Selected Product: {JSON.stringify(selectedProduct, null, 4)}</pre>*/}

      {!edit ? (
        <div className="productDetails">
          <h1>{selectedProduct.prodName}</h1>
          <Button
            label="Edit"
            className="p-button-raised p-button-rounded"
            style={buttonStyle}
          />
          <h2>ID: {selectedProduct.prodNick}</h2>
          <h3>Wholesale Price: {selectedProduct.wholePrice}</h3>
          <h3>Pack Size: {selectedProduct.packSize}</h3>
        </div>
      ) : (
        <div></div>
      )}

      <div className="bottomSpace"></div>
    </React.Fragment>
  );
}

export default ProductDetails;
