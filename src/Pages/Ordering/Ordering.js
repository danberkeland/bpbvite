import React, { useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Dropdown } from 'primereact/dropdown';

import { SettingsContext } from "../../Contexts/SettingsContext";

import { grabLocList, testingGrQL } from "../../restAPIs";
import { useSettingsStore } from "../../Contexts/SettingsZustand";

function Ordering() {
  const { setIsLoading } = useSettingsStore();
  const [ orderList, setOrderList ] = useState({});
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [ date, setDate ] = useState();
  const [ chosen, setChosen ] = useState('')
  const [ locList, setLocList] = useState([])

  useEffect(() => {
    console.log("standing",selectedProducts)
  },[selectedProducts])

  useEffect(() => {
    setIsLoading(true);
    grabLocList().then((result) => {
      !result.errors && setLocList(result);
      setIsLoading(false);
    });

  }, []);

  useEffect(() => {
    setIsLoading(true);
    testingGrQL(chosen, date).then((result) => {
      !result.errors && setOrderList(result);
      setIsLoading(false);
    });
    console.log("chosen",chosen)
  }, [date, chosen]);


  return (
    <React.Fragment>
      <div>
        <div className="card">
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value.toString())}
          ></Calendar>
          <Dropdown value={chosen} options={locList} onChange={e => setChosen(e.value)} optionLabel="label" placeholder="location" />
          <DataTable value={orderList} responsiveLayout="scroll">
            <Column field="prod" header="Product"></Column>
            <Column field="qty" header="Qty"></Column>
            <Column field="type" header="Type"></Column>
            <Column field="rate" header="Rate"></Column>
          </DataTable>
          
        </div>
      </div>
    </React.Fragment>
  );
}

export default Ordering;
