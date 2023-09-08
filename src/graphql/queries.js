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
export const getOrderBackup = /* GraphQL */ `
  query GetOrderBackup($id: ID!) {
    getOrderBackup(id: $id) {
      id
      qty
      prodName
      custName
      PONote
      route
      SO
      isWhole
      delivDate
      timeStamp
      rate
      isLate
      createdAt
      updatedAt
    }
  }
`;
export const listOrderBackups = /* GraphQL */ `
  query ListOrderBackups(
    $filter: ModelOrderBackupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrderBackups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        qty
        prodName
        custName
        PONote
        route
        SO
        isWhole
        delivDate
        timeStamp
        rate
        isLate
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getStandingBackup = /* GraphQL */ `
  query GetStandingBackup($id: ID!) {
    getStandingBackup(id: $id) {
      id
      timeStamp
      prodName
      custName
      isStand
      Sun
      Mon
      Tue
      Wed
      Thu
      Fri
      Sat
      createdAt
      updatedAt
    }
  }
`;
export const listStandingBackups = /* GraphQL */ `
  query ListStandingBackups(
    $filter: ModelStandingBackupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStandingBackups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        timeStamp
        prodName
        custName
        isStand
        Sun
        Mon
        Tue
        Wed
        Thu
        Fri
        Sat
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRouteBackup = /* GraphQL */ `
  query GetRouteBackup($id: ID!) {
    getRouteBackup(id: $id) {
      id
      routeName
      routeStart
      routeTime
      RouteDepart
      RouteArrive
      RouteServe
      RouteSched
      printOrder
      driver
      createdAt
      updatedAt
    }
  }
`;
export const listRouteBackups = /* GraphQL */ `
  query ListRouteBackups(
    $filter: ModelRouteBackupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRouteBackups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        routeName
        routeStart
        routeTime
        RouteDepart
        RouteArrive
        RouteServe
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
export const getZoneBackup = /* GraphQL */ `
  query GetZoneBackup($id: ID!) {
    getZoneBackup(id: $id) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const listZoneBackups = /* GraphQL */ `
  query ListZoneBackups(
    $filter: ModelZoneBackupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listZoneBackups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        zoneNum
        zoneName
        zoneFee
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDoughBackup = /* GraphQL */ `
  query GetDoughBackup($id: ID!) {
    getDoughBackup(id: $id) {
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
  }
`;
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
export const getDoughComponentBackup = /* GraphQL */ `
  query GetDoughComponentBackup($id: ID!) {
    getDoughComponentBackup(id: $id) {
      id
      dough
      componentType
      componentName
      amount
      createdAt
      updatedAt
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
export const getUser = /* GraphQL */ `
  query GetUser($sub: String!) {
    getUser(sub: $sub) {
      name
      email
      username
      phone
      authClass
      sub
      locNick
      defaultLoc {
        Type
        locNick
        locName
        subs {
          nextToken
        }
        subs2 {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
        ordersByDate {
          nextToken
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
        dfFulfill
        creditApp {
          id
          firstName
          lastName
          companyName
          phone
          email
          addr1
          addr2
          city
          state
          zip
          locAddr1
          locAddr2
          locCity
          locState
          locZip
          startDate
          businessType
          bankName
          bankPhone
          refName
          refAddr1
          refAddr2
          refCity
          refZip
          refPhone
          refEmail
          refDescrip
          signture
          sigDate
          sigName
          sigTitle
          createdAt
          updatedAt
        }
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        altLeadTimeByProduct {
          nextToken
        }
        requests
        createdAt
        updatedAt
        locationCreditAppId
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
        username
        phone
        authClass
        sub
        locNick
        defaultLoc {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
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
export const getUser2 = /* GraphQL */ `
  query GetUser2($id: ID!) {
    getUser2(id: $id) {
      id
      name
      email
      username
      phone
      authClass
      subs
      locNick
      defaultLoc {
        Type
        locNick
        locName
        subs {
          nextToken
        }
        subs2 {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
        ordersByDate {
          nextToken
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
        dfFulfill
        creditApp {
          id
          firstName
          lastName
          companyName
          phone
          email
          addr1
          addr2
          city
          state
          zip
          locAddr1
          locAddr2
          locCity
          locState
          locZip
          startDate
          businessType
          bankName
          bankPhone
          refName
          refAddr1
          refAddr2
          refCity
          refZip
          refPhone
          refEmail
          refDescrip
          signture
          sigDate
          sigName
          sigTitle
          createdAt
          updatedAt
        }
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        altLeadTimeByProduct {
          nextToken
        }
        requests
        createdAt
        updatedAt
        locationCreditAppId
      }
      locs {
        items {
          id
          Type
          authType
          locNick
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
      request
      createdAt
      updatedAt
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
        id
        name
        email
        username
        phone
        authClass
        subs
        locNick
        defaultLoc {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        locs {
          nextToken
        }
        request
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLocationUser2 = /* GraphQL */ `
  query GetLocationUser2($id: ID!) {
    getLocationUser2(id: $id) {
      id
      Type
      authType
      locNick
      userID
      location {
        Type
        locNick
        locName
        subs {
          nextToken
        }
        subs2 {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
        ordersByDate {
          nextToken
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
        dfFulfill
        creditApp {
          id
          firstName
          lastName
          companyName
          phone
          email
          addr1
          addr2
          city
          state
          zip
          locAddr1
          locAddr2
          locCity
          locState
          locZip
          startDate
          businessType
          bankName
          bankPhone
          refName
          refAddr1
          refAddr2
          refCity
          refZip
          refPhone
          refEmail
          refDescrip
          signture
          sigDate
          sigName
          sigTitle
          createdAt
          updatedAt
        }
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        altLeadTimeByProduct {
          nextToken
        }
        requests
        createdAt
        updatedAt
        locationCreditAppId
      }
      user {
        id
        name
        email
        username
        phone
        authClass
        subs
        locNick
        defaultLoc {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        locs {
          nextToken
        }
        request
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listLocationUser2s = /* GraphQL */ `
  query ListLocationUser2s(
    $filter: ModelLocationUser2FilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLocationUser2s(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        Type
        authType
        locNick
        userID
        location {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        user {
          id
          name
          email
          username
          phone
          authClass
          subs
          locNick
          request
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
export const getCreditApp = /* GraphQL */ `
  query GetCreditApp($id: ID!) {
    getCreditApp(id: $id) {
      id
      firstName
      lastName
      companyName
      phone
      email
      addr1
      addr2
      city
      state
      zip
      locAddr1
      locAddr2
      locCity
      locState
      locZip
      startDate
      businessType
      bankName
      bankPhone
      refName
      refAddr1
      refAddr2
      refCity
      refZip
      refPhone
      refEmail
      refDescrip
      signture
      sigDate
      sigName
      sigTitle
      createdAt
      updatedAt
    }
  }
`;
export const listCreditApps = /* GraphQL */ `
  query ListCreditApps(
    $filter: ModelCreditAppFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCreditApps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        firstName
        lastName
        companyName
        phone
        email
        addr1
        addr2
        city
        state
        zip
        locAddr1
        locAddr2
        locCity
        locState
        locZip
        startDate
        businessType
        bankName
        bankPhone
        refName
        refAddr1
        refAddr2
        refCity
        refZip
        refPhone
        refEmail
        refDescrip
        signture
        sigDate
        sigName
        sigTitle
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
      Type
      locNick
      locName
      subs {
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
      subs2 {
        items {
          id
          Type
          authType
          locNick
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
      standing {
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
      orders {
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
      ordersByDate {
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
      dfFulfill
      creditApp {
        id
        firstName
        lastName
        companyName
        phone
        email
        addr1
        addr2
        city
        state
        zip
        locAddr1
        locAddr2
        locCity
        locState
        locZip
        startDate
        businessType
        bankName
        bankPhone
        refName
        refAddr1
        refAddr2
        refCity
        refZip
        refPhone
        refEmail
        refDescrip
        signture
        sigDate
        sigName
        sigTitle
        createdAt
        updatedAt
      }
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
      prodsNotAllowed {
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
      altLeadTimeByProduct {
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
      requests
      createdAt
      updatedAt
      locationCreditAppId
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
        subs {
          nextToken
        }
        subs2 {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
        ordersByDate {
          nextToken
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
        dfFulfill
        creditApp {
          id
          firstName
          lastName
          companyName
          phone
          email
          addr1
          addr2
          city
          state
          zip
          locAddr1
          locAddr2
          locCity
          locState
          locZip
          startDate
          businessType
          bankName
          bankPhone
          refName
          refAddr1
          refAddr2
          refCity
          refZip
          refPhone
          refEmail
          refDescrip
          signture
          sigDate
          sigName
          sigTitle
          createdAt
          updatedAt
        }
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        altLeadTimeByProduct {
          nextToken
        }
        requests
        createdAt
        updatedAt
        locationCreditAppId
      }
      nextToken
    }
  }
`;
export const getProduct = /* GraphQL */ `
  query GetProduct($prodNick: String!) {
    getProduct(prodNick: $prodNick) {
      Type
      prodName
      prodNick
      packGroup
      packSize
      doughNick
      doughType {
        doughNick
        doughName
        hydration
        batchSize
        mixedWhere
        buckets {
          nextToken
        }
        bucketSets
        preBucketSets
        updatePreBucket
        isBakeReady
        buffer
        saltInDry
        createdAt
        updatedAt
      }
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
      retailLoc {
        items {
          id
          specialStart
          specialEnd
          dayOfWeek
          timeOfDayStart
          timeOfDayEnd
          prodNick
          locSquareId
          createdAt
          updatedAt
        }
        nextToken
      }
      standing {
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
      orders {
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
          isAllowed
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
        prodNick
        product {
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
        shelfOrFreezer
        startOrFinish
        location
        qty
        whoCounted
        createdAt
        updatedAt
      }
      ActualSetOut {
        prodNick
        prodName {
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
        qty
        location
        whoSetOut
        createdAt
        updatedAt
      }
      altLeadTimeByLocation {
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
      updatedAt
      createdAt
      inventoryProductId
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
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
      }
      nextToken
    }
  }
`;
export const getRetailLoc = /* GraphQL */ `
  query GetRetailLoc($id: ID!) {
    getRetailLoc(id: $id) {
      squareId
      location
      retailProds {
        items {
          id
          specialStart
          specialEnd
          dayOfWeek
          timeOfDayStart
          timeOfDayEnd
          prodNick
          locSquareId
          createdAt
          updatedAt
        }
        nextToken
      }
      id
      createdAt
      updatedAt
    }
  }
`;
export const listRetailLocs = /* GraphQL */ `
  query ListRetailLocs(
    $filter: ModelRetailLocFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRetailLocs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        squareId
        location
        retailProds {
          nextToken
        }
        id
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRetailProdLoc = /* GraphQL */ `
  query GetRetailProdLoc($id: ID!) {
    getRetailProdLoc(id: $id) {
      id
      specialStart
      specialEnd
      dayOfWeek
      timeOfDayStart
      timeOfDayEnd
      prodNick
      product {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
      }
      locSquareId
      loc {
        squareId
        location
        retailProds {
          nextToken
        }
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listRetailProdLocs = /* GraphQL */ `
  query ListRetailProdLocs(
    $filter: ModelRetailProdLocFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRetailProdLocs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        specialStart
        specialEnd
        dayOfWeek
        timeOfDayStart
        timeOfDayEnd
        prodNick
        product {
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
        locSquareId
        loc {
          squareId
          location
          id
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
      Type
      id
      qty
      qtyUpdatedOn
      sameDayMaxQty
      prodNick
      product {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
      }
      locNick
      location {
        Type
        locNick
        locName
        subs {
          nextToken
        }
        subs2 {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
        ordersByDate {
          nextToken
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
        dfFulfill
        creditApp {
          id
          firstName
          lastName
          companyName
          phone
          email
          addr1
          addr2
          city
          state
          zip
          locAddr1
          locAddr2
          locCity
          locState
          locZip
          startDate
          businessType
          bankName
          bankPhone
          refName
          refAddr1
          refAddr2
          refCity
          refZip
          refPhone
          refEmail
          refDescrip
          signture
          sigDate
          sigName
          sigTitle
          createdAt
          updatedAt
        }
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        altLeadTimeByProduct {
          nextToken
        }
        requests
        createdAt
        updatedAt
        locationCreditAppId
      }
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
        product {
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
        locNick
        location {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
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
export const getStanding = /* GraphQL */ `
  query GetStanding($id: ID!) {
    getStanding(id: $id) {
      id
      locNick
      location {
        Type
        locNick
        locName
        subs {
          nextToken
        }
        subs2 {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
        ordersByDate {
          nextToken
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
        dfFulfill
        creditApp {
          id
          firstName
          lastName
          companyName
          phone
          email
          addr1
          addr2
          city
          state
          zip
          locAddr1
          locAddr2
          locCity
          locState
          locZip
          startDate
          businessType
          bankName
          bankPhone
          refName
          refAddr1
          refAddr2
          refCity
          refZip
          refPhone
          refEmail
          refDescrip
          signture
          sigDate
          sigName
          sigTitle
          createdAt
          updatedAt
        }
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        altLeadTimeByProduct {
          nextToken
        }
        requests
        createdAt
        updatedAt
        locationCreditAppId
      }
      isWhole
      isStand
      dayOfWeek
      route
      prodNick
      product {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
      }
      qty
      ItemNote
      startDate
      endDate
      createdAt
      updatedAt
      updatedBy
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
        location {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        isWhole
        isStand
        dayOfWeek
        route
        prodNick
        product {
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
export const getPackGroup = /* GraphQL */ `
  query GetPackGroup($packGroupNick: String!) {
    getPackGroup(packGroupNick: $packGroupNick) {
      packGroupNick
      packGroup
      createdAt
      updatedAt
    }
  }
`;
export const listPackGroups = /* GraphQL */ `
  query ListPackGroups(
    $packGroupNick: String
    $filter: ModelPackGroupFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPackGroups(
      packGroupNick: $packGroupNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        packGroupNick
        packGroup
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
      buckets {
        items {
          id
          bucketType
          invId
          doughNick
          qty
          unitNick
          totalDoughWeight
          whoMixed
          createdAt
          updatedAt
          doughBucketsId
        }
        nextToken
      }
      bucketSets
      preBucketSets
      updatePreBucket
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
        buckets {
          nextToken
        }
        bucketSets
        preBucketSets
        updatePreBucket
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
export const getBucketInfo = /* GraphQL */ `
  query GetBucketInfo($id: ID!) {
    getBucketInfo(id: $id) {
      id
      bucketType
      invId
      inventoryItem {
        id
        ingName
        ingNick
        ingTypeNick
        ingType {
          ingTypeNick
          ingType
          createdAt
          updatedAt
        }
        vendor {
          nextToken
        }
        product {
          nextToken
        }
        unitNick
        unit {
          unitNick
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
      doughNick
      dough {
        doughNick
        doughName
        hydration
        batchSize
        mixedWhere
        buckets {
          nextToken
        }
        bucketSets
        preBucketSets
        updatePreBucket
        isBakeReady
        buffer
        saltInDry
        createdAt
        updatedAt
      }
      qty
      unitNick
      unit {
        unitNick
        unitName
        createdAt
        updatedAt
      }
      totalDoughWeight
      whoMixed
      createdAt
      updatedAt
      doughBucketsId
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
        bucketType
        invId
        inventoryItem {
          id
          ingName
          ingNick
          ingTypeNick
          unitNick
          bakeryLocation
          intLocNick
          whoCounted
          createdAt
          updatedAt
        }
        doughNick
        dough {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
        qty
        unitNick
        unit {
          unitNick
          unitName
          createdAt
          updatedAt
        }
        totalDoughWeight
        whoMixed
        createdAt
        updatedAt
        doughBucketsId
      }
      nextToken
    }
  }
`;
export const getPocketCount = /* GraphQL */ `
  query GetPocketCount($doughNick: String!, $size: Int!) {
    getPocketCount(doughNick: $doughNick, size: $size) {
      doughNick
      doughType {
        doughNick
        doughName
        hydration
        batchSize
        mixedWhere
        buckets {
          nextToken
        }
        bucketSets
        preBucketSets
        updatePreBucket
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
    $doughNick: String
    $size: ModelIntKeyConditionInput
    $filter: ModelPocketCountFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPocketCounts(
      doughNick: $doughNick
      size: $size
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
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
export const getInventory = /* GraphQL */ `
  query GetInventory($id: ID!) {
    getInventory(id: $id) {
      id
      ingName
      ingNick
      ingTypeNick
      ingType {
        ingTypeNick
        ingType
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
      unitNick
      unit {
        unitNick
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
        ingTypeNick
        ingType {
          ingTypeNick
          ingType
          createdAt
          updatedAt
        }
        vendor {
          nextToken
        }
        product {
          nextToken
        }
        unitNick
        unit {
          unitNick
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
  query GetUnit($unitNick: String!) {
    getUnit(unitNick: $unitNick) {
      unitNick
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const listUnits = /* GraphQL */ `
  query ListUnits(
    $unitNick: String
    $filter: ModelUnitFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUnits(
      unitNick: $unitNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        unitNick
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
  query GetIngType($ingTypeNick: String!) {
    getIngType(ingTypeNick: $ingTypeNick) {
      ingTypeNick
      ingType
      createdAt
      updatedAt
    }
  }
`;
export const listIngTypes = /* GraphQL */ `
  query ListIngTypes(
    $ingTypeNick: String
    $filter: ModelIngTypeFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listIngTypes(
      ingTypeNick: $ingTypeNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        ingTypeNick
        ingType
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
export const getProductVendor = /* GraphQL */ `
  query GetProductVendor($id: ID!) {
    getProductVendor(id: $id) {
      id
      prodNick
      vendorNick
      product {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
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
export const getEODCount = /* GraphQL */ `
  query GetEODCount($prodNick: String!) {
    getEODCount(prodNick: $prodNick) {
      prodNick
      product {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
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
    $prodNick: String
    $filter: ModelEODCountFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listEODCounts(
      prodNick: $prodNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        prodNick
        product {
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
export const getActualSetOut = /* GraphQL */ `
  query GetActualSetOut($prodNick: String!) {
    getActualSetOut(prodNick: $prodNick) {
      prodNick
      prodName {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
      }
      qty
      location
      whoSetOut
      createdAt
      updatedAt
    }
  }
`;
export const listActualSetOuts = /* GraphQL */ `
  query ListActualSetOuts(
    $prodNick: String
    $filter: ModelActualSetOutFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listActualSetOuts(
      prodNick: $prodNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        prodNick
        prodName {
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
        qty
        location
        whoSetOut
        createdAt
        updatedAt
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
export const getOldDough = /* GraphQL */ `
  query GetOldDough($id: ID!) {
    getOldDough(id: $id) {
      id
      doughNick
      dough {
        doughNick
        doughName
        hydration
        batchSize
        mixedWhere
        buckets {
          nextToken
        }
        bucketSets
        preBucketSets
        updatePreBucket
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
        doughNick
        dough {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
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
        username
        phone
        authClass
        sub
        locNick
        defaultLoc {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
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
          username
          phone
          authClass
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
export const getTemplateProd = /* GraphQL */ `
  query GetTemplateProd($id: ID!) {
    getTemplateProd(id: $id) {
      id
      locNick
      prodNick
      location {
        Type
        locNick
        locName
        subs {
          nextToken
        }
        subs2 {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
        ordersByDate {
          nextToken
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
        dfFulfill
        creditApp {
          id
          firstName
          lastName
          companyName
          phone
          email
          addr1
          addr2
          city
          state
          zip
          locAddr1
          locAddr2
          locCity
          locState
          locZip
          startDate
          businessType
          bankName
          bankPhone
          refName
          refAddr1
          refAddr2
          refCity
          refZip
          refPhone
          refEmail
          refDescrip
          signture
          sigDate
          sigName
          sigTitle
          createdAt
          updatedAt
        }
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        altLeadTimeByProduct {
          nextToken
        }
        requests
        createdAt
        updatedAt
        locationCreditAppId
      }
      product {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
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
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        product {
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
      isAllowed
      locNick
      prodNick
      location {
        Type
        locNick
        locName
        subs {
          nextToken
        }
        subs2 {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
        ordersByDate {
          nextToken
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
        dfFulfill
        creditApp {
          id
          firstName
          lastName
          companyName
          phone
          email
          addr1
          addr2
          city
          state
          zip
          locAddr1
          locAddr2
          locCity
          locState
          locZip
          startDate
          businessType
          bankName
          bankPhone
          refName
          refAddr1
          refAddr2
          refCity
          refZip
          refPhone
          refEmail
          refDescrip
          signture
          sigDate
          sigName
          sigTitle
          createdAt
          updatedAt
        }
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        altLeadTimeByProduct {
          nextToken
        }
        requests
        createdAt
        updatedAt
        locationCreditAppId
      }
      product {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
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
        isAllowed
        locNick
        prodNick
        location {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        product {
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
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
      }
      prod2Nick
      prod2 {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
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
        prod2Nick
        prod2 {
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
      Type
      authType
      locNick
      sub
      location {
        Type
        locNick
        locName
        subs {
          nextToken
        }
        subs2 {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
        ordersByDate {
          nextToken
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
        dfFulfill
        creditApp {
          id
          firstName
          lastName
          companyName
          phone
          email
          addr1
          addr2
          city
          state
          zip
          locAddr1
          locAddr2
          locCity
          locState
          locZip
          startDate
          businessType
          bankName
          bankPhone
          refName
          refAddr1
          refAddr2
          refCity
          refZip
          refPhone
          refEmail
          refDescrip
          signture
          sigDate
          sigName
          sigTitle
          createdAt
          updatedAt
        }
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        altLeadTimeByProduct {
          nextToken
        }
        requests
        createdAt
        updatedAt
        locationCreditAppId
      }
      user {
        name
        email
        username
        phone
        authClass
        sub
        locNick
        defaultLoc {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
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
        Type
        authType
        locNick
        sub
        location {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        user {
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
        Type
        locNick
        locName
        subs {
          nextToken
        }
        subs2 {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
        ordersByDate {
          nextToken
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
        dfFulfill
        creditApp {
          id
          firstName
          lastName
          companyName
          phone
          email
          addr1
          addr2
          city
          state
          zip
          locAddr1
          locAddr2
          locCity
          locState
          locZip
          startDate
          businessType
          bankName
          bankPhone
          refName
          refAddr1
          refAddr2
          refCity
          refZip
          refPhone
          refEmail
          refDescrip
          signture
          sigDate
          sigName
          sigTitle
          createdAt
          updatedAt
        }
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        altLeadTimeByProduct {
          nextToken
        }
        requests
        createdAt
        updatedAt
        locationCreditAppId
      }
      prodNick
      product {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
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
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        prodNick
        product {
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAltLeadTime = /* GraphQL */ `
  query GetAltLeadTime($id: ID!) {
    getAltLeadTime(id: $id) {
      id
      leadTime
      locNick
      loc {
        Type
        locNick
        locName
        subs {
          nextToken
        }
        subs2 {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
        ordersByDate {
          nextToken
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
        dfFulfill
        creditApp {
          id
          firstName
          lastName
          companyName
          phone
          email
          addr1
          addr2
          city
          state
          zip
          locAddr1
          locAddr2
          locCity
          locState
          locZip
          startDate
          businessType
          bankName
          bankPhone
          refName
          refAddr1
          refAddr2
          refCity
          refZip
          refPhone
          refEmail
          refDescrip
          signture
          sigDate
          sigName
          sigTitle
          createdAt
          updatedAt
        }
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        altLeadTimeByProduct {
          nextToken
        }
        requests
        createdAt
        updatedAt
        locationCreditAppId
      }
      prodNick
      product {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
      }
      createdAt
      updatedAt
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
        loc {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        prodNick
        product {
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTraining = /* GraphQL */ `
  query GetTraining($id: ID!) {
    getTraining(id: $id) {
      id
      role
      order
      heading
      instruction
      createdAt
      updatedAt
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
export const user2byEmail = /* GraphQL */ `
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
        id
        name
        email
        username
        phone
        authClass
        subs
        locNick
        defaultLoc {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        locs {
          nextToken
        }
        request
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const locUsers2ByAuthType = /* GraphQL */ `
  query LocUsers2ByAuthType(
    $Type: String!
    $authType: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLocationUser2FilterInput
    $limit: Int
    $nextToken: String
  ) {
    locUsers2ByAuthType(
      Type: $Type
      authType: $authType
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        Type
        authType
        locNick
        userID
        location {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        user {
          id
          name
          email
          username
          phone
          authClass
          subs
          locNick
          request
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
export const locSortAZ = /* GraphQL */ `
  query LocSortAZ(
    $Type: String!
    $locName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLocationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    locSortAZ(
      Type: $Type
      locName: $locName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        Type
        locNick
        locName
        subs {
          nextToken
        }
        subs2 {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
        ordersByDate {
          nextToken
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
        dfFulfill
        creditApp {
          id
          firstName
          lastName
          companyName
          phone
          email
          addr1
          addr2
          city
          state
          zip
          locAddr1
          locAddr2
          locCity
          locState
          locZip
          startDate
          businessType
          bankName
          bankPhone
          refName
          refAddr1
          refAddr2
          refCity
          refZip
          refPhone
          refEmail
          refDescrip
          signture
          sigDate
          sigName
          sigTitle
          createdAt
          updatedAt
        }
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
        prodsNotAllowed {
          nextToken
        }
        customProd {
          nextToken
        }
        templateProd {
          nextToken
        }
        altLeadTimeByProduct {
          nextToken
        }
        requests
        createdAt
        updatedAt
        locationCreditAppId
      }
      nextToken
    }
  }
`;
export const prodSortAZ = /* GraphQL */ `
  query ProdSortAZ(
    $Type: String!
    $prodName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    prodSortAZ(
      Type: $Type
      prodName: $prodName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        doughType {
          doughNick
          doughName
          hydration
          batchSize
          mixedWhere
          bucketSets
          preBucketSets
          updatePreBucket
          isBakeReady
          buffer
          saltInDry
          createdAt
          updatedAt
        }
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
        retailLoc {
          nextToken
        }
        standing {
          nextToken
        }
        orders {
          nextToken
        }
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
          prodNick
          qty
          location
          whoSetOut
          createdAt
          updatedAt
        }
        altLeadTimeByLocation {
          nextToken
        }
        updatedAt
        createdAt
        inventoryProductId
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
        Type
        id
        qty
        qtyUpdatedOn
        sameDayMaxQty
        prodNick
        product {
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
        locNick
        location {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
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
        Type
        id
        qty
        qtyUpdatedOn
        sameDayMaxQty
        prodNick
        product {
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
        locNick
        location {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
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
export const standingByLocByStartDate = /* GraphQL */ `
  query StandingByLocByStartDate(
    $locNick: String!
    $startDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStandingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    standingByLocByStartDate(
      locNick: $locNick
      startDate: $startDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        locNick
        location {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        isWhole
        isStand
        dayOfWeek
        route
        prodNick
        product {
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
export const standingByLocByEndDate = /* GraphQL */ `
  query StandingByLocByEndDate(
    $locNick: String!
    $endDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStandingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    standingByLocByEndDate(
      locNick: $locNick
      endDate: $endDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        locNick
        location {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        isWhole
        isStand
        dayOfWeek
        route
        prodNick
        product {
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
        location {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        isWhole
        isStand
        dayOfWeek
        route
        prodNick
        product {
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
        id
        locNick
        location {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        isWhole
        isStand
        dayOfWeek
        route
        prodNick
        product {
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
export const locUsersByAuthType = /* GraphQL */ `
  query LocUsersByAuthType(
    $Type: String!
    $authType: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLocationUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    locUsersByAuthType(
      Type: $Type
      authType: $authType
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        Type
        authType
        locNick
        sub
        location {
          Type
          locNick
          locName
          zoneNick
          dfFulfill
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
          requests
          createdAt
          updatedAt
          locationCreditAppId
        }
        user {
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
