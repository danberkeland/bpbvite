import React, { useState } from "react";

function ProductDetails({ selectedProduct }) {

    const [ edit, setEdit ] = useState(false)

  return (
    <React.Fragment>
      {/*<pre>Selected Product: {JSON.stringify(selectedProduct, null, 4)}</pre>*/}

      {!edit ? 
      <React.Fragment>
      <h1>{selectedProduct.prodName}</h1>
      <h2>ID: {selectedProduct.prodNick}</h2>
      <h3>Wholesale Price: {selectedProduct.wholePrice}</h3>
      <h3>Pack Size: {selectedProduct.packSize}</h3>
      </React.Fragment> :
      <div></div>}

      <div className="bottomSpace"></div>
    </React.Fragment>
  );
}

export default ProductDetails;
