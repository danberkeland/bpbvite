/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLocationBackup = /* GraphQL */ `
  query GetLocationBackup($id: ID!) {
    getLocationBackup(id: $id) {
      id
      nickName
      custName
      zoneName
      addr1
      addr2
      city
      zip
      email
      firstName
      lastName
      phone
      toBePrinted
      toBeEmailed
      printDuplicate
      terms
      invoicing
      prodsNotAllowed
      latestFirstDeliv
      latestFinalDeliv
      webpageURL
      picURL
      gMap
      specialInstructions
      delivOrder
      customProd
      templateProd
      userSubs
      qbID
      currentBalance
      createdAt
      updatedAt
    }
  }
`;
export const listLocationBackups = /* GraphQL */ `
  query ListLocationBackups(
    $filter: ModelLocationBackupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLocationBackups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nickName
        custName
        zoneName
        addr1
        addr2
        city
        zip
        email
        firstName
        lastName
        phone
        toBePrinted
        toBeEmailed
        printDuplicate
        terms
        invoicing
        prodsNotAllowed
        latestFirstDeliv
        latestFinalDeliv
        webpageURL
        picURL
        gMap
        specialInstructions
        delivOrder
        customProd
        templateProd
        userSubs
        qbID
        currentBalance
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProductBackup = /* GraphQL */ `
  query GetProductBackup($id: ID!) {
    getProductBackup(id: $id) {
      id
      prodName
      nickName
      packGroup
      packSize
      doughType
      freezerThaw
      eodCount
      packGroupOrder
      readyTime
      bakedWhere
      wholePrice
      retailPrice
      isWhole
      depends
      weight
      descrip
      picURL
      squareID
      currentStock
      whoCountedLast
      forBake
      bakeExtra
      batchSize
      preshaped
      prepreshaped
      updatePreDate
      updateFreezerDate
      backporchbakerypre
      backporchbakery
      bpbextrapre
      bpbextra
      bpbssetoutpre
      bpbssetout
      defaultInclude
      leadTime
      qbID
      freezerCount
      freezerClosing
      sheetMake
      freezerNorth
      freezerNorthClosing
      freezerNorthFlag
      createdAt
      updatedAt
    }
  }
