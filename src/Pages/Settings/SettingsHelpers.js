import { API, graphqlOperation } from "aws-amplify";

import {
  listZoneBackups,
  getZone,
  listRouteBackups,
  getRoute,
  listZoneRoutes,
} from "../../graphql/queries";
import {
  updateZone,
  createZone,
  updateRoute,
  createRoute,
  createZoneRoute
} from "../../graphql/mutations";

export const grabOldZone = async () => {
  const loc = await API.graphql(
    graphqlOperation(listZoneBackups, {
      limit: "1000",
    })
  );
  return loc.data.listZoneBackups.items;
};

export const checkExistsNewZone = async (old) => {
  try {
    let zone = await API.graphql(graphqlOperation(getZone, { zoneNick: old }));
    console.log("zone", zone.data.getZone);

    return zone.data.getZone ? true : false;
  } catch (error) {
    console.log("Zone Does not exist", error);
    return false;
  }
};

export const updateNewZone = async (old) => {
  delete old.id;
  delete old.zoneNum;
  old.zoneNick = old.zoneName;
  delete old.createdAt;
  delete old.updatedAt;

  try {
    await API.graphql(graphqlOperation(updateZone, { input: { ...old } }));
  } catch (error) {
    console.log("error on updating zone", error);
  }
};

export const createNewZone = async (old) => {
  delete old.id;
  old.zoneNick = old.zoneName;
  delete old.createdAt;
  delete old.updatedAt;
  delete old.RouteServe;

  try {
    await API.graphql(graphqlOperation(createZone, { input: { ...old } }));
  } catch (error) {
    console.log("error on creating zone", error);
  }
};

export const grabOldRoute = async () => {
  const loc = await API.graphql(
    graphqlOperation(listRouteBackups, {
      limit: "1000",
    })
  );
  return loc.data.listRouteBackups.items;
};

export const checkExistsNewRoute = async (old) => {
  try {
    let route = await API.graphql(
      graphqlOperation(getRoute, { routeNick: old })
    );
    console.log("route", route.data.getRoute);

    return route.data.getRoute ? true : false;
  } catch (error) {
    console.log("Route Does not exist", error);
    return false;
  }
};

export const updateNewRoute = async (old) => {
  delete old.id;
  old.routeNick = old.routeName;
  delete old.createdAt;
  delete old.updatedAt;
  delete old.RouteServe;

  try {
    await API.graphql(graphqlOperation(updateRoute, { input: { ...old } }));
  } catch (error) {
    console.log("error on updating route", error);
  }
};

export const createNewRoute = async (old) => {
  delete old.id;
  old.routeNick = old.routeName;
  delete old.createdAt;
  delete old.updatedAt;
  delete old.RouteServe;

  try {
    await API.graphql(graphqlOperation(createRoute, { input: { ...old } }));
  } catch (error) {
    console.log("error on creating route", error);
  }
};


export const grabZoneRoute = async () => {
    const zoneRoute = await API.graphql(
        graphqlOperation(listZoneRoutes, {
          limit: "1000",
        })
      );
      return zoneRoute.data.listZoneRoutes.items;
}

export const checkExistsNewZoneRoute = (zoneRoute,routeNick, zoneNick) => {
    try {
        let ind = zoneRoute.findInd(zr => zr.routeNick === routeNick && zr.zoneNick === zoneNick)
        return ind >-1 ? true : false;
      } catch (error) {
        console.log("ZoneRoute Does not exist", error);
        return false;
      }
}


export const createNewZoneRoute = async (routeNick, zoneNick) => {

    let data = {
        routeNick: "",
        zoneNick: ""
    }
    data.routeNick = routeNick
    data.zoneNick = zoneNick

    console.log("data",data)
    
  try {
    await API.graphql(graphqlOperation(createZoneRoute, { input: { ...data } }));
  } catch (error) {
    console.log("error on creating zoneRoute", error);
  }
}


