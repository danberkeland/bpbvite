export const listDoughBackups = /* GraphQL */ `
  query ListDoughBackups(
    $filter: ModelDoughBackupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDoughBackups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        doughName
        hydration
        process
        batchSize
        mixedWhere
        components
        oldDough
        isBakeReady
        buffer
        bucketSets
        preBucketSets
        updatePreBucket
        saltInDry
        createdAt
        updatedAt
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
        id
        dough
        componentType
        componentName
        amount
        createdAt
        updatedAt
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
        name
        email
        username
        phone
        authClass
        sub
        locNick
        createdAt
        updatedAt
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
        id
        Type
        authType
        locNick
        sub
        createdAt
        updatedAt
      }
      nextToken
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
        Type
        locNick
        locName
        zoneNick
        addr1
        addr2
        city
        zip
        email
        orderCnfEmail
        phone
        firstName
        lastName
        toBePrinted
        toBeEmailed
        printDuplicate
        terms
        invoicing
        latestFirstDeliv
        latestFinalDeliv
        webpageURL
        picURL
        gMap
        specialInstructions
        delivOrder
        qbID
        currentBalance
        isActive
        ttl
        createdAt
        updatedAt
        locationCreditAppId
      }
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
        Type
        id
        qty
        qtyUpdatedOn
        sameDayMaxQty
        prodNick
        locNick
        ItemNote
        SO
        isWhole
        delivDate
        rate
        route
        isLate
        createdOn
        updatedOn
        updatedBy
        ttl
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
        id
        locNick
        isWhole
        isStand
        dayOfWeek
        route
        prodNick
        qty
        ItemNote
        startDate
        endDate
        createdAt
        updatedAt
        updatedBy
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
        zoneNick
        zoneName
        description
        zoneFee
        createdAt
        updatedAt
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
        routeNick
        routeName
        routeStart
        routeTime
        RouteDepart
        RouteArrive
        RouteSched
        printOrder
        driver
        createdAt
        updatedAt
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
        id
        routeNick
        zoneNick
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listProducts = /* GraphQL */ `
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
      items {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        freezerThaw
        packGroupOrder
        shapeDay
        shapeNick
        bakeDay
        bakeNick
        guarantee
        transferStage
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isRetail
        retailName
        retailDescrip
        isWhole
        isEOD
        weight
        descrip
        picURL
        squareID
        forBake
        bakeExtra
        batchSize
        defaultInclude
        leadTime
        daysAvailable
        qbID
        currentStock
        whoCountedLast
        freezerClosing
        freezerCount
        freezerNorth
        freezerNorthClosing
        freezerNorthFlag
        prepreshaped
        preshaped
        updatePreDate
        updateFreezerDate
        backporchbakerypre
        backporchbakery
        bpbextrapre
        bpbextra
        bpbssetoutpre
        bpbssetout
        sheetMake
        updatedAt
        createdAt
        inventoryProductId
      }
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
        id
        role
        order
        heading
        instruction
        createdAt
        updatedAt
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
        id
        infoName
        infoContent
        createdAt
        updatedAt
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
        id
        locNick
        prodNick
        createdAt
        updatedAt
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
        id
        isAllowed
        locNick
        prodNick
        createdAt
        updatedAt
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
        id
        wholePrice
        locNick
        prodNick
        createdAt
        updatedAt
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
        id
        leadTime
        locNick
        prodNick
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

// *****************************************************************************
// Special queries -- by index
// *****************************************************************************

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
        Type
        id
        qty
        qtyUpdatedOn
        sameDayMaxQty
        prodNick
        locNick
        ItemNote
        SO
        isWhole
        delivDate
        rate
        route
        isLate
        createdOn
        updatedOn
        updatedBy
        ttl
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
        id
        locNick
        isWhole
        isStand
        dayOfWeek
        route
        prodNick
        qty
        ItemNote
        startDate
        endDate
        createdAt
        updatedAt
        updatedBy
      }
      nextToken
    }
  }
`;