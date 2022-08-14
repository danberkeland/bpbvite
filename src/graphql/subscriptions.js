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
export const onUpdateLocation = /* GraphQL */ `
  subscription OnUpdateLocation($filter: ModelSubscriptionLocationFilterInput) {
    onUpdateLocation(filter: $filter) {
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
export const onDeleteLocation = /* GraphQL */ `
  subscription OnDeleteLocation($filter: ModelSubscriptionLocationFilterInput) {
    onDeleteLocation(filter: $filter) {
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
export const onCreateLocation2 = /* GraphQL */ `
  subscription OnCreateLocation2 {
    onCreateLocation2 {
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
export const onUpdateLocation2 = /* GraphQL */ `
  subscription OnUpdateLocation2 {
    onUpdateLocation2 {
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
export const onDeleteLocation2 = /* GraphQL */ `
  subscription OnDeleteLocation2 {
    onDeleteLocation2 {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateLocationUser = /* GraphQL */ `
  subscription OnCreateLocationUser(
    $filter: ModelSubscriptionLocationUserFilterInput
  ) {
    onCreateLocationUser(filter: $filter) {
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
export const onUpdateLocationUser = /* GraphQL */ `
  subscription OnUpdateLocationUser(
    $filter: ModelSubscriptionLocationUserFilterInput
  ) {
    onUpdateLocationUser(filter: $filter) {
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
export const onDeleteLocationUser = /* GraphQL */ `
  subscription OnDeleteLocationUser(
    $filter: ModelSubscriptionLocationUserFilterInput
  ) {
    onDeleteLocationUser(filter: $filter) {
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
export const onCreateRequest = /* GraphQL */ `
  subscription OnCreateRequest($filter: ModelSubscriptionRequestFilterInput) {
    onCreateRequest(filter: $filter) {
      id
      name
      loc
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRequest = /* GraphQL */ `
  subscription OnUpdateRequest($filter: ModelSubscriptionRequestFilterInput) {
    onUpdateRequest(filter: $filter) {
      id
      name
      loc
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRequest = /* GraphQL */ `
  subscription OnDeleteRequest($filter: ModelSubscriptionRequestFilterInput) {
    onDeleteRequest(filter: $filter) {
      id
      name
      loc
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct {
    onCreateProduct {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct {
    onUpdateProduct {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct {
    onDeleteProduct {
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
