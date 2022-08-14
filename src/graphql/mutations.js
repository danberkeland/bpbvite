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
      phone
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
      phone
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
      phone
      createdAt
      updatedAt
    }
  }
`;
export const createLocation2 = /* GraphQL */ `
  mutation CreateLocation2(
    $input: CreateLocation2Input!
    $condition: ModelLocation2ConditionInput
  ) {
    createLocation2(input: $input, condition: $condition) {
      id
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
  }
`;
export const updateLocation2 = /* GraphQL */ `
  mutation UpdateLocation2(
    $input: UpdateLocation2Input!
    $condition: ModelLocation2ConditionInput
  ) {
    updateLocation2(input: $input, condition: $condition) {
      id
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
  }
`;
export const deleteLocation2 = /* GraphQL */ `
  mutation DeleteLocation2(
    $input: DeleteLocation2Input!
    $condition: ModelLocation2ConditionInput
  ) {
    deleteLocation2(input: $input, condition: $condition) {
      id
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
        phone
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
        phone
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
        phone
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
export const createLocationUser = /* GraphQL */ `
  mutation CreateLocationUser(
    $input: CreateLocationUserInput!
    $condition: ModelLocationUserConditionInput
  ) {
    createLocationUser(input: $input, condition: $condition) {
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
        phone
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
          phone
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
export const updateLocationUser = /* GraphQL */ `
  mutation UpdateLocationUser(
    $input: UpdateLocationUserInput!
    $condition: ModelLocationUserConditionInput
  ) {
    updateLocationUser(input: $input, condition: $condition) {
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
        phone
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
          phone
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
export const deleteLocationUser = /* GraphQL */ `
  mutation DeleteLocationUser(
    $input: DeleteLocationUserInput!
    $condition: ModelLocationUserConditionInput
  ) {
    deleteLocationUser(input: $input, condition: $condition) {
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
        phone
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
          phone
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
export const createRequest = /* GraphQL */ `
  mutation CreateRequest(
    $input: CreateRequestInput!
    $condition: ModelRequestConditionInput
  ) {
    createRequest(input: $input, condition: $condition) {
      id
      name
      loc
      createdAt
      updatedAt
    }
  }
`;
export const updateRequest = /* GraphQL */ `
  mutation UpdateRequest(
    $input: UpdateRequestInput!
    $condition: ModelRequestConditionInput
  ) {
    updateRequest(input: $input, condition: $condition) {
      id
      name
      loc
      createdAt
      updatedAt
    }
  }
`;
export const deleteRequest = /* GraphQL */ `
  mutation DeleteRequest(
    $input: DeleteRequestInput!
    $condition: ModelRequestConditionInput
  ) {
    deleteRequest(input: $input, condition: $condition) {
      id
      name
      loc
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
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
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
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
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
