// const listProductsForProduction = /* GraphQL */ `
//   query ListProducts(
//     # $prodNick: String
//     # $filter: ModelProductFilterInput
//     $limit: Int
//     # $nextToken: String
//     # $sortDirection: ModelSortDirection
//   ) {
//     listProducts(
//       # prodNick: $prodNick
//       # filter: $filter
//       limit: $limit
//       # nextToken: $nextToken
//       # sortDirection: $sortDirection
//     ) {
//       items {
//         prodName
//         prodNick
//         packGroup
//         packSize
//         doughNick # consider querying dough separately to avoid redundant data
//         # doughType {
//         #   doughNick
//         #   doughName
//         #   hydration
//         #   batchSize
//         #   mixedWhere
//         #   isBakeReady
//         #   buffer
//         #   saltInDry
//         #   createdAt
//         #   updatedAt
//         # }
//         # freezerThaw
//         # packGroupOrder
//         # shapeDay
//         # shapeNick
//         # bakeDay
//         bakeNick
//         guarantee
//         # transferStage
//         readyTime
//         bakedWhere
//         # wholePrice
//         # retailPrice
//         # isRetail
//         # retailName
//         # retailDescrip
//         # isWhole
//         # isEOD
//         weight
//         # descrip
//         # picURL
//         # squareID
//         # forBake
//         bakeExtra
//         batchSize
//         # defaultInclude
//         # leadTime
//         # qbID
//         currentStock
//         freezerClosing
//         freezerCount
//         freezerNorth
//         freezerNorthClosing
//         freezerNorthFlag
//         prepreshaped
//         preshaped
//         updatePreDate
//         # retailLoc {
//         #   nextToken
//         # }
//         # standing {
//         #   nextToken
//         # }
//         # orders {
//         #   nextToken
//         # }
//         # depends {
//         #   nextToken
//         # }
//         # altPricing {
//         #   nextToken
//         # }
//         # templateProd {
//         #   nextToken
//         # }
//         # prodsNotAllowed {
//         #   nextToken
//         # }
//         # productVendor {
//         #   nextToken
//         # }
//         # EODCount {
//         #   prodNick
//         #   shelfOrFreezer
//         #   startOrFinish
//         #   location
//         #   qty
//         #   whoCounted
//         #   createdAt
//         #   updatedAt
//         # }
//         # ActualSetOut {
//         #   prodNick
//         #   qty
//         #   location
//         #   whoSetOut
//         #   createdAt
//         #   updatedAt
//         # }
//         # altLeadTimeByLocation {
//         #   nextToken
//         # }
//         # createdAt
//         # updatedAt
//         # inventoryProductId
//       }
//       # nextToken
//     }
//   }
// `;
// const listLocations = /* GraphQL */ `
//   query ListLocations(
//     # $locNick: String
//     # $filter: ModelLocationFilterInput
//     $limit: Int
//     # $nextToken: String
//     # $sortDirection: ModelSortDirection
//   ) {
//     listLocations(
//       # locNick: $locNick
//       # filter: $filter
//       limit: $limit
//       # nextToken: $nextToken
//       # sortDirection: $sortDirection
//     ) {
//       items {
//         # Type
//         locNick
//         locName
//         # subs {
//         #   nextToken
//         # }
//         # standing {
//         #   nextToken
//         # }
//         # orders {
//         #   nextToken
//         # }
//         # ordersByDate {
//         #   nextToken
//         # }
//         # zoneNick
//         zone {
//           zoneNick
//           zoneName
//           # description
//           # zoneFee
//           # createdAt
//           # updatedAt
//         }
//         # creditApp {
//         #   id
//         #   firstName
//         #   lastName
//         #   companyName
//         #   phone
//         #   email
//         #   addr1
//         #   addr2
//         #   city
//         #   state
//         #   zip
//         #   locAddr1
//         #   locAddr2
//         #   locCity
//         #   locState
//         #   locZip
//         #   startDate
//         #   businessType
//         #   bankName
//         #   bankPhone
//         #   refName
//         #   refAddr1
//         #   refAddr2
//         #   refCity
//         #   refZip
//         #   refPhone
//         #   refEmail
//         #   refDescrip
//         #   signture
//         #   sigDate
//         #   sigName
//         #   sigTitle
//         #   createdAt
//         #   updatedAt
//         # }
//         # addr1
//         # addr2
//         # city
//         # zip
//         # email
//         # phone
//         # firstName
//         # lastName
//         # toBePrinted
//         # toBeEmailed
//         # printDuplicate
//         # terms
//         # invoicing
//         latestFirstDeliv
//         latestFinalDeliv
//         # webpageURL
//         # picURL
//         # gMap
//         # specialInstructions
//         delivOrder
//         # qbID
//         # currentBalance
//         # isActive
//         # prodsNotAllowed {
//         #   nextToken
//         # }
//         # customProd {
//         #   nextToken
//         # }
//         # templateProd {
//         #   nextToken
//         # }
//         # altLeadTimeByProduct {
//         #   nextToken
//         # }
//         # createdAt
//         # updatedAt
//         # locationCreditAppId
//       }
//       nextToken
//     }
//   }
// `;
// const listRoutes = /* GraphQL */ `
//   query ListRoutes(
//     # $routeNick: String
//     # $filter: ModelRouteFilterInput
//     $limit: Int
//     # $nextToken: String
//     # $sortDirection: ModelSortDirection
//   ) {
//     listRoutes(
//       # routeNick: $routeNick
//       # filter: $filter
//       limit: $limit
//       # nextToken: $nextToken
//       # sortDirection: $sortDirection
//     ) {
//       items {
//         routeNick
//         routeName
//         routeStart
//         routeTime
//         RouteDepart
//         RouteArrive
//         RouteSched
//         # printOrder
//         # driver
//         # zoneRoute {
//         #   nextToken
//         # }
//         # createdAt
//         # updatedAt
//       }
//       # nextToken
//     }
//   }
// `;
// const listZoneRoutes = /* GraphQL */ `
//   query ListZoneRoutes(
//     # $filter: ModelZoneRouteFilterInput
//     $limit: Int
//     # $nextToken: String
//   ) {
//     listZoneRoutes(
//       # filter: $filter, 
//       limit: $limit, 
//       # nextToken: $nextToken
//     ) {
//       items {
//         # id
//         routeNick
//         # route {
//         #   routeNick
//         #   routeName
//         #   routeStart
//         #   routeTime
//         #   RouteDepart
//         #   RouteArrive
//         #   RouteSched
//         #   printOrder
//         #   driver
//         #   createdAt
//         #   updatedAt
//         # }
//         zoneNick
//         # zone {
//         #   zoneNick
//         #   zoneName
//         #   description
//         #   zoneFee
//         #   createdAt
//         #   updatedAt
//         # }
//         # createdAt
//         # updatedAt
//       }
//       # nextToken
//     }
//   }
// `;
// const orderByLocByDelivDate = /* GraphQL */ `
//   query OrderByDelivDate(
//     $delivDate: String!
//     # $sortDirection: ModelSortDirection
//     # $filter: ModelOrderFilterInput
//     $limit: Int
//     # $nextToken: String
//   ) {
//     orderByLocByDelivDate(
//       # locNick: $locNick
//       delivDate: $delivDate
//       # sortDirection: $sortDirection
//       # filter: $filter
//       limit: $limit
//       # nextToken: $nextToken
//     ) {
//       items {
//         # Type
//         # id
//         qty
//         # qtyUpdatedOn
//         # sameDayMaxQty
//         prodNick
//         # product {
//         #   Type
//         #   prodName
//         #   prodNick
//         #   packGroup
//         #   packSize
//         #   doughNick
//         #   freezerThaw
//         #   packGroupOrder
//         #   shapeDay
//         #   shapeNick
//         #   bakeDay
//         #   bakeNick
//         #   guarantee
//         #   transferStage
//         #   readyTime
//         #   bakedWhere
//         #   wholePrice
//         #   retailPrice
//         #   isRetail
//         #   retailName
//         #   retailDescrip
//         #   isWhole
//         #   isEOD
//         #   weight
//         #   descrip
//         #   picURL
//         #   squareID
//         #   forBake
//         #   bakeExtra
//         #   batchSize
//         #   defaultInclude
//         #   leadTime
//         #   qbID
//         #   currentStock
//         #   freezerClosing
//         #   freezerCount
//         #   freezerNorth
//         #   freezerNorthClosing
//         #   freezerNorthFlag
//         #   prepreshaped
//         #   preshaped
//         #   updatePreDate
//         #   createdAt
//         #   updatedAt
//         #   inventoryProductId
//         # }
//         # locNick
//         # location {
//         #   Type
//         #   locNick
//         #   locName
//         #   zoneNick
//         #   addr1
//         #   addr2
//         #   city
//         #   zip
//         #   email
//         #   phone
//         #   firstName
//         #   lastName
//         #   toBePrinted
//         #   toBeEmailed
//         #   printDuplicate
//         #   terms
//         #   invoicing
//         #   latestFirstDeliv
//         #   latestFinalDeliv
//         #   webpageURL
//         #   picURL
//         #   gMap
//         #   specialInstructions
//         #   delivOrder
//         #   qbID
//         #   currentBalance
//         #   isActive
//         #   createdAt
//         #   updatedAt
//         #   locationCreditAppId
//         # }
//         # ItemNote
//         # SO
//         isWhole
//         # delivDate
//         # rate
//         route
//         # isLate
//         # createdOn
//         # updatedOn
//         # updatedBy
//         # ttl
//       }
//       # nextToken
//     }
//   }
// `;
// export const standingByDayOfWeek = /* GraphQL */ `
//   query StandingByDayOfWeek(
//     $dayOfWeek: String!
//     # $sortDirection: ModelSortDirection
//     # $filter: ModelStandingFilterInput
//     $limit: Int
//     # $nextToken: String
//   ) {
//     standingByDayOfWeek(
//       dayOfWeek: $dayOfWeek
//       # sortDirection: $sortDirection
//       # filter: $filter
//       limit: $limit
//       # nextToken: $nextToken
//     ) {
//       items {
//         # id
//         locNick
//         # location {
//         #   Type
//         #   locNick
//         #   locName
//         #   zoneNick
//         #   addr1
//         #   addr2
//         #   city
//         #   zip
//         #   email
//         #   phone
//         #   firstName
//         #   lastName
//         #   toBePrinted
//         #   toBeEmailed
//         #   printDuplicate
//         #   terms
//         #   invoicing
//         #   latestFirstDeliv
//         #   latestFinalDeliv
//         #   webpageURL
//         #   picURL
//         #   gMap
//         #   specialInstructions
//         #   delivOrder
//         #   qbID
//         #   currentBalance
//         #   isActive
//         #   createdAt
//         #   updatedAt
//         #   locationCreditAppId
//         # }
//         isWhole
//         isStand
//         dayOfWeek
//         route
//         prodNick
//         # product {
//         #   Type
//         #   prodName
//         #   prodNick
//         #   packGroup
//         #   packSize
//         #   doughNick
//         #   freezerThaw
//         #   packGroupOrder
//         #   shapeDay
//         #   shapeNick
//         #   bakeDay
//         #   bakeNick
//         #   guarantee
//         #   transferStage
//         #   readyTime
//         #   bakedWhere
//         #   wholePrice
//         #   retailPrice
//         #   isRetail
//         #   retailName
//         #   retailDescrip
//         #   isWhole
//         #   isEOD
//         #   weight
//         #   descrip
//         #   picURL
//         #   squareID
//         #   forBake
//         #   bakeExtra
//         #   batchSize
//         #   defaultInclude
//         #   leadTime
//         #   qbID
//         #   currentStock
//         #   freezerClosing
//         #   freezerCount
//         #   freezerNorth
//         #   freezerNorthClosing
//         #   freezerNorthFlag
//         #   prepreshaped
//         #   preshaped
//         #   updatePreDate
//         #   createdAt
//         #   updatedAt
//         #   inventoryProductId
//         # }
//         qty
//         # ItemNote
//         # startDate
//         # endDate
//         # createdAt
//         # updatedAt
//         # updatedBy
//       }
//       # nextToken
//     }
//   }
// `;


