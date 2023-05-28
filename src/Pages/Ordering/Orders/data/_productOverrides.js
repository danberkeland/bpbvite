import { cloneDeep } from "lodash"

// Hard-coded overrides.  
//
// applyOverridesForRouteAssignment helps us handle edge cases where the
// database model doesn't allow.
//
// tempDBAttributeOverrides is for simulating different database values
// before submitting/commiting.

// This function hooks into product data just prior to assigning a route
export const applyOverridesForRouteAssignment = ({ 
  product, 
  location, 
  route 
}) => {

  let overrides = {}

  // Lincoln Exception
  const isLincoln = location.locNick === 'lincoln'
  const lincolnProductNeedsDelay = ['dtch', 'fr'].includes(product.prodNick)

  if (isLincoln && lincolnProductNeedsDelay) {
     overrides = { readyTime: 8.5 }
  }

  // Ficelles baked north:
  // AM North and Pick up Carlton departs at 6.75.
  // Want to allow pickup but not AM North
  else if (
    product.prodNick === 'fic' 
    && route.RouteDepart === 'Carlton'
    && route.routeNick !== 'Pick up Carlton'
  ) {
    overrides = { readyTime: 7 }
  }

  // // No ftmuff for south deliveries
  // else if (
  //   product.prodNick === 'ftmuff' 
  //   && route.RouteDepart === 'Prado'
  //   && route.routeNick !== "Pick up SLO"  
  // ) {
  //   overrides = { daysAvailable: [0,0,0,0,0,0,0] }
  // }

  return overrides

}


/** override base leadTimes before deploying new version */
export const tempDBAttributeOverrides = {
  ptz:  { leadTime: 2, readyTime: 8.5 }, // pretzel stuff
  pzb:  { leadTime: 2, readyTime: 8.5 },
  pzsl: { leadTime: 2, readyTime: 8.5 },
  pzst: { leadTime: 2, readyTime: 8.5 },
  unpz: { leadTime: 2, readyTime: 8.5 },
  rfr:  { leadTime: 1, readyTime: 9.5 }, // french
  cub:  { leadTime: 1, readyTime: 9.5 },
  mcub: { leadTime: 1, readyTime: 9.5 },
  ses:  { leadTime: 1, readyTime: 9.5 },
  sic:  { leadTime: 1, readyTime: 9.5 },
  zdog: { leadTime: 1, readyTime: 9.5 },
  bz:   { leadTime: 1, readyTime: 9.5 }, // brioche
  lgbz: { leadTime: 1, readyTime: 9.5 },
  brsl: { leadTime: 1, readyTime: 9.5 },
  foc:  { leadTime: 1, readyTime: 9.5 }, // focaccias
  hfoc: { leadTime: 1, readyTime: 9.5 },
  wwbz: { leadTime: 1, readyTime: 9.5 }, // whole wheat
  
  frpg: { leadTime: 2 },
}