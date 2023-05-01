const doughBackupAttributes = /* GraphQL */ `
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
`
export const createDoughBackup = /* GraphQL */ `
  mutation CreateDoughBackup(
    $input: CreateDoughBackupInput!
    $condition: ModelDoughBackupConditionInput
  ) {
    createDoughBackup(input: $input, condition: $condition) {
      ${doughBackupAttributes}
    }
  }
`;
export const updateDoughBackup = /* GraphQL */ `
  mutation UpdateDoughBackup(
    $input: UpdateDoughBackupInput!
    $condition: ModelDoughBackupConditionInput
  ) {
    updateDoughBackup(input: $input, condition: $condition) {
      ${doughBackupAttributes}
    }
  }
`;
export const deleteDoughBackup = /* GraphQL */ `
  mutation DeleteDoughBackup(
    $input: DeleteDoughBackupInput!
    $condition: ModelDoughBackupConditionInput
  ) {
    deleteDoughBackup(input: $input, condition: $condition) {
      ${doughBackupAttributes}
    }
  }
`;

const doughComponentBackupAttributes = /* GraphQL */ `
  id
  dough
  componentType
  componentName
  amount
  createdAt
  updatedAt
`
export const createDoughComponentBackup = /* GraphQL */ `
  mutation CreateDoughComponentBackup(
    $input: CreateDoughComponentBackupInput!
    $condition: ModelDoughComponentBackupConditionInput
  ) {
    createDoughComponentBackup(input: $input, condition: $condition) {
      ${doughComponentBackupAttributes}
    }
  }
`;
export const updateDoughComponentBackup = /* GraphQL */ `
  mutation UpdateDoughComponentBackup(
    $input: UpdateDoughComponentBackupInput!
    $condition: ModelDoughComponentBackupConditionInput
  ) {
    updateDoughComponentBackup(input: $input, condition: $condition) {
      ${doughComponentBackupAttributes}
    }
  }
`;
export const deleteDoughComponentBackup = /* GraphQL */ `
  mutation DeleteDoughComponentBackup(
    $input: DeleteDoughComponentBackupInput!
    $condition: ModelDoughComponentBackupConditionInput
  ) {
    deleteDoughComponentBackup(input: $input, condition: $condition) {
      ${doughComponentBackupAttributes}
    }
  }
`;

const userAttributes = /* GraphQL */ `
  name
  email
  username
  phone
  authClass
  sub
  locNick
  createdAt
  updatedAt
`

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      ${userAttributes}
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      ${userAttributes}
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      ${userAttributes}
    }
  }
`;

const locationAttributes = /* GraphQL */ `
  Type
  locNick
  locName
  zoneNick
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
  createdAt
  updatedAt
  locationCreditAppId
`
export const createLocation = /* GraphQL */ `
  mutation CreateLocation(
    $input: CreateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    createLocation(input: $input, condition: $condition) {
      ${locationAttributes}
    }
  }
`;
export const updateLocation = /* GraphQL */ `
  mutation UpdateLocation(
    $input: UpdateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    updateLocation(input: $input, condition: $condition) {
      ${locationAttributes}
    }
  }
`;
export const deleteLocation = /* GraphQL */ `
  mutation DeleteLocation(
    $input: DeleteLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    deleteLocation(input: $input, condition: $condition) {
      ${locationAttributes}
    }
  }
`;

const productAttributes = /* GraphQL */ `
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
`
export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
      ${productAttributes}
    }
  }
`;
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
      ${productAttributes}
    }
  }
`;
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
      ${productAttributes}
    }
  }
`;

const orderAttributes = /* GraphQL */ `
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
`
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
      ${orderAttributes}
    }
  }
`;
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
      ${orderAttributes}
    }
  }
`;
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
      ${orderAttributes}
    }
  }
`;
const standingAttributes = /* GraphQL */ `
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
`
export const createStanding = /* GraphQL */ `
  mutation CreateStanding(
    $input: CreateStandingInput!
    $condition: ModelStandingConditionInput
  ) {
    createStanding(input: $input, condition: $condition) {
      ${standingAttributes}
    }
  }
