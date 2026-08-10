# Searching for dates

You can filter dates (added, closed and opened field qualifiers) using:

- first/last N item(s) parameter
- N minute(s), hour(s), day(s) or week(s) parameter
- today, yesterday, week, month or quarter parameter
- single date parameter (can be prefixed by `>`, `>=`, `<` or `<=`)
- range (between) parameter

`b added:last10` shows 10 last added bookmarks.

`t accessed:last10` shows 10 last accessed (i.e. activated or focused) tabs.

`h opened:last1` shows last opened website.

`tc closed:last400` shows 400 last closed tabs.

`t accessed:45minutes` shows tabs accessed in last 45 minutes.

`tc closed:20minutes` shows tabs closed in last 20 minutes.

`h opened:1hour` shows websites opened in last 1 hour.

`b added:1day` shows bookmarks added in last 1 day.

`h opened:2weeks` shows websites opened in last 2 weeks.

`t accessed:today` shows tabs accessed today (from 0:00:00 to 23:59:59).

`h opened:today` shows websites opened today (from 0:00:00 to 23:59:59).

`tc closed:yesterday` shows tabs closed yesterday (from 0:00:00 to 23:59:59).

`b added:week` shows bookmarks added this calendar week.

`h opened:month` shows websites opened this calendar month.

`h opened:quarter` shows websites opened this calendar quarter.

`b added:2017-1-1` shows bookmarks added on January 1, 2017.

`h opened:>=2017-1-1` shows websites opened on or after January 1, 2017.

`h opened:>2017-1-1` shows websites opened after January 1, 2017.

`h opened:<=2017-1-1` shows websites opened on or before January 1, 2017.

`h opened:<2017-1-1` shows websites opened before January 1, 2017.

`b added:2017-1-1..2017-12-31` shows bookmarks added in 2017.

See [Search](../search.md) for the complete search syntax reference.
