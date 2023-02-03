export const listZonesFull = /* GraphQL */ `
  query ListZones(
    $zoneNick: String
    $filter: ModelZoneFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listZones(
      zoneNick: $zoneNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        zoneNick
        zoneName
        description
        zoneFee
        zoneRoute {
          nextToken
        }
        createdAt
        updatedAt
      }
    }
  }
`;