// const productQuery = /* GraphQL */ `
//   listProducts(limit: $limit) {
//     items {
//       prodName
//       prodNick
//       packGroup
//       packSize
//       doughNick
//       bakeNick
//       forBake
//       guarantee
//       readyTime
//       bakedWhere
//       weight
//       bakeExtra
//       batchSize
//       currentStock
//       freezerClosing
//       freezerCount
//       freezerNorth
//       freezerNorthClosing
//       freezerNorthFlag
//       prepreshaped
//       preshaped
//       updatePreDate
//     }
//   }
// `;
// const locationQuery = /* GraphQL */ `
//   listLocations(
//     limit: $limit
//   ) {
//     items {
//       locNick
//       locName
//       zoneNick
//       # zone {
//       #   zoneNick
//       #   zoneName
//       # }
//       latestFirstDeliv
//       latestFinalDeliv
//       delivOrder
//     }
//     nextToken
//   }
// `;
// const routeQuery = /* GraphQL */ `
//   listRoutes(
//     limit: $limit
//   ) {
//     items {
//       routeNick
//       routeName
//       routeStart
//       routeTime
//       RouteDepart
//       RouteArrive
//       RouteSched
//       printOrder
//       driver
//     }
//   }
// `;
// const zoneQuery = /* GraphQL */ ` 
//   listZones(
//     limit: $limit
//   ) {
//     items {
//       zoneNick
//       zoneName
//       description
//       zoneFee
//       # zoneRoute {
//       #   nextToken
//       # }
//       createdAt
//       updatedAt
//     }
//   }
// `;
// const orderQuery = /* GraphQL */ `
//   orderByDelivDate(
//     delivDate: $delivDate
//     limit: $limit
//   ) {
//     items {
//       id
//       isWhole
//       locNick
//       prodNick
//       route
//       qty
//     }
//   }
// `;
// const standingQuery = /* GraphQL */ `
//   standingByDayOfWeek(
//     dayOfWeek: $dayOfWeek
//     limit: $limit
//   ) {
//     items {
//       id
//       isStand
//       isWhole
//       locNick
//       prodNick
//       route
//       qty
//     }
//     nextToken
//   }
// `;

