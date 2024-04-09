# Production Directory


## Folders in This Directory
"Legacy" houses files that are mostly carry-overs from the previous system.
"New Pages" houses files that can be considered a first attempt at a new system.
The contents of both folders are deprecated/obsolete, and will eventually be
replaced by the files in the Production directory.

## Files in This Directory
File names that include "BPBN" or "BPBS" apply just to that location.
File names without either can be used for production reports at both locations.

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
include. This is a **non-constant** number of days in the future. Timing 
varies by the production process, but also by the assigned delivery route 
which implies some schedule of production tasks (which itself is non-constant
due to some rare edge cases -- e.g. holidays). These calculations bring the
real insight as to how real-world activities should be orchestrated. If we
can calculate these temporal values all at once, building up production reports
becomes significantly easier.

To reiterate, the data we ultimately produce for the pages here rests on data
that is itself the result of some other client-side application/business logic 
(the route assignment logic). This puts our data here on a more unstable
foundation as we may decide to reimplement that logic (there is certainly room 
for improvement). We can minimize the difficulty of future changes by keeping
our use of these routing calculations sequestered to one place.