import { cloneDeep } from "lodash";

const { DateTime, Interval } = require("luxon");

export const sortAtoZDataByIndex = (data, index) => {
  try {
    data.sort(function (a, b) {
      return a[index] > b[index] ? 1 : -1;
    });

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const sortZtoADataByIndex = (data, index) => {
  data.sort(function (a, b) {
    return a[index] < b[index] ? 1 : -1;
  });
  return data;
};