`;
export const listProductBackups = /* GraphQL */ `
  query ListProductBackups(
    $filter: ModelProductBackupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProductBackups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        prodName
        nickName
        packGroup
        packSize
        doughType
        freezerThaw
        eodCount
        packGroupOrder
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isWhole
        depends
        weight
        descrip
        picURL
        squareID
        currentStock
        whoCountedLast
        forBake
        bakeExtra
        batchSize
        preshaped
        prepreshaped
        updatePreDate
        updateFreezerDate
        backporchbakerypre
        backporchbakery
        bpbextrapre
        bpbextra
        bpbssetoutpre
        bpbssetout
        defaultInclude
        leadTime
        qbID
        freezerCount
        freezerClosing
        sheetMake
        freezerNorth
        freezerNorthClosing
        freezerNorthFlag
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLocation = /* GraphQL */ `
  query GetLocation($locNick: String!) {
    getLocation(locNick: $locNick) {
      locNick
      locName
      subs {
        items {
          id
          authType
          locNick
          sub
          createdAt
          updatedAt
        }
        nextToken
      }
      zoneID
      zone {
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
      addr1
      addr2
      city
      zip
      email
      phone
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
      prodsNotAllowed {
        items {
          id
          locNick
          prodNick
          createdAt
          updatedAt
        }
        nextToken
      }
      customProd {
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
      templateProd {
        items {
          id
          locNick
          prodNick
          createdAt
          updatedAt
        }
        nextToken
      }
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
        zoneID
        zone {
          zoneNick
          zoneName
          description
          zoneFee
          createdAt
          updatedAt
        }
        addr1
        addr2
        city
        zip
        email
        phone
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
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
      locNick
      defaultLoc {
        locNick
        locName
        subs {
          nextToken
        }
        zoneID
        zone {
          zoneNick
          zoneName
          description
          zoneFee
          createdAt
          updatedAt
        }
        addr1
        addr2
        city
        zip
        email
        phone
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        createdAt
        updatedAt
      }
      locs {
        items {
          id
          authType
          locNick
          sub
          createdAt
          updatedAt
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
        locNick
        defaultLoc {
          locNick
          locName
          zoneID
          addr1
          addr2
          city
          zip
          email
          phone
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
          createdAt
          updatedAt
        }
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
export const getProduct = /* GraphQL */ `
  query GetProduct($prodNick: String!) {
    getProduct(prodNick: $prodNick) {
      id
      prodName
      prodNick
      packGroupID
      packGroup {
        id
        packGroup
        createdAt
        updatedAt
      }
      packSize
      doughNick
      doughType {
        doughNick
        doughName
        hydration
        batchSize
        mixedWhere
        components {
          nextToken
        }
        isBakeReady
        buffer
        saltInDry
        createdAt
        updatedAt
      }
      freezerThaw
      packGroupOrder
      readyTime
      bakedWhere
      wholePrice
      retailPrice
      isWhole
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
      depends {
        items {
          id
          prod1Nick
          prod2Nick
          createdAt
          updatedAt
        }
        nextToken
      }
      altPricing {
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
      templateProd {
        items {
          id
          locNick
          prodNick
          createdAt
          updatedAt
        }
        nextToken
      }
      prodsNotAllowed {
        items {
          id
          locNick
          prodNick
          createdAt
          updatedAt
        }
        nextToken
      }
      productVendor {
        items {
          id
          prodNick
          vendorNick
          createdAt
          updatedAt
        }
        nextToken
      }
      EODCount {
        id
        prodNick
        product {
          id
          prodName
          prodNick
          packGroupID
          packSize
          doughNick
          freezerThaw
          packGroupOrder
          readyTime
          bakedWhere
          wholePrice
          retailPrice
          isWhole
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
          createdAt
          updatedAt
          inventoryProductId
          productEODCountId
          productActualSetOutId
        }
        shelfOrFreezer
        startOrFinish
        location
        qty
        whoCounted
        createdAt
        updatedAt
      }
      ActualSetOut {
        id
        prodNick
        prodName {
          id
          prodName
          prodNick
          packGroupID
          packSize
          doughNick
          freezerThaw
          packGroupOrder
          readyTime
          bakedWhere
          wholePrice
          retailPrice
          isWhole
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
          createdAt
          updatedAt
          inventoryProductId
          productEODCountId
          productActualSetOutId
        }
        qty
        location
        whoSetOut
        createdAt
        updatedAt
        actualSetOutProdNameId
      }
      createdAt
      updatedAt
      inventoryProductId
      productEODCountId
      productActualSetOutId
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
        id
        prodName
        prodNick
        packGroupID
        packGroup {
          id
          packGroup
          createdAt
          updatedAt
        }
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        freezerThaw
        packGroupOrder
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isWhole
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
        depends {
          nextToken
        }
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        productVendor {
          nextToken
        }
        EODCount {
          id
          prodNick
          shelfOrFreezer
          startOrFinish
          location
          qty
          whoCounted
          createdAt
          updatedAt
        }
        ActualSetOut {
          id
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
          actualSetOutProdNameId
        }
        createdAt
        updatedAt
        inventoryProductId
        productEODCountId
        productActualSetOutId
      }
      nextToken
    }
  }
`;
export const getZone = /* GraphQL */ `
  query GetZone($zoneNick: String!) {
    getZone(zoneNick: $zoneNick) {
      zoneNick
      zoneName
      description
      zoneFee
      zoneRoute {
        items {
          id
          routeNick
          zoneNick
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
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
        zoneRoute {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRoute = /* GraphQL */ `
  query GetRoute($routeNick: String!) {
    getRoute(routeNick: $routeNick) {
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
          id
          routeNick
          zoneNick
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
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
        zoneRoute {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDough = /* GraphQL */ `
  query GetDough($doughNick: String!) {
    getDough(doughNick: $doughNick) {
      doughNick
      doughName
      hydration
      batchSize
      mixedWhere
      components {
        items {
          id
          componentType
          inventoryID
          unitID
          amount
          createdAt
          updatedAt
          doughComponentsId
        }
        nextToken
      }
      isBakeReady
      buffer
      saltInDry
      createdAt
      updatedAt
    }
  }
`;
export const listDoughs = /* GraphQL */ `
  query ListDoughs(
    $doughNick: String
    $filter: ModelDoughFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listDoughs(
      doughNick: $doughNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        doughNick
        doughName
        hydration
        batchSize
        mixedWhere
        components {
          nextToken
        }
        isBakeReady
        buffer
        saltInDry
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDoughComponent = /* GraphQL */ `
  query GetDoughComponent($id: ID!) {
    getDoughComponent(id: $id) {
      id
      componentType
      inventoryID
      inventoryName {
        id
        ingName
        ingNick
        ingTypeID
        ingType {
          id
          unitName
          createdAt
          updatedAt
        }
        vendor {
          nextToken
        }
        product {
          nextToken
        }
        unitID
        unit {
          id
          unitName
          createdAt
          updatedAt
        }
        bakeryLocation
        intLocNick
        internalLocation {
          intLocNick
          bakeryLoc
          intLocDescrip
          createdAt
          updatedAt
        }
        whoCounted
        createdAt
        updatedAt
      }
      unitID
      unit {
        id
        unitName
        createdAt
        updatedAt
      }
      amount
      createdAt
      updatedAt
      doughComponentsId
    }
  }
`;
export const listDoughComponents = /* GraphQL */ `
  query ListDoughComponents(
    $filter: ModelDoughComponentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDoughComponents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        componentType
        inventoryID
        inventoryName {
          id
          ingName
          ingNick
          ingTypeID
          unitID
          bakeryLocation
          intLocNick
          whoCounted
          createdAt
          updatedAt
        }
        unitID
        unit {
          id
          unitName
          createdAt
          updatedAt
        }
        amount
        createdAt
        updatedAt
        doughComponentsId
      }
      nextToken
    }
  }
`;
export const getInventory = /* GraphQL */ `
  query GetInventory($id: ID!) {
    getInventory(id: $id) {
      id
      ingName
      ingNick
      ingTypeID
      ingType {
        id
        unitName
        createdAt
        updatedAt
      }
      vendor {
        items {
          vendorName
          vendorNick
          createdAt
          updatedAt
          inventoryVendorId
        }
        nextToken
      }
      product {
        items {
          id
          prodName
          prodNick
          packGroupID
          packSize
          doughNick
          freezerThaw
          packGroupOrder
          readyTime
          bakedWhere
          wholePrice
          retailPrice
          isWhole
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
          createdAt
          updatedAt
          inventoryProductId
          productEODCountId
          productActualSetOutId
        }
        nextToken
      }
      unitID
      unit {
        id
        unitName
        createdAt
        updatedAt
      }
      bakeryLocation
      intLocNick
      internalLocation {
        intLocNick
        bakeryLoc
        intLocDescrip
        createdAt
        updatedAt
      }
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const listInventories = /* GraphQL */ `
  query ListInventories(
    $filter: ModelInventoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInventories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        ingName
        ingNick
        ingTypeID
        ingType {
          id
          unitName
          createdAt
          updatedAt
        }
        vendor {
          nextToken
        }
        product {
          nextToken
        }
        unitID
        unit {
          id
          unitName
          createdAt
          updatedAt
        }
        bakeryLocation
        intLocNick
        internalLocation {
          intLocNick
          bakeryLoc
          intLocDescrip
          createdAt
          updatedAt
        }
        whoCounted
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUnit = /* GraphQL */ `
  query GetUnit($id: ID!) {
    getUnit(id: $id) {
      id
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const listUnits = /* GraphQL */ `
  query ListUnits(
    $filter: ModelUnitFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUnits(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        unitName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getInternalLoc = /* GraphQL */ `
  query GetInternalLoc($intLocNick: String!) {
    getInternalLoc(intLocNick: $intLocNick) {
      intLocNick
      bakeryLoc
      intLocDescrip
      createdAt
      updatedAt
    }
  }
`;
export const listInternalLocs = /* GraphQL */ `
  query ListInternalLocs(
    $intLocNick: String
    $filter: ModelInternalLocFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listInternalLocs(
      intLocNick: $intLocNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        intLocNick
        bakeryLoc
        intLocDescrip
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getIngType = /* GraphQL */ `
  query GetIngType($id: ID!) {
    getIngType(id: $id) {
      id
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const listIngTypes = /* GraphQL */ `
  query ListIngTypes(
    $filter: ModelIngTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listIngTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        unitName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getVendor = /* GraphQL */ `
  query GetVendor($vendorNick: String!) {
    getVendor(vendorNick: $vendorNick) {
      vendorName
      vendorNick
      productVendor {
        items {
          id
          prodNick
          vendorNick
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      inventoryVendorId
    }
  }
`;
export const listVendors = /* GraphQL */ `
  query ListVendors(
    $vendorNick: String
    $filter: ModelVendorFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listVendors(
      vendorNick: $vendorNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        vendorName
        vendorNick
        productVendor {
          nextToken
        }
        createdAt
        updatedAt
        inventoryVendorId
      }
      nextToken
    }
  }
`;
export const getEODCount = /* GraphQL */ `
  query GetEODCount($id: ID!) {
    getEODCount(id: $id) {
      id
      prodNick
      product {
        id
        prodName
        prodNick
        packGroupID
        packGroup {
          id
          packGroup
          createdAt
          updatedAt
        }
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        freezerThaw
        packGroupOrder
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isWhole
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
        depends {
          nextToken
        }
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        productVendor {
          nextToken
        }
        EODCount {
          id
          prodNick
          shelfOrFreezer
          startOrFinish
          location
          qty
          whoCounted
          createdAt
          updatedAt
        }
        ActualSetOut {
          id
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
          actualSetOutProdNameId
        }
        createdAt
        updatedAt
        inventoryProductId
        productEODCountId
        productActualSetOutId
      }
      shelfOrFreezer
      startOrFinish
      location
      qty
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const listEODCounts = /* GraphQL */ `
  query ListEODCounts(
    $filter: ModelEODCountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEODCounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        prodNick
        product {
          id
          prodName
          prodNick
          packGroupID
          packSize
          doughNick
          freezerThaw
          packGroupOrder
          readyTime
          bakedWhere
          wholePrice
          retailPrice
          isWhole
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
          createdAt
          updatedAt
          inventoryProductId
          productEODCountId
          productActualSetOutId
        }
        shelfOrFreezer
        startOrFinish
        location
        qty
        whoCounted
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPocketCount = /* GraphQL */ `
  query GetPocketCount($id: ID!) {
    getPocketCount(id: $id) {
      id
      doughNick
      doughType {
        doughNick
        doughName
        hydration
        batchSize
        mixedWhere
        components {
          nextToken
        }
        isBakeReady
        buffer
        saltInDry
        createdAt
        updatedAt
      }
      size
      qty
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const listPocketCounts = /* GraphQL */ `
  query ListPocketCounts(
    $filter: ModelPocketCountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPocketCounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        size
        qty
        whoCounted
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getActualSetOut = /* GraphQL */ `
  query GetActualSetOut($id: ID!) {
    getActualSetOut(id: $id) {
      id
      prodNick
      prodName {
        id
        prodName
        prodNick
        packGroupID
        packGroup {
          id
          packGroup
          createdAt
          updatedAt
        }
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        freezerThaw
        packGroupOrder
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isWhole
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
        depends {
          nextToken
        }
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        productVendor {
          nextToken
        }
        EODCount {
          id
          prodNick
          shelfOrFreezer
          startOrFinish
          location
          qty
          whoCounted
          createdAt
          updatedAt
        }
        ActualSetOut {
          id
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
          actualSetOutProdNameId
        }
        createdAt
        updatedAt
        inventoryProductId
        productEODCountId
        productActualSetOutId
      }
      qty
      location
      whoSetOut
      createdAt
      updatedAt
      actualSetOutProdNameId
    }
  }
`;
export const listActualSetOuts = /* GraphQL */ `
  query ListActualSetOuts(
    $filter: ModelActualSetOutFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listActualSetOuts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        prodNick
        prodName {
          id
          prodName
          prodNick
          packGroupID
          packSize
          doughNick
          freezerThaw
          packGroupOrder
          readyTime
          bakedWhere
          wholePrice
          retailPrice
          isWhole
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
          createdAt
          updatedAt
          inventoryProductId
          productEODCountId
          productActualSetOutId
        }
        qty
        location
        whoSetOut
        createdAt
        updatedAt
        actualSetOutProdNameId
      }
      nextToken
    }
  }
`;
export const getCroixSheetCount = /* GraphQL */ `
  query GetCroixSheetCount($id: ID!) {
    getCroixSheetCount(id: $id) {
      id
      qty
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const listCroixSheetCounts = /* GraphQL */ `
  query ListCroixSheetCounts(
    $filter: ModelCroixSheetCountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCroixSheetCounts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        qty
        whoCounted
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPackGroup = /* GraphQL */ `
  query GetPackGroup($id: ID!) {
    getPackGroup(id: $id) {
      id
      packGroup
      createdAt
      updatedAt
    }
  }
`;
export const listPackGroups = /* GraphQL */ `
  query ListPackGroups(
    $filter: ModelPackGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPackGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        packGroup
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getOldDough = /* GraphQL */ `
  query GetOldDough($id: ID!) {
    getOldDough(id: $id) {
      id
      doughID
      dough {
        doughNick
        doughName
        hydration
        batchSize
        mixedWhere
        components {
          nextToken
        }
        isBakeReady
        buffer
        saltInDry
        createdAt
        updatedAt
      }
      qty
      createdAt
      updatedAt
    }
  }
`;
export const listOldDoughs = /* GraphQL */ `
  query ListOldDoughs(
    $filter: ModelOldDoughFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOldDoughs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        doughID
        dough {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        qty
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getBucketInfo = /* GraphQL */ `
  query GetBucketInfo($id: ID!) {
    getBucketInfo(id: $id) {
      id
      doughID
      dough {
        doughNick
        doughName
        hydration
        batchSize
        mixedWhere
        components {
          nextToken
        }
        isBakeReady
        buffer
        saltInDry
        createdAt
        updatedAt
      }
      bucketType
      qty
      totalDoughWeight
      whoMixed
      createdAt
      updatedAt
    }
  }
`;
export const listBucketInfos = /* GraphQL */ `
  query ListBucketInfos(
    $filter: ModelBucketInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBucketInfos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        doughID
        dough {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        bucketType
        qty
        totalDoughWeight
        whoMixed
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getNotes = /* GraphQL */ `
  query GetNotes($id: ID!) {
    getNotes(id: $id) {
      id
      note
      forWhom
      byWhom
      when
      createdAt
      updatedAt
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
        id
        note
        forWhom
        byWhom
        when
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getInfoQBAuth = /* GraphQL */ `
  query GetInfoQBAuth($id: ID!) {
    getInfoQBAuth(id: $id) {
      id
      infoName
      infoContent
      createdAt
      updatedAt
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
export const getEventLog = /* GraphQL */ `
  query GetEventLog($id: ID!) {
    getEventLog(id: $id) {
      id
      eventType
      eventDescrip
      userID
      user {
        name
        email
        phone
        sub
        locNick
        defaultLoc {
          locNick
          locName
          zoneID
          addr1
          addr2
          city
          zip
          email
          phone
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
          createdAt
          updatedAt
        }
        locs {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listEventLogs = /* GraphQL */ `
  query ListEventLogs(
    $filter: ModelEventLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEventLogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        eventType
        eventDescrip
        userID
        user {
          name
          email
          phone
          sub
          locNick
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
export const getInvoice = /* GraphQL */ `
  query GetInvoice($id: String!) {
    getInvoice(id: $id) {
      id
      orders {
        items {
          id
          qty
          prodNick
          locNick
          PONote
          fulfill
          SO
          isWhole
          delivDate
          rate
          isLate
          createdAt
          updatedAt
          invoiceOrdersId
        }
        nextToken
      }
      locNick
      location {
        locNick
        locName
        subs {
          nextToken
        }
        zoneID
        zone {
          zoneNick
          zoneName
          description
          zoneFee
          createdAt
          updatedAt
        }
        addr1
        addr2
        city
        zip
        email
        phone
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listInvoices = /* GraphQL */ `
  query ListInvoices(
    $id: String
    $filter: ModelInvoiceFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listInvoices(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        orders {
          nextToken
        }
        locNick
        location {
          locNick
          locName
          zoneID
          addr1
          addr2
          city
          zip
          email
          phone
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
export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
      id
      qty
      prodNick
      product {
        id
        prodName
        prodNick
        packGroupID
        packGroup {
          id
          packGroup
          createdAt
          updatedAt
        }
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        freezerThaw
        packGroupOrder
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isWhole
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
        depends {
          nextToken
        }
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        productVendor {
          nextToken
        }
        EODCount {
          id
          prodNick
          shelfOrFreezer
          startOrFinish
          location
          qty
          whoCounted
          createdAt
          updatedAt
        }
        ActualSetOut {
          id
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
          actualSetOutProdNameId
        }
        createdAt
        updatedAt
        inventoryProductId
        productEODCountId
        productActualSetOutId
      }
      locNick
      location {
        locNick
        locName
        subs {
          nextToken
        }
        zoneID
        zone {
          zoneNick
          zoneName
          description
          zoneFee
          createdAt
          updatedAt
        }
        addr1
        addr2
        city
        zip
        email
        phone
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        createdAt
        updatedAt
      }
      PONote
      fulfill
      SO
      isWhole
      delivDate
      rate
      isLate
      createdAt
      updatedAt
      invoiceOrdersId
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
        id
        qty
        prodNick
        product {
          id
          prodName
          prodNick
          packGroupID
          packSize
          doughNick
          freezerThaw
          packGroupOrder
          readyTime
          bakedWhere
          wholePrice
          retailPrice
          isWhole
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
          createdAt
          updatedAt
          inventoryProductId
          productEODCountId
          productActualSetOutId
        }
        locNick
        location {
          locNick
          locName
          zoneID
          addr1
          addr2
          city
          zip
          email
          phone
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
          createdAt
          updatedAt
        }
        PONote
        fulfill
        SO
        isWhole
        delivDate
        rate
        isLate
        createdAt
        updatedAt
        invoiceOrdersId
      }
      nextToken
    }
  }
`;
export const getTemplateProd = /* GraphQL */ `
  query GetTemplateProd($id: ID!) {
    getTemplateProd(id: $id) {
      id
      locNick
      prodNick
      location {
        locNick
        locName
        subs {
          nextToken
        }
        zoneID
        zone {
          zoneNick
          zoneName
          description
          zoneFee
          createdAt
          updatedAt
        }
        addr1
        addr2
        city
        zip
        email
        phone
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        createdAt
        updatedAt
      }
      product {
        id
        prodName
        prodNick
        packGroupID
        packGroup {
          id
          packGroup
          createdAt
          updatedAt
        }
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        freezerThaw
        packGroupOrder
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isWhole
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
        depends {
          nextToken
        }
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        productVendor {
          nextToken
        }
        EODCount {
          id
          prodNick
          shelfOrFreezer
          startOrFinish
          location
          qty
          whoCounted
          createdAt
          updatedAt
        }
        ActualSetOut {
          id
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
          actualSetOutProdNameId
        }
        createdAt
        updatedAt
        inventoryProductId
        productEODCountId
        productActualSetOutId
      }
      createdAt
      updatedAt
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
        location {
          locNick
          locName
          zoneID
          addr1
          addr2
          city
          zip
          email
          phone
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
          createdAt
          updatedAt
        }
        product {
          id
          prodName
          prodNick
          packGroupID
          packSize
          doughNick
          freezerThaw
          packGroupOrder
          readyTime
          bakedWhere
          wholePrice
          retailPrice
          isWhole
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
          createdAt
          updatedAt
          inventoryProductId
          productEODCountId
          productActualSetOutId
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProdsNotAllowed = /* GraphQL */ `
  query GetProdsNotAllowed($id: ID!) {
    getProdsNotAllowed(id: $id) {
      id
      locNick
      prodNick
      location {
        locNick
        locName
        subs {
          nextToken
        }
        zoneID
        zone {
          zoneNick
          zoneName
          description
          zoneFee
          createdAt
          updatedAt
        }
        addr1
        addr2
        city
        zip
        email
        phone
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        createdAt
        updatedAt
      }
      product {
        id
        prodName
        prodNick
        packGroupID
        packGroup {
          id
          packGroup
          createdAt
          updatedAt
        }
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        freezerThaw
        packGroupOrder
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isWhole
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
        depends {
          nextToken
        }
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        productVendor {
          nextToken
        }
        EODCount {
          id
          prodNick
          shelfOrFreezer
          startOrFinish
          location
          qty
          whoCounted
          createdAt
          updatedAt
        }
        ActualSetOut {
          id
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
          actualSetOutProdNameId
        }
        createdAt
        updatedAt
        inventoryProductId
        productEODCountId
        productActualSetOutId
      }
      createdAt
      updatedAt
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
        locNick
        prodNick
        location {
          locNick
          locName
          zoneID
          addr1
          addr2
          city
          zip
          email
          phone
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
          createdAt
          updatedAt
        }
        product {
          id
          prodName
          prodNick
          packGroupID
          packSize
          doughNick
          freezerThaw
          packGroupOrder
          readyTime
          bakedWhere
          wholePrice
          retailPrice
          isWhole
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
          createdAt
          updatedAt
          inventoryProductId
          productEODCountId
          productActualSetOutId
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProductDepend = /* GraphQL */ `
  query GetProductDepend($id: ID!) {
    getProductDepend(id: $id) {
      id
      prod1Nick
      prod1 {
        id
        prodName
        prodNick
        packGroupID
        packGroup {
          id
          packGroup
          createdAt
          updatedAt
        }
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        freezerThaw
        packGroupOrder
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isWhole
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
        depends {
          nextToken
        }
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        productVendor {
          nextToken
        }
        EODCount {
          id
          prodNick
          shelfOrFreezer
          startOrFinish
          location
          qty
          whoCounted
          createdAt
          updatedAt
        }
        ActualSetOut {
          id
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
          actualSetOutProdNameId
        }
        createdAt
        updatedAt
        inventoryProductId
        productEODCountId
        productActualSetOutId
      }
      prod2Nick
      prod2 {
        id
        prodName
        prodNick
        packGroupID
        packGroup {
          id
          packGroup
          createdAt
          updatedAt
        }
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        freezerThaw
        packGroupOrder
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isWhole
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
        depends {
          nextToken
        }
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        productVendor {
          nextToken
        }
        EODCount {
          id
          prodNick
          shelfOrFreezer
          startOrFinish
          location
          qty
          whoCounted
          createdAt
          updatedAt
        }
        ActualSetOut {
          id
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
          actualSetOutProdNameId
        }
        createdAt
        updatedAt
        inventoryProductId
        productEODCountId
        productActualSetOutId
      }
      createdAt
      updatedAt
    }
  }
`;
export const listProductDepends = /* GraphQL */ `
  query ListProductDepends(
    $filter: ModelProductDependFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProductDepends(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        prod1Nick
        prod1 {
          id
          prodName
          prodNick
          packGroupID
          packSize
          doughNick
          freezerThaw
          packGroupOrder
          readyTime
          bakedWhere
          wholePrice
          retailPrice
          isWhole
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
          createdAt
          updatedAt
          inventoryProductId
          productEODCountId
          productActualSetOutId
        }
        prod2Nick
        prod2 {
          id
          prodName
          prodNick
          packGroupID
          packSize
          doughNick
          freezerThaw
          packGroupOrder
          readyTime
          bakedWhere
          wholePrice
          retailPrice
          isWhole
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
          createdAt
          updatedAt
          inventoryProductId
          productEODCountId
          productActualSetOutId
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getZoneRoute = /* GraphQL */ `
  query GetZoneRoute($id: ID!) {
    getZoneRoute(id: $id) {
      id
      routeNick
      route {
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
          nextToken
        }
        createdAt
        updatedAt
      }
      zoneNick
      zone {
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
      createdAt
      updatedAt
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
        route {
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
        zoneNick
        zone {
          zoneNick
          zoneName
          description
          zoneFee
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
export const getLocationUser = /* GraphQL */ `
  query GetLocationUser($id: ID!) {
    getLocationUser(id: $id) {
      id
      authType
      locNick
      sub
      location {
        locNick
        locName
        subs {
          nextToken
        }
        zoneID
        zone {
          zoneNick
          zoneName
          description
          zoneFee
          createdAt
          updatedAt
        }
        addr1
        addr2
        city
        zip
        email
        phone
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        createdAt
        updatedAt
      }
      user {
        name
        email
        phone
        sub
        locNick
        defaultLoc {
          locNick
          locName
          zoneID
          addr1
          addr2
          city
          zip
          email
          phone
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
          createdAt
          updatedAt
        }
        locs {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
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
        locNick
        sub
        location {
          locNick
          locName
          zoneID
          addr1
          addr2
          city
          zip
          email
          phone
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
          createdAt
          updatedAt
        }
        user {
          name
          email
          phone
          sub
          locNick
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
export const getAltPricing = /* GraphQL */ `
  query GetAltPricing($id: ID!) {
    getAltPricing(id: $id) {
      id
      wholePrice
      locNick
      loc {
        locNick
        locName
        subs {
          nextToken
        }
        zoneID
        zone {
          zoneNick
          zoneName
          description
          zoneFee
          createdAt
          updatedAt
        }
        addr1
        addr2
        city
        zip
        email
        phone
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        createdAt
        updatedAt
      }
      prodNick
      product {
        id
        prodName
        prodNick
        packGroupID
        packGroup {
          id
          packGroup
          createdAt
          updatedAt
        }
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        freezerThaw
        packGroupOrder
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isWhole
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
        depends {
          nextToken
        }
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        productVendor {
          nextToken
        }
        EODCount {
          id
          prodNick
          shelfOrFreezer
          startOrFinish
          location
          qty
          whoCounted
          createdAt
          updatedAt
        }
        ActualSetOut {
          id
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
          actualSetOutProdNameId
        }
        createdAt
        updatedAt
        inventoryProductId
        productEODCountId
        productActualSetOutId
      }
      createdAt
      updatedAt
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
        loc {
          locNick
          locName
          zoneID
          addr1
          addr2
          city
          zip
          email
          phone
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
          createdAt
          updatedAt
        }
        prodNick
        product {
          id
          prodName
          prodNick
          packGroupID
          packSize
          doughNick
          freezerThaw
          packGroupOrder
          readyTime
          bakedWhere
          wholePrice
          retailPrice
          isWhole
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
          createdAt
          updatedAt
          inventoryProductId
          productEODCountId
          productActualSetOutId
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProductVendor = /* GraphQL */ `
  query GetProductVendor($id: ID!) {
    getProductVendor(id: $id) {
      id
      prodNick
      vendorNick
      product {
        id
        prodName
        prodNick
        packGroupID
        packGroup {
          id
          packGroup
          createdAt
          updatedAt
        }
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        freezerThaw
        packGroupOrder
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isWhole
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
        depends {
          nextToken
        }
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        productVendor {
          nextToken
        }
        EODCount {
          id
          prodNick
          shelfOrFreezer
          startOrFinish
          location
          qty
          whoCounted
          createdAt
          updatedAt
        }
        ActualSetOut {
          id
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
          actualSetOutProdNameId
        }
        createdAt
        updatedAt
        inventoryProductId
        productEODCountId
        productActualSetOutId
      }
      vendor {
        vendorName
        vendorNick
        productVendor {
          nextToken
        }
        createdAt
        updatedAt
        inventoryVendorId
      }
      createdAt
      updatedAt
    }
  }
`;
export const listProductVendors = /* GraphQL */ `
  query ListProductVendors(
    $filter: ModelProductVendorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProductVendors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        prodNick
        vendorNick
        product {
          id
          prodName
          prodNick
          packGroupID
          packSize
          doughNick
          freezerThaw
          packGroupOrder
          readyTime
          bakedWhere
          wholePrice
          retailPrice
          isWhole
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
          createdAt
          updatedAt
          inventoryProductId
          productEODCountId
          productActualSetOutId
        }
        vendor {
          vendorName
          vendorNick
          createdAt
          updatedAt
          inventoryVendorId
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const internalByBakeryLoc = /* GraphQL */ `
  query InternalByBakeryLoc(
    $bakeryLoc: String!
    $sortDirection: ModelSortDirection
    $filter: ModelInternalLocFilterInput
    $limit: Int
    $nextToken: String
  ) {
    internalByBakeryLoc(
      bakeryLoc: $bakeryLoc
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        intLocNick
        bakeryLoc
        intLocDescrip
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
