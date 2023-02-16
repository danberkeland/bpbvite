import useSWR, { mutate } from "swr";
import { defaultSwrOptions } from "./constants";

import { useMemo } from "react";

import dynamicSort from "../functions/dynamicSort";
import getNestedObject from "../functions/getNestedObject";

import gqlFetcher from "./fetchers";

import * as queries from "../customGraphQL/queries/trainingQueries";
import * as mutations from "../customGraphQL/mutations/trainingMutations";

import * as yup from "yup";

/******************
 * QUERIES/CACHES *
 ******************/

export const useTrainingListSimple = (shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listTrainingsSimple, { limit: 1000 }] : null,
    gqlFetcher,
    defaultSwrOptions
  );

  const transformData = () => {
    if (!data) return undefined;
    return getNestedObject(data, ["data", "listTrainings", "items"]).sort(
      dynamicSort("order")
    );
  };
  const _data = useMemo(transformData, [data]);

  // const _data = getNestedObject(data, ['data', 'listLocations', 'items'])
  // _data?.sort(dynamicSort("locName"))

  return {
    data: _data,
    errors: errors,
  };
};

/**
 * Can be called whenever locationListSimple data is affected by a mutation.
 * Revalidation can be called anywhere, even when useLocationListSimple is not present.
 */

export const revalidateTrainingListSimple = () => {
  mutate([queries.listTrainingsSimple, { limit: 1000 }], null, {
    revalidate: true,
  });
};


export const useTrainingListFull = (shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [queries.listTrainingFull, { limit: 1000 }] : null,
    gqlFetcher,
    defaultSwrOptions
  );
console.log('data', data)
  const transformData = () => {
    if (!data) return undefined;
    return getNestedObject(data, ["data", "listTrainings", "items"]).sort(
      dynamicSort("order")
    );
  };
  const _data = useMemo(transformData, [data]);

  return {
    data: _data,
    errors: errors,
  };
};

/**
 * Can be called whenever locationListSimple data is affected by a mutation.
 * Revalidation can be called anywhere, even when useLocationListSimple is not present.
 */
/*
export const revalidateLocationListFull = () => {
  mutate(
    [queries.listLocationsFull, { limit: 1000 }], 
    null, 
    { revalidate: true}
  )
}
*/

/**
 * Produces a more extensive list of attributes for a single location.
 * Includes product customization info which can be accessed individually,
 * or as part of the full 'data' return object
 * @param {string} locNick ID value for the desired location.
 * @param {boolean} shouldFetch Fetches data only when true.
 * @returns {{ data: object, templateProds: object, prodsNotAllowed: object, altPrices: object, altLeadTimes: object }} A single object representing the requested location.
 */
export const useTrainingDetails = (id, shouldFetch) => {
  const { data, errors } = useSWR(
    shouldFetch ? [queries.getTrainingDetails, { id: id }] : null,
    gqlFetcher,
    defaultSwrOptions
  );

  const _data = getNestedObject(data, ["data", "getTraining"]);

  return {
    data: _data,
    errors: errors,
  };
};

/**
 * Can be called whenever locationDetails data is affected by a mutation.
 * Revalidation can be called anywhere, even when useLocationDetails is not present.
 */
export const revalidateTrainingDetails = (id) => {
  mutate([queries.getTrainingDetails, { id: id }], null, { revalidate: true });
};

// consider calling the revalidate functions above after
// performing one or a batch of mutations below.

/*************
 * MUTATIONS *
 *************/

const LOGGING = true;

export const createTraining = async (createTrainingInput) => {
  if (LOGGING) console.log("Create training input: ", createTrainingInput);

  if (!createTrainingSchema.isValid(createTrainingInput)) {
    console.log("createTraining validation failed");
    return;
  }

  const response = await gqlFetcher(mutations.createTraining, {
    input: createTrainingInput,
  });
  if (LOGGING) console.log("Create training response: ", response);
};

export const updateTraining = async (updateTrainingInput) => {
  if (LOGGING) console.log("Update training input: ", updateTrainingInput);
  const response = await gqlFetcher(mutations.updateTraining, {
    input: updateTrainingInput,
  });
  if (LOGGING) console.log("Update training response: ", response);
};

export const deleteTraining = async (deleteTrainingInput) => {
  if (LOGGING) console.log("Delete training input: ", deleteTrainingInput);
  const response = await gqlFetcher(mutations.deleteTraining, {
    input: deleteTrainingInput,
  });
  if (LOGGING) console.log("Delete training response: ", response);
};

/***********
 * SCHEMAS *
 ***********/

const createTrainingSchema = yup.object().shape({
  Type: yup.string().default("Training"),
  role: yup.string().required("Required"),

  header: yup
    .string()

    .required("Required"),

  order: yup.number().required("Required"),
  instruction: yup.string(),
});
