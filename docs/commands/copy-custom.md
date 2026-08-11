# Copy Custom

Keyword: `cc`  
Requires parameters: Yes  
GUI available: No  

Specify keyword (`cc`) and single or multiple column names surrounded by percentage signs (e.g. `%url%`). Then type (optionally) any characters before, between or after surrounded column names. And execute command to replace surrounded names by respective values of selected items and copy result to clipboard.

Specify `%path%` to export full path of bookmark.

All surrounded names can be used in any order or even multiple times. You can also abbreviate them. Therefore feel free to use `%u%` or `%ur%` instead of `%url%`.

So if you execute command `cc <a href="%url%">%name%</a>`, respective hyperlinks will be copied to clipboard (if both columns are available).
