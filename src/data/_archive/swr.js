// import { Auth } from "aws-amplify";
// import axios from "axios";
// import useSWR from "swr";
// import { sortAtoZDataByIndex } from "./utils/_deprecated/utils";
// import gqlFetcher from "./data/_fetchers";
// import { useMemo } from "react";
// import { compareBy } from "./utils/collectionFns/compareBy";

// const API_bpbrouterAuth =
//   "https://8gw70qn5eb.execute-api.us-east-2.amazonaws.com/auth";

// const fetcher = async (path) => {
//   console.log("fetching ", path);
//   const user = await Auth.currentAuthenticatedUser();
//   const token = user.signInUserSession.idToken.jwtToken;
//   console.log("token", token);

//   let res = await axios.post(API_bpbrouterAuth + path.url, {}, {
//     headers: {
//       'content-type': 'application/json',
//       'Authorization': token,
//     },
//   }).catch(error => {
//     console.log("Axios error", error.response)
//   }
//   )
  
//   console.log("done.");
//   console.log("res",res)
//   return res;
// };

// export function useCustomerList() {
//   const { data, error, mutate } = useSWR(
//     { url: "/locationUsers/grabDetailedLocationUserList" },
//     fetcher,
//     {
//       revalidateIfStale: false,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: true,
//     }
//   );

//   return {
//     customerList: {
//       data: data ? sortAtoZDataByIndex(data.data.body.items, "custName") : data,
//       isLoading: !error && !data,
//       isError: error,
//       revalidate: () => mutate(),
//     },
//   };
// }

// const detailedQuery = /* GraphQL */ `
//   query MyQuery2 {
//     listLocationUser2s {
//       items {
//         user {
//           name
//           locs {
//             items {
//               locNick
//               userID
//               Type
//               authType
//               location {
//                 locName
//               }
//               id
//             }
//           }
//           email
//           username
//           authClass
//           locNick
//           phone
//           id
//         }
//         location {
//           locName
//           subs2 {
//             items {
//               userID
//               authType
//               user {
//                 name
//                 locNick
//                 phone
//                 request
//                 subs
//                 username
//                 id
//                 email
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// export function useCustomerList() {
//   const { data:gqlResponse, error, mutate } = useSWR(
//     [detailedQuery, { limit: 5000}],
//     gqlFetcher,
//     {
//       revalidateIfStale: false,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: true,
//     }
//   );

//   const calculateValue = () => {
//     if (!gqlResponse) return undefined

//     console.log("gqlResponse", gqlResponse)

//     const data = gqlResponse.data.listLocationUser2s.items

//     let newArray = []
//     for (let item of data) {
//       try {
//         let locations = [];
//         let customers = [];
  
//         for (let loc of item.user.locs.items) {
//           let newLoc = {
//             locNick: loc.locNick,
//             locName: loc.location.locName,
//             authType: loc.authType,
//             sub: loc.userID,
//             Type: loc.Type,
//             id: loc.id,
//           };
//           locations.push(newLoc);
//         }
//         for (let sub of item.location.subs2.items) {
//           let newSub = {
//             sub: sub.userID,
//             custName: sub.user.name,
//             authType: sub.authType,
//             id: sub.id,
//           };
//           customers.push(newSub);
//         }
  
//         let newItem = {
//           custName: item.user.name,
//           authClass: item.user.authClass,
//           username: item.user.username,
//           email: item.user.email,
//           phone: item.user.phone,
//           sub: item.user.id,
//           defLoc: item.user.locNick,
//           locName: item.location.locName,
//           locNick: item.location.locNick,
//           locations: locations,
//           customers: customers,
//         };
  
//         newArray.push(newItem);
//       } catch {}
//     }
  
//     return newArray.sort(compareBy(item => item.custName))

//     // let apiGatewayResponse = {
//     //   ...gqlResponse,
//     //   user: gqlResponse.data.user,
//     //   body: { items: sortAtoZDataByIndex(newArray, "custName") }
//     // };

//     // const finalValue = apiGatewayResponse.body.items
//     // return finalValue
//   }


//   return {
//     customerList: {
//       // data: data ? sortAtoZDataByIndex(data.data.body.items, "custName") : data,
//       data: useMemo(calculateValue, [gqlResponse]),
//       isLoading: !error && !gqlResponse,
//       isError: error,
//       revalidate: () => mutate(),
//     },
//   };
// }

