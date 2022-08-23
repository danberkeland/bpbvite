import React, { useContext, useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';

import { SettingsContext } from "../../Contexts/SettingsContext";

import { ConvertDateToBPBDate } from "../../GlobalHelpers";

import { testingGrQL } from "../../restAPIs";

import { remap, remapStanding } from "./Remaps";
import moment from "moment";

const locs = [
  {label: 'high', value: 'high'},
  {label: 'whole', value: 'whole'},
  {label: 'lincoln', value: 'lincoln'},
  {label: 'novo', value: 'novo'},
  {label: 'scout1', value: 'scout1'}
];

function Ordering() {
  const { setIsLoading } = useContext(SettingsContext);
  const [ mockOrder, setMockOrder ] = useState({});
  const [ date, setDate ] = useState();
  const [ dayOfWeek, setDayOfWeek ] = useState('')
  const [ chosen, setChosen ] = useState('')

  useEffect(() => {
    setIsLoading(true);
    testingGrQL(chosen, date, dayOfWeek).then((result) => {
      setMockOrder(result);
      setIsLoading(false);
    });
    console.log("chosen",chosen)
  }, [date, dayOfWeek, chosen]);

  const handleDate = (date) => {
    let finalDate = ConvertDateToBPBDate(date)
    let dayOfWeek = moment(date.toISOString()).format('ddd')
    console.log(dayOfWeek)
    setDayOfWeek(dayOfWeek)
    setDate(finalDate);
  };

  return (
    <React.Fragment>
      <Button label="remap Orders" disabled/>
      <Button label="remap Standing" disabled />
      <div>
        <div className="card">
          <Calendar
            value={date}
            onChange={(e) => handleDate(e.value)}
          ></Calendar>
          <Dropdown value={chosen} options={locs} onChange={e => setChosen(e.value)} optionLabel="label" placeholder="location" />
          <DataTable value={mockOrder} responsiveLayout="scroll">
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
