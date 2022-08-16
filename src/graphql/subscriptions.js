/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateLocation = /* GraphQL */ `
  subscription OnCreateLocation($filter: ModelSubscriptionLocationFilterInput) {
    onCreateLocation(filter: $filter) {
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
        id
        zoneNum
        zoneName
        zoneFee
        createdAt
        updatedAt
        routeRouteServeId
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
export const onUpdateLocation = /* GraphQL */ `
  subscription OnUpdateLocation($filter: ModelSubscriptionLocationFilterInput) {
    onUpdateLocation(filter: $filter) {
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
        id
        zoneNum
        zoneName
        zoneFee
        createdAt
        updatedAt
        routeRouteServeId
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
export const onDeleteLocation = /* GraphQL */ `
  subscription OnDeleteLocation($filter: ModelSubscriptionLocationFilterInput) {
    onDeleteLocation(filter: $filter) {
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
        id
        zoneNum
        zoneName
        zoneFee
        createdAt
        updatedAt
        routeRouteServeId
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
export const onCreateTemplateProd = /* GraphQL */ `
  subscription OnCreateTemplateProd(
    $filter: ModelSubscriptionTemplateProdFilterInput
  ) {
    onCreateTemplateProd(filter: $filter) {
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
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
        locNick
        locName
        subs {
          nextToken
        }
        zoneID
        zone {
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
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
        locNick
        locName
        subs {
          nextToken
        }
        zoneID
        zone {
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
      }
      createdAt
      updatedAt
    }
  }
`;
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($filter: ModelSubscriptionProductFilterInput) {
    onCreateProduct(filter: $filter) {
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
      depends {
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
          productDependsId
          inventoryProductsId
        }
        nextToken
      }
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
      createdAt
      updatedAt
      productDependsId
      inventoryProductsId
    }
  }
`;
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($filter: ModelSubscriptionProductFilterInput) {
    onUpdateProduct(filter: $filter) {
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
      depends {
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
          productDependsId
          inventoryProductsId
        }
        nextToken
      }
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
      createdAt
      updatedAt
      productDependsId
      inventoryProductsId
    }
  }
`;
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($filter: ModelSubscriptionProductFilterInput) {
    onDeleteProduct(filter: $filter) {
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
      depends {
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
          productDependsId
          inventoryProductsId
        }
        nextToken
      }
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
      createdAt
      updatedAt
      productDependsId
      inventoryProductsId
    }
  }
`;
export const onCreateZone = /* GraphQL */ `
  subscription OnCreateZone($filter: ModelSubscriptionZoneFilterInput) {
    onCreateZone(filter: $filter) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
      routeRouteServeId
    }
  }
`;
export const onUpdateZone = /* GraphQL */ `
  subscription OnUpdateZone($filter: ModelSubscriptionZoneFilterInput) {
    onUpdateZone(filter: $filter) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
      routeRouteServeId
    }
  }
`;
export const onDeleteZone = /* GraphQL */ `
  subscription OnDeleteZone($filter: ModelSubscriptionZoneFilterInput) {
    onDeleteZone(filter: $filter) {
      id
      zoneNum
      zoneName
      zoneFee
      createdAt
      updatedAt
      routeRouteServeId
    }
  }
`;
export const onCreateLocationUser = /* GraphQL */ `
  subscription OnCreateLocationUser(
    $filter: ModelSubscriptionLocationUserFilterInput
  ) {
    onCreateLocationUser(filter: $filter) {
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
export const onUpdateLocationUser = /* GraphQL */ `
  subscription OnUpdateLocationUser(
    $filter: ModelSubscriptionLocationUserFilterInput
  ) {
    onUpdateLocationUser(filter: $filter) {
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
export const onDeleteLocationUser = /* GraphQL */ `
  subscription OnDeleteLocationUser(
    $filter: ModelSubscriptionLocationUserFilterInput
  ) {
    onDeleteLocationUser(filter: $filter) {
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
export const onCreateAltPricing = /* GraphQL */ `
  subscription OnCreateAltPricing(
    $filter: ModelSubscriptionAltPricingFilterInput
  ) {
    onCreateAltPricing(filter: $filter) {
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
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
        locNick
        locName
        subs {
          nextToken
        }
        zoneID
        zone {
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
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
        locNick
        locName
        subs {
          nextToken
        }
        zoneID
        zone {
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
      }
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
      components {
        items {
          id
          dough
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
export const onUpdateDough = /* GraphQL */ `
  subscription OnUpdateDough($filter: ModelSubscriptionDoughFilterInput) {
    onUpdateDough(filter: $filter) {
      doughNick
      doughName
      hydration
      batchSize
      mixedWhere
      components {
        items {
          id
          dough
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
export const onDeleteDough = /* GraphQL */ `
  subscription OnDeleteDough($filter: ModelSubscriptionDoughFilterInput) {
    onDeleteDough(filter: $filter) {
      doughNick
      doughName
      hydration
      batchSize
      mixedWhere
      components {
        items {
          id
          dough
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
export const onCreateDoughComponent = /* GraphQL */ `
  subscription OnCreateDoughComponent(
    $filter: ModelSubscriptionDoughComponentFilterInput
  ) {
    onCreateDoughComponent(filter: $filter) {
      id
      dough
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
        vendors {
          nextToken
        }
        products {
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
export const onUpdateDoughComponent = /* GraphQL */ `
  subscription OnUpdateDoughComponent(
    $filter: ModelSubscriptionDoughComponentFilterInput
  ) {
    onUpdateDoughComponent(filter: $filter) {
      id
      dough
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
        vendors {
          nextToken
        }
        products {
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
export const onDeleteDoughComponent = /* GraphQL */ `
  subscription OnDeleteDoughComponent(
    $filter: ModelSubscriptionDoughComponentFilterInput
  ) {
    onDeleteDoughComponent(filter: $filter) {
      id
      dough
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
        vendors {
          nextToken
        }
        products {
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
export const onCreateInventory = /* GraphQL */ `
  subscription OnCreateInventory(
    $filter: ModelSubscriptionInventoryFilterInput
  ) {
    onCreateInventory(filter: $filter) {
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
      vendors {
        items {
          id
          vendorName
          vendorNick
          createdAt
          updatedAt
          inventoryVendorsId
        }
        nextToken
      }
      products {
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
          productDependsId
          inventoryProductsId
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
export const onUpdateInventory = /* GraphQL */ `
  subscription OnUpdateInventory(
    $filter: ModelSubscriptionInventoryFilterInput
  ) {
    onUpdateInventory(filter: $filter) {
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
      vendors {
        items {
          id
          vendorName
          vendorNick
          createdAt
          updatedAt
          inventoryVendorsId
        }
        nextToken
      }
      products {
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
          productDependsId
          inventoryProductsId
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
export const onDeleteInventory = /* GraphQL */ `
  subscription OnDeleteInventory(
    $filter: ModelSubscriptionInventoryFilterInput
  ) {
    onDeleteInventory(filter: $filter) {
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
      vendors {
        items {
          id
          vendorName
          vendorNick
          createdAt
          updatedAt
          inventoryVendorsId
        }
        nextToken
      }
      products {
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
          productDependsId
          inventoryProductsId
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
export const onCreateUnit = /* GraphQL */ `
  subscription OnCreateUnit($filter: ModelSubscriptionUnitFilterInput) {
    onCreateUnit(filter: $filter) {
      id
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUnit = /* GraphQL */ `
  subscription OnUpdateUnit($filter: ModelSubscriptionUnitFilterInput) {
    onUpdateUnit(filter: $filter) {
      id
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUnit = /* GraphQL */ `
  subscription OnDeleteUnit($filter: ModelSubscriptionUnitFilterInput) {
    onDeleteUnit(filter: $filter) {
      id
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
      id
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateIngType = /* GraphQL */ `
  subscription OnUpdateIngType($filter: ModelSubscriptionIngTypeFilterInput) {
    onUpdateIngType(filter: $filter) {
      id
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteIngType = /* GraphQL */ `
  subscription OnDeleteIngType($filter: ModelSubscriptionIngTypeFilterInput) {
    onDeleteIngType(filter: $filter) {
      id
      unitName
      createdAt
      updatedAt
    }
  }
`;
export const onCreateVendor = /* GraphQL */ `
  subscription OnCreateVendor($filter: ModelSubscriptionVendorFilterInput) {
    onCreateVendor(filter: $filter) {
      id
      vendorName
      vendorNick
      createdAt
      updatedAt
      inventoryVendorsId
    }
  }
`;
export const onUpdateVendor = /* GraphQL */ `
  subscription OnUpdateVendor($filter: ModelSubscriptionVendorFilterInput) {
    onUpdateVendor(filter: $filter) {
      id
      vendorName
      vendorNick
      createdAt
      updatedAt
      inventoryVendorsId
    }
  }
`;
export const onDeleteVendor = /* GraphQL */ `
  subscription OnDeleteVendor($filter: ModelSubscriptionVendorFilterInput) {
    onDeleteVendor(filter: $filter) {
      id
      vendorName
      vendorNick
      createdAt
      updatedAt
      inventoryVendorsId
    }
  }
`;
export const onCreateCroixCount = /* GraphQL */ `
  subscription OnCreateCroixCount(
    $filter: ModelSubscriptionCroixCountFilterInput
  ) {
    onCreateCroixCount(filter: $filter) {
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
      }
      freezerLocation
      qty
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCroixCount = /* GraphQL */ `
  subscription OnUpdateCroixCount(
    $filter: ModelSubscriptionCroixCountFilterInput
  ) {
    onUpdateCroixCount(filter: $filter) {
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
      }
      freezerLocation
      qty
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCroixCount = /* GraphQL */ `
  subscription OnDeleteCroixCount(
    $filter: ModelSubscriptionCroixCountFilterInput
  ) {
    onDeleteCroixCount(filter: $filter) {
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
      }
      freezerLocation
      qty
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const onCreateEODCount = /* GraphQL */ `
  subscription OnCreateEODCount($filter: ModelSubscriptionEODCountFilterInput) {
    onCreateEODCount(filter: $filter) {
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
      }
      shelfOrFreezer
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
      }
      shelfOrFreezer
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
      }
      shelfOrFreezer
      location
      qty
      whoCounted
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePocketCount = /* GraphQL */ `
  subscription OnCreatePocketCount(
    $filter: ModelSubscriptionPocketCountFilterInput
  ) {
    onCreatePocketCount(filter: $filter) {
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
export const onUpdatePocketCount = /* GraphQL */ `
  subscription OnUpdatePocketCount(
    $filter: ModelSubscriptionPocketCountFilterInput
  ) {
    onUpdatePocketCount(filter: $filter) {
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
export const onDeletePocketCount = /* GraphQL */ `
  subscription OnDeletePocketCount(
    $filter: ModelSubscriptionPocketCountFilterInput
  ) {
    onDeletePocketCount(filter: $filter) {
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
export const onCreateActualSetOut = /* GraphQL */ `
  subscription OnCreateActualSetOut(
    $filter: ModelSubscriptionActualSetOutFilterInput
  ) {
    onCreateActualSetOut(filter: $filter) {
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
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
export const onCreatePackGroup = /* GraphQL */ `
  subscription OnCreatePackGroup(
    $filter: ModelSubscriptionPackGroupFilterInput
  ) {
    onCreatePackGroup(filter: $filter) {
      id
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
      id
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
      id
      packGroup
      createdAt
      updatedAt
    }
  }
`;
export const onCreateRoute = /* GraphQL */ `
  subscription OnCreateRoute($filter: ModelSubscriptionRouteFilterInput) {
    onCreateRoute(filter: $filter) {
      id
      routeName
      routeStart
      routeTime
      RouteDepart
      RouteArrive
      RouteServe {
        items {
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
        }
        nextToken
      }
      RouteSched
      printOrder
      driver
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRoute = /* GraphQL */ `
  subscription OnUpdateRoute($filter: ModelSubscriptionRouteFilterInput) {
    onUpdateRoute(filter: $filter) {
      id
      routeName
      routeStart
      routeTime
      RouteDepart
      RouteArrive
      RouteServe {
        items {
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
        }
        nextToken
      }
      RouteSched
      printOrder
      driver
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRoute = /* GraphQL */ `
  subscription OnDeleteRoute($filter: ModelSubscriptionRouteFilterInput) {
    onDeleteRoute(filter: $filter) {
      id
      routeName
      routeStart
      routeTime
      RouteDepart
      RouteArrive
      RouteServe {
        items {
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
        }
        nextToken
      }
      RouteSched
      printOrder
      driver
      createdAt
      updatedAt
    }
  }
`;
export const onCreateOldDough = /* GraphQL */ `
  subscription OnCreateOldDough($filter: ModelSubscriptionOldDoughFilterInput) {
    onCreateOldDough(filter: $filter) {
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
export const onUpdateOldDough = /* GraphQL */ `
  subscription OnUpdateOldDough($filter: ModelSubscriptionOldDoughFilterInput) {
    onUpdateOldDough(filter: $filter) {
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
export const onDeleteOldDough = /* GraphQL */ `
  subscription OnDeleteOldDough($filter: ModelSubscriptionOldDoughFilterInput) {
    onDeleteOldDough(filter: $filter) {
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
export const onCreateBucketInfo = /* GraphQL */ `
  subscription OnCreateBucketInfo(
    $filter: ModelSubscriptionBucketInfoFilterInput
  ) {
    onCreateBucketInfo(filter: $filter) {
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
export const onUpdateBucketInfo = /* GraphQL */ `
  subscription OnUpdateBucketInfo(
    $filter: ModelSubscriptionBucketInfoFilterInput
  ) {
    onUpdateBucketInfo(filter: $filter) {
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
export const onDeleteBucketInfo = /* GraphQL */ `
  subscription OnDeleteBucketInfo(
    $filter: ModelSubscriptionBucketInfoFilterInput
  ) {
    onDeleteBucketInfo(filter: $filter) {
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
export const onCreateInvoice = /* GraphQL */ `
  subscription OnCreateInvoice($filter: ModelSubscriptionInvoiceFilterInput) {
    onCreateInvoice(filter: $filter) {
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
export const onUpdateInvoice = /* GraphQL */ `
  subscription OnUpdateInvoice($filter: ModelSubscriptionInvoiceFilterInput) {
    onUpdateInvoice(filter: $filter) {
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
export const onDeleteInvoice = /* GraphQL */ `
  subscription OnDeleteInvoice($filter: ModelSubscriptionInvoiceFilterInput) {
    onDeleteInvoice(filter: $filter) {
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
export const onCreateOrder = /* GraphQL */ `
  subscription OnCreateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onCreateOrder(filter: $filter) {
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onUpdateOrder(filter: $filter) {
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
export const onDeleteOrder = /* GraphQL */ `
  subscription OnDeleteOrder($filter: ModelSubscriptionOrderFilterInput) {
    onDeleteOrder(filter: $filter) {
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
        depends {
          nextToken
        }
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
        altPricing {
          nextToken
        }
        templateProd {
          nextToken
        }
        prodsNotAllowed {
          nextToken
        }
        createdAt
        updatedAt
        productDependsId
        inventoryProductsId
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
          id
          zoneNum
          zoneName
          zoneFee
          createdAt
          updatedAt
          routeRouteServeId
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
