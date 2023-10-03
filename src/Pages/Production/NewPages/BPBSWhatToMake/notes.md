# BPBS What To Make

Rules for calculating totals



## Baguette Prodicton

Baguettes get baked down south on Friday and Saturday. This implies the mix
hapens Thurs and Fri, and the Buckets are prepped Wed and Thurs.



## Pockets North

### Which Products?
The original filter goes like this:

'''
prod.bakedWhere.includes("Mixed") &&
Number(prod.readyTime) < 15 &&
prod.packGroup !== "frozen pastries" &&
prod.packGroup !== "baked pastries" &&
prod.freezerThaw !== true;
'''

...but we only make one kind of pocket down south (french), so I'm pretty sure
we can simplify this to items baked at both locations and made from French
dough

### Which Orders?

Original Filter Expression:
'''
prod.bakedWhere.includes("Mixed") &&
Number(prod.readyTime) < 15 &&
prod.packGroup !== "frozen pastries" &&
prod.packGroup !== "baked pastries" &&
prod.freezerThaw !== true;
'''
additionally, filter to atownpick orders

## Make Fresh

### Which Products?

Original Filter Expression:
'''
!prod.bakedWhere.includes("Carlton") &&
Number(prod.readyTime) < 15 &&
prod.packGroup !== "frozen pastries" &&
prod.packGroup !== "baked pastries";
'''

The products this catches are all french or pretzel types. I think we can
omit the pretzels since they're counted in their own section. Maybe we can
simplify again by just specifying products that use french dough.

### Which Orders?

To my best real world understanding, we are looking at orders for the current
day (not holding orders) that can be baked and delivered same day, and orders 
for the next day that cannot be baked and delivered the same day.

New routing functions will return a flag on orders to distinguish the two.

## Make for Shelf

Remember to include the bakeExtra amount!

Bake Requirements are derived from 4 main sources:
  * T0 Orders (no holding orders)
  * T1 Production Orders (includes holding orders)
  * bakeExtras
  * currentStock (our inventory)

We tally from these sources along products with the same forBake value.

We track 2 types of requirements:

Today Only: just the T0 orders
Today and Tomorrow: T0 Orders, T1 Production Orders, and BakeExtra

currentStock is subtracted from the Today Only requirement. If there's anything
leftover (if the difference is positive), then that is counted as 'need early'

Similarly, currentStock gets subtracted from the Today+Tomorrow requirement.
The left over requirement is part of the bake total

Order Requirement = Min( (T0 orders + T1 orders) - currentStock, 0 )

BakeExtra on each forBake should be the sum of bakeExtras for all products with
the same bakeExtra

After taking the sum of orders and bakeExtra, round the total to the next
largest batchSize.



## Make for Freezer


## Thoughts

The fresh/shelf/freezer distinction doesn't seem that useful to me. I think
people learn pretty well what happens to the bread after it's baked. Besides,
we defy these discriptions all the time, leaving lgbz and bri out of the shelf,
and bagging dutch sticks.

I could see a more useful report grouping items by dough type, or by the
timing of the bake.