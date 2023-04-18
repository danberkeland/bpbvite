import { sortAtoZDataByIndex } from "./sortDataHelpers";

const clonedeep = require("lodash.clonedeep");

export const setPickValue = (value, selected) => {
  let itemToUpdate = clonedeep(selected);
  itemToUpdate["RouteServe"] = value.target;
  return itemToUpdate;
};

export const setPickUserValue = (value, selected) => {
  let itemToUpdate = clonedeep(selected);
  itemToUpdate = value.target;
  return itemToUpdate;
};

export const setValue = (value, selected) => {
  if (value.code === "Enter") {
    let itemToUpdate = clonedeep(selected);
    value.target.value === "true" ? value.target.value = true : 
    itemToUpdate[value.target.id] = value.target.value;
    document.getElementById(value.target.id).value = "";
    return itemToUpdate;
  }
};

export const fixValue = (value, selected) => {
  let itemToUpdate = clonedeep(selected);
  if (value.target.value !== "") {
    value.target.value === "true" ? value.target.value = true : 
    itemToUpdate[value.target.id] = value.target.value;
  }
  document.getElementById(value.target.id).value = "";
  return itemToUpdate;
};

export const setDropDownValue = (value, selected) => {
  let itemToUpdate = clonedeep(selected);
  let attr = value.target.id;
 
  itemToUpdate[attr] = value.value[attr];
  return itemToUpdate;
};

export const setYesNoValue = (value, selected) => {
  console.log("value",value)
  let itemToUpdate = clonedeep(selected);
  let attr = value.target.id;
  itemToUpdate[attr] = value.value;
  return itemToUpdate;
};

export const getZoneGroup = (customers) => {
  if (customers.length > 0) {
    let zoneGroup = clonedeep(customers);
    zoneGroup = zoneGroup.map((cust) => cust["zoneName"]);
    for (let i = 0; i < zoneGroup.length; ++i) {
      for (let j = i + 1; j < zoneGroup.length; ++j) {
        while (zoneGroup[i] === zoneGroup[j]) {
          zoneGroup.splice(j, 1);
        }
      }
    }
    zoneGroup = zoneGroup.map((zone) => ({ zoneName: zone }));
    zoneGroup = sortAtoZDataByIndex(zoneGroup, "zoneName");
    return zoneGroup;
  }
};
