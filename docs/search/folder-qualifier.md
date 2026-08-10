# Folder qualifier

`b folder:firefox` shows bookmarks whose parent folder name contains firefox.

`b folder:"test"#LaNdBdPOc8xT` shows bookmarks whose parent folder id is LaNdBdPOc8xT. Using folder id is necessary if two or more folders of the same name are created. You may want to select folder from [Bookmark Folders drop-down list](https://i.imgur.com/O4zpPf9.png) in this case.

`b folder:{["universal browser manager" "test"#LaNdBdPOc8xT "Firefox"#61TNj_DI0OVW}` shows bookmarks whose parent folder name starts with multiple-word phrase "universal browser manager" OR whose parent folder id is LaNdBdPOc8xT OR 61TNj_DI0OVW.

`t folder:"test"#LaNdBdPOc8xT` shows tabs which are bookmarked in folder with id LaNdBdPOc8xT.

`t folder:[]` shows tabs which are NOT bookmarked in any folder.

See [Search](../search.md) for the complete search syntax reference.
