/*
  This strategy models tasks/steps as edges of a network/graph (directed, acyclic graph)
  
  More compact, but more difficult to reason about,
  especially without some infrastructure in place already.  
  Requires graph traversal to built the production plan.

  Compactness becomes significant as the previous strategy grows exponentially
  with each additional variation. Our processes tend to be very uniform.
  Either strategy could work well.

  "daysAfterPrev" is a pretty inflexible hedge towards simplicity.
  Works ok in the 'usual' case, but runs into problems if we want to
  override the usual schedule.


  A strategy for keeping things simple is to only model tasks 
  that show up on a production list or that produce an
  item that gets held in storage overnight. 
  ex: scaling baguette buckets is a task, but scaling rye ingredients is not.
*/



const processData2 = [
  { target: "rbag",     source: "bag",        type: "sleeve", floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "bag",      source: "bagps114",   type: "bake",   floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "bagps114", source: "bagdgh",     type: "shape",  floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "bagdgh",   source: "bagbkt",     type: "mix",    floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "bagbkt",   source: "_none",      type: "scale",  floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { target: "bcwal",    source: "bcwal",      type: "bake",   floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "bcwal",    source: "bcwalps150", type: "shape",  floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "bcwaldgh", source: "bagdgh",     type: "add",    floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { target: "dbag",     source: "bagps050",   type: "bake",   floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "bagps050", source: "bagdgh",     type: "shape",  floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { target: "epi",      source: "epi",        type: "bake",   floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "epi",      source: "bagps114",   type: "shape",  floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { target: "roli",     source: "oli",      type: "sleeve", floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "oli",      source: "olips150", type: "bake",   floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "olips150", source: "olidgh",   type: "shape",  floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "olidgh",   source: "bagdgh",   type: "add",    floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { target: "rlev",     source: "lev",      type: "sleeve", floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "lev",      source: "levps150", type: "bake",   floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "levps150", source: "levdgh",   type: "shape",  floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "levdgh",   source: "_none",    type: "mix",    floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { target: "lglv",     source: "lglv",     type: "bake",   floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "bagps250", source: "bagdgh",   type: "shape",  floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  
  { target: "rmlti",     source: "mlti",      type: "bake",   floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "mlti",      source: "mltips135", type: "bake",   floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "lgmt",      source: "mltips250", type: "bake",   floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "mltips135", source: "mltidgh",   type: "shape",  floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "mltips250", source: "mltidgh",   type: "shape",  floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "mltidgh",   source: "_none",     type: "mix",    floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { target: "bcwal",      source: "bcwalps150", type: "bake",   floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "bcwalps150", source: "bcwaldgh",   type: "shape",  floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "bcwaldgh",   source: "bagdgh",     type: "add",    floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },

  { target: "rrye",     source: "rye",      type: "sleeve", floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "rye",      source: "ryeps160", type: "bake",   floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "lgry",     source: "ryeps250", type: "bake",   floor: "Carlton", daysAfterPrev: 0, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "ryeps160", source: "ryedgh",   type: "shape",  floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "ryeps250", source: "ryedgh",   type: "shape",  floor: "Carlton", daysAfterPrev: 1, validDays: [1, 1, 1, 1, 1, 1, 1] },
  { target: "ryedgh",   source: "_none",    type: "mix",    floor: "Carlton", daysAfterPrev: 2, validDays: [1, 1, 1, 1, 1, 1, 1] },
  
]

