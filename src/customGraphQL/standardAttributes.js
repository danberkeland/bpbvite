// our developing data fetching system relies on limiting GraphQL requests
// to a standard set of attributes for each table, spanning across queries,
// subscriptions, and mutations. In particular we avoid 'joining' data from
// multiple tables in our responses.

// We maintain our attribute specification here to supply to our custom queries.

export const doughBackupAttributes = /* GraphQL */ `
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

export const doughComponentBackupAttributes = /* GraphQL */ `
  id
  dough
  componentType
  componentName
  amount
  createdAt
  updatedAt
`

export const userAttributes = /* GraphQL */ `
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

export const locationAttributes = /* GraphQL */ `
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
  dfFulfill
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

export const productAttributes = /* GraphQL */ `
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

export const orderAttributes = /* GraphQL */ `
  Type
  id
  qty
  qtyShort
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
  delivFee
  isLate
  createdOn
  updatedOn
  updatedBy
  ttl
`

export const standingAttributes = /* GraphQL */ `
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

export const zoneAttributes = /* GraphQL */ ` 
  zoneNick
  zoneName
  description
  zoneFee
  createdAt
  updatedAt
`

export const routeAttributes = /* GraphQL */ ` 
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

export const infoQBAuthAttributes =/* GraphQL */ `
  id
  infoName
  infoContent
  createdAt
  updatedAt
`

export const notesAttributes = /* GraphQL */ `
  id
  note
  forWhom
  byWhom
  when
  createdAt
  updatedAt
`

export const templateProdAttributes = /* GraphQL */ `
  id
  locNick
  prodNick
  createdAt
  updatedAt
`

export const prodsNotAllowedAttributes = /* GraphQL */ `
  id
  isAllowed
  locNick
  prodNick
  createdAt
  updatedAt
`

export const zoneRouteAttributes = /* GraphQL */ `
  id
  routeNick
  zoneNick
  createdAt
  updatedAt
`

export const locationUserAttributes = /* GraphQL */ `
  id
  Type
  authType
  locNick
  sub
  createdAt
  updatedAt
`

export const altPricingAttributes = /* GraphQL */ `
  id
  wholePrice
  locNick
  prodNick
  createdAt
  updatedAt
`

export const altLeadTimeAttributes = /* GraphQL */ `
  id
  leadTime
  locNick
  prodNick
  createdAt
  updatedAt
`

export const trainingAttributes = /* GraphQL */ `
  id
  role
  order
  heading
  instruction
  createdAt
  updatedAt
`