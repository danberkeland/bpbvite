/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLocation = /* GraphQL */ `
  mutation CreateLocation(
    $input: CreateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    createLocation(input: $input, condition: $condition) {
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
          locationSubsId
          userLocsId
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
          locationProdsNotAllowedId
          locationTemplateProdId
          productDependsId
          inventoryProductsId
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
          locationCustomProdId
          productAltPricingId
        }
        nextToken
      }
      templateProd {
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
          locationProdsNotAllowedId
          locationTemplateProdId
          productDependsId
          inventoryProductsId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateLocation = /* GraphQL */ `
  mutation UpdateLocation(
    $input: UpdateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    updateLocation(input: $input, condition: $condition) {
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
          locationSubsId
          userLocsId
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
          locationProdsNotAllowedId
          locationTemplateProdId
          productDependsId
          inventoryProductsId
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
          locationCustomProdId
          productAltPricingId
        }
        nextToken
      }
      templateProd {
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
          locationProdsNotAllowedId
          locationTemplateProdId
          productDependsId
          inventoryProductsId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteLocation = /* GraphQL */ `
  mutation DeleteLocation(
    $input: DeleteLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    deleteLocation(input: $input, condition: $condition) {
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
          locationSubsId
          userLocsId
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
          locationProdsNotAllowedId
          locationTemplateProdId
          productDependsId
          inventoryProductsId
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
          locationCustomProdId
          productAltPricingId
        }
        nextToken
      }
      templateProd {
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
          locationProdsNotAllowedId
          locationTemplateProdId
          productDependsId
          inventoryProductsId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
          locationSubsId
          userLocsId
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
          locationSubsId
          userLocsId
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
          locationSubsId
          userLocsId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
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
          locationProdsNotAllowedId
          locationTemplateProdId
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
          locationCustomProdId
          productAltPricingId
        }
        nextToken
      }
      createdAt
      updatedAt
      locationProdsNotAllowedId
      locationTemplateProdId
      productDependsId
      inventoryProductsId
    }
  }
`;
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
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
          locationProdsNotAllowedId
          locationTemplateProdId
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
          locationCustomProdId
          productAltPricingId
        }
        nextToken
      }
      createdAt
      updatedAt
      locationProdsNotAllowedId
      locationTemplateProdId
      productDependsId
      inventoryProductsId
    }
  }
