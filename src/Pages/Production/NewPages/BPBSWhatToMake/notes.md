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

# data.js

the whatToMake data hook calls a more basic production hook that returns
a full set of routed orders. We may eventually hit the limit on that, and we
can address that by using query by index (codegen-ing the index/query if need
be).

Data Transformation works as follows:

## Setting up the Table rows

Tables can be first divided into 4 main types: fresh, shelf, freezer, and 
pretzel. the pocket north table can be thought of as a subset of the fresh
table, and we can separate those later on.

Each table has static rows that correspond 'pretty much' to product forBakes.
There is one exception: frfr has a different forBake than fr & rfr, but we want
to count them together on the table. So, we will assign each order & product
a 'rowKey', which is just the product's forBake, but with this exception
handled.

We get the rowKey list from product data because we need to generate the full
list every time, even if there happens to be no orders for a given row.

We want our list to have 1 product of each rowKey type, so we need to pick a
'representative' product for each type. We can choose that representative 
consistently by sorting the product list by prodName, then taking the 
first-occurring product of each type. Doing so gives us products that hold
currentStock data, for cases where that is needed.

We should probably omit frfr from the list in this process, since we don't want
the forBake 'High French' to show up in our rows, and we don't want frfr to
somehow end up as the product representative (sorting should take care of it,
but who knows, the names could change?)

Note, lodash's uniqBy takes the first-occurring item in each category, so it
works for our needs.

## Setting up Order Data

### Setting up Order Rows
our big data object can be filtered down to just T0 to T2 data, making
subsequent filter/map operations quicker.

We can use a similar process as with the product list:  group orders into list 
types, then group the data belonging to each list type into rows by rowKey.

### north pockets

At this point we can separate out the north pocket data. We can copy the
subset of rows from the fresh list, then actually separate the fresh order
data into separate 'send pockets north' and 'bake fresh' parts

## Combining order rows with product rows

Our product list serves as a skeleton that we can attach related order data to,
matching them up by rowKey.

## setting up columns

Grouping row data into separate columns is a more complicated task. Tables will
need to be handled differently.

