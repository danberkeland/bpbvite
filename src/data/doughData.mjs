// OK

// import useSWR, { mutate } from "swr"
// import { defaultSwrOptions } from "./_constants"
// import gqlFetcher from "./_fetchers"
// import { listDoughBackups, listDoughComponentBackups } from "../graphql/queries.js"

// import { useMemo } from "react"
// import { sortBy } from "lodash"

// export const useDoughFull = (shouldFetch) => {
//   let query = listDoughBackups;
//   let variables = { limit: 500 }

//   const { data, ...otherReturns } = useSWR(
//     shouldFetch ? [query, variables] : null,
//     gqlFetcher,
//     defaultSwrOptions
//   )

//   const transformedData = useMemo(() => {
//     if (!data) return undefined

//     const items = data.data.listDoughBackups.items
//     return sortBy(items, ["doughName"])
//       .filter(item => item["_deleted"] !== true)

//   }, [data])

//   return {
//     data: transformedData,
//     ...otherReturns
//   }
// }

// export const revalidateDough = () => {
//     let query = listDoughBackups;
//   mutate([query, { limit: 500 }], null, { revalidate: true });
// };


// export const useDoughComponents = ({ shouldFetch }) => {
//   let query = listDoughComponentBackups;
//   let variables = { limit: 1000 };

//   const { data, ...otherReturns } = useSWR(
//     shouldFetch ? [query, variables] : null,
//     gqlFetcher,
//     defaultSwrOptions
//   );

//   const transformedData = useMemo(() => {
//     if (!data) return undefined

//     const items = data.data.listDoughComponentBackups.items
//     return sortBy(items, ["doughName"])
//       .filter(item => item["_deleted"] !== true)

//   }, [data]);

//   return {
//     data: transformedData,
//     ...otherReturns
//   };
// };

// export const revalidateDoughComponents = () => {
//     let query = listDoughComponentBackups;
//   mutate([query, { limit: 1000 }], null, { revalidate: true });
// };

