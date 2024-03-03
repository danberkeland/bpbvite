import React, { useEffect, useState } from "react";

import styled from "styled-components";

import { InputText } from "primereact/inputtext";
import { PickList } from "primereact/picklist";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

// import {
//   setValu_e,
//   fixValu_e,
//   setPickValu_e,
//   setDropDownValu_e,
// } from "../../../helpers/formHelper_s";

// const clonedeep = require("lodash.clonedeep");

const DuoWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* margin: 0 0 20px 0; */
`;

const WeekWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  margin: 0 0 1rem 0;
`;

const hubOptions = ["Prado", "Carlton"]

const dayNumberStringMap = {
  "1": "Sun",
  "2": "Mon",
  "3": "Tue",
  "4": "Wed",
  "5": "Thu",
  "6": "Fri",
  "7": "Sat"
}

const driverOptions = [
  "Long Driver",
  "AM Pastry",
  "AM South",
  "None"
]

const Info = ({ selectedRoute, setSelectedRoute, zoneList }) => {
  const [source, setSource] = useState()
  
  useEffect(() => {
    setSource(zoneList.filter(z => !selectedRoute.zones.includes(z)))
  }, [zoneList, selectedRoute])

  // console.log(selectedRoute)

  const onChange = (event) => {
    setSource(event.source);
    setSelectedRoute({
      ...selectedRoute,
      zones: event.target
    })
  };




  return (
    <React.Fragment>
      <h2><i className="pi pi-map"></i> Route Info</h2>

      <InputGroupLabel attribute="routeStart" labelText="Route Name">
        <InputText attribute="routeStart"
          id="routeName"
          placeholder={selectedRoute.routeName}
          disabled
        />
      </InputGroupLabel>

      <DuoWrapper>
        <InputGroupLabel attribute="routeStart" labelText="Route Start Time (0-24)">
          <NumericInput attribute="routeStart"
            item={selectedRoute}
            setItem={setSelectedRoute}
          />
        </InputGroupLabel>

        <InputGroupLabel attribute="routeTime" labelText="Route Duration (in hours)">
          <NumericInput 
            item={selectedRoute}
            setItem={setSelectedRoute}
          />
        </InputGroupLabel>
      </DuoWrapper>

      <DuoWrapper>
        <InputGroupLabel attribute="RouteDepart" labelText="Depart Hub">
          <Dropdown
            id="RouteDepart"
            value={selectedRoute.RouteDepart}
            options={hubOptions}
            onChange={e => setSelectedRoute({
              ...structuredClone(selectedRoute),
              RouteDepart: e.value
            })}
            placeholder="Departure Hub"
          />
        </InputGroupLabel>
        <InputGroupLabel attribute="RouteDepart" labelText="Arrival Hub">
          <Dropdown id="RouteArrive"
            value={selectedRoute.RouteArrive}
            options={hubOptions}
            onChange={e => setSelectedRoute({
              ...structuredClone(selectedRoute),
              RouteArrive: e.value
            })}
            placeholder="Arrival Hub"
          />
        </InputGroupLabel>
      </DuoWrapper>

      <InputGroupLabel attribute="driver" labelText="Driver">
        <Dropdown attribute="driver"
          id="driver"
          value={selectedRoute.driver}
          options={driverOptions}
          onChange={e => setSelectedRoute({
            ...structuredClone(selectedRoute),
            driver: e.value
          })}
        />
        {/* <InputText attribute="driver" id="driver"
          value={selectedRoute.driver}
          onChange={e => setSelectedRoute({
            ...structuredClone(selectedRoute),
            driver: e.value
          })}
        /> */}
      </InputGroupLabel>

      <WeekWrapper>
        {Object.keys(dayNumberStringMap).map(dns => {
          const { RouteSched } = selectedRoute
          return(
            <div className="p-col-12" key={`checkbox-${dns}`}>
              <Checkbox
                inputId={dns}
                onChange={e => setSelectedRoute({
                  ...selectedRoute,
                  RouteSched: e.checked 
                    ? RouteSched.concat([dns]).sort()
                    : RouteSched.filter(item => item !== dns)
                })}
                checked={RouteSched.includes(dns)}
              />
              <label htmlFor={dns} 
                className="p-checkbox-label"
                style={{marginInline: ".5rem"}}
              >
                {dayNumberStringMap[dns]}
              </label>
            </div>
          )
        })}
      </WeekWrapper>
      <PickList
        sourceHeader="All Zones"
        targetHeader="Served By This Route"
        source={source}
        target={selectedRoute.zones}
        onChange={onChange}
        sourceStyle={{ height: "250px" }}
        targetStyle={{ height: "250px" }}
      ></PickList>
    </React.Fragment>
  );
};

export default Info;



const NumericInput = ({ attribute, item, setItem }) => <InputText
  id={attribute}
  inputMode="numeric"
  value={item[attribute]}
  onFocus={e => e.target.select()}
  onChange={e => {
    if (/^\d{0,2}$|^\d{0,2}\.\d{0,2}$/.test(e.target.value)) {
      setItem({
        ...item, 
        [attribute]: e.target.value
      })
    }
  }}
  onKeyUp={e => e.code === "Enter" && e.target.blur()}
  onBlur={() => setItem({
      ...item, 
      [attribute]: Number(item[attribute])
    })
  }
/>


// clumsy attempt an using props.children for nested components.
// Manages to clean up some of the jsx in the main component, but
// probably can be rewritten better.
const InputGroupLabel = ({ attribute, labelText, children }) => {
  const childWithProps = React.cloneElement(children, { attribute });

  return (
    <div className="p-inputgroup">
      <span className="p-inputgroup-addon">
        <label htmlFor={attribute}>{labelText}</label>
      </span>
      {childWithProps}
    </div>
  )

}