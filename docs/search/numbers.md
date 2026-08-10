# Searching for number values

You can filter number values (index and visits field qualifiers) using:

- first/last N item(s) parameter
- single number value parameter (can be prefixed by `>`, `>=`, `<` or `<=`)
- range (between) parameter

`t index:last20` shows last 20 tabs in tabstrip.

`h visits:first10` shows 10 most visited websites.

`b folder:test index:first5` shows first 5 bookmarks in folder whose name contains "test".

`t index:5` shows fifth tab in tabstrip.

`t index:>=5` shows all tabs in tabstrip except for first 4.

`t index:>5` shows all tabs in tabstrip except for first 5.

`h visits:<=5` shows websites opened up to 5 times.

`h visits:<5` shows websites opened up to 4 times.

`b folder:test index:2..15` shows bookmarks with index between 2 and 15 in folder whose name contains "test".

See [Search](../search.md) for the complete search syntax reference.
