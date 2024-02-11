import { locationAttributes } from "../standardAttributes";
// for those rare cases where just a single item will suffice.

export const getLocation = /* GraphQL */ `
  query GetLocation($locNick: String!) {
    getLocation(locNick: $locNick) {
      ${locationAttributes}
    }
  }
`;