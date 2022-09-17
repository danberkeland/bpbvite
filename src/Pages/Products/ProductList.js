import React, { useState, useEffect } from "react";

import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { FilterMatchMode } from "primereact/api";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { grabDetailedProductList } from "../../restAPIs";
import CreateProduct from "./CreateProduct";
import { motion } from "framer-motion";

const submitButtonStyle = {
  width: "100px",
  margin: "20px",
  fontSize: "1.2em",
  backgroundColor: "red",
};

function ProductList({
  selectedProduct,
  setSelectedProduct,
  productData,
  setProductData,
}) {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  const [filter, setFilter] = useState({
    prodName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [isCreate, setIsCreate] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    grabDetailedProductList().then((result) => {
      setProductData(result);
      setIsLoading(false);
    });
  }, []);

  const handleClick = () => {
    setIsCreate(!isCreate);
  };

  const handleSubmit = () => {
    setIsCreate(!isCreate);
  };

  return (
    <React.Fragment>
      {!isCreate ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button onClick={handleClick}>+ CREATE PRODUCT</button>

          <DataTable
            className="dataTable"
            value={productData}
            selectionMode="single"
            metaKeySelection={false}
            selection={selectedProduct}
            onSelectionChange={(e) => setSelectedProduct(e.value)}
            sortField="prodNick"
            sortOrder={1}
            responsiveLayout="scroll"
            filterDisplay="row"
            filters={filter}
          >
            <Column
              field="prodName"
              filterPlaceholder="Search Products"
              filter
            />
          </DataTable>
          <div className="bottomSpace"></div>
        </motion.div>
      ) : (
        <React.Fragment>
          <div className="submitButton">
            <Button
              label="Submit"
              className="p-button-raised p-button-rounded"
              style={submitButtonStyle}
              onClick={handleSubmit}
            />
          </div>
          <button onClick={handleClick}>+ PRODUCT LIST</button>
          <CreateProduct />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default ProductList;
