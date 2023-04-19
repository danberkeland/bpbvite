import useSWR, { mutate } from "swr";
import { defaultSwrOptions } from "./constants";

import { useMemo } from "react";

import dynamicSort from "../functions/dynamicSort";
import getNestedObject from "../functions/getNestedObject";

import gqlFetcher from "./fetchers";

const query = `query MyQuery {
  listNotes {
    items {
      id
      note
      when
    }
  }
}`;

export const useNotesList = () => {
  const { data, errors, isValidating } = useSWR(
    [query, { limit: 1000 }],
    gqlFetcher,
    defaultSwrOptions
  );
  console.log("data", data);

  const transformData = () => {
    if (!data) return undefined;
    console.log("data", data);
    return getNestedObject(data, ["data", "listNotes", "items"]).sort(
      dynamicSort("when")
    );
  };
  const _data = useMemo(transformData, [data]);

  return {
    data: _data,
    errors: errors,
    isValidating: isValidating,
  };
};

/**
 * Can be called whenever locationListSimple data is affected by a mutation.
 * Revalidation can be called anywhere, even when useLocationListSimple is not present.
 */
export const revalidateNotes = () => {
  mutate([query, { limit: 1000 }], null, { revalidate: true });
};
