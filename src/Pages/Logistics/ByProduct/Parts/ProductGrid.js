import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { sortBy } from "lodash";


const ProductGrid = ({ orderList }) => {

  const [data, setData] = useState([]);


  useEffect(() => {
    let dat = sortBy(orderList, ['zone', 'custNick', 'prodNick']); 
    setData(dat ? dat : []);
  }, [orderList ]);


  const headerTemplate = (data) => {
    return (
      <div style={{fontSize: "1.25rem", fontWeight: "bold"}}>{data.zone}</div>
    );
  };

  const footerTemplate = (data) => {
    return <React.Fragment></React.Fragment>;
  };

  const textInputFilterTemplate = (options) => {
    return(
      <InputText
        onChange={e => options.filterApplyCallback(e.value)}
        className="p-column-filter"
      />
    )
  }

  return (
    <DataTable
      value={data}
      rowGroupMode="subheader"
      groupRowsBy="zone"
      sortMode="single"
      sortField="zone"
      sort
      sortOrder={1}
      className="p-datatable-striped"
      rowGroupHeaderTemplate={headerTemplate}
      rowGroupFooterTemplate={footerTemplate}
      filterDisplay="row"
    >
      {/* <Column
        field="zone"
        header="Zone"
        filter
        filterPlaceholder="Search by zone"
        showFilterMenu={false}
        filterMatchMode="startsWith"
      ></Column> */}
      <Column
        field="prodName"
        header="Product"
        filter
        filterPlaceholder="Search by product"
        showFilterMenu={false}
        filterMatchMode="startsWith"
      ></Column>
      <Column
        field="prodNick"
        header="Prod nick"
        filter
        filterPlaceholder="Search by nickname"
        showFilterMenu={false}
        filterMatchMode="startsWith"
      ></Column>
      <Column
        field="forBake"
        header="For Bake"
        filter
        filterPlaceholder="Search by forBake"
        showFilterMenu={false}
        filterMatchMode="startsWith"
      ></Column>
      <Column
        field="custName"
        header="Customer"
        filter
        filterPlaceholder="Search by customer"
        showFilterMenu={false}
        filterMatchMode="startsWith"
      ></Column>
      <Column
        field="custNick"
        header="Cust nick"
        filter
        filterPlaceholder="Search by nickname"
        showFilterMenu={false}
        filterMatchMode="startsWith"
      ></Column>
      <Column field="qty" header="Quantity"></Column>
    </DataTable>
  );
};
export default ProductGrid;
