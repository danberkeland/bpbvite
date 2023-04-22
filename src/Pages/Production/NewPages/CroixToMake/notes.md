# Products

Product counts are filtered out of product and order data according
to several filter conditions, but in the end our counts depend on 
about a dozen total frozen/baked croissant varieties.

Tracking current/projected inventory requires tracking 3 kinds of data:

- current stock for 'today'
- the number of croissants shaped 'today'
- the expected number of croissants to be 'consumed/pulled'

The first two are manual entered values & relatively easy to 
look up as attributes of a certain product.

Counting consumption is more involved. Shaped croissant stock is reduced
by two things: 
  - set out for baking.
  - frozen deliveries.

While it is true that these are the actual sources of consumption, a more
nuanced reading would be...

  Since we are counting freezer stock at prado, where all croissant shaping
  happens, we can count consumption as...

  - frozen deliveries from prado 'today'
  - Setout at prado 'today'
  - croissants being sent north in the morning 'today'
  
  I think this will produce the most accurate count, and since the last one
  is already required for the north lists, it's worth figuring out

## setout at prado 'today' 
Setout counts are derived from 'production orders' which combines standing 
and holding orders (according to override rules not explained here), along
with holding orders.

An order is 'fulfilled from Prado' if it a SLO pickup or if it is delivered
on a route that starts from Prado.

Frozen deliveries from prado can be counted by filtering T+0 orders to those
fulfilled from Prado, for the appropriate frozen croissant product.

setout at prado can be (mostly!) counted by filtering T+1 orders to those 
fulfilled from Prado, for the appropriate baked croissant products.

  The remaining setout total is a count of plain croix that will be
  consumed as fral/al orders fulfilled at some future date, depending on
  the product and the nature of fulfillment. We'll enumerate those cases
  here:

  - fral orders have a 2 day lead for all modes of fulfillment, so we count
    all T+2 fral orders for setout at prado

  - al orders fulfilled from prado need 2 days, we can get counts by filtering
    on T+2 orders.

  - al orders fulfilled from the carlton need 3 days (1 extra day for transit),
    so we can get counts by filtering on T+3 orders.

## frozen deliveries from prado 'today'
The simplest calculation. All frozen deliveries are consumed the day of delivery,
so we can filter T+0 orders to those fulfilled from Prado, for the appropriate
frozen croissant products.

## frozen croix going north
This is the more complex replacement for 'north setout'. 

  - frozen croissant orders fulfilled from the Carlton
  - baked tomorrow @ Carlton



        // Create Frozens needed North { prod, qty }
      let currentFreezerNumbers = this.getCurrentFreezerNumbers(
        delivDate,
        database
      );
      console.log("currentFreezerNumbers", currentFreezerNumbers);
      let frozensLeavingCarlton = this.getFrozensLeavingCarlton(
        delivDate,
        database
      );
      console.log("frozensLeavingCarlton", frozensLeavingCarlton);
      let bakedTomorrowAtCarlton = this.getBakedTomorrowAtCarlton(
        delivDate,
        database
      );
      console.log("bakedTomorrowAtCarlton", bakedTomorrowAtCarlton);
      let currentFrozenNeed = addTwoGrids(
        frozensLeavingCarlton,
        bakedTomorrowAtCarlton