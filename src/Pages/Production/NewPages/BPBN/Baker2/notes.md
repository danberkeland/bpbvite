# About 

## Info Rendered

This page shows rustics to be for tomorrows bake. Indeed, the totals are an
aggregation of orders to be baked tomorrow. This includes...

  - Orders for tomorrow that can be baked and delivered the same day 
  - Orders for 2 days ahead that need to be baked, then delivered next day.

## Functions

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