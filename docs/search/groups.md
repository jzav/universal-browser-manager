# Groups

## AND groups

`h (universal browser manager)` or just `h universal browser manager` shows history items whose name or URL contains "universal" AND "browser" AND "manager".

`h name:(universal browser manager)` shows history items whose name contains "universal" AND "browser" AND "manager".

## OR groups

`b {firefox add-on "universal browser manager"}` shows bookmarks whose name or URL contains "firefox" OR "add-on" OR multiple-word phrase "universal browser manager".

`b url:{firefox add-on "universal browser manager"}` shows bookmarks whose URL contains "firefox" OR "add-on" OR multiple-word phrase "universal browser manager".

Note: AND and OR groups cannot currently be nested. For example, `t (url:(github issues) {folder:work accessed:yesterday})` is not supported.

See [Search](../search.md) for the complete search syntax reference.
