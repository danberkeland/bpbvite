


# Data Hook Strategy
Our report summarizes order data for specific products (baked pastries). Each 
setout total comes from a subset of prod orders, and with the exception of 
orders for locNick 'backporch', these subsets are mutually exclusive.

Using groupBy or using filters that partition our prod-order set in an easy to
understand way will make the code much easier to reason about.

# Legacy Filters

We'll try decoding filter tests into plain english to see if we can build a more intuitive filter ruleset. 

## 1 Non-Almond Croix

### 1.1 Orders for non-almond croissants

This is the setout list consisting of non-almond croissants.

Prado setout for non-almond croissants come from any T+1 orders whose assigned route is 'Pick up SLO' or departs from 'Prado'.

Carlton setout for non-croix croissants come from any T+1 orders whose assigned route is 'Pick up Carlton' or departs from 'Carlton'.

Note: I belive, at least with our current setup, specifying the pick up
locations is redundant/unnecessary, since those orders will already be assigned
'Pick up SLO' or 'Pick up Carlton', and those routes have the appropriate
RouteDepart value.

export const setOutFilter = (ord, loc) => {
  
  let specialCheck
  if (loc==="Prado"){
    specialCheck = "Pick up SLO"
  }
  if (loc==="Carlton"){
    specialCheck = "Pick up Carlton"
  }
  return (
    (
      ord.routeDepart === loc 
      || ord.route === specialCheck 
      || ord.custName === "Back Porch Bakery"
    ) 
    && ord.custName !== "BPB Extras" 
    && ord.packGroup === "baked pastries" 
    && ord.prodNick !== "al" 
    && ord.doughType === "Croissant"
  );
};

### 1.2 T+2 Almond Orders (adds to BPBS Plain)

Filter is applied to T+2 orders. Here we see the 'Special Check' omitted, which
corroborates the aboce claim that the special check is unnecessary.

Despite the suggestive code, I think this filter is only effectivly applied
when we're adding up our plain croix setout, in which case loc === 'Prado'.

That is, together with filter #4. below, we aim to say that we should set out
plains to cover T+2 almond orders fulfilled from Prado, and to cover T+3
almond orders fulfilled from the Carlton.


export const setOutPlainsForAlmondsFilter = (ord,loc) => {
  return (
    (
      ord.routeDepart === loc 
      || ord.custName === "Back Porch Bakery"
    ) 
    && ord.custName !== "BPB Extras" 
    && ord.prodNick === "al"
  );
}


### 1.3 T+2 Frozen Almonds (adds to BPBS Plain)

Curiously no location condition is included in the filter function. Pretty sure
The intent here is to add the qty to the plain croissant setout total, and this
is counted only for BPBS.

export const twoDayFrozenFilter = (ord, loc) => {
  return (
    (ord.prodNick === "fral") &&
    ord.custName !== "BPB Extras"
  );
};

### 1.4 T+3 Almonds (adds to BPBS Plain)

This one is again independent of the passed loc value, and filters explicity
to orders fulfilled from the Carlton.

export const threeDayAlFilter = (ord, loc) => {
  return (
    (ord.routeDepart === "Carlton" || ord.route ==="Pick up Carlton") &&
    ord.prodNick === "al" &&
    ord.custName !== "BPB Extras"
  );
};

### 1.5 Summary:

Setout for non-almond croix can be derived from orders as follows:

Filter all orders to products with doughNick === 'Croissant', excluding orders
for bpbExtras. From there...

BPBN Setout:
* T+1 orders for baked pastries except al, with fulfillment out of the Carlton
* Half qty of any order for 'backporch' for T+1

BPBS Setout:
* T+1 orders for baked pastries except al, with fulfillment out of Prado
* Half qty of any order for 'backporch' for T+1
* Add T+2 orders for fral to pl total
* Add T+2 orders for al fulfilled from Prado to pl total
* Add T+3 forders for al fulfilled from the Carlton to pl total






## 2 Almond Setout

### 2.1 T+1 Frozen Almond

Pretty straightforward filter. Used for... ??? 
(Assuming it's for BBPS prep only... but counted where?)

export const frozenAlmondFilter = (ord, loc) => {
  return ord.prodNick === "fral";
};

### 2.2 T+1 Baked Almond

Location specific sum. In the usual fashion we separate by where orders are
fulfilled from. I think these are the almonds to be readied for baking the
next morning at each location... but this may be BPBS only. (see 2.3 below)

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

### 2.3 T+2 Almond, North orders only

Same almondPrepFilter as above, but for T+2 orders only, and only gets applied
to 'Carlton', regardless of the report location.

