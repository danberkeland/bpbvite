import React, { useState, useEffect, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { createDailyInvoices } from "../../../helpers/billingGridHelpers";

import { calcInvoiceTotal } from "../helpers";

import { ExpandedBillingRows } from "./Parts/ExpandedBillingRows";
import { DeleteInvoice } from "./Parts/DeleteInvoice";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";

const BillingGrid = ({
  database,
  nextInv,
  dailyInvoices,
  setDailyInvoices,
  zones,
}) => {
  const [products = [], customers = [], routes = [], standing = [], orders = [], d = [], dd = [], altPricing = []] =
    database || [];
  const [expandedRows, setExpandedRows] = useState(null);
  const [pickedProduct, setPickedProduct] = useState();
  const [pickedRate, setPickedRate] = useState();
  const [pickedQty, setPickedQty] = useState();

  const delivDate = useSettingsStore((state) => state.delivDate);
 
  
  
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const isChange = useSettingsStore((state) => state.isChange);
  const setIsChange = useSettingsStore((state) => state.setIsChange);


  useEffect(() => {
    if (standing && orders && customers && products && altPricing && zones) {
      createDailyInvoices(
        delivDate,
        orders,
        standing,
        customers,
        products,
        altPricing,
        zones
      ).then((data) => setDailyInvoices(data));
    }
  }, [delivDate, database, nextInv, zones]);

  const rowExpansionTemplate = (data) => {
    return (
      <ExpandedBillingRows
        data={data}
        dailyInvoices={dailyInvoices}
        setDailyInvoices={setDailyInvoices}
        products={products}
        altPricing={altPricing}
        pickedProduct={pickedProduct}
        setPickedProduct={setPickedProduct}
        pickedQty={pickedQty}
        setPickedQty={setPickedQty}
        pickedRate={pickedRate}
        setPickedRate={setPickedRate}
        delivDate={delivDate}
        orders={orders}
      />
    );
  };

  return (
    <div className="datatable-rowexpansion-demo">
      <div className="card">
        <DataTable
          value={dailyInvoices}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="invNum"
          className="p-datatable-sm"
        >
          <Column expander style={{ width: "3em" }} />
          <Column field="invNum" header="Invoice#" />
          <Column field="custName" header="Customer" />
          <Column header="total" body={(e) => calcInvoiceTotal(e.orders)} />

          <Column
            headerStyle={{ width: "4rem" }}
            body={(e) =>
              DeleteInvoice(
                e.invNum,
                dailyInvoices,
                setDailyInvoices,
                orders,
                delivDate
               
               
              )
            }
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default BillingGrid;
