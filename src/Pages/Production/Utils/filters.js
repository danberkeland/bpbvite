export const allOrdersFilter = (ord, loc) => {
    return (
      ord.packGroup === "rustic breads" ||
      (ord.packGroup === "retail" && ord.where.includes(loc)) ||
      (ord.routeDepart === "Carlton" &&
        ord.packGroup === "baked pastries" &&
        ord.doughType !== "Croissant") ||
      ord.doughType === "Ciabatta"
    );
  };
  
  export const DayOneFilter = (ord, loc) => {
    return (
      ord.where.includes("Carlton") &&
      (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
      ((ord.routeStart >= 8 && ord.routeDepart === "Prado") ||
        ord.routeDepart === "Carlton" ||
        ord.route === "Pick up Carlton" ||
        ord.route === "Pick up SLO")
    );
  };
  
  export const DayTwoFilter = (ord, loc) => {
    return (
      ord.where.includes("Carlton") &&
      (ord.packGroup === "rustic breads" || ord.packGroup === "retail") &&
      ord.routeStart < 8 &&
      ord.routeDepart === "Prado"
    );
  };
  
  export const baguette = (ord, loc) => {
    return ord.mixedWhere === loc && ord.doughName === "Baguette";
  };
  
  export const bag = (ord, loc) => {
    return ord.mixedWhere === loc;
  };
  
  export const noBaguette = (ord, loc) => {
    return ord.mixedWhere === loc && ord.doughName !== "Baguette";
  };
  
  export const pocketFilterToday = (ord, loc) => {
    return ord.doughType === "French" && ord.when<15;
  };
  
  export const pocketFilterTwoDay = (ord, loc) => {
    return ord.doughType === "French" && ord.when>=15;
  };
  
  export const whatToMakeFilter = (ord, loc) => {
    return (
      ord.where.includes("Carlton") &&
      (ord.packGroup === "rustic breads" || ord.packGroup === "retail")
    );
  };
  
  export const baker1PocketFilter = (ord, loc) => {
    return ord.doughType === "Baguette";
  };
  
  export const setOutFilter = (ord, loc) => {
    
    let specialCheck
    if (loc==="Prado"){
      specialCheck = "Pick up SLO"
    }
    if (loc==="Carlton"){
      specialCheck = "Pick up Carlton"
    }
    return (
      (ord.routeDepart === loc || ord.route === specialCheck || ord.custName === "Back Porch Bakery") &&
      ord.custName !== "BPB Extras" &&
      ord.packGroup === "baked pastries" &&
      ord.prodNick !== "al" &&
      ord.doughType === "Croissant"
    );
  };
  
  export const setOutPlainsForAlmondsFilter = (ord,loc) => {
    return (
      (ord.routeDepart === loc || ord.custName === "Back Porch Bakery") &&
      ord.custName !== "BPB Extras" &&
      ord.prodNick === "al"
    );
  }
  
  export const twoDayFrozenFilter = (ord, loc) => {
    return (
      (ord.prodNick === "fral") &&
      ord.custName !== "BPB Extras"
    );
  };
  
  export const threeDayAlFilter = (ord, loc) => {
    return (
      (ord.routeDepart === "Carlton" || ord.route ==="Pick up Carlton") &&
      ord.prodNick === "al" &&
      ord.custName !== "BPB Extras"
    );
  };
  
  export const pastryPrepFilter = (ord, loc) => {
    return (
      (ord.where.includes(loc) &&
        ord.packGroup === "baked pastries" &&
        ord.doughType !== "Croissant") ||
      (ord.where.includes("Mixed") &&
      (ord.routeDepart === loc || ord.route === "Pick up SLO") &&
        ord.packGroup === "baked pastries" &&
        ord.doughType !== "Croissant")
    );
  };
  
  export const almondPrepFilter = (ord, loc) => {
    let specialCheck
    if (loc==="Prado"){
      specialCheck = "Pick up SLO"
    }
    if (loc==="Carlton"){
      specialCheck = "Pick up Carlton"
    }
    return (
      ord.prodNick === "al" &&
      (ord.routeDepart === loc ||
        ord.custName === "Back Porch Bakery" ||
        ord.route === specialCheck ) &&
      ord.custName !== "BPB Extras"
    );
  };
  
  export const almondFridgePrepFilter = (ord, loc) => {
    return ord.prodNick === "al" && ord.routeDepart === "Prado";
  };
  
  export const frozenAlmondFilter = (ord, loc) => {
    return ord.prodNick === "fral";
  };
  
  export const whatToPrepFilter = (ord, loc) => {
    return (
      ((ord.where.includes("Carlton") || ord.where.includes("Mixed")) &&
      ord.packGroup !== "rustic breads" &&
      ord.doughType !== "Croissant" &&
      ord.packGroup !== "retail" &&
      ord.packGroup !== "cafe menu" &&
      (ord.routeDepart === "Carlton" || ord.route === "Pick up Carlton") &&
      ord.when < 14) ||
      ((ord.where.includes("Carlton"))&&
      ord.packGroup !== "rustic breads" &&
      ord.doughType !== "Croissant" &&
      ord.packGroup !== "retail" &&
      ord.packGroup !== "cafe menu" &&
      ord.when < 14)
    );
  };
  
  export const whatToPrepTomFilter = (ord, loc) => {
    return (
      ((ord.where.includes("Carlton") || ord.where.includes("Mixed")) &&
      ord.packGroup !== "rustic breads" &&
      ord.doughType !== "Croissant" &&
      ord.packGroup !== "retail" &&
      (ord.routeDepart === "Carlton" || ord.route === "Pick up Carlton") &&
      ord.when > 14) ||
      ((ord.where.includes("Carlton")) &&
      ord.packGroup !== "rustic breads" &&
      ord.doughType !== "Croissant" &&
      ord.packGroup !== "retail" &&
      ord.when > 14)
    );
  };
  