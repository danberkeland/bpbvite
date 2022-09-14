import React, { useState, useEffect } from "react";

import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { FilterMatchMode } from "primereact/api";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { grabDetailedProductList } from "../../restAPIs";

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

  useEffect(() => {
    setIsLoading(true);
    grabDetailedProductList().then((result) => {
      console.log(result);
      setProductData(result);
      setIsLoading(false);
    });
  }, []);

  return (
    <React.Fragment>
      <React.Fragment>
          <button >+ CREATE PRODUCT</button>
          
        </React.Fragment>
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
        <Column field="prodName" filterPlaceholder="Search Products" filter />
      </DataTable>
      <div className="bottomSpace"></div>
    </React.Fragment>
  );
}

export default ProductList;