// const zoneRouteQuery = /* GraphQL */ `
//     listZoneRoutes(
//       limit: $limit
//     ) {
//       items {
//         routeNick
//         zoneNick
//       }
//     }
// `;

// const doughQuery = /* GraphQL */ `
//   listDoughs(limit: $limit) {
//     items {
//       doughNick
//       doughName
//       hydration
//       batchSize
//       mixedWhere
//       bucketSets
//       preBucketSets
//       updatePreBucket
//       isBakeReady
//       buffer
//       saltInDry
//       createdAt
//       updatedAt
//     }
//   }
// `;

// export const doughBackupQuery = /* GraphQL */ `
//   listDoughBackups(limit: $limit) {
//     items {
//       batchSize
//       bucketSets
//       buffer
//       components
//       createdAt
//       doughName
//       hydration
//       id
//       isBakeReady
//       mixedWhere
//       oldDough
//       preBucketSets
//       process
//       saltInDry
//       updatePreBucket
//       updatedAt
//     }
//   }
// `;

// const doughComponentQuery = /* GraphQL */ `
//   listDoughComponentBackups(limit: $limit) {
//     items {
//       id
//       dough
//       componentType
//       componentName
//       amount
//       createdAt
//       updatedAt
//     }
//   }
// `;

// // *********************
// // * Depreciated Query *
// // *********************

// export const getProductionDataByDate = /* GraphQL */ `
//   query GetProductionDataByDate(
//     $delivDate: String!
//     $dayOfWeek: String!
//     $limit: Int
//   ) {
//     ${productQuery}
//     ${locationQuery}
//     ${routeQuery}
//     ${zoneRouteQuery}
//     ${orderQuery}
//     ${standingQuery}
//     ${doughComponentQuery}
//   }
// `;

// // *******************
// // * Current Queries *
// // *******************

// export const getAllOrdersByDate = /* GraphQL */ `
//   query GetProductionDataByDate(
//     $delivDate: String!
//     $dayOfWeek: String!
//     $limit: Int
//   ) {
//     ${orderQuery}
//     ${standingQuery}
//   }
// `;

// export const getDimensionData = /* GraphQL */ `
//   query GetZonesAndRoutes(
//     $limit: Int
//   ) {
//     ${productQuery}
//     ${locationQuery}
//     ${zoneQuery}
//     ${routeQuery}
//     ${zoneRouteQuery}
//     ${doughBackupQuery}
//     ${doughComponentQuery}
//   }
// `;


