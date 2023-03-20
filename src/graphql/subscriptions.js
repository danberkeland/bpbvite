/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateLocationBackup = /* GraphQL */ `
  subscription OnCreateLocationBackup(
    $filter: ModelSubscriptionLocationBackupFilterInput
  ) {
    onCreateLocationBackup(filter: $filter) {
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
export const onUpdateLocationBackup = /* GraphQL */ `
  subscription OnUpdateLocationBackup(
    $filter: ModelSubscriptionLocationBackupFilterInput
  ) {
    onUpdateLocationBackup(filter: $filter) {
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
export const onDeleteLocationBackup = /* GraphQL */ `
  subscription OnDeleteLocationBackup(
    $filter: ModelSubscriptionLocationBackupFilterInput
  ) {
    onDeleteLocationBackup(filter: $filter) {
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
export const onCreateProductBackup = /* GraphQL */ `
  subscription OnCreateProductBackup(
    $filter: ModelSubscriptionProductBackupFilterInput
  ) {
    onCreateProductBackup(filter: $filter) {
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
export const onUpdateProductBackup = /* GraphQL */ `
  subscription OnUpdateProductBackup(
    $filter: ModelSubscriptionProductBackupFilterInput
  ) {
    onUpdateProductBackup(filter: $filter) {
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
export const onDeleteProductBackup = /* GraphQL */ `
  subscription OnDeleteProductBackup(
    $filter: ModelSubscriptionProductBackupFilterInput
  ) {
    onDeleteProductBackup(filter: $filter) {
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
export const onCreateOrderBackup = /* GraphQL */ `
  subscription OnCreateOrderBackup(
    $filter: ModelSubscriptionOrderBackupFilterInput
  ) {
    onCreateOrderBackup(filter: $filter) {
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
export const onUpdateOrderBackup = /* GraphQL */ `
  subscription OnUpdateOrderBackup(
    $filter: ModelSubscriptionOrderBackupFilterInput
  ) {
    onUpdateOrderBackup(filter: $filter) {
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
export const onDeleteOrderBackup = /* GraphQL */ `
  subscription OnDeleteOrderBackup(
    $filter: ModelSubscriptionOrderBackupFilterInput
  ) {
    onDeleteOrderBackup(filter: $filter) {
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
export const onCreateStandingBackup = /* GraphQL */ `
  subscription OnCreateStandingBackup(
    $filter: ModelSubscriptionStandingBackupFilterInput
  ) {
    onCreateStandingBackup(filter: $filter) {
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
export const onUpdateStandingBackup = /* GraphQL */ `
  subscription OnUpdateStandingBackup(
    $filter: ModelSubscriptionStandingBackupFilterInput
  ) {
    onUpdateStandingBackup(filter: $filter) {
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
export const onDeleteStandingBackup = /* GraphQL */ `
  subscription OnDeleteStandingBackup(
    $filter: ModelSubscriptionStandingBackupFilterInput
  ) {
    onDeleteStandingBackup(filter: $filter) {
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
export const onCreateRouteBackup = /* GraphQL */ `
  subscription OnCreateRouteBackup(
    $filter: ModelSubscriptionRouteBackupFilterInput
  ) {
    onCreateRouteBackup(filter: $filter) {
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
export const onUpdateRouteBackup = /* GraphQL */ `
  subscription OnUpdateRouteBackup(
    $filter: ModelSubscriptionRouteBackupFilterInput
  ) {
    onUpdateRouteBackup(filter: $filter) {
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
export const onDeleteRouteBackup = /* GraphQL */ `
  subscription OnDeleteRouteBackup(
    $filter: ModelSubscriptionRouteBackupFilterInput
  ) {
    onDeleteRouteBackup(filter: $filter) {
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
export const onCreateZoneBackup = /* GraphQL */ `
  subscription OnCreateZoneBackup(
    $filter: ModelSubscriptionZoneBackupFilterInput
  ) {
    onCreateZoneBackup(filter: $filter) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateZoneBackup = /* GraphQL */ `
  subscription OnUpdateZoneBackup(
    $filter: ModelSubscriptionZoneBackupFilterInput
  ) {
    onUpdateZoneBackup(filter: $filter) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteZoneBackup = /* GraphQL */ `
  subscription OnDeleteZoneBackup(
    $filter: ModelSubscriptionZoneBackupFilterInput
  ) {
    onDeleteZoneBackup(filter: $filter) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
    }
  }
`;
export const onCreateDoughBackup = /* GraphQL */ `
  subscription OnCreateDoughBackup(
    $filter: ModelSubscriptionDoughBackupFilterInput
  ) {
    onCreateDoughBackup(filter: $filter) {
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
export const onUpdateDoughBackup = /* GraphQL */ `
  subscription OnUpdateDoughBackup(
    $filter: ModelSubscriptionDoughBackupFilterInput
  ) {
    onUpdateDoughBackup(filter: $filter) {
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
export const onDeleteDoughBackup = /* GraphQL */ `
  subscription OnDeleteDoughBackup(
    $filter: ModelSubscriptionDoughBackupFilterInput
  ) {
    onDeleteDoughBackup(filter: $filter) {
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
export const onCreateDoughComponentBackup = /* GraphQL */ `
  subscription OnCreateDoughComponentBackup(
    $filter: ModelSubscriptionDoughComponentBackupFilterInput
  ) {
    onCreateDoughComponentBackup(filter: $filter) {
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
export const onUpdateDoughComponentBackup = /* GraphQL */ `
  subscription OnUpdateDoughComponentBackup(
    $filter: ModelSubscriptionDoughComponentBackupFilterInput
  ) {
    onUpdateDoughComponentBackup(filter: $filter) {
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
export const onDeleteDoughComponentBackup = /* GraphQL */ `
  subscription OnDeleteDoughComponentBackup(
    $filter: ModelSubscriptionDoughComponentBackupFilterInput
  ) {
    onDeleteDoughComponentBackup(filter: $filter) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
        altLeadTimeByProduct {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
        altLeadTimeByProduct {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
        altLeadTimeByProduct {
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
export const onCreateCreditApp = /* GraphQL */ `
  subscription OnCreateCreditApp(
    $filter: ModelSubscriptionCreditAppFilterInput
  ) {
    onCreateCreditApp(filter: $filter) {
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
export const onUpdateCreditApp = /* GraphQL */ `
  subscription OnUpdateCreditApp(
    $filter: ModelSubscriptionCreditAppFilterInput
  ) {
    onUpdateCreditApp(filter: $filter) {
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
export const onDeleteCreditApp = /* GraphQL */ `
  subscription OnDeleteCreditApp(
    $filter: ModelSubscriptionCreditAppFilterInput
  ) {
    onDeleteCreditApp(filter: $filter) {
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
export const onCreateLocation = /* GraphQL */ `
  subscription OnCreateLocation($filter: ModelSubscriptionLocationFilterInput) {
    onCreateLocation(filter: $filter) {
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
      createdAt
      updatedAt
      locationCreditAppId
    }
  }
`;
export const onUpdateLocation = /* GraphQL */ `
  subscription OnUpdateLocation($filter: ModelSubscriptionLocationFilterInput) {
    onUpdateLocation(filter: $filter) {
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
      createdAt
      updatedAt
      locationCreditAppId
    }
  }
`;
export const onDeleteLocation = /* GraphQL */ `
  subscription OnDeleteLocation($filter: ModelSubscriptionLocationFilterInput) {
    onDeleteLocation(filter: $filter) {
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
      createdAt
      updatedAt
      locationCreditAppId
    }
  }
`;
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($filter: ModelSubscriptionProductFilterInput) {
    onCreateProduct(filter: $filter) {
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
      createdAt
      updatedAt
      inventoryProductId
    }
  }
`;
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($filter: ModelSubscriptionProductFilterInput) {
    onUpdateProduct(filter: $filter) {
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
      createdAt
      updatedAt
      inventoryProductId
    }
  }
`;
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($filter: ModelSubscriptionProductFilterInput) {
    onDeleteProduct(filter: $filter) {
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
      createdAt
      updatedAt
      inventoryProductId
    }
  }
`;
export const onCreateRetailLoc = /* GraphQL */ `
  subscription OnCreateRetailLoc(
    $filter: ModelSubscriptionRetailLocFilterInput
  ) {
    onCreateRetailLoc(filter: $filter) {
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
export const onUpdateRetailLoc = /* GraphQL */ `
  subscription OnUpdateRetailLoc(
    $filter: ModelSubscriptionRetailLocFilterInput
  ) {
    onUpdateRetailLoc(filter: $filter) {
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
export const onDeleteRetailLoc = /* GraphQL */ `
  subscription OnDeleteRetailLoc(
    $filter: ModelSubscriptionRetailLocFilterInput
  ) {
    onDeleteRetailLoc(filter: $filter) {
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
export const onCreateRetailProdLoc = /* GraphQL */ `
  subscription OnCreateRetailProdLoc(
    $filter: ModelSubscriptionRetailProdLocFilterInput
  ) {
    onCreateRetailProdLoc(filter: $filter) {
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
export const onUpdateRetailProdLoc = /* GraphQL */ `
  subscription OnUpdateRetailProdLoc(
    $filter: ModelSubscriptionRetailProdLocFilterInput
  ) {
    onUpdateRetailProdLoc(filter: $filter) {
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
export const onDeleteRetailProdLoc = /* GraphQL */ `
  subscription OnDeleteRetailProdLoc(
    $filter: ModelSubscriptionRetailProdLocFilterInput
  ) {
    onDeleteRetailProdLoc(filter: $filter) {
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
export const onCreateOrder = /* GraphQL */ `
  subscription OnCreateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onCreateOrder(filter: $filter) {
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
        altLeadTimeByProduct {
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
      ttl
    }
  }
`;
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onUpdateOrder(filter: $filter) {
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
        altLeadTimeByProduct {
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
      ttl
    }
  }
`;
export const onDeleteOrder = /* GraphQL */ `
  subscription OnDeleteOrder($filter: ModelSubscriptionOrderFilterInput) {
    onDeleteOrder(filter: $filter) {
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
        altLeadTimeByProduct {
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
      ttl
    }
  }
`;
export const onCreateStanding = /* GraphQL */ `
  subscription OnCreateStanding($filter: ModelSubscriptionStandingFilterInput) {
    onCreateStanding(filter: $filter) {
      id
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
        altLeadTimeByProduct {
          nextToken
        }
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
        createdAt
        updatedAt
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
export const onUpdateStanding = /* GraphQL */ `
  subscription OnUpdateStanding($filter: ModelSubscriptionStandingFilterInput) {
    onUpdateStanding(filter: $filter) {
      id
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
        altLeadTimeByProduct {
          nextToken
        }
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
        createdAt
        updatedAt
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
export const onDeleteStanding = /* GraphQL */ `
  subscription OnDeleteStanding($filter: ModelSubscriptionStandingFilterInput) {
    onDeleteStanding(filter: $filter) {
      id
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
        altLeadTimeByProduct {
          nextToken
        }
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
        createdAt
        updatedAt
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
export const onCreateZone = /* GraphQL */ `
  subscription OnCreateZone($filter: ModelSubscriptionZoneFilterInput) {
    onCreateZone(filter: $filter) {
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
export const onUpdateZone = /* GraphQL */ `
  subscription OnUpdateZone($filter: ModelSubscriptionZoneFilterInput) {
    onUpdateZone(filter: $filter) {
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
export const onDeleteZone = /* GraphQL */ `
  subscription OnDeleteZone($filter: ModelSubscriptionZoneFilterInput) {
    onDeleteZone(filter: $filter) {
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
export const onCreateRoute = /* GraphQL */ `
  subscription OnCreateRoute($filter: ModelSubscriptionRouteFilterInput) {
    onCreateRoute(filter: $filter) {
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
export const onUpdateRoute = /* GraphQL */ `
  subscription OnUpdateRoute($filter: ModelSubscriptionRouteFilterInput) {
    onUpdateRoute(filter: $filter) {
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
export const onDeleteRoute = /* GraphQL */ `
  subscription OnDeleteRoute($filter: ModelSubscriptionRouteFilterInput) {
    onDeleteRoute(filter: $filter) {
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
export const onCreatePackGroup = /* GraphQL */ `
  subscription OnCreatePackGroup(
    $filter: ModelSubscriptionPackGroupFilterInput
  ) {
    onCreatePackGroup(filter: $filter) {
      packGroupNick
      packGroup
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePackGroup = /* GraphQL */ `
  subscription OnUpdatePackGroup(
    $filter: ModelSubscriptionPackGroupFilterInput
  ) {
    onUpdatePackGroup(filter: $filter) {
      packGroupNick
      packGroup
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePackGroup = /* GraphQL */ `
  subscription OnDeletePackGroup(
    $filter: ModelSubscriptionPackGroupFilterInput
  ) {
    onDeletePackGroup(filter: $filter) {
      packGroupNick
      packGroup
      createdAt
      updatedAt
    }
  }
`;
export const onCreateDough = /* GraphQL */ `
  subscription OnCreateDough($filter: ModelSubscriptionDoughFilterInput) {
    onCreateDough(filter: $filter) {
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
export const onUpdateDough = /* GraphQL */ `
  subscription OnUpdateDough($filter: ModelSubscriptionDoughFilterInput) {
    onUpdateDough(filter: $filter) {
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
export const onDeleteDough = /* GraphQL */ `
  subscription OnDeleteDough($filter: ModelSubscriptionDoughFilterInput) {
    onDeleteDough(filter: $filter) {
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
export const onCreateBucketInfo = /* GraphQL */ `
  subscription OnCreateBucketInfo(
    $filter: ModelSubscriptionBucketInfoFilterInput
  ) {
    onCreateBucketInfo(filter: $filter) {
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
export const onUpdateBucketInfo = /* GraphQL */ `
  subscription OnUpdateBucketInfo(
    $filter: ModelSubscriptionBucketInfoFilterInput
  ) {
    onUpdateBucketInfo(filter: $filter) {
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
export const onDeleteBucketInfo = /* GraphQL */ `
  subscription OnDeleteBucketInfo(
    $filter: ModelSubscriptionBucketInfoFilterInput
  ) {
    onDeleteBucketInfo(filter: $filter) {
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
export const onCreatePocketCount = /* GraphQL */ `
  subscription OnCreatePocketCount(
    $filter: ModelSubscriptionPocketCountFilterInput
  ) {
    onCreatePocketCount(filter: $filter) {
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
export const onUpdatePocketCount = /* GraphQL */ `
  subscription OnUpdatePocketCount(
    $filter: ModelSubscriptionPocketCountFilterInput
  ) {
    onUpdatePocketCount(filter: $filter) {
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
export const onDeletePocketCount = /* GraphQL */ `
  subscription OnDeletePocketCount(
    $filter: ModelSubscriptionPocketCountFilterInput
  ) {
    onDeletePocketCount(filter: $filter) {
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
export const onCreateInventory = /* GraphQL */ `
  subscription OnCreateInventory(
    $filter: ModelSubscriptionInventoryFilterInput
  ) {
    onCreateInventory(filter: $filter) {
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
export const onUpdateInventory = /* GraphQL */ `
  subscription OnUpdateInventory(
    $filter: ModelSubscriptionInventoryFilterInput
  ) {
    onUpdateInventory(filter: $filter) {
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
export const onDeleteInventory = /* GraphQL */ `
  subscription OnDeleteInventory(
    $filter: ModelSubscriptionInventoryFilterInput
  ) {
    onDeleteInventory(filter: $filter) {
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
export const onCreateUnit = /* GraphQL */ `
  subscription OnCreateUnit($filter: ModelSubscriptionUnitFilterInput) {
    onCreateUnit(filter: $filter) {
      unitNick
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUnit = /* GraphQL */ `
  subscription OnUpdateUnit($filter: ModelSubscriptionUnitFilterInput) {
    onUpdateUnit(filter: $filter) {
      unitNick
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUnit = /* GraphQL */ `
  subscription OnDeleteUnit($filter: ModelSubscriptionUnitFilterInput) {
    onDeleteUnit(filter: $filter) {
      unitNick
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const onCreateInternalLoc = /* GraphQL */ `
  subscription OnCreateInternalLoc(
    $filter: ModelSubscriptionInternalLocFilterInput
  ) {
    onCreateInternalLoc(filter: $filter) {
      intLocNick
      bakeryLoc
      intLocDescrip
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateInternalLoc = /* GraphQL */ `
  subscription OnUpdateInternalLoc(
    $filter: ModelSubscriptionInternalLocFilterInput
  ) {
    onUpdateInternalLoc(filter: $filter) {
      intLocNick
      bakeryLoc
      intLocDescrip
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteInternalLoc = /* GraphQL */ `
  subscription OnDeleteInternalLoc(
    $filter: ModelSubscriptionInternalLocFilterInput
  ) {
    onDeleteInternalLoc(filter: $filter) {
      intLocNick
      bakeryLoc
      intLocDescrip
      createdAt
      updatedAt
    }
  }
`;
export const onCreateIngType = /* GraphQL */ `
  subscription OnCreateIngType($filter: ModelSubscriptionIngTypeFilterInput) {
    onCreateIngType(filter: $filter) {
      ingTypeNick
      ingType
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateIngType = /* GraphQL */ `
  subscription OnUpdateIngType($filter: ModelSubscriptionIngTypeFilterInput) {
    onUpdateIngType(filter: $filter) {
      ingTypeNick
      ingType
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteIngType = /* GraphQL */ `
  subscription OnDeleteIngType($filter: ModelSubscriptionIngTypeFilterInput) {
    onDeleteIngType(filter: $filter) {
      ingTypeNick
      ingType
      createdAt
      updatedAt
    }
  }
`;
export const onCreateVendor = /* GraphQL */ `
  subscription OnCreateVendor($filter: ModelSubscriptionVendorFilterInput) {
    onCreateVendor(filter: $filter) {
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
export const onUpdateVendor = /* GraphQL */ `
  subscription OnUpdateVendor($filter: ModelSubscriptionVendorFilterInput) {
    onUpdateVendor(filter: $filter) {
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
export const onDeleteVendor = /* GraphQL */ `
  subscription OnDeleteVendor($filter: ModelSubscriptionVendorFilterInput) {
    onDeleteVendor(filter: $filter) {
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
export const onCreateProductVendor = /* GraphQL */ `
  subscription OnCreateProductVendor(
    $filter: ModelSubscriptionProductVendorFilterInput
  ) {
    onCreateProductVendor(filter: $filter) {
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
export const onUpdateProductVendor = /* GraphQL */ `
  subscription OnUpdateProductVendor(
    $filter: ModelSubscriptionProductVendorFilterInput
  ) {
    onUpdateProductVendor(filter: $filter) {
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
export const onDeleteProductVendor = /* GraphQL */ `
  subscription OnDeleteProductVendor(
    $filter: ModelSubscriptionProductVendorFilterInput
  ) {
    onDeleteProductVendor(filter: $filter) {
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
export const onCreateInfoQBAuth = /* GraphQL */ `
  subscription OnCreateInfoQBAuth(
    $filter: ModelSubscriptionInfoQBAuthFilterInput
  ) {
    onCreateInfoQBAuth(filter: $filter) {
      id
      infoName
      infoContent
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateInfoQBAuth = /* GraphQL */ `
  subscription OnUpdateInfoQBAuth(
    $filter: ModelSubscriptionInfoQBAuthFilterInput
  ) {
    onUpdateInfoQBAuth(filter: $filter) {
      id
      infoName
      infoContent
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteInfoQBAuth = /* GraphQL */ `
  subscription OnDeleteInfoQBAuth(
    $filter: ModelSubscriptionInfoQBAuthFilterInput
  ) {
    onDeleteInfoQBAuth(filter: $filter) {
      id
      infoName
      infoContent
      createdAt
      updatedAt
    }
  }
`;
export const onCreateEODCount = /* GraphQL */ `
  subscription OnCreateEODCount($filter: ModelSubscriptionEODCountFilterInput) {
    onCreateEODCount(filter: $filter) {
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
export const onUpdateEODCount = /* GraphQL */ `
  subscription OnUpdateEODCount($filter: ModelSubscriptionEODCountFilterInput) {
    onUpdateEODCount(filter: $filter) {
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
export const onDeleteEODCount = /* GraphQL */ `
  subscription OnDeleteEODCount($filter: ModelSubscriptionEODCountFilterInput) {
    onDeleteEODCount(filter: $filter) {
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
export const onCreateActualSetOut = /* GraphQL */ `
  subscription OnCreateActualSetOut(
    $filter: ModelSubscriptionActualSetOutFilterInput
  ) {
    onCreateActualSetOut(filter: $filter) {
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
export const onUpdateActualSetOut = /* GraphQL */ `
  subscription OnUpdateActualSetOut(
    $filter: ModelSubscriptionActualSetOutFilterInput
  ) {
    onUpdateActualSetOut(filter: $filter) {
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
export const onDeleteActualSetOut = /* GraphQL */ `
  subscription OnDeleteActualSetOut(
    $filter: ModelSubscriptionActualSetOutFilterInput
  ) {
    onDeleteActualSetOut(filter: $filter) {
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
export const onCreateCroixSheetCount = /* GraphQL */ `
  subscription OnCreateCroixSheetCount(
    $filter: ModelSubscriptionCroixSheetCountFilterInput
  ) {
    onCreateCroixSheetCount(filter: $filter) {
      id
      qty
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCroixSheetCount = /* GraphQL */ `
  subscription OnUpdateCroixSheetCount(
    $filter: ModelSubscriptionCroixSheetCountFilterInput
  ) {
    onUpdateCroixSheetCount(filter: $filter) {
      id
      qty
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCroixSheetCount = /* GraphQL */ `
  subscription OnDeleteCroixSheetCount(
    $filter: ModelSubscriptionCroixSheetCountFilterInput
  ) {
    onDeleteCroixSheetCount(filter: $filter) {
      id
      qty
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const onCreateOldDough = /* GraphQL */ `
  subscription OnCreateOldDough($filter: ModelSubscriptionOldDoughFilterInput) {
    onCreateOldDough(filter: $filter) {
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
export const onUpdateOldDough = /* GraphQL */ `
  subscription OnUpdateOldDough($filter: ModelSubscriptionOldDoughFilterInput) {
    onUpdateOldDough(filter: $filter) {
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
export const onDeleteOldDough = /* GraphQL */ `
  subscription OnDeleteOldDough($filter: ModelSubscriptionOldDoughFilterInput) {
    onDeleteOldDough(filter: $filter) {
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
export const onCreateNotes = /* GraphQL */ `
  subscription OnCreateNotes($filter: ModelSubscriptionNotesFilterInput) {
    onCreateNotes(filter: $filter) {
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
export const onUpdateNotes = /* GraphQL */ `
  subscription OnUpdateNotes($filter: ModelSubscriptionNotesFilterInput) {
    onUpdateNotes(filter: $filter) {
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
export const onDeleteNotes = /* GraphQL */ `
  subscription OnDeleteNotes($filter: ModelSubscriptionNotesFilterInput) {
    onDeleteNotes(filter: $filter) {
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
export const onCreateEventLog = /* GraphQL */ `
  subscription OnCreateEventLog($filter: ModelSubscriptionEventLogFilterInput) {
    onCreateEventLog(filter: $filter) {
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
export const onUpdateEventLog = /* GraphQL */ `
  subscription OnUpdateEventLog($filter: ModelSubscriptionEventLogFilterInput) {
    onUpdateEventLog(filter: $filter) {
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
export const onDeleteEventLog = /* GraphQL */ `
  subscription OnDeleteEventLog($filter: ModelSubscriptionEventLogFilterInput) {
    onDeleteEventLog(filter: $filter) {
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
export const onCreateTemplateProd = /* GraphQL */ `
  subscription OnCreateTemplateProd(
    $filter: ModelSubscriptionTemplateProdFilterInput
  ) {
    onCreateTemplateProd(filter: $filter) {
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
        altLeadTimeByProduct {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTemplateProd = /* GraphQL */ `
  subscription OnUpdateTemplateProd(
    $filter: ModelSubscriptionTemplateProdFilterInput
  ) {
    onUpdateTemplateProd(filter: $filter) {
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
        altLeadTimeByProduct {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTemplateProd = /* GraphQL */ `
  subscription OnDeleteTemplateProd(
    $filter: ModelSubscriptionTemplateProdFilterInput
  ) {
    onDeleteTemplateProd(filter: $filter) {
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
        altLeadTimeByProduct {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProdsNotAllowed = /* GraphQL */ `
  subscription OnCreateProdsNotAllowed(
    $filter: ModelSubscriptionProdsNotAllowedFilterInput
  ) {
    onCreateProdsNotAllowed(filter: $filter) {
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
        altLeadTimeByProduct {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateProdsNotAllowed = /* GraphQL */ `
  subscription OnUpdateProdsNotAllowed(
    $filter: ModelSubscriptionProdsNotAllowedFilterInput
  ) {
    onUpdateProdsNotAllowed(filter: $filter) {
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
        altLeadTimeByProduct {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteProdsNotAllowed = /* GraphQL */ `
  subscription OnDeleteProdsNotAllowed(
    $filter: ModelSubscriptionProdsNotAllowedFilterInput
  ) {
    onDeleteProdsNotAllowed(filter: $filter) {
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
        altLeadTimeByProduct {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProductDepend = /* GraphQL */ `
  subscription OnCreateProductDepend(
    $filter: ModelSubscriptionProductDependFilterInput
  ) {
    onCreateProductDepend(filter: $filter) {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateProductDepend = /* GraphQL */ `
  subscription OnUpdateProductDepend(
    $filter: ModelSubscriptionProductDependFilterInput
  ) {
    onUpdateProductDepend(filter: $filter) {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteProductDepend = /* GraphQL */ `
  subscription OnDeleteProductDepend(
    $filter: ModelSubscriptionProductDependFilterInput
  ) {
    onDeleteProductDepend(filter: $filter) {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateZoneRoute = /* GraphQL */ `
  subscription OnCreateZoneRoute(
    $filter: ModelSubscriptionZoneRouteFilterInput
  ) {
    onCreateZoneRoute(filter: $filter) {
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
export const onUpdateZoneRoute = /* GraphQL */ `
  subscription OnUpdateZoneRoute(
    $filter: ModelSubscriptionZoneRouteFilterInput
  ) {
    onUpdateZoneRoute(filter: $filter) {
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
export const onDeleteZoneRoute = /* GraphQL */ `
  subscription OnDeleteZoneRoute(
    $filter: ModelSubscriptionZoneRouteFilterInput
  ) {
    onDeleteZoneRoute(filter: $filter) {
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
export const onCreateLocationUser = /* GraphQL */ `
  subscription OnCreateLocationUser(
    $filter: ModelSubscriptionLocationUserFilterInput
  ) {
    onCreateLocationUser(filter: $filter) {
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
        altLeadTimeByProduct {
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
export const onUpdateLocationUser = /* GraphQL */ `
  subscription OnUpdateLocationUser(
    $filter: ModelSubscriptionLocationUserFilterInput
  ) {
    onUpdateLocationUser(filter: $filter) {
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
        altLeadTimeByProduct {
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
export const onDeleteLocationUser = /* GraphQL */ `
  subscription OnDeleteLocationUser(
    $filter: ModelSubscriptionLocationUserFilterInput
  ) {
    onDeleteLocationUser(filter: $filter) {
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
        altLeadTimeByProduct {
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
export const onCreateAltPricing = /* GraphQL */ `
  subscription OnCreateAltPricing(
    $filter: ModelSubscriptionAltPricingFilterInput
  ) {
    onCreateAltPricing(filter: $filter) {
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
        altLeadTimeByProduct {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAltPricing = /* GraphQL */ `
  subscription OnUpdateAltPricing(
    $filter: ModelSubscriptionAltPricingFilterInput
  ) {
    onUpdateAltPricing(filter: $filter) {
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
        altLeadTimeByProduct {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAltPricing = /* GraphQL */ `
  subscription OnDeleteAltPricing(
    $filter: ModelSubscriptionAltPricingFilterInput
  ) {
    onDeleteAltPricing(filter: $filter) {
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
        altLeadTimeByProduct {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateAltLeadTime = /* GraphQL */ `
  subscription OnCreateAltLeadTime(
    $filter: ModelSubscriptionAltLeadTimeFilterInput
  ) {
    onCreateAltLeadTime(filter: $filter) {
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
        altLeadTimeByProduct {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAltLeadTime = /* GraphQL */ `
  subscription OnUpdateAltLeadTime(
    $filter: ModelSubscriptionAltLeadTimeFilterInput
  ) {
    onUpdateAltLeadTime(filter: $filter) {
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
        altLeadTimeByProduct {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAltLeadTime = /* GraphQL */ `
  subscription OnDeleteAltLeadTime(
    $filter: ModelSubscriptionAltLeadTimeFilterInput
  ) {
    onDeleteAltLeadTime(filter: $filter) {
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
        altLeadTimeByProduct {
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
        createdAt
        updatedAt
        inventoryProductId
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTraining = /* GraphQL */ `
  subscription OnCreateTraining($filter: ModelSubscriptionTrainingFilterInput) {
    onCreateTraining(filter: $filter) {
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
export const onUpdateTraining = /* GraphQL */ `
  subscription OnUpdateTraining($filter: ModelSubscriptionTrainingFilterInput) {
    onUpdateTraining(filter: $filter) {
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
export const onDeleteTraining = /* GraphQL */ `
  subscription OnDeleteTraining($filter: ModelSubscriptionTrainingFilterInput) {
    onDeleteTraining(filter: $filter) {
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
