import React, { useState, useEffect } from "react";

import { FilterMatchMode } from "primereact/api";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import ProductDetails from "./ProductDetails";
import { motion } from "framer-motion";
import { useProductList } from "../../hooks";
import { useSettingsStore } from "../../Contexts/SettingsZustand";

const initialState = {
    Type: "Product",
    createdAt: new Date(),
    updatedAt: new Date(),
    bakeDay: 1,
    bakeExtra: 0,
    bakeNick: "",
    bakedWhere: ["prado"],
    batchSize: 1,
    defaultInclude: false,
    descrip: "",
    doughNick: "French",
    forBake: "",
    freezerThaw: false,
    guarantee: 6,
    isWhole: true,
    leadTime: 2,
    packGroup: "",
    packGroupOrder: 0,
    packSize: 1,
    picURL: "",
    prodName: "",
    prodNick: "",
    qbID: "",
    readyTime: 6,
    retailPrice: 0,
    shapeDay: 1,
    shapeNick: "",
    squareID: "xxx",
    transferStage: "",
    weight: 0,
    wholePrice: 0
};

function ProductList({ selectedProduct, setSelectedProduct }) {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const setIsCreate = useSettingsStore((state) => state.setIsCreate);
  const isCreate = useSettingsStore((state) => state.isCreate);
  
  const [filter] = useState({
    prodName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  
  const { productList } = useProductList();

  useEffect(() => {
    console.log("productist", productList);
  }, [productList]);

  const handleClick = () => {
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
          
          <button onClick={handleClick}>+ PRODUCT LIST</button>
          <ProductDetails initialState={selectedProduct!== "" ? selectedProduct : initialState}  productList={productList.data}/>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default ProductList;
