
import { cloneDeep } from "lodash";

const { DateTime, Interval } = require("luxon");

export const sortAtoZDataByIndex = (data, index) => {
  let dataIn = cloneDeep(data)
 
  data.sort(function (a, b) {
    return a[index] > b[index] ? 1 : -1;
  });
  let dataOut = cloneDeep(data)
  
  return data;
};

export const sortZtoADataByIndex = (data, index) => {
  data.sort(function (a, b) {
    return a[index] < b[index] ? 1 : -1;
  });
  return data;
};
