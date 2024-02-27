import React, { useState } from "react";

import { FilterMatchMode } from "primereact/api";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import ProductDetails from "./ProductDetails";
import { useProductListFull } from "../../data/productData"
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { withFadeIn } from "../../hoc/withFadeIn";
import { useEffect } from "react";

const initialState = {
  Type: "Product",
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
  isRetail: false,
  isEOD: false,
  retailName: "",
  retailDescrip: "",
  readyTime: 6,
  retailPrice: 0,
  shapeDay: 1,
  shapeNick: "",
  squareID: "xxx",
  transferStage: "",
  weight: 0,
  wholePrice: 0,
};

function ProductList({ selectedProduct, setSelectedProduct }) {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const setIsCreate = useSettingsStore((state) => state.setIsCreate);
  const isCreate = useSettingsStore((state) => state.isCreate);

  const [filter] = useState({
    prodName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const {data: productList, errors: productListErrors} = useProductListFull(true);
  const formKeys = Object.keys(initialState)
  const tableData = productList?.map(item => {
    let cleanedItem = formKeys.reduce((cItem, key) => {
      if (item.hasOwnProperty(key)) return {...cItem, [key]: item[key]}
      else return {...cItem, [key]: initialState[key]}
    }, {})

    return cleanedItem
  })

  useEffect(() => {
    console.log('productList', productList)
  },[productList])
  

  const handleClick = () => {
    setIsCreate(!isCreate);
  };


  const FadeProductDataTable = withFadeIn(() => {
    return (
      <div className="bpbDataTable">
      <DataTable
        className="dataTable"
        value={tableData}
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
        <Column field="prodName" filterPlaceholder="Search Products" filter />
        <Column field="prodNick"  />
      </DataTable>
      </div>
    );
  });

  return (
    <React.Fragment>
      {isCreate ? (
        <React.Fragment>
          <button onClick={handleClick}>+ PRODUCT LIST</button>
          <ProductDetails
            initialState={initialState}
            productList={productList.data}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <button onClick={handleClick}>+ CREATE PRODUCT</button>
          {(!productList && !productListErrors) ? setIsLoading(true) : setIsLoading(false)}

          {productListErrors && <div>Table Failed to load</div>}
          {productList && <FadeProductDataTable />}
          <div className="bottomSpace"></div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default ProductList;
