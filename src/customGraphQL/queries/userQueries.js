export const getUser = /* GraphQL */ `
  query GetUser($sub: String!) {
    getUser(sub: $sub) {
      name
      email
      phone
      authClass
      sub
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
          sub
          createdAt
          updatedAt
        }
      }
      createdAt
      updatedAt
    }
  }
`;