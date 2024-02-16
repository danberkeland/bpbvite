// Hard-coded overrides.  

// This function hooks into product data just prior to assigning a route
export const applyOverridesForRouteAssignment = ({ 
  product, 
  location, 
  route 
}) => {

  let overrides = {}

  // Ficelles baked north:
  // AM North and Pick up Carlton departs at 6.75.
  // Want to allow pickup but not AM North
  if (product.prodNick === 'fic') {

    if (route.RouteDepart === 'Carlton') {
      Object.assign(overrides, { readyTime: 9 })
    }

    else if (['cpr', 'field'].includes(location.locNick)) {
      Object.assign(overrides, { readyTime: 6 })
    }

  } 

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

  foc:	 { leadTime: 2 },                  // focaccias
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