`;
export const updateStanding = /* GraphQL */ `
  mutation UpdateStanding(
    $input: UpdateStandingInput!
    $condition: ModelStandingConditionInput
  ) {
    updateStanding(input: $input, condition: $condition) {
      ${standingAttributes}
    }
  }
`;
export const deleteStanding = /* GraphQL */ `
  mutation DeleteStanding(
    $input: DeleteStandingInput!
    $condition: ModelStandingConditionInput
  ) {
    deleteStanding(input: $input, condition: $condition) {
      ${standingAttributes}
    }
  }
`;

const zoneAttributes = /* GraphQL */ ` 
  zoneNick
  zoneName
  description
  zoneFee
  createdAt
  updatedAt
`
export const createZone = /* GraphQL */ `
  mutation CreateZone(
    $input: CreateZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    createZone(input: $input, condition: $condition) {
      ${zoneAttributes}
    }
  }
`;
export const updateZone = /* GraphQL */ `
  mutation UpdateZone(
    $input: UpdateZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    updateZone(input: $input, condition: $condition) {
      ${zoneAttributes}
    }
  }
`;
export const deleteZone = /* GraphQL */ `
  mutation DeleteZone(
    $input: DeleteZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    deleteZone(input: $input, condition: $condition) {
      ${zoneAttributes}
    }
  }
`;

const routeAttributes = /* GraphQL */ ` 
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
`
export const createRoute = /* GraphQL */ `
  mutation CreateRoute(
    $input: CreateRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    createRoute(input: $input, condition: $condition) {
      ${routeAttributes}
    }
  }
`;
export const updateRoute = /* GraphQL */ `
  mutation UpdateRoute(
    $input: UpdateRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    updateRoute(input: $input, condition: $condition) {
      ${routeAttributes}
    }
  }
`;
export const deleteRoute = /* GraphQL */ `
  mutation DeleteRoute(
    $input: DeleteRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    deleteRoute(input: $input, condition: $condition) {
      ${routeAttributes}
    }
  }
`;

const infoQBAuthAttributes =/* GraphQL */ `
  id
  infoName
  infoContent
  createdAt
  updatedAt
`
export const createInfoQBAuth = /* GraphQL */ `
  mutation CreateInfoQBAuth(
    $input: CreateInfoQBAuthInput!
    $condition: ModelInfoQBAuthConditionInput
  ) {
    createInfoQBAuth(input: $input, condition: $condition) {
      ${infoQBAuthAttributes}
    }
  }
`;
export const updateInfoQBAuth = /* GraphQL */ `
  mutation UpdateInfoQBAuth(
    $input: UpdateInfoQBAuthInput!
    $condition: ModelInfoQBAuthConditionInput
  ) {
    updateInfoQBAuth(input: $input, condition: $condition) {
      ${infoQBAuthAttributes}
    }
  }
`;
export const deleteInfoQBAuth = /* GraphQL */ `
  mutation DeleteInfoQBAuth(
    $input: DeleteInfoQBAuthInput!
    $condition: ModelInfoQBAuthConditionInput
  ) {
    deleteInfoQBAuth(input: $input, condition: $condition) {
      ${infoQBAuthAttributes}
    }
  }
`;

const notesAttributes = /* GraphQL */ `
  id
  note
  forWhom
  byWhom
  when
  createdAt
  updatedAt
`
export const createNotes = /* GraphQL */ `
  mutation CreateNotes(
    $input: CreateNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    createNotes(input: $input, condition: $condition) {
      ${notesAttributes}
    }
  }
`;
export const updateNotes = /* GraphQL */ `
  mutation UpdateNotes(
    $input: UpdateNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    updateNotes(input: $input, condition: $condition) {
      ${notesAttributes}
    }
  }
