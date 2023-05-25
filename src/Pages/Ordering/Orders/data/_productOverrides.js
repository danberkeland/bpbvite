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
    && route.routeDepart === 'Carlton'
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
  ptz: { leadTime: 2 },
  pzb: { leadTime: 2 },
  pzsl: { leadTime: 2 },
  pzst: { leadTime: 2 },
  unpz: { leadTime: 2 },
  frpg: { leadTime: 2 },
}