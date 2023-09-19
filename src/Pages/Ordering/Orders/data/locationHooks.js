import useSWR from "swr";
import { defaultSwrOptions } from "../../../../data/_constants"
import gqlFetcher from "../../../../data/_fetchers"

const getLocation = /* GraphQL */ `
  query GetLocation($locNick: String!) {
    getLocation(locNick: $locNick) {
      locNick
      locName
      orderCnfEmail
      latestFirstDeliv
      latestFinalDeliv
      specialInstructions
      delivOrder
      isActive 
      dfFulfill
      zoneNick
      zone {
        zoneNick
        zoneName
        description
        zoneFee
        zoneRoute {
          items {
            routeNick
          }
        }
      }
    }
  }
`;

/**read only */
export const useLocationDetails = ({ locNick, shouldFetch }) => {
  const { data } = useSWR(
    shouldFetch ? [getLocation, { locNick: locNick }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  return { data: data?.data.getLocation }

}