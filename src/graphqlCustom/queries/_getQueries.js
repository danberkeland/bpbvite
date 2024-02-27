import { locationAttributes, productAttributes } from "../standardAttributes";
// for those rare cases where just a single item will suffice.

export const getLocation = /* GraphQL */ `
  query GetLocation($locNick: String!) {
    getLocation(locNick: $locNick) {
      ${locationAttributes}
    }
  }
`;

export const getProduct = /* GraphQL */ `
  query GetProduct($prodNick: String!) {
    getProduct(prodNick: $prodNick) {
      ${productAttributes}
    }
  }
`;