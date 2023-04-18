import { InputText } from "primereact/inputtext";
import { listDoughComponentBackups, listDoughBackups } from "../../../../graphql/queries";

import { API, graphqlOperation } from "aws-amplify";

import { sortAtoZDataByIndex } from "../../../../helpers/sortDataHelpers";
const clonedeep = require("lodash.clonedeep");

export const getCompList = (comp, doughComponents, selectedDough) => {
  console.log("compList",doughComponents)
  console.log("doughName",selectedDough.doughName)
  console.log("type",comp)
  let compList = doughComponents
    .filter(
      (dgh) =>
        dgh.dough === selectedDough.doughName && dgh.componentType === comp
    )
    .map((dg) => ({ ing: dg.componentName }));
  return compList;
};

export const updateItem = (value, itemToUpdate, itemInfo) => {
  itemToUpdate[
    itemToUpdate.findIndex(
      (item) =>
        item.dough === itemInfo[0] &&
        item.componentName === itemInfo[1] &&
        item.componentType === itemInfo[2]
    )
  ].amount = Number(value.target.value);
};

export const handleChange = (value, id, doughComponents, setIsModified) => {
  if (value.code === "Enter") {
    let itemToUpdate = clonedeep(doughComponents);
    let itemInfo = id.split("_");
    updateItem(value, itemToUpdate, itemInfo);
    document.getElementById(id).value = "";
    setIsModified(true);
    return itemToUpdate;
  }
};

export const handleBlur = (value, id, doughComponents, setIsModified) => {
  let itemToUpdate = clonedeep(doughComponents);
  let itemInfo = id.split("_");
  if (value.target.value !== "") {
    updateItem(value, itemToUpdate, itemInfo);
  }
  document.getElementById(id).value = "";
  setIsModified(true);
  return itemToUpdate;
};

export const getAmount = (e, doughComponents, selectedDough) => {
  let thisAmount = 0
  try{
    thisAmount = doughComponents.filter(
      (dgh) =>
        dgh.dough === selectedDough.doughName && dgh.componentName === e.ing
    )[0].amount;
  } catch {}
  
  return thisAmount;
};

export const addUp = (comp, doughComponents, selectedDough) => {
  let compSum = 0;
  doughComponents
    .filter(
      (dgh) =>
        dgh.dough === selectedDough.doughName && dgh.componentType === comp
    )
    .forEach((element) => {
      compSum = compSum + Number(element.amount);
    });
  return compSum;
};

export const getPercent = (e, comp, doughComponents, selectedDough) => {
  let thisAmount = getAmount(e, doughComponents, selectedDough);

  let totalAmount = addUp(comp, doughComponents, selectedDough);

  return thisAmount / totalAmount;
};

export const getFlourWeight = (e, doughComponents, selectedDough) => {
  let bulkWeight = selectedDough.batchSize;
  let hydro = Number(selectedDough.hydration);
  let levNum = addUp("lev", doughComponents, selectedDough);
  let addNum = addUp("dryplus", doughComponents, selectedDough);
  let postNum = addUp("post", doughComponents, selectedDough);
  let fl = (
    bulkWeight /
    (1 + hydro * 0.01 + levNum * 0.01 + addNum * 0.01 + postNum * 0.01)
  ).toFixed(2);
  return fl;
};

export const getItemPercent = (e, doughComponents, selectedDough) => {
  let placeholder = getAmount(e, doughComponents, selectedDough);
  return placeholder;
};

export const handleInput = (
  e,
  doughComponents,
  selectedDough,
  setDoughComponents,
  setIsModified
) => {
  let placeholder = getAmount(e, doughComponents, selectedDough);
  let id;
  doughComponents
    .filter(
      (dgh) =>
        dgh.dough === selectedDough.doughName && dgh.componentName === e.ing
    )
    .forEach((element) => {
      id =
        selectedDough.doughName +
        "_" +
        element.componentName +
        "_" +
        element.componentType;
    });
  return (
    <InputText
      id={id}
      style={{
        width: "50px",
        backgroundColor: "#E3F2FD",
        fontWeight: "bold",
      }}
      placeholder={placeholder}
      onKeyUp={(e) =>
        e.code === "Enter" &&
        setDoughComponents(handleChange(e, id, doughComponents, setIsModified))
      }
      onBlur={(e) =>
        setDoughComponents(handleBlur(e, id, doughComponents, setIsModified))
      }
    />
  );
};


export const fetchDoughs = async (setDoughs) => {
  try {
    const doughData = await API.graphql(
      graphqlOperation(listDoughBackups, {
        limit: "500",
      })
    );
    const doughList = doughData.data.listDoughs.items;
    sortAtoZDataByIndex(doughList, "doughName");
    let noDelete = doughList.filter((dough) => dough["_deleted"] !== true);

    setDoughs(noDelete);
  } catch (error) {
    console.log("error on fetching Dough List", error);
  }
};

export const fetchDoughComponents = async (setDoughComponents) => {
  try {
    const doughData = await API.graphql(
      graphqlOperation(listDoughComponentBackups, {
        limit: "500",
      })
    );
    const doughList = doughData.data.listDoughComponents.items;
    sortAtoZDataByIndex(doughList, "doughName");
    let noDelete = doughList.filter((dough) => dough["_deleted"] !== true);

    setDoughComponents(noDelete);
  } catch (error) {
    console.log("error on fetching Dough List", error);
  }
};
