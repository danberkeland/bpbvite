/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLocation = /* GraphQL */ `
  query GetLocation($locNick: String!) {
    getLocation(locNick: $locNick) {
      locNick
      locName
      subs {
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
  }
`;
export const listLocations = /* GraphQL */ `
  query ListLocations(
    $locNick: String
    $filter: ModelLocationFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listLocations(
      locNick: $locNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
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
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $sub: String
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      sub: $sub
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        name
        email
        phone
        sub
        locs {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLocationUser = /* GraphQL */ `
  query GetLocationUser($id: ID!) {
    getLocationUser(id: $id) {
      id
      authType
      location_id
      user_id
      location {
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
      user {
        name
        email
        phone
        sub
        locs {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      locationSubsId
      userLocsId
    }
  }
`;
export const listLocationUsers = /* GraphQL */ `
  query ListLocationUsers(
    $filter: ModelLocationUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLocationUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        authType
        location_id
        user_id
        location {
          locNick
          locName
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
        locationSubsId
        userLocsId
      }
      nextToken
    }
  }
`;
export const getRequest = /* GraphQL */ `
  query GetRequest($id: ID!) {
    getRequest(id: $id) {
      id
      name
      loc
      createdAt
      updatedAt
    }
  }
`;
export const listRequests = /* GraphQL */ `
  query ListRequests(
    $filter: ModelRequestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        loc
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
