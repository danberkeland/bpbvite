import useSWR, { mutate } from "swr";
import { defaultSwrOptions } from "./constants";

import { useMemo } from "react";

// import dynamicSort from "../functions/dynamicSort"
import getNestedObject from "../functions/getNestedObject";

import gqlFetcher from "./fetchers";

import * as queries from "../graphql/queries";
import { sortAtoZDataByIndex } from "../helpers/sortDataHelpers";
import { listDoughComponentBackups } from "../graphql/queries";

// import * as yup from "yup"

export const useDoughFull = (shouldFetch) => {
  let query = queries.listDoughBackups;
  let variables = { limit: 500 };

  const { data, errors, mutate } = useSWR(
    shouldFetch ? [query, variables] : null,
    gqlFetcher,
    defaultSwrOptions
  );

  const transformedData = useMemo(() => {
    if (!data) return undefined;
    let final = getNestedObject(data, ["data", "listDoughBackups", "items"]);
    sortAtoZDataByIndex(final, "doughName");
    let noDelete = final.filter((dough) => dough["_deleted"] !== true);
    return noDelete
  }, [data]);

  return {
    data: transformedData,
    errors: errors,
    revalidate: () => mutate(),
  };
};

export const revalidateDough = () => {
    let query = queries.listDoughBackups;
  mutate([query, { limit: 500 }], null, { revalidate: true });
};


export const useDoughComponents = ({ shouldFetch }) => {
  let query = listDoughComponentBackups;
  let variables = { limit: 1000 };

  const { data, errors, mutate } = useSWR(
    shouldFetch ? [query, variables] : null,
    gqlFetcher,
    defaultSwrOptions
  );

  
  const transformedData = useMemo(() => {
    if (!data) return undefined;
    let final = getNestedObject(data, ["data", "listDoughComponentBackups", "items"]);
    sortAtoZDataByIndex(final, "doughName");
    let noDelete = final.filter((dough) => dough["_deleted"] !== true);
    return noDelete
  }, [data]);

  return {
    data: transformedData,
    errors: errors,
    revalidate: () => mutate()
  };
};

export const revalidateDoughComponents = () => {
    let query = queries.listDoughComponentBackups;
  mutate([query, { limit: 1000 }], null, { revalidate: true });
};

