# Excluding results

Prefix word, multiple-word phrase, starting anchor, AND or OR group or field qualifiers name, url and folder with `-` (hyphen) to remove items from your results.

`t -firefox` shows tabs whose name or URL does NOT contain "firefox".

`h -"universal browser manager"` shows history items whose name or URL does NOT contain multiple-word phrase "universal browser manager".

`t -["universal browser manager"` shows tabs whose name or URL does NOT START with multiple-word phrase "universal browser manager".

`tc -{universal browser manager}` shows closed tabs whose name or URL does NOT contain "universal" OR "browser" OR "manager".

`b -url:firefox` shows bookmarks whose URL does NOT contain "firefox".

`h -name:(universal browser manager)` shows history items whose name does NOT contain "universal" AND "browser" AND "manager" at same time.

`t -folder:test` shows tabs which are NOT bookmarked in folders whose name contains "test".

See [Search](../search.md) for the complete search syntax reference.
