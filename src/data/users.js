import useSWR from "swr"
import { defaultSwrOptions } from "./_constants"

// import { useMemo } from "react"
import gqlFetcher from "./_fetchers"

/******************
 * QUERIES/CACHES *
 ******************/

export const getUser = /* GraphQL */ `
  query GetUser($sub: ID!) {
    getUser2(id: $sub) {
      name
      email
      phone
      authClass
      id
      defaultLoc {
        locNick
        locName
      }
      locs {
        items {
          id
          Type
          authType
          locNick
          location {
            locName
          }
          userID
          createdAt
          updatedAt
        }
      }
      createdAt
      updatedAt
    }
  }
`;

/**
 * Produces a full list of locNicks/locNames.
 * @param {boolean} shouldFetch Fetches data only when true.
 */
export const useUserDetails = (sub, shouldFetch) => {
  const { data } = useSWR(
    shouldFetch ? [getUser, { sub: sub }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  return({ 
    data: data?.data?.getUser2 //useMemo(() => data?.data?.getUser2, [data?.data?.getUser2]), 
  })

}