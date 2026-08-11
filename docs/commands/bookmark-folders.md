# Bookmark Folders

Bookmark commands that accept a folder parameter can identify the folder either by name or by bookmark folder ID.

## Folder name

Specify the folder name directly:

`FolderName`

Folder names containing spaces must be enclosed in double quotes:

`"Folder Name"`

Folder names are matched case-insensitively and must identify exactly one folder. If no folder with that name exists, the command fails. If more than one folder has the same name, specify the folder ID as well.

## Folder name and ID

Append the 12-character bookmark folder ID after `#`:

`FolderName#123456789012`

For folder names containing spaces:

`"Folder Name"#123456789012`

The folder ID uniquely identifies the folder and avoids ambiguity when multiple folders have the same name. When an ID is supplied, the command uses the ID to identify the folder.

## Commands

This folder syntax is used by:

* [Bookmark to Target Folder](bookmark-to-target-folder.md)
* [Bookmark to New Folder](bookmark-to-new-folder.md)
* [Move to Target Folder](move-to-target-folder.md)
* [Move to New Folder](move-to-new-folder.md)
