import useSWR, { mutate } from "swr";
import { defaultSwrOptions } from "./_constants";

import gqlFetcher from "./_fetchers";

import * as queries from "../customGraphQL/queries/routeQueries";
import { listZoneRoutes } from "../customGraphQL/queries/zoneRouteQueries";


// actually joins zoneRoute data to each route item, so the below
// useZoneRouteListFull hook is not strictly necessary
export const useRouteListFull = ({ shouldFetch }) => {
  let query = queries.listRoutesFull;
  let variables = { limit: 1000 };

  const { data, ...otherReturns } = useSWR(
    shouldFetch ? [query, variables] : null,
    gqlFetcher,
    defaultSwrOptions
  );

  return {
    data: data?.data.listRoutes.items ?? undefined,
    ...otherReturns
  };
};

export const revalidateRouteList = () => {
  let query = queries.listRoutesFull;
  mutate([query, { limit: 1000 }], null, { revalidate: true });
};


export const useZoneRouteListFull = ({ shouldFetch }) => {
  let query = listZoneRoutes;
  let variables = { limit: 1000 };

  const { data, ...otherReturns } = useSWR(
    shouldFetch ? [query, variables] : null,
    gqlFetcher,
    defaultSwrOptions
  );

  return {
    data: data?.data.listZoneRoutes.items ?? undefined,
    ...otherReturns
  };
};

