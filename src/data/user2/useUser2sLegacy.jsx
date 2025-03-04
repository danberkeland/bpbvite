// DEPRECATED

import useSWR from "swr";
import gqlFetcher from "../_fetchers";
import { useMemo } from "react";
import { compareBy } from "../../utils/collectionFns/compareBy";

const detailedQuery = /* GraphQL */ `
  query MyQuery2 {
    listLocationUser2s {
      items {
        user {
          name
          locs {
            items {
              locNick
              userID
              Type
              authType
              location {
                locName
              }
              id
            }
          }
          email
          username
          authClass
          locNick
          phone
          id
        }
        location {
          locName
          subs2 {
            items {
              userID
              authType
              user {
                name
                locNick
                phone
                request
                subs
                username
                id
                email
              }
            }
          }
        }
      }
    }
  }
`;

/** DEPRECATED */
export function useCustomerList() {
  const { data:gqlResponse, error, mutate } = useSWR(
    [detailedQuery, { limit: 5000}],
    gqlFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const calculateValue = () => {
    if (!gqlResponse) return undefined

    console.log("gqlResponse", gqlResponse)

    const data = gqlResponse.data.listLocationUser2s.items

    let newArray = []
    for (let item of data) {
      try {
        let locations = [];
        let customers = [];
  
        for (let loc of item.user.locs.items) {
          let newLoc = {
            locNick: loc.locNick,
            locName: loc.location.locName,
            authType: loc.authType,
            sub: loc.userID,
            Type: loc.Type,
            id: loc.id,
          };
          locations.push(newLoc);
        }
        for (let sub of item.location.subs2.items) {
          let newSub = {
            sub: sub.userID,
            custName: sub.user.name,
            authType: sub.authType,
            id: sub.id,
          };
          customers.push(newSub);
        }
  
        let newItem = {
          custName: item.user.name,
          authClass: item.user.authClass,
          username: item.user.username,
          email: item.user.email,
          phone: item.user.phone,
          sub: item.user.id,
          defLoc: item.user.locNick,
          locName: item.location.locName,
          locNick: item.location.locNick,
          locations: locations,
          customers: customers,
        };
  
        newArray.push(newItem);
      } catch {}
    }
  
    return newArray.sort(compareBy(item => item.custName))

  }

  return {
    customerList: {
      data: useMemo(calculateValue, [gqlResponse]),
      isLoading: !error && !gqlResponse,
      isError: error,
      revalidate: () => mutate(),
    },
  };
}


const simpleQuery = /* GraphQL */ `
  query MyQuery {
    listUser2s {
      items {
        authClass
        email
        name
        username
        phone
        id
        locs {
          items {
            authType
            locNick
          }
        }
      }
    }
  }
`;

/** DEPRECATED */
export function useSimpleCustomerList() {
  const { data, error, mutate } = useSWR(
    [simpleQuery, { limit: 5000 }],
    gqlFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  console.log("Simple Customer List",data)

  return {
    simpleCustomerList: {
      data: data
        ? data.data.listUser2s.items
            .sort(compareBy(item => item.name))
            .map((cust) => ({
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