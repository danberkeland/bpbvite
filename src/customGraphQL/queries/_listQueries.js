import * as attributes from "../standardAttributes"

export const listDoughBackups = /* GraphQL */ `
  query ListDoughBackups(
    $filter: ModelDoughBackupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDoughBackups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ${attributes.doughBackupAttributes}
      }
      nextToken
    }
  }
`;
export const listDoughComponentBackups = /* GraphQL */ `
  query ListDoughComponentBackups(
    $filter: ModelDoughComponentBackupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDoughComponentBackups(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${attributes.doughComponentBackupAttributes}
      }
      nextToken
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
        ${attributes.userAttributes}
      }
      nextToken
    }
  }
`;
export const listUser2s = /* GraphQL */ `
  query ListUser2s(
    $filter: ModelUser2FilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUser2s(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ${attributes.user2Attributes}
      }
      nextToken
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
        ${attributes.locationUserAttributes}
      }
      nextToken
    }
  }
`;
export const listLocations = (atts) =>
  /* GraphQL */ `
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
      items {${!!atts ? atts.join(',') : attributes.locationAttributes}}
      nextToken
    }
  }
`;
export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ${attributes.orderAttributes}
      }
      nextToken
    }
  }
`;

export const listStandings = /* GraphQL */ `
  query ListStandings(
    $filter: ModelStandingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStandings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ${attributes.standingAttributes}
      }
      nextToken
    }
  }
`;
export const listZones = /* GraphQL */ `
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
        ${attributes.zoneAttributes}
      }
      nextToken
    }
  }
`;
export const listRoutes = /* GraphQL */ `
  query ListRoutes(
    $routeNick: String
    $filter: ModelRouteFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listRoutes(
      routeNick: $routeNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        ${attributes.routeAttributes}
      }
      nextToken
    }
  }
`;
export const listZoneRoutes = /* GraphQL */ `
  query ListZoneRoutes(
    $filter: ModelZoneRouteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listZoneRoutes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ${attributes.zoneRouteAttributes}
      }
      nextToken
    }
  }
`;
export const listProducts = (atts) =>
  /* GraphQL */ `
  query ListProducts(
    $prodNick: String
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listProducts(
      prodNick: $prodNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {${!!atts ? atts.join(', ') : attributes.productAttributes}}
      nextToken
    }
  }
`;
export const listTrainings = /* GraphQL */ `
  query ListTrainings(
    $filter: ModelTrainingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTrainings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ${attributes.trainingAttributes}
      }
      nextToken
    }
  }
`;
export const listInfoQBAuths = /* GraphQL */ `
  query ListInfoQBAuths(
    $filter: ModelInfoQBAuthFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInfoQBAuths(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ${attributes.infoQBAuthAttributes}
      }
      nextToken
    }
  }
`;
export const listTemplateProds = /* GraphQL */ `
  query ListTemplateProds(
    $filter: ModelTemplateProdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTemplateProds(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ${attributes.templateProdAttributes}
      }
      nextToken
    }
  }
`;
export const listProdsNotAlloweds = /* GraphQL */ `
  query ListProdsNotAlloweds(
    $filter: ModelProdsNotAllowedFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProdsNotAlloweds(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${attributes.prodsNotAllowedAttributes}
      }
      nextToken
    }
  }
`;
export const listAltPricings = /* GraphQL */ `
  query ListAltPricings(
    $filter: ModelAltPricingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAltPricings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ${attributes.altPricingAttributes}
      }
      nextToken
    }
  }
`;
export const listAltLeadTimes = /* GraphQL */ `
  query ListAltLeadTimes(
    $filter: ModelAltLeadTimeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAltLeadTimes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ${attributes.altLeadTimeAttributes}
      }
      nextToken
    }
  }
`;
export const listNotes = /* GraphQL */ `
  query ListNotes(
    $filter: ModelNotesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ${attributes.notesAttributes}
      }
      nextToken
    }
  }
`;
export const listLocationProductOverrides = /* GraphQL */ `
  query ListLocationProductOverrides(
    $filter: ModelLocationProductOverrideFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLocationProductOverrides(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${attributes.locationProductOverrideAttributes}
      }
      nextToken
    }
  }
`;
// *****************************************************************************
// Special queries -- by index
// *****************************************************************************

export const orderByDelivDate = /* GraphQL */ `
  query OrderByDelivDate(
    $delivDate: String!
    $sortDirection: ModelSortDirection
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    orderByDelivDate(
      delivDate: $delivDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${attributes.orderAttributes}
      }
      nextToken
    }
  }
`;

export const orderByLocByDelivDate = /* GraphQL */ `
  query OrderByLocByDelivDate(
    $locNick: String!
    $delivDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    orderByLocByDelivDate(
      locNick: $locNick
      delivDate: $delivDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${attributes.orderAttributes}
      }
      nextToken
    }
  }
`;

export const standingByDayOfWeek = /* GraphQL */ `
  query StandingByDayOfWeek(
    $dayOfWeek: String!
    $sortDirection: ModelSortDirection
    $filter: ModelStandingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    standingByDayOfWeek(
      dayOfWeek: $dayOfWeek
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${attributes.standingAttributes}
      }
      nextToken
    }
  }
`;

export const standingByLocByDayOfWeek = /* GraphQL */ `
  query StandingByLocByDayOfWeek(
    $locNick: String!
    $dayOfWeek: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStandingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    standingByLocByDayOfWeek(
      locNick: $locNick
      dayOfWeek: $dayOfWeek
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${attributes.standingAttributes}
      }
      nextToken
    }
  }
`;

export const notesByType = /* GraphQL */ `
  query NotesByType(
    $Type: String!
    $sortDirection: ModelSortDirection
    $filter: ModelNotesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    notesByType(
      Type: $Type
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${attributes.notesAttributes}
      }
      nextToken
    }
  }
`;
export const notesByTypeByRef = /* GraphQL */ `
  query NotesByTypeByRef(
    $Type: String!
    $ref: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelNotesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    notesByTypeByRef(
      Type: $Type
      ref: $ref
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${attributes.notesAttributes}
      }
      nextToken
    }
  }
`;
export const notesByRef = /* GraphQL */ `
  query NotesByRef(
    $ref: String!
    $sortDirection: ModelSortDirection
    $filter: ModelNotesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    notesByRef(
      ref: $ref
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${attributes.notesAttributes}
      }
      nextToken
    }
  }
`;
export const locationProductOverridesByLocNick = /* GraphQL */ `
  query LocationProductOverridesByLocNick(
    $locNick: String!
    $sortDirection: ModelSortDirection
    $filter: ModelLocationProductOverrideFilterInput
    $limit: Int
    $nextToken: String
  ) {
    locationProductOverridesByLocNick(
      locNick: $locNick
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${attributes.locationProductOverrideAttributes}
      }
      nextToken
    }
  }
`;

export const templateProdsByLocNick = /* GraphQL */ `
  query TemplateProdsByLocNick(
    $locNick: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTemplateProdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    templateProdsByLocNick(
      locNick: $locNick
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${attributes.templateProdAttributes}
      }
      nextToken
    }
  }
`;

export const User2byEmail = /* GraphQL */ `
  query User2byEmail(
    $email: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUser2FilterInput
    $limit: Int
    $nextToken: String
  ) {
    User2byEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${attributes.user2Attributes}
        defaultLoc {
          locName
        }
      }
      nextToken
    }
  }
`;