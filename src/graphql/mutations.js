/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLocationBackup = /* GraphQL */ `
  mutation CreateLocationBackup(
    $input: CreateLocationBackupInput!
    $condition: ModelLocationBackupConditionInput
  ) {
    createLocationBackup(input: $input, condition: $condition) {
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
export const updateLocationBackup = /* GraphQL */ `
  mutation UpdateLocationBackup(
    $input: UpdateLocationBackupInput!
    $condition: ModelLocationBackupConditionInput
  ) {
    updateLocationBackup(input: $input, condition: $condition) {
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
export const deleteLocationBackup = /* GraphQL */ `
  mutation DeleteLocationBackup(
    $input: DeleteLocationBackupInput!
    $condition: ModelLocationBackupConditionInput
  ) {
    deleteLocationBackup(input: $input, condition: $condition) {
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
export const createProductBackup = /* GraphQL */ `
  mutation CreateProductBackup(
    $input: CreateProductBackupInput!
    $condition: ModelProductBackupConditionInput
  ) {
    createProductBackup(input: $input, condition: $condition) {
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
export const updateProductBackup = /* GraphQL */ `
  mutation UpdateProductBackup(
    $input: UpdateProductBackupInput!
    $condition: ModelProductBackupConditionInput
  ) {
    updateProductBackup(input: $input, condition: $condition) {
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
export const deleteProductBackup = /* GraphQL */ `
  mutation DeleteProductBackup(
    $input: DeleteProductBackupInput!
    $condition: ModelProductBackupConditionInput
  ) {
    deleteProductBackup(input: $input, condition: $condition) {
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
export const createOrderBackup = /* GraphQL */ `
  mutation CreateOrderBackup(
    $input: CreateOrderBackupInput!
    $condition: ModelOrderBackupConditionInput
  ) {
    createOrderBackup(input: $input, condition: $condition) {
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
export const updateOrderBackup = /* GraphQL */ `
  mutation UpdateOrderBackup(
    $input: UpdateOrderBackupInput!
    $condition: ModelOrderBackupConditionInput
  ) {
    updateOrderBackup(input: $input, condition: $condition) {
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
export const deleteOrderBackup = /* GraphQL */ `
  mutation DeleteOrderBackup(
    $input: DeleteOrderBackupInput!
    $condition: ModelOrderBackupConditionInput
  ) {
    deleteOrderBackup(input: $input, condition: $condition) {
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
export const createStandingBackup = /* GraphQL */ `
  mutation CreateStandingBackup(
    $input: CreateStandingBackupInput!
    $condition: ModelStandingBackupConditionInput
  ) {
    createStandingBackup(input: $input, condition: $condition) {
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
export const updateStandingBackup = /* GraphQL */ `
  mutation UpdateStandingBackup(
    $input: UpdateStandingBackupInput!
    $condition: ModelStandingBackupConditionInput
  ) {
    updateStandingBackup(input: $input, condition: $condition) {
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
export const deleteStandingBackup = /* GraphQL */ `
  mutation DeleteStandingBackup(
    $input: DeleteStandingBackupInput!
    $condition: ModelStandingBackupConditionInput
  ) {
    deleteStandingBackup(input: $input, condition: $condition) {
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
export const createRouteBackup = /* GraphQL */ `
  mutation CreateRouteBackup(
    $input: CreateRouteBackupInput!
    $condition: ModelRouteBackupConditionInput
  ) {
    createRouteBackup(input: $input, condition: $condition) {
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
export const updateRouteBackup = /* GraphQL */ `
  mutation UpdateRouteBackup(
    $input: UpdateRouteBackupInput!
    $condition: ModelRouteBackupConditionInput
  ) {
    updateRouteBackup(input: $input, condition: $condition) {
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
export const deleteRouteBackup = /* GraphQL */ `
  mutation DeleteRouteBackup(
    $input: DeleteRouteBackupInput!
    $condition: ModelRouteBackupConditionInput
  ) {
    deleteRouteBackup(input: $input, condition: $condition) {
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
export const createZoneBackup = /* GraphQL */ `
  mutation CreateZoneBackup(
    $input: CreateZoneBackupInput!
    $condition: ModelZoneBackupConditionInput
  ) {
    createZoneBackup(input: $input, condition: $condition) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const updateZoneBackup = /* GraphQL */ `
  mutation UpdateZoneBackup(
    $input: UpdateZoneBackupInput!
    $condition: ModelZoneBackupConditionInput
  ) {
    updateZoneBackup(input: $input, condition: $condition) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const deleteZoneBackup = /* GraphQL */ `
  mutation DeleteZoneBackup(
    $input: DeleteZoneBackupInput!
    $condition: ModelZoneBackupConditionInput
  ) {
    deleteZoneBackup(input: $input, condition: $condition) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      name
      email
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      name
      email
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      name
      email
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
export const createCreditApp = /* GraphQL */ `
  mutation CreateCreditApp(
    $input: CreateCreditAppInput!
    $condition: ModelCreditAppConditionInput
  ) {
    createCreditApp(input: $input, condition: $condition) {
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
export const updateCreditApp = /* GraphQL */ `
  mutation UpdateCreditApp(
    $input: UpdateCreditAppInput!
    $condition: ModelCreditAppConditionInput
  ) {
    updateCreditApp(input: $input, condition: $condition) {
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
export const deleteCreditApp = /* GraphQL */ `
  mutation DeleteCreditApp(
    $input: DeleteCreditAppInput!
    $condition: ModelCreditAppConditionInput
  ) {
    deleteCreditApp(input: $input, condition: $condition) {
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
export const createLocation = /* GraphQL */ `
  mutation CreateLocation(
    $input: CreateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    createLocation(input: $input, condition: $condition) {
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
      standing {
        items {
          id
          qty
          prodNick
          locNick
          ItemNote
          isWhole
          isStand
          dayOfWeek
          startDate
          endDate
          createdAt
          updatedAt
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
      createdAt
      updatedAt
      locationCreditAppId
    }
  }
`;
export const updateLocation = /* GraphQL */ `
  mutation UpdateLocation(
    $input: UpdateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    updateLocation(input: $input, condition: $condition) {
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
      standing {
        items {
          id
          qty
          prodNick
          locNick
          ItemNote
          isWhole
          isStand
          dayOfWeek
          startDate
          endDate
          createdAt
          updatedAt
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
      createdAt
      updatedAt
      locationCreditAppId
    }
  }
`;
export const deleteLocation = /* GraphQL */ `
  mutation DeleteLocation(
    $input: DeleteLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    deleteLocation(input: $input, condition: $condition) {
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
      standing {
        items {
          id
          qty
          prodNick
          locNick
          ItemNote
          isWhole
          isStand
          dayOfWeek
          startDate
          endDate
          createdAt
          updatedAt
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
      createdAt
      updatedAt
      locationCreditAppId
    }
  }
`;
export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
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
      qbID
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
          qty
          prodNick
          locNick
          ItemNote
          isWhole
          isStand
          dayOfWeek
          startDate
          endDate
          createdAt
          updatedAt
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
          qbID
          createdAt
          updatedAt
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
          qbID
          createdAt
          updatedAt
          inventoryProductId
        }
        qty
        location
        whoSetOut
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      inventoryProductId
    }
  }
`;
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
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
      qbID
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
          qty
          prodNick
          locNick
          ItemNote
          isWhole
          isStand
          dayOfWeek
          startDate
          endDate
          createdAt
          updatedAt
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
          qbID
          createdAt
          updatedAt
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
          qbID
          createdAt
          updatedAt
          inventoryProductId
        }
        qty
        location
        whoSetOut
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      inventoryProductId
    }
  }
`;
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
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
      qbID
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
          qty
          prodNick
          locNick
          ItemNote
          isWhole
          isStand
          dayOfWeek
          startDate
          endDate
          createdAt
          updatedAt
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
          qbID
          createdAt
          updatedAt
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
          qbID
          createdAt
          updatedAt
          inventoryProductId
        }
        qty
        location
        whoSetOut
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      inventoryProductId
    }
  }
`;
export const createRetailLoc = /* GraphQL */ `
  mutation CreateRetailLoc(
    $input: CreateRetailLocInput!
    $condition: ModelRetailLocConditionInput
  ) {
    createRetailLoc(input: $input, condition: $condition) {
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
export const updateRetailLoc = /* GraphQL */ `
  mutation UpdateRetailLoc(
    $input: UpdateRetailLocInput!
    $condition: ModelRetailLocConditionInput
  ) {
    updateRetailLoc(input: $input, condition: $condition) {
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
export const deleteRetailLoc = /* GraphQL */ `
  mutation DeleteRetailLoc(
    $input: DeleteRetailLocInput!
    $condition: ModelRetailLocConditionInput
  ) {
    deleteRetailLoc(input: $input, condition: $condition) {
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
export const createRetailProdLoc = /* GraphQL */ `
  mutation CreateRetailProdLoc(
    $input: CreateRetailProdLocInput!
    $condition: ModelRetailProdLocConditionInput
  ) {
    createRetailProdLoc(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
export const updateRetailProdLoc = /* GraphQL */ `
  mutation UpdateRetailProdLoc(
    $input: UpdateRetailProdLocInput!
    $condition: ModelRetailProdLocConditionInput
  ) {
    updateRetailProdLoc(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
export const deleteRetailProdLoc = /* GraphQL */ `
  mutation DeleteRetailProdLoc(
    $input: DeleteRetailProdLocInput!
    $condition: ModelRetailProdLocConditionInput
  ) {
    deleteRetailProdLoc(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
    }
  }
`;
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
    }
  }
`;
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
    }
  }
`;
export const createStanding = /* GraphQL */ `
  mutation CreateStanding(
    $input: CreateStandingInput!
    $condition: ModelStandingConditionInput
  ) {
    createStanding(input: $input, condition: $condition) {
      id
      qty
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
        qbID
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
        createdAt
        updatedAt
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
        locationCreditAppId
      }
      ItemNote
      isWhole
      isStand
      dayOfWeek
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;
export const updateStanding = /* GraphQL */ `
  mutation UpdateStanding(
    $input: UpdateStandingInput!
    $condition: ModelStandingConditionInput
  ) {
    updateStanding(input: $input, condition: $condition) {
      id
      qty
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
        qbID
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
        createdAt
        updatedAt
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
        locationCreditAppId
      }
      ItemNote
      isWhole
      isStand
      dayOfWeek
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;
export const deleteStanding = /* GraphQL */ `
  mutation DeleteStanding(
    $input: DeleteStandingInput!
    $condition: ModelStandingConditionInput
  ) {
    deleteStanding(input: $input, condition: $condition) {
      id
      qty
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
        qbID
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
        createdAt
        updatedAt
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
        locationCreditAppId
      }
      ItemNote
      isWhole
      isStand
      dayOfWeek
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;
export const createZone = /* GraphQL */ `
  mutation CreateZone(
    $input: CreateZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    createZone(input: $input, condition: $condition) {
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
export const updateZone = /* GraphQL */ `
  mutation UpdateZone(
    $input: UpdateZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    updateZone(input: $input, condition: $condition) {
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
export const deleteZone = /* GraphQL */ `
  mutation DeleteZone(
    $input: DeleteZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    deleteZone(input: $input, condition: $condition) {
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
export const createRoute = /* GraphQL */ `
  mutation CreateRoute(
    $input: CreateRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    createRoute(input: $input, condition: $condition) {
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
export const updateRoute = /* GraphQL */ `
  mutation UpdateRoute(
    $input: UpdateRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    updateRoute(input: $input, condition: $condition) {
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
export const deleteRoute = /* GraphQL */ `
  mutation DeleteRoute(
    $input: DeleteRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    deleteRoute(input: $input, condition: $condition) {
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
export const createPackGroup = /* GraphQL */ `
  mutation CreatePackGroup(
    $input: CreatePackGroupInput!
    $condition: ModelPackGroupConditionInput
  ) {
    createPackGroup(input: $input, condition: $condition) {
      packGroupNick
      packGroup
      createdAt
      updatedAt
    }
  }
`;
export const updatePackGroup = /* GraphQL */ `
  mutation UpdatePackGroup(
    $input: UpdatePackGroupInput!
    $condition: ModelPackGroupConditionInput
  ) {
    updatePackGroup(input: $input, condition: $condition) {
      packGroupNick
      packGroup
      createdAt
      updatedAt
    }
  }
`;
export const deletePackGroup = /* GraphQL */ `
  mutation DeletePackGroup(
    $input: DeletePackGroupInput!
    $condition: ModelPackGroupConditionInput
  ) {
    deletePackGroup(input: $input, condition: $condition) {
      packGroupNick
      packGroup
      createdAt
      updatedAt
    }
  }
`;
export const createDough = /* GraphQL */ `
  mutation CreateDough(
    $input: CreateDoughInput!
    $condition: ModelDoughConditionInput
  ) {
    createDough(input: $input, condition: $condition) {
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
      isBakeReady
      buffer
      saltInDry
      createdAt
      updatedAt
    }
  }
`;
export const updateDough = /* GraphQL */ `
  mutation UpdateDough(
    $input: UpdateDoughInput!
    $condition: ModelDoughConditionInput
  ) {
    updateDough(input: $input, condition: $condition) {
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
      isBakeReady
      buffer
      saltInDry
      createdAt
      updatedAt
    }
  }
`;
export const deleteDough = /* GraphQL */ `
  mutation DeleteDough(
    $input: DeleteDoughInput!
    $condition: ModelDoughConditionInput
  ) {
    deleteDough(input: $input, condition: $condition) {
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
      isBakeReady
      buffer
      saltInDry
      createdAt
      updatedAt
    }
  }
`;
export const createBucketInfo = /* GraphQL */ `
  mutation CreateBucketInfo(
    $input: CreateBucketInfoInput!
    $condition: ModelBucketInfoConditionInput
  ) {
    createBucketInfo(input: $input, condition: $condition) {
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
export const updateBucketInfo = /* GraphQL */ `
  mutation UpdateBucketInfo(
    $input: UpdateBucketInfoInput!
    $condition: ModelBucketInfoConditionInput
  ) {
    updateBucketInfo(input: $input, condition: $condition) {
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
export const deleteBucketInfo = /* GraphQL */ `
  mutation DeleteBucketInfo(
    $input: DeleteBucketInfoInput!
    $condition: ModelBucketInfoConditionInput
  ) {
    deleteBucketInfo(input: $input, condition: $condition) {
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
export const createPocketCount = /* GraphQL */ `
  mutation CreatePocketCount(
    $input: CreatePocketCountInput!
    $condition: ModelPocketCountConditionInput
  ) {
    createPocketCount(input: $input, condition: $condition) {
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
export const updatePocketCount = /* GraphQL */ `
  mutation UpdatePocketCount(
    $input: UpdatePocketCountInput!
    $condition: ModelPocketCountConditionInput
  ) {
    updatePocketCount(input: $input, condition: $condition) {
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
export const deletePocketCount = /* GraphQL */ `
  mutation DeletePocketCount(
    $input: DeletePocketCountInput!
    $condition: ModelPocketCountConditionInput
  ) {
    deletePocketCount(input: $input, condition: $condition) {
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
export const createInventory = /* GraphQL */ `
  mutation CreateInventory(
    $input: CreateInventoryInput!
    $condition: ModelInventoryConditionInput
  ) {
    createInventory(input: $input, condition: $condition) {
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
          qbID
          createdAt
          updatedAt
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
export const updateInventory = /* GraphQL */ `
  mutation UpdateInventory(
    $input: UpdateInventoryInput!
    $condition: ModelInventoryConditionInput
  ) {
    updateInventory(input: $input, condition: $condition) {
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
          qbID
          createdAt
          updatedAt
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
export const deleteInventory = /* GraphQL */ `
  mutation DeleteInventory(
    $input: DeleteInventoryInput!
    $condition: ModelInventoryConditionInput
  ) {
    deleteInventory(input: $input, condition: $condition) {
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
          qbID
          createdAt
          updatedAt
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
export const createUnit = /* GraphQL */ `
  mutation CreateUnit(
    $input: CreateUnitInput!
    $condition: ModelUnitConditionInput
  ) {
    createUnit(input: $input, condition: $condition) {
      unitNick
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const updateUnit = /* GraphQL */ `
  mutation UpdateUnit(
    $input: UpdateUnitInput!
    $condition: ModelUnitConditionInput
  ) {
    updateUnit(input: $input, condition: $condition) {
      unitNick
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const deleteUnit = /* GraphQL */ `
  mutation DeleteUnit(
    $input: DeleteUnitInput!
    $condition: ModelUnitConditionInput
  ) {
    deleteUnit(input: $input, condition: $condition) {
      unitNick
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const createInternalLoc = /* GraphQL */ `
  mutation CreateInternalLoc(
    $input: CreateInternalLocInput!
    $condition: ModelInternalLocConditionInput
  ) {
    createInternalLoc(input: $input, condition: $condition) {
      intLocNick
      bakeryLoc
      intLocDescrip
      createdAt
      updatedAt
    }
  }
`;
export const updateInternalLoc = /* GraphQL */ `
  mutation UpdateInternalLoc(
    $input: UpdateInternalLocInput!
    $condition: ModelInternalLocConditionInput
  ) {
    updateInternalLoc(input: $input, condition: $condition) {
      intLocNick
      bakeryLoc
      intLocDescrip
      createdAt
      updatedAt
    }
  }
`;
export const deleteInternalLoc = /* GraphQL */ `
  mutation DeleteInternalLoc(
    $input: DeleteInternalLocInput!
    $condition: ModelInternalLocConditionInput
  ) {
    deleteInternalLoc(input: $input, condition: $condition) {
      intLocNick
      bakeryLoc
      intLocDescrip
      createdAt
      updatedAt
    }
  }
`;
export const createIngType = /* GraphQL */ `
  mutation CreateIngType(
    $input: CreateIngTypeInput!
    $condition: ModelIngTypeConditionInput
  ) {
    createIngType(input: $input, condition: $condition) {
      ingTypeNick
      ingType
      createdAt
      updatedAt
    }
  }
`;
export const updateIngType = /* GraphQL */ `
  mutation UpdateIngType(
    $input: UpdateIngTypeInput!
    $condition: ModelIngTypeConditionInput
  ) {
    updateIngType(input: $input, condition: $condition) {
      ingTypeNick
      ingType
      createdAt
      updatedAt
    }
  }
`;
export const deleteIngType = /* GraphQL */ `
  mutation DeleteIngType(
    $input: DeleteIngTypeInput!
    $condition: ModelIngTypeConditionInput
  ) {
    deleteIngType(input: $input, condition: $condition) {
      ingTypeNick
      ingType
      createdAt
      updatedAt
    }
  }
`;
export const createVendor = /* GraphQL */ `
  mutation CreateVendor(
    $input: CreateVendorInput!
    $condition: ModelVendorConditionInput
  ) {
    createVendor(input: $input, condition: $condition) {
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
export const updateVendor = /* GraphQL */ `
  mutation UpdateVendor(
    $input: UpdateVendorInput!
    $condition: ModelVendorConditionInput
  ) {
    updateVendor(input: $input, condition: $condition) {
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
export const deleteVendor = /* GraphQL */ `
  mutation DeleteVendor(
    $input: DeleteVendorInput!
    $condition: ModelVendorConditionInput
  ) {
    deleteVendor(input: $input, condition: $condition) {
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
export const createProductVendor = /* GraphQL */ `
  mutation CreateProductVendor(
    $input: CreateProductVendorInput!
    $condition: ModelProductVendorConditionInput
  ) {
    createProductVendor(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
export const updateProductVendor = /* GraphQL */ `
  mutation UpdateProductVendor(
    $input: UpdateProductVendorInput!
    $condition: ModelProductVendorConditionInput
  ) {
    updateProductVendor(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
export const deleteProductVendor = /* GraphQL */ `
  mutation DeleteProductVendor(
    $input: DeleteProductVendorInput!
    $condition: ModelProductVendorConditionInput
  ) {
    deleteProductVendor(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
export const createInfoQBAuth = /* GraphQL */ `
  mutation CreateInfoQBAuth(
    $input: CreateInfoQBAuthInput!
    $condition: ModelInfoQBAuthConditionInput
  ) {
    createInfoQBAuth(input: $input, condition: $condition) {
      id
      infoName
      infoContent
      createdAt
      updatedAt
    }
  }
`;
export const updateInfoQBAuth = /* GraphQL */ `
  mutation UpdateInfoQBAuth(
    $input: UpdateInfoQBAuthInput!
    $condition: ModelInfoQBAuthConditionInput
  ) {
    updateInfoQBAuth(input: $input, condition: $condition) {
      id
      infoName
      infoContent
      createdAt
      updatedAt
    }
  }
`;
export const deleteInfoQBAuth = /* GraphQL */ `
  mutation DeleteInfoQBAuth(
    $input: DeleteInfoQBAuthInput!
    $condition: ModelInfoQBAuthConditionInput
  ) {
    deleteInfoQBAuth(input: $input, condition: $condition) {
      id
      infoName
      infoContent
      createdAt
      updatedAt
    }
  }
`;
export const createEODCount = /* GraphQL */ `
  mutation CreateEODCount(
    $input: CreateEODCountInput!
    $condition: ModelEODCountConditionInput
  ) {
    createEODCount(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
export const updateEODCount = /* GraphQL */ `
  mutation UpdateEODCount(
    $input: UpdateEODCountInput!
    $condition: ModelEODCountConditionInput
  ) {
    updateEODCount(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
export const deleteEODCount = /* GraphQL */ `
  mutation DeleteEODCount(
    $input: DeleteEODCountInput!
    $condition: ModelEODCountConditionInput
  ) {
    deleteEODCount(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
export const createActualSetOut = /* GraphQL */ `
  mutation CreateActualSetOut(
    $input: CreateActualSetOutInput!
    $condition: ModelActualSetOutConditionInput
  ) {
    createActualSetOut(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
export const updateActualSetOut = /* GraphQL */ `
  mutation UpdateActualSetOut(
    $input: UpdateActualSetOutInput!
    $condition: ModelActualSetOutConditionInput
  ) {
    updateActualSetOut(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
export const deleteActualSetOut = /* GraphQL */ `
  mutation DeleteActualSetOut(
    $input: DeleteActualSetOutInput!
    $condition: ModelActualSetOutConditionInput
  ) {
    deleteActualSetOut(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
export const createCroixSheetCount = /* GraphQL */ `
  mutation CreateCroixSheetCount(
    $input: CreateCroixSheetCountInput!
    $condition: ModelCroixSheetCountConditionInput
  ) {
    createCroixSheetCount(input: $input, condition: $condition) {
      id
      qty
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const updateCroixSheetCount = /* GraphQL */ `
  mutation UpdateCroixSheetCount(
    $input: UpdateCroixSheetCountInput!
    $condition: ModelCroixSheetCountConditionInput
  ) {
    updateCroixSheetCount(input: $input, condition: $condition) {
      id
      qty
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const deleteCroixSheetCount = /* GraphQL */ `
  mutation DeleteCroixSheetCount(
    $input: DeleteCroixSheetCountInput!
    $condition: ModelCroixSheetCountConditionInput
  ) {
    deleteCroixSheetCount(input: $input, condition: $condition) {
      id
      qty
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const createOldDough = /* GraphQL */ `
  mutation CreateOldDough(
    $input: CreateOldDoughInput!
    $condition: ModelOldDoughConditionInput
  ) {
    createOldDough(input: $input, condition: $condition) {
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
export const updateOldDough = /* GraphQL */ `
  mutation UpdateOldDough(
    $input: UpdateOldDoughInput!
    $condition: ModelOldDoughConditionInput
  ) {
    updateOldDough(input: $input, condition: $condition) {
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
export const deleteOldDough = /* GraphQL */ `
  mutation DeleteOldDough(
    $input: DeleteOldDoughInput!
    $condition: ModelOldDoughConditionInput
  ) {
    deleteOldDough(input: $input, condition: $condition) {
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
export const createNotes = /* GraphQL */ `
  mutation CreateNotes(
    $input: CreateNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    createNotes(input: $input, condition: $condition) {
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
export const updateNotes = /* GraphQL */ `
  mutation UpdateNotes(
    $input: UpdateNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    updateNotes(input: $input, condition: $condition) {
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
export const deleteNotes = /* GraphQL */ `
  mutation DeleteNotes(
    $input: DeleteNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    deleteNotes(input: $input, condition: $condition) {
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
export const createEventLog = /* GraphQL */ `
  mutation CreateEventLog(
    $input: CreateEventLogInput!
    $condition: ModelEventLogConditionInput
  ) {
    createEventLog(input: $input, condition: $condition) {
      id
      eventType
      eventDescrip
      userID
      user {
        name
        email
        phone
        authClass
        sub
        locNick
        defaultLoc {
          Type
          locNick
          locName
          zoneNick
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
          isActive
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
export const updateEventLog = /* GraphQL */ `
  mutation UpdateEventLog(
    $input: UpdateEventLogInput!
    $condition: ModelEventLogConditionInput
  ) {
    updateEventLog(input: $input, condition: $condition) {
      id
      eventType
      eventDescrip
      userID
      user {
        name
        email
        phone
        authClass
        sub
        locNick
        defaultLoc {
          Type
          locNick
          locName
          zoneNick
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
          isActive
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
export const deleteEventLog = /* GraphQL */ `
  mutation DeleteEventLog(
    $input: DeleteEventLogInput!
    $condition: ModelEventLogConditionInput
  ) {
    deleteEventLog(input: $input, condition: $condition) {
      id
      eventType
      eventDescrip
      userID
      user {
        name
        email
        phone
        authClass
        sub
        locNick
        defaultLoc {
          Type
          locNick
          locName
          zoneNick
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
          isActive
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
export const createTemplateProd = /* GraphQL */ `
  mutation CreateTemplateProd(
    $input: CreateTemplateProdInput!
    $condition: ModelTemplateProdConditionInput
  ) {
    createTemplateProd(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateTemplateProd = /* GraphQL */ `
  mutation UpdateTemplateProd(
    $input: UpdateTemplateProdInput!
    $condition: ModelTemplateProdConditionInput
  ) {
    updateTemplateProd(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteTemplateProd = /* GraphQL */ `
  mutation DeleteTemplateProd(
    $input: DeleteTemplateProdInput!
    $condition: ModelTemplateProdConditionInput
  ) {
    deleteTemplateProd(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const createProdsNotAllowed = /* GraphQL */ `
  mutation CreateProdsNotAllowed(
    $input: CreateProdsNotAllowedInput!
    $condition: ModelProdsNotAllowedConditionInput
  ) {
    createProdsNotAllowed(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateProdsNotAllowed = /* GraphQL */ `
  mutation UpdateProdsNotAllowed(
    $input: UpdateProdsNotAllowedInput!
    $condition: ModelProdsNotAllowedConditionInput
  ) {
    updateProdsNotAllowed(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteProdsNotAllowed = /* GraphQL */ `
  mutation DeleteProdsNotAllowed(
    $input: DeleteProdsNotAllowedInput!
    $condition: ModelProdsNotAllowedConditionInput
  ) {
    deleteProdsNotAllowed(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const createProductDepend = /* GraphQL */ `
  mutation CreateProductDepend(
    $input: CreateProductDependInput!
    $condition: ModelProductDependConditionInput
  ) {
    createProductDepend(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
        qbID
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateProductDepend = /* GraphQL */ `
  mutation UpdateProductDepend(
    $input: UpdateProductDependInput!
    $condition: ModelProductDependConditionInput
  ) {
    updateProductDepend(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
        qbID
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteProductDepend = /* GraphQL */ `
  mutation DeleteProductDepend(
    $input: DeleteProductDependInput!
    $condition: ModelProductDependConditionInput
  ) {
    deleteProductDepend(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
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
        qbID
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const createZoneRoute = /* GraphQL */ `
  mutation CreateZoneRoute(
    $input: CreateZoneRouteInput!
    $condition: ModelZoneRouteConditionInput
  ) {
    createZoneRoute(input: $input, condition: $condition) {
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
export const updateZoneRoute = /* GraphQL */ `
  mutation UpdateZoneRoute(
    $input: UpdateZoneRouteInput!
    $condition: ModelZoneRouteConditionInput
  ) {
    updateZoneRoute(input: $input, condition: $condition) {
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
export const deleteZoneRoute = /* GraphQL */ `
  mutation DeleteZoneRoute(
    $input: DeleteZoneRouteInput!
    $condition: ModelZoneRouteConditionInput
  ) {
    deleteZoneRoute(input: $input, condition: $condition) {
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
export const createLocationUser = /* GraphQL */ `
  mutation CreateLocationUser(
    $input: CreateLocationUserInput!
    $condition: ModelLocationUserConditionInput
  ) {
    createLocationUser(input: $input, condition: $condition) {
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
        locationCreditAppId
      }
      user {
        name
        email
        phone
        authClass
        sub
        locNick
        defaultLoc {
          Type
          locNick
          locName
          zoneNick
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
          isActive
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
export const updateLocationUser = /* GraphQL */ `
  mutation UpdateLocationUser(
    $input: UpdateLocationUserInput!
    $condition: ModelLocationUserConditionInput
  ) {
    updateLocationUser(input: $input, condition: $condition) {
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
        locationCreditAppId
      }
      user {
        name
        email
        phone
        authClass
        sub
        locNick
        defaultLoc {
          Type
          locNick
          locName
          zoneNick
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
          isActive
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
export const deleteLocationUser = /* GraphQL */ `
  mutation DeleteLocationUser(
    $input: DeleteLocationUserInput!
    $condition: ModelLocationUserConditionInput
  ) {
    deleteLocationUser(input: $input, condition: $condition) {
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
        locationCreditAppId
      }
      user {
        name
        email
        phone
        authClass
        sub
        locNick
        defaultLoc {
          Type
          locNick
          locName
          zoneNick
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
          isActive
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
export const createAltPricing = /* GraphQL */ `
  mutation CreateAltPricing(
    $input: CreateAltPricingInput!
    $condition: ModelAltPricingConditionInput
  ) {
    createAltPricing(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateAltPricing = /* GraphQL */ `
  mutation UpdateAltPricing(
    $input: UpdateAltPricingInput!
    $condition: ModelAltPricingConditionInput
  ) {
    updateAltPricing(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteAltPricing = /* GraphQL */ `
  mutation DeleteAltPricing(
    $input: DeleteAltPricingInput!
    $condition: ModelAltPricingConditionInput
  ) {
    deleteAltPricing(input: $input, condition: $condition) {
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
        qbID
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