`;
export const deleteNotes = /* GraphQL */ `
  mutation DeleteNotes(
    $input: DeleteNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    deleteNotes(input: $input, condition: $condition) {
      ${notesAttributes}
    }
  }
`;

const templateProdAttributes = /* GraphQL */ `
  id
  locNick
  prodNick
  createdAt
  updatedAt
`
export const createTemplateProd = /* GraphQL */ `
  mutation CreateTemplateProd(
    $input: CreateTemplateProdInput!
    $condition: ModelTemplateProdConditionInput
  ) {
    createTemplateProd(input: $input, condition: $condition) {
      ${templateProdAttributes}
    }
  }
`;
export const updateTemplateProd = /* GraphQL */ `
  mutation UpdateTemplateProd(
    $input: UpdateTemplateProdInput!
    $condition: ModelTemplateProdConditionInput
  ) {
    updateTemplateProd(input: $input, condition: $condition) {
      ${templateProdAttributes}
    }
  }
`;
export const deleteTemplateProd = /* GraphQL */ `
  mutation DeleteTemplateProd(
    $input: DeleteTemplateProdInput!
    $condition: ModelTemplateProdConditionInput
  ) {
    deleteTemplateProd(input: $input, condition: $condition) {
      ${templateProdAttributes}
    }
  }
`;

const prodsNotAllowedAttributes = /* GraphQL */ `
  id
  isAllowed
  locNick
  prodNick
  createdAt
  updatedAt
`
export const createProdsNotAllowed = /* GraphQL */ `
  mutation CreateProdsNotAllowed(
    $input: CreateProdsNotAllowedInput!
    $condition: ModelProdsNotAllowedConditionInput
  ) {
    createProdsNotAllowed(input: $input, condition: $condition) {
      ${prodsNotAllowedAttributes}
    }
  }
`;
export const updateProdsNotAllowed = /* GraphQL */ `
  mutation UpdateProdsNotAllowed(
    $input: UpdateProdsNotAllowedInput!
    $condition: ModelProdsNotAllowedConditionInput
  ) {
    updateProdsNotAllowed(input: $input, condition: $condition) {
      ${prodsNotAllowedAttributes}
    }
  }
`;
export const deleteProdsNotAllowed = /* GraphQL */ `
  mutation DeleteProdsNotAllowed(
    $input: DeleteProdsNotAllowedInput!
    $condition: ModelProdsNotAllowedConditionInput
  ) {
    deleteProdsNotAllowed(input: $input, condition: $condition) {
      ${prodsNotAllowedAttributes}
    }
  }
`;

const zoneRouteAttributes = /* GraphQL */ `
  id
  routeNick
  zoneNick
  createdAt
  updatedAt
`

export const createZoneRoute = /* GraphQL */ `
  mutation CreateZoneRoute(
    $input: CreateZoneRouteInput!
    $condition: ModelZoneRouteConditionInput
  ) {
    createZoneRoute(input: $input, condition: $condition) {
      ${zoneRouteAttributes}
    }
  }
`;
export const updateZoneRoute = /* GraphQL */ `
  mutation UpdateZoneRoute(
    $input: UpdateZoneRouteInput!
    $condition: ModelZoneRouteConditionInput
  ) {
    updateZoneRoute(input: $input, condition: $condition) {
      ${zoneRouteAttributes}
    }
  }
`;
export const deleteZoneRoute = /* GraphQL */ `
  mutation DeleteZoneRoute(
    $input: DeleteZoneRouteInput!
    $condition: ModelZoneRouteConditionInput
  ) {
    deleteZoneRoute(input: $input, condition: $condition) {
      ${zoneRouteAttributes}
    }
  }
`;

const locationUserAttributes = /* GraphQL */ `
  id
  Type
  authType
  locNick
  sub
  createdAt
  updatedAt
`
export const createLocationUser = /* GraphQL */ `
  mutation CreateLocationUser(
    $input: CreateLocationUserInput!
    $condition: ModelLocationUserConditionInput
  ) {
    createLocationUser(input: $input, condition: $condition) {
      ${locationUserAttributes}
    }
  }
