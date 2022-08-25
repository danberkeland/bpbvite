import { API, graphqlOperation } from "aws-amplify";

import {
  listOrderBackups,
  getOrder,
  listStandingBackups,
  listStandings,
  locSortAZ
} from "../../graphql/queries";
import {
  updateOrder,
  createOrder,
  createStanding,
} from "../../graphql/mutations";

// Alternative to API Gateway + Lambda
export const grabLocNames = async () => {
  const response = await API.graphql(graphqlOperation(
    locSortAZ, 
    {
      Type: "Location",
      limit: 1000
    }
  ));

  const returnValue = response.data.locSortAZ.items.map( item => {
    return {
      label: item.locName, 
      value: item.locNick
    }
  });

  return returnValue;
};

export const grabOldOrd = async () => {
  const loc = await API.graphql(
    graphqlOperation(listOrderBackups, {
      limit: "2000",
    })
  );
  return loc.data.listOrderBackups.items;
};

export const checkExistsNewOrd = async (old) => {
  try {
    let ord = await API.graphql(graphqlOperation(getOrder, { id: old }));
    console.log("ord", ord.data.getOrder);

    return ord.data.getOrder ? true : false;
  } catch (error) {
    console.log("Order Does not exist", error);
    return false;
  }
};

export const updateNewOrd = async (old, prods, locs) => {
  let prodInd = prods.findIndex((prod) => prod.prodName === old.prodName);
  let prodNick = prods[prodInd].nickName;
  old.prodNick = prodNick;

  let locInd = locs.findIndex((loc) => loc.custName === old.custName);
  let locNick = locs[locInd].nickName;
  old.locNick = locNick;
  old.locName = old.custName;
  old.ItemNote = old.PONote;
  old.createdOn = Date.now();

  delete old.custName;
  delete old.prodName;
  delete old.locName;
  delete old.PONote;
  delete old.route;
  delete old.timeStamp;
  delete old.createdAt;
  delete old.updatedAt;

  try {
    await API.graphql(graphqlOperation(updateOrder, { input: { ...old } }));
  } catch (error) {
    console.log("error on updating order", error);
  }
};

export const createNewOrd = async (old, prods, locs) => {
  let prodInd = prods.findIndex((prod) => prod.prodName === old.prodName);
  let prodNick = prods[prodInd].nickName;
  old.prodNick = prodNick;

  let locInd = locs.findIndex((loc) => loc.custName === old.custName);
  let locNick = locs[locInd].nickName;
  old.locNick = locNick;
  old.locName = old.custName;
  old.ItemNote = old.PONote;
  delete old.timeStamp;
  delete old.createdAt;
  delete old.updatedAt;

  delete old.custName;
  delete old.prodName;
  delete old.locName;
  delete old.PONote;
  delete old.route;

  try {
    await API.graphql(graphqlOperation(createOrder, { input: { ...old } }));
  } catch (error) {
    console.log("error on creating order", error);
  }
};

export const grabOldStand = async () => {
  const loc = await API.graphql(
    graphqlOperation(listStandingBackups, {
      limit: "1000",
    })
  );
  return loc.data.listStandingBackups.items;
};

export const grabNewStand = async () => {
  const loc = await API.graphql(
    graphqlOperation(listStandings, {
      limit: "1000",
    })
  );
  return loc.data.listStandings.items;
};

export const checkExistsNewStand = (newStand, old, day, prods, locs) => {
  let prodInd = prods.findIndex((prod) => prod.prodName === old.prodName);
  let prodNick = prods[prodInd].nickName;
  let locInd = locs.findIndex((loc) => loc.custName === old.custName);
  let locNick = locs[locInd].nickName;

  let checkInd = newStand.findIndex(
    (st) =>
      st.prodNick === prodNick && st.locNick === locNick && st.dayOfWeek === day
  );
  return checkInd > -1 ? newStand[checkInd].id : null;
};
export const createNewStand = async (old, day, prods, locs) => {
  let prodInd = prods.findIndex((prod) => prod.prodName === old.prodName);
  let prodNick = prods[prodInd].nickName;
  let locInd = locs.findIndex((loc) => loc.custName === old.custName);
  let locNick = locs[locInd].nickName;

  let data = {
    qty: old[day],
    prodNick: prodNick,
    locNick: locNick,
    ItemNote: "",
    isWhole: true,
    dayOfWeek: day,
    startDate: "08/20/2022",
    endDate: null,
    
  };

  console.log("createdata",data)
  if (data.qty>0){
    try {
      await API.graphql(graphqlOperation(createStanding, { input: { ...data } }));
    } catch (error) {
      console.log("error on creating order", error);
    }
  }
  
};

export const updateNewStand = async (old, day, prods, locs, exists) => {
  let prodInd = prods.findIndex((prod) => prod.prodName === old.prodName);
  let prodNick = prods[prodInd].nickName;
  let locInd = locs.findIndex((loc) => loc.custName === old.custName);
  let locNick = locs[locInd].nickName;
  
  let data = {
    id: exists,
    qty: old[day],
    prodNick: prodNick,
    locNick: locNick,
    ItemNote: "",
    isWhole: true,
    isStand: old.isStand,
    dayOfWeek: day,
    startDate: "08/20/2022",
    endDate: null,
    
  };

  console.log("updatedata",data)
  /*
  try {
    await API.graphql(graphqlOperation(createStanding, { input: { ...data } }));
  } catch (error) {
    console.log("error on creating order", error);
  }
  */
};

