// values that are broadly used across many of the data files

/** Configures fetched data to be 'almost immutable' */
export const defaultSwrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true
}

export const LIMIT = 5000

export const TABLE_PKS = /** @type {const} */ ({ 
  Location:"locNick",
  User:"sub",
  LocationUser:"id",
  Product: "prodNick",
  DoughBackup: "id",
  DoughComponentBackup: "id",
  Order: "id",
  Standing: "id",
  Zone: "zoneNick",
  Route: "routeNick",
  ZoneRoute: "id",
  Training: "id",
})

export const LIST_TABLES = /** @type {const} */ ([
  "Location",
  "User",
  "LocationUser",
  "Product",
  "DoughBackup",
  "DoughComponentBackup",
  "Order",
  "Standing",
  "Zone",
  "Route",
  "ZoneRoute",
  "Training",
])

// ***Tables that have been set up so far***

// Location
// User 
// LocationUser
// Product
// DoughBackup
// DoughComponentBackup
// Order
// Standing
// Zone
// Route
// ZoneRoute
// Training


// ***Tables yet to be set up***

// ProdsNotAllowed
// TemplateProd
// AltPricing
// AltLeadTime

// ProductDepend
// LocationBackup
// ProductBackup
// OrderBackup
// StandingBackup
// RouteBackup
// ZoneBackup
// CreditApp
// RetailLoc
// RetailProdLoc
// PackGroup
// Dough
// BucketInfo
// PocketCount
// Inventory
// Unit
// InternalLoc
// IngType
// Vendor
// ProductVendor
// foQBAuth
// EODCount
// ActualSetOut
// CroixSheetCount
// OldDough
// Notes
// EventLog
