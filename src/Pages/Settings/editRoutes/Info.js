import React, { useEffect, useState, useContext, useRef } from "react";

import styled from "styled-components";


import { InputText } from "primereact/inputtext";
import { PickList } from "primereact/picklist";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

import {
  setValue,
  fixValue,
  setPickValue,
  setDropDownValue,
} from "../../../helpers/formHelpers";

import { listZones } from "../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

import { sortAtoZDataByIndex } from "../../../helpers/sortDataHelpers";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { useRouteListFull } from "../../../data/routeData";

const clonedeep = require("lodash.clonedeep");

const DuoWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 0 20px 0;
`;

const WeekWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  margin: 0 0 30px 0;
`;

const hubDepart = [{ RouteDepart: "Prado" }, { RouteDepart: "Carlton" }];

const hubArrive = [{ RouteArrive: "Prado" }, { RouteArrive: "Carlton" }];

const Info = ({ selectedRoute, setSelectedRoute }) => {
  
    const setIsLoading = useSettingsStore((state) => state.setIsLoading);
   
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);

  const fullZones = useRef();

  const [days, setDays] = useState([]);

  const onDayChange = (e) => {
    let selectedDays = [...days];
    if (e.checked) selectedDays.push(e.value);
    else selectedDays.splice(selectedDays.indexOf(e.value), 1);

    let itemToUpdate = clonedeep(selectedRoute);
    itemToUpdate["RouteSched"] = selectedDays;
    setSelectedRoute(itemToUpdate);
    setDays(selectedDays);
  };

  const { data:routes } = useRouteListFull({shouldFetch: true });
 

  useEffect(() => {
    setTarget(selectedRoute["RouteServe"]);
  }, [selectedRoute]);

  useEffect(() => {
    setDays(selectedRoute["RouteSched"]);
  }, [selectedRoute]);

  useEffect(() => {
    let parsedZones = [];
    console.log('selectedRoute', selectedRoute)
    console.log('target', target)
    if (fullZones.current) {
      parsedZones = fullZones.current.filter(
        (full) => !selectedRoute["RouteServe"]?.includes(full)
      );
    }
    setSource(parsedZones);
  }, [selectedRoute]);

  const itemTemplate = (item) => {
    return <div>{item}</div>;
  };

  const onChange = (event) => {
    setSource(event.source);
    setSelectedRoute(setPickValue(event, selectedRoute));
  };

  return (
    <React.Fragment>
      <h2>
        <i className="pi pi-map"></i> Route Info
      </h2>

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="zoneName"> Route Name</label>
          <br />
        </span>

        <InputText
          id="routeName"
          placeholder={selectedRoute.routeName}
          disabled
          onKeyUp={(e) =>
            e.code === "Enter" && setSelectedRoute(setValue(e, selectedRoute))
          }
          onBlur={(e) => setSelectedRoute(fixValue(e, selectedRoute))}
        />
      </div>
      <br />
      <DuoWrapper>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="zoneName"> Route Start Time (0-24)</label>
          </span>

          <InputText
            id="routeStart"
            placeholder={selectedRoute.routeStart}
            onKeyUp={(e) =>
              e.code === "Enter" && setSelectedRoute(setValue(e, selectedRoute))
            }
            onBlur={(e) => setSelectedRoute(fixValue(e, selectedRoute))}
          />
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="zoneName"> Route Duration (in hours)</label>
          </span>

          <InputText
            id="routeTime"
            placeholder={selectedRoute.routeTime}
            onKeyUp={(e) =>
              e.code === "Enter" && setSelectedRoute(setValue(e, selectedRoute))
            }
            onBlur={(e) => setSelectedRoute(fixValue(e, selectedRoute))}
          />
        </div>
      </DuoWrapper>
      <DuoWrapper>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="RouteDepart">Depart Hub</label>
          </span>
          <Dropdown
            id="RouteDepart"
            optionLabel="RouteDepart"
            options={hubDepart}
            onChange={(e) =>
              setSelectedRoute(setDropDownValue(e, selectedRoute))
            }
            placeholder={
              selectedRoute ? selectedRoute.RouteDepart : "Departure Hub"
            }
          />
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <label htmlFor="RouteArrive">Arrival Hub</label>
          </span>
          <Dropdown
            id="RouteArrive"
            optionLabel="RouteArrive"
            options={hubArrive}
            onChange={(e) =>
              setSelectedRoute(setDropDownValue(e, selectedRoute))
            }
            placeholder={
              selectedRoute ? selectedRoute.RouteArrive : "Arrival Hub"
            }
          />
        </div>
      </DuoWrapper>
      <WeekWrapper>
        <div className="p-col-12">
          <Checkbox
            inputId="cb1"
            value="1"
            onChange={onDayChange}
            checked={days.includes("1")}
          ></Checkbox>
          <label htmlFor="cb1" className="p-checkbox-label">
            Sun
          </label>
        </div>
        <div className="p-col-12">
          <Checkbox
            inputId="cb2"
            value="2"
            onChange={onDayChange}
            checked={days.includes("2")}
          ></Checkbox>
          <label htmlFor="cb2" className="p-checkbox-label">
            Mon
          </label>
        </div>
        <div className="p-col-12">
          <Checkbox
            inputId="cb3"
            value="3"
            onChange={onDayChange}
            checked={days.includes("3")}
          ></Checkbox>
          <label htmlFor="cb3" className="p-checkbox-label">
            Tues
          </label>
        </div>
        <div className="p-col-12">
          <Checkbox
            inputId="cb3"
            value="4"
            onChange={onDayChange}
            checked={days.includes("4")}
          ></Checkbox>
          <label htmlFor="cb3" className="p-checkbox-label">
            Wed
          </label>
        </div>
        <div className="p-col-12">
          <Checkbox
            inputId="cb3"
            value="5"
            onChange={onDayChange}
            checked={days.includes("5")}
          ></Checkbox>
          <label htmlFor="cb3" className="p-checkbox-label">
            Thurs
          </label>
        </div>
        <div className="p-col-12">
          <Checkbox
            inputId="cb3"
            value="6"
            onChange={onDayChange}
            checked={days.includes("6")}
          ></Checkbox>
          <label htmlFor="cb3" className="p-checkbox-label">
            Fri
          </label>
        </div>
        <div className="p-col-12">
          <Checkbox
            inputId="cb3"
            value="7"
            onChange={onDayChange}
            checked={days.includes("7")}
          ></Checkbox>
          <label htmlFor="cb3" className="p-checkbox-label">
            Sat
          </label>
        </div>
      </WeekWrapper>
      <PickList
        sourceHeader="All Zones"
        targetHeader="Served By This Route"
        source={source}
        target={selectedRoute["RouteServe"]}
        itemTemplate={itemTemplate}
        onChange={onChange}
        sourceStyle={{ height: "250px" }}
        targetStyle={{ height: "250px" }}
      ></PickList>
    </React.Fragment>
  );
};

export default Info;
