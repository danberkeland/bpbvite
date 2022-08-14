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
      firstName
      lastName
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
        firstName
        lastName
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
      nextToken
    }
  }
`;
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
        firstName
        lastName
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
        defaultLoc {
          locNick
          locName
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
        userDefaultLocId
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
        firstName
        lastName
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
        defaultLoc {
          locNick
          locName
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
        userDefaultLocId
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
          firstName
          lastName
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
          createdAt
          updatedAt
          userDefaultLocId
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
export const getProduct = /* GraphQL */ `
  query GetProduct($nickName: String!) {
    getProduct(nickName: $nickName) {
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
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $nickName: String
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listProducts(
      nickName: $nickName
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
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
