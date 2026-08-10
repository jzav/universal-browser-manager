# Search

Currently available search modes are: Tabs (keyword `t`), Closed Tabs (`tc`), Bookmarks (`b`), History (`h`) and Clipboard (`c`).

You can select search mode from [Search Mode Selector](https://i.imgur.com/yitG4gU.png). Or press either Ctrl + Alt + Up or Alt + Home to clear search box and type keyword. Then press Enter or click [Execute Query Button](https://i.imgur.com/fGiY8N9.png).

Tabs mode currently lists results using columns: Name, URL, Index, Accessed and Folder. Column Folder shows all the folders respective page is bookmarked in.

Closed Tabs mode lists results using columns: Name, URL and Closed.

Bookmarks mode lists results using columns: Name (editable), URL (editable), Folder, Index and Added.

History mode lists results using columns: Name, URL, Visits and Opened.

Clipboard mode lists results using column URL. Clipboard must contain only URLs (no mixed content) and all URLs must start with http or https.

Hover over Folder column cell to see full path of bookmark (in tooltip). Hover over other cells to see whole cell text (in tooltip). Hover over (most of) other UI elements to see command name or additonal info.

## Column or cell based shortcuts and functionality

Focus any cell and start typing to activate find as you type feature. First cell in the same column whose value STARTS with typed characters will be focused. Turn on Caps Lock before you start typing to focus first cell whose value CONTAINS typed characters.

Focus any editable column cell and press F4 or Alt + E to edit its value. Then press Enter to commit changes or Esc to discard them. All these commands are also available via context menu.

Cell can be focused by clicking it our using keys/shortcuts: Alt + Left/Right, Left, Right, Up, Down, Tab and Shift + Tab. Note: see [Shortcuts](shortcuts.md) for more info.

Note: see [Selecting items](selecting-items.md) for more info on what the difference between selecting and focusing item/cell is.

## Basic searching - by name or URL

`t firefox` shows tabs whose name or URL contains "firefox".

`c firefox` shows clipboard items whose URL contains "firefox".

`h "universal browser manager"` shows history items whose name or URL contains multiple-word phrase "universal browser manager".

## Advanced searching

You can use column names as field qualifiers to filter items.

Press Alt + Up to focus search box and type field qualifier (e.g. `url:`). Pressing Ctrl + Up or clicking [respective button](https://i.imgur.com/Sa53MjJ.png) removes all filters and focus search box.

`b url:firefox`, for example, shows bookmarks whose URL contains "firefox".

`tc name:"universal browser manager"` shows closed tabs whose name contains multiple-word phrase "universal browser manager".

You can abbreviate all field qualifiers. So feel free to type `u:` or `ur:` instead of `url:`.

You can use multiple field qualifiers to filter results even more. Just separate them by space.

Search box is case-insensitive except for folder id parameter (e.g. `"test"#LaNdBdPOc8xT`).

All irrelevant spaces are ignored. 1+ spaces are considered 1 space.

Press Tab to normalize query:

- query is validated (basic validations only, complete set of validations will be performed when query is executed)
- all irrelevant spaces are removed
- abbreviated field qualifiers and parameters first, last, minute(s), hour(s), day(s), today, yesterday, week(s), month and quarter are completed (e.g. `ad:yes` is replaced by `added:yesterday`)

### Search syntax reference

- [AND and OR groups](search/groups.md)
- [Start and end anchors](search/anchors.md)
- [Folder qualifier](search/folder-qualifier.md)
- [Excluding results](search/excluding-results.md)
- [Searching for dates](search/dates.md)
- [Searching for number values](search/numbers.md)
- [Notes](search/notes.md)
