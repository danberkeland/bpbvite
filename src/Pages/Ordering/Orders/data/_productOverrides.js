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
  // AM North departs at 6.5; Pick Up Carlton starts at 6.75
  // So if we pick a readyTime inbetween, we can make it 
  // available for pickup but not early delivery.
  else if (product.prodNick === 'fic' && route.RouteDepart === 'Carlton') {
    overrides = { readyTime: 6.67 }
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