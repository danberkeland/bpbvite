import useSWR, { mutate } from "swr";
import { defaultSwrOptions } from "./constants";

import { useMemo } from "react";

// import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject";

import gqlFetcher from "./fetchers";

import * as queries from "../customGraphQL/queries/routeQueries";
import { listZoneRoutes } from "../customGraphQL/queries/zoneRouteQueries";

// import * as yup from "yup"

export const useRouteListFull = (shouldFetch) => {
  let query = queries.listRoutesFull;
  let variables = { limit: 1000 };

  const { data, errors } = useSWR(
    shouldFetch ? [query, variables] : null,
    gqlFetcher,
    defaultSwrOptions
  );

  const transformedData = useMemo(() => {
    if (!data) return undefined;
    let final = getNestedObject(data, ["data", "listRoutes", "items"]);
    
    const transformedRouteServe = final.map((route) => ({
      ...route,
      RouteServe: route.zoneRoute.items.map((item) => item.zone.zoneName)
    }));
    console.log('transformedRouteServe', transformedRouteServe)
    return transformedRouteServe
  }, [data]);

  return {
    data: transformedData,
    errors: errors,
  };
};

export const useZoneRouteListFull = ({ shouldFetch }) => {
  let query = listZoneRoutes;
  let variables = { limit: 1000 };

  const { data, errors } = useSWR(
    shouldFetch ? [query, variables] : null,
    gqlFetcher,
    defaultSwrOptions
  );

  return {
    data: getNestedObject(data, ["data", "listZoneRoutes", "items"]),
    errors: errors,
  };
};