`;
export const updateLocationUser = /* GraphQL */ `
  mutation UpdateLocationUser(
    $input: UpdateLocationUserInput!
    $condition: ModelLocationUserConditionInput
  ) {
    updateLocationUser(input: $input, condition: $condition) {
      ${locationUserAttributes}
    }
  }
`;
export const deleteLocationUser = /* GraphQL */ `
  mutation DeleteLocationUser(
    $input: DeleteLocationUserInput!
    $condition: ModelLocationUserConditionInput
  ) {
    deleteLocationUser(input: $input, condition: $condition) {
      ${locationUserAttributes}
    }
  }
`;

const altPricingAttributes = /* GraphQL */ `
  id
  wholePrice
  locNick
  prodNick
  createdAt
  updatedAt
`
export const createAltPricing = /* GraphQL */ `
  mutation CreateAltPricing(
    $input: CreateAltPricingInput!
    $condition: ModelAltPricingConditionInput
  ) {
    createAltPricing(input: $input, condition: $condition) {
      ${altPricingAttributes}
    }
  }
`;
export const updateAltPricing = /* GraphQL */ `
  mutation UpdateAltPricing(
    $input: UpdateAltPricingInput!
    $condition: ModelAltPricingConditionInput
  ) {
    updateAltPricing(input: $input, condition: $condition) {
      ${altPricingAttributes}
    }
  }
`;
export const deleteAltPricing = /* GraphQL */ `
  mutation DeleteAltPricing(
    $input: DeleteAltPricingInput!
    $condition: ModelAltPricingConditionInput
  ) {
    deleteAltPricing(input: $input, condition: $condition) {
      ${altPricingAttributes}
    }
  }
`;

const altLeadTimeAttributes = /* GraphQL */ `
  id
  leadTime
  locNick
  prodNick
  createdAt
  updatedAt
`
export const createAltLeadTime = /* GraphQL */ `
  mutation CreateAltLeadTime(
    $input: CreateAltLeadTimeInput!
    $condition: ModelAltLeadTimeConditionInput
  ) {
    createAltLeadTime(input: $input, condition: $condition) {
      ${altLeadTimeAttributes}
    }
  }
`;
export const updateAltLeadTime = /* GraphQL */ `
  mutation UpdateAltLeadTime(
    $input: UpdateAltLeadTimeInput!
    $condition: ModelAltLeadTimeConditionInput
  ) {
    updateAltLeadTime(input: $input, condition: $condition) {
      ${altLeadTimeAttributes}
    }
  }
`;
export const deleteAltLeadTime = /* GraphQL */ `
  mutation DeleteAltLeadTime(
    $input: DeleteAltLeadTimeInput!
    $condition: ModelAltLeadTimeConditionInput
  ) {
    deleteAltLeadTime(input: $input, condition: $condition) {
      ${altLeadTimeAttributes}
    }
  }
`;

const trainingAttributes = /* GraphQL */ `
  id
  role
  order
  heading
  instruction
  createdAt
  updatedAt
`
export const createTraining = /* GraphQL */ `
  mutation CreateTraining(
    $input: CreateTrainingInput!
    $condition: ModelTrainingConditionInput
  ) {
    createTraining(input: $input, condition: $condition) {
      ${trainingAttributes}
    }
  }
`;
export const updateTraining = /* GraphQL */ `
  mutation UpdateTraining(
    $input: UpdateTrainingInput!
    $condition: ModelTrainingConditionInput
  ) {
    updateTraining(input: $input, condition: $condition) {
      ${trainingAttributes}
    }
  }
`;
export const deleteTraining = /* GraphQL */ `
  mutation DeleteTraining(
    $input: DeleteTrainingInput!
    $condition: ModelTrainingConditionInput
  ) {
    deleteTraining(input: $input, condition: $condition) {
      ${trainingAttributes}
    }
  }
`;