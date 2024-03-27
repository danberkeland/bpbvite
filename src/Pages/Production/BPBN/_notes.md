# BPBN Directory


## Files in This Directory

### .jsx Files
.jsx files prefixed with 'Page' are components that get called by react router.
Files prefixed with 'Component' are components used within a page component.

### 'use' Files
Files with names prefixed with 'use' correspond to a page (.jsx) file. They 
house data hooks that handle fetching/caching data, and calling data functions
(described below) to return actual transformed data.

### 'data' Files
Files with names prefixed with 'data' house pure functions that transform
raw, fetched data or semi-processed data into data suitable for page rendering
and pdf exporting.

### 'export' Files
Files with names prefixed with 'export' correspond to a page (.jsx) file. They 
house functions that use jsPDF to render and save page data to printable pdf 
files.



## Data Queries: General Notes

Production lists are mostly just a puzzle of finding all relevant orders,
plus a bit of aggregation.

We have indexing attributes like doughNick and packGroup to help us
filter to the correct products, but the tricker part is what we might call
"temporal filtering" -- knowing which delivDates are appropriate to
include, which is a **non-constant** number of days in the future. Timing 
varies by the production process, but also by the assigned delivery route 
which implies some schedule of production tasks (which itself is non-constant
due to some rare edge cases -- e.g. holidays). These calculations bring the
real insight as to how real-world activities should be orchestrated.

To reiterate, the data we ultimately produce for the pages here rests on data
that is itself the result of some other client-side application/business logic 
(the route assignment logic). This puts our data here on a more unstable
foundation as we may decide to reimplement that logic (there is certainly room 
for improvement). We can minimize the difficulty of future changes by keeping
our use of these routing calculations sequestered to one place.



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



