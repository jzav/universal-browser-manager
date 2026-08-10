# Commands

Right click anywhere inside grid and select command from context menu. You can also press Ctrl + Alt + Down, Ctrl + Down or Alt + End to delete command box and type command. Then press Enter or click [Execute Command Button](https://i.imgur.com/P3u0mmq.png).

Press Alt + Down to just focus command box without clearing its content.

Commands which require additional explanation:

## Copy Custom

Specify keyword (`cc`) and single or multiple column names surrounded by percentage signs (e.g. `%url%`). Then type (optionally) any characters before, between or after surrounded column names. And execute command to replace surrounded names by respective values of selected items and copy result to clipboard.

Specify `%path%` to export full path of bookmark.

All surrounded names can be used in any order or even multiple times. You can also abbreviate them. Therefore feel free to use `%u%` or `%ur%` instead of `%url%`.

So if you execute command `cc <a href="%url%">%name%</a>`, respective hyperlinks will be copied to clipboard (if both columns are available).