// export function useSimpleCustomerList() {
//   const { data, error, mutate } = useSWR(
//     { url: "/customers/grabSimpleCustomerList" },
//     fetcher,
//     {
//       revalidateIfStale: false,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: true,
//     }
//   );

//   console.log("data",data)

//   return {
//     simpleCustomerList: {
//       data: data
//         ? sortAtoZDataByIndex(data.data.body.items, "name").map((cust) => ({
//             label: cust.name,
//             sub: cust.sub,
//             value: cust.name,
//           }))
//         : data,
//       isLoading: !error && !data,
//       isError: error,
//       revalidate: () => mutate(),
//     },
//   };
// }

// const simpleQuery = /* GraphQL */ `
//   query MyQuery {
//     listUser2s {
//       items {
//         authClass
//         email
//         name
//         username
//         phone
//         id
//         locs {
//           items {
//             authType
//             locNick
//           }
//         }
//       }
//     }
//   }
// `;

// export function useSimpleCustomerList() {
//   const { data, error, mutate } = useSWR(
//     [simpleQuery, { limit: 5000 }],
//     gqlFetcher,
//     {
//       revalidateIfStale: false,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: true,
//     }
//   );

//   console.log("Simple Customer List",data)

//   return {
//     simpleCustomerList: {
//       data: data
//         ? data.data.listUser2s.items
//             .sort(compareBy(item => item.name))
//             .map((cust) => ({
//               label: cust.name,
//               sub: cust.sub,
//               value: cust.name,
//             }))
//         : data,
//       isLoading: !error && !data,
//       isError: error,
//       revalidate: () => mutate(),
//     },
//   };
// }

























// export function useLocUserList() {
//   const { data, error, mutate } = useSWR(
//     { url: "/locations/grabDetailedLocUserList" },
//     fetcher,
//     {
//       revalidateIfStale: false,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: true,
//     }
//   );

//   return {
//     locationList: {
//       data: data ? sortAtoZDataByIndex(data.data.body.items, "locName") : data,
//       isLoading: !error && !data,
//       isError: error,
//       revalidate: () => mutate(),
//     },
//   };
// }

// export function useSimpleLocationList() {
//   const { data, error, mutate } = useSWR(
//     { url: "/locations/grabDetailedLocationList" },
//     fetcher,
//     {
//       revalidateIfStale: false,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false,
//     }
//   );

//   return {
//     simpleLocationList: {
//       data: data
//         ? sortAtoZDataByIndex(data.data.body.items, "locName").map((loc) => ({
//             label: loc.locName,
//             value: loc.locNick,
           
//           }))
//         : data,
//       isLoading: !error && !data,
//       isError: error,
//       revalidate: () => mutate(),
//     },
//   };
// }

// function useProductList() {
//   const { data, error, mutate } = useSWR(
//     { url: "/products/grabDetailedProductList" },
//     fetcher,
//     {
//       revalidateIfStale: false,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: true,
//     }
//   );

//   return {
//     productList: {
//       data: data ? sortAtoZDataByIndex(data.data.body.items, "prodName") : data,
//       isLoading: !error && !data,
//       isError: error,
//       revalidate: () => mutate(),
//     },
//   };
// }

// function useLocationList() {
//   const { data, error, mutate } = useSWR(
//     { url: "/locations/grabDetailedLocationList" },
//     fetcher,
//     {
//       revalidateIfStale: false,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: true,
//     }
//   );

//   return {
//     locationList: {
//       data: data ? sortAtoZDataByIndex(data.data.body.items, "locName") : data,
//       isLoading: !error && !data,
//       isError: error,
//       revalidate: () => mutate(),
//     },
//   };
// }

// export function useSimpleZoneList() {
//   const { data, error, mutate } = useSWR(
//     { url: "/zones/grabDetailedZoneList" },
//     fetcher,
//     {
//       revalidateIfStale: false,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: true,
//     }
//   );

//   return {
//     simpleZoneList: {
//       data: data
//         ? sortAtoZDataByIndex(data.data.body.items, "zoneName").map((zone) => ({
//             label: zone.zoneName,
//             value: zone.zoneNick,
//           }))
//         : data,
//       isLoading: !error && !data,
//       isError: error,
//       revalidate: () => mutate(),
//     },
//   };
// }

