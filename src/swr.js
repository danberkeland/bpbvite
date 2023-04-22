import { Auth } from "aws-amplify";
import axios from "axios";
import useSWR from "swr";
import { sortAtoZDataByIndex } from "./utils";

const API_bpbrouterAuth =
  "https://8gw70qn5eb.execute-api.us-east-2.amazonaws.com/auth";

const fetcher = async (path) => {
  console.log("fetching ", path);
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;
  console.log("token", token);

  let res = await axios.post(API_bpbrouterAuth + path.url, {}, {
    headers: {
      'content-type': 'application/json',
      'Authorization': token,
    },
  }).catch(error => {
    console.log("Axios error", error.response)
  }
  )
  
  console.log("done.");
  console.log("res",res)
  return res;
};

export function useLocUserList() {
  const { data, error, mutate } = useSWR(
    { url: "/locations/grabDetailedLocUserList" },
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
    { url: "/locations/grabDetailedLocationList" },
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    simpleLocationList: {
      data: data
        ? sortAtoZDataByIndex(data.data.body.items, "locName").map((loc) => ({
            label: loc.locName,
            value: loc.locNick,
           
          }))
        : data,
      isLoading: !error && !data,
      isError: error,
      revalidate: () => mutate(),
    },
  };
}

export function useProductList() {
  const { data, error, mutate } = useSWR(
    { url: "/products/grabDetailedProductList" },
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

export function useCustomerList() {
  const { data, error, mutate } = useSWR(
    { url: "/locationUsers/grabDetailedLocationUserList" },
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    customerList: {
      data: data ? sortAtoZDataByIndex(data.data.body.items, "custName") : data,
      isLoading: !error && !data,
      isError: error,
      revalidate: () => mutate(),
    },
  };
}


export function useSimpleCustomerList() {
  const { data, error, mutate } = useSWR(
    { url: "/customers/grabSimpleCustomerList" },
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  console.log("data",data)

  return {
    simpleCustomerList: {
      data: data
        ? sortAtoZDataByIndex(data.data.body.items, "name").map((cust) => ({
            label: cust.name,
            sub: cust.sub,
            value: cust.name,
          }))
        : data,
      isLoading: !error && !data,
      isError: error,
      revalidate: () => mutate(),
    },
  };
}



export function useLocationList() {
  const { data, error, mutate } = useSWR(
    { url: "/locations/grabDetailedLocationList" },
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

export function useSimpleZoneList() {
  const { data, error, mutate } = useSWR(
    { url: "/zones/grabDetailedZoneList" },
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    simpleZoneList: {
      data: data
        ? sortAtoZDataByIndex(data.data.body.items, "zoneName").map((zone) => ({
            label: zone.zoneName,
            value: zone.zoneNick,
          }))
        : data,
      isLoading: !error && !data,
      isError: error,
      revalidate: () => mutate(),
    },
  };
}

