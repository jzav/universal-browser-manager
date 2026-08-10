# Notes

When surrounded by quotation marks, parentheses, braces and brackets have literal meaning: `b name:"(universal) {browser} [manager]"`.

When surrounded by quotation marks, starting hyphens and/or field qualifiers have literal meaning: `b "-name:test"`.

Brackets (start and end anchors) won’t work inside AND groups like `b url:([universal browser manager)`. Use them like this: `b url:[universal url:(browser manager)`.

End slashes can be omitted when using end anchors: filter `url:example.com]` will show both http://www.example.com and http://www.example.com/.

See [Search](../search.md) for the complete search syntax reference.
