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
  User2: "id",
  LocationUser:"id",
  LocationUser2: "id",
  Product: "prodNick",
  DoughBackup: "id",
  DoughComponentBackup: "id",
  Order: "id",
  Standing: "id",
  Zone: "zoneNick",
  Route: "routeNick",
  ZoneRoute: "id",
  Training: "id",
  InfoQBAuth: "id",
  TemplateProd: "id",
  ProdsNotAllowed: "id",
  AltPricing: "id",
  AltLeadTime: "id",
  Notes: "id",
  LocationProductOverride: "id",
})

export const LIST_TABLES = /** @type {const} */ ([
  "Location",
  "User",
  "User2",
  "LocationUser",
  "LocationUser2",
  "Product",
  "DoughBackup",
  "DoughComponentBackup",
  "Order",
  "Standing",
  "Zone",
  "Route",
  "ZoneRoute",
  "Training",
  "InfoQBAuth",
  "TemplateProd",
  "ProdsNotAllowed",
  "AltPricing",
  "AltLeadTime",
  "Notes",
  "LocationProductOverride"
])