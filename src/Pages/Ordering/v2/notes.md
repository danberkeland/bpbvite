# PrimeReact Calendars

## selectionMode="range"
event.value is an array of length two. value[0] is the start date, value[1] is
the end date. If only 1 date is selected, value[1] will be null. Otherwise
values are JS Dates, like the ones produced in the default selection mode.

## Handling one mode vs another
If we're controlling the mode, we can predict what kind of event values will
be generated, or we can use Array.isArray() to detect.

If we want to leave the door open for date ranges, however, we should want 
other state/actions set up to deal with multiple dates. We can lay the
foundations by making sure functions take in an array of delivDates instead
of just a single one, or to split ui into cases that handle one or the other.