`;
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
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
          locationProdsNotAllowedId
          locationTemplateProdId
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
          locationCustomProdId
          productAltPricingId
        }
        nextToken
      }
      createdAt
      updatedAt
      locationProdsNotAllowedId
      locationTemplateProdId
      productDependsId
      inventoryProductsId
    }
  }
`;
export const createZone = /* GraphQL */ `
  mutation CreateZone(
    $input: CreateZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    createZone(input: $input, condition: $condition) {
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
export const updateZone = /* GraphQL */ `
  mutation UpdateZone(
    $input: UpdateZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    updateZone(input: $input, condition: $condition) {
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
export const deleteZone = /* GraphQL */ `
  mutation DeleteZone(
    $input: DeleteZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    deleteZone(input: $input, condition: $condition) {
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
export const createLocationUser = /* GraphQL */ `
  mutation CreateLocationUser(
    $input: CreateLocationUserInput!
    $condition: ModelLocationUserConditionInput
  ) {
    createLocationUser(input: $input, condition: $condition) {
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
      locationSubsId
      userLocsId
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
      locationSubsId
      userLocsId
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
      locationSubsId
      userLocsId
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
        productDependsId
        inventoryProductsId
      }
      createdAt
      updatedAt
      locationCustomProdId
      productAltPricingId
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
        productDependsId
        inventoryProductsId
      }
      createdAt
      updatedAt
      locationCustomProdId
      productAltPricingId
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
        productDependsId
        inventoryProductsId
      }
      createdAt
      updatedAt
      locationCustomProdId
      productAltPricingId
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
export const createDoughComponent = /* GraphQL */ `
  mutation CreateDoughComponent(
    $input: CreateDoughComponentInput!
    $condition: ModelDoughComponentConditionInput
  ) {
    createDoughComponent(input: $input, condition: $condition) {
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
export const updateDoughComponent = /* GraphQL */ `
  mutation UpdateDoughComponent(
    $input: UpdateDoughComponentInput!
    $condition: ModelDoughComponentConditionInput
  ) {
    updateDoughComponent(input: $input, condition: $condition) {
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
export const deleteDoughComponent = /* GraphQL */ `
  mutation DeleteDoughComponent(
    $input: DeleteDoughComponentInput!
    $condition: ModelDoughComponentConditionInput
  ) {
    deleteDoughComponent(input: $input, condition: $condition) {
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
export const createInventory = /* GraphQL */ `
  mutation CreateInventory(
    $input: CreateInventoryInput!
    $condition: ModelInventoryConditionInput
  ) {
    createInventory(input: $input, condition: $condition) {
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
          locationProdsNotAllowedId
          locationTemplateProdId
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
export const updateInventory = /* GraphQL */ `
  mutation UpdateInventory(
    $input: UpdateInventoryInput!
    $condition: ModelInventoryConditionInput
  ) {
    updateInventory(input: $input, condition: $condition) {
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
          locationProdsNotAllowedId
          locationTemplateProdId
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
export const deleteInventory = /* GraphQL */ `
  mutation DeleteInventory(
    $input: DeleteInventoryInput!
    $condition: ModelInventoryConditionInput
  ) {
    deleteInventory(input: $input, condition: $condition) {
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
          locationProdsNotAllowedId
          locationTemplateProdId
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
export const createUnit = /* GraphQL */ `
  mutation CreateUnit(
    $input: CreateUnitInput!
    $condition: ModelUnitConditionInput
  ) {
    createUnit(input: $input, condition: $condition) {
      id
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
      id
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
      id
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
      id
      unitName
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
      id
      unitName
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
      id
      unitName
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
      id
      vendorName
      vendorNick
      createdAt
      updatedAt
      inventoryVendorsId
    }
  }
`;
export const updateVendor = /* GraphQL */ `
  mutation UpdateVendor(
    $input: UpdateVendorInput!
    $condition: ModelVendorConditionInput
  ) {
    updateVendor(input: $input, condition: $condition) {
      id
      vendorName
      vendorNick
      createdAt
      updatedAt
      inventoryVendorsId
    }
  }
`;
export const deleteVendor = /* GraphQL */ `
  mutation DeleteVendor(
    $input: DeleteVendorInput!
    $condition: ModelVendorConditionInput
  ) {
    deleteVendor(input: $input, condition: $condition) {
      id
      vendorName
      vendorNick
      createdAt
      updatedAt
      inventoryVendorsId
    }
  }
`;
export const createCroixCount = /* GraphQL */ `
  mutation CreateCroixCount(
    $input: CreateCroixCountInput!
    $condition: ModelCroixCountConditionInput
  ) {
    createCroixCount(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
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
export const updateCroixCount = /* GraphQL */ `
  mutation UpdateCroixCount(
    $input: UpdateCroixCountInput!
    $condition: ModelCroixCountConditionInput
  ) {
    updateCroixCount(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
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
export const deleteCroixCount = /* GraphQL */ `
  mutation DeleteCroixCount(
    $input: DeleteCroixCountInput!
    $condition: ModelCroixCountConditionInput
  ) {
    deleteCroixCount(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
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
export const createEODCount = /* GraphQL */ `
  mutation CreateEODCount(
    $input: CreateEODCountInput!
    $condition: ModelEODCountConditionInput
  ) {
    createEODCount(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
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
export const updateEODCount = /* GraphQL */ `
  mutation UpdateEODCount(
    $input: UpdateEODCountInput!
    $condition: ModelEODCountConditionInput
  ) {
    updateEODCount(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
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
export const deleteEODCount = /* GraphQL */ `
  mutation DeleteEODCount(
    $input: DeleteEODCountInput!
    $condition: ModelEODCountConditionInput
  ) {
    deleteEODCount(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
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
export const createPocketCount = /* GraphQL */ `
  mutation CreatePocketCount(
    $input: CreatePocketCountInput!
    $condition: ModelPocketCountConditionInput
  ) {
    createPocketCount(input: $input, condition: $condition) {
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
export const updatePocketCount = /* GraphQL */ `
  mutation UpdatePocketCount(
    $input: UpdatePocketCountInput!
    $condition: ModelPocketCountConditionInput
  ) {
    updatePocketCount(input: $input, condition: $condition) {
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
export const deletePocketCount = /* GraphQL */ `
  mutation DeletePocketCount(
    $input: DeletePocketCountInput!
    $condition: ModelPocketCountConditionInput
  ) {
    deletePocketCount(input: $input, condition: $condition) {
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
export const createActualSetOut = /* GraphQL */ `
  mutation CreateActualSetOut(
    $input: CreateActualSetOutInput!
    $condition: ModelActualSetOutConditionInput
  ) {
    createActualSetOut(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
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
export const updateActualSetOut = /* GraphQL */ `
  mutation UpdateActualSetOut(
    $input: UpdateActualSetOutInput!
    $condition: ModelActualSetOutConditionInput
  ) {
    updateActualSetOut(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
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
export const deleteActualSetOut = /* GraphQL */ `
  mutation DeleteActualSetOut(
    $input: DeleteActualSetOutInput!
    $condition: ModelActualSetOutConditionInput
  ) {
    deleteActualSetOut(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
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
export const createPackGroup = /* GraphQL */ `
  mutation CreatePackGroup(
    $input: CreatePackGroupInput!
    $condition: ModelPackGroupConditionInput
  ) {
    createPackGroup(input: $input, condition: $condition) {
      id
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
      id
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
      id
      packGroup
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
export const updateRoute = /* GraphQL */ `
  mutation UpdateRoute(
    $input: UpdateRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    updateRoute(input: $input, condition: $condition) {
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
export const deleteRoute = /* GraphQL */ `
  mutation DeleteRoute(
    $input: DeleteRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    deleteRoute(input: $input, condition: $condition) {
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
export const createOldDough = /* GraphQL */ `
  mutation CreateOldDough(
    $input: CreateOldDoughInput!
    $condition: ModelOldDoughConditionInput
  ) {
    createOldDough(input: $input, condition: $condition) {
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
export const updateOldDough = /* GraphQL */ `
  mutation UpdateOldDough(
    $input: UpdateOldDoughInput!
    $condition: ModelOldDoughConditionInput
  ) {
    updateOldDough(input: $input, condition: $condition) {
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
export const deleteOldDough = /* GraphQL */ `
  mutation DeleteOldDough(
    $input: DeleteOldDoughInput!
    $condition: ModelOldDoughConditionInput
  ) {
    deleteOldDough(input: $input, condition: $condition) {
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
export const createBucketInfo = /* GraphQL */ `
  mutation CreateBucketInfo(
    $input: CreateBucketInfoInput!
    $condition: ModelBucketInfoConditionInput
  ) {
    createBucketInfo(input: $input, condition: $condition) {
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
export const updateBucketInfo = /* GraphQL */ `
  mutation UpdateBucketInfo(
    $input: UpdateBucketInfoInput!
    $condition: ModelBucketInfoConditionInput
  ) {
    updateBucketInfo(input: $input, condition: $condition) {
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
export const deleteBucketInfo = /* GraphQL */ `
  mutation DeleteBucketInfo(
    $input: DeleteBucketInfoInput!
    $condition: ModelBucketInfoConditionInput
  ) {
    deleteBucketInfo(input: $input, condition: $condition) {
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
export const createInvoice = /* GraphQL */ `
  mutation CreateInvoice(
    $input: CreateInvoiceInput!
    $condition: ModelInvoiceConditionInput
  ) {
    createInvoice(input: $input, condition: $condition) {
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
export const updateInvoice = /* GraphQL */ `
  mutation UpdateInvoice(
    $input: UpdateInvoiceInput!
    $condition: ModelInvoiceConditionInput
  ) {
    updateInvoice(input: $input, condition: $condition) {
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
export const deleteInvoice = /* GraphQL */ `
  mutation DeleteInvoice(
    $input: DeleteInvoiceInput!
    $condition: ModelInvoiceConditionInput
  ) {
    deleteInvoice(input: $input, condition: $condition) {
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
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
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
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
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
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
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
        createdAt
        updatedAt
        locationProdsNotAllowedId
        locationTemplateProdId
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
