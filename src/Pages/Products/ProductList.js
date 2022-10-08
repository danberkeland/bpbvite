import React, { useState, useEffect } from "react";

import { FilterMatchMode } from "primereact/api";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import CreateProduct2 from "./EditProduct";
import { motion } from "framer-motion";
import { useProductList } from "../../hooks";
import { useSettingsStore } from "../../Contexts/SettingsZustand";

const submitButtonStyle = {
  width: "100px",
  margin: "20px",
  fontSize: "1.2em",
  backgroundColor: "red",
};

const initialState = {
  prodNick: "",
  prodName: "",
  wholePrice: null,
  packSize: 1,
};

function ProductList({ selectedProduct, setSelectedProduct }) {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const [filter] = useState({
    prodName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [isCreate, setIsCreate] = useState(false);
  const { productList } = useProductList();

  useEffect(() => {
    console.log("productist", productList);
  }, [productList]);

  const handleClick = () => {
    setIsCreate(!isCreate);
  };

  const handleSubmit = () => {
    setIsCreate(!isCreate);
  };

  return (
    <React.Fragment>
      {!isCreate ? (
        <React.Fragment>
          <button onClick={handleClick}>+ CREATE PRODUCT</button>
          {productList.isLoading ? setIsLoading(true) : setIsLoading(false)}

          {productList.isError && <div>Table Failed to load</div>}
          {productList.data && (
            <motion.div
              initial={{ opacity: 0, x: "0", y: "0" }}
              animate={{ opacity: 1, x: "0" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              exit={{ opacity: 0, x: "0" }}
            >
              <DataTable
                className="dataTable"
                value={productList.data}
                selectionMode="single"
                metaKeySelection={false}
                selection={selectedProduct}
                onSelectionChange={(e) => setSelectedProduct(e.value)}
                sortField="prodName"
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
            </motion.div>
          )}
          <div className="bottomSpace"></div>
        </React.Fragment>
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
          <CreateProduct2 initialState={initialState} create={true} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default ProductList;
