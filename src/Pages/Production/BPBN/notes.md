

## BPBN Baker2

### Info Rendered

This page shows rustics to be for tomorrows bake. Indeed, the totals are an
aggregation of orders to be baked tomorrow. This includes...

  - Orders for tomorrow that can be baked and delivered the same day 
  - Orders for 2 days ahead that need to be baked, then delivered next day.

### Functions

The table info can be saved in pdf format.

Simultaneously, the export routine will submit the displayed quantities to the
database, saving those values under certain product's prepreshaped values.

Each table row is an aggregation of possibly a couple different products that
have the same 'forBake' name. Prepreshaped values are saved to only one of these
products, which we call the 'product representative'.  The rule for selecting
the product representative is to sort by prodName, then take the first product.

Legacy code submitted similar updates to croix type products with BPBN setout
numbers.  As far as I can tell this serves no function, so it is currently
omitted in the new version.



## Data: General Notes

Production lists are mostly just a puzzle of finding all relevant orders,
plus a bit of aggregation.

We have indexing attributes like doughNick and packGroup to help us
filter to the correct products, but the tricker part is what we might call
"temporal filtering" -- knowing which delivDates are appropriate to
include.

Depending on the process, the delivDate we are looking for will be some 
**non-constant** number of days in the future. Timing will vary by the assigned
route, which itself is a calculated value (as opposed to one written to a 
database field).

We hope to build some routing infrastructure into the DB so that scheduling
is something we can declare explicitly for each order, but for now we have
to put that business logic in the data processing functions.

Remember that logic in these data-processing functions that depends on
client-side derived values are relatively volatile. Try to design those parts
of the code to be more interchangeable as they rest on more unstable ground.