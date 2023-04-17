import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";


const ProductGrid = ({ orderList }) => {

  const [data, setData] = useState([]);


  useEffect(() => {
    let dat = orderList; 
    setData(dat ? dat : []);
  }, [orderList ]);


  const headerTemplate = (data) => {
    return (
      <React.Fragment>
        <h3>{data.zoneName}</h3>
      </React.Fragment>
    );
  };

  const footerTemplate = (data) => {
    return <React.Fragment></React.Fragment>;
  };

  return (
    <DataTable
      value={data}
      rowGroupMode="subheader"
      groupField="zoneName"
      sortMode="single"
      sortField="zoneName"
      sortOrder={1}
      className="p-datatable-striped"
      rowGroupHeaderTemplate={headerTemplate}
      rowGroupFooterTemplate={footerTemplate}
    >
      <Column
        field="zone"
        header="Zone"
        filter
        filterPlaceholder="Search by zone"
      ></Column>
      <Column
        field="prodName"
        header="Product"
        filter
        filterPlaceholder="Search by product"
      ></Column>
      <Column
        field="prodNick"
        header="Prod nick"
        filter
        filterPlaceholder="Search by nickname"
      ></Column>
      <Column
        field="forBake"
        header="For Bake"
        filter
        filterPlaceholder="Search by forBake"
      ></Column>
      <Column
        field="custName"
        header="Customer"
        filter
        filterPlaceholder="Search by customer"
      ></Column>
      <Column
        field="custNick"
        header="Cust nick"
        filter
        filterPlaceholder="Search by nickname"
      ></Column>
      <Column field="qty" header="Quantity"></Column>
    </DataTable>
  );
};
export default ProductGrid;
