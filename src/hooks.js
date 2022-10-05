import axios from "axios";
import useSWR from "swr";
import { sortAtoZDataByIndex } from "./utils";

const API_bpbrouterAuth =
  "https://8gw70qn5eb.execute-api.us-east-2.amazonaws.com/auth";

const fetcher = async (path) => {
  console.log("fetching ", path);

  let res = await axios.post(API_bpbrouterAuth + path.url, path.args);
  console.log("done.");
  return res;
};

export function useLocationList() {
  const { data, error, mutate } = useSWR(
    { url: "/locations/grabDetailedLocationList", args: {} },
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    locationList: {
      data: data ? sortAtoZDataByIndex(data.data.body.items, "locName") : data,
      isLoading: !error && !data,
      isError: error,
      revalidate: () => mutate(),
    },
  };
}


export function useSimpleLocationList() {
  const { data, error, mutate } = useSWR(
    { url: "/locations/grabDetailedLocationList", args: {} },
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    simpleLocationList: {
      data: data ? sortAtoZDataByIndex(data.data.body.items, "locName").map((loc) => ({
        label: loc.locName,
        value: loc.locNick,
      })) : data,
      isLoading: !error && !data,
      isError: error,
      revalidate: () => mutate(),
    },
  };
}




export function useProductList() {
  const { data, error, mutate } = useSWR(
    { url: "/products/grabDetailedProductList", args: {} },
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    productList: {
      data: data ? sortAtoZDataByIndex(data.data.body.items, "prodName") : data,
      isLoading: !error && !data,
      isError: error,
      revalidate: () => mutate(),
    },
  };
}
