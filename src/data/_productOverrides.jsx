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
  const lincolnProductNeedsDelay = ['dtch', 'fr'].includes(product.prodNick)

  if (location.locNick === 'lincoln' && lincolnProductNeedsDelay) {
     overrides = { readyTime: 8.5 }
  }

  // Ficelles baked north:
  // AM North and Pick up Carlton departs at 6.75.
  // Want to allow pickup but not AM North
  else if (
    product.prodNick === 'fic' 
    && route.RouteDepart === 'Carlton'
    //&& route.routeNick !== 'Pick up Carlton'
  ) {
    overrides = { readyTime: 9 }
  }

  else if (
    product.prodNick === 'fic' 
    && ['cpr', 'field'].includes(location.locNick)
  ) {
    overrides = { readyTime: 6 }
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


// shelf breads with readyTime: 15 have their lead time reduced by 1.

/** test behavior with different attribute settings before committing */
export const preDBOverrides = {
  fr:	   { leadTime: 1 },                  // french
  rfr:	 { leadTime: 1 },
  cub:	 { leadTime: 1 },
  mcub:	 { leadTime: 1 },
  ses:	 { leadTime: 2 },
  zdog:	 { leadTime: 1 },
  bz:	   { leadTime: 1 },

  lgbz:	 { leadTime: 1 },                  // brioche
  brsl:	 { leadTime: 1 },
  bri:	 { leadTime: 1 },

  wwbz:	 { leadTime: 2 },                  // WW

  hok:	 { leadTime: 2 },                  // doobie

  sic:	 { leadTime: 1 },                  // sic

  foc:	 { leadTime: 1 },                  // focaccias
  hfoc:	 { leadTime: 2 },

  smpz:	 { leadTime: 2, readyTime: 8.2 },  // pretzel
  lgpz:	 { leadTime: 2, readyTime: 8.2 },
  pzb:	 { leadTime: 2, readyTime: 8.2 },
  pzsl:	 { leadTime: 2, readyTime: 8.2 },
  ptz:	 { leadTime: 2, readyTime: 8.2 },
  pzst:	 { leadTime: 2, readyTime: 8.2 },
  unpz:	 { leadTime: 2, readyTime: 8.2 },

  frpl:  { leadTime: 1, readyTime: 20  },  // frozen croix
  frch:  { leadTime: 1, readyTime: 20  },
  frpg:  { leadTime: 1, readyTime: 20  },
  frsf:  { leadTime: 1, readyTime: 20  },
  frmni: { leadTime: 1, readyTime: 20  },
  fral:  { leadTime: 1, readyTime: 20  },

  bb:    { readyTime: 5 },                 // non-croix baked pastries
  sco:   { readyTime: 5 },
  bd:    { readyTime: 5 },
  brn:   { readyTime: 5 },

  bdrd:  { isWhole: true },

}

// for mocking up test values for standard db overrides ("overrides of overrides")
export const postDBOverrides = {
  "high#lgbz": { leadTime: 0 },
  "high#wwbz": { leadTime: 0 },
  'high#sic': { leadTime: 0 },
  'high#hok': { leadTime: 0 },

  'hios#hok': { leadTime: 0 },
  'hios#sic': { leadTime: 0 },
  'hios#wwbz': { leadTime: 0 },
}

// changing carlton pickup duration so that it properly overlaps with
// product availability by readyTime
export const getRouteOverridesForAssignment = ({
  product, 
  location, 
  route 
}) => {
  let overrides = {}
  if (route?.routeNick === "Pick up Carlton") {
    overrides = { routeStart: 6.75, routeTime: 4}
  }

  return overrides
}