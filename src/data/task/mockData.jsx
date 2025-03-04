const processData = [
  // target product    item produced               task type       need to duplicate 
  //                   by task step                                for each floor
  { prodNick: "bag",   stepMaterial: "bag",        type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "bag",   stepMaterial: "bagps114",   type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "bag",   stepMaterial: "bagdgh",     type: "mix",    floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rbag",  stepMaterial: "rbag",       type: "sleeve", floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rbag",  stepMaterial: "bag",        type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rbag",  stepMaterial: "bagps114",   type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rbag",  stepMaterial: "bagdgh",     type: "mix",    floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { prodNick: "bcwal", stepMaterial: "bcwal",      type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "bcwal", stepMaterial: "bcwalps150", type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "bcwal", stepMaterial: "bcwaldgh",   type: "mix",    floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { prodNick: "dbag",  stepMaterial: "dbag",       type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "dbag",  stepMaterial: "bagps050",   type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "dbag",  stepMaterial: "bcwaldgh",   type: "mix",    floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { prodNick: "epi",   stepMaterial: "epi",        type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "epi",   stepMaterial: "bagps114",   type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "epi",   stepMaterial: "bagdgh",     type: "mix",    floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { prodNick: "oli",   stepMaterial: "oli",        type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "oli",   stepMaterial: "olips150",   type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "oli",   stepMaterial: "olidgh",     type: "mix",    floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "roli",  stepMaterial: "roli",       type: "sleeve", floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "roli",  stepMaterial: "oli",        type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "roli",  stepMaterial: "olips150",   type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "roli",  stepMaterial: "olidgh",     type: "mix",    floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { prodNick: "lev",   stepMaterial: "lev",        type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "lev",   stepMaterial: "levps150",   type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "lev",   stepMaterial: "levdgh",     type: "mix",    floor: "Carlton", daysBeforeEnd: 2, validDays: [1, 1, 1, 1, 1, 1, 1] },
  
  { prodNick: "rlev",  stepMaterial: "rlev",       type: "sleeve", floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rlev",  stepMaterial: "lev",        type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rlev",  stepMaterial: "levps150",   type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rlev",  stepMaterial: "levdgh",     type: "mix",    floor: "Carlton", daysBeforeEnd: 2, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { prodNick: "lglv",  stepMaterial: "lglv",       type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "lglv",  stepMaterial: "bagps250",   type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "lglv",  stepMaterial: "bagdgh",     type: "mix",    floor: "Carlton", daysBeforeEnd: 2, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { prodNick: "mlti",  stepMaterial: "mlti",       type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "mlti",  stepMaterial: "mltpis135",  type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "mlti",  stepMaterial: "mltidgh",    type: "mix",    floor: "Carlton", daysBeforeEnd: 2, validDays: [1, 1, 1, 1, 1, 1, 1] },
  
  { prodNick: "rmlti", stepMaterial: "rmlti",      type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rmlti", stepMaterial: "mlti",       type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rmlti", stepMaterial: "mltips135",  type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rmlti", stepMaterial: "mltidgh",    type: "mix",    floor: "Carlton", daysBeforeEnd: 2, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "lgmt",  stepMaterial: "lgmt",       type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "lgmt",  stepMaterial: "mltips250",  type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "lgmt",  stepMaterial: "mltidgh",    type: "mix",    floor: "Carlton", daysBeforeEnd: 2, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { prodNick: "bcwal", stepMaterial: "bcwal",      type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "bcwal", stepMaterial: "bcwalps150", type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "bcwal", stepMaterial: "bcwaldgh",   type: "mix",    floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { prodNick: "rye",   stepMaterial: "rye",        type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rye",   stepMaterial: "ryeps160",   type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rye",   stepMaterial: "ryedgh",     type: "mix",    floor: "Carlton", daysBeforeEnd: 2, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rrye",  stepMaterial: "rrye",       type: "sleeve", floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rrye",  stepMaterial: "rye",        type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rrye",  stepMaterial: "ryeps160",   type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "rrye",  stepMaterial: "ryedgh",     type: "mix",    floor: "Carlton", daysBeforeEnd: 2, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "lgry",  stepMaterial: "rye",        type: "bake",   floor: "Carlton", daysBeforeEnd: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "lgry",  stepMaterial: "ryeps250",   type: "shape",  floor: "Carlton", daysBeforeEnd: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { prodNick: "lgry",  stepMaterial: "ryedgh",     type: "mix",    floor: "Carlton", daysBeforeEnd: 2, validDays: [1, 1, 1, 1, 1, 1, 1] },

]