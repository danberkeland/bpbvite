

import { API, graphqlOperation } from "aws-amplify";

import { listLocationBackups, getLocation } from "../../graphql/queries";
import { updateLocation, createLocation } from "../../graphql/mutations";


export const grabOldLoc = async () => {
    const loc = await API.graphql(
      graphqlOperation(listLocationBackups, {
        limit: "1000",
      })
    );
    return loc.data.listLocationBackups.items;
  };
  
  export const checkExistsNewLoc = async (old) => {
    try {
      let loc = await API.graphql(graphqlOperation(getLocation, { locNick: old }));
      console.log("prod", loc);
      return loc ? true : false;
    } catch (error) {
      console.log("Product Does not exist", error);
      return false;
    }
  };
  
  export const updateNewLoc = async (old) => {
    delete old.createdAt;
    delete old.updatedAt;
    delete old.zoneName;
    delete old.firstName;
    delete old.lastName;
    delete old.id
    old.locNick = old.nickName
    delete old.nickName
    old.locName = old.custName
    delete old.custName
    delete old.prodsNotAllowed
    delete old.customProd
    delete old.templateProd
    delete old.userSubs
    console.log("updateOld", old);
    try {
      await API.graphql(graphqlOperation(updateLocation, { input: { ...old } }));
    } catch (error) {
      console.log("error on updating locations", error);
    }
  };
  
  export const createNewLoc = async (old) => {
    delete old.createdAt;
    delete old.updatedAt;
    delete old.zoneName;
    delete old.firstName;
    delete old.lastName;
    delete old.id
    old.locNick = old.nickName
    delete old.nickName
    old.locName = old.custName
    delete old.custName
    delete old.prodsNotAllowed
    delete old.customProd
    delete old.templateProd
    delete old.userSubs
    console.log("createOld", old);
    try {
      await API.graphql(graphqlOperation(createLocation, { input: { ...old } }));
    } catch (error) {
      console.log("error on creating locations", error);
    }
  };