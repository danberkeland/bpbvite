export const listLocationUsers = /* GraphQL */ `
  query ListLocationUsers(
    $filter: ModelLocationUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLocationUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        location {
          subs {
            items {
              userID
            }
          }
          locNick
          locName
        }
        user {
          name
          sub
        }
        authType
      }
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($sub: String!) {
    getUser(sub: $sub) {
      name
      email
      phone
      sub
      defaultLoc {
        locNick
        locName
        subs {
          nextToken
        }
        zoneName
        addr1
        addr2
        city
        zip
        email
        phone
        createdAt
        updatedAt
      }
      locs {
        items {
          id
          authType
          location_id
          user_id
          createdAt
          updatedAt
          locationSubsId
          userLocsId
        }
        nextToken
      }
      createdAt
      updatedAt
      userDefaultLocId
    }
  }
`;


export const listAuth = /* GraphQL */ `
  query ListLocationUsers(
    $filter: ModelLocationUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLocationUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        authType
        id
        locationID
        userID
        location {
          locName
          locNick
          subs {
            items {
              userID
            }
          }
          createdAt
          updatedAt
        }
        user {
          name
          email
          phone
          sub
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
