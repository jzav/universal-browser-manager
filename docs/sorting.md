# Sorting

Default sort order depends on primary qualifier. Primary qualifier is first field qualifier in query that is not prefixed by `-` (hyphen).

Tabs mode sorts results by:

- column Accessed in descending order if accessed is primary qualifier
- column Index in ascending order otherwise

Closed Tabs mode sorts results by:

- column Closed in descending order no matter the qualifier

Bookmarks mode sorts results by:

- columns Folder (1) and Index (2) both in ascending order if folder is primary qualifier
- column Name in ascending order if name or url is primary qualifier
- column Added in descending order if added is primary qualifier or if there is no filter at all

History mode sorts results by:

- column Visits in descending order if visits is primary qualifier
- column Opened in descending order otherwise

Default sort indicator is located in bottom right corner of status bar:

- indicator text is crossed out if current sort order differs from default
- click indicator (or press Alt+S when any column cell is focused) to reset sort order back to default

Click column header to change default sort order. The sort order is ascending -> descending for most columns and descending -> ascending for columns Accessed, Added, Closed, Modified, Opened and Visits.

You can also focus any column cell and press Alt + A to sort results by that column in ascending order or Alt + D in descending order.

Current sort order indicator is always present in grid header row (if applicable).

Hold Shift while clicking columns to sort by multiple columns.

Sort order always takes into account accented characters.
