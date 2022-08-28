import React, { useContext, useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Dropdown } from 'primereact/dropdown';

import { SettingsContext } from "../../Contexts/SettingsContext";

import { grabLocList, testingGrQL, grabStandOrder } from "../../restAPIs";

import moment from "moment";


function Ordering() {
  const { setIsLoading } = useContext(SettingsContext);
  const [ orderList, setOrderList ] = useState({});
  const [ standList, setStandList ] = useState({})
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [ date, setDate ] = useState();
  const [ dayOfWeek, setDayOfWeek ] = useState('')
  const [ chosen, setChosen ] = useState('')
  const [ standChosen, setStandChosen ] = useState('')
  const [ locList, setLocList] = useState([])

  useEffect(() => {
    console.log("standing",selectedProducts)
  },[selectedProducts])

  useEffect(() => {
    setIsLoading(true);

    // current Method with API Gateway + Lambda
    grabLocList().then((result) => {
      console.log(result)
      setLocList(result);
      setIsLoading(false);
    });

    // alternate method with an existing GraphQL function + clean up on the client side
    /*
    grabLocNames().then((response) => {
      console.log("FROM GRAPHQL:", response)
    }); 
    */
  }, []);

  useEffect(() => {
    setIsLoading(true);
    testingGrQL(chosen, date, dayOfWeek).then((result) => {
      console.log("result",result.errors)
      !result.errors && setOrderList(result);
      setIsLoading(false);
    });
    console.log("chosen",chosen)
  }, [date, dayOfWeek, chosen]);

  useEffect(() => {
    setIsLoading(true);
    grabStandOrder(standChosen).then((result) => {
      console.log("result",result.errors)
      console.log("StandList",result)
      !result.errors && setStandList(result);
      setIsLoading(false);
    });
    console.log("standChosen",standChosen)
  }, [standChosen]);


  const handleDate = (date) => {
    let finalDate = moment(date.toISOString()).format('L')
    let dayOfWeek = moment(date.toISOString()).format('ddd')
    console.log(finalDate)
    console.log(dayOfWeek)
    setDayOfWeek(dayOfWeek)
    setDate(finalDate);
  };

  return (
    <React.Fragment>
      <div>
        <div className="card">
          <Calendar
            value={date}
            onChange={(e) => handleDate(e.value)}
          ></Calendar>
          <Dropdown value={chosen} options={locList} onChange={e => setChosen(e.value)} optionLabel="label" placeholder="location" />
          <DataTable value={orderList} responsiveLayout="scroll">
            <Column field="prod" header="Product"></Column>
            <Column field="qty" header="Qty"></Column>
            <Column field="type" header="Type"></Column>
            <Column field="rate" header="Rate"></Column>
          </DataTable>
          <Dropdown value={standChosen} options={locList} onChange={e => setStandChosen(e.value)} optionLabel="label" placeholder="location" />
          <DataTable value={standList} responsiveLayout="scroll" selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}>
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
            <Column field="id" header="id"></Column>
            <Column field="prod" header="Product"></Column>
            <Column field="qty" header="Qty"></Column>
            <Column field="type" header="Type"></Column>
            <Column field="dayOfWeek" header="dayOfWeek"></Column>
            
          </DataTable>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Ordering;
