const locationQuery = /* GraphQL */ `
  listLocations(
    # locNick: $locNick
    # filter: $filter
    limit: $limit
    # nextToken: $nextToken
    # sortDirection: $sortDirection
  ) {
    items {
      # Type
      locNick
      locName
      subs {
        items {
          sub
        }
      }
      # standing {}
      # orders {}
      # ordersByDate {}
      zoneNick
      # zone {}
      # creditApp {}
      addr1
      addr2
      city
      zip
      email
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
      # isActive
      # prodsNotAllowed {} # maybe use?
      # customProd {} # maybe use?
      # templateProd {} # maybe use?
      # altLeadTimeByProduct {}
      # createdAt
      # updatedAt
      # locationCreditAppId
    }
    # nextToken
  }
`;
const productQuery = /* GraphQL */ `
  listProducts(
    # prodNick: $prodNick
    # filter: $filter
    limit: $limit
    # nextToken: $nextToken
    # sortDirection: $sortDirection
  ) {
    items {
      # Type
      prodName
      prodNick
      packGroup
      packSize
      doughNick
      # doughType {
      #   doughNick
      #   doughName
      #   hydration
      #   batchSize
      #   mixedWhere
      #   isBakeReady
      #   buffer
      #   saltInDry
      #   createdAt
      #   updatedAt
      # }
      freezerThaw
      packGroupOrder
      # shapeDay
      # shapeNick
      # bakeDay
      # bakeNick
      # guarantee
      # transferStage
      readyTime
      bakedWhere
      wholePrice
      retailPrice
      # isRetail
      # retailName
      # retailDescrip
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
      qbID
      currentStock
      freezerClosing
      freezerCount
      freezerNorth
      freezerNorthClosing
      freezerNorthFlag
      prepreshaped
      preshaped
      updatePreDate
      whoCountedLast
      updateFreezerDate
      backporchbakerypre
      backporchbakery
      bpbextrapre
      bpbextra
      bpbssetoutpre
      bpbssetout
      sheetMake
      # retailLoc {}
      # standing {}
      # orders {}
      # depends {
      #   prod1Nick
      #   prod1 {
      #     prodName
      #   }
      #   prod2Nick
      #   prod2 {
      #     prodName
      #   }
      # }
      # altPricing {}
      # templateProd {}
      # prodsNotAllowed {}
      # productVendor {}
      # EODCount {
      #   prodNick
      #   shelfOrFreezer
      #   startOrFinish
      #   location
      #   qty
      #   whoCounted
      #   # createdAt
      #   # updatedAt
      # }
      # ActualSetOut {
      #   prodNick
      #   qty
      #   location
      #   whoSetOut
        # createdAt
        # updatedAt
      # }
      # altLeadTimeByLocation {}
      # createdAt
      # updatedAt
      # inventoryProductId # not in schema???
    }
    nextToken
  }
`;
const routeQuery = /* GraphQL */ `
  listRoutes(
    limit: $limit
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
      zoneRoute {
        items {
          zoneNick
        }
      }
    }
  }
`;
export const orderQuery = /* GraphQL */ `
  listOrders(limit: $limit) {
    items {
      # Type
      id
      qty
      # qtyUpdatedOn
      # sameDayMaxQty
      prodNick
      # product {
      #   prodName
      # }
      locNick
      # location {
      #   locName
      # }
      ItemNote
      SO
      isWhole
      delivDate
      rate
      route
      isLate
      # createdOn
      updatedOn
      # updatedBy
      # ttl
    }
    nextToken
  }
`;
export const standingQuery = /* GraphQL */ `
    listStandings(limit: $limit) {
      items {
        # id
        locNick
        # location {
        #   locName
        # }
        isWhole
        isStand
        dayOfWeek
        route
        prodNick
        # product {
        #   prodName
        # }
        qty
        # ItemNote
        # startDate
        # endDate
        # createdAt
        updatedAt
        # updatedBy
      }
      nextToken
    }
`;

export const doughBackupsQuery = /* GraphQL */ `

  listDoughBackups(limit: $limit) {
    items {
      batchSize
      bucketSets
      buffer
      components
      createdAt
      doughName
      hydration
      id
      isBakeReady
      mixedWhere
      oldDough
      preBucketSets
      process
      saltInDry
      updatePreBucket
      updatedAt
    }
  }

`;

export const doughComponentsBackupsQuery = /* GraphQL */ `

listDoughComponentBackups(limit: $limit)  {
  items {
    amount
    componentName
    componentType
    createdAt
    dough
    id
    updatedAt
  }
}

`;

export const getLegacyDatabase = /* GraphQL */ `
  query GetLegacyDatabase(
    $limit: Int
  ) {
    ${locationQuery}
    ${productQuery}
    ${routeQuery}
    ${orderQuery}
    ${standingQuery}
    ${doughBackupsQuery}
    ${doughComponentsBackupsQuery}
    
    
  }
